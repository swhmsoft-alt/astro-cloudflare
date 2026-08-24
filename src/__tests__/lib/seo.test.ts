import { describe, it, expect } from "vitest";
import { canonicalUrl, isFileLikePath } from "../../lib/seo";
import { siteConfig } from "../../config/site.config";

const base = siteConfig.url; // https://titanium.blog

/**
 * HARD RULE (trailingSlash: 'always'):
 * Every HTML page URL — including canonical, og:url, hreflang, breadcrumbs and
 * share links — MUST end with a trailing slash to match the real rendered URL.
 * File/API/asset paths (js, css, txt, xml, json, og images, …) must NOT get one.
 */
describe("canonicalUrl", () => {
  it("ends the homepage with a trailing slash", () => {
    expect(canonicalUrl("en", "/")).toBe(`${base}/`);
  });

  it("ends page paths with a trailing slash", () => {
    expect(canonicalUrl("en", "/services/web-development")).toBe(
      `${base}/services/web-development/`,
    );
  });

  it("keeps an already-trailing-slash page path intact", () => {
    expect(canonicalUrl("en", "/services/web-development/")).toBe(
      `${base}/services/web-development/`,
    );
  });

  // EN-only project (2026-08-23): the locale argument is ignored. Any
  // previously-distinct non-en-locale URL (e.g. /de/...) is no longer
  // produced; the canonical is always rooted at `siteConfig.url + path`.
  it("ignores the locale argument (EN-only)", () => {
    expect(canonicalUrl("de", "/services/web-development")).toBe(
      `${base}/services/web-development/`,
    );
    expect(canonicalUrl("ja", "/")).toBe(`${base}/`);
    expect(canonicalUrl(undefined, "/grades/grade-5/")).toBe(
      `${base}/grades/grade-5/`,
    );
  });

  it("normalizes page paths without a leading slash", () => {
    expect(canonicalUrl("en", "services/web-development")).toBe(
      `${base}/services/web-development/`,
    );
  });

  it("does NOT add a trailing slash to file/API paths", () => {
    expect(canonicalUrl("en", "/robots.txt")).toBe(`${base}/robots.txt`);
    expect(canonicalUrl("en", "/rss.xml")).toBe(`${base}/rss.xml`);
    expect(canonicalUrl("en", "/llms.txt")).toBe(`${base}/llms.txt`);
    expect(canonicalUrl("en", "/sitemap-index.xml")).toBe(
      `${base}/sitemap-index.xml`,
    );
    expect(canonicalUrl("en", "/_astro/foo.css")).toBe(`${base}/_astro/foo.css`);
  });
});

describe("isFileLikePath", () => {
  it("detects file/API/asset paths", () => {
    expect(isFileLikePath("/robots.txt")).toBe(true);
    expect(isFileLikePath("/rss.xml")).toBe(true);
    expect(isFileLikePath("/llms.txt")).toBe(true);
    expect(isFileLikePath("/sitemap-index.xml")).toBe(true);
    expect(isFileLikePath("/_astro/app.js")).toBe(true);
    expect(isFileLikePath("/styles/main.css")).toBe(true);
  });

  it("rejects HTML page paths", () => {
    expect(isFileLikePath("/")).toBe(false);
    expect(isFileLikePath("/services/web-development")).toBe(false);
    expect(isFileLikePath("/blog/some-post")).toBe(false);
  });
});
