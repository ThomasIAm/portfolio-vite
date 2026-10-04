import { describe, it, expect } from "vitest";
import { fillLegalPlaceholders, siteConfig } from "../site";

describe("fillLegalPlaceholders", () => {
  it("fills controller name and privacy email from site config", () => {
    expect(fillLegalPlaceholders("{{legalName}} <{{privacyEmail}}>")).toBe(
      `${siteConfig.legal.name} <${siteConfig.legal.privacyEmail}>`,
    );
  });
  it("derives domain from siteUrl", () => {
    expect(fillLegalPlaceholders("{{siteDomain}}")).toBe(new URL(siteConfig.siteUrl).host);
  });
  it("leaves unknown placeholders intact", () => {
    expect(fillLegalPlaceholders("{{unknown}}")).toBe("{{unknown}}");
  });
});
