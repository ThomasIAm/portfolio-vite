import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  getOptimizedImageUrl,
  getResponsiveSrcSet,
  ImageTransformOptions,
  IMAGE_PRESETS,
} from '@/lib/cloudflare-image';

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  /** Cloudflare Image Transform options */
  transform?: ImageTransformOptions;
  /** Use a preset configuration */
  preset?: keyof typeof IMAGE_PRESETS;
  /** Enable responsive srcset generation */
  responsive?: boolean;
  /** Custom widths for srcset */
  responsiveWidths?: number[];
  /** Show loading skeleton */
  showSkeleton?: boolean;
  /** Fallback src if image fails to load */
  fallbackSrc?: string;
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      transform,
      preset,
      responsive = false,
      responsiveWidths,
      showSkeleton = true,
      fallbackSrc,
      className,
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Merge preset with custom transform options
    const options: ImageTransformOptions = {
      ...(preset ? IMAGE_PRESETS[preset] : {}),
      ...transform,
    };

    const optimizedSrc = getOptimizedImageUrl(src, options);
    const srcSet = responsive
      ? getResponsiveSrcSet(src, responsiveWidths, options)
      : undefined;

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasError(true);
      if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
        e.currentTarget.src = fallbackSrc;
      }
      onError?.(e);
    };

    return (
      <div className={cn('relative', showSkeleton && isLoading && 'bg-muted animate-pulse')}>
        <img
          ref={ref}
          src={hasError && fallbackSrc ? fallbackSrc : optimizedSrc}
          srcSet={srcSet}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoading && showSkeleton ? 'opacity-0' : 'opacity-100',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';
