// Cloudflare Pages Function: live OG metadata for draft previews only.
// Published posts get link previews at build time (src/data/link-previews.json).
// Requires a valid Cloudflare Access JWT, so production (not behind Access) always gets 401.

import { verifyAccessJwt, type AccessEnv } from '../lib/cf-access';
import { fetchOgMetadata, isAllowedPreviewUrl } from '../../shared/link-preview.mjs';

const jsonHeaders = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

export const onRequestGet: PagesFunction<AccessEnv> = async ({ request, env }) => {
  if (!(await verifyAccessJwt(request, env))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: jsonHeaders });
  }

  const targetUrl = new URL(request.url).searchParams.get('url');
  if (!targetUrl || !isAllowedPreviewUrl(targetUrl)) {
    return new Response(JSON.stringify({ error: 'A public https URL is required' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  try {
    const metadata = await fetchOgMetadata(targetUrl);
    return new Response(JSON.stringify(metadata), { headers: jsonHeaders });
  } catch (error) {
    console.error('Error fetching OG metadata:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch metadata', url: targetUrl }), {
      status: 502,
      headers: jsonHeaders,
    });
  }
};
