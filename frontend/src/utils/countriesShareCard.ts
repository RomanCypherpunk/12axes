import { LANG, t } from '../i18n';
import type { CountryDimensionMatch, CountryMatch, QuizResult } from '../types/quiz';
import { resolveCountryFlagSrc } from './countryFlags';
import { resolveIdeologyColor } from './ideologyColors';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity } from './shareCard';
import {
  FEATURE_INNER,
  darkShell,
  dimensionLine,
  dimensionsBox,
  downloadAndShare,
  el,
  farBox,
  featureBox,
  mixHex,
  renderSectionPng,
  type Palette
} from './sectionShareParts';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento da seção "Países próximos" — stories 1080x1920 (peças em sectionShareParts).
 * Os nomes de países mais longos do catálogo têm até 47 caracteres ("Sacro Império Romano-Germânico (Primeiro Reich)").
 */

/** A bandeira do destaque: moldura 3:2 igual para as duas, cortada para preencher (como na página de resultado). */
function flagFrame(match: CountryMatch): HTMLElement {
  // A moldura é um pouco menor que os 290px do desenho: as margens compensam e o bloco continua com a mesma altura (354px).
  const height = Math.round((FEATURE_INNER * 2) / 3);
  const flag = el('div', { height: `${height}px`, margin: `${30 + (290 - height) / 2}px 0 ${34 + (290 - height) / 2}px` });
  flag.dataset.shareImage = 'flagcover';
  flag.dataset.shareSrc = resolveCountryFlagSrc(match.flagPath);
  return flag;
}

function flagSmall(match: CountryMatch, color: Palette): HTMLElement {
  const flag = el('div', {
    flex: '0 0 auto',
    width: '88px',
    height: '60px',
    borderRadius: '12px',
    background: mixHex(color.base, '#000000', 0.6)
  });
  flag.dataset.shareImage = 'flag';
  flag.dataset.shareSrc = resolveCountryFlagSrc(match.flagPath);
  return flag;
}

function dimensionRow(item: CountryDimensionMatch, color: Palette): HTMLElement {
  return dimensionLine(
    {
      label: t.dimensionLabels[item.dimension],
      name: item.match.name,
      pct: item.match.compatibility,
      visual: flagSmall(item.match, color),
      visualWidth: 88,
      visualHeight: 60
    },
    color
  );
}

export function buildCountriesShareCard(result: QuizResult, religion: Religion | null): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
  const { stage, target } = darkShell(color);

  const features = el('div', { display: 'flex', gap: '24px' });
  const feature = (label: string, match: CountryMatch) =>
    featureBox({ label, name: match.name, pct: match.compatibility, visual: flagFrame(match), nameHeight: 99, nameMax: 44 }, color);
  features.append(feature(t.countryCurrentTab, result.topCountryMatch), feature(t.countryHistoricalTab, result.topHistoricalCountryMatch));

  target.append(
    buildShareHeader(t.shareNearbyCountries),
    buildShareIdentity(result, color.bg),
    features,
    dimensionsBox((result.countryDimensionMatches ?? []).map((item) => dimensionRow(item, color))),
    farBox(t.countriesDistantTitle, (result.bottomCountryMatches ?? []).map((match) => match.name), color),
    buildShareFooter(
      t.shareFooterCta,
      // Inteiros: link mais curto e QR menor, como no cartão do resultado.
      shortResultUrl(
        result.axes.map((axis) => Math.round(axis.leftPercent)),
        religion,
        LANG
      )
    )
  );
  return { stage, target };
}

/** Gera o PNG 1080x1920 do cartão de países (data URL), sem baixar nem compartilhar. */
export function createCountriesSharePng(result: QuizResult, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildCountriesShareCard(result, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportCountriesShare(result: QuizResult, religion: Religion | null): Promise<void> {
  const dataUrl = await createCountriesSharePng(result, religion);
  await downloadAndShare(dataUrl, {
    filePrefix: t.shareCountriesFilePrefix,
    title: t.shareCountriesTitle,
    text: t.shareCountriesMessage(result.topCountryMatch.name, Math.round(result.topCountryMatch.compatibility))
  });
}
