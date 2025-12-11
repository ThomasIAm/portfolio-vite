// Middleware to inject SEO meta tags into HTML for all requests
import { SITE_NAME, getRouteMetadata, generateOgImageUrl } from '../src/config/seo-metadata';

function generateMetaTags(baseUrl: string, path: string): string {
  const metadata = getRouteMetadata(path);
  const { title, description, type, keywords } = metadata;
  const canonicalUrl = `${baseUrl}${path}`;
  const ogImage = generateOgImageUrl(baseUrl, title, description, type);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="${SITE_NAME}" />
    ${keywords?.length ? `<meta name="keywords" content="${keywords.join(', ')}" />` : ''}
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
  `;
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip for assets, API routes, and the OG image endpoint
  if (path.startsWith('/og') || path.startsWith('/assets') || path.includes('.')) {
    return next();
  }

  // Get the original response
  const response = await next();
  
  // Only process HTML responses
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Get base URL from CF_PAGES_URL or construct from request
  const baseUrl = (context.env as any).CF_PAGES_URL || `${url.protocol}//${url.host}`;

  // Get original HTML and inject meta tags
  let html = await response.text();
  const metaTags = generateMetaTags(baseUrl, path);
  
  // Insert meta tags after <head> tag
  html = html.replace('<head>', `<head>${metaTags}`);

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};
