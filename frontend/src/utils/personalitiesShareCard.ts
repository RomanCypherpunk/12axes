import { LANG, t } from '../i18n';
import type { DimensionMatch, PersonalityMatch, QuizResult } from '../types/quiz';
import { resolveIdeologyColor } from './ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from './personalityImage';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity } from './shareCard';
import {
  CARD_CONTENT_HEIGHT,
  CONTENT_WIDTH,
  P,
  SAFETY,
  SHARE_FONT_BODY,
  SHARE_FONT_DISPLAY,
  darkShell,
  dimensionLine,
  dimensionsBox,
  downloadAndShare,
  el,
  farBox,
  farBoxHeight,
  farRowCount,
  fitBlock,
  mixHex,
  percentText,
  renderSectionPng,
  rgba,
  type Palette
} from './sectionShareParts';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento da seção "Personalidades próximas" — stories 1080x1920 (peças em sectionShareParts).
 * Os nomes mais longos do catálogo têm 35 caracteres ("Luiz Philippe de Orleans e Bragança").
 */

// A foto tem 710px, como no desenho, e só diminui quando os "mais distantes" ocupam várias linhas (nomes longos): o espaço que falta
// sai dela, para os blocos nunca encostarem. 782 = o que não muda (cabeçalho, ideologia, as três linhas e o rodapé); 70 = a folga mínima.
const HERO_MAX = 710;
const HERO_MIN = 560;
const FIXED_HEIGHT = 782;
const MIN_GAPS = 70;
const HERO_PADDING = 40;
const NAME_LINE_HEIGHT = 1.1;

/** A personalidade mais compatível: a foto cobre a caixa (véu e degradê desenhados no canvas) e o texto fica embaixo, à esquerda. */
function hero(match: PersonalityMatch, color: Palette, height: number): HTMLElement {
  const frame = el('div', { position: 'relative', height: `${height}px`, borderRadius: '36px', overflow: 'hidden' });
  frame.dataset.shareImage = 'portrait';
  frame.dataset.shareSrc = resolvePersonalityImageSrc(match.imagePath);

  // O nome pode ter até duas linhas (a altura do bloco é a de duas linhas no tamanho máximo); a fonte diminui nos nomes longos.
  const nameSize = fitBlock(match.name, {
    weight: 600,
    family: SHARE_FONT_DISPLAY,
    width: (CONTENT_WIDTH - HERO_PADDING * 2) * SAFETY,
    height: 2 * 62 * NAME_LINE_HEIGHT,
    lineHeight: NAME_LINE_HEIGHT,
    max: 62,
    min: 28,
    tracking: -0.0242
  });
  const text = el('div', {
    position: 'absolute',
    left: `${HERO_PADDING}px`,
    right: `${HERO_PADDING}px`,
    bottom: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  });
  text.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '128px',
      lineHeight: '1',
      letterSpacing: '-4px',
      color: color.bg
    }, percentText(match.compatibility)),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '28px',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: color.bg
    }, t.shareMostCompatible),
    el('div', {
      marginTop: '10px',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: String(NAME_LINE_HEIGHT),
      letterSpacing: '-0.0242em',
      overflowWrap: 'break-word',
      color: P
    }, match.name)
  );
  frame.append(text);
  return frame;
}

/** O retrato redondo das linhas "politicamente / socialmente / economicamente" (84px, cortado do centro para cima como no resto do site). */
function avatar(match: PersonalityMatch, color: Palette): HTMLElement {
  const frame = el('div', {
    flex: '0 0 auto',
    width: '84px',
    height: '84px',
    borderRadius: '50%',
    overflow: 'hidden',
    background: mixHex(color.base, '#000000', 0.6),
    display: 'grid',
    placeItems: 'center',
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: '24px',
    color: rgba(P, 0.7)
  }, personalityInitials(match.name));
  // A imagem é desenhada no canvas por cima destas iniciais (que só ficam visíveis se a imagem não carregar).
  frame.dataset.shareImage = 'avatar';
  frame.dataset.shareSrc = resolvePersonalityImageSrc(match.imagePath);
  return frame;
}

function dimensionRow(item: DimensionMatch, color: Palette): HTMLElement {
  return dimensionLine(
    {
      label: t.dimensionLabels[item.dimension],
      name: item.match.name,
      pct: item.match.compatibility,
      visual: avatar(item.match, color),
      visualWidth: 84,
      visualHeight: 84
    },
    color
  );
}

export function buildPersonalitiesShareCard(result: QuizResult, religion: Religion | null): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
  const { stage, target } = darkShell(color);
  const distant = (result.bottomPersonalityMatches ?? []).map((match) => match.name);
  // Com três linhas de etiquetas a caixa fica compacta e a foto cede o resto do espaço.
  const rows = farRowCount(distant);
  const compact = rows >= 3;
  const heroHeight = Math.round(Math.max(HERO_MIN, Math.min(HERO_MAX, CARD_CONTENT_HEIGHT - MIN_GAPS - FIXED_HEIGHT - farBoxHeight(rows, compact))));
  target.append(
    buildShareHeader(t.shareNearbyPersonalities),
    buildShareIdentity(result, color.bg),
    hero(result.topPersonalityMatch, color, heroHeight),
    dimensionsBox((result.dimensionMatches ?? []).map((item) => dimensionRow(item, color))),
    farBox(t.personalitiesDistantTitle, distant, color, compact),
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

/** Gera o PNG 1080x1920 do cartão de personalidades (data URL), sem baixar nem compartilhar. */
export function createPersonalitiesSharePng(result: QuizResult, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildPersonalitiesShareCard(result, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportPersonalitiesShare(result: QuizResult, religion: Religion | null): Promise<void> {
  const dataUrl = await createPersonalitiesSharePng(result, religion);
  await downloadAndShare(dataUrl, {
    filePrefix: t.sharePersonalitiesFilePrefix,
    title: t.sharePersonalitiesTitle,
    text: t.sharePersonalitiesMessage(result.topPersonalityMatch.name, Math.round(result.topPersonalityMatch.compatibility))
  });
}
