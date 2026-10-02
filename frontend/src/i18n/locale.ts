export type Lang = 'pt' | 'en' | 'fr';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' }
];
export const LANGUAGE_STORAGE_KEY = '12axes-lang';
export const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', fr: 'fr-FR' };
export const localePrefix = (lang: Lang) => lang === 'pt' ? '' : `/${lang}`;
export const localeHome = (lang: Lang) => lang === 'pt' ? '/br' : `/${lang}`;

export function normalizeLang(value: string | null | undefined): Lang | null {
  const primary = value?.trim().toLowerCase().split('-')[0];
  return primary === 'pt' || primary === 'en' || primary === 'fr' ? primary : null;
}

export function langForcedByPath(pathname: string): Lang | null {
  const first = pathname.replace(/\/+$/, '').replace(/\.html$/, '').split('/')[1];
  return first === 'br' ? 'pt' : first === 'en' || first === 'fr' ? first : null;
}

export function resolveLanguage(pathname: string, search: string, saved: string | null, browser: string): Lang {
  return langForcedByPath(pathname)
    ?? normalizeLang(new URLSearchParams(search).get('lang'))
    ?? normalizeLang(saved)
    ?? normalizeLang(browser)
    ?? 'en';
}

export function languageUrl(href: string, lang: Lang): string {
  const url = new URL(href);
  const path = url.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const unprefixed = path.replace(/^\/(?:en|fr|br)(?=\/|$)/, '') || '/';
  if (unprefixed === '/') {
    url.pathname = localeHome(lang);
    url.searchParams.delete('lang');
  } else if (/^\/(ideologies|countries|personalities)(\/|$)/.test(unprefixed)) {
    url.pathname = `${localePrefix(lang)}${unprefixed}`;
    url.searchParams.delete('lang');
  } else {
    // Shared results and the legacy quiz route keep their existing URL shape.
    url.pathname = unprefixed;
    url.searchParams.set('lang', lang);
  }
  return url.toString();
}
