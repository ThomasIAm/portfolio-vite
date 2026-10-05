import { Link } from "react-router-dom";
import { Head } from "@unhead/react";
import { Seo } from "@/components/seo/SEO";
import { siteConfig } from "@/config/site";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Seo
        title={`Page Not Found | ${siteConfig.name}`}
        description="The page you're looking for doesn't exist or has moved."
      />
      {/* Overrides the sitewide "index, follow" so error pages stay out of search results. */}
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
