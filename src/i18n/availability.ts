/**
 * availability.ts — 译文可用性单一数据源
 *
 * 构建时预计算的映射，供 getStaticPaths、hreflang、语言切换器共用。
 * 判断规则：
 *   1. 内容驱动页面：扫描 site/pages 目录，存在 *-{locale}.md 则该 locale 可用
 *   2. 纯 UI / 功能页面：检查是否全部文案走 t()/ui.ts
 *   3. en 始终包含
 *
 * 当新翻译文件添加后，更新 SITE_PAGES_TRANSLATIONS 和 COLLECTION_TRANSLATIONS。
 */

import type { Locale } from "../lib/site-config";
import { SITE_CONFIG } from "../lib/site-config";

/**
 * PageId = 路由路径标识（不含语言前缀，首尾无斜杠）。
 * 例如: "about", "solutions/aerospace-defense", "grades/index"
 */
export type PageId = string;

// ──────────────────────────────────────────────
// 已知 site/pages 目录下存在翻译的语言（locale-suffix 模式）
// 键为 site/pages 中的 slug（不含 locale 后缀），值为可用的 Locale 数组
// ──────────────────────────────────────────────
const SITE_PAGES_TRANSLATIONS: Record<string, Locale[]> = {
  "about":                                           ["en", "de", "es"],
  "contact":                                         ["en", "de", "es"],
  "pricing":                                         ["en", "de", "es"],
  "privacy":                                         ["en", "de", "es"],
  "terms":                                           ["en", "de", "es"],
  "solutions":                                       ["en", "de", "es"],
  "solutions-aerospace-defense":                     ["en", "de", "es"],
  "solutions-automotive-motorsports":                ["en", "de", "es"],
  "solutions-chemical-processing":                   ["en", "de", "es"],
  "solutions-consumer-electronics":                  ["en", "de", "es"],
  "solutions-cycling-bicycle":                       ["en", "de", "es"],
  "solutions-electroplating-surface-finishing":      ["en", "de", "es"],
  "solutions-energy":                                ["en", "de", "es"],
  "solutions-environmental-engineering":              ["en", "de", "es"],
  "solutions-general-industrial":                    ["en", "de", "es"],
  "solutions-marine-offshore":                       ["en", "de", "es"],
  "solutions-medical-device":                        ["en", "de", "es"],
  "solutions-semiconductor":                         ["en", "de", "es"],
};

// ──────────────────────────────────────────────
// site/pages 内容页面映射：PageId → site/pages slug
// ──────────────────────────────────────────────
const PAGE_TO_SITE_SLUG: Record<string, string> = {
  "about":                        "about",
  "contact":                      "contact",
  "pricing":                      "pricing",
  "privacy":                      "privacy",
  "terms":                        "terms",
  "solutions/index":              "solutions",
  "solutions/aerospace-defense":  "solutions-aerospace-defense",
  "solutions/automotive-motorsports": "solutions-automotive-motorsports",
  "solutions/chemical-processing": "solutions-chemical-processing",
  "solutions/consumer-electronics": "solutions-consumer-electronics",
  "solutions/cycling-bicycle":     "solutions-cycling-bicycle",
  "solutions/electroplating-surface-finishing": "solutions-electroplating-surface-finishing",
  "solutions/energy":             "solutions-energy",
  "solutions/environmental-engineering": "solutions-environmental-engineering",
  "solutions/general-industrial": "solutions-general-industrial",
  "solutions/marine-offshore":    "solutions-marine-offshore",
  "solutions/medical-device":     "solutions-medical-device",
  "solutions/semiconductor":      "solutions-semiconductor",
};

/**
 * 获取指定页面实际有译文的语言数组。
 * en 始终在返回数组中。
 */
export function getAvailableLocales(pageId: PageId): Locale[] {
  // 1. 检查是否为 site/pages 内容驱动页面
  const slug = PAGE_TO_SITE_SLUG[pageId];
  if (slug && SITE_PAGES_TRANSLATIONS[slug]) {
    return SITE_PAGES_TRANSLATIONS[slug];
  }

  // 2. 检查是否为纯 UI / 集合页面
  if (EN_ONLY_PAGES.has(pageId)) {
    return ["en"];
  }

  // 3. 首页（index）— 纯 UI，全部走 t()，所有语言可用
  if (pageId === "index" || pageId === "/") {
    return [...SITE_CONFIG.locales] as Locale[];
  }

  // 4. 未知页面，只返回 en（安全兜底）
  return ["en"];
}

/**
 * 构建时预计算的完整映射（所有已知 PageId → Locale[]）。
 * 供 getStaticPaths 和语言切换器直接引用，避免运行时重复扫描。
 */
export const AVAILABILITY: Record<string, Locale[]> = {
  // ── 首页 ──
  "index": [...SITE_CONFIG.locales] as Locale[],

  // ── site/pages 内容页面（有 de/es 翻译） ──
  "about":      ["en", "de", "es"],
  "contact":    ["en", "de", "es"],
  "pricing":    ["en", "de", "es"],
  "privacy":    ["en", "de", "es"],
  "terms":      ["en", "de", "es"],

  // ── solutions 系列 ──
  "solutions/index":              ["en", "de", "es"],
  "solutions/aerospace-defense":  ["en", "de", "es"],
  "solutions/automotive-motorsports": ["en", "de", "es"],
  "solutions/chemical-processing": ["en", "de", "es"],
  "solutions/consumer-electronics": ["en", "de", "es"],
  "solutions/cycling-bicycle":     ["en", "de", "es"],
  "solutions/electroplating-surface-finishing": ["en", "de", "es"],
  "solutions/energy":             ["en", "de", "es"],
  "solutions/environmental-engineering": ["en", "de", "es"],
  "solutions/general-industrial": ["en", "de", "es"],
  "solutions/marine-offshore":    ["en", "de", "es"],
  "solutions/medical-device":     ["en", "de", "es"],
  "solutions/semiconductor":      ["en", "de", "es"],

  // ── 纯 UI / 集合页面（仅英文） ──
  "compare":          ["en"],
  "guides":           ["en"],
  "faq":              ["en"],
  "corrosion/index":  ["en"],
  "equipment/index":  ["en"],
  "failures/index":   ["en"],
  "finishes/index":   ["en"],
  "grades/index":     ["en"],
  "heat-treatment/index": ["en"],
  "industries/index": ["en"],
  "industries/aerospace": ["en"],
  "industries/automotive": ["en"],
  "industries/chemical-processing": ["en"],
  "industries/defence": ["en"],
  "industries/marine": ["en"],
  "industries/medical": ["en"],
  "industries/oil-and-gas": ["en"],
  "industries/semiconductor": ["en"],
  "processes/index":  ["en"],
  "selection/index":  ["en"],
  "standards/index":  ["en"],
  "tools/index":      ["en"],
  "tools/grade-comparison": ["en"],
  "tools/hardness-converter": ["en"],
} as const;

// ──────────────────────────────────────────────
// 核心集合（core/*）尚无翻译，所有页面仅 en 可用
// ──────────────────────────────────────────────
const EN_ONLY_PAGES = new Set([
  "compare",
  "guides",
  "faq",
  "corrosion/index",
  "equipment/index",
  "failures/index",
  "finishes/index",
  "grades/index",
  "heat-treatment/index",
  "industries/index",
  "industries/aerospace",
  "industries/automotive",
  "industries/chemical-processing",
  "industries/defence",
  "industries/marine",
  "industries/medical",
  "industries/oil-and-gas",
  "industries/semiconductor",
  "processes/index",
  "selection/index",
  "standards/index",
  "tools/index",
  "tools/grade-comparison",
  "tools/hardness-converter",
]);
/**
 * buildLocalePaths - getStaticPaths params for [locale] routes.
 * CRITICAL: default locale (en) is EXCLUDED - English lives ONLY at the root.
 * A locale route must never build /en/ pages. Zero tolerance.
 */
export function buildLocalePaths(pageId: PageId): Locale[] {
  return getAvailableLocales(pageId)
    .filter((loc) => loc !== SITE_CONFIG.defaultLocale)
    ;
}
