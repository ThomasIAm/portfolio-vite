// Middleware to inject SEO meta tags for social media crawlers
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'Googlebot',
  'bingbot',
];

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

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

function generateOgImageUrl(baseUrl: string, title: string, description: string, type: string): string {
  const params = new URLSearchParams({
    title,
    description: description.slice(0, 150),
    type,
  });
  return `${baseUrl}/og?${params.toString()}`;
}

function generateMetaHtml(baseUrl: string, path: string, metadata: RouteMetadata): string {
  const { title, description, type } = metadata;
  const canonicalUrl = `${baseUrl}${path}`;
  const ogImage = generateOgImageUrl(baseUrl, title, description, type);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
</body>
</html>`;
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const userAgent = request.headers.get('user-agent') || '';
  
  // If not a bot, continue to normal response
  if (!isBot(userAgent)) {
    return next();
  }

  const url = new URL(request.url);
  const path = url.pathname;
  
  // Skip for actual assets and the OG image endpoint
  if (path.startsWith('/og') || path.startsWith('/assets') || path.includes('.')) {
    return next();
  }

  // Get base URL from CF_PAGES_URL or construct from request
  const baseUrl = (context.env as any).CF_PAGES_URL || `${url.protocol}//${url.host}`;
  
  // Check if we have predefined metadata for this route
  let metadata = ROUTE_METADATA[path];
  
  // For blog posts, generate dynamic metadata
  if (!metadata && path.startsWith('/blog/') && path !== '/blog') {
    const slug = path.replace('/blog/', '');
    // Format slug as title (replace hyphens with spaces, capitalize)
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

  // If no metadata found, use default
  if (!metadata) {
    metadata = ROUTE_METADATA['/'];
  }

  const html = generateMetaHtml(baseUrl, path, metadata);
  
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
};
