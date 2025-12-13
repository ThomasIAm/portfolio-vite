import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { calculateReadingTime } from "@/lib/contentful";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { SEO } from "@/components/seo/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";

const Series = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: posts = [], isLoading } = useBlogPosts();

  // Find all posts in this series
  const seriesPosts = posts.filter(
    (post) => post.fields.series?.fields.title.toLowerCase().replace(/\s+/g, '-') === slug
  );

  // Get series info from first post
  const series = seriesPosts[0]?.fields.series;

  // Sort by published date
  const sortedPosts = [...seriesPosts].sort((a, b) => {
    const dateA = new Date(a.fields.publishedDate || a.sys.createdAt);
    const dateB = new Date(b.fields.publishedDate || b.sys.createdAt);
    return dateA.getTime() - dateB.getTime();
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!series || seriesPosts.length === 0) {
    return (
      <Layout>
        <SEO title="Series Not Found" description="The requested series could not be found." />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Series not found</h1>
          <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${series.fields.title} Series`}
        description={series.fields.description || `Read all posts in the ${series.fields.title} series.`}
      />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="container relative">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Series
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {series.fields.title}
            </h1>
            {series.fields.description && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {series.fields.description}
              </p>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'} in this series
            </p>
          </div>
        </div>
      </section>

      {/* Posts List */}
      <section className="pb-16 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            {sortedPosts.map((post, index) => {
              const fields = post.fields;
              const readingTime = calculateReadingTime(fields.content);
              const publishedDate = fields.publishedDate
                ? new Date(fields.publishedDate)
                : new Date(post.sys.createdAt);

              return (
                <Link
                  key={post.sys.id}
                  to={`/blog/${fields.slug}`}
                  className="block group"
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {fields.coverImage && (
                          <div className="md:w-64 md:flex-shrink-0 md:min-h-[180px]">
                            <OptimizedImage
                              src={`https:${fields.coverImage.fields.file.url}`}
                              alt={fields.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {index + 1}
                            </span>
                            <span>Part {index + 1}</span>
                          </div>
                          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {fields.title}
                          </h2>
                          <p className="text-muted-foreground line-clamp-2 mb-4">
                            {fields.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(publishedDate, "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {readingTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Series;
