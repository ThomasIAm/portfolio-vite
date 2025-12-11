// Middleware to inject SEO meta tags into HTML for all requests

interface RouteMetadata {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
}

const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'Thomas van den Nieuwenhoff | Lead Cyber Security Consultant',
    description: 'Lead Cyber Security Consultant with expertise in Cloudflare, Zero Trust architecture, and OpenShift. Helping businesses secure their digital infrastructure.',
    type: 'website',
  },
  '/about': {
    title: 'About | Thomas van den Nieuwenhoff',
    description: 'Learn about my journey in cyber security, certifications, and professional experience as a Lead Cyber Security Consultant.',
    type: 'profile',
  },
  '/blog': {
    title: 'Blog | Thomas van den Nieuwenhoff',
    description: 'Insights on cyber security, cloud infrastructure, Zero Trust, and modern security practices from a Lead Cyber Security Consultant.',
    type: 'website',
  },
  '/projects': {
    title: 'Projects | Thomas van den Nieuwenhoff',
    description: 'Explore my professional and personal projects in cyber security, cloud infrastructure, and development.',
    type: 'website',
  },
  '/contact': {
    title: 'Contact | Thomas van den Nieuwenhoff',
    description: 'Get in touch with me for cyber security consulting, speaking engagements, or collaboration opportunities.',
    type: 'website',
  },
};

function generateOgImageUrl(baseUrl: string, title: string, description: string, type: string): string {
  const params = new URLSearchParams({
    title,
    description: description.slice(0, 150),
    type,
  });
  return `${baseUrl}/og?${params.toString()}`;
}

function generateMetaTags(baseUrl: string, path: string, metadata: RouteMetadata): string {
  const { title, description, type } = metadata;
  const canonicalUrl = `${baseUrl}${path}`;
  const ogImage = generateOgImageUrl(baseUrl, title, description, type);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="Thomas van den Nieuwenhoff" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:site_name" content="Thomas van den Nieuwenhoff" />
    
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

  // Get metadata for this route
  let metadata = ROUTE_METADATA[path];

  // For blog posts, generate dynamic metadata from slug
  if (!metadata && path.startsWith('/blog/') && path !== '/blog') {
    const slug = path.replace('/blog/', '');
    const formattedTitle = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    metadata = {
      title: `${formattedTitle} | Thomas van den Nieuwenhoff`,
      description: `Read "${formattedTitle}" - a blog post by Thomas van den Nieuwenhoff, Lead Cyber Security Consultant.`,
      type: 'article',
    };
  }

  // Default fallback
  if (!metadata) {
    metadata = ROUTE_METADATA['/'];
  }

  // Get original HTML and inject meta tags
  let html = await response.text();
  const metaTags = generateMetaTags(baseUrl, path, metadata);
  
  // Insert meta tags after <head> tag
  html = html.replace('<head>', `<head>${metaTags}`);

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};
