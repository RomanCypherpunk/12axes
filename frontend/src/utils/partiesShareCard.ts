import { LANG, t } from '../i18n';
import type { PartyDimensionMatch, PartyMatch, QuizResult } from '../types/quiz';
import { resolveCountryFlagSrc } from './countryFlags';
import { resolveIdeologyColor } from './ideologyColors';
import { resolvePartyLogoSrc } from './partyLogos';
import { personalityInitials } from './personalityImage';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity } from './shareCard';
import {
  SHARE_FONT_DISPLAY,
  darkShell,
  dimensionLine,
  dimensionsBox,
  downloadAndShare,
  el,
  farBox,
  featureBox,
  renderSectionPng
} from './sectionShareParts';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento da seção "Partidos próximos" — stories 1080x1920 (peças em sectionShareParts).
 * O logo de cada partido vem numa caixa branca (inteiro, sem corte) com a bandeira do país dele num selo no canto. Os nomes mais
 * longos do catálogo têm até 61 caracteres ("Associação de Auxílio ao Governo Imperial (Taisei Yokusankai)").
 */

type Palette = { base: string; bg: string };

/**
 * O logo numa caixa branca com a bandeira do país num selo. A caixa branca e o selo são desenhados no canvas; aqui ficam as caixas
 * (e, se o logo não existir ou não carregar, a inicial do partido sobre o branco).
 */
function logoWithBadge(match: PartyMatch, size: number, small: boolean): HTMLElement {
  const wrap = el('div', { position: 'relative', width: `${size}px`, height: `${size}px`, flex: '0 0 auto' });
  const logo = el('div', {
    width: '100%',
    height: '100%',
    borderRadius: small ? '20px' : '36px',
    background: '#FFFFFF',
    display: 'grid',
    placeItems: 'center',
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: small ? '26px' : '60px',
    color: '#9AA0A8'
  }, personalityInitials(match.name));
  logo.dataset.shareImage = small ? 'logosmall' : 'logo';
  logo.dataset.shareSrc = resolvePartyLogoSrc(match.logoPath);

  const badge = el('div', small
    ? { position: 'absolute', right: '-8px', bottom: '-6px', width: '40px', height: '27px' }
    : { position: 'absolute', right: '-14px', bottom: '-14px', width: '84px', height: '56px' });
  badge.dataset.shareImage = small ? 'badgesmall' : 'badge';
  badge.dataset.shareSrc = resolveCountryFlagSrc(match.countryFlagPath);
  wrap.append(logo, badge);
  return wrap;
}

// Este é o cartão mais denso (partidos têm os nomes mais longos): o logo grande e as linhas são um pouco menores que no desenho, para
// os três "mais distantes" de nomes longos caberem sem encostar nos outros blocos.
const LOGO_BIG = 250;
const LOGO_SMALL = 80;

/** A área do destaque (o desenho tem 290px), com o logo no meio. */
function featureVisual(match: PartyMatch): HTMLElement {
  const area = el('div', { height: '270px', margin: '30px 0 34px', display: 'grid', placeItems: 'center' });
  area.append(logoWithBadge(match, LOGO_BIG, false));
  return area;
}

function dimensionRow(item: PartyDimensionMatch, color: Palette): HTMLElement {
  return dimensionLine(
    {
      label: t.dimensionLabels[item.dimension],
      name: item.match.name,
      pct: item.match.compatibility,
      visual: logoWithBadge(item.match, LOGO_SMALL, true),
      visualWidth: LOGO_SMALL,
      visualHeight: LOGO_SMALL
    },
    color
  );
}

/** O partido atual e o histórico mais compatíveis (o mesmo critério da seção na página). */
function pickFeatured(result: QuizResult): { current: PartyMatch | null; historical: PartyMatch | null } {
  const top = result.topPartyMatches ?? [];
  const current = result.topPartyMatch ?? top.find((match) => !match.historical) ?? top[0] ?? null;
  const historical = result.topHistoricalPartyMatch ?? top.find((match) => match.historical) ?? null;
  return { current, historical };
}

export function buildPartiesShareCard(result: QuizResult, religion: Religion | null): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
  const { stage, target } = darkShell(color);
  const { current, historical } = pickFeatured(result);

  const features = el('div', { display: 'flex', gap: '24px' });
  const feature = (label: string, match: PartyMatch) =>
    featureBox({ label, name: match.name, pct: match.compatibility, visual: featureVisual(match), nameHeight: 128, nameMax: 38 }, color);
  if (current) features.append(feature(t.partyCurrentTab, current));
  if (historical) features.append(feature(t.partyHistoricalTab, historical));

  target.append(
    buildShareHeader(t.shareNearbyParties),
    buildShareIdentity(result, color.bg),
    features,
    dimensionsBox((result.partyDimensionMatches ?? []).map((item) => dimensionRow(item, color))),
    farBox(t.partiesDistantTitle, (result.bottomPartyMatches ?? []).map((match) => match.name), color, true),
    buildShareFooter(
      t.shareFooterCta,
      shortResultUrl(
        result.axes.map((axis) => Math.round(axis.leftPercent)),
        religion,
        LANG
      )
    )
  );
  return { stage, target };
}

/** Gera o PNG 1080x1920 do cartão de partidos (data URL), sem baixar nem compartilhar. */
export function createPartiesSharePng(result: QuizResult, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildPartiesShareCard(result, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportPartiesShare(result: QuizResult, religion: Religion | null): Promise<void> {
  const dataUrl = await createPartiesSharePng(result, religion);
  const main = pickFeatured(result).current;
  await downloadAndShare(dataUrl, {
    filePrefix: t.sharePartiesFilePrefix,
    title: t.sharePartiesTitle,
    text: t.sharePartiesMessage(main?.name ?? '', Math.round(main?.compatibility ?? 0))
  });
}
