export interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
}
export function extractStandaloneLinks(markdown: unknown): string[];
export function isAllowedPreviewUrl(href: string): boolean;
export function extractOgMetadata(html: string, pageUrl: string): OGMetadata;
export function fetchOgMetadata(href: string): Promise<OGMetadata>;
