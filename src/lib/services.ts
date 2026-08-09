import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { siteConfig } from "../config/site.config";
import { countTags, filterByTag, sortTagsByCount } from "./tags";
import type { Locale } from "./site-config";

/**
 * Services collection is not used. This project is a knowledge graph hub.
 * Retained for potential future use or remove completely if needed.
 */
export type ServiceEntry = CollectionEntry<"blog">; // Placeholder type to avoid breaking imports

function sortServices(services: ServiceEntry[]) {
  return [...services].sort(
    (a, b) =>
      a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getAllServices(locale?: Locale) {
  // Return empty array since services are not available
  return [];
}

export async function getFeaturedServices(limit = 3, locale?: Locale) {
  return [];
}

export async function getServicesByTag(tag: string, locale?: Locale) {
  return [];
}

export async function getAllServiceTags(locale?: Locale) {
  return [];
}

export async function getServiceBySlug(slug: string) {
  return undefined;
}
