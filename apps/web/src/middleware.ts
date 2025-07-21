import { getCachedHTML, setCachedHTML } from "@repo/isr-cache";

export async function onRequest(context: any, next: any) {
  const urlPath = context.url.pathname;

  console.log(urlPath);

  // Serve cached .html
  const cached = getCachedHTML(urlPath);
  if (cached) {
    console.log(`🟢 Cache HIT for ${urlPath}`);
    return new Response(cached, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Render and save HTML
  console.log(`🔴 Cache MISS for ${urlPath} — rendering and caching`);
  const response = await next();
  const html = await response.text();

  setCachedHTML(urlPath, html);

  return new Response(html, {
    status: response.status,
    headers: { "Content-Type": "text/html" },
  });
}
