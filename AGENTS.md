
- Link-preview metadata for published posts is fetched at build time (scripts/fetch-content.mjs); runtime external fetching is only allowed behind Cloudflare Access, to prevent SSRF/open-proxy abuse.

- Suppress static-analysis findings with SonarCloud `// NOSONAR: <reason>` on the offending line, not ESLint disable comments — SonarCloud is the analyzer in use.
