import { describe, it, expect } from "vitest";
import { extractStandaloneLinks, isAllowedPreviewUrl } from "../../../shared/link-preview.mjs";

describe("link preview URL rules", () => {
  it("only allows https URLs", () => {
    expect(isAllowedPreviewUrl("https://example.com/post")).toBe(true);
    expect(isAllowedPreviewUrl("http://example.com/post")).toBe(false);
  });

  it("blocks IP addresses and local hosts", () => {
    expect(isAllowedPreviewUrl("https://169.254.169.254/latest")).toBe(false);
    expect(isAllowedPreviewUrl("https://localhost/")).toBe(false);
    expect(isAllowedPreviewUrl("https://[::1]/")).toBe(false);
  });

  it("blocks local hosts written with a trailing DNS dot", () => {
    expect(isAllowedPreviewUrl("https://localhost./")).toBe(false);
    expect(isAllowedPreviewUrl("https://service.internal./")).toBe(false);
    expect(isAllowedPreviewUrl("https://printer.local./")).toBe(false);
    expect(isAllowedPreviewUrl("https://example.com./post")).toBe(true);
  });

  it("collects only links that stand alone in a paragraph", () => {
    const md = "Intro with [inline](https://inline.example.com) link.\n\n[Alone](https://alone.example.com)\n\nhttps://bare.example.com";
    expect(extractStandaloneLinks(md)).toEqual(["https://alone.example.com", "https://bare.example.com"]);
  });
});
