declare module '@/data/blog-posts.json' {
  import type { BlogPost } from '@/lib/contentful';
  const value: BlogPost[];
  export default value;
}

declare module '@/data/link-previews.json' {
  const value: Record<string, { title?: string; description?: string; image?: string; siteName?: string; url?: string }>;
  export default value;
}
