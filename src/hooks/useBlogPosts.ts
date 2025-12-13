import { useQuery } from '@tanstack/react-query';
import type { BlogPost } from '@/lib/contentful';
import blogPostsData from '@/data/blog-posts.json';

// Handle both array format and raw Contentful response format
function parseBlogPosts(): BlogPost[] {
  const data = blogPostsData as unknown;
  
  // If it's already an array, use it directly
  if (Array.isArray(data)) {
    return data as BlogPost[];
  }
  
  // If it's a Contentful response object with items
  if (data && typeof data === 'object' && 'items' in data) {
    return (data as { items: BlogPost[] }).items;
  }
  
  // Fallback to empty array
  return [];
}

const blogPosts = parseBlogPosts();

export function useBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: () => Promise.resolve(blogPosts),
    staleTime: Infinity, // Static data never goes stale
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', slug],
    queryFn: () => {
      const post = blogPosts.find((p) => p.fields.slug === slug);
      return Promise.resolve(post || null);
    },
    enabled: !!slug,
    staleTime: Infinity,
  });
}
