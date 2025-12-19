/**
 * Cloudflare Image Transform utility
 * Generates optimized image URLs using Cloudflare's Image Resizing service
 * https://developers.cloudflare.com/images/transform-images/
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'json';
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  gravity?: 'auto' | 'center' | 'top' | 'bottom' | 'left' | 'right';
  background?: string;
  blur?: number;
  sharpen?: number;
  dpr?: number;
}

/**
 * Check if Cloudflare Image Transform is enabled
 * Controlled via VITE_ENABLE_CF_IMAGE_TRANSFORM environment variable
 * Falls back to hostname detection if not set
 */
function isCloudflareImageTransformEnabled(): boolean {
  // Check environment variable first
  const envValue = import.meta.env.VITE_ENABLE_CF_IMAGE_TRANSFORM;
  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1';
  }
  
  // Fallback: Check if we're on a Cloudflare Pages domain or custom domain
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return (
    hostname.endsWith('.pages.dev') ||
    hostname === 'tvdn.me' ||
    hostname.endsWith('.tvdn.me')
  );
}

/**
 * Build Cloudflare Image Transform URL parameters
 */
function buildTransformParams(options: ImageTransformOptions): string {
  const params: string[] = [];

  if (options.width) params.push(`width=${options.width}`);
  if (options.height) params.push(`height=${options.height}`);
  if (options.quality) params.push(`quality=${options.quality}`);
  if (options.format) params.push(`format=${options.format}`);
  if (options.fit) params.push(`fit=${options.fit}`);
  if (options.gravity) params.push(`gravity=${options.gravity}`);
  if (options.background) params.push(`background=${options.background}`);
  if (options.blur) params.push(`blur=${options.blur}`);
  if (options.sharpen) params.push(`sharpen=${options.sharpen}`);
  if (options.dpr) params.push(`dpr=${options.dpr}`);

  return params.join(',');
}

/**
 * Transform an image URL using Cloudflare Image Resizing
 * Falls back to original URL in non-Cloudflare environments
 */
export function getOptimizedImageUrl(
  src: string,
  options: ImageTransformOptions = {}
): string {
  // Skip transformation for:
  // - External URLs (already on CDN or different domain)
  // - Data URLs
  // - Non-Cloudflare environments (development)
  if (
    src.startsWith('data:') ||
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    !isCloudflareImageTransformEnabled()
  ) {
    return src;
  }

  // Default options for best performance
  const defaultOptions: ImageTransformOptions = {
    format: 'auto', // Serve WebP/AVIF when supported
    quality: 85,
    fit: 'cover',
    ...options,
  };

  const params = buildTransformParams(defaultOptions);
  
  if (!params) return src;

  // Ensure src starts with /
  const imagePath = src.startsWith('/') ? src : `/${src}`;
  
  return `/cdn-cgi/image/${params}${imagePath}`;
}

/**
 * Generate srcset for responsive images
 */
export function getResponsiveSrcSet(
  src: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536],
  options: Omit<ImageTransformOptions, 'width'> = {}
): string {
  if (!isCloudflareImageTransformEnabled()) {
    return '';
  }

  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(src, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Common image size presets
 */
export const IMAGE_PRESETS = {
  thumbnail: { width: 150, height: 150, fit: 'cover' as const },
  avatar: { width: 200, height: 200, fit: 'cover' as const },
  avatarLarge: { width: 400, height: 400, fit: 'cover' as const },
  card: { width: 400, height: 300, fit: 'cover' as const },
  hero: { width: 1200, height: 600, fit: 'cover' as const },
  full: { width: 1920, quality: 90 },
} as const;
