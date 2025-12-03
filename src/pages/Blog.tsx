import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  {
    slug: "coming-soon",
    title: "Blog Coming Soon",
    excerpt: "I'm working on some exciting content about cyber security, team leadership, and the intersection of technology and business. Stay tuned for insights from the field.",
    date: "2024",
    readTime: "Coming soon",
    featured: true,
  },
];

export default function Blog() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-hero">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Thoughts on cyber security, leadership, and navigating the digital landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="p-8 rounded-2xl bg-card shadow-soft animate-fade-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                {post.featured && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                    Featured
                  </span>
                )}
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </span>
                </div>
              </article>
            ))}

            {/* Newsletter Signup Placeholder */}
            <div className="mt-16 p-8 rounded-2xl bg-muted/50 text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Want to be notified when new posts are published?
              </h3>
              <p className="text-muted-foreground mb-6">
                Connect with me on LinkedIn or check back here regularly for updates.
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
