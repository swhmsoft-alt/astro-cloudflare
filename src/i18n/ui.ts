import type { Locale } from "../config/site.config";
import en from "./en.json";
import de from "./de.json";
import ja from "./ja.json";
import fr from "./fr.json";
import es from "./es.json";
import ptBr from "./pt-br.json";
import it from "./it.json";
import ko from "./ko.json";
import nl from "./nl.json";
import pl from "./pl.json";

// The dormant JSON files (./sv.json, ./tr.json, ./ru.json, ./ar.json,
// ./cs.json, ./vi.json) are kept on disk for future re-enablement per
// `.clinerules/translation-governance.md` §1, but their imports are
// intentionally NOT registered here — they would fail the `Locale` type.

export type TranslationDict = Record<string, string>;

// Add new locales here alongside their JSON file.
export const translations: Partial<Record<Locale, TranslationDict>> = {
  en,
  de,
  ja,
  fr,
  es,
  "pt-br": ptBr,
  it,
  ko,
  nl,
  pl,
};

/**
 * Get a translated string for the given locale and key.
 * Falls back to the key itself if not found (fail loud during dev).
 */
export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? key;
}
