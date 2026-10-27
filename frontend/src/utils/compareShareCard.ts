import { t } from '../i18n';
import type { Axis, QuizResult } from '../types/quiz';
import { resolveCountryFlagSrc } from './countryFlags';
import { resolveIdeologyColor } from './ideologyColors';
import { resolvePersonalityImageSrc } from './personalityImage';
import type { Religion } from './religion';
import {
  SHARE_COLORS,
  SHARE_FONT_BODY,
  SHARE_FONT_DISPLAY,
  SHARE_HEIGHT,
  SHARE_WIDTH,
  buildPoleGlyph,
  buildShareFooter,
  buildShareHeader,
  clamp,
  el,
  mixHex,
  renderSharePng,
  rgba
} from './shareCard';

/**
 * Cartão de compartilhamento da comparação entre duas pessoas — stories 1080x1920, no mesmo esquema do cartão do
 * resultado (o DOM só tem texto e caixas; fotos e bandeiras são desenhadas no canvas por renderSharePng).
 *
 * Desenho: o fundo é um degradê da cor da ideologia de uma pessoa até a da outra. Cada pessoa tem uma cor clara
 * própria (a da sua ideologia) no selo com a inicial, nas porcentagens e nas etiquetas dos eixos; quando as duas
 * ficam juntas num eixo, a etiqueta vira "Vocês".
 */
export interface CompareShareData {
  names: [string, string];
  results: [QuizResult, QuizResult];
  /** % do polo esquerdo de cada eixo, na ordem de `axes`. */
  values: [number[], number[]];
  axes: Axis[];
  religions: [Religion | null, Religion | null];
  /** Só entra no texto do compartilhamento; o cartão não mostra a compatibilidade. */
  compatibility: number;
}

interface Side {
  name: string;
  result: QuizResult;
  values: number[];
  base: string;
  accent: string;
}

const P = SHARE_COLORS.papel;
const INK = '#0B1230';
const BOX = 'rgba(0, 0, 0, 0.22)';
const BOX_BORDER = '1.5px solid rgba(255, 255, 255, 0.1)';
const CONTENT_WIDTH = SHARE_WIDTH - 128;
/** Largura da trilha dos eixos: 905 (caixa por dentro) − 2×246 (polos) − 2×10 (espaços) − 2×4 (margens). */
const TRACK_WIDTH = 385;

// ---- cores

// Versão clara da cor da ideologia, legível sobre o fundo escuro (o pastel da categoria é claro demais para
// distinguir duas pessoas de ideologias parecidas).
function vivid(hex: string): string {
  const h = hex.replace('#', '');
  const [red, green, blue] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;
  if (delta > 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  const light = (max + min) / 2;
  const sat = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));
  const s = Math.max(0.6, Math.min(0.72, sat));
  const l = 0.77;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${to(r1)}${to(g1)}${to(b1)}`;
}

function sidesOf(data: CompareShareData): [Side, Side] {
  const colors = data.results.map((result) => resolveIdeologyColor(result.topMatch.category));
  // Mesma ideologia nas duas: a segunda vira papel, para os selos e as etiquetas não ficarem iguais.
  const sameColor = colors[0].base === colors[1].base;
  return [0, 1].map((index) => ({
    name: data.names[index],
    result: data.results[index],
    values: data.values[index],
    base: colors[index].base,
    accent: index === 1 && sameColor ? P : vivid(colors[index].base)
  })) as [Side, Side];
}

// ---- medidas de texto (o DOM não deixa o título e as etiquetas quebrarem, então a gente mede antes)

let measureContext: CanvasRenderingContext2D | null = null;

function textWidth(text: string, weight: number, size: number, family: string): number {
  measureContext ??= document.createElement('canvas').getContext('2d');
  if (!measureContext) return text.length * size * 0.6;
  measureContext.font = `${weight} ${size}px ${family}`;
  return measureContext.measureText(text).width;
}

/**
 * Maior tamanho (entre max e min) em que o texto cabe em `maxLines` linhas de `width`, sem nenhuma palavra maior que a
 * largura: o texto nunca quebra o layout, a fonte é que diminui (como no título do cartão do resultado).
 */
function fitFontSize(text: string, weight: number, family: string, width: number, maxLines: number, max: number, min: number, tracking: number): number {
  for (let size = max; size >= min; size -= 1) {
    const words = text.split(/\s+/);
    let lines = 1;
    let line = '';
    let wordTooWide = false;
    for (const word of words) {
      if (textWidth(word, weight, size, family) + tracking * size * word.length > width) wordTooWide = true;
      const candidate = line ? `${line} ${word}` : word;
      const measured = textWidth(candidate, weight, size, family) + tracking * size * candidate.length;
      if (measured > width && line) {
        lines += 1;
        line = word;
      } else {
        line = candidate;
      }
    }
    if (lines <= maxLines && !wordTooWide) return size;
  }
  return min;
}

/** Nome longo demais (o campo aceita até 40 caracteres) vira "Maximiliano Alexandre…" para caber no título. */
const shorten = (text: string, max: number): string => (Array.from(text).length > max ? `${Array.from(text).slice(0, max - 1).join('')}…` : text);

const firstLetter = (name: string): string => (Array.from(name.trim())[0] ?? '?').toUpperCase();
const firstName = (name: string): string => {
  const first = name.trim().split(/\s+/)[0] || name;
  return Array.from(first).length > 14 ? `${Array.from(first).slice(0, 13).join('')}…` : first;
};

// ---- cartão

export function buildCompareShareCard(data: CompareShareData): { stage: HTMLDivElement; target: HTMLDivElement } {
  const [a, b] = sidesOf(data);
  const stage = el('div', {
    position: 'fixed',
    top: '0',
    left: `-${SHARE_WIDTH + 200}px`,
    width: `${SHARE_WIDTH}px`,
    height: `${SHARE_HEIGHT}px`,
    pointerEvents: 'none',
    zIndex: '-1'
  }) as HTMLDivElement;

  const target = el('div', {
    position: 'relative',
    width: `${SHARE_WIDTH}px`,
    height: `${SHARE_HEIGHT}px`,
    padding: '64px',
    // Fundo transparente: o degradê e as imagens são desenhados no canvas (ver renderSharePng).
    background: 'transparent',
    fontFamily: SHARE_FONT_BODY,
    color: P,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }) as HTMLDivElement;

  const content = el('div', {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    minHeight: '0'
  });
  const header = buildShareHeader(t.shareCompareLabel);
  // Altura do desenho (64px): a do cabeçalho padrão é maior e empurraria os eixos para cima do rodapé.
  header.style.height = '64px';
  const footer = buildShareFooter();
  footer.style.marginTop = 'auto';
  content.append(
    header,
    buildTitle(a, b),
    buildIdeologies(a, b),
    buildDuo(a, b, personalityCard),
    buildDuo(a, b, countryCard),
    buildAxes(data, a, b),
    footer
  );
  target.append(content);
  target.dataset.shareBase = a.base;
  target.dataset.shareGradient = [a.base, mixHex(a.base, b.base, 2 / 3), mixHex(a.base, b.base, 1 / 3), b.base].join(';');
  stage.append(target);
  return { stage, target };
}

function buildTitle(a: Side, b: Side): HTMLElement {
  const weight = 700;
  const tracking = -0.04;
  const nameA = shorten(a.name, 24);
  const nameB = shorten(b.name, 24);
  const sample = `${nameA} × ${nameB}`;
  const natural = textWidth(sample, weight, 70, SHARE_FONT_DISPLAY) + tracking * 70 * sample.length + 60;
  const size = Math.max(28, Math.min(70, Math.floor((70 * CONTENT_WIDTH) / Math.max(natural, 1))));
  const row = el('div', {
    display: 'flex',
    alignItems: 'center',
    height: '80px',
    marginTop: '28px',
    whiteSpace: 'nowrap',
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: `${weight}`,
    fontSize: `${size}px`,
    lineHeight: '1',
    letterSpacing: `${tracking}em`
  });
  row.append(
    el('span', {}, nameA),
    el('span', { color: rgba(P, 0.5), fontWeight: '400', margin: '0 0.3em' }, '×'),
    el('span', {}, nameB)
  );
  return row;
}

// Selo redondo com a inicial da pessoa, no canto da caixa.
function badge(side: Side, size: number, fontSize: number, offset: number): HTMLElement {
  return el('div', {
    position: 'absolute',
    top: `${offset}px`,
    right: `${offset}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: side.accent,
    color: INK,
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: `${fontSize}px`,
    lineHeight: '1'
  }, firstLetter(side.name));
}

function buildIdeologies(a: Side, b: Side): HTMLElement {
  const grid = el('div', { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', marginTop: '18px' });
  [a, b].forEach((side) => {
    const name = side.result.topMatch.name;
    const size = fitFontSize(name, 700, SHARE_FONT_DISPLAY, 410, 2, 42, 26, -0.03);
    const categorySize = fitFontSize(side.result.topMatch.category, 600, SHARE_FONT_BODY, 340, 1, 22, 13, 0.18);
    const box = el('div', {
      position: 'relative',
      height: '212px',
      padding: '30px 28px 28px',
      borderRadius: '28px',
      background: BOX,
      border: BOX_BORDER,
      overflow: 'hidden'
    });
    box.append(
      el('div', {
        marginTop: '4px',
        fontFamily: SHARE_FONT_BODY,
        fontWeight: '600',
        fontSize: `${categorySize}px`,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        maxWidth: '340px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: side.accent
      }, side.result.topMatch.category),
      el('div', {
        marginTop: '22px',
        fontFamily: SHARE_FONT_DISPLAY,
        fontWeight: '700',
        fontSize: `${size}px`,
        lineHeight: '1.12',
        letterSpacing: '-0.03em',
        overflowWrap: 'anywhere',
        maxHeight: '110px',
        overflow: 'hidden'
      }, name),
      badge(side, 46, 22, 22)
    );
    grid.append(box);
  });
  return grid;
}

function buildDuo(a: Side, b: Side, card: (side: Side) => HTMLElement): HTMLElement {
  const grid = el('div', { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', marginTop: '18px' });
  grid.append(card(a), card(b));
  return grid;
}

function percentLine(value: number, color: string, size: number): HTMLElement {
  return el('div', {
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: `${size}px`,
    lineHeight: '1',
    letterSpacing: '-0.04em',
    color
  }, `${Math.round(clamp(value))}%`);
}

// Personalidade: retrato à esquerda, porcentagem e nome à direita.
function personalityCard(side: Side): HTMLElement {
  const person = side.result.topPersonalityMatch;
  const box = el('div', {
    position: 'relative',
    height: '252px',
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
    padding: '20px 22px',
    borderRadius: '28px',
    background: BOX,
    border: BOX_BORDER
  });
  const photo = el('div', { flex: '0 0 auto', width: '132px', height: '212px', borderRadius: '22px', background: rgba(P, 0.1) });
  photo.dataset.shareImage = 'photo';
  photo.dataset.shareSrc = resolvePersonalityImageSrc(person.imagePath);
  const nameSize = fitFontSize(person.name, 600, SHARE_FONT_BODY, 268, 3, 29, 14, 0);
  const text = el('div', { flex: '1 1 0', minWidth: '0', maxHeight: '212px', overflow: 'hidden', paddingTop: '6px' });
  text.append(
    percentLine(person.compatibility, side.accent, 58),
    el('div', {
      marginTop: '6px',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: '1.15',
      overflowWrap: 'anywhere'
    }, person.name)
  );
  box.append(photo, text, badge(side, 42, 20, 16));
  return box;
}

// País: cartão com degradê na cor da ideologia da pessoa, a bandeira inteira (sem corte nem zoom) à esquerda e a
// porcentagem e o nome à direita.
function countryCard(side: Side): HTMLElement {
  const country = side.result.topCountryMatch;
  const box = el('div', {
    position: 'relative',
    height: '252px',
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
    padding: '20px 22px',
    borderRadius: '28px'
  });
  box.dataset.shareImage = 'tint';
  box.dataset.shareTint = side.base;
  const flag = el('div', { flex: '0 0 auto', width: '190px', height: '127px' });
  flag.dataset.shareImage = 'flagfit';
  flag.dataset.shareSrc = resolveCountryFlagSrc(country.flagPath);
  const nameSize = fitFontSize(country.name, 600, SHARE_FONT_BODY, 210, 3, 29, 14, 0);
  const text = el('div', { flex: '1 1 0', minWidth: '0', maxHeight: '212px', overflow: 'hidden', paddingTop: '6px' });
  text.append(
    percentLine(country.compatibility, '#FFFFFF', 58),
    el('div', {
      marginTop: '6px',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: '1.15',
      overflowWrap: 'anywhere'
    }, country.name)
  );
  box.append(flag, text, badge(side, 42, 20, 16));
  return box;
}

// ---- eixos

function buildAxes(data: CompareShareData, a: Side, b: Side): HTMLElement {
  const box = el('div', {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '18px',
    padding: '16px 22px',
    borderRadius: '32px',
    background: BOX,
    border: BOX_BORDER
  });
  const sharedReligion = data.religions[0] === data.religions[1] ? data.religions[0] : null;
  data.axes.forEach((axis, index) => box.append(axisRow(axis, a, b, a.values[index] ?? 50, b.values[index] ?? 50, sharedReligion)));
  return box;
}

function pole(axis: Axis, side: 'left' | 'right', religion: Religion | null): HTMLElement {
  const color = side === 'left' ? axis.leftColor : axis.rightColor;
  const label = side === 'left' ? axis.leftPole : axis.rightPole;
  const wrap = el('div', {
    flex: '0 0 246px',
    width: '246px',
    display: 'flex',
    flexDirection: side === 'left' ? 'row' : 'row-reverse',
    alignItems: 'center',
    gap: '11px'
  });
  const icon = el('span', {
    flex: '0 0 auto',
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: color,
    color: '#FFFFFF',
    boxShadow: 'inset 0 0 0 1.5px rgba(255, 255, 255, 0.18)'
  });
  icon.append(buildPoleGlyph(axis.id, side, religion));
  wrap.append(
    icon,
    el('span', {
      flex: '1 1 0',
      minWidth: '0',
      textAlign: side === 'left' ? 'left' : 'right',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: `${fitFontSize(label, 600, SHARE_FONT_BODY, 190, 1, 22, 13, 0)}px`,
      color: P,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }, label)
  );
  return wrap;
}

interface Pill {
  text: string;
  background: string;
  /** Posição desejada, em px na trilha. */
  x: number;
  half: number;
}

function pill(text: string, background: string, x: number): Pill {
  // Largura da etiqueta: texto + 14px de cada lado + 3px de borda de cada lado.
  return { text, background, x, half: (textWidth(text, 700, 18, SHARE_FONT_BODY) + 34) / 2 };
}

const keepInside = (item: Pill): number => Math.max(item.half, Math.min(TRACK_WIDTH - item.half, item.x));

function axisRow(axis: Axis, a: Side, b: Side, valueA: number, valueB: number, religion: Religion | null): HTMLElement {
  const row = el('div', { display: 'flex', alignItems: 'center', gap: '10px', height: '58px' });

  const track = el('div', {
    position: 'relative',
    flex: '0 0 auto',
    width: `${TRACK_WIDTH}px`,
    height: '12px',
    margin: '0 4px',
    borderRadius: '6px',
    background: `linear-gradient(90deg, ${axis.leftColor}, rgba(255, 255, 255, 0.28) 50%, ${axis.rightColor})`
  });

  // O valor é a % do polo esquerdo: quanto maior, mais à esquerda fica a etiqueta.
  const first = pill(firstName(a.name), a.accent, ((100 - clamp(valueA)) / 100) * TRACK_WIDTH);
  const second = pill(firstName(b.name), b.accent, ((100 - clamp(valueB)) / 100) * TRACK_WIDTH);
  const placed: Array<{ item: Pill; x: number; z: number }> = [];
  const apart = Math.abs(keepInside(first) - keepInside(second));
  if (apart < first.half + second.half + 4) {
    // Etiquetas que se tocariam viram uma só, no meio.
    const both = pill(t.peopleBoth, P, (first.x + second.x) / 2);
    placed.push({ item: both, x: keepInside(both), z: 1 });
  } else {
    placed.push({ item: first, x: keepInside(first), z: 1 }, { item: second, x: keepInside(second), z: 2 });
  }
  placed.forEach(({ item, x, z }) => track.append(pillNode(item, x, z)));

  row.append(pole(axis, 'left', religion), track, pole(axis, 'right', religion));
  return row;
}

function pillNode(item: Pill, x: number, z: number): HTMLElement {
  return el('i', {
    position: 'absolute',
    top: '50%',
    left: `${x}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: `${z}`,
    height: '34px',
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '17px',
    border: '3px solid #0E1A44',
    background: item.background,
    color: INK,
    fontStyle: 'normal',
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '700',
    fontSize: '18px',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.35)'
  }, item.text);
}

// ---- exportação

function downloadDataUrl(dataUrl: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

async function loadCompareFonts(): Promise<void> {
  if (!document.fonts) {
    return;
  }
  await Promise.allSettled([
    document.fonts.load('400 30px "Poppins"'),
    document.fonts.load('500 30px "Poppins"'),
    document.fonts.load('600 30px "Poppins"'),
    document.fonts.load('700 18px "Poppins"'),
    document.fonts.load('600 22px "Poppins"'),
    document.fonts.load('600 30px "Sora"'),
    document.fonts.load('700 30px "Sora"'),
    document.fonts.load('800 30px "Sora"')
  ]);
  await document.fonts.ready;
}

/** Gera o PNG 1080x1920 da comparação (data URL), sem baixar nem compartilhar. */
export async function createCompareSharePng(data: CompareShareData): Promise<string> {
  await loadCompareFonts();
  const { toPng } = await import('html-to-image');
  const { stage, target } = buildCompareShareCard(data);
  document.body.appendChild(stage);
  try {
    return await renderSharePng(target, toPng);
  } finally {
    stage.remove();
  }
}

/** Gera o PNG da comparação, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportCompareShare(data: CompareShareData): Promise<void> {
  const dataUrl = await createCompareSharePng(data);
  downloadDataUrl(dataUrl, `${t.shareCompareFilePrefix}-${new Date().toISOString().slice(0, 10)}.png`);
  await shareImage(dataUrl, t.shareCompareMessage(data.names[1], Math.round(data.compatibility), data.results[0].topMatch.name, data.results[1].topMatch.name, window.location.href), Math.round(data.compatibility));
}

async function shareImage(dataUrl: string, text: string, percent: number) {
  if (typeof navigator.share !== 'function') return;
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${t.shareCompareFilePrefix}.png`, { type: 'image/png' });
    // O link vai dentro do texto, como no cartão do resultado (alguns apps repetiriam um `url` à parte).
    const base: ShareData = { title: t.shareCompareTitle(percent), text };
    if (navigator.canShare?.({ files: [file] }) === false) {
      await navigator.share(base);
      return;
    }
    try {
      await navigator.share({ ...base, files: [file] });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      await navigator.share(base);
    }
  } catch {
    // Cancelado pelo usuário ou sem permissão: o download já garantiu a imagem.
  }
}
