# Architecture rules

- Non-blog Markdown for agents comes from Cloudflare Browser Run for allowlisted paths only (`MARKDOWN_PATHS` in `src/config/seo-metadata.ts`), cached with the Workers Cache API. Why: SPA pages have no Markdown source, and an allowlist prevents rendering arbitrary URLs.

- Don't rely on the Cloudflare CDN cache for Markdown variants. Why: the CDN ignores `Vary: Accept`, so HTML and Markdown on the same URL would collide.

- Link-preview metadata for published posts is fetched at build time (scripts/fetch-content.mjs); runtime external fetching is only allowed behind Cloudflare Access, to prevent SSRF/open-proxy abuse.

- Dismiss intentional SonarCloud findings by marking them "Accepted" in the SonarCloud dashboard with a reason; keep an explanatory code comment, no inline suppression (NOSONAR silences every rule on the line).

- CI (GitHub Actions) builds with sample content and read-only permissions, actions pinned to SHAs — keeps secrets out of PR runs and blocks supply-chain drift.

- `/llms.txt` is generated at build time from route metadata and fetched posts (src/config/llms-txt.ts); never hand-edit a static copy. Why: new pages and posts must appear without manual upkeep.
