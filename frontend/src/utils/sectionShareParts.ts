import { LANG } from '../i18n';
import { fitFontSize, shorten, textWidth } from './compareShareCard';
import { loadShareFonts } from './shareImage';
import {
  SHARE_COLORS,
  SHARE_FONT_BODY,
  SHARE_FONT_DISPLAY,
  SHARE_HEIGHT,
  SHARE_WIDTH,
  clamp,
  el,
  mixHex,
  renderSharePng,
  rgba
} from './shareCard';

/**
 * Peças dos cartões de compartilhamento de seção (países, personalidades, partidos, bússola e valores) — stories 1080x1920, no
 * mesmo esquema do cartão do resultado: o DOM só tem texto e caixas; fotos, bandeiras, logos e o QR são desenhados no canvas por
 * renderSharePng.
 *
 * Nada pode sair do lugar nem sobrepor outra coisa, qualquer que seja o nome: cada texto tem um tamanho de fonte calculado para
 * caber (a fonte diminui, o texto não quebra o layout) e cada bloco tem altura fixa.
 */

export const P = SHARE_COLORS.papel;
export const CONTENT_WIDTH = SHARE_WIDTH - 128;
export const BOX_BORDER = 2;
// A medida de uma fonte no canvas pode diferir um pouco da do aparelho: o texto usa só uma parte da largura útil.
export const SAFETY = 0.95;
/** Largura útil de um país, personalidade ou partido em destaque: cada caixa tem (largura útil - espaço entre elas) / 2, menos o padding e a borda. */
export const FEATURE_INNER = (CONTENT_WIDTH - 24) / 2 - 60 - BOX_BORDER * 2;

export type Palette = { base: string; bg: string };

export { clamp, el, mixHex, rgba, shorten, SHARE_FONT_BODY, SHARE_FONT_DISPLAY };

// ---- medidas de texto

/** Quantas linhas o texto ocupa em `width` no tamanho dado, e se alguma palavra sozinha já passa da largura. */
function wrapCount(text: string, weight: number, family: string, size: number, width: number, tracking: number): { lines: number; tooWide: boolean } {
  let lines = 1;
  let line = '';
  let tooWide = false;
  for (const word of text.split(/\s+/)) {
    if (textWidth(word, weight, size, family) + tracking * size * word.length > width) tooWide = true;
    const candidate = line ? `${line} ${word}` : word;
    const measured = textWidth(candidate, weight, size, family) + tracking * size * candidate.length;
    if (measured > width && line) {
      lines += 1;
      line = word;
    } else {
      line = candidate;
    }
  }
  return { lines, tooWide };
}

interface BlockFit {
  weight: number;
  family: string;
  /** Largura em que o texto quebra linha. */
  width: number;
  /** Altura fixa do bloco: quantas linhas cabem depende do tamanho da fonte. */
  height: number;
  lineHeight: number;
  max: number;
  min: number;
  /** Espaço entre letras, em em. */
  tracking: number;
}

/**
 * Maior tamanho de fonte (entre max e min) em que o texto cabe numa caixa de altura fixa: uma fonte menor deixa caber mais linhas
 * (como o nome em destaque, que tem 2 linhas em 44px e 3 em 29px na mesma altura) e nenhuma palavra passa da largura.
 */
export function fitBlock(text: string, fit: BlockFit): number {
  for (let size = fit.max; size >= fit.min; size -= 1) {
    const allowed = Math.max(1, Math.floor(fit.height / (size * fit.lineHeight) + 1e-6));
    const { lines, tooWide } = wrapCount(text, fit.weight, fit.family, size, fit.width, fit.tracking);
    if (!tooWide && lines <= allowed) return size;
  }
  return fit.min;
}

// ---- caixas

export function box(extra: Partial<CSSStyleDeclaration>, light = false): HTMLElement {
  return el('div', {
    borderRadius: '36px',
    background: light ? '#FAF8F3' : 'rgba(0, 0, 0, 0.22)',
    border: light ? `${BOX_BORDER}px solid #E8E3D3` : `${BOX_BORDER}px solid ${rgba(P, 0.14)}`,
    ...extra
  });
}

/** O título pequeno de uma caixa: caixa-alta, uma linha só, a fonte diminui se o texto não couber. */
export function boxLabel(text: string, color: string, width: number): HTMLElement {
  const upper = text.toLocaleUpperCase(LANG);
  const size = fitFontSize(upper, 600, SHARE_FONT_BODY, width * SAFETY, 1, 26, 15, 0.15);
  return el('div', {
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: `${size}px`,
    letterSpacing: '0.15em',
    lineHeight: '1.2',
    whiteSpace: 'nowrap',
    color
  }, upper);
}

export const percentText = (value: number): string => `${Math.round(clamp(value))}%`;

// ---- estrutura do cartão

/** A base e o círculo do canto, desenhados no canvas por baixo do DOM (ver renderSharePng). */
export function cardShell(base: string, circle: string, color: string): { stage: HTMLDivElement; target: HTMLDivElement } {
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
    // Fundo transparente: o fundo e as imagens são desenhados no canvas.
    background: 'transparent',
    fontFamily: SHARE_FONT_BODY,
    color,
    display: 'flex',
    flexDirection: 'column',
    // O espaço que sobra se divide entre os blocos, como no desenho.
    justifyContent: 'space-between',
    overflow: 'hidden'
  }) as HTMLDivElement;
  target.dataset.shareBase = base;
  target.dataset.shareCircle = circle;
  stage.append(target);
  return { stage, target };
}

/** Cartão escuro: o fundo é a cor da ideologia e o círculo do canto, a mesma cor clareada em 10%. */
export function darkShell(color: Palette): { stage: HTMLDivElement; target: HTMLDivElement } {
  return cardShell(color.base, mixHex(color.base, P, 0.9), P);
}

/** Cartão claro: fundo de papel, texto escuro e o círculo do canto na cor do pastel da ideologia, bem esmaecida. */
export function lightShell(color: Palette): { stage: HTMLDivElement; target: HTMLDivElement } {
  return cardShell(P, mixHex(color.bg, P, 0.45), SHARE_COLORS.tinta);
}

// ---- blocos de conteúdo

interface FeatureSpec {
  label: string;
  name: string;
  pct: number;
  /** A área de 290px com a bandeira ou o logo (ver os cartões). */
  visual: HTMLElement;
  /** Altura fixa do nome e o maior tamanho da fonte dele (o menor é 16px). */
  nameHeight: number;
  nameMax: number;
}

/** O destaque (atual ou histórico): título, imagem, porcentagem e o nome numa altura fixa. */
export function featureBox(spec: FeatureSpec, color: Palette): HTMLElement {
  const wrap = box({ flex: '1 1 0', minWidth: '0', display: 'flex', flexDirection: 'column', padding: '28px 30px' });
  const lineHeight = 1.12;
  const nameSize = fitBlock(spec.name, {
    weight: 600,
    family: SHARE_FONT_DISPLAY,
    width: FEATURE_INNER * SAFETY,
    height: spec.nameHeight,
    lineHeight,
    max: spec.nameMax,
    min: 16,
    // -0.0227em = os -1px de espaço entre letras do desenho, em 44px.
    tracking: -0.0227
  });
  wrap.append(
    boxLabel(spec.label, color.bg, FEATURE_INNER),
    spec.visual,
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '96px',
      lineHeight: '1',
      letterSpacing: '-3px',
      color: color.bg
    }, percentText(spec.pct)),
    el('div', {
      marginTop: '12px',
      // Altura fixa: um nome menor ou de uma linha só não puxa o resto do cartão.
      height: `${spec.nameHeight}px`,
      overflow: 'hidden',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: String(lineHeight),
      letterSpacing: '-0.0227em',
      overflowWrap: 'break-word'
    }, spec.name)
  );
  return wrap;
}

interface DimensionSpec {
  /** "Politicamente", "Socialmente" ou "Economicamente". */
  label: string;
  name: string;
  pct: number;
  /** A bandeira, o retrato ou o logo, com a largura e a altura dele. */
  visual: HTMLElement;
  visualWidth: number;
  visualHeight: number;
}

/** Uma linha de "politicamente / socialmente / economicamente": imagem, o nome numa linha só e a porcentagem. */
export function dimensionLine(spec: DimensionSpec, color: Palette): HTMLElement {
  // A caixa menos o padding, a borda, a imagem, os espaços e a porcentagem.
  const textWidthPx = CONTENT_WIDTH - 68 - BOX_BORDER * 2 - spec.visualWidth - 20 - 20 - 100;
  const nameSize = fitFontSize(spec.name, 500, SHARE_FONT_BODY, textWidthPx * SAFETY, 1, 31, 16, 0);
  const line = el('div', { display: 'flex', alignItems: 'center', gap: '20px', height: `${Math.max(64, spec.visualHeight)}px` });
  const text = el('div', { flex: '1 1 0', minWidth: '0' });
  text.append(
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '21px',
      letterSpacing: '3px',
      lineHeight: '1.2',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      color: rgba(color.bg, 0.8)
    }, spec.label),
    el('div', {
      marginTop: '2px',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '500',
      fontSize: `${nameSize}px`,
      lineHeight: '1.15',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: rgba(P, 0.94)
    }, spec.name)
  );
  line.append(
    spec.visual,
    text,
    el('div', {
      flex: '0 0 auto',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '34px',
      color: color.bg
    }, percentText(spec.pct))
  );
  return line;
}

export function dimensionsBox(lines: HTMLElement[]): HTMLElement {
  const wrap = box({ display: 'flex', flexDirection: 'column', gap: '30px', padding: '36px 34px' });
  lines.forEach((line) => wrap.append(line));
  return wrap;
}

const MAX_FAR = 3;
// Rede de segurança: nada passa de 70 caracteres (o catálogo tem no máximo 61).
const MAX_FAR_CHARS = 70;
// Etiquetas dos "mais distantes": a caixa menos o padding, a borda e o padding da própria etiqueta.
const CHIP_TEXT_WIDTH = CONTENT_WIDTH - 60 - BOX_BORDER * 2 - 48 - BOX_BORDER * 2;

const CHIP_ROW_WIDTH = CONTENT_WIDTH - 60 - BOX_BORDER * 2;

/** Quantas linhas as etiquetas ocupam (cada uma tem a largura do próprio texto e as que não cabem na linha descem). */
export function farRowCount(names: string[], compact = false): number {
  let rows = 1;
  let used = 0;
  names.slice(0, MAX_FAR).forEach((original) => {
    const name = shorten(original, MAX_FAR_CHARS);
    const size = fitFontSize(name, 500, SHARE_FONT_BODY, CHIP_TEXT_WIDTH * SAFETY, 1, 27, 14, 0);
    const width = Math.min(textWidth(name, 500, size, SHARE_FONT_BODY) + (compact ? 44 : 48) + BOX_BORDER * 2, CHIP_ROW_WIDTH);
    if (used > 0 && used + 12 + width > CHIP_ROW_WIDTH) {
      rows += 1;
      used = width;
    } else {
      used += (used > 0 ? 12 : 0) + width;
    }
  });
  return rows;
}

/** A altura da caixa dos mais distantes com `rows` linhas de etiquetas (uma estimativa por cima: a fonte é no máximo 27px). */
export function farBoxHeight(rows: number, compact = false): number {
  const chip = 27 + (compact ? 24 : 30) + BOX_BORDER * 2;
  return 56 + BOX_BORDER * 2 + 32 + 20 + rows * chip + (rows - 1) * 12;
}

/** A altura útil de um cartão: o 1920px menos o padding de cima e de baixo. */
export const CARD_CONTENT_HEIGHT = SHARE_HEIGHT - 128;

/** "Os mais distantes de você": uma etiqueta por nome, cada uma numa linha só (a fonte diminui nos nomes longos). */
export function farBox(title: string, names: string[], color: Palette, compact = false): HTMLElement {
  const wrap = box({ padding: '28px 30px' });
  const chips = el('div', { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' });
  names.slice(0, MAX_FAR).forEach((original) => {
    const name = shorten(original, MAX_FAR_CHARS);
    const size = fitFontSize(name, 500, SHARE_FONT_BODY, CHIP_TEXT_WIDTH * SAFETY, 1, 27, 14, 0);
    chips.append(el('span', {
      maxWidth: '100%',
      padding: compact ? '12px 22px' : '15px 24px',
      borderRadius: '999px',
      background: rgba(P, 0.09),
      border: `${BOX_BORDER}px solid ${rgba(P, 0.14)}`,
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '500',
      fontSize: `${size}px`,
      lineHeight: '1',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: rgba(P, 0.92)
    }, name));
  });
  wrap.append(boxLabel(title, color.bg, CONTENT_WIDTH - 60 - BOX_BORDER * 2), chips);
  return wrap;
}

// ---- exportação

/** Gera o PNG do cartão (data URL), sem baixar nem compartilhar. */
export async function renderSectionPng(build: () => { stage: HTMLDivElement; target: HTMLDivElement }): Promise<string> {
  await loadShareFonts();
  const { toPng } = await import('html-to-image');
  const { stage, target } = build();
  document.body.appendChild(stage);
  try {
    return await renderSharePng(target, toPng);
  } finally {
    stage.remove();
  }
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export interface SectionShareMeta {
  filePrefix: string;
  title: string;
  text: string;
}

/** Baixa o PNG e abre a folha de compartilhamento do aparelho (quando existe). */
export async function downloadAndShare(dataUrl: string, meta: SectionShareMeta): Promise<void> {
  downloadDataUrl(dataUrl, `${meta.filePrefix}-${new Date().toISOString().slice(0, 10)}.png`);
  if (typeof navigator.share !== 'function') return;
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${meta.filePrefix}.png`, { type: 'image/png' });
    const base: ShareData = { title: meta.title, text: meta.text };
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

