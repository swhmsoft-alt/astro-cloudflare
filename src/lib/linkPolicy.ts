/**
 * Outbound link governance policy.
 *
 * Single source of truth for the `rel`/`target` attributes applied to outbound
 * and cross-site links (titanium.blog → cnctitanium.com). See
 * `.clinerules/outbound-link-governance.md` for the governing ruleset.
 */

export type LinkRelationship =
  | "editorial" // valuable cross-site editorial link (blog → money site, in-content)
  | "sponsored" // paid / affiliate / sponsored
  | "ugc" // user-generated content / comments
  | "untrusted" // uncertain / unverified external source
  | "internal"; // same-site link

export interface LinkPolicy {
  rel?: string;
  target?: string;
}

/** Money / conversion site for titanium.blog's outbound governance. */
export const CNC_SITE_URL = "https://cnctitanium.com";

/** Centralized landing targets on the CNC money site. */
export const CNC_PATHS = {
  home: "/",
  services: "/services/",
  cncMilling: "/services/titanium-cnc-milling/",
  cncTurning: "/services/titanium-cnc-turning/",
  fiveAxis: "/services/5-axis-titanium-machining/",
  materials: "/materials/",
  about: "/about/",
  quote: "/quote/",
  resources: "/resources/",
  applications: "/applications/",
} as const;

const LINK_POLICY: Record<LinkRelationship, LinkPolicy> = {
  editorial: { rel: "noopener", target: "_blank" },
  sponsored: { rel: "sponsored noopener", target: "_blank" },
  ugc: { rel: "ugc nofollow" },
  untrusted: { rel: "nofollow noopener" },
  internal: {},
};

/**
 * Resolve the `rel`/`target` attributes for a given link relationship.
 * Per-call overrides take precedence over the base policy.
 */
export function resolveLinkPolicy(
  relationship: LinkRelationship = "internal",
  overrides?: LinkPolicy,
): LinkPolicy {
  const base = LINK_POLICY[relationship] ?? LINK_POLICY.internal;
  return {
    rel: overrides?.rel ?? base.rel,
    target: overrides?.target ?? base.target,
  };
}

/** True when a URL points off-site (http/https). */
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
