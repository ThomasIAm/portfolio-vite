import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { BlogContent } from "@/components/blog/BlogContent";

export default function Privacy() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/PRIVACY.md")
      .then((res) => res.text())
      .then(setContent)
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description="Learn about how we collect, use, and protect your personal information."
        canonical="/privacy"
      />

      <section className="py-16 sm:py-24">
        <div className="container max-w-3xl">
          <BlogContent content={content} />
        </div>
      </section>
    </Layout>
  );
}
