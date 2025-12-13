import { useQuery } from '@tanstack/react-query';
import type { BlogPost } from '@/lib/contentful';
import blogPostsData from '@/data/blog-posts.json';

// Cast the imported JSON to the correct type
const blogPosts = blogPostsData as BlogPost[];

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
