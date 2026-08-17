import { defineConfig, envField } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "./src/config/site.config";

async function collectFiles(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(path, extensions)));
      continue;
    }

    if (extensions.includes(extname(entry.name))) {
      results.push(path);
    }
  }

  return results;
}

function parseFrontmatter(source: string) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  return match[1].split(/\r?\n/).reduce<Record<string, string>>((acc, line) => {
    const pair = line.match(/^\s*([A-Za-z0-9_-]+):\s*(.*)\s*$/);
    if (!pair) return acc;
    acc[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
    return acc;
  }, {});
}

function validateDuplicates(entries: Array<{ id: string; data?: { uid?: string; locale?: string } }>, supportedLocales: string[]) {
  const seenIds = new Set<string>();
  const seenUids = new Map<string, string>();

  for (const entry of entries) {
    if (seenIds.has(entry.id)) {
      console.warn(`[content-validation] Duplicate slug detected: "${entry.id}"`);
    } else {
      seenIds.add(entry.id);
    }

    const uid = entry.data?.uid;
    if (uid) {
      const previous = seenUids.get(uid);
      if (previous) {
        console.warn(`[content-validation] Duplicate uid detected: "${uid}" (${previous} and ${entry.id})`);
      } else {
        seenUids.set(uid, entry.id);
      }
    }

    const locale = entry.data?.locale;
    if (locale && !supportedLocales.includes(locale)) {
      console.warn(`[content-validation] Unsupported locale "${locale}" on entry "${entry.id}"`);
    }
  }
}

function contentValidationIntegration() {
  return {
    name: "content-validation",
    hooks: {
      "astro:build:start": async () => {
        const contentBase = join(process.cwd(), "src", "content");
        const collections = [
          { dir: join(contentBase, "site", "blog"), extensions: [".md", ".mdx"] },
          { dir: join(contentBase, "site", "pages"), extensions: [".md"] },
          { dir: join(contentBase, "site", "faqs"), extensions: [".json"] },
          { dir: join(contentBase, "site", "stack"), extensions: [".md", ".mdx"] },
        ];

        const entries = await Promise.all(
          collections.map(async ({ dir, extensions }) =>
            Promise.all(
              (await collectFiles(dir, extensions)).map(async (file) => ({
                id: basename(file).replace(/\.[^/.]+$/, ""),
                data: parseFrontmatter(await readFile(file, "utf8")),
              })),
            ),
          ),
        );

        // Keep in sync with `LOCALES` in src/config/site.config.ts (10 languages).
        const supportedLocales = ["en"];
        for (const collection of entries) {
          validateDuplicates(collection, supportedLocales);
        }
      },
    },
  };
}

/**
 * Generates the final `_redirects` file at the build output root for Cloudflare Pages.
 *
 * Historically this wrote splat fallback rules (`/{locale}/* /en/:splat 302`) for every
 * non-English locale. That was incorrect: Cloudflare's `_redirects` rules are "always
 * followed, regardless of whether or not an asset matches", so the splat rules hijacked
 * pages that DO have a translation (e.g. `/de/about/`) and 302'd them to the English
 * equivalent. Precise per-page rules are infeasible too (~5,400 needed vs. the 2,100 rule
 * limit). Locale fallback therefore lives in `functions/_middleware.ts` checked in to the
 * repo, and this integration only preserves the hand-written rules from `public/_redirects`.
 */
function redirectsIntegration() {
  return {
    name: "redirects-generator",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        // `dir` is a file:// URL for the build output (dist). On Windows,
        // `dir.pathname` is "/C:/..." and must not be fed to path.join directly
        // (it would produce a mangled "C:\C:\..." path). Convert to a real path.
        const outputDir = fileURLToPath(dir);

        // Preserve hand-written rules from public/_redirects (Astro already copies
        // public/* into dist, but this hook re-emits the file to keep behavior explicit
        // and forward-compatible if we later need to synthesize more rules).
        const lines: string[] = [];
        try {
          const src = await readFile(join(process.cwd(), "public", "_redirects"), "utf-8");
          lines.push(...src.split(/\r?\n/).filter((l) => l.trim() !== ""));
        } catch (error) {
          console.warn("[redirects] public/_redirects not found; writing empty _redirects", error);
        }
        lines.push(""); // trailing newline

        await writeFile(join(outputDir, "_redirects"), lines.join("\n"), "utf-8");
        console.log(`[redirects] Wrote dist/_redirects with ${lines.length - 1} preserved rule(s)`);
      },
    },
  };
}

export default defineConfig({
  site: siteConfig.url,
  // i18n block removed — site is English-only.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  trailingSlash: 'always',
  redirects: {
    '/knowledge/materials/[slug]': '/grades/[slug]',
    '/knowledge/processes/[slug]': '/processes/[slug]',
    '/knowledge/industries/[slug]': '/industries/[slug]',
    '/knowledge/standards/[slug]': '/standards/[slug]',
    '/knowledge/surface-finishes/[slug]': '/finishes/[slug]',
    '/knowledge/failure-analysis/[slug]': '/failures/[slug]',
    '/knowledge/heat-treatment/[slug]': '/heat-treatment/[slug]',
    '/knowledge/corrosion/[slug]': '/corrosion/[slug]',
    '/knowledge/': '/',
    '/grades/grade-5-titanium-ti6al4v/': '/grades/grade-5-titanium/',
    '/grades/grade-23-titanium-eli/': '/grades/grade-23-titanium/',
  },
  integrations: [
    starlight({
      title: siteConfig.name,
      pagefind: process.env.SKIP_PAGEFIND !== "true",
      customCss: ["./src/styles/starlight.css"],
      components: {
        SiteTitle: "./src/components/docs/SiteTitle.astro",
      },
      editLink: {
        baseUrl: "https://github.com/milzamsz/astro-cloudflare-starter/edit/main",
      },
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/milzamsz/astro-cloudflare-starter" },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Overview", slug: "getting-started/overview" },
            { label: "Quick Start", slug: "getting-started/quick-start" },
            { label: "Project Structure", slug: "getting-started/project-structure" },
          ],
        },
        {
          label: "Guides",
          items: [
            { label: "Content Management", slug: "guides/content-management" },
            { label: "Internationalization", slug: "guides/internationalization" },
            { label: "Customization", slug: "guides/customization" },
            { label: "AI-assisted development", slug: "guides/ai-assisted-development" },
          ],
        },
        {
          label: "Deployment",
          items: [
            { label: "Cloudflare Pages", slug: "deployment/cloudflare-pages" },
            { label: "Environment Variables", slug: "deployment/environment-variables" },
          ],
        },
      ],
    }),
    mdx(),
    contentValidationIntegration(),
    redirectsIntegration(),
    sitemap({
      filter: (page) => !page.includes("/og/"),

    }),
    react(),
    icon(),
  ],
  env: {
    schema: {
      SITE_URL: envField.string({ context: "server", access: "public", default: "http://localhost:4321" }),
      GOOGLE_SITE_VERIFICATION: envField.string({ context: "server", access: "public", optional: true }),
      BING_SITE_VERIFICATION: envField.string({ context: "server", access: "public", optional: true }),
      PUBLIC_GA_MEASUREMENT_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_GTM_ID: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_CONSENT_ENABLED: envField.boolean({ context: "client", access: "public", optional: true, default: false }),
      PUBLIC_PRIVACY_POLICY_URL: envField.string({ context: "client", access: "public", optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@pages": resolve(process.cwd(), "src/pages"),
      },
    },
  },
  build: {
    format: "directory",

  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  image: {
    layout: "constrained",
  },
  security: {
    checkOrigin: true,
  },
});