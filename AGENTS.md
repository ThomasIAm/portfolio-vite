
- Link-preview metadata for published posts is fetched at build time (scripts/fetch-content.mjs); runtime external fetching is only allowed behind Cloudflare Access, to prevent SSRF/open-proxy abuse.
