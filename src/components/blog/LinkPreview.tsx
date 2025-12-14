import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FileText } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';

interface OGMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
}

interface LinkPreviewProps {
  href: string;
}

export function LinkPreview({ href }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<OGMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { data: posts } = useBlogPosts();

  const isInternal = href.startsWith('/blog/') || href.includes(window.location.hostname + '/blog/');

  useEffect(() => {
    async function fetchMetadata() {
      setLoading(true);
      setError(false);

      try {
        if (isInternal) {
          // Extract slug from internal blog link
          const slug = href.includes('/blog/') 
            ? href.split('/blog/')[1]?.split(/[?#]/)[0] 
            : null;

          if (slug && posts) {
            const post = posts.find((p) => p.fields.slug === slug);
            if (post) {
              const coverImageUrl = post.fields.coverImage?.fields?.file?.url
                ? `https:${post.fields.coverImage.fields.file.url}`
                : undefined;

              setMetadata({
                title: post.fields.title,
                description: post.fields.excerpt,
                image: coverImageUrl,
                siteName: 'Blog',
                url: `/blog/${slug}`,
              });
              setLoading(false);
              return;
            }
          }
        }

        // Fetch external OG metadata
        const response = await fetch(`/api/og-metadata?url=${encodeURIComponent(href)}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        setMetadata(data);
      } catch (err) {
        console.error('Error fetching link preview:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMetadata();
  }, [href, isInternal, posts]);

  if (loading) {
    return (
      <div className="my-4 rounded-lg border border-border bg-card p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-muted rounded shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !metadata?.title) {
    // Fallback to simple link
    return (
      <a
        href={href}
        className="text-primary hover:underline inline-flex items-center gap-1"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {href}
        {href.startsWith('http') && <ExternalLink className="h-3 w-3" />}
      </a>
    );
  }

  const PreviewCard = (
    <div className="my-4 rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow group">
      <div className="flex flex-col sm:flex-row">
        {metadata.image ? (
          <div className="sm:w-48 h-32 sm:h-auto shrink-0 overflow-hidden bg-muted">
            <img
              src={metadata.image}
              alt={metadata.title || ''}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="sm:w-48 h-32 sm:h-auto shrink-0 bg-muted flex items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="p-4 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span className="truncate">{metadata.siteName || new URL(href).hostname}</span>
            {!isInternal && <ExternalLink className="h-3 w-3 shrink-0" />}
          </div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {metadata.title}
          </h4>
          {metadata.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {metadata.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (isInternal && metadata.url) {
    return <Link to={metadata.url}>{PreviewCard}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block no-underline">
      {PreviewCard}
    </a>
  );
}
