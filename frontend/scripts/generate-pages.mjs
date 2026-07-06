// Gera páginas estáticas de SEO (ideologias, países, personalidades) a partir
// dos JSONs do backend. Roda após o `vite build` e escreve direto em dist/.
// Nenhum arquivo gerado aqui é editado à mão: a fonte é sempre backend/src/main/resources/data.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, '../backend/src/main/resources/data');
const DIST = join(ROOT, 'dist');
const SITE = 'https://12axes.vercel.app';

const readJson = (name) => JSON.parse(readFileSync(join(DATA_DIR, name), 'utf8'));

const axes = readJson('axes.json');
const ideologies = readJson('ideologies.json');
const ideologyProfiles = new Map(readJson('ideology-profiles.json').map((p) => [p.ideologyId, p.vector]));
const countries = readJson('countries.json');
const countryProfiles = new Map(readJson('countries-profiles.json').map((p) => [p.countryId, p.vector]));
const personalities = readJson('personalities.json');
const personalityProfiles = new Map(readJson('personality-profiles.json').map((p) => [p.personalityId, p.vector]));

const countryById = new Map(countries.map((c) => [c.id, c]));
const personalityById = new Map(personalities.map((p) => [p.id, p]));
const ideologiesByCountry = groupBy(ideologies, (i) => i.countryId);
const ideologiesByPersonality = groupBy(ideologies, (i) => i.personalityId);

function groupBy(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function truncate(text, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

function readableInk(hexColor) {
  const raw = hexColor.replace('#', '');
  const hex = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#0B1020' : '#ffffff';
}

function intensityFor(distance) {
  if (distance < 7.5) return 'Equilibrado';
  if (distance < 22.5) return 'Inclinado';
  if (distance < 37.5) return 'Forte';
  return 'Muito forte';
}

// ── Barra de eixo (mesma semântica do AxisResultBar.tsx: vetor = leftPercent) ──
function axisRow(axis, leftPercent) {
  const left = Math.max(0, Math.min(100, leftPercent));
  const right = 100 - left;
  const balanced = Math.abs(left - 50) < 7.5;
  const leaningRight = right > left;
  const domColor = balanced ? '#94A3B8' : leaningRight ? axis.rightColor : axis.leftColor;
  const leanText = balanced
    ? 'Equilibrado'
    : `${intensityFor(Math.abs(left - 50))} - ${leaningRight ? axis.rightPole : axis.leftPole}`;
  const position = right; // 0 = polo esquerdo, 100 = polo direito
  const fillLeft = Math.min(position, 50);
  const fillWidth = balanced ? 0 : Math.abs(position - 50);

  return `
<article class="axis-row" style="--axis-dom:${domColor}">
  <header class="axis-row-head">
    <div class="axis-row-id"><h3>${escapeHtml(axis.label)}</h3></div>
    <span class="axis-lean" data-balanced="${balanced}">${escapeHtml(leanText)}</span>
  </header>
  <div class="axis-meter">
    <div class="axis-pole${!balanced && !leaningRight ? ' is-active' : ''}" data-side="left" style="--pole:${axis.leftColor};--pole-ink:${readableInk(axis.leftColor)}">
      <span class="axis-pole-text">
        <span class="axis-pole-name">${escapeHtml(axis.leftPole)}</span>
        <span class="axis-pole-value">${left.toFixed(0)}%</span>
      </span>
    </div>
    <div class="axis-track" role="img" aria-label="${escapeHtml(`${axis.label}: ${axis.leftPole} ${left.toFixed(0)}%, ${axis.rightPole} ${right.toFixed(0)}%`)}">
      <span class="axis-track-center"></span>
      <span class="axis-track-fill" style="left:${fillLeft}%;width:${fillWidth}%"></span>
      <span class="axis-track-thumb" data-balanced="${balanced}" style="left:${position}%"></span>
    </div>
    <div class="axis-pole${!balanced && leaningRight ? ' is-active' : ''}" data-side="right" style="--pole:${axis.rightColor};--pole-ink:${readableInk(axis.rightColor)}">
      <span class="axis-pole-text">
        <span class="axis-pole-name">${escapeHtml(axis.rightPole)}</span>
        <span class="axis-pole-value">${right.toFixed(0)}%</span>
      </span>
    </div>
  </div>
</article>`;
}

function axesSection(subjectName, vector) {
  const rows = axes.map((axis) => axisRow(axis, vector[axis.id] ?? 50)).join('\n');
  return `
<section class="page-section" aria-labelledby="axes-title">
  <h2 id="axes-title">Perfil nos 12 eixos</h2>
  <p class="section-lead">Como ${escapeHtml(subjectName)} se posiciona em cada uma das 12 dimensões políticas medidas pelo 12 Axes.</p>
  <div class="axis-rows">${rows}</div>
</section>`;
}

function relatedCard(href, eyebrow, title, description) {
  return `
<a class="related-card" href="${href}">
  <span class="card-eyebrow">${escapeHtml(eyebrow)}</span>
  <span class="card-title">${escapeHtml(title)}</span>
  <span class="card-desc">${escapeHtml(truncate(description, 120))}</span>
</a>`;
}

function ctaSection() {
  return `
<section class="cta-panel">
  <h2>E você, onde está no espectro político?</h2>
  <p>Responda ao quiz e descubra suas compatibilidades com ideologias, países e personalidades nos 12 eixos.</p>
  <a class="primary-button hero-cta" href="/">Fazer o teste político
    <svg class="btn-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </a>
</section>`;
}

function breadcrumbLd(sectionLabel, sectionPath, name, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '12 Axes', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: sectionLabel, item: `${SITE}${sectionPath}` },
      { '@type': 'ListItem', position: 3, name, item: `${SITE}${path}` }
    ]
  };
}

function layout({ path, title, description, ogImage, jsonLd, body }) {
  const url = `${SITE}${path}`;
  const ldBlocks = jsonLd
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join('\n    ');
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0B1020" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE}${ogImage}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE}${ogImage}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap" />
    <link rel="stylesheet" href="/pages.css" />
    ${ldBlocks}
  </head>
  <body>
    <div class="page-shell">
      <header class="site-header">
        <a class="brand-lockup" href="/" aria-label="12 Axes — página inicial"><span class="brand-num">12</span><span class="brand-word">Axes</span></a>
        <nav class="home-nav" aria-label="Seções">
          <a href="/ideologies">Ideologias</a>
          <a href="/countries">Países</a>
          <a href="/personalities">Personalidades</a>
        </nav>
      </header>
      <main class="page-main">${body}</main>
      <footer class="page-footer">
        <a class="brand-lockup" href="/"><span class="brand-num">12</span><span class="brand-word">Axes</span></a>
        <nav aria-label="Rodapé">
          <a href="/">Fazer o teste</a>
          <a href="/ideologies">Ideologias</a>
          <a href="/countries">Países</a>
          <a href="/personalities">Personalidades</a>
        </nav>
        <p>12 Axes — quiz político e teste ideológico gratuito em 12 eixos.</p>
      </footer>
    </div>
  </body>
</html>`;
}

function crumbs(sectionLabel, sectionPath, name) {
  return `
<nav class="crumbs" aria-label="Trilha de navegação">
  <a href="/">Início</a><span aria-hidden="true">/</span><a href="${sectionPath}">${escapeHtml(sectionLabel)}</a><span aria-hidden="true">/</span><span>${escapeHtml(name)}</span>
</nav>`;
}

function metaChip(text) {
  return `<span class="intro-meta-item">${escapeHtml(text)}</span>`;
}

// ── Páginas de detalhe ──────────────────────────────────────────────────────
function ideologyPage(ideology) {
  const path = `/ideologies/${ideology.id}`;
  const country = countryById.get(ideology.countryId);
  const personality = personalityById.get(ideology.personalityId);
  const vector = ideologyProfiles.get(ideology.id);
  const siblings = ideologies
    .filter((i) => i.category === ideology.category && i.id !== ideology.id)
    .slice(0, 6);

  const related = [
    country && relatedCard(`/countries/${country.id}`, 'País mais próximo', country.name, country.description),
    personality && relatedCard(`/personalities/${personality.id}`, 'Personalidade associada', personality.name, personality.description),
    ...siblings.map((s) => relatedCard(`/ideologies/${s.id}`, s.category, s.name, s.description))
  ].filter(Boolean);

  const body = `
${crumbs('Ideologias', '/ideologies', ideology.name)}
<section class="entity-hero">
  <span class="intro-eyebrow">${escapeHtml(ideology.category)}</span>
  <h1>${escapeHtml(ideology.name)}</h1>
  <p class="intro-lead">${escapeHtml(ideology.description)}</p>
  <div class="intro-meta">
    ${country ? metaChip(`País: ${country.name}`) : ''}
    ${personality ? metaChip(`Referência: ${personality.name}`) : ''}
  </div>
</section>
${axesSection(`o ${ideology.name}`, vector)}
<section class="page-section" aria-labelledby="related-title">
  <h2 id="related-title">Relacionados</h2>
  <div class="related-grid">${related.join('\n')}</div>
</section>
${ctaSection()}`;

  return {
    path,
    html: layout({
      path,
      title: `${ideology.name} — o que é e posição nos 12 eixos políticos | 12 Axes`,
      description: truncate(ideology.description),
      ogImage: '/logo.png',
      jsonLd: [
        breadcrumbLd('Ideologias', '/ideologies', ideology.name, path),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${ideology.name} — posição política nos 12 eixos`,
          description: truncate(ideology.description),
          inLanguage: 'pt-BR',
          mainEntityOfPage: `${SITE}${path}`,
          author: { '@type': 'Organization', name: '12 Axes', url: `${SITE}/` }
        }
      ],
      body
    })
  };
}

function countryPage(country) {
  const path = `/countries/${country.id}`;
  const vector = countryProfiles.get(country.id);
  const linked = ideologiesByCountry.get(country.id) ?? [];
  const related = linked.map((i) => relatedCard(`/ideologies/${i.id}`, i.category, i.name, i.description));

  const body = `
${crumbs('Países', '/countries', country.name)}
<section class="entity-hero has-figure">
  <div class="entity-intro">
    <span class="intro-eyebrow">${escapeHtml(country.category)}</span>
    <h1>${escapeHtml(country.name)}</h1>
    <p class="intro-lead">${escapeHtml(country.description)}</p>
    <div class="intro-meta">
      ${country.historical ? metaChip(`Regime histórico${country.period ? ` · ${country.period}` : ''}`) : metaChip('País atual')}
    </div>
  </div>
  <figure class="entity-figure">
    <img src="${country.flagPath}" alt="${escapeHtml(`Bandeira: ${country.name}`)}" width="220" loading="lazy" />
  </figure>
</section>
${axesSection(country.name, vector)}
${related.length ? `
<section class="page-section" aria-labelledby="related-title">
  <h2 id="related-title">Ideologias ligadas a este país</h2>
  <div class="related-grid">${related.join('\n')}</div>
</section>` : ''}
${ctaSection()}`;

  return {
    path,
    html: layout({
      path,
      title: `${country.name} — perfil político nos 12 eixos | 12 Axes`,
      description: truncate(country.description),
      ogImage: country.flagPath,
      jsonLd: [
        breadcrumbLd('Países', '/countries', country.name, path),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${country.name} — perfil político nos 12 eixos`,
          description: truncate(country.description),
          inLanguage: 'pt-BR',
          mainEntityOfPage: `${SITE}${path}`,
          author: { '@type': 'Organization', name: '12 Axes', url: `${SITE}/` }
        }
      ],
      body
    })
  };
}

function personalityPage(personality) {
  const path = `/personalities/${personality.id}`;
  const vector = personalityProfiles.get(personality.id);
  const linked = ideologiesByPersonality.get(personality.id) ?? [];
  const related = linked.map((i) => relatedCard(`/ideologies/${i.id}`, i.category, i.name, i.description));

  const credit = personality.imageSourceUrl
    ? `<figcaption><a href="${personality.imageSourceUrl}" rel="noopener nofollow" target="_blank">${escapeHtml(personality.imageSourceName || 'Fonte da imagem')}</a></figcaption>`
    : '';

  const body = `
${crumbs('Personalidades', '/personalities', personality.name)}
<section class="entity-hero has-figure">
  <div class="entity-intro">
    <span class="intro-eyebrow">${escapeHtml(personality.role)}</span>
    <h1>${escapeHtml(personality.name)}</h1>
    <p class="intro-lead">${escapeHtml(personality.description)}</p>
    <div class="intro-meta">
      ${personality.lifespan ? metaChip(personality.lifespan) : ''}
    </div>
  </div>
  <figure class="entity-figure is-portrait">
    <img src="${personality.imagePath}" alt="${escapeHtml(`Retrato: ${personality.name}`)}" width="220" loading="lazy" />
    ${credit}
  </figure>
</section>
${axesSection(personality.name, vector)}
${related.length ? `
<section class="page-section" aria-labelledby="related-title">
  <h2 id="related-title">Ideologias associadas</h2>
  <div class="related-grid">${related.join('\n')}</div>
</section>` : ''}
${ctaSection()}`;

  return {
    path,
    html: layout({
      path,
      title: `${personality.name} — posição política nos 12 eixos | 12 Axes`,
      description: truncate(personality.description),
      ogImage: personality.imagePath,
      jsonLd: [
        breadcrumbLd('Personalidades', '/personalities', personality.name, path),
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: personality.name,
            description: truncate(personality.description)
          },
          inLanguage: 'pt-BR',
          url: `${SITE}${path}`
        }
      ],
      body
    })
  };
}

// ── Páginas de índice ───────────────────────────────────────────────────────
function indexPage({ path, title, description, heading, lead, groups }) {
  const sections = groups
    .map(
      ({ label, items }) => `
<section class="page-section">
  <h2>${escapeHtml(label)}</h2>
  <div class="related-grid">${items.join('\n')}</div>
</section>`
    )
    .join('\n');

  const body = `
<section class="entity-hero">
  <h1>${escapeHtml(heading)}</h1>
  <p class="intro-lead">${escapeHtml(lead)}</p>
</section>
${sections}
${ctaSection()}`;

  return {
    path,
    html: layout({
      path,
      title,
      description,
      ogImage: '/logo.png',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: heading,
          description,
          inLanguage: 'pt-BR',
          url: `${SITE}${path}`
        }
      ],
      body
    })
  };
}

function buildIndexes() {
  const ideologyGroups = [...groupBy(ideologies, (i) => i.category)].map(([label, items]) => ({
    label,
    items: items.map((i) => relatedCard(`/ideologies/${i.id}`, label, i.name, i.description))
  }));

  const currentCountries = countries.filter((c) => !c.historical);
  const historicalCountries = countries.filter((c) => c.historical);
  const countryGroups = [
    {
      label: 'Países atuais',
      items: currentCountries.map((c) => relatedCard(`/countries/${c.id}`, c.category, c.name, c.description))
    },
    {
      label: 'Regimes históricos',
      items: historicalCountries.map((c) =>
        relatedCard(`/countries/${c.id}`, c.period ? `${c.category} · ${c.period}` : c.category, c.name, c.description)
      )
    }
  ];

  const personalityGroups = [...groupBy(personalities, (p) => p.role)].map(([label, items]) => ({
    label,
    items: items.map((p) => relatedCard(`/personalities/${p.id}`, label, p.name, p.description))
  }));

  return [
    indexPage({
      path: '/ideologies',
      title: `Ideologias políticas: lista completa com ${ideologies.length} correntes | 12 Axes`,
      description: `Explore ${ideologies.length} ideologias políticas — do comunismo ao libertarianismo — com descrição e posição em 12 eixos. Descubra a sua com o quiz político 12 Axes.`,
      heading: 'Ideologias políticas',
      lead: `As ${ideologies.length} correntes políticas mapeadas pelo 12 Axes, cada uma com descrição e perfil completo nos 12 eixos. Faça o teste para descobrir com quais você é compatível.`,
      groups: ideologyGroups
    }),
    indexPage({
      path: '/countries',
      title: `Perfis políticos de ${countries.length} países e regimes históricos | 12 Axes`,
      description: `Compare o perfil político de ${countries.length} países e regimes históricos em 12 eixos — democracia, economia, liberdades e mais. Descubra seu país mais compatível.`,
      heading: 'Países e regimes',
      lead: `${countries.length} países atuais e regimes históricos com perfil político completo nos 12 eixos. Faça o teste para descobrir qual é o mais próximo de você.`,
      groups: countryGroups
    }),
    indexPage({
      path: '/personalities',
      title: `${personalities.length} personalidades políticas e suas posições | 12 Axes`,
      description: `Veja a posição política de ${personalities.length} personalidades históricas e contemporâneas em 12 eixos. Descubra com quem você mais se parece no quiz 12 Axes.`,
      heading: 'Personalidades políticas',
      lead: `${personalities.length} líderes, pensadores e figuras históricas com perfil político nos 12 eixos. Faça o teste para descobrir com quem você mais se parece.`,
      groups: personalityGroups
    })
  ];
}

// ── CSS das páginas (tokens do app + estilos próprios) ─────────────────────
function buildCss() {
  const tokens = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8')
    .replace(/#root\s*{[^}]*}/, '');
  return `${tokens}
/* ── páginas estáticas (geradas por scripts/generate-pages.mjs) ── */
.page-shell{position:relative;z-index:1;display:flex;flex-direction:column;min-height:100dvh;width:min(940px,calc(100% - 48px));margin:0 auto}
.site-header{display:flex;align-items:center;justify-content:space-between;padding:24px 0 14px;flex-shrink:0}
.brand-lockup{display:inline-flex;align-items:baseline;font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-.04em}
.brand-num{background:var(--grad-brand);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.brand-word{color:var(--ink-950)}
.home-nav{display:inline-flex;gap:6px;padding:5px;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--paper);box-shadow:var(--shadow-xs)}
.home-nav a{display:inline-flex;align-items:center;min-height:34px;padding:0 12px;border-radius:var(--radius-md);color:var(--text-muted);font-size:.82rem;font-weight:700;transition:color var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out)}
.home-nav a:hover{color:var(--text-strong);background:var(--ink-50)}
.page-main{flex:1;display:flex;flex-direction:column;gap:clamp(28px,4vw,44px);padding:10px 0 40px}
.crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;color:var(--text-soft);font-size:.8rem;font-weight:600}
.crumbs a{color:var(--text-muted)}
.crumbs a:hover{color:var(--accent-deep)}
.crumbs span:last-child{color:var(--text-strong)}
.entity-hero{display:flex;flex-direction:column;gap:16px}
.entity-hero.has-figure{flex-direction:row;align-items:flex-start;justify-content:space-between;gap:clamp(20px,4vw,44px)}
.entity-intro{display:flex;flex-direction:column;gap:16px;min-width:0}
.entity-hero h1{font-size:clamp(2rem,3.6vw,3.2rem);line-height:1.02;letter-spacing:-.04em;font-weight:700}
.intro-eyebrow{display:inline-flex;align-items:center;gap:10px;width:fit-content;padding:8px 16px 8px 14px;border-radius:var(--radius-pill);background:var(--paper);border:1px solid var(--line);box-shadow:var(--shadow-xs);font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.intro-eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(34,197,94,.18)}
.intro-lead{margin:0;max-width:64ch;color:var(--text-muted);font-size:clamp(1rem,.4vw + .92rem,1.1rem);line-height:1.6}
.intro-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.intro-meta-item{display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:0 12px;border:1px solid var(--line);border-radius:var(--radius-md);background:var(--paper);color:var(--text-muted);font-size:.82rem;font-weight:600}
.entity-figure{flex-shrink:0;display:flex;flex-direction:column;gap:6px;margin:0}
.entity-figure img{display:block;width:220px;height:auto;border-radius:var(--radius-lg);border:1px solid var(--line-strong);box-shadow:var(--shadow-md);background:var(--paper)}
.entity-figure.is-portrait img{object-fit:cover;aspect-ratio:3/4}
.entity-figure figcaption{color:var(--text-soft);font-size:.7rem;text-align:right}
.entity-figure figcaption a:hover{color:var(--text-muted)}
.page-section{display:flex;flex-direction:column;gap:16px}
.page-section h2{font-size:clamp(1.3rem,2vw,1.7rem);letter-spacing:-.025em}
.section-lead{margin:0;color:var(--text-muted);font-size:.95rem;max-width:70ch}
.axis-rows{display:flex;flex-direction:column;gap:12px}
.axis-row{display:flex;flex-direction:column;gap:16px;padding:18px clamp(16px,2vw,24px);background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-xs);transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-spring)}
.axis-row:hover{border-color:var(--line-strong);box-shadow:var(--shadow-sm);transform:translateY(-1px)}
.axis-row-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
.axis-row-id{display:inline-flex;align-items:center;gap:10px;min-width:0}
.axis-row-id h3{font-family:var(--font-display);font-size:clamp(.98rem,.6vw + .8rem,1.18rem);font-weight:700;letter-spacing:-.015em;color:var(--text-strong);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.axis-lean{flex-shrink:0;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--radius-pill);background:color-mix(in srgb,var(--axis-dom,var(--accent)) 14%,var(--paper));color:color-mix(in srgb,var(--axis-dom,var(--accent)) 68%,var(--ink-950));border:1px solid color-mix(in srgb,var(--axis-dom,var(--accent)) 26%,transparent);font-size:.72rem;font-weight:700;white-space:nowrap}
.axis-lean::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--axis-dom,var(--accent))}
.axis-lean[data-balanced="true"]{background:var(--ink-50);color:var(--text-muted);border-color:var(--line)}
.axis-lean[data-balanced="true"]::before{background:var(--ink-400)}
.axis-meter{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.1fr) minmax(0,1fr);grid-template-areas:"lpole track rpole";align-items:center;gap:clamp(10px,1.6vw,18px)}
.axis-pole{display:inline-flex;align-items:center;gap:9px;min-width:0}
.axis-pole[data-side="left"]{grid-area:lpole}
.axis-pole[data-side="right"]{grid-area:rpole;justify-content:flex-end}
.axis-pole-text{display:flex;flex-direction:column;gap:1px;min-width:0}
.axis-pole[data-side="right"] .axis-pole-text{align-items:flex-end;text-align:right}
.axis-pole-name{font-size:.78rem;font-weight:600;line-height:1.2;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.axis-pole-value{font-family:var(--font-display);font-size:.84rem;font-weight:700;color:var(--text-soft);font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.axis-pole.is-active .axis-pole-name{color:var(--text-strong)}
.axis-pole.is-active .axis-pole-value{color:color-mix(in srgb,var(--pole) 70%,var(--ink-950))}
.axis-track{grid-area:track;position:relative;height:10px;border-radius:var(--radius-pill);background:var(--ink-100);box-shadow:inset 0 1px 2px rgba(11,16,32,.07)}
.axis-track-center{position:absolute;top:-4px;bottom:-4px;left:50%;width:2px;transform:translateX(-50%);background:repeating-linear-gradient(var(--ink-300) 0 3px,transparent 3px 6px);border-radius:2px}
.axis-track-fill{position:absolute;top:0;bottom:0;background:linear-gradient(135deg,color-mix(in srgb,var(--axis-dom,var(--accent)) 82%,white) 0%,var(--axis-dom,var(--accent)) 100%);border-radius:var(--radius-pill);box-shadow:0 0 12px -2px color-mix(in srgb,var(--axis-dom,var(--accent)) 55%,transparent)}
.axis-track-thumb{position:absolute;top:50%;width:16px;height:16px;transform:translate(-50%,-50%);border-radius:50%;background:var(--paper);border:3px solid var(--axis-dom,var(--accent));box-shadow:0 2px 7px rgba(11,16,32,.22);z-index:1}
.axis-track-thumb[data-balanced="true"]{border-color:var(--ink-400)}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.related-card{display:flex;flex-direction:column;gap:8px;padding:16px;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-xs);transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-spring)}
.related-card:hover{border-color:var(--line-strong);box-shadow:var(--shadow-sm);transform:translateY(-2px)}
.card-eyebrow{color:var(--accent-deep);font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.card-title{font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:-.02em;color:var(--text-strong)}
.card-desc{color:var(--text-muted);font-size:.82rem;line-height:1.5}
.cta-panel{display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:clamp(22px,3vw,34px);background:var(--paper);border:1px solid var(--line-strong);border-radius:var(--radius-xl);box-shadow:var(--shadow-md)}
.cta-panel h2{font-size:clamp(1.25rem,2vw,1.6rem);letter-spacing:-.03em}
.cta-panel p{margin:0;color:var(--text-muted);max-width:56ch}
.primary-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:44px;padding:0 18px;border:1px solid var(--accent);border-radius:var(--radius-md);background:var(--accent);color:#fff;font-size:.92rem;font-weight:700;box-shadow:var(--shadow-xs);transition:transform var(--dur-base) var(--ease-spring),box-shadow var(--dur-base) var(--ease-out)}
.primary-button:hover{transform:translateY(-1px);box-shadow:var(--shadow-accent)}
.hero-cta{overflow:hidden;box-shadow:0 16px 34px -18px rgba(34,197,94,.92),0 0 0 5px rgba(34,197,94,.10)}
.btn-arrow{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.page-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;padding:22px 0 30px;border-top:1px solid var(--line);color:var(--text-soft);font-size:.8rem}
.page-footer nav{display:flex;flex-wrap:wrap;gap:16px}
.page-footer nav a{color:var(--text-muted);font-weight:600}
.page-footer nav a:hover{color:var(--accent-deep)}
.page-footer p{margin:0;width:100%}
@media (max-width:760px){
.page-shell{width:calc(100% - 40px)}
.site-header{padding:14px 0 10px}
.home-nav a{padding:0 9px;font-size:.76rem}
.entity-hero.has-figure{flex-direction:column-reverse}
.entity-figure img{width:160px}
.axis-meter{grid-template-columns:1fr 1fr;grid-template-areas:"lpole rpole" "track track";gap:12px 14px}
}`;
}

// ── Escrita ─────────────────────────────────────────────────────────────────
function writePage({ path, html }) {
  const file = join(DIST, `${path.replace(/^\//, '')}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return path;
}

const pages = [
  ...buildIndexes(),
  ...ideologies.map(ideologyPage),
  ...countries.map(countryPage),
  ...personalities.map(personalityPage)
];

const paths = pages.map(writePage);

writeFileSync(join(DIST, 'pages.css'), buildCss());

const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = ['/', ...paths]
  .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Geradas ${pages.length} páginas + sitemap.xml + robots.txt + pages.css em dist/`);
