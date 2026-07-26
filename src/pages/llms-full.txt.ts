import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "../config/site.config";

export const prerender = true;

interface LlmLink {
  label: string;
  path: string;
  description: string;
}

function section(title: string, links: LlmLink[], baseUrl: string): string {
  if (links.length === 0) return "";
  const toUrl = (path: string) =>
    path.startsWith("http") ? path : `${baseUrl}${path}`;
  const items = links
    .map((l) => `- [${l.label}](${toUrl(l.path)}): ${l.description}`)
    .join("\n");
  return `\n## ${title}\n\n${items}\n`;
}

async function loadLinks(collection: string, pathPrefix: string, descFn: (e: any) => string): Promise<LlmLink[]> {
  const entries = await getCollection(collection);
  return entries.map((e: any) => ({
    label: e.data.title,
    path: `${pathPrefix}/${e.id}`,
    description: descFn(e),
  }));
}

export const GET: APIRoute = async () => {
  const base = siteConfig.url.replace(/\/$/, "");

  const corePages: LlmLink[] = [
    { label: "Home", path: "/", description: siteConfig.description },
    { label: "Knowledge Base", path: "/knowledge", description: "Comprehensive titanium engineering knowledge base." },
    { label: "Titanium Materials", path: "/knowledge/materials", description: "Technical specs for all titanium grades." },
    { label: "Manufacturing Processes", path: "/knowledge/processes", description: "CNC machining, 5-axis, turning, wire EDM, DMLS." },
    { label: "Industry Applications", path: "/knowledge/industries", description: "Aerospace, medical, semiconductor, energy." },
    { label: "Standards", path: "/knowledge/standards", description: "ASTM, ISO, AS9100D, NADCAP, ISO 13485." },
    { label: "Surface Finishes", path: "/knowledge/surface-finishes", description: "Anodizing, passivation, bead blasting." },
    { label: "Material Selection", path: "/knowledge/material-selection", description: "Grade comparison and selection guides." },
    { label: "Failure Analysis", path: "/knowledge/failure-analysis", description: "Hydrogen embrittlement, SCC, defect prevention." },
    { label: "Heat Treatment", path: "/knowledge/heat-treatment", description: "Annealing, solution treatment, aging." },
    { label: "Corrosion Resistance", path: "/knowledge/corrosion", description: "Titanium in corrosive environments." },
    { label: "Applications", path: "/knowledge/applications", description: "Use cases across industries." },
  ];

  const materials: LlmLink[] = await loadLinks("materials", "/knowledge/materials", (e: any) =>
    `${e.data.description}${e.data.properties ? " Density: " + e.data.properties.density + "." : ""}`);
  const processes: LlmLink[] = await loadLinks("processes", "/knowledge/processes", (e: any) =>
    `${e.data.description}${e.data.tolerances ? " Tolerances: " + e.data.tolerances + "." : ""}`);
  const industries: LlmLink[] = await loadLinks("industries", "/knowledge/industries", (e: any) => e.data.description);
  const standards: LlmLink[] = await loadLinks("standards", "/knowledge/standards", (e: any) =>
    `${e.data.description} Issuing body: ${e.data.issuingBody}.`);
  const finishes: LlmLink[] = await loadLinks("surfaceFinishes", "/knowledge/surface-finishes", (e: any) =>
    `${e.data.description}${e.data.raRange ? " Ra: " + e.data.raRange + "." : ""}`);
  const applications: LlmLink[] = await loadLinks("applications", "/knowledge/applications", (e: any) =>
    `${e.data.description}${e.data.industry ? " Industry: " + e.data.industry + "." : ""}`);
  const cases: LlmLink[] = await loadLinks("cases", "/knowledge/cases", (e: any) =>
    `${e.data.description} Material: ${e.data.material}.`);
  const evdata: LlmLink[] = await loadLinks("evidence", "/knowledge/evidence", (e: any) =>
    `${e.data.description} Category: ${e.data.evidenceCategory}.`);
  const comparisons: LlmLink[] = await loadLinks("comparisons", "/compare", (e: any) =>
    `${e.data.description} Quick answer: ${e.data.quickAnswer}.`);
  const procurement: LlmLink[] = await loadLinks("procurement", "/knowledge/procurement", (e: any) =>
    `${e.data.description} Quick answer: ${e.data.quickAnswer}.`);

  const blogPosts: LlmLink[] = (await getCollection("blog"))
    .filter((e: any) => !e.data.draft)
    .map((e: any) => ({
      label: e.data.title,
      path: `/blog/${e.id}`,
      description: `${e.data.description} Published: ${e.data.publishDate.toISOString().slice(0, 10)}.`,
    }));

  let body = `# ${siteConfig.name} (Full Index)\n\n> ${siteConfig.description}. Full page-level summaries for deep AI indexing.\n\n## Quick Facts\n\n- **URL**: ${siteConfig.url}\n- **Languages**: ${siteConfig.i18n.locales.join(", ")}\n`;
  body += section("Core Pages", corePages, base);
  body += section("Titanium Materials", materials, base);
  body += section("Manufacturing Processes", processes, base);
  body += section("Industry Applications", industries, base);
  body += section("Standards & Certifications", standards, base);
  body += section("Surface Finishes", finishes, base);
  body += section("Applications & Use Cases", applications, base);
  body += section("Case Studies", cases, base);
  body += section("Technical Evidence", evdata, base);
  body += section("Comparisons", comparisons, base);
  body += section("Procurement Guides", procurement, base);
  body += section("Blog Posts", blogPosts, base);

  const faqEntries = await getCollection("faqs");
  if (faqEntries.length > 0) {
    body += `\n## FAQ\n\n${faqEntries.map((f: any) => `- **${f.data.question}**: ${f.data.answer}`).join("\n")}\n`;
  }
  body += `\n---\n\n*Last updated: ${new Date().toISOString().slice(0, 10)}. Built at deploy time.*\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
