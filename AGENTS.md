# Architecture rules

- Non-blog Markdown for agents comes from Cloudflare Browser Run for allowlisted paths only (`MARKDOWN_PATHS` in `src/config/seo-metadata.ts`), cached with the Workers Cache API. Why: SPA pages have no Markdown source, and an allowlist prevents rendering arbitrary URLs.
- Don't rely on the Cloudflare CDN cache for Markdown variants. Why: the CDN ignores `Vary: Accept`, so HTML and Markdown on the same URL would collide.
