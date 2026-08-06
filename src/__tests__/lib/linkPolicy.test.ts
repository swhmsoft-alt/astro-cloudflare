import { describe, it, expect } from "vitest";
import {
  resolveLinkPolicy,
  isExternalUrl,
  CNC_SITE_URL,
  CNC_PATHS,
} from "../../lib/linkPolicy";

describe("resolveLinkPolicy", () => {
  it("editorial links open in a new tab with noopener", () => {
    expect(resolveLinkPolicy("editorial")).toEqual({
      rel: "noopener",
      target: "_blank",
    });
  });

  it("sponsored links are tagged sponsored + noopener and open in a new tab", () => {
    expect(resolveLinkPolicy("sponsored")).toEqual({
      rel: "sponsored noopener",
      target: "_blank",
    });
  });

  it("ugc links are tagged ugc + nofollow without a new tab", () => {
    expect(resolveLinkPolicy("ugc")).toEqual({
      rel: "ugc nofollow",
      target: undefined,
    });
  });

  it("untrusted links are tagged nofollow + noopener without a new tab", () => {
    expect(resolveLinkPolicy("untrusted")).toEqual({
      rel: "nofollow noopener",
      target: undefined,
    });
  });

  it("internal links carry no rel or target", () => {
    expect(resolveLinkPolicy("internal")).toEqual({
      rel: undefined,
      target: undefined,
    });
  });

  it("unknown relationships fall back to internal", () => {
    expect(resolveLinkPolicy("bogus" as never)).toEqual({
      rel: undefined,
      target: undefined,
    });
  });

  it("per-call overrides take precedence over the base policy", () => {
    expect(resolveLinkPolicy("editorial", { target: "_self" })).toEqual({
      rel: "noopener",
      target: "_self",
    });
    expect(resolveLinkPolicy("sponsored", { rel: "nofollow noopener" })).toEqual({
      rel: "nofollow noopener",
      target: "_blank",
    });
  });
});

describe("isExternalUrl", () => {
  it("detects http/https urls as external", () => {
    expect(isExternalUrl("https://cnctitanium.com/services/5-axis")).toBe(true);
    expect(isExternalUrl("http://example.com")).toBe(true);
  });

  it("treats relative/internal urls as not external", () => {
    expect(isExternalUrl("/blog/titanium-grade-5-vs-grade-23/")).toBe(false);
    expect(isExternalUrl("/")).toBe(false);
    expect(isExternalUrl("mailto:hello@titanium.blog")).toBe(false);
  });
});

describe("CNC money site constants", () => {
  it("exposes a canonical money-site base URL", () => {
    expect(CNC_SITE_URL).toBe("https://cnctitanium.com");
  });

  it("exposes key landing paths", () => {
    expect(CNC_PATHS.fiveAxis).toBe("/services/5-axis-titanium-machining/");
    expect(CNC_PATHS.quote).toBe("/quote/");
  });
});
