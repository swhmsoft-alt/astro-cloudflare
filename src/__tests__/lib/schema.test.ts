import { describe, it, expect } from "vitest";
import {
  buildWebSiteSchema,
  buildOrganizationSchema,
  buildPersonSchema,
  buildBlogPostingSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildServiceSchema,
  buildHowToSchema,
} from "../../lib/schema";
import { siteConfig } from "../../config/site.config";

/**
 * Schema builders are typed via `as unknown as WithContext<X>` to bypass
 * schema-dts limitations (e.g. `inLanguage` on Organization). Tests need
 * ergonomic property access, so we cast through `unknown` once at the
 * boundary instead of peppering every assertion.
 */
type AnySchema = Record<string, unknown>;

describe("buildWebSiteSchema", () => {
  it("builds a WebSite schema with required fields", () => {
    const schema = buildWebSiteSchema(siteConfig) as unknown as AnySchema;
    expect(schema["@type"]).toBe("WebSite");
    expect(schema.name).toBe(siteConfig.name);
    expect(schema.url).toBe(siteConfig.url);
    expect(schema.inLanguage).toBe("en");
    expect(schema.alternateName).toBe("titanium.blog");
  });
});

describe("buildOrganizationSchema", () => {
  it("builds an Organization schema", () => {
    const schema = buildOrganizationSchema(siteConfig) as unknown as AnySchema;
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe(siteConfig.name);
    expect(Array.isArray(schema.sameAs)).toBe(true);
    expect(schema.inLanguage).toBe("en");
  });
});

describe("buildPersonSchema", () => {
  it("builds a Person schema filtering empty socials", () => {
    const schema = buildPersonSchema(
      {
        name: "Jane",
        bio: "Writer",
        social: { github: "https://github.com/jane", twitter: undefined },
      },
      siteConfig,
    ) as unknown as AnySchema;
    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBe("Jane");
    expect(schema.sameAs).toEqual(["https://github.com/jane"]);
  });
});

describe("buildBlogPostingSchema", () => {
  it("builds a BlogPosting schema with required fields", () => {
    const post = {
      id: "welcome",
      data: {
        title: "Welcome",
        description: "Hello world",
        publishDate: new Date("2025-01-01"),
        author: "Admin",
        tags: ["astro"],
        locale: "en",
      },
    };
    const schema = buildBlogPostingSchema(post, siteConfig) as unknown as AnySchema;
    expect(schema["@type"]).toBe("BlogPosting");
    expect(schema.headline).toBe("Welcome");
    expect(schema.author).toEqual({ "@type": "Person", name: "Admin" });
    expect(schema.datePublished).toBe("2025-01-01T00:00:00.000Z");
    expect(schema.mainEntityOfPage).toBe(`${siteConfig.url}/blog/welcome/`);
    expect(schema.keywords).toBe("astro");
    expect(schema.inLanguage).toBe("en");
  });

  it("falls back to publishDate when updatedAt is missing", () => {
    const post = {
      id: "welcome",
      data: {
        title: "Welcome",
        description: "Hi",
        publishDate: new Date("2025-01-01"),
      },
    };
    const schema = buildBlogPostingSchema(post, siteConfig) as unknown as AnySchema;
    expect(schema.dateModified).toBe("2025-01-01T00:00:00.000Z");
  });
});

describe("buildFAQSchema", () => {
  it("builds an FAQPage with Question entries", () => {
    const schema = buildFAQSchema([
      { question: "What is Astro?", answer: "A web framework." },
    ]) as unknown as AnySchema & {
      mainEntity: Array<Record<string, unknown>>;
    };
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(1);
    expect(schema.mainEntity[0]["@type"]).toBe("Question");
    expect(
      (schema.mainEntity[0].acceptedAnswer as Record<string, unknown>)?.[
        "@type"
      ],
    ).toBe("Answer");
  });
});

describe("buildBreadcrumbSchema", () => {
  it("builds a BreadcrumbList with positions and absolute URLs", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
    ]) as unknown as AnySchema & {
      itemListElement: Array<Record<string, unknown>>;
    };
    expect(schema["@type"]).toBe("BreadcrumbList");
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
  });

  it("resolves relative paths to absolute URLs using the site URL", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Astro Tips", href: "/blog/astro-tips" },
    ]) as unknown as AnySchema & {
      itemListElement: Array<Record<string, unknown>>;
    };
    const items = schema.itemListElement;
    expect(items[0].item).toBe("https://titanium.blog/");
    expect(items[1].item).toBe("https://titanium.blog/blog/");
    expect(items[2].item).toBe("https://titanium.blog/blog/astro-tips/");
  });

  it("passes through absolute URLs as-is", () => {
    const schema = buildBreadcrumbSchema([
      { label: "Custom", href: "https://example.com/custom" },
    ]) as unknown as AnySchema & {
      itemListElement: Array<Record<string, unknown>>;
    };
    expect(schema.itemListElement[0].item).toBe("https://example.com/custom");
  });

  it("accepts an optional siteUrl override", () => {
    const schema = buildBreadcrumbSchema(
      [{ label: "Home", href: "/" }],
      "https://custom.example.com",
    ) as unknown as AnySchema & {
      itemListElement: Array<Record<string, unknown>>;
    };
    expect(schema.itemListElement[0].item).toBe("https://custom.example.com/");
  });
});

describe("buildServiceSchema", () => {
  it("builds a Service schema with provider", () => {
    const service = {
      data: {
        title: "Cloud Deployment",
        description: "Fast deploys",
        slug: "cloud-deployment",
      },
    };
    const schema = buildServiceSchema(service, siteConfig) as unknown as AnySchema;
    expect(schema["@type"]).toBe("Service");
    expect(schema.name).toBe("Cloud Deployment");
    expect(schema.url).toBe(`${siteConfig.url}/services/cloud-deployment/`);
    expect(
      (schema.provider as Record<string, unknown>)?.[
        "@type"
      ],
    ).toBe("Organization");
  });
});

describe("buildHowToSchema", () => {
  it("builds a HowTo schema with steps", () => {
    const schema = buildHowToSchema({
      name: "How to Deploy with Astro",
      description: "A simple guide",
      steps: [
        { name: "Clone the repo", text: "Run git clone..." },
        { name: "Install deps", text: "Run pnpm install" },
      ],
    }, siteConfig) as unknown as AnySchema & {
      step: Array<Record<string, unknown>>;
    };
    expect(schema["@type"]).toBe("HowTo");
    expect(schema.name).toBe("How to Deploy with Astro");
    expect(schema.description).toBe("A simple guide");
    expect(schema.step).toHaveLength(2);
    expect(schema.step[0]["@type"]).toBe("HowToStep");
    expect(schema.step[0].position).toBe(1);
    expect(schema.step[0].name).toBe("Clone the repo");
    expect(schema.step[1].position).toBe(2);
    expect(schema.step[1].name).toBe("Install deps");
  });

  it("handles optional totalTime and estimatedCost", () => {
    const schema = buildHowToSchema({
      name: "Setup Guide",
      steps: [{ name: "Step 1", text: "Do something" }],
      totalTime: "PT15M",
      estimatedCost: "49.99",
    }, siteConfig) as unknown as AnySchema & {
      estimatedCost: Record<string, unknown>;
    };
    expect(schema.totalTime).toBe("PT15M");
    expect(schema.estimatedCost["@type"]).toBe("MonetaryAmount");
    expect(schema.estimatedCost.value).toBe("49.99");
  });
});
