/**
 * Locale fallback middleware for Cloudflare Pages.
 *
 * Semantics:
 *   - Requested locale page HAS a translation  -> 200 (static asset, unchanged)
 *   - Requested locale page is MISSING         -> 302 Redirect to `/<path>`
 *   - Root, `/en/` 301 -> root, static assets, `/api/*`   -> untouched passthrough
 *
 * Why middleware instead of `_redirects` rules (see docs in repo):
 *   - Cloudflare `_redirects` splat rules are "always followed, regardless of
 *     whether or not an asset matches the incoming request", so `/{locale}/*`
 *     would hijack pages that DO have a translation (e.g. `/de/about/`) and
 *     302 them to the English equivalent.
 *   - Expanding every missing page into individual exact rules exceeds the
 *     `_redirects` limit (2,000 static + 100 dynamic = 2,100 rules); the
 *     current content set needs ~5,400 exact rules.
 *
 * Precondition:
 *   - A top-level `404.html` must exist in the build output (Astro emits it by
 *     default). Without it Cloudflare Pages assumes SPA mode and serves the
 *     root index for unmatched paths, which would defeat the 404 detection.
 *
 * Locale list below must stay in sync with SITE_CONFIG.locales
 * (src/lib/site-config.ts) — only the non-English members.
 */

interface MiddlewareContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

const NON_EN_LOCALES = new Set([
  "de",
  "ja",
  "fr",
  "es",
  "pt-br",
  "it",
  "ko",
  "nl",
  "pl",
  "sv",
  "tr",
  "ru",
  "ar",
  "cs",
  "vi",
]);

export async function onRequest(context: MiddlewareContext): Promise<Response> {
  const { request, next } = context;
  const url = new URL(request.url);
  const [, locale, ...restSegs] = url.pathname.split("/");
  const rest = restSegs.filter(Boolean).join("/");
  // /en or /en/* - English lives at the ROOT (prefixDefaultLocale: false).
  // Never serve duplicate English pages under /en/ - 301 to the prefix-free URL.
  if (locale === "en") {
    const target = new URL(rest ? "/" + rest + "/" : "/", url);
    target.search = url.search;
    return Response.redirect(target.toString(), 301);
  }


  // Not a localized route -> pass through untouched.
  if (!locale || !NON_EN_LOCALES.has(locale)) {
    return next();
  }

  // Let the static asset server decide: 200 if the translation exists.
  const res = await next();
  if (res.status !== 404) {
    return res;
  }

  // Missing translation -> 302 fallback to the English equivalent.
  const target = new URL(`/${rest}${rest ? "/" : ""}`, url);
  target.search = url.search;
    return Response.redirect(target.toString(), 302);
}