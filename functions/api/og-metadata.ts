// Cloudflare Pages function to fetch OG metadata from external URLs

interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
}

function extractMetaContent(html: string, property: string): string | undefined {
  // Try og: properties first
  const ogMatch = html.match(new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:${property}["']`, 'i'));
  if (ogMatch) return ogMatch[1];

  // Try twitter: properties
  const twitterMatch = html.match(new RegExp(`<meta[^>]*name=["']twitter:${property}["'][^>]*content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:${property}["']`, 'i'));
  if (twitterMatch) return twitterMatch[1];

  // Try standard meta tags for description
  if (property === 'description') {
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    if (descMatch) return descMatch[1];
  }

  return undefined;
}

function extractTitle(html: string): string | undefined {
  const ogTitle = extractMetaContent(html, 'title');
  if (ogTitle) return ogTitle;

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : undefined;
}

function resolveUrl(base: string, relative?: string): string | undefined {
  if (!relative) return undefined;
  if (relative.startsWith('http://') || relative.startsWith('https://')) {
    return relative;
  }
  if (relative.startsWith('//')) {
    return `https:${relative}`;
  }
  try {
    return new URL(relative, base).href;
  } catch {
    return undefined;
  }
}

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Validate URL
    const parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }

    // Fetch the page
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      cf: {
        cacheTtl: 86400, // Cache for 24 hours
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    const metadata: OGMetadata = {
      title: extractTitle(html),
      description: extractMetaContent(html, 'description'),
      image: resolveUrl(targetUrl, extractMetaContent(html, 'image')),
      siteName: extractMetaContent(html, 'site_name') || parsedUrl.hostname,
      url: targetUrl,
    };

    return new Response(JSON.stringify(metadata), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching OG metadata:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch metadata',
      url: targetUrl,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
