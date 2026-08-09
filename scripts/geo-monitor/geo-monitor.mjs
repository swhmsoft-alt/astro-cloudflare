#!/usr/bin/env node
/**
 * GEO Citation Monitor — proxy metrics for Perplexity / OpenAI / Gemini grounding.
 *
 * Reads scripts/geo-monitor/prompts.json, polls each prompt N times per engine,
 * extracts citation URLs, attributes hits to evidence entities, votes `is_cited`
 * (majority), then writes:
 *   - docs/geo-reports/snapshots/YYYY-MM-DD.ndjson   (one JSON object per sample)
 *   - docs/geo-reports/YYYY-MM-DD-summary.md          (human/git-diff friendly)
 *
 * Env:
 *   PERPLEXITY_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY  (at least one required)
 *   GEO_ENGINES = "perplexity,openai,gemini"  (subset to run)
 *   GEO_SAMPLES = 3                          (samples per prompt/engine)
 *   PERPLEXITY_MODEL / OPENAI_MODEL / GEMINI_MODEL  (optional model overrides)
 *
 * NOTE: This measures API *grounding* — a proxy trend, not the consumer products.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const PROMPTS_FILE = join(__dirname, 'prompts.json');
const REPORTS_DIR = join(ROOT, 'docs', 'geo-reports');
const SNAPSHOTS_DIR = join(REPORTS_DIR, 'snapshots');
const SITE_DOMAIN = 'titanium.blog';

const SAMPLES = parseInt(process.env.GEO_SAMPLES || '3', 10);
const DATE = new Date().toISOString().slice(0, 10);

const ENABLED = (process.env.GEO_ENGINES || 'perplexity,openai,gemini')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/** Minimal JSON POST with a hard timeout + AbortController. */
async function postJson(url, body, headers = {}, timeoutMs = 60000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : {};
  } finally {
    clearTimeout(timer);
  }
}

/** Per-engine adapter. Each `.call(prompt)` returns `{ citations: [{url,title}] }`. */
const ENGINES = {
  perplexity: {
    label: 'Perplexity (Sonar)',
    enabled: () => ENABLED.includes('perplexity') && !!process.env.PERPLEXITY_API_KEY,
    async call(prompt) {
      const res = await postJson(
        'https://api.perplexity.ai/chat/completions',
        {
          model: process.env.PERPLEXITY_MODEL || 'sonar',
          messages: [{ role: 'user', content: prompt }],
        },
        { Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}` },
      );
      return {
        citations: (res.citations || []).map((c) => ({ url: c.url, title: c.title })),
      };
    },
  },
  openai: {
    label: 'OpenAI (web search)',
    enabled: () => ENABLED.includes('openai') && !!process.env.OPENAI_API_KEY,
    async call(prompt) {
      const res = await postJson(
        'https://api.openai.com/v1/responses',
        {
          model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
          tools: [{ type: 'web_search' }],
          tool_choice: 'required',
          input: prompt,
        },
        { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      );
      const citations = [];
      for (const item of res.output || []) {
        if (item.type !== 'message') continue;
        for (const part of item.content || []) {
          if (part.type === 'citations') {
            for (const c of part.citations || []) {
              if (c && c.url) citations.push({ url: c.url, title: c.title });
            }
          }
        }
      }
      return { citations };
    },
  },
  gemini: {
    label: 'Gemini (Google Search grounding)',
    enabled: () => ENABLED.includes('gemini') && !!process.env.GEMINI_API_KEY,
    async call(prompt) {
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const res = await postJson(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
        },
        { 'x-goog-api-key': process.env.GEMINI_API_KEY },
      );
      const chunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return {
        citations: chunks.map((c) => ({ url: c.web?.uri, title: c.web?.title })),
      };
    },
  },
};

function hostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

function extractEvidenceSlug(url) {
  const m = url?.match(new RegExp(`${SITE_DOMAIN}/evidence/([^/?#]+)`));
  return m ? m[1] : null;
}

/** Turn a citation URL list into the attribution attributes. */
function analyze(citations) {
  const urls = (citations || []).map((c) => c.url).filter(Boolean);
  const idx = urls.findIndex((u) => u.includes(SITE_DOMAIN));
  const domainHit = idx !== -1;
  const evidenceDepth = domainHit && extractEvidenceSlug(urls[idx]) !== null;
  return {
    domainHit,
    evidenceDepth,
    citedUrl: domainHit ? urls[idx] : null,
    position: domainHit ? idx + 1 : -1,
    competing: [...new Set(urls.map(hostname).filter((h) => h && h !== SITE_DOMAIN))],
    totalCitations: urls.length,
  };
}

function pct(n, d) {
  return d ? `${((n / d) * 100).toFixed(1)}%` : '-';
}

/** Aggregate citation rate across ALL historical snapshots (for the trend table). */
function cumulativeTrend() {
  const agg = {};
  if (!existsSync(SNAPSHOTS_DIR)) return agg;
  for (const f of readdirSync(SNAPSHOTS_DIR).filter((x) => x.endsWith('.ndjson')).sort()) {
    for (const line of readFileSync(join(SNAPSHOTS_DIR, f), 'utf8').split('\n')) {
      if (!line.trim()) continue;
      let rec;
      try {
        rec = JSON.parse(line);
      } catch {
        continue;
      }
      agg[rec.engine] = agg[rec.engine] || { samples: 0, cited: 0 };
      agg[rec.engine].samples += 1;
      if (rec.is_cited) agg[rec.engine].cited += 1;
    }
  }
  return agg;
}

function buildSummary(rows, prompts, enabled) {
  const lines = [];
  lines.push(`# GEO Citation Monitor — ${DATE}`);
  lines.push('');
  lines.push('> **Proxy metric disclaimer**: this report measures whether each platform\'s **API grounding**');
  lines.push('> (Perplexity Sonar / OpenAI Responses `web_search` / Gemini `google_search`) cites `titanium.blog`.');
  lines.push('> It is a **proxy trend indicator**, NOT a measurement of the consumer products');
  lines.push('> (Perplexity app / ChatGPT Search / Gemini app / AI Overviews). Model versions and indexes differ.');
  lines.push('');
  lines.push('## Config');
  lines.push('');
  lines.push(`- Prompts: **${prompts.length}** (bound to evidence entities)`);
  lines.push(`- Samples per prompt/engine: **N=${SAMPLES}** (majority vote)`);
  lines.push(`- Engines: ${enabled.map(([, e]) => e.label).join(' / ')}`);
  lines.push('');
  lines.push('## Summary (this run)');
  lines.push('');
  lines.push('| Engine | Samples | Cited | Citation SOV | Evidence Depth | First-Source |');
  lines.push('|---|---|---|---|---|---|');
  for (const [key, e] of enabled) {
    const r = rows.filter((x) => x.engine === key);
    const cited = r.filter((x) => x.is_cited).length;
    const depth = r.filter((x) => x.is_cited && x.evidence_slug).length;
    const first = r.filter((x) => x.citation_position === 1).length;
    lines.push(`| ${e.label} | ${r.length} | ${cited} | ${pct(cited, r.length)} | ${depth} | ${first} |`);
  }
  lines.push('');
  lines.push('## Per-prompt detail');
  lines.push('');
  lines.push('| prompt | target | cited? (vote) | position | evidence | competitors |');
  lines.push('|---|---|---|---|---|---|');
  for (const p of prompts) {
    const r = rows.filter((x) => x.prompt_id === p.id);
    const cited = r.filter((x) => x.is_cited).length;
    const voted = cited >= Math.ceil(SAMPLES / 2);
    const best = r.find((x) => x.is_cited) || r[0];
    const comp = (best?.competing_domains || []).join(', ') || '-';
    const ev = best?.evidence_slug || '-';
    const pos = best?.citation_position ?? -1;
    lines.push(`| ${p.id} | ${p.targetEntity} | ${voted ? '✅' : '—'} (${cited}/${SAMPLES}) | ${pos > 0 ? pos : '-'} | ${ev} | ${comp} |`);
  }
  lines.push('');
  lines.push('## Cumulative trend (all snapshots)');
  lines.push('');
  const agg = cumulativeTrend();
  const keys = Object.keys(agg);
  if (keys.length) {
    lines.push('| Engine | Cumulative samples | Cumulative cited | Citation SOV |');
    lines.push('|---|---|---|---|');
    for (const k of keys) {
      lines.push(`| ${k} | ${agg[k].samples} | ${agg[k].cited} | ${pct(agg[k].cited, agg[k].samples)} |`);
    }
  } else {
    lines.push('_No historical snapshots yet._');
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const prompts = JSON.parse(readFileSync(PROMPTS_FILE, 'utf8'));
  mkdirSync(SNAPSHOTS_DIR, { recursive: true });

  const enabled = Object.entries(ENGINES).filter(([, e]) => e.enabled());
  if (enabled.length === 0) {
    console.error(
      'No engine enabled. Set at least one of PERPLEXITY_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY (see GEO_ENGINES).',
    );
    process.exit(1);
  }

  const rows = [];
  const errors = [];

  for (const promptDef of prompts) {
    for (const [engineKey, engine] of enabled) {
      for (let s = 1; s <= SAMPLES; s += 1) {
        const row = {
          tested_at: new Date().toISOString(),
          date: DATE,
          engine: engineKey,
          prompt_id: promptDef.id,
          prompt: promptDef.prompt,
          target_entity: promptDef.targetEntity,
          sample_index: s,
          is_cited: false,
          citation_position: -1,
          cited_url: null,
          evidence_slug: null,
          competing_domains: [],
          raw_citation_count: 0,
          error: null,
        };
        try {
          const { citations } = await engine.call(promptDef.prompt);
          const a = analyze(citations);
          row.is_cited = a.domainHit;
          row.citation_position = a.position;
          row.cited_url = a.citedUrl;
          row.evidence_slug = a.evidenceDepth ? extractEvidenceSlug(a.citedUrl) : null;
          row.competing_domains = a.competing;
          row.raw_citation_count = a.totalCitations;
        } catch (e) {
          row.error = String((e && e.message) || e);
          errors.push(`${engineKey}/${promptDef.id}#${s}: ${row.error}`);
        }
        rows.push(row);
      }
    }
  }

  const snapshotFile = join(SNAPSHOTS_DIR, `${DATE}.ndjson`);
  writeFileSync(snapshotFile, `${rows.map((r) => JSON.stringify(r)).join('\n')}\n`, 'utf8');

  const summaryFile = join(REPORTS_DIR, `${DATE}-summary.md`);
  writeFileSync(summaryFile, buildSummary(rows, prompts, enabled), 'utf8');

  console.log(`Wrote ${rows.length} records -> ${snapshotFile}`);
  console.log(`Wrote summary -> ${summaryFile}`);
  if (errors.length) {
    console.log(`\n${errors.length} request error(s):`);
    errors.slice(0, 20).forEach((e) => console.log(`  - ${e}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
