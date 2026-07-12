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

  // ── Static pages ──
  const corePages: LlmLink[] = [
    { label: "Home", path: "/", description: siteConfig.description },
    { label: "About", path: "/about", description: "Project background and overview." },
    { label: "Services Overview", path: "/services", description: "Browse all service offerings and pricing tiers." },
    { label: "Pricing", path: "/pricing", description: "Plans and pricing tiers." },
    { label: "Blog", path: "/blog", description: "Articles, tutorials, and updates." },
    { label: "Contact", path: "/contact", description: "Contact details and inquiry form." },
    { label: "Privacy Policy", path: "/privacy", description: "Privacy policy and data handling practices." },
    { label: "Terms & Conditions", path: "/terms", description: "Terms of service." },
    { label: "Documentation", path: "/docs", description: "Setup and usage guides for the starter." },
  ];

  // ── Blog posts (non-draft, sorted by date) ──
  const blogEntries: CollectionEntry<"blog">[] = await getCollection("blog");
  const blogLinks: LlmLink[] = blogEntries
    .filter((p: CollectionEntry<"blog">) => !p.data.draft)
    .sort(
      (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
        b.data.publishDate.getTime() - a.data.publishDate.getTime(),
    )
    .map((p: CollectionEntry<"blog">) => ({
      label: p.data.title,
      path: `/blog/${p.id}`,
      description: `${p.data.description} — Published ${p.data.publishDate.toISOString().slice(0, 10)}.`,
    }));

  // ── Service pages ──
  const serviceEntries: CollectionEntry<"services">[] = await getCollection("services");
  const serviceLinks: LlmLink[] = serviceEntries.map((s: CollectionEntry<"services">) => ({
    label: s.data.title,
    path: `/services/${s.data.slug}`,
    description: s.data.description,
  }));

  // ── Content pages (About, Pricing, Contact, etc. via CMS) ──
  const pageEntries: CollectionEntry<"pages">[] = await getCollection("pages");
  const pageLinks: LlmLink[] = pageEntries
    .filter((p: CollectionEntry<"pages">) => !p.data.isLegal) // legal pages covered above
    .map((p: CollectionEntry<"pages">) => ({
      label: p.data.title,
      path: `/${p.data.slug}`,
      description: p.data.description,
    }));

  // ── Docs (Starlight) ──
  const docEntries: CollectionEntry<"docs">[] = await getCollection("docs");
  const docLinks: LlmLink[] = docEntries
    .filter((d: CollectionEntry<"docs">) => d.id !== "docs/index") // skip the docs landing — covered above
    .map((d: CollectionEntry<"docs">) => {
      const slug = d.id.replace(/^docs\//, "");
      const label = slug
        .split("/")
        .pop()!
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());
      return {
        label,
        path: `/docs/${slug}`,
        description: d.data.description ?? `Documentation page: ${label}.`,
      };
    });

  // ── Stack / technology ──
  const stack: LlmLink[] = [
    { label: "Astro", path: "https://astro.build", description: "Static site generator for fast content sites." },
    { label: "Starlight", path: "https://starlight.astro.build", description: "Documentation framework for Astro." },
    { label: "Cloudflare Pages", path: "https://pages.cloudflare.com", description: "Edge deployment with optional R2 storage." },
    { label: "Tailwind CSS", path: "https://tailwindcss.com", description: "Utility-first CSS framework." },
  ];

  // ── FAQ (from content collection) ──
  const faqEntries: CollectionEntry<"faqs">[] = await getCollection("faqs");
  const faqSection = faqEntries.length > 0
    ? `\n## FAQ\n\n${faqEntries.map((f: CollectionEntry<"faqs">) => `- **${f.data.question}**: ${f.data.answer}`).join("\n")}\n`
    : "";

  // ── Build the body ──
  const body = `# ${siteConfig.name}

> ${siteConfig.description}. Built with Astro 7, deployed on Cloudflare Pages. Features: light/dark theming, i18n (English by default), blog, Starlight docs, Pagefind search, RSS, sitemap, JSON-LD, dynamic OG images.

## Quick Facts

- **URL**: ${siteConfig.url}
- **Author**: ${siteConfig.author}
- **Contact**: ${siteConfig.email}
- **Languages**: ${siteConfig.i18n.locales.join(", ")}
- **Tech Stack**: Astro, Starlight, Tailwind CSS, Cloudflare Pages, Pagefind${section("Core Pages", corePages, base)}${section("Blog Posts", blogLinks, base)}${section("Services", serviceLinks, base)}${section("Content Pages", pageLinks, base)}${section("Documentation", docLinks, base)}${faqSection}${section("Stack", stack, base)}

---

*Last updated: ${new Date().toISOString().slice(0, 10)}. This llms.txt is generated at build time — content and pages are dynamically included.*
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

