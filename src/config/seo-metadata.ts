export interface RouteMetadata {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
  keywords?: string[];
}

export const SITE_NAME = 'Thomas van den Nieuwenhoff';
export const DEFAULT_AUTHOR = SITE_NAME;

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'Thomas van den Nieuwenhoff | Lead Cyber Security Consultant',
    description: 'Lead Cyber Security Consultant with expertise in Cloudflare, Zero Trust architecture, and OpenShift. Helping businesses secure their digital infrastructure.',
    type: 'website',
    keywords: ['cyber security consultant', 'Cloudflare expert', 'Zero Trust', 'OpenShift administrator', 'security architect', 'Netherlands', 'DevSecOps'],
  },
  '/about': {
    title: 'About | Thomas van den Nieuwenhoff',
    description: 'Learn about my journey in cyber security, certifications, and professional experience as a Lead Cyber Security Consultant.',
    type: 'profile',
    keywords: ['cyber security', 'certifications', 'professional experience', 'Cloudflare', 'Red Hat'],
  },
  '/blog': {
    title: 'Blog | Thomas van den Nieuwenhoff',
    description: 'Insights on cyber security, cloud infrastructure, Zero Trust, and modern security practices from a Lead Cyber Security Consultant.',
    type: 'website',
    keywords: ['cyber security blog', 'cloud security', 'Zero Trust', 'security insights'],
  },
  '/projects': {
    title: 'Projects | Thomas van den Nieuwenhoff',
    description: 'Explore my professional and personal projects in cyber security, cloud infrastructure, and development.',
    type: 'website',
    keywords: ['cyber security projects', 'cloud infrastructure', 'open source', 'development'],
  },
  '/contact': {
    title: 'Contact | Thomas van den Nieuwenhoff',
    description: 'Get in touch with me for cyber security consulting, speaking engagements, or collaboration opportunities.',
    type: 'website',
    keywords: ['contact', 'cyber security consulting', 'collaboration'],
  },
};

export function getRouteMetadata(path: string): RouteMetadata {
  // Direct match
  if (ROUTE_METADATA[path]) {
    return ROUTE_METADATA[path];
  }

  // Blog post pattern
  if (path.startsWith('/blog/') && path !== '/blog') {
    const slug = path.replace('/blog/', '');
    const formattedTitle = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      title: `${formattedTitle} | ${SITE_NAME}`,
      description: `Read "${formattedTitle}" - a blog post by ${SITE_NAME}, Lead Cyber Security Consultant.`,
      type: 'article',
    };
  }

  // Default fallback
  return ROUTE_METADATA['/'];
}

export function generateOgImageUrl(baseUrl: string, title: string, description: string, type: string): string {
  const params = new URLSearchParams({
    title,
    description: description.slice(0, 150),
    type,
  });
  return `${baseUrl}/og?${params.toString()}`;
}
