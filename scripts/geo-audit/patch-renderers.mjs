import { readFile, writeFile } from "node:fs/promises";
const ROOT = process.cwd();
const apply = async (rel, reps) => { let c = await readFile(ROOT + rel, "utf8"); let o = c; for (const [a, b] of reps) { if (c.includes(a)) c = c.replace(a, b); else console.log("MISS", rel, JSON.stringify(a.slice(0, 50))); } if (c !== o) await writeFile(ROOT + rel, c, "utf8"); return o !== c; };
await apply("/src/pages/_shared/_EntityPillar.astro", [
  ["const { collectionName, pageTitle, pageDescription, locale, path, jsonLd } = Astro.props as Props;", "const { collectionName, pageTitle, pageDescription, locale, path, jsonLd } = Astro.props as Props;\nconst enOnlyModules = [\"evidence\", \"procurement\", \"applications\"];\nconst enOnly = enOnlyModules.includes(collectionName);"],
  ["  jsonLd={jsonLd}\n>", "  hreflangLocales={enOnly ? [\"en\"] : undefined}\n  jsonLd={jsonLd}\n>"],
]);
await apply("/src/pages/_shared/_EntityDetail.astro", [
  ["<MarketingLayout title={data.title} description={data.description} locale={locale} path={`${pillarPath}${slug}/`} jsonLd=", "<MarketingLayout title={data.title} description={data.description} locale={locale} path={`${pillarPath}${slug}/`} hreflangLocales={(collectionName === \"evidence\" || collectionName === \"applications\") ? [\"en\"] : undefined} jsonLd="],
]);
await apply("/src/pages/_shared/_ProcurementDetail.astro", [
  ["<MarketingLayout title={data.title} description={data.description} locale={locale} path={`/procurement/${slug}/`}>", "<MarketingLayout title={data.title} description={data.description} locale={locale} path={`/procurement/${slug}/`} hreflangLocales={[\"en\"]}>"],
]);
console.log("PATCH_RENDERERS_DONE");
