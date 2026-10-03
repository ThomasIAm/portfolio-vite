// Shared link-preview helpers, used by the build script (scripts/fetch-content.mjs)
// and the Access-protected draft endpoint (functions/api/og-metadata.ts).

const MAX_HTML_BYTES = 512 * 1024;
const FETCH_TIMEOUT_MS = 8000;

/** Links that sit alone in their own paragraph (rendered as preview cards). */
export function extractStandaloneLinks(markdown) {
  if (typeof markdown !== 'string') return [];
  const links = new Set();
  for (const block of markdown.split(/\n\s*\n/)) {
    const text = block.trim();
    const md = /^\[[^\]]*\]\((\S+?)(?:\s+"[^"]*")?\)$/.exec(text);
    const bare = /^<?(https?:\/\/[^\s<>]+)>?$/.exec(text);
    const href = md?.[1] ?? bare?.[1];
    if (href && isAllowedPreviewUrl(href)) links.add(href);
  }
  return [...links];
}

/** Only public https URLs on a hostname (no IP literals, no localhost). */
export function isAllowedPreviewUrl(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.username || url.password) return false;
  if (url.port && url.port !== '443') return false;
  const host = url.hostname.toLowerCase();
  if (!host.includes('.') || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith('[')) return false;
  return true;
}

function metaContent(html, property) {
  const attr = (kind, name) =>
    new RegExp(`<meta[^>]*${kind}=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i').exec(html) ||
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*${kind}=["']${name}["']`, 'i').exec(html);
  const m =
    attr('property', `og:${property}`) ||
    attr('name', `twitter:${property}`) ||
    (property === 'description' ? attr('name', 'description') : null);
  return m?.[1];
}

/**
 * @param html     HTML of the page that was actually returned
 * @param pageUrl  Final URL (after redirects) — base for resolving relative values
 * @param linkUrl  Original link in the post — the card's click target (defaults to pageUrl)
 */
export function extractOgMetadata(html, pageUrl, linkUrl = pageUrl) {
  const title = metaContent(html, 'title') ?? /<title[^>]*>([^<]+)<\/title>/i.exec(html)?.[1]?.trim();
  let image = metaContent(html, 'image');
  if (image) {
    try {
      image = new URL(image, pageUrl).href;
      if (!image.startsWith('https://')) image = undefined;
    } catch {
      image = undefined;
    }
  }
  return {
    title,
    description: metaContent(html, 'description'),
    image,
    siteName: metaContent(html, 'site_name') ?? new URL(pageUrl).hostname,
    url: linkUrl,
  };
}

/** Fetch with https-only, no redirects to other protocols, timeout and size cap. */
export async function fetchOgMetadata(href) {
  if (!isAllowedPreviewUrl(href)) throw new Error('URL not allowed');
  let current = href;
  for (let hop = 0; hop < 3; hop++) {
    const res = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get('location');
      if (!next) throw new Error('Redirect without location');
      current = new URL(next, current).href;
      if (!isAllowedPreviewUrl(current)) throw new Error('Redirect target not allowed');
      continue;
    }
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    if (!(res.headers.get('content-type') ?? '').includes('html')) throw new Error('Not HTML');
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No body');
    const chunks = [];
    let size = 0;
    while (size < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.byteLength;
    }
    reader.cancel().catch(() => {});
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const c of chunks) {
      bytes.set(c.subarray(0, Math.min(c.byteLength, size - offset)), offset);
      offset += c.byteLength;
    }
    return extractOgMetadata(new TextDecoder().decode(bytes.subarray(0, MAX_HTML_BYTES)), current, href);
  }
  throw new Error('Too many redirects');
}
