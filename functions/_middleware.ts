/**
 * Cloudflare Pages middleware — pass-through.
 *
 * The site is now English-only (see `.clinerules/translation-governance.md`).
 * Legacy `/<locale>/...` URLs are no longer generated and intentionally return
 * 404 from the static host — no redirects. This middleware exists only to keep
 * the Cloudflare Pages Functions build slot stable; it does not rewrite paths.
 */
interface MiddlewareContext {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}

export async function onRequest(context: MiddlewareContext): Promise<Response> {
  return context.next();
}
