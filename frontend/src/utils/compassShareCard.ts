import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VALUE_COINS } from '../components/results/valueCoins';
import { COMPASS_COINS } from '../components/results/compassCoins';
import { compassClamp, compassView } from '../components/results/PoliticalCompassSection';
import { COMPASS_QUADRANTS, COMPASS_QUADRANT_ORDER } from './compassQuadrants';
import { FILLED_POLE_ICONS } from '../data/filledPoleIcons';
import { religiousPoleIcon } from '../data/religionIcons';
import { LANG, t } from '../i18n';
import type { Axis, AxisResult, PoliticalValue, QuizResult } from '../types/quiz';
import { resolveIdeologyColor } from './ideologyColors';
import { computeCompass, economicName, type CompassPosition } from './politicalCompass';
import { valueCardName, valueCoinMonogram } from './politicalValues';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity, SHARE_COLORS } from './shareCard';
import {
  BOX_BORDER,
  CONTENT_WIDTH,
  SAFETY,
  SHARE_FONT_BODY,
  SHARE_FONT_DISPLAY,
  box,
  boxLabel,
  downloadAndShare,
  el,
  fitBlock,
  lightShell,
  renderSectionPng,
  rgba,
  type Palette
} from './sectionShareParts';
import { fitFontSize } from './compareShareCard';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento de "Valores e bússola" — stories 1080x1920, num tema claro (papel com texto escuro). Não tem imagem:
 * a grade da bússola, a barra social e os ícones dos valores são caixas e SVG no DOM; só o QR é desenhado no canvas (ver renderSharePng).
 *
 * Nada pode sair do lugar: a frase da bússola e os nomes dos valores ganham o tamanho de fonte que cabe na altura reservada.
 */

const INK = SHARE_COLORS.tinta;
const BOX_PADDING_X = 36;
const BOX_INNER = CONTENT_WIDTH - BOX_PADDING_X * 2 - BOX_BORDER * 2;
const CHART_WIDTH = 470;
const CHART_GAP = 36;
const READ_WIDTH = BOX_INNER - CHART_WIDTH - CHART_GAP;
// A grade 9x9: o lado é a largura da caixa do gráfico menos os dois rótulos laterais (22px) e os espaços (12px).
const GRID_SIDE = CHART_WIDTH - 22 * 2 - 12 * 2;
const MARKER_SIDE = 40;
// Um cartão por categoria (8), numa grade 4x2, com a moeda em cima e o texto no pé.
const VALUE_COLUMNS = 4;
const VALUE_GAP = 12;
const VALUE_TILE_PAD_X = 12;
// A grade avança sobre o respiro lateral da caixa, para os nomes terem mais largura.
const VALUE_BLEED = 12;
const VALUE_COIN = 84;
const VALUE_NAME_HEIGHT = 76;
const VALUE_TILE_HEIGHT = 262;
const VALUE_TEXT_WIDTH = (BOX_INNER + VALUE_BLEED * 2 - VALUE_GAP * (VALUE_COLUMNS - 1)) / VALUE_COLUMNS - VALUE_TILE_PAD_X * 2;

const X_MARK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" width="55%" height="55%" style="display:block"><path d="M6 6l12 12M18 6 6 18"/></svg>';

/** O "X" que marca onde a pessoa está: caixa colorida com borda branca. */
function marker(style: Partial<CSSStyleDeclaration>, background: string, radius: string): HTMLElement {
  const node = el('div', {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    placeItems: 'center',
    background,
    border: '3px solid #FFFFFF',
    borderRadius: radius,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    ...style
  });
  node.innerHTML = X_MARK;
  return node;
}

function axisLabel(text: string, vertical?: 'left' | 'right'): HTMLElement {
  const style: Partial<CSSStyleDeclaration> = {
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '1.2',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    textAlign: 'center',
    color: INK
  };
  const node = el('div', style, text);
  if (vertical) {
    node.style.setProperty('writing-mode', 'vertical-rl');
    if (vertical === 'left') node.style.transform = 'rotate(180deg)';
  }
  return node;
}

/** A bússola: a grade 9x9 colorida, as duas linhas do centro e o "X" da pessoa, com os quatro rótulos em volta. */
function compassChart(position: CompassPosition, markerColor: string): HTMLElement {
  const chart = el('div', {
    flex: `0 0 ${CHART_WIDTH}px`,
    width: `${CHART_WIDTH}px`,
    display: 'grid',
    gridTemplateColumns: '22px 1fr 22px',
    gridTemplateRows: 'auto auto auto',
    gap: '12px',
    alignItems: 'center',
    justifyItems: 'center'
  });
  const top = axisLabel(t.compassAuthoritarian);
  top.style.gridColumn = '2';
  top.style.gridRow = '1';
  const left = axisLabel(t.compassLeft, 'left');
  left.style.gridColumn = '1';
  left.style.gridRow = '2';
  const right = axisLabel(t.compassRight, 'right');
  right.style.gridColumn = '3';
  right.style.gridRow = '2';
  const bottom = axisLabel(t.compassLibertarian);
  bottom.style.gridColumn = '2';
  bottom.style.gridRow = '3';

  const grid = el('div', {
    gridColumn: '2',
    gridRow: '2',
    position: 'relative',
    width: `${GRID_SIDE}px`,
    height: `${GRID_SIDE}px`,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr'
  });
  COMPASS_QUADRANT_ORDER.forEach((key) => {
    const quad = el('div', {
      display: 'grid',
      placeItems: 'center',
      padding: '8%',
      textAlign: 'center',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '500',
      fontSize: '20px',
      lineHeight: '1.25',
      background: COMPASS_QUADRANTS[key].bg,
      color: COMPASS_QUADRANTS[key].ink
    });
    grid.append(quad);
  });
  // Grade do Political Compass (20×20 células, 10×10 por quadrante), por cima das cores e por baixo dos eixos e do "X".
  const gridLine = 'rgba(90, 90, 90, 0.22)';
  grid.append(
    el('i', {
      position: 'absolute',
      inset: '0',
      backgroundImage: `linear-gradient(to right, ${gridLine} 2px, transparent 2px), linear-gradient(to bottom, ${gridLine} 2px, transparent 2px)`,
      backgroundSize: '5% 5%',
      boxShadow: `inset 0 0 0 2px ${gridLine}`
    })
  );
  const axisLine = (style: Partial<CSSStyleDeclaration>) => el('i', { position: 'absolute', background: '#101010', ...style });
  const arrow = (style: Partial<CSSStyleDeclaration>) => el('i', { position: 'absolute', width: '0', height: '0', borderStyle: 'solid', borderColor: 'transparent', ...style });
  grid.append(
    axisLine({ left: '-2%', right: '-2%', top: '50%', height: '2px', transform: 'translateY(-1px)' }),
    axisLine({ top: '-2%', bottom: '-2%', left: '50%', width: '2px', transform: 'translateX(-1px)' }),
    arrow({ left: '-3%', top: '50%', transform: 'translateY(-50%)', borderWidth: '7px 12px 7px 0', borderRightColor: '#101010' }),
    arrow({ right: '-3%', top: '50%', transform: 'translateY(-50%)', borderWidth: '7px 0 7px 12px', borderLeftColor: '#101010' }),
    arrow({ top: '-3%', left: '50%', transform: 'translateX(-50%)', borderWidth: '0 7px 12px 7px', borderBottomColor: '#101010' }),
    arrow({ bottom: '-3%', left: '50%', transform: 'translateX(-50%)', borderWidth: '12px 7px 0 7px', borderTopColor: '#101010' }),
    marker(
      { left: `${compassClamp(position.right)}%`, top: `${compassClamp(100 - position.authoritarian)}%`, width: `${MARKER_SIDE}px`, height: `${MARKER_SIDE}px` },
      markerColor,
      '8px'
    )
  );
  chart.append(top, left, grid, right, bottom);
  return chart;
}

const COMPASS_TILE_GAP = 16;
const COMPASS_TILE_PAD_X = 24;
const COMPASS_COIN = 84;
const COMPASS_COIN_GAP = 20;
const COMPASS_TEXT_WIDTH = READ_WIDTH - COMPASS_TILE_PAD_X * 2 - COMPASS_COIN - COMPASS_COIN_GAP;

/** Um dos três retângulos da bússola (Politicamente, Economicamente, Socialmente): moeda à esquerda, rótulo e nome à direita. */
function compassTile(coinKey: string, label: string, name: string, base: string, bg: string): HTMLElement {
  const tile = el('div', {
    minWidth: '0',
    display: 'flex',
    alignItems: 'center',
    gap: `${COMPASS_COIN_GAP}px`,
    padding: `0 ${COMPASS_TILE_PAD_X}px`,
    borderRadius: '28px',
    background: bg
  });
  const circle = el('div', {
    flex: '0 0 auto',
    display: 'grid',
    placeItems: 'center',
    width: `${COMPASS_COIN}px`,
    height: `${COMPASS_COIN}px`,
    borderRadius: '50%',
    background: base
  });
  const coin = COMPASS_COINS[coinKey];
  if (coin?.glyph) {
    circle.innerHTML = renderToStaticMarkup(
      createElement('svg', { width: 46, height: 46, fill: bg, viewBox: coin.viewBox, style: { display: 'block' } }, coin.glyph)
    );
  } else {
    circle.append(el('span', { fontFamily: SHARE_FONT_BODY, fontWeight: '700', fontSize: '30px', color: bg }, valueCoinMonogram(name)));
  }
  const upper = label.toLocaleUpperCase(LANG);
  const labelSize = fitFontSize(upper, 600, SHARE_FONT_BODY, COMPASS_TEXT_WIDTH * SAFETY, 1, 19, 11, 0.16);
  // Nome com quebra forçada (nível, e embaixo o método): cada linha precisa caber em uma linha só.
  const nameLines = name.split('\n');
  const nameFit = {
    weight: 600,
    family: SHARE_FONT_DISPLAY,
    width: COMPASS_TEXT_WIDTH * SAFETY,
    height: (nameLines.length > 1 ? 1 : 2) * 26 * 1.25,
    lineHeight: 1.25,
    max: 28,
    min: 14,
    tracking: -0.0192
  };
  const nameSize = Math.min(...nameLines.map((line) => fitBlock(line, nameFit)));
  const text = el('div', { minWidth: '0', flex: '1 1 0' });
  text.append(
    el('div', { fontFamily: SHARE_FONT_BODY, fontWeight: '600', fontSize: `${labelSize}px`, letterSpacing: '0.16em', lineHeight: '1.2', whiteSpace: 'nowrap', color: base }, upper),
    el('div', {
      marginTop: '6px',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: '1.25',
      letterSpacing: '-0.0192em',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-line',
      color: base
    }, name)
  );
  tile.append(circle, text);
  return tile;
}

/** Os três retângulos empilhados, esticados até a altura da grade da bússola. */
function compassTiles(view: ReturnType<typeof compassView>): HTMLElement {
  const wrap = el('div', {
    display: 'grid',
    gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
    gap: `${COMPASS_TILE_GAP}px`,
    alignSelf: 'stretch'
  });
  wrap.append(
    compassTile(`political:${view.spectrum.key}`, t.dimensionLabels.political, t.compassSpectrumLabels[view.spectrum.key], view.spectrum.base, view.spectrum.bg),
    compassTile(`economic:${view.economic}`, t.dimensionLabels.economic, economicName(t, view.economic, view.method), view.economicColor, view.economicBg),
    compassTile(`social:${view.social}`, t.dimensionLabels.social, t.compassSocialLabels[view.social], view.socialBase, view.socialBg)
  );
  return wrap;
}

function compassBox(position: CompassPosition, color: Palette, category: string, moralAxis: Axis | undefined, ideologyId?: string): HTMLElement {
  const view = compassView(position, category, moralAxis, ideologyId);
  const wrap = box({ padding: `34px ${BOX_PADDING_X}px` }, true);
  const body = el('div', { display: 'flex', alignItems: 'center', gap: `${CHART_GAP}px`, marginTop: '30px' });
  const read = compassTiles(view);
  read.style.flex = '1 1 0';
  body.append(compassChart(position, view.markerColor ?? color.base), read);
  wrap.append(boxLabel(t.compassTitle, INK, BOX_INNER), body);
  return wrap;
}

/** O ícone de um valor, desenhado em SVG: o glifo da moeda (ou o da religião do usuário) na cor do pastel, ou o monograma. */
function valueCoin(value: PoliticalValue, color: Palette, religion: Religion | null): HTMLElement {
  const circle = el('div', {
    flex: '0 0 auto',
    display: 'grid',
    placeItems: 'center',
    width: `${VALUE_COIN}px`,
    height: `${VALUE_COIN}px`,
    borderRadius: '50%',
    background: color.base
  });
  const coin = VALUE_COINS[value.valueId];
  const faith = coin?.religious ? (religiousPoleIcon(religion) ?? FILLED_POLE_ICONS.religiao.right) : null;
  const common = { width: 46, height: 46, fill: color.bg, style: { display: 'block' } };
  if (faith) {
    circle.innerHTML = renderToStaticMarkup(
      createElement(
        'svg',
        { ...common, viewBox: faith.viewBox },
        faith.paths.map((d) => createElement('path', { key: d, d, fillRule: faith.fillRule ?? 'evenodd', clipRule: faith.fillRule ?? 'evenodd' }))
      )
    );
  } else if (coin?.glyph) {
    circle.innerHTML = renderToStaticMarkup(createElement('svg', { ...common, viewBox: coin.viewBox }, coin.glyph));
  } else {
    circle.append(el('span', { fontFamily: SHARE_FONT_BODY, fontWeight: '700', fontSize: '30px', color: color.bg }, valueCoinMonogram(value.name)));
  }
  return circle;
}

function valueTile(value: PoliticalValue, color: Palette, religion: Religion | null): HTMLElement {
  const tile = el('div', {
    minWidth: '0',
    height: `${VALUE_TILE_HEIGHT}px`,
    borderRadius: '28px',
    background: color.bg,
    padding: `26px ${VALUE_TILE_PAD_X}px 24px`,
    display: 'flex',
    flexDirection: 'column'
  });
  const label = value.categoryLabel.toLocaleUpperCase(LANG);
  const labelSize = fitFontSize(label, 600, SHARE_FONT_BODY, VALUE_TEXT_WIDTH * SAFETY, 1, 18, 10, 0.1);
  const name = valueCardName(value.name);
  // 20px no máximo: com as quebras acima, praticamente todos os nomes cabem nesse tamanho e ficam iguais entre si.
  const nameSize = fitBlock(name, {
    weight: 600,
    family: SHARE_FONT_DISPLAY,
    width: VALUE_TEXT_WIDTH * SAFETY,
    height: VALUE_NAME_HEIGHT,
    lineHeight: 1.25,
    max: 20,
    min: 12,
    tracking: -0.0192
  });
  tile.append(
    valueCoin(value, color, religion),
    // O ícone sobe e o texto desce para o pé do cartão: o espaço que sobra fica entre os dois.
    el('div', { marginTop: 'auto' }),
    el('div', {
      marginTop: '22px',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: `${labelSize}px`,
      letterSpacing: '0.1em',
      lineHeight: '1.2',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      color: color.base
    }, label),
    el('div', {
      marginTop: '6px',
      height: `${VALUE_NAME_HEIGHT}px`,
      overflow: 'hidden',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: '1.25',
      letterSpacing: '-0.0192em',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-line',
      color: color.base
    }, name)
  );
  return tile;
}

function valuesBox(values: PoliticalValue[], color: Palette, religion: Religion | null): HTMLElement {
  const wrap = box({ padding: `34px ${BOX_PADDING_X}px` }, true);
  const grid = el('div', {
    display: 'grid',
    gridTemplateColumns: `repeat(${VALUE_COLUMNS}, minmax(0, 1fr))`,
    gap: `${VALUE_GAP}px`,
    margin: `28px -${VALUE_BLEED}px 0`
  });
  values.forEach((value) => grid.append(valueTile(value, color, religion)));
  wrap.append(boxLabel(t.valuesSectionTitle, INK, BOX_INNER), grid);
  return wrap;
}

export function buildCompassShareCard(
  result: QuizResult,
  axes: Axis[],
  religion: Religion | null
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category, result.topMatch.ideologyId);
  const { stage, target } = lightShell(color);
  // Os ícones dos valores usam --cat e --cat-bg (a cor da ideologia), como na página.
  target.style.setProperty('--cat', color.base);
  target.style.setProperty('--cat-bg', color.bg);

  const results = new Map<string, AxisResult>(result.axes.map((axis) => [axis.axisId, axis]));
  const position = computeCompass(results);
  const moralAxis = axes.find((axis) => axis.id === 'moral');

  target.append(
    buildShareHeader(t.shareValuesCompass, { ink: INK, label: color.base, rule: rgba(INK, 0.2) }),
    buildShareIdentity(result, color.base, color.base)
  );
  if (position) target.append(compassBox(position, color, result.topMatch.category, moralAxis, result.topMatch.ideologyId));
  const values = result.politicalValues ?? [];
  if (values.length > 0) target.append(valuesBox(values, color, religion));
  target.append(
    buildShareFooter(
      t.shareFooterCta,
      shortResultUrl(
        result.axes.map((axis) => Math.round(axis.leftPercent)),
        religion,
        LANG
      ),
      undefined,
      { ink: color.base, cta: color.base, footerRule: rgba(INK, 0.2), qr: color.base }
    )
  );
  return { stage, target };
}

/** Gera o PNG 1080x1920 do cartão de valores e bússola (data URL), sem baixar nem compartilhar. */
export function createCompassSharePng(result: QuizResult, axes: Axis[], religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildCompassShareCard(result, axes, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportCompassShare(result: QuizResult, axes: Axis[], religion: Religion | null): Promise<void> {
  const dataUrl = await createCompassSharePng(result, axes, religion);
  await downloadAndShare(dataUrl, {
    filePrefix: t.shareCompassFilePrefix,
    title: t.shareCompassTitle,
    text: t.shareCompassMessage(result.topMatch.name)
  });
}
