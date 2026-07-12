import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const ct = response.headers.get("content-type");
  if (ct && ct.includes("text/html")) {
    let html = await response.text();
    html = html.replace(/href="\/([^".#?]+)"/g, (match, p) => {
      const clean = p.replace(/\/+$/, '');
      return `href="/${clean}/"`;
    });
    return new Response(html, { status: response.status, headers: response.headers });
  }
  return response;
});
