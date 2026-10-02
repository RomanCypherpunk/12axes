export const LOCALES = ['pt', 'en', 'fr'];
const LANGUAGES = {
  pt: { label: 'Português', htmlLang: 'pt-BR', prefix: '' },
  en: { label: 'English', htmlLang: 'en', prefix: '/en' },
  fr: { label: 'Français', htmlLang: 'fr', prefix: '/fr' }
};

export function alternateLinks(site, basePath = '') {
  return LOCALES.map((locale) => {
    const lang = LANGUAGES[locale];
    return `<link rel="alternate" hreflang="${lang.htmlLang}" href="${site}${lang.prefix}${basePath || (locale === 'pt' ? '/' : '')}" />`;
  }).concat(`<link rel="alternate" hreflang="x-default" href="${site}/en${basePath}" />`).join('\n    ');
}

export function languageLinks(current, basePath) {
  return LOCALES.map((locale) => {
    const lang = LANGUAGES[locale];
    return `<a href="${lang.prefix}${basePath}" lang="${lang.htmlLang}" hreflang="${lang.htmlLang}"${locale === current ? ' aria-current="true"' : ''}>${lang.label}</a>`;
  }).join(' · ');
}
