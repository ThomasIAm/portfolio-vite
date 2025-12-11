import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";

export default function Privacy() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/PRIVACY.md")
      .then((res) => res.text())
      .then(setContent)
      .catch(console.error);
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
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        </div>
      </section>
    </Layout>
  );
}
