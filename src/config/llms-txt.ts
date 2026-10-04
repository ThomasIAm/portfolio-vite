// Builds /llms.txt at build time from the route metadata, so new core pages and
// blog posts appear automatically. Hand-written parts live in the constants below.
import { MARKDOWN_PATHS, ROUTE_METADATA } from "./seo-metadata";
import { siteConfig } from "./site";

export interface LlmsPost {
  fields: { title: string; slug: string; excerpt?: string; publishedDate?: string };
}

export const LLMS_RECENT_POSTS = 10;

const SUMMARY =
  "Lead Cyber Security Consultant in the Netherlands. Cloudflare Solutions Architect specializing in Zero Trust, SASE, WAF, and Cloudflare Workers. Lead consultant at SALT Cyber Security (Cloudflare PowerUP+ partner NL).";

const EXPERTISE = [
  "Cloudflare: WAF, CDN, Load Balancing, DNS, Magic Transit, Magic WAN",
  "Zero Trust / SASE: Access, Gateway, Tunnel, Browser Isolation, CASB",
  "Developer Platform: Workers, Pages, R2, D1, Durable Objects",
  "Security: DDoS mitigation, Bot Management, API Shield, Page Shield",
  "Compliance: NIS2, ISO 27001 alignment",
  "Adjacent: Red Hat OpenShift administration, DevSecOps",
];

/** Short page name: "Home" for "/", otherwise the title before " | ". */
export function pageLabel(path: string): string {
  if (path === "/") return "Home";
  return ROUTE_METADATA[path].title.split(" | ")[0];
}

const url = (path: string) => `${siteConfig.siteUrl}${path === "/" ? "/" : path}`;

export function buildLlmsTxt(posts: LlmsPost[] = []): string {
  const markdownList = MARKDOWN_PATHS.map((p) => `${pageLabel(p)} (${p})`).join(", ");
  const corePages = Object.keys(ROUTE_METADATA)
    .filter((p) => p !== "/blog")
    .map((p) => `- [${pageLabel(p)}](${url(p)}): ${ROUTE_METADATA[p].description}`);

  const recent = [...posts]
    .filter((p) => p.fields?.slug && p.fields?.title)
    .sort((a, b) => (b.fields.publishedDate ?? "").localeCompare(a.fields.publishedDate ?? ""))
    .slice(0, LLMS_RECENT_POSTS)
    .map((p) => {
      const desc = p.fields.excerpt ? `: ${p.fields.excerpt}` : "";
      return `- [${p.fields.title}](${url(`/blog/${p.fields.slug}`)})${desc}`;
    });

  return [
    `# ${siteConfig.name}`,
    "",
    `> ${SUMMARY}`,
    "",
    `Send \`Accept: text/markdown\` to get a Markdown version of these pages: ${markdownList} and every blog post (/blog/<slug>). Other pages return HTML.`,
    "",
    "## Core pages",
    "",
    ...corePages,
    "",
    "## Writing",
    "",
    `- [Blog](${url("/blog")}): ${ROUTE_METADATA["/blog"].description}`,
    ...recent,
    `- [Sitemap](${url("/sitemap.xml")}): Full machine-readable index of all pages and blog posts.`,
    "",
    "## Machine-readable",
    "",
    `- [OpenAPI schema](${url("/openapi.json")}): Schema for site Cloudflare Functions (search, OG metadata, preview).`,
    `- [robots.txt](${url("/robots.txt")}): Crawler policy. AI training and search indexing are allowed.`,
    "",
    "## Expertise",
    "",
    ...EXPERTISE.map((e) => `- ${e}`),
    "",
  ].join("\n");
}
