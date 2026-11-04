import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VALUE_COINS } from '../components/results/valueCoins';
import { COMPASS_GRID_CELLS, compassClamp, compassView, socialStripCells } from '../components/results/PoliticalCompassSection';
import { FILLED_POLE_ICONS } from '../data/filledPoleIcons';
import { religiousPoleIcon } from '../data/religionIcons';
import { LANG, t } from '../i18n';
import type { Axis, AxisResult, PoliticalValue, QuizResult } from '../types/quiz';
import { ideologyColorByKey, resolveIdeologyColor } from './ideologyColors';
import { computeCompass, type CompassPosition } from './politicalCompass';
import { valueCoinMonogram } from './politicalValues';
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
const GRID_GAP = 4;
const MARKER_SIDE = 40;
const VALUE_COLUMNS = 3;
const VALUE_GAP = 16;
const VALUE_TILE_PAD_X = 22;
const VALUE_NAME_HEIGHT = 70;
const VALUE_TILE_HEIGHT = 262;
const MAX_VALUES = 6;
const VALUE_TEXT_WIDTH = (BOX_INNER - VALUE_GAP * (VALUE_COLUMNS - 1)) / VALUE_COLUMNS - VALUE_TILE_PAD_X * 2;

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
    gridTemplateColumns: 'repeat(9, 1fr)',
    gridAutoRows: '1fr',
    gap: `${GRID_GAP}px`
  });
  COMPASS_GRID_CELLS.forEach((color) => grid.append(el('span', { borderRadius: '5px', background: color })));
  grid.append(
    el('i', { position: 'absolute', left: '0', right: '0', top: '50%', height: '2px', background: 'rgba(16, 16, 16, 0.45)' }),
    el('i', { position: 'absolute', top: '0', bottom: '0', left: '50%', width: '2px', background: 'rgba(16, 16, 16, 0.45)' }),
    marker(
      { left: `${compassClamp(position.right)}%`, top: `${compassClamp(100 - position.authoritarian)}%`, width: `${MARKER_SIDE}px`, height: `${MARKER_SIDE}px` },
      markerColor,
      '8px'
    )
  );
  chart.append(top, left, grid, right, bottom);
  return chart;
}

/** O "Extrema direita com valores sociais Fortemente tradicionalistas": a categoria em cor, o resto em cinza e o grifo na cor da barra. */
function sentence(view: ReturnType<typeof compassView>): HTMLElement {
  const spectrumKey = view.centerSideKey ?? view.spectrum.key;
  const spectrumText = view.centerSideKey ? view.centerLabel : t.compassSpectrumLabels[view.spectrum.key];
  const social = t.compassSocialLabels[view.social];
  const parts = [spectrumText, t.compassWith, social, t.compassSocialValues].filter(Boolean);
  // O texto inteiro cabe em até 5 linhas da coluna; a fonte diminui nos idiomas e nas combinações mais longas.
  const size = fitBlock(parts.join(' '), {
    weight: 700,
    family: SHARE_FONT_DISPLAY,
    width: READ_WIDTH * SAFETY,
    height: 5 * 36 * 1.25,
    lineHeight: 1.25,
    max: 36,
    min: 20,
    tracking: -0.03
  });
  const p = el('div', {
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: `${size}px`,
    lineHeight: '1.25',
    letterSpacing: '-0.03em',
    color: '#5A5D63',
    overflowWrap: 'break-word'
  });
  const mark = el('span', { background: view.socialColor, color: '#FFFFFF', padding: '0.02em 0.2em', borderRadius: '8px' }, social);
  mark.style.setProperty('-webkit-box-decoration-break', 'clone');
  mark.style.setProperty('box-decoration-break', 'clone');
  p.append(
    el('span', { color: ideologyColorByKey(spectrumKey).base }, spectrumText),
    document.createTextNode(` ${t.compassWith} `),
    mark
  );
  if (t.compassSocialValues) p.append(document.createTextNode(` ${t.compassSocialValues}`));
  return p;
}

/** A barra progressista × tradicionalista: nove quadrados em tom pastel e o "X" na cor cheia. */
function socialStrip(view: ReturnType<typeof compassView>, traditional: number): HTMLElement {
  const wrap = el('div', { marginTop: '34px' });
  // Os dois rótulos dividem a largura da coluna numa linha só; a fonte diminui se não couberem.
  const labelsSize = fitFontSize(
    `${t.compassProgressive.toLocaleUpperCase(LANG)}   ${t.compassTraditionalist.toLocaleUpperCase(LANG)}`,
    600,
    SHARE_FONT_BODY,
    READ_WIDTH * SAFETY,
    1,
    17,
    10,
    0.1
  );
  const labels = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '10px',
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: `${labelsSize}px`,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    color: INK
  });
  labels.append(el('span', {}, t.compassProgressive), el('span', {}, t.compassTraditionalist));
  const strip = el('div', { position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '3px' });
  view.stripCells.forEach((color) => strip.append(el('span', { height: '46px', borderRadius: '4px', background: color })));
  strip.append(
    marker({ left: `${compassClamp(traditional)}%`, top: '50%', width: `${READ_WIDTH / 9 - 3}px`, height: '100%' }, view.socialColor, '6px')
  );
  wrap.append(labels, strip);
  return wrap;
}

function compassBox(position: CompassPosition, color: Palette, category: string, moralAxis: Axis | undefined): HTMLElement {
  const view = compassView(position, category, moralAxis);
  const wrap = box({ padding: `34px ${BOX_PADDING_X}px` }, true);
  const body = el('div', { display: 'flex', alignItems: 'center', gap: `${CHART_GAP}px`, marginTop: '30px' });
  const read = el('div', { flex: '1 1 0', minWidth: '0' });
  read.append(sentence(view), socialStrip(view, position.traditional));
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
    width: '84px',
    height: '84px',
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
  const labelSize = fitFontSize(label, 600, SHARE_FONT_BODY, VALUE_TEXT_WIDTH * SAFETY, 1, 19, 11, 0.16);
  const nameSize = fitBlock(value.name, {
    weight: 600,
    family: SHARE_FONT_DISPLAY,
    width: VALUE_TEXT_WIDTH * SAFETY,
    height: VALUE_NAME_HEIGHT,
    lineHeight: 1.25,
    max: 26,
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
      letterSpacing: '0.16em',
      lineHeight: '1.2',
      whiteSpace: 'nowrap',
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
      color: color.base
    }, value.name)
  );
  return tile;
}

function valuesBox(values: PoliticalValue[], color: Palette, religion: Religion | null): HTMLElement {
  const wrap = box({ padding: `34px ${BOX_PADDING_X}px` }, true);
  const grid = el('div', {
    display: 'grid',
    gridTemplateColumns: `repeat(${VALUE_COLUMNS}, minmax(0, 1fr))`,
    gap: `${VALUE_GAP}px`,
    marginTop: '28px'
  });
  values.slice(0, MAX_VALUES).forEach((value) => grid.append(valueTile(value, color, religion)));
  wrap.append(boxLabel(t.valuesSectionTitle, INK, BOX_INNER), grid);
  return wrap;
}

export function buildCompassShareCard(
  result: QuizResult,
  axes: Axis[],
  religion: Religion | null
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
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
  if (position) target.append(compassBox(position, color, result.topMatch.category, moralAxis));
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
