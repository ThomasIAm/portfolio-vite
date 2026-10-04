import { describe, it, expect } from "vitest";
import { buildLlmsTxt, LLMS_RECENT_POSTS } from "../llms-txt";
import { MARKDOWN_PATHS, ROUTE_METADATA } from "../seo-metadata";

const post = (slug: string, date: string) => ({
  fields: { title: `Post ${slug}`, slug, excerpt: "x", publishedDate: date },
});

describe("buildLlmsTxt", () => {
  it("lists every core page from the route metadata", () => {
    const txt = buildLlmsTxt();
    for (const path of Object.keys(ROUTE_METADATA)) {
      expect(txt).toContain(`https://tvdn.me${path}`);
    }
  });

  it("names every Markdown page", () => {
    const txt = buildLlmsTxt();
    for (const path of MARKDOWN_PATHS) expect(txt).toContain(`(${path})`);
  });

  it("lists only the newest posts, newest first", () => {
    const posts = Array.from({ length: LLMS_RECENT_POSTS + 2 }, (_, i) =>
      post(`p${i}`, `2025-01-${String(i + 1).padStart(2, "0")}`),
    );
    const txt = buildLlmsTxt(posts);
    expect(txt).not.toContain("/blog/p0)");
    expect(txt).not.toContain("/blog/p1)");
    expect(txt.indexOf("/blog/p11)")).toBeLessThan(txt.indexOf("/blog/p10)"));
  });
});
