import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BlogContent } from '@/components/blog/BlogContent';
import { useBlogPost } from '@/hooks/useBlogPosts';
import { calculateReadingTime } from '@/lib/contentful';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-64 bg-muted rounded mt-8" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Post not found
              </h1>
              <p className="text-muted-foreground mb-8">
                The blog post you're looking for doesn't exist.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const fields = post.fields;
  const readingTime = calculateReadingTime(fields.content);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <Link
              to="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {fields.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(fields.publishedDate), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container">
          <article className="max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <BlogContent content={fields.content} />
          </article>
        </div>
      </section>
    </Layout>
  );
}
