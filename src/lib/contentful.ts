import { createClient, ContentfulClientApi } from 'contentful';

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const previewToken = import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN;

// Use Preview API if preview token is provided (shows published + drafts)
const usePreviewApi = !!previewToken;

let client: ContentfulClientApi<undefined> | null = null;

if (spaceId && (accessToken || previewToken)) {
  client = createClient({
    space: spaceId,
    accessToken: usePreviewApi ? previewToken : accessToken,
    host: usePreviewApi ? 'preview.contentful.com' : 'cdn.contentful.com',
  });
}

export interface ContentfulAsset {
  fields: {
    file: {
      url: string;
    };
    title?: string;
  };
}

export interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  modifiedDate?: string;
  featured?: boolean;
  coverImage?: ContentfulAsset;
  sameSubjectPosts?: BlogPost[];
}

export interface BlogPost {
  sys: {
    id: string;
  };
  fields: BlogPostFields;
}

function isValidBlogPost(item: unknown): item is BlogPost {
  const post = item as BlogPost;
  const fields = post?.fields;
  return !!(
    post?.sys?.id &&
    fields?.title &&
    fields?.slug &&
    fields?.excerpt &&
    fields?.content &&
    fields?.publishedDate
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!client) {
    return [];
  }
  const response = await client.getEntries({
    content_type: 'blogPost',
    order: ['-sys.createdAt'],
  });
  return (response.items as unknown as BlogPost[]).filter(isValidBlogPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!client) {
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
