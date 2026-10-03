
- Link-preview metadata for published posts is fetched at build time (scripts/fetch-content.mjs); runtime external fetching is only allowed behind Cloudflare Access, to prevent SSRF/open-proxy abuse.

- Dismiss intentional SonarCloud findings by marking them "Accepted" in the SonarCloud dashboard with a reason; keep an explanatory code comment, no inline suppression (NOSONAR silences every rule on the line).

- CI (GitHub Actions) builds with sample content and read-only permissions, actions pinned to SHAs — keeps secrets out of PR runs and blocks supply-chain drift.
