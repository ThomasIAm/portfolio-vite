import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { BlogContent } from "@/components/blog/BlogContent";

export default function Cookies() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/COOKIES.md")
      .then((res) => res.text())
      .then(setContent)
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <SEO
        title="Cookie Policy"
        description="Learn about how we use cookies and similar technologies on our website."
        canonical="/cookies"
      />

      <section className="py-16 sm:py-24">
        <div className="container max-w-3xl">
          <BlogContent content={content} />
        </div>
      </section>
    </Layout>
  );
}
