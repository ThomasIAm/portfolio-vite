import { useQuery } from '@tanstack/react-query';
import { getBlogPosts, getBlogPost, type BlogPost } from '@/lib/contentful';

export function useBlogPosts() {
  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBlogPost(slug: string) {
  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPost(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
