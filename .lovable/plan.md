# Markdown for agents on every key page (Browser Run + cache)

## Goal
When an AI agent requests a page with `Accept: text/markdown`, return a clean Markdown version for the home, about, projects and Cloudflare consultant pages. Blog posts keep using their Contentful Markdown, as they do now. Note: `/llms.txt` already says every page offers Markdown, which is not true yet. This plan makes that statement true.

## How it works
```text
Agent  --Accept: text/markdown-->  middleware
  1. Blog post?            -> Contentful Markdown (unchanged)
  2. Page on allowlist?    -> check Workers Cache (this data center)
        hit                -> return cached Markdown
        miss               -> Browser Run /markdown renders https://tvdn.me/<path>
                              -> tidy, store in Workers Cache for 24h, return
  3. Anything else         -> normal HTML (no Markdown)
```

## Steps
1. **Allowlist.** Add a fixed list of Markdown-enabled paths to `src/config/seo-metadata.ts`: `/`, `/about`, `/projects`, `/cloudflare-consultant`. This list is the only place to add pages later.
2. **Markdown helper** (`functions/lib/page-markdown.ts`):
   - Builds the target URL only from `CF_PAGES_URL` plus the allowlisted path. Nothing from the request is passed to Browser Run.
   - Calls Browser Run `/markdown` with a 15s timeout and waits until the page has finished loading.
   - Tidies the result: removes the menu and footer by keeping only the main content (`<main>`), then adds frontmatter with the title, description and canonical URL from `ROUTE_METADATA`.
   - Caches the result with the Workers Cache API for 24h under a versioned key, so each deploy starts fresh. No KV needed.
3. **Middleware.** Extend the existing Markdown branch in `functions/_middleware.ts` so allowlisted paths use the helper. Responses get `Content-Type: text/markdown`, `Vary: Accept` and `Cache-Control: public, max-age=3600`. If Browser Run fails or isn't set up, fall back to normal HTML instead of returning an error.
4. **Loop guard.** Browser Run sends a normal browser `Accept` header, so its own visit gets HTML. Its requests are also tagged with a header, and the middleware never triggers Markdown for those.
5. **Discovery.** Update `/llms.txt` to list the Markdown-enabled pages explicitly, and add `<link rel="alternate" type="text/markdown">` to those pages' HTML.
6. **Tests.** Cover the allowlist (only the four paths qualify), a cache hit that never calls Browser Run, the fallback to HTML when Browser Run fails, and that requests for paths not on the list are never forwarded.
7. **Docs.** README section on Markdown for agents, the setup steps below, and an `AGENTS.md` rule: "Non-blog Markdown comes from Browser Run for allowlisted paths only, cached with the Workers Cache API".

## What you'll need to set up in Cloudflare
- **API token** with only the *Browser Rendering – Edit* permission, saved as the secret `CF_BROWSER_RUN_TOKEN` in Pages (production). Also add `CF_ACCOUNT_ID` as a variable.
- **Nothing for caching:** the Workers Cache API is built in and free, so there's no KV namespace or binding to set up.
- Optionally, a usage alert on Browser Run.

## Security and cost choices
- **No outside URLs:** only allowlisted paths on your own domain are ever rendered, so nobody can use your site to render other websites.
- **Token can't be narrowed further:** Browser Rendering tokens can't be limited to certain URLs. If the token leaked, someone could run renders on your account. A dedicated token plus a usage alert limits that risk.
- **Cost:** the cache is kept per data center, so each page renders at most once per day per data center that agents use, plus once after each deploy. That's still a handful per day, whatever the traffic.
- **Fails safe:** when anything goes wrong, agents get the normal HTML page.

## Technical details
- `caches.default` is used with a synthetic key URL (`https://tvdn.me/__md/v1/<commit sha>/<path>`, using `CF_PAGES_COMMIT_SHA`), so the Markdown version never shares a cache entry with the HTML page.
- We don't rely on the CDN cache alone: Cloudflare's CDN ignores `Vary: Accept`, so HTML and Markdown on the same URL could be served to the wrong visitor.
- Preview deployments (behind Cloudflare Access) skip Browser Run, because it can't log in to Access. They fall back to HTML.
- Browser Run responses are capped at 512 KB and are not cached if empty or failed.
- Waiting on Browser Run doesn't count against the CPU limits in `wrangler.toml`.
