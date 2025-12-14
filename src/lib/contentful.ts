// Types and utilities for blog content (static data loaded at build time)

// Contentful metadata
export interface ContentfulMetadata {
  tags: unknown[];
  concepts: unknown[];
}

// Contentful sys link
export interface ContentfulSysLink {
  sys: {
    type: 'Link';
    linkType: string;
    id: string;
  };
}

// Contentful sys object
export interface ContentfulSys {
  space: ContentfulSysLink;
  type: 'Entry' | 'Asset';
  id: string;
  contentType?: ContentfulSysLink;
  revision: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  firstPublishedAt?: string;
  publishedVersion?: number;
  environment: ContentfulSysLink;
  locale: string;
}

// Contentful Asset
export interface ContentfulAsset {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

// Blog Author
export interface BlogAuthorFields {
  name: string;
  bio?: string;
  avatar?: ContentfulAsset;
  link?: string;
}

export interface BlogAuthor {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: BlogAuthorFields;
}

// Blog Series
export interface BlogSeriesFields {
  title: string;
  description?: string;
}

export interface BlogSeries {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: BlogSeriesFields;
}

// Blog Post
export interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  modifiedDate?: string;
  featured?: boolean;
  author?: BlogAuthor[];
  coverImage?: ContentfulAsset;
  sameSubjectPosts?: BlogPost[];
  series?: BlogSeries;
}

export interface BlogPost {
  metadata: ContentfulMetadata;
  sys: ContentfulSys;
  fields: BlogPostFields;
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
