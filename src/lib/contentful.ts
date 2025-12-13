// Types and utilities for blog content (static data loaded at build time)

// Contentful Rich Text Document type
export interface RichTextDocument {
  nodeType: 'document';
  data: Record<string, unknown>;
  content: RichTextNode[];
}

export interface RichTextNode {
  nodeType: string;
  data: Record<string, unknown>;
  content?: RichTextNode[];
  value?: string;
  marks?: { type: string }[];
}

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
  bio?: RichTextDocument;
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
  description?: RichTextDocument;
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

// Extract plain text from Contentful Rich Text Document
export function richTextToPlainText(doc: RichTextDocument | undefined): string {
  if (!doc || !doc.content) return '';
  
  const extractText = (nodes: RichTextNode[]): string => {
    return nodes.map(node => {
      if (node.value) return node.value;
      if (node.content) return extractText(node.content);
      return '';
    }).join('');
  };
  
  return extractText(doc.content);
}
