import type { Locale } from "../lib/site-config";
import en from "./en.json";
import de from "./de.json";
import ja from "./ja.json";
import fr from "./fr.json";
import es from "./es.json";
import pt from "./pt.json";
import it from "./it.json";
import ko from "./ko.json";
import nl from "./nl.json";
import pl from "./pl.json";
import ru from "./ru.json";
import ar from "./ar.json";
import ptBr from "./pt-br.json";
import tr from "./tr.json";
import cs from "./cs.json";
import sv from "./sv.json";

export type TranslationDict = Record<string, string>;

// Add new locales here, e.g. `{ en, id }`, alongside their JSON file.
export const translations: Partial<Record<Locale, TranslationDict>> = {
  en,
  de,
  ja,
  fr,
  es,
  pt,
  it,
  ko,
  nl,
  pl,
  ru,
  ar,
  "pt-br": ptBr,
  tr,
  cs,
  sv,
};

/**
 * Get a translated string for the given locale and key.
 * Falls back to the key itself if not found (fail loud during dev).
 */
export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? key;
}
