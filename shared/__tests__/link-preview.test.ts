import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchOgMetadata } from '../link-preview.mjs';

afterEach(() => vi.unstubAllGlobals());

describe('fetchOgMetadata redirects', () => {
  it('resolves relative image and site name from the final URL but keeps the original link', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { status: 301, headers: { location: 'https://new.example.org/blog/post' } }),
      )
      .mockResolvedValueOnce(
        new Response('<title>Post</title><meta property="og:image" content="img/cover.png">', {
          status: 200,
          headers: { 'content-type': 'text/html' },
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const meta = await fetchOgMetadata('https://old.example.com/p');

    expect(meta.image).toBe('https://new.example.org/blog/img/cover.png');
    expect(meta.siteName).toBe('new.example.org');
    expect(meta.url).toBe('https://old.example.com/p');
  });
});
