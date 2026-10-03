import { describe, it, expect, vi } from "vitest";
import { getPageMarkdown, buildCacheKey } from "../page-markdown";
import { isMarkdownPath } from "../../../src/config/seo-metadata";

const env = {
  CF_ACCOUNT_ID: "acc",
  CF_BROWSER_RUN_TOKEN: "tok",
  CF_PAGES_COMMIT_SHA: "abc",
};
const BASE = "https://tvdn.me";

function memoryCache() {
  const store = new Map<string, Response>();
  return {
    store,
    match: vi.fn(async (req: Request) => store.get(req.url)?.clone()),
    put: vi.fn(async (req: Request, res: Response) => {
      store.set(req.url, res);
    }),
  } as unknown as Cache & { store: Map<string, Response> };
}

function browserRunOk(markdown = "# Hello") {
  return vi.fn(async () =>
    new Response(JSON.stringify({ success: true, result: markdown }), { status: 200 }),
  );
}

describe("markdown allowlist", () => {
  it.each(["/", "/about", "/projects", "/cloudflare-consultant", "/about/"])(
    "allows %s",
    (p) => expect(isMarkdownPath(p)).toBe(true),
  );
  it.each(["/contact", "/blog", "/privacy", "/about/x", "//evil.com"])(
    "rejects %s",
    (p) => expect(isMarkdownPath(p)).toBe(false),
  );
});

describe("getPageMarkdown", () => {
  it("never calls Browser Run for paths outside the allowlist", async () => {
    const fetchImpl = browserRunOk();
    const res = await getPageMarkdown("/contact", BASE, env, { cache: memoryCache(), fetchImpl });
    expect(res).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("renders only our own allowlisted URL and caches the result", async () => {
    const cache = memoryCache();
    const fetchImpl = browserRunOk("# About me");
    const res = await getPageMarkdown("/about", BASE, env, { cache, fetchImpl });
    expect(res?.headers.get("Content-Type")).toContain("text/markdown");
    const body = JSON.parse((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.url).toBe("https://tvdn.me/about");
    expect(await res!.text()).toContain("# About me");
    expect(cache.store.has(buildCacheKey(BASE, "/about", "abc"))).toBe(true);
  });

  it("serves a cache hit without calling Browser Run", async () => {
    const cache = memoryCache();
    cache.store.set(buildCacheKey(BASE, "/", "abc"), new Response("cached"));
    const fetchImpl = browserRunOk();
    const res = await getPageMarkdown("/", BASE, env, { cache, fetchImpl });
    expect(await res!.text()).toBe("cached");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("falls back (null) and caches nothing when Browser Run fails", async () => {
    const cache = memoryCache();
    const fetchImpl = vi.fn(async () => new Response("err", { status: 500 }));
    const res = await getPageMarkdown("/projects", BASE, env, { cache, fetchImpl });
    expect(res).toBeNull();
    expect(cache.store.size).toBe(0);
  });

  it("falls back when Browser Run is not configured", async () => {
    const fetchImpl = browserRunOk();
    const res = await getPageMarkdown("/", BASE, {}, { cache: memoryCache(), fetchImpl });
    expect(res).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
