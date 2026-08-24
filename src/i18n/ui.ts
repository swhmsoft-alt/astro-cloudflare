import en from "./en.json";

/**
 * UI dictionary is English-only as of 2026-08-23 (Session 2 of i18n cleanup).
 * The site runs at the root (no locale prefix); only `en.json` is loaded.
 *
 * The `t(locale, key)` signature is kept for backward compatibility with
 * existing call sites — `locale` is accepted but always resolves to the
 * English dictionary. Missing keys fall through to `key` (loud during dev).
 */
export type TranslationDict = Record<string, string>;

export const translations: Record<string, TranslationDict> = { en };

export function t(_locale: string, key: string): string {
  return translations.en?.[key] ?? key;
}
