import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BlogContent } from "@/components/blog/BlogContent";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { calculateReadingTime } from "@/lib/contentful";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { SEO } from "@/components/seo/SEO";
import { LoadingAnimation, EmptyStateAnimation, LottieAnimation, LOTTIE_ANIMATIONS } from "@/components/ui/lottie-animation";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <SEO
          title="Loading..."
          description="Loading blog post"
          canonical={`/blog/${slug}`}
        />
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center">
              <LoadingAnimation className="w-32 h-32" />
              <p className="text-muted-foreground mt-4">Loading post...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <SEO
          title="Post Not Found"
          description="The blog post you're looking for doesn't exist."
          canonical="/blog"
        />
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
              <EmptyStateAnimation className="w-48 h-48" />
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

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: fields.title,
    description: fields.excerpt,
    datePublished: fields.publishedDate,
    dateModified: fields.modifiedDate,
    author: {
      "@type": "Person",
      name: "Thomas van den Nieuwenhoff",
      url: "https://tvdn.me",
    },
    publisher: {
      "@type": "Person",
      name: "Thomas van den Nieuwenhoff",
      url: "https://tvdn.me",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tvdn.me/blog/${fields.slug}`,
    },
  };

  return (
    <Layout>
      <SEO
        title={fields.title}
        description={fields.excerpt}
        canonical={`/blog/${fields.slug}`}
        type="article"
        publishedDate={fields.publishedDate}
        keywords={["cyber security", "blog", fields.title.toLowerCase()]}
        structuredData={articleStructuredData}
      />
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <LottieAnimation
            src={LOTTIE_ANIMATIONS.dataFlow}
            className="absolute -left-10 top-0 w-72 h-72"
          />
        </div>
        <div className="container relative z-10">
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
                {format(new Date(fields.publishedDate), "MMMM d, yyyy")}
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
          <article
            className="max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <BlogContent content={fields.content} />
          </article>
        </div>
      </section>
    </Layout>
  );
}
