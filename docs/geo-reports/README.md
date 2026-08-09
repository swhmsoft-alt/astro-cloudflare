# GEO Citation Reports

> **Proxy metric disclaimer**: these reports measure whether each platform's **API
> grounding** (Perplexity Sonar / OpenAI Responses `web_search` / Gemini
> `google_search`) cites `titanium.blog`. They are **proxy trend indicators**, not
> measurements of the consumer products (Perplexity app / ChatGPT Search / Gemini
> app / AI Overviews). Model versions and indexes differ across surfaces.

## What lives here

- `snapshots/YYYY-MM-DD.ndjson` — one JSON object per prompt×engine×sample (raw,
  trend-computable).
- `YYYY-MM-DD-summary.md` — human/git-diff-friendly summary of that run.

## How it runs

`.github/workflows/geo-monitor.yml` runs weekly (Sunday 06:00 UTC) and on manual
dispatch. It invokes `scripts/geo-monitor/geo-monitor.mjs`, which reads
`scripts/geo-monitor/prompts.json` (30 evidence-bound prompts), polls each engine
N=3 times, votes `is_cited` by majority, and writes the files above. The workflow
auto-commits the new reports back to this directory.

## Local run

```bash
# Requires at least one API key in the environment:
export PERPLEXITY_API_KEY=... OPENAI_API_KEY=... GEMINI_API_KEY=...
node scripts/geo-monitor/geo-monitor.mjs
# optional tuning:
#   GEO_ENGINES=perplexity,openai,gemini
#   GEO_SAMPLES=3
```

## Reading the metrics

- **Citation SOV** — share of samples where `titanium.blog` appeared in citations.
- **Evidence Depth** — citations pointing at `/evidence/*` (a precise asset) vs
  only the homepage/category.
- **First-Source Rate** — citations ranked at position 1 in the source list.
- **Competitors** — other domains cited alongside (for gap analysis).

Use these to prioritise content iteration; do not treat absolute numbers as
user-facing ground truth.
