export function ensureTrailingSlash(path: string): string {
 if (path === '' || path === '/') return '/';
 return path.endsWith('/') ? path : path + '/';
}

// To add a language: extend this union, add the code to
// SITE_CONFIG.locales, add label/prefix entries below, create a matching
// translations file in src/i18n, and add localized content + [locale] routes.
export type Locale =
 | 'en'
 | 'de'
 | 'ja'
 | 'fr'
 | 'es'
 | 'pt'
 | 'it'
 | 'ko'
 | 'nl'
 | 'pl'
 | 'ru'
 | 'ar'
 | 'pt-br'
 | 'tr'
 | 'cs'
 | 'sv';

export const SITE_CONFIG = {
 url: 'https://astro-cloudflare-starter.pages.dev',
 defaultLocale: 'en' as const,
 locales: [
 'en','de','ja','fr','es','pt','it','ko',
 'nl','pl','ru','ar','pt-br','tr','cs','sv'
 ] as const,
 localeLabels: {
    en: 'English',
    de: 'Deutsch',
    ja: '日本語',
    fr: 'Français',
    es: 'Español',
    pt: 'Português',
    it: 'Italiano',
    ko: '한국어',
    nl: 'Nederlands',
    pl: 'Polski',
    ru: 'Русский',
    ar: 'العربية',
    'pt-br': 'Português (Brasil)',
    tr: 'Türkçe',
    cs: 'Čeština',
    sv: 'Svenska',
  } as const,
 localePrefixes: {
 en:'en',de:'de',ja:'ja',fr:'fr',es:'es',
 pt:'pt',it:'it',ko:'ko',nl:'nl',
 pl:'pl',ru:'ru',ar:'ar','pt-br':'pt-br',
 tr:'tr',cs:'cs',sv:'sv'
 } as const,
 name: 'Astro Cloudflare',
 description: 'Marketing, blog, and docs starter — multilanguage-ready.',
} as const;
