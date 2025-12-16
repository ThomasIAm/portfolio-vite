// Middleware to inject SEO meta tags into HTML for all requests
import { SITE_NAME, ROUTE_METADATA, generateOgImageUrl } from '../src/config/seo-metadata';

interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
}

interface ContentfulResponse {
  items: Array<{
    fields: BlogPostFields;
  }>;
}

async function fetchBlogPost(slug: string, env: any): Promise<BlogPostFields | null> {
  const spaceId = env.CONTENTFUL_SPACE_ID;
  const accessToken = env.CONTENTFUL_ACCESS_TOKEN;
  
  if (!spaceId || !accessToken) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=blogPost&fields.slug=${slug}&limit=1`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data: ContentfulResponse = await response.json();
    return data.items[0]?.fields || null;
  } catch {
    return null;
  }
}

interface RouteMetadata {
  title: string;
  description: string;
  type: string;
  keywords?: string[];
}

async function getRouteMetadata(path: string, env: any): Promise<RouteMetadata> {
  // Check for exact match first
  if (path in ROUTE_METADATA) {
    return ROUTE_METADATA[path as keyof typeof ROUTE_METADATA];
  }

  // Handle blog post pages - fetch real data from Contentful
  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '');
    const blogPost = await fetchBlogPost(slug, env);
    
    if (blogPost) {
      return {
        title: blogPost.title,
        description: blogPost.excerpt,
        type: 'article',
        keywords: ['cybersecurity', 'blog', 'security'],
      };
    }
    
    // Fallback if blog post not found
    return {
      title: `Blog Post | ${SITE_NAME}`,
      description: 'Read the latest insights on cybersecurity.',
      type: 'article',
    };
  }

  // Default fallback
  return ROUTE_METADATA['/'];
}

async function generateMetaTags(baseUrl: string, path: string, env: any): Promise<string> {
  const metadata = await getRouteMetadata(path, env);
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
  const { request, next, env } = context;
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
  const baseUrl = (env as any).CF_PAGES_URL || `${url.protocol}//${url.host}`;

  // Get original HTML and inject meta tags
  let html = await response.text();
  const metaTags = await generateMetaTags(baseUrl, path, env);
  
  // Insert meta tags after <head> tag
  html = html.replace('<head>', `<head>${metaTags}`);

  // Create new headers with CSP
  const newHeaders = new Headers(response.headers);
  newHeaders.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://cdn.contentful.com https://images.ctfassets.net; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );

  return new Response(html, {
    status: response.status,
    headers: newHeaders,
  });
};
