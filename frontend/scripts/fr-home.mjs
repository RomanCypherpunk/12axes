import { FRENCH_FAQ } from './app-strings.mjs';
import { alternateLinks } from './locales.mjs';

export function frenchHome(index, site) {
  const title = '12 Axes — Quiz politique et test idéologique en 12 axes';
  const description = 'Découvrez vos idées politiques en 5 minutes avec 12 Axes. Un quiz gratuit en français pour explorer votre idéologie, votre spectre politique et vos positions sur 12 axes.';
  const url = `${site}/fr`;
  const keywords = 'quiz politique, test idéologique, spectre politique, idéologie, gauche, droite, centre, libéralisme, conservatisme, progressisme, libertarianisme, socialisme, démocratie, 12 axes';
  let html = index.replace('<html lang="pt-BR">', '<html lang="fr">');
  html = html.replace(/<!-- Primary SEO -->[\s\S]*?(?=<!-- Icons -->)/, `<!-- Primary SEO -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="12 Axes" />
    <meta name="application-name" content="12 Axes" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="language" content="French" />
    <link rel="canonical" href="${url}" />
    ${alternateLinks(site)}
    `);
  html = html.replace(/<!-- Open Graph -->[\s\S]*?(?=<style>)/, `<!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${site}/logo.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="Logo de 12 Axes — quiz politique en 12 axes" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${site}/logo.png" />
    `);
  const structured = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: '12 Axes',
      alternateName: ['Quiz politique 12 Axes', 'Test idéologique 12 Axes'], url, description,
      applicationCategory: 'EducationApplication', operatingSystem: 'Web', inLanguage: 'fr',
      isAccessibleForFree: true, image: `${site}/logo.png`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, keywords },
    { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: 'fr',
      mainEntity: FRENCH_FAQ.map(({ question, answer }) => ({ '@type': 'Question', name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer } })) }
  ];
  let i = 0;
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, () => `<script type="application/ld+json">${JSON.stringify(structured[i++])}</script>`);
  if (i !== structured.length) throw new Error('French home: expected WebApplication and FAQ structured data');
  return html;
}
