import { createClient, ContentfulClientApi } from 'contentful';

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

let client: ContentfulClientApi<undefined> | null = null;

if (spaceId && accessToken) {
  client = createClient({
    space: spaceId,
    accessToken: accessToken,
  });
}

export interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  modifiedDate: string;
  featured?: boolean;
}

export interface BlogPost {
  sys: {
    id: string;
  };
  fields: BlogPostFields;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!client) {
    console.warn('Contentful not configured. Add VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN.');
    return [];
  }
  const response = await client.getEntries({
    content_type: 'blogPost',
    order: ['-sys.createdAt'],
  });
  return response.items as unknown as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!client) {
    console.warn('Contentful not configured. Add VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN.');
    return null;
  }
  const response = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  } as any);
  return (response.items[0] as unknown as BlogPost) || null;
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
