import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
const DIST = process.cwd() + "/dist";
const LOCALES = ["", "en", "de", "ja", "fr", "es", "pt", "it", "ko", "nl", "pl", "ru", "ar", "pt-br", "tr", "cs", "sv"];
const walk = async (dir, acc = []) => { let e; try { e = await readdir(dir, { withFileTypes: true }); } catch { return acc; } for (const x of e) { const p = join(dir, x.name); if (x.isDirectory()) await walk(p, acc); else if (x.name === "index.html") acc.push(p); } return acc; };
const txt = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/[\s]+/g, " ").trim();
const get = (html, re) => { const m = html.match(re); return m ? m[1] : ""; };
const norm = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const jaccard = (a, b) => { const sa = new Set(a), sb = new Set(b); if (!sa.size && !sb.size) return 1; let inter = 0; for (const x of sa) if (sb.has(x)) inter++; return inter / (sa.size + sb.size - inter); };
const files = await walk(join(DIST, "evidence"));
const walkBase = join(DIST, "evidence");
const rows = [];
const enCache = {}; // slug -> tokens of root en detail
for (const f of files) {
  const rel = f.slice(walkBase.length + 1).replace(/\\/g, "/"); // e.g. ti-6al-4v/ or en/ti-6al-4v/ or de/
  const seg = rel.split("/").filter(Boolean);
  const isLocale = LOCALES.slice(1).includes(seg[0]);
  const locale = isLocale ? seg[0] : "en-root";
  const slug = isLocale ? seg.slice(1).join("/") : seg.join("/");
  const html = await readFile(f, "utf8");
  const title = get(html, /<title>([\s\S]*?)<\/title>/i);
  const h1 = get(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, " ").replace(/[\s]+/g, " ").trim();
  const canonical = get(html, /rel=\"canonical\"[^>]*href=\"([^\"]+)/i) || get(html, /href=\"([^\"]+)\"[^>]*rel=\"canonical\"/i);
  const words = txt(html).split(/\s+/).filter(Boolean).length;
  const tokens = norm(txt(html));
  const refKey = slug.replace(/\/$/, "") || "index";
  if (!enCache[refKey]) enCache[refKey] = { tokens, words };
  const sim = enCache[refKey] && isLocale ? jaccard(tokens, enCache[refKey].tokens) : (isLocale ? 0 : 1);
  rows.push({ locale, route: ("/evidence/" + rel.replace("index.html", "")).replace(/\/+/g, "/"), content_file: "", title: title.trim(), h1, word_count: words, language_detected: "", translation_status: "", content_similarity_to_en: sim.toFixed(4), canonical: canonical || "", hreflang: get(html, /hreflang=/g) ? "present" : "none", indexability: "", recommended_action: "" });
}
await writeFile(process.cwd() + "/audit/p0b-evidence-raw.json", JSON.stringify(rows, null, 2));
console.log(JSON.stringify({ pages: rows.length, byLocale: rows.reduce((a, r) => { a[r.locale] = (a[r.locale] || 0) + 1; return a; }, {}), emptyHubs: rows.filter(r => r.word_count < 60).length }, null, 2));
