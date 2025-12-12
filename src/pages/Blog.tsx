import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { calculateReadingTime } from "@/lib/contentful";
import { format } from "date-fns";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const INITIAL_POSTS_COUNT = 5;

export default function Blog() {
  const { data: posts, isLoading, error } = useBlogPosts();
  const [showAll, setShowAll] = useState(false);
  
  const featuredPosts = posts?.filter((post) => post.fields.featured) || [];
  const regularPosts = posts?.filter((post) => !post.fields.featured) || [];
  const visibleRegularPosts = showAll ? regularPosts : regularPosts.slice(0, INITIAL_POSTS_COUNT);

  return (
    <Layout>
      <SEO
        title="Blog"
        description="Insights on cyber security, leadership, and technology from Thomas van den Nieuwenhoff. Expert articles on Cloudflare, Zero Trust, and DevSecOps."
        canonical="/blog"
        keywords={[
          "cyber security blog",
          "security articles",
          "Cloudflare insights",
          "Zero Trust architecture",
          "DevSecOps",
        ]}
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Thoughts on cyber security, leadership, and navigating the digital
              landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts Carousel */}
      {featuredPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
              Featured Posts
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: featuredPosts.length > 1,
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent className="-ml-4">
                {featuredPosts.map((post) => {
                  const fields = post.fields;
                  const readingTime = calculateReadingTime(fields.content);
                  const coverImageUrl = fields.coverImage?.fields?.file?.url
                    ? `https:${fields.coverImage.fields.file.url}`
                    : null;

                  return (
                    <CarouselItem key={post.sys.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
                      <Link to={`/blog/${fields.slug}`} className="block h-full">
                        <article className="h-full rounded-2xl bg-card shadow-soft overflow-hidden group hover:shadow-md transition-shadow">
                          {coverImageUrl && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={coverImageUrl}
                                alt={fields.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                              Featured
                            </span>
                            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {fields.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {fields.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(fields.publishedDate), "MMM d, yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {readingTime}
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              {featuredPosts.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:flex -left-12" />
                  <CarouselNext className="hidden md:flex -right-12" />
                </>
              )}
            </Carousel>
          </div>
        </section>
      )}

      {/* Blog Posts */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {isLoading && (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-8 rounded-2xl bg-card shadow-soft animate-pulse"
                  >
                    <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="p-8 rounded-2xl bg-card shadow-soft text-center">
                <p className="text-muted-foreground">
                  Unable to load blog posts. Please check your configuration.
                </p>
              </div>
            )}

            {posts && posts.length === 0 && (
              <article className="p-8 rounded-2xl bg-card shadow-soft animate-fade-up">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Coming Soon
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Blog Posts Coming Soon
                </h2>
                <p className="text-muted-foreground text-lg">
                  I'm working on some exciting content about cyber security,
                  team leadership, and the intersection of technology and
                  business. Stay tuned for insights from the field.
                </p>
              </article>
            )}

            {regularPosts.length > 0 && (
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                All Posts
              </h2>
            )}

            {visibleRegularPosts.map((post, index) => {
              const fields = post.fields;
              const readingTime = calculateReadingTime(fields.content);

              return (
                <article
                  key={post.sys.id}
                  className="p-8 rounded-2xl bg-card shadow-soft animate-fade-up mb-6 hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <Link to={`/blog/${fields.slug}`}>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 hover:text-primary transition-colors">
                      {fields.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground text-lg mb-6">
                    {fields.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(
                          new Date(fields.publishedDate),
                          "MMM d, yyyy"
                        )}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {readingTime}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${fields.slug}`}
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      Read more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}

            {regularPosts.length > INITIAL_POSTS_COUNT && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowAll(!showAll)}
                  className="gap-2"
                >
                  {showAll ? "Show Less" : `Show More (${regularPosts.length - INITIAL_POSTS_COUNT} more)`}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
                </Button>
              </div>
            )}

            {/* Newsletter Signup */}
            <div
              className="mt-16 p-8 rounded-2xl bg-muted/50 text-center animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Want to be notified when new posts are published?
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect with me on LinkedIn or check back here regularly for
                updates.
              </p>
              <a
                href="https://linkedin.com/in/tvdn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Follow on LinkedIn
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
