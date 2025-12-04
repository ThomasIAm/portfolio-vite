import { createClient } from 'contentful';

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
});

export interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  featured?: boolean;
}

export interface BlogPost {
  sys: {
    id: string;
  };
  fields: BlogPostFields;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await client.getEntries({
    content_type: 'blogPost',
    order: ['-sys.createdAt'],
  });
  return response.items as unknown as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
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
