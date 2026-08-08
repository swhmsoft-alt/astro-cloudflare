import { readFile, writeFile } from "node:fs/promises";
const p = process.cwd() + "/src/lib/seo.ts";
let c = await readFile(p, "utf8");
const a = c.replace("export function hreflangLinks(path: string): Array<{", "export function hreflangLinks(path: string, locales?: string[]): Array<{");
const b = a.replace("  return siteConfig.i18n.locales.map((loc) => ({", "  return (locales ?? siteConfig.i18n.locales).map((loc) => ({");
await writeFile(p, b, "utf8");
console.log(JSON.stringify({ sigChanged: c !== a, bodyChanged: a !== b }));
