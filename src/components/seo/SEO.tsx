import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  keywords?: string[];
  publishedDate?: string;
  modifiedDate?: string;
  author?: string;
  structuredData?: object;
}

const BASE_URL = import.meta.env.VITE_CF_PAGES_URL || "";
const SITE_NAME = "Thomas van den Nieuwenhoff";

// Generate dynamic OG image URL
function generateOgImageUrl(title: string, description: string, type: string): string {
  const params = new URLSearchParams({
    title,
    description: description.slice(0, 150),
    type,
  });
  return `${BASE_URL}/og?${params.toString()}`;
}

export function SEO({
  title,
  description,
  canonical,
  type = "website",
  image,
  keywords = [],
  publishedDate,
  modifiedDate,
  author = SITE_NAME,
  structuredData,
}: SEOProps) {
  const fullTitle = title;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const ogImage = generateOgImageUrl(title, description, type);

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "BlogPosting" : type === "profile" ? "ProfilePage" : "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    image: ogImage,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: BASE_URL,
      jobTitle: "Lead Cyber Security Consultant",
      sameAs: [
        "https://linkedin.com/in/tvdn",
      ],
    },
    ...(publishedDate && { datePublished: publishedDate }),
    ...(modifiedDate && { dateModified: modifiedDate }),
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific */}
      {type === "article" && publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {type === "article" && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {type === "article" && <meta property="article:author" content={author} />}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
}
