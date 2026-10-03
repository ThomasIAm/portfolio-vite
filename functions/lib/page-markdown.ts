// Markdown for agents on non-blog pages, rendered by Cloudflare Browser Run
// and cached per data center with the Workers Cache API.
import {
  ROUTE_METADATA,
  isMarkdownPath,
  normalizeMarkdownPath,
} from "../../src/config/seo-metadata";

export interface PageMarkdownEnv {
  CF_PAGES_URL?: string;
  CF_PAGES_COMMIT_SHA?: string;
  CF_ACCOUNT_ID?: string;
  CF_BROWSER_RUN_TOKEN?: string;
}

/** Header set on Browser Run's own page visit so the middleware never loops. */
export const RENDER_MARKER_HEADER = "X-Markdown-Render";

const CACHE_TTL_SECONDS = 86_400;
const RENDER_TIMEOUT_MS = 15_000;
const MAX_MARKDOWN_BYTES = 512 * 1024;

export function buildCacheKey(baseUrl: string, path: string, version: string): string {
  return `${baseUrl}/__md/v1/${encodeURIComponent(version)}${path === "/" ? "/index" : path}`;
}

export function addFrontmatter(path: string, canonicalUrl: string, markdown: string): string {
  const meta = ROUTE_METADATA[path];
  return [
    "---",
    `title: ${JSON.stringify(meta?.title ?? "")}`,
    `description: ${JSON.stringify(meta?.description ?? "")}`,
    `canonical: ${canonicalUrl}`,
    "---",
    "",
    markdown.trim(),
    "",
  ].join("\n");
}

export async function renderWithBrowserRun(
  targetUrl: string,
  env: PageMarkdownEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  const response = await fetchImpl(
    `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/browser-rendering/markdown`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CF_BROWSER_RUN_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: targetUrl,
        gotoOptions: { waitUntil: "networkidle0", timeout: RENDER_TIMEOUT_MS },
        setExtraHTTPHeaders: { [RENDER_MARKER_HEADER]: "1" },
        // Keep only the main content: hide site navigation and footer.
        addStyleTag: [{ content: "header, nav, footer { display: none !important; }" }],
        rejectResourceTypes: ["image", "media", "font"],
      }),
      signal: AbortSignal.timeout(RENDER_TIMEOUT_MS + 5_000),
    },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { success?: boolean; result?: unknown };
  if (!data.success || typeof data.result !== "string") return null;
  const markdown = data.result.trim();
  if (!markdown || new TextEncoder().encode(markdown).length > MAX_MARKDOWN_BYTES) return null;
  return markdown;
}

/**
 * Returns a Markdown response for an allowlisted path, or null so the caller
 * falls back to normal HTML. Only allowlisted paths on our own base URL are
 * ever sent to Browser Run.
 */
export async function getPageMarkdown(
  rawPath: string,
  baseUrl: string,
  env: PageMarkdownEnv,
  deps: { cache?: Cache; fetchImpl?: typeof fetch } = {},
): Promise<Response | null> {
  const path = normalizeMarkdownPath(rawPath);
  if (!isMarkdownPath(path)) return null;
  if (!env.CF_ACCOUNT_ID || !env.CF_BROWSER_RUN_TOKEN) return null;

  const cache = deps.cache ?? (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(
    buildCacheKey(baseUrl, path, env.CF_PAGES_COMMIT_SHA ?? "dev"),
  );

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const canonicalUrl = `${baseUrl}${path === "/" ? "/" : path}`;
  let markdown: string | null = null;
  try {
    markdown = await renderWithBrowserRun(canonicalUrl, env, deps.fetchImpl);
  } catch {
    return null;
  }
  if (!markdown) return null;

  const response = new Response(addFrontmatter(path, canonicalUrl, markdown), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Vary: "Accept",
    },
  });
  const toStore = response.clone();
  toStore.headers.set("Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}`);
  await cache.put(cacheKey, toStore);
  return response;
}
