import fs from "fs";
import path from "path";

// ---------------- DATA CACHE (in-memory) ----------------
type CacheEntry<T> = { data: T; timestamp: number };
const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Cache async fetched data for `revalidate` seconds in memory.
 */
export async function withISR<T>(
  key: string,
  fetchFn: () => Promise<T>,
  revalidate: number
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);
  if (cached && now - cached.timestamp < revalidate * 1000) {
    return cached.data;
  }
  const data = await fetchFn();
  memoryCache.set(key, { data, timestamp: now });
  return data;
}

export function clearISRCache(key?: string) {
  if (key) memoryCache.delete(key);
  else memoryCache.clear();
}

// ---------------- HTML CACHE (file system) ----------------
const HTML_CACHE_DIR = path.resolve(".cache/html");

function getHtmlFilePath(urlPath: string) {
  const safePath =
    urlPath === "/" ? "index" : encodeURIComponent(urlPath.slice(1));
  return path.join(HTML_CACHE_DIR, `${safePath}.html`);
}

/**
 * Return cached HTML string if it exists, else null.
 */
export function getCachedHTML(urlPath: string): string | null {
  const filePath = getHtmlFilePath(urlPath);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }
  return null;
}

/**
 * Save HTML string to filesystem cache.
 */
export function setCachedHTML(urlPath: string, html: string): void {
  const filePath = getHtmlFilePath(urlPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf-8");
}

/**
 * Clear cached HTML files.
 * If urlPath is provided, deletes that file. Else clears all HTML cache.
 */
export function clearHTMLCache(urlPath?: string): void {
  if (!fs.existsSync(HTML_CACHE_DIR)) return;

  if (urlPath) {
    const filePath = getHtmlFilePath(urlPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } else {
    for (const file of fs.readdirSync(HTML_CACHE_DIR)) {
      fs.unlinkSync(path.join(HTML_CACHE_DIR, file));
    }
  }
}
