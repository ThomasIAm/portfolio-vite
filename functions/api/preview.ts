// Cloudflare Pages Function: Fetch draft blog post from Contentful Preview API
// Used by the content preview page to display unpublished content.
// Requires a valid Cloudflare Access JWT, so it only works behind Access.

import { verifyAccessJwt, type AccessEnv } from '../lib/cf-access';

interface Env extends AccessEnv {
  CONTENTFUL_SPACE_ID: string;
  CONTENTFUL_PREVIEW_TOKEN: string;
}

interface ContentfulResponse {
  items: unknown[];
  includes?: {
    Entry?: unknown[];
    Asset?: unknown[];
  };
}

type LinkLike = { sys?: { type?: string; linkType?: string; id?: string } };

function resolveLinks(item: unknown, includes: ContentfulResponse['includes']): unknown {
  if (!item || typeof item !== 'object') return item;

  // Resolve sys links
  const { sys } = item as LinkLike;
  if (sys?.type === 'Link') {
    const collection = (sys.linkType === 'Asset' ? includes?.Asset : includes?.Entry) as LinkLike[] | undefined;
    const resolved = collection?.find((e) => e.sys?.id === sys.id);
    return resolved ? resolveLinks(resolved, includes) : item;
  }

  // Recurse arrays
  if (Array.isArray(item)) {
    return item.map((i) => resolveLinks(i, includes));
  }

  // Recurse object fields
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item)) {
    result[key] = resolveLinks(value, includes);
  }
  return result;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };

  if (!(await verifyAccessJwt(request, env))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: corsHeaders,
    });
  }


  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const spaceId = env.CONTENTFUL_SPACE_ID;
  const previewToken = env.CONTENTFUL_PREVIEW_TOKEN;

  if (!spaceId || !previewToken) {
    return new Response(
      JSON.stringify({ error: 'Preview API not configured. Set CONTENTFUL_SPACE_ID and CONTENTFUL_PREVIEW_TOKEN.' }),
      { status: 503, headers: corsHeaders }
    );
  }

  try {
    const apiUrl = new URL(`https://preview.contentful.com/spaces/${spaceId}/entries`);
    apiUrl.searchParams.set('access_token', previewToken);
    apiUrl.searchParams.set('content_type', 'blogPost');
    apiUrl.searchParams.set('fields.slug', slug);
    apiUrl.searchParams.set('include', '2');
    apiUrl.searchParams.set('limit', '1');

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      const text = await response.text();
      return new Response(
        JSON.stringify({ error: 'Contentful Preview API error', details: text }),
        { status: response.status, headers: corsHeaders }
      );
    }

    const data: ContentfulResponse = await response.json();

    if (!data.items || data.items.length === 0) {
      return new Response(JSON.stringify({ error: 'Post not found', slug }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Resolve linked entries/assets inline
    const post = resolveLinks(data.items[0], data.includes);

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Preview API request failed:', error);
    const message =
      error instanceof Error ? error.message : 'Unknown preview fetch error';

    return new Response(
      JSON.stringify({ error: 'Failed to fetch preview content', message }),
      { status: 500, headers: corsHeaders }
    );
  }
};
