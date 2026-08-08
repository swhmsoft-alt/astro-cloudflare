import { readFile, writeFile } from "node:fs/promises";
const ROOT = process.cwd();
const apply = async (rel, reps) => { let c = await readFile(ROOT + rel, "utf8"); let o = c; for (const [a, b] of reps) { if (c.includes(a)) c = c.replace(a, b); else console.log("MISS", rel, JSON.stringify(a.slice(0, 40))); } if (c !== o) await writeFile(ROOT + rel, c, "utf8"); return o !== c; };
// SEO.astro
await apply("/src/components/seo/SEO.astro", [
  ["  canonical?: string;\n  article?: SEOArticle;", "  canonical?: string;\n  hreflangLocales?: string[];\n  article?: SEOArticle;"],
  ["  ogImage,\n  canonical,\n  article,\n  jsonLd,\n} = Astro.props as Props;", "  ogImage,\n  canonical,\n  hreflangLocales,\n  article,\n  jsonLd,\n} = Astro.props as Props;"],
  ["const links = hreflangLinks(path);", "const links = hreflangLinks(path, hreflangLocales);"],
]);
// MarketingLayout.astro
await apply("/src/layouts/MarketingLayout.astro", [
  ["  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;\n}", "  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;\n  hreflangLocales?: string[];\n}"],
  ["const { title, description, locale, path, jsonLd } = Astro.props as Props;", "const { title, description, locale, path, jsonLd, hreflangLocales } = Astro.props as Props;"],
  ["    jsonLd={jsonLd}\n  />", "    hreflangLocales={hreflangLocales}\n    jsonLd={jsonLd}\n  />"],
]);
console.log("PATCH_HREFLANG_DONE");
