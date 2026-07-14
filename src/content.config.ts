import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";
import { i18nConfig } from "./config/i18n.config";

// Add locale codes here when introducing new languages.
const localeSchema = z.enum(["en", "de", "ja", "fr", "es", "pt", "it", "ko", "nl", "pl", "ru", "ar", "pt-br", "tr", "cs", "sv"]);

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: localeSchema,
    publishDate: z.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Admin"),
    authorId: z.string().optional(),
    uid: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    howToSteps: z
      .array(
        z.object({
          name: z.string(),
          text: z.string(),
          image: z.string().optional(),
          url: z.string().optional(),
        }),
      )
      .optional(),
    toc: z.boolean().optional(),
    svgSlug: z.string().optional(),
    translationKey: z.string().optional(),
  }),
});

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

const pageSectionSchema = z.object({
  type: z.enum(["hero", "cta", "features", "faq", "trust"]),
  title: z.string().optional(),
  content: z.string().optional(),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .optional(),
});

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/pages",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    sections: z.array(pageSectionSchema).default([]),
    isLegal: z.boolean().default(false),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const services = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/services",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    priceRange: z.string().optional(),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/authors",
    generateId: ({ entry }) => entry.replace(/\.json$/, ""),
  }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    avatar: z.string().optional(),
    social: z
      .object({
        twitter: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
        email: z.string().optional(),
      })
      .optional(),
  }),
});

const faqs = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/faqs",
    generateId: ({ entry }) => entry.replace(/\.json$/, ""),
  }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
    order: z.number().default(0),
    locale: localeSchema,
  }),
});

const stack = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/stack",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    version: z.string(),
    url: z.string().url(),
    icon: z.string(),
    colorOklch: z.string(),
    order: z.number().default(0),
  }),
});

// ── Titanium Knowledge Base Collections ──

const materials = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/materials",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    grade: z.string(),
    alloy: z.string().optional(),
    standards: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    processes: z.array(z.string()).default([]),
    finishes: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    properties: z.object({
      density: z.string().optional(),
      tensileStrength: z.string().optional(),
      yieldStrength: z.string().optional(),
      hardness: z.string().optional(),
      maxTemp: z.string().optional(),
    }).optional(),
    image: z.string().optional(),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const processes = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/processes",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    processType: z.string(),
    materials: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    equipment: z.array(z.string()).default([]),
    tolerances: z.string().optional(),
    surfaceFinish: z.string().optional(),
    maxPartSize: z.string().optional(),
    image: z.string().optional(),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const industries = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/industries",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    materials: z.array(z.string()).default([]),
    processes: z.array(z.string()).default([]),
    standards: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    image: z.string().optional(),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const standards = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/standards",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    standardType: z.enum(["material", "process", "quality", "certification"]),
    materials: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    issuingBody: z.string(),
    image: z.string().optional(),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const surfaceFinishes = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/surface-finishes",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    materials: z.array(z.string()).default([]),
    industries: z.array(z.string()).default([]),
    raRange: z.string().optional(),
    image: z.string().optional(),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const equipment = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/equipment",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    manufacturer: z.string().optional(),
    processes: z.array(z.string()).default([]),
    materials: z.array(z.string()).default([]),
    image: z.string().optional(),
    order: z.number().default(0),
    translationKey: z.string().optional(),
  }),
});

const settings = defineCollection({
  loader: glob({
    pattern: "settings.yml",
    base: "./src/content",
    generateId: ({ entry }) => entry.replace(/\.[^/.]+$/, ""),
  }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    url: z.string().optional(),
    defaultLocale: localeSchema.default("en"),
    analyticsProvider: z.enum(["none", "gtm", "umami"]).default("none"),
    gtmId: z.string().optional(),
    umamiUrl: z.string().optional(),
    umamiId: z.string().optional(),
    mapLatitude: z.string().optional(),
    mapLongitude: z.string().optional(),
    orgName: z.string().optional(),
    orgEmail: z.string().optional(),
  }),
});

const evidence = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/evidence",
    generateId: ({ entry }) => entry.replace(/\.\w+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    evidenceCategory: z.enum(["material-properties", "cutting-parameters", "surface-roughness", "tolerances", "process-capabilities"]),
    source: z.string().optional(),
    sourceUrl: z.string().optional(),
    relatedMaterials: z.array(z.string()).default([]),
    relatedProcesses: z.array(z.string()).default([]),
    relatedStandards: z.array(z.string()).default([]),
    dataPoints: z.array(z.object({
      property: z.string(),
      value: z.string(),
      unit: z.string().optional(),
      notes: z.string().optional(),
    })).default([]),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    order: z.number().default(0),
  }),
});

const comparisons = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/comparisons",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    comparisonType: z.enum(["material", "process", "surface-finish", "commercial"]),
    entityA: z.string(),
    entityB: z.string(),
    quickAnswer: z.string(),
    entityALink: z.string().optional(),
    entityBLink: z.string().optional(),
    relatedMaterials: z.array(z.string()).default([]),
    relatedProcesses: z.array(z.string()).default([]),
    relatedStandards: z.array(z.string()).default([]),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    order: z.number().default(0),
  }),
});

const procurement = defineCollection({loader:glob({pattern:"**/*.md",base:"./src/content/procurement",generateId:({entry})=>entry.replace(/\.md$/,"")}),schema:z.object({locale:localeSchema,title:z.string(),description:z.string(),procurementCategory:z.enum(["rfq-preparation","lead-time","certification","commercial","quality-inspection"]),audience:z.array(z.string()).default([]),quickAnswer:z.string(),checklist:z.array(z.string()).optional(),typicalValues:z.array(z.object({label:z.string(),value:z.string(),notes:z.string().optional()})).optional(),relatedServices:z.array(z.string()).default([]),relatedStandards:z.array(z.string()).default([]),faqs:z.array(z.object({question:z.string(),answer:z.string()})).optional(),order:z.number().default(0)}),});

const cases = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/cases",
    generateId: ({ entry }) => entry.replace(/\.\w+$/, ""),
  }),
  schema: z.object({
    locale: localeSchema,
    title: z.string(),
    description: z.string(),
    industry: z.enum(["aerospace", "medical", "semiconductor", "industrial"]),
    application: z.string(),
    material: z.string(),
    processes: z.array(z.string()),
    machines: z.array(z.string()).optional(),
    surfaceFinish: z.string().optional(),
    standards: z.array(z.string()).default([]),
    quantity: z.string().optional(),
    tolerance: z.string().optional(),
    leadTime: z.string().optional(),
    challenge: z.string(),
    solution: z.string(),
    result: z.string(),
    keyMetrics: z.array(z.object({
      label: z.string(),
      before: z.string().optional(),
      after: z.string(),
      unit: z.string().optional(),
    })).default([]),
    lessonsLearned: z.array(z.string()).default([]),
    relatedEntities: z.array(z.string()).default([]),
    relatedServices: z.array(z.string()).default([]),
    relatedMaterials: z.array(z.string()).default([]),
    relatedStandards: z.array(z.string()).default([]),
    relatedEvidence: z.array(z.string()).default([]),
    relatedComparisons: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});



export const collections = {
  settings,
  authors,
  faqs,
  stack,
  materials,
  processes,
  industries,
  standards,
  surfaceFinishes,
  equipment,
  evidence,
  comparisons,
  procurement,
  cases,
};