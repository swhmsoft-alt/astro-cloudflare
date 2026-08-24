import type { CollectionEntry } from "astro:content";

export type BlogLinkEntry = CollectionEntry<"blog">;
export type ServiceLinkEntry = CollectionEntry<"services">;

export function resolvePostByUid(uid: string, posts: BlogLinkEntry[]) {
  return posts.find((post) => post.data.uid === uid || post.id === uid);
}

// EN-only project (2026-08-23): no locale prefix on any URL.
export function buildPostHref(post: BlogLinkEntry) {
  return `/blog/${post.id}/`;
}

export function buildServiceHref(service: ServiceLinkEntry) {
  return `/services/${service.data.slug}/`;
}
