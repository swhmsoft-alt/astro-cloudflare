const API_KEY = process.env.DEEPSEEK_API_KEY;
const BASE_URL = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/+$/, "");

const DEFAULT_MODEL = "deepseek-chat";
const DEFAULT_TEMPERATURE = 0.3;
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TIMEOUT = 90_000;
const MAX_RETRIES = 3;
const RATE_LIMIT_RPS = 5;

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const BACKOFF_DELAYS = [1000, 2000, 4000];

class ConfigurationError extends Error { constructor(m) { super(m); this.name = "ConfigurationError"; } }
class AuthenticationError extends Error { constructor(m) { super(m); this.name = "AuthenticationError"; } }
class RateLimitError extends Error { constructor(m) { super(m); this.name = "RateLimitError"; } }
class TimeoutError extends Error { constructor(m) { super(m); this.name = "TimeoutError"; } }
class APIError extends Error { constructor(m, s) { super(m); this.name = "APIError"; this.status = s; } }
class InvalidResponseError extends Error { constructor(m) { super(m); this.name = "InvalidResponseError"; } }

const bucket = { tokens: RATE_LIMIT_RPS, lastRefill: Date.now(), maxTokens: RATE_LIMIT_RPS };

function refillBucket() {
  const now = Date.now();
  const elapsed = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + elapsed * RATE_LIMIT_RPS);
  bucket.lastRefill = now;
}

async function acquireToken() {
  refillBucket();
  if (bucket.tokens >= 1) { bucket.tokens -= 1; return; }
  const wait = Math.ceil((1 / RATE_LIMIT_RPS) * 1000);
  await new Promise((r) => setTimeout(r, wait));
  return acquireToken();
}


function buildHeaders() {
  if (!API_KEY) throw new ConfigurationError("DEEPSEEK_API_KEY is not set");
  return { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };
}

function buildBody(systemPrompt, userPrompt, options) {
  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: userPrompt });
  return {
    model: options.model || DEFAULT_MODEL,
    messages,
    temperature: options.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
  };
}

async function doFetch(body, signal) {
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
    signal,
  });

  if (response.status === 401) throw new AuthenticationError("Invalid API key");
  if (response.status === 429) throw new RateLimitError("Rate limit exceeded");
  if (response.status === 400) {
    const errBody = await response.text().catch(() => "");
    throw new APIError(`Bad request: ${errBody}`, 400);
  }
  if (response.status === 403) throw new AuthenticationError("Access forbidden");
  if (response.status === 404) throw new APIError("Endpoint not found", 404);
  if (RETRYABLE_STATUSES.has(response.status)) throw new APIError(`Server error: ${response.status}`, response.status);
  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new APIError(`HTTP ${response.status}: ${errBody}`, response.status);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message || typeof data.choices[0].message.content !== "string") {
    throw new InvalidResponseError("Response missing choices[0].message.content");
  }
  return data;
}

export async function generate(options) {
  const { systemPrompt, userPrompt, temperature, maxTokens } = options || {};
  const timeoutMs = options.timeout || DEFAULT_TIMEOUT;
  const model = options.model || DEFAULT_MODEL;

  if (!userPrompt) throw new ConfigurationError("userPrompt is required");

  let lastError;
  let retryCount = 0;
  const startTime = Date.now();

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) retryCount++;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      await acquireToken();
      const body = buildBody(systemPrompt, userPrompt, { model, temperature, maxTokens });
      const data = await doFetch(body, controller.signal);
      clearTimeout(timer);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[deepseek] model=${model} elapsed=${elapsed}s tokens=${data.usage?.total_tokens || "?"} retries=${retryCount} status=ok`);

      return {
        model: data.model || model,
        usage: data.usage || null,
        finishReason: data.choices?.[0]?.finish_reason || null,
        content: data.choices[0].message.content,
      };
    } catch (err) {
      clearTimeout(timer);

      if (err.name === "AbortError") throw new TimeoutError(`Request timed out after ${timeoutMs}ms`);

      const isRetryable = RETRYABLE_STATUSES.has(err.status)
        || err.name === "RateLimitError"
        || err.message?.includes("network")
        || err.message?.includes("fetch");

      if (!isRetryable) throw err;

      lastError = err;
      if (attempt < MAX_RETRIES) {
        const delay = BACKOFF_DELAYS[attempt] || 4000;
        console.log(`[deepseek] retry ${attempt + 1}/${MAX_RETRIES} after ${delay}ms — ${err.name}: ${err.message}`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw new APIError(`Request failed after ${MAX_RETRIES} retries: ${lastError?.message}`, lastError?.status || 0);
}

export { ConfigurationError, AuthenticationError, RateLimitError, TimeoutError, APIError, InvalidResponseError };
