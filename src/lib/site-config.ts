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
 ja: 'ÈÕ±¾ÕZ',
 fr: 'Fran' + String.fromCharCode(231) + 'ais',
 es: 'Espa' + String.fromCharCode(241) + 'ol',
 pt: 'Portugu' + String.fromCharCode(234) + 's',
 it: 'Italiano',
 ko: '???',
 nl: 'Nederlands',
 pl: 'Polski',
 ru: '§²§å§ã§ã§Ü§Ú§Û',
 ar: '???????',
 'pt-br': 'Portugu' + String.fromCharCode(234) + 's (Brasil)',
 tr: 'T' + String.fromCharCode(252) + 'rk' + String.fromCharCode(231) + 'e',
 cs: '' + String.fromCharCode(268) + 'e' + String.fromCharCode(353) + 'tina',
 sv: 'Svenska',
 } as const,
 localePrefixes: {
 en:'en',de:'de',ja:'ja',fr:'fr',es:'es',
 pt:'pt',it:'it',ko:'ko',nl:'nl',
 pl:'pl',ru:'ru',ar:'ar','pt-br':'pt-br',
 tr:'tr',cs:'cs',sv:'sv'
 } as const,
 name: 'Astro Cloudflare',
 description: 'Marketing, blog, and docs starter ' + String.fromCharCode(8212) + ' multilanguage-ready.',
} as const;
