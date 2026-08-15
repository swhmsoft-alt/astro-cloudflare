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
 | 'pt-br'
 | 'it'
 | 'ko'
 | 'nl'
 | 'pl'
 | 'sv'
 | 'tr'
 | 'ru'
 | 'ar'
 | 'cs'
 | 'vi';

export const SITE_CONFIG = {
 url: 'https://astro-cloudflare-starter.pages.dev',
 defaultLocale: 'en' as const,
 locales: [
 'en','de','ja','fr','es','pt-br','it','ko',
 'nl','pl','sv','tr','ru','ar','cs','vi'
 ] as const,
 localeLabels: {
    en: 'English',
    de: 'Deutsch',
    ja: '日本語',
    fr: 'Français',
    es: 'Español',
    'pt-br': 'Português (Brasil)',
    it: 'Italiano',
    ko: '한국어',
    nl: 'Nederlands',
    pl: 'Polski',
    sv: 'Svenska',
    tr: 'Türkçe',
    ru: 'Русский',
    ar: 'العربية',
    cs: 'Čeština',
    vi: 'Tiếng Việt',
  } as const,
 localePrefixes: {
 en:'en',de:'de',ja:'ja',fr:'fr',es:'es',
 'pt-br':'pt-br',it:'it',ko:'ko',nl:'nl',
 pl:'pl',sv:'sv',tr:'tr',ru:'ru',ar:'ar',
 cs:'cs',vi:'vi'
 } as const,
 name: 'Astro Cloudflare',
 description: 'Marketing, blog, and docs starter — multilanguage-ready.',
} as const;
