import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
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

export const GET: APIRoute = async () => {
  const base = siteConfig.url.replace(/\/$/, "");

  const corePages: LlmLink[] = [
    { label: "Home", path: "/", description: siteConfig.description },
    { label: "Knowledge Base", path: "/grades", description: "Comprehensive titanium engineering knowledge base covering materials, processes, industries, standards, finishes, and technical guides." },
    { label: "Titanium Materials", path: "/grades", description: "Technical specifications for all titanium grades: Grade 1, 2, 5 (Ti-6Al-4V), Grade 23 (Ti-6Al-4V ELI), and specialty alloys." },
    { label: "Manufacturing Processes", path: "/processes", description: "CNC machining, 5-axis milling, turning, wire EDM, and additive manufacturing for titanium." },
    { label: "Industry Applications", path: "/industries", description: "Titanium applications in aerospace, medical, semiconductor, and energy industries." },
    { label: "Standards & Certifications", path: "/standards", description: "ASTM, ISO, AS9100D, NADCAP standards for titanium engineering." },
    { label: "Surface Finishes", path: "/finishes", description: "Anodizing, passivation, bead blasting, and polishing for titanium." },
    { label: "Material Selection", path: "/selection", description: "Application-based grade comparison and selection guides for titanium alloys." },
    { label: "Failure Analysis", path: "/failures", description: "Hydrogen embrittlement, stress corrosion cracking, deformation, and defect prevention." },
    { label: "Heat Treatment", path: "/heat-treatment", description: "Annealing, solution treatment, aging, and microstructure control for titanium alloys." },
    { label: "Corrosion Resistance", path: "/corrosion", description: "Titanium performance in seawater, acid, chloride, and high-temperature environments." },
    { label: "Technical Evidence & Data", path: "/evidence", description: "Verifiable titanium data points (mechanical properties, machining parameters, tolerances, corrosion, fatigue) each with a citation-ready Evidence Basis and engineering interpretation." },
    { label: "Manufacturing Case Studies", path: "/cases", description: "Engineering case studies with measurable outcomes: cycle time, rejection rate, tolerances, and cost savings." },
    { label: "Procurement Guides", path: "/procurement", description: "RFQ preparation, certifications, lead times, inspection, and supplier decisions for titanium components." },
    { label: "Comparisons", path: "/compare", description: "Side-by-side comparisons of titanium grades, processes, and alternatives." },
    { label: "Guides", path: "/guides", description: "Step-by-step technical guides for material selection, machining, and design." },
    { label: "FAQ", path: "/faq", description: "Titanium engineering FAQ." },
    { label: "Blog", path: "/blog", description: "Articles on titanium engineering." },
    { label: "Documentation", path: "/docs", description: "Site platform documentation." },
  ];

  const blogEntries: CollectionEntry<"blog">[] = await getCollection("blog");
  const blogLinks: LlmLink[] = blogEntries
    .filter((p: CollectionEntry<"blog">) => !p.data.draft)
    .map((p: CollectionEntry<"blog">) => ({
      label: p.data.title,
      path: `/blog/${p.id}`,
      description: `${p.data.description} -- Published ${p.data.publishDate.toISOString().slice(0, 10)}.`,
    }));

  const pageEntries: CollectionEntry<"pages">[] = await getCollection("pages");
  const pageLinks: LlmLink[] = pageEntries
    .filter((p: CollectionEntry<"pages">) => !p.data.isLegal)
    .map((p: CollectionEntry<"pages">) => ({
      label: p.data.title,
      path: `/${p.data.slug}`,
      description: p.data.description,
    }));

  const docEntries: CollectionEntry<"docs">[] = await getCollection("docs");
  const docLinks: LlmLink[] = docEntries
    .filter((d: CollectionEntry<"docs">) => d.id !== "docs/index")
    .map((d: CollectionEntry<"docs">) => {
      const slug = d.id.replace(/^docs\//, "");
      const label = slug.split("/").pop()!.replace(/[-_]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      return { label, path: `/docs/${slug}`, description: d.data.description ?? `Documentation: ${label}.` };
    });

  const stack: LlmLink[] = [
    { label: "Astro", path: "https://astro.build", description: "Static site generator." },
    { label: "Starlight", path: "https://starlight.astro.build", description: "Documentation framework." },
    { label: "Cloudflare Pages", path: "https://pages.cloudflare.com", description: "Edge deployment." },
    { label: "Tailwind CSS", path: "https://tailwindcss.com", description: "Utility-first CSS framework." },
  ];

  const faqEntries: CollectionEntry<"faqs">[] = await getCollection("faqs");
  const faqSection = faqEntries.length > 0
    ? `\n## FAQ\n\n${faqEntries.map((f: CollectionEntry<"faqs">) => `- **${f.data.question}**: ${f.data.answer}`).join("\n")}\n`
    : "";

  const body = `# ${siteConfig.name}\n\n> ${siteConfig.description}.\n\n## Quick Facts\n\n- **URL**: ${siteConfig.url}\n- **Author**: ${siteConfig.author}\n- **Contact**: ${siteConfig.email}\n- **Languages**: ${siteConfig.i18n.locales.join(", ")}\n- **Tech Stack**: Astro, Starlight, Tailwind CSS, Cloudflare Pages, Pagefind${section("Core Pages", corePages, base)}${section("Blog Posts", blogLinks, base)}${section("Content Pages", pageLinks, base)}${section("Documentation", docLinks, base)}${faqSection}${section("Stack", stack, base)}\n\n---\n\n*Last updated: ${new Date().toISOString().slice(0, 10)}.*\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};