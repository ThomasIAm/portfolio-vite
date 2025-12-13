// Types and utilities for blog content (static data loaded at build time)

export interface ContentfulAsset {
  fields: {
    file: {
      url: string;
    };
    title?: string;
  };
}

export interface BlogSeries {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
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
  series?: BlogSeries;
}

export interface BlogPost {
  sys: {
    id: string;
  };
  fields: BlogPostFields;
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
