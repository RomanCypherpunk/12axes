import { t } from '../i18n';
import type { PersonalityMatch, QuizPayload, QuizResult } from '../types/quiz';
import { resolveCountryFlagSrc } from './countryFlags';
import { personalityInitials, resolvePersonalityImageSrc } from './personalityImage';
import { resolveIdeologyColor } from './ideologyColors';

/**
 * Cartão de compartilhamento social — formato stories 1080x1920.
 *
 * O fundo é a cor base da categoria de espectro do top match; os destaques
 * usam o pastel da mesma categoria. Ver
 * docs/nova-identidade/12axes-identidade-visual.md §11.
 */
export const SHARE_WIDTH = 1080;
export const SHARE_HEIGHT = 1920;

const SHARE_FONT_DISPLAY = '"Sora"';
const SHARE_FONT_BODY = '"Poppins"';
const SVG_NS = 'http://www.w3.org/2000/svg';

export const SHARE_COLORS = {
  papel: '#F4F1E8',
  tinta: '#101010'
};

type Style = Partial<CSSStyleDeclaration>;
type PoleSide = 'left' | 'right';

function el(tag: string, style: Style, text?: string): HTMLElement {
  const node = document.createElement(tag);
  node.style.boxSizing = 'border-box';
  Object.assign(node.style, style);
  if (text != null) {
    node.textContent = text;
  }
  return node;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Mistura `a` e `b` com `ratioA` peso de `a` (equivalente a color-mix). */
function mixHex(a: string, b: string, ratioA: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar * ratioA + br * (1 - ratioA));
  const g = Math.round(ag * ratioA + bg * (1 - ratioA));
  const bl = Math.round(ab * ratioA + bb * (1 - ratioA));
  return `rgb(${r}, ${g}, ${bl})`;
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function readableInk(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.48 ? SHARE_COLORS.tinta : SHARE_COLORS.papel;
}

function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

const sharePoleIconPaths: Record<string, Record<PoleSide, string[]>> = {
  estrutura: {
    left: ['M4 10h16', 'M6 10v8', 'M10 10v8', 'M14 10v8', 'M18 10v8', 'M3 18h18', 'm12 4 8 4H4l8-4Z'],
    right: ['M6 8h12v12H6z', 'M9 8V5h6v3', 'M9 12h6', 'M9 16h6']
  },
  representacao: {
    left: ['M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M3 20a5 5 0 0 1 10 0', 'M11 20a5 5 0 0 1 10 0'],
    right: ['m4 9 4 3 4-7 4 7 4-3-2 10H6L4 9Z', 'M8 19h8']
  },
  poder: {
    left: ['M12 3 5 6v5c0 4.2 2.7 7.9 7 10 4.3-2.1 7-5.8 7-10V6l-7-3Z', 'm9 12 2 2 4-5'],
    right: ['M12 3v18', 'M6 9h12', 'M8 21h8', 'M5 13c1.5 2 4.5 2 6 0', 'M13 13c1.5 2 4.5 2 6 0']
  },
  imigracao: {
    left: ['M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M2 19a5 5 0 0 1 10 0', 'M15 5h5', 'M15 10h5', 'M15 15h5'],
    right: ['M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M3 20a5 5 0 0 1 10 0', 'M14 8h6', 'm17 5 3 3-3 3', 'M15 16h6', 'm18 13 3 3-3 3']
  },
  diplomacia: {
    left: ['M5 20V4', 'M5 5h11l-2 4 2 4H5'],
    right: ['M6 19c6-2 10-6 12-13', 'M7 8c3 1 5 3 6 6', 'M5 13c4 0 7 1 10 4', 'M18 6c-3-1-6-1-9 1']
  },
  intervencao: {
    left: ['M7 12h10', 'm10 8-4 4 4 4', 'M18 5v14'],
    right: ['M6 20V4', 'M6 5h11l-2 4 2 4H6', 'M4 20h8']
  },
  economia: {
    left: ['M5 11h14', 'M7 11v8', 'M17 11v8', 'M12 5v14', 'M4 19h16'],
    right: ['M12 3v18', 'M17 7.5C16 5.8 14.3 5 12 5 9.2 5 7.5 6.3 7.5 8.5S9 12 12 12s4.5 1.2 4.5 3.5S14.8 19 12 19c-2.3 0-4-.8-5-2.5']
  },
  controle: {
    left: ['M4 7h16', 'M4 12h16', 'M4 17h16', 'M9 5v4', 'M15 10v4', 'M11 15v4'],
    right: ['M12 3v18', 'M17 7.5C16 5.8 14.3 5 12 5 9.2 5 7.5 6.3 7.5 8.5S9 12 12 12s4.5 1.2 4.5 3.5S14.8 19 12 19c-2.3 0-4-.8-5-2.5']
  },
  comercio: {
    left: ['M12 3 5 6v5c0 4.2 2.7 7.9 7 10 4.3-2.1 7-5.8 7-10V6l-7-3Z', 'm9 12 2 2 4-5'],
    right: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M3 12h18', 'M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21', 'M12 3c-2.4 2.5-3.6 5.5-3.6 9s1.2 6.5 3.6 9']
  },
  religiao: {
    left: ['M12 4v16', 'M4 12h16', 'M6 18 18 6'],
    right: ['M12 3v18', 'M7 8h10', 'M6 20h12']
  },
  moral: {
    left: ['M20 8c0 6-8 11-8 11S4 14 4 8a4 4 0 0 1 7-2.7A4 4 0 0 1 20 8Z'],
    right: ['M7 4h10', 'M8 20h8', 'M9 4c0 5 6 5 6 10 0 2-1.3 4-3 6-1.7-2-3-4-3-6 0-5 6-5 6-10']
  },
  tecnologia: {
    left: ['M8 8h8v8H8z', 'M4 10h4', 'M4 14h4', 'M16 10h4', 'M16 14h4', 'M10 4v4', 'M14 4v4', 'M10 16v4', 'M14 16v4'],
    right: ['M5 19c8 0 13-5 14-14-7 1-13 5-14 14Z', 'M5 19c4-5 8-8 14-14']
  }
};

export function buildShareCard(
  result: QuizResult,
  quiz: QuizPayload
): { stage: HTMLDivElement; target: HTMLDivElement; backgroundColor: string } {
  const color = resolveIdeologyColor(result.topMatch.category);
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
    boxSizing: 'border-box',
    // Fundo transparente: o fundo e as fotos são desenhados direto no canvas
    // (ver renderSharePng), o html-to-image só renderiza texto e caixas.
    background: 'transparent',
    fontFamily: SHARE_FONT_BODY,
    color: SHARE_COLORS.papel,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }) as HTMLDivElement;

  const content = el('div', {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    minHeight: '0',
    gap: '24px'
  });

  content.append(
    buildShareHeader(),
    buildShareIdentity(result, color.bg),
    buildShareTwoColumns(result, quiz, color),
    buildShareLists(result, color),
    buildShareFooter()
  );

  target.append(content);
  target.dataset.shareBase = color.base;
  target.dataset.shareCircle = mixHex(color.base, SHARE_COLORS.papel, 0.9);
  stage.append(target);
  return { stage, target, backgroundColor: color.base };
}

function buildShareHeader(): HTMLElement {
  const P = SHARE_COLORS.papel;
  const header = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '28px'
  });
  header.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '58px',
      letterSpacing: '-0.03em',
      color: P,
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '9px'
    }),
    el('div', { flex: '1 1 auto', height: '3px', background: rgba(P, 0.35) }),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '30px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: rgba(P, 0.82)
    }, t.shareResultLabel)
  );
  const brand = header.firstChild as HTMLElement;
  brand.append(
    el('span', {}, '12'),
    el('span', { fontFamily: SHARE_FONT_BODY, fontWeight: '400' }, 'axes')
  );
  return header;
}

function buildShareIdentity(result: QuizResult, bgColor: string): HTMLElement {
  const P = SHARE_COLORS.papel;
  const wrap = el('div', { display: 'flex', flexDirection: 'column', gap: '0', marginTop: '18px' });
  wrap.append(
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '34px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: bgColor
    }, result.topMatch.category),
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: '76px',
      lineHeight: '1.05',
      letterSpacing: '-0.02em',
      color: P,
      marginTop: '-8px'
    }, result.topMatch.name)
  );
  return wrap;
}

function buildShareTwoColumns(
  result: QuizResult,
  quiz: QuizPayload,
  color: { base: string; bg: string }
): HTMLElement {
  const row = el('div', {
    display: 'flex',
    gap: '24px',
    flex: '0 0 920px',
    height: '920px',
    minHeight: '920px',
    marginTop: '8px'
  });
  row.append(
    buildSharePersonalityPortrait(result.topPersonalityMatch, color),
    buildShareAxesColumn(result, quiz, color)
  );
  return row;
}

function buildSharePersonalityPortrait(
  person: PersonalityMatch,
  color: { base: string; bg: string }
): HTMLElement {
  const P = SHARE_COLORS.papel;
  const frame = el('div', {
    position: 'relative',
    flex: '0 0 390px',
    height: '920px',
    borderRadius: '36px',
    overflow: 'hidden'
  });

  // A foto, o véu e o degradê são compostos no canvas, embaixo deste texto.
  frame.dataset.shareImage = 'portrait';
  frame.dataset.shareSrc = resolvePersonalityImageSrc(person.imagePath);

  const text = el('div', {
    position: 'absolute',
    left: '32px',
    right: '32px',
    bottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  });
  const pct = clamp(person.compatibility);
  text.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '84px',
      lineHeight: '1',
      letterSpacing: '-3px',
      color: color.bg
    }, `${Math.round(pct)}%`),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '26px',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: color.bg
    }, t.shareMostCompatible),
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: '48px',
      lineHeight: '1.15',
      letterSpacing: '-1px',
      color: P,
      marginTop: '6px'
    }, person.name),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontSize: '30px',
      color: rgba(P, 0.82)
    }, person.role)
  );
  frame.append(text);

  return frame;
}

function buildShareAxesColumn(
  result: QuizResult,
  quiz: QuizPayload,
  color: { base: string; bg: string }
): HTMLElement {
  const P = SHARE_COLORS.papel;
  const col = el('div', {
    flex: '1 1 auto',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '30px 30px 26px',
    borderRadius: '36px',
    background: 'rgba(0, 0, 0, 0.22)',
    border: `2px solid ${rgba(P, 0.14)}`
  });
  col.append(el('div', {
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: '26px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    color: color.bg
  }, t.shareYourAxes));

  const list = el('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    flex: '1 1 auto',
    justifyContent: 'space-between'
  });
  const axesById = new Map(quiz.axes.map((axis) => [axis.id, axis]));
  result.axes.forEach((axis) => list.append(buildShareAxisLine(axis, axesById.get(axis.axisId), color)));
  col.append(list);
  return col;
}

function buildShareAxisLine(
  axis: QuizResult['axes'][number],
  definition: QuizPayload['axes'][number] | undefined,
  color: { base: string; bg: string }
): HTMLElement {
  const P = SHARE_COLORS.papel;
  const isBalanced = axis.intensity === 'Equilibrado';
  const leaningRight = axis.dominantPole === axis.rightPole;
  const winningPole = isBalanced ? axis.rightPole : leaningRight ? axis.rightPole : axis.leftPole;
  const winningPct = isBalanced ? 50 : leaningRight ? axis.rightPercent : axis.leftPercent;
  const side: PoleSide = leaningRight ? 'right' : 'left';
  const accent = isBalanced
    ? color.bg
    : leaningRight
      ? definition?.rightColor ?? color.bg
      : definition?.leftColor ?? color.bg;

  const row = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    height: '58px'
  });

  const icon = el('span', {
    flex: '0 0 auto',
    width: '46px',
    height: '46px',
    borderRadius: '13px',
    display: 'grid',
    placeItems: 'center',
    color: readableInk(accent),
    background: accent
  });
  icon.append(buildPoleGlyph(axis.axisId, side));

  const mini = el('span', {
    flex: '0 0 76px',
    width: '76px',
    height: '10px',
    borderRadius: '10px',
    overflow: 'hidden',
    background: rgba(P, 0.16)
  });
  mini.append(el('i', {
    display: 'block',
    width: `${clamp(winningPct)}%`,
    height: '100%',
    borderRadius: '10px',
    background: accent
  }));

  row.append(
    icon,
    el('span', {
      flex: '1 1 auto',
      minWidth: '0',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '500',
      fontSize: '28px',
      color: rgba(P, 0.92),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, winningPole),
    mini,
    el('span', {
      flex: '0 0 70px',
      width: '70px',
      textAlign: 'right',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '32px',
      color: accent
    }, `${Math.round(winningPct)}%`)
  );

  return row;
}

function buildPoleGlyph(axisId: string, side: PoleSide): SVGElement {
  const svg = svgEl('svg', {
    viewBox: '0 0 24 24',
    width: 26,
    height: 26,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2.2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });
  const paths = sharePoleIconPaths[axisId]?.[side] ?? sharePoleIconPaths.estrutura[side];
  paths.forEach((path) => svg.append(svgEl('path', { d: path })));
  return svg;
}

function buildShareLists(
  result: QuizResult,
  color: { base: string; bg: string }
): HTMLElement {
  const row = el('div', {
    display: 'flex',
    gap: '24px'
  });
  row.append(
    buildShareListBox(
      t.shareOtherPersonalities,
      result.personalityMatches.slice(0, 3).map((person) => ({
        label: person.name,
        pct: person.compatibility,
        avatar: resolvePersonalityImageSrc(person.imagePath),
        alt: person.name,
        initials: personalityInitials(person.name)
      })),
      color,
      'avatar'
    ),
    buildShareListBox(
      t.shareNearbyCountries,
      (result.topCountryMatches ?? []).slice(0, 3).map((country) => ({
        label: country.name,
        pct: country.compatibility,
        avatar: resolveCountryFlagSrc(country.flagPath),
        alt: country.name,
        initials: country.name.slice(0, 2).toUpperCase()
      })),
      color,
      'flag'
    )
  );
  return row;
}

interface ShareListItem {
  label: string;
  pct: number;
  avatar: string;
  alt: string;
  initials: string;
}

function buildShareListBox(
  title: string,
  items: ShareListItem[],
  color: { base: string; bg: string },
  kind: 'avatar' | 'flag'
): HTMLElement {
  const P = SHARE_COLORS.papel;
  const box = el('div', {
    flex: '1 1 0',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '28px 30px',
    borderRadius: '36px',
    background: 'rgba(0, 0, 0, 0.22)',
    border: `2px solid ${rgba(P, 0.14)}`
  });
  box.append(el('div', {
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: '26px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    color: color.bg
  }, title));

  items.forEach((item) => {
    const line = el('div', { display: 'flex', alignItems: 'center', gap: '18px' });
    const avatarFrame = el('div', {
      flex: '0 0 auto',
      width: '76px',
      height: kind === 'avatar' ? '76px' : '52px',
      borderRadius: kind === 'avatar' ? '50%' : '10px',
      overflow: 'hidden',
      background: mixHex(color.base, '#000000', 0.6),
      display: 'grid',
      placeItems: 'center',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '22px',
      color: rgba(SHARE_COLORS.papel, 0.7)
    }, item.initials);
    // A imagem é desenhada no canvas por cima destas iniciais (que só ficam
    // visíveis se a imagem não carregar).
    avatarFrame.dataset.shareImage = kind;
    avatarFrame.dataset.shareSrc = item.avatar;

    line.append(
      avatarFrame,
      el('span', {
        flex: '1 1 auto',
        minWidth: '0',
        fontFamily: SHARE_FONT_BODY,
        fontWeight: '500',
        fontSize: kind === 'flag' && item.label.length > 22 ? '25px' : '30px',
        lineHeight: kind === 'flag' ? '1.08' : '1.2',
        color: rgba(P, 0.92),
        whiteSpace: 'normal',
        wordBreak: 'normal',
        overflowWrap: 'break-word'
      }, item.label),
      el('span', {
        flex: '0 0 auto',
        fontFamily: SHARE_FONT_DISPLAY,
        fontWeight: '700',
        fontSize: '30px',
        color: color.bg
      }, `${Math.round(clamp(item.pct))}%`)
    );
    box.append(line);
  });

  return box;
}

function buildShareFooter(): HTMLElement {
  const P = SHARE_COLORS.papel;
  const footer = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '30px',
    borderTop: `2px solid ${rgba(P, 0.25)}`
  });
  footer.append(
    el('span', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '30px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: rgba(P, 0.9)
    }, t.shareFooterCta),
    el('span', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '30px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: P
    }, t.shareFooterUrl)
  );
  return footer;
}


/*
 * Exportação em camadas.
 *
 * O html-to-image desenha o DOM dentro de um SVG <foreignObject>. No Safari
 * (e em alguns Androids) esse SVG pode "terminar de carregar" antes das
 * imagens internas serem decodificadas, e o PNG sai sem as fotos — de forma
 * intermitente. Por isso as imagens nunca passam pelo html-to-image: ele só
 * renderiza texto, caixas e ícones sobre fundo transparente, e o resto é
 * desenhado aqui no canvas, esperando cada imagem carregar de verdade.
 *
 * Ordem das camadas: fundo → retrato composto → DOM → avatares e bandeiras
 * (estes por último porque ficam dentro de caixas translúcidas).
 */

type ToPng = (node: HTMLElement, options?: Record<string, unknown>) => Promise<string>;
type ShareImageKind = 'portrait' | 'avatar' | 'flag';

interface ShareImageSlot {
  kind: ShareImageKind;
  src: string;
  rect: CanvasRect;
}

type CanvasRect = { x: number; y: number; width: number; height: number };

const IMAGE_TIMEOUT_MS = 8000;

export async function renderSharePng(target: HTMLElement, toPng: ToPng): Promise<string> {
  const slots = collectImageSlots(target);
  // Carrega as imagens em paralelo com o render do DOM.
  const imagesPromise = Promise.all(slots.map((slot) => loadImage(slot.src).catch(() => null)));

  const domDataUrl = await toPng(target, {
    width: SHARE_WIDTH,
    height: SHARE_HEIGHT,
    pixelRatio: 1,
    cacheBust: false,
    skipFonts: false
  });
  const [domLayer, images] = await Promise.all([loadImage(domDataUrl), imagesPromise]);

  const canvas = document.createElement('canvas');
  canvas.width = SHARE_WIDTH;
  canvas.height = SHARE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas indisponível');
  }

  const base = target.dataset.shareBase ?? '#101010';
  drawBackground(ctx, base, target.dataset.shareCircle ?? base);

  slots.forEach((slot, index) => {
    if (slot.kind === 'portrait') {
      drawPortrait(ctx, images[index], slot.rect, base);
    }
  });

  ctx.drawImage(domLayer, 0, 0, SHARE_WIDTH, SHARE_HEIGHT);

  slots.forEach((slot, index) => {
    const image = images[index];
    if (!image || slot.kind === 'portrait') {
      return;
    }
    ctx.save();
    if (slot.kind === 'avatar') {
      ctx.beginPath();
      ctx.ellipse(
        slot.rect.x + slot.rect.width / 2,
        slot.rect.y + slot.rect.height / 2,
        slot.rect.width / 2,
        slot.rect.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.clip();
      drawCover(ctx, image, slot.rect, 0.2);
    } else {
      roundedRectPath(ctx, slot.rect, 10);
      ctx.clip();
      drawCover(ctx, image, slot.rect, 0.5);
    }
    ctx.restore();
  });

  return canvas.toDataURL('image/png');
}

function collectImageSlots(root: HTMLElement): ShareImageSlot[] {
  const rootRect = root.getBoundingClientRect();
  return Array.from(root.querySelectorAll<HTMLElement>('[data-share-image][data-share-src]'))
    .map((frame) => {
      const kind = frame.dataset.shareImage as ShareImageKind;
      const src = frame.dataset.shareSrc ?? '';
      const rect = frame.getBoundingClientRect();
      if (!src || rect.width <= 0 || rect.height <= 0) {
        return null;
      }
      return {
        kind,
        src,
        rect: {
          x: rect.left - rootRect.left,
          y: rect.top - rootRect.top,
          width: rect.width,
          height: rect.height
        }
      };
    })
    .filter((slot): slot is ShareImageSlot => slot !== null);
}

// Carrega via fetch → blob → objectURL para não depender de cabeçalhos CORS e
// garante que a imagem está decodificada antes de ir para o canvas.
async function loadImage(src: string): Promise<HTMLImageElement> {
  let objectUrl: string | null = null;
  let url = src;
  if (!src.startsWith('data:')) {
    const response = await withTimeout(
      fetch(new URL(src, window.location.href).href, { cache: 'force-cache', credentials: 'same-origin' }),
      IMAGE_TIMEOUT_MS
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    objectUrl = URL.createObjectURL(await response.blob());
    url = objectUrl;
  }
  try {
    const image = new Image();
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Could not decode image'));
        image.src = url;
      }),
      IMAGE_TIMEOUT_MS
    );
    if (typeof image.decode === 'function') {
      await image.decode().catch(() => undefined);
    }
    return image;
  } finally {
    if (objectUrl) {
      const toRevoke = objectUrl;
      // Revoga depois do desenho: alguns Safaris ainda leem o blob no drawImage.
      window.setTimeout(() => URL.revokeObjectURL(toRevoke), 30000);
    }
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// Fundo da cor da categoria com o círculo claro no canto superior direito.
function drawBackground(ctx: CanvasRenderingContext2D, base: string, circle: string) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SHARE_WIDTH, SHARE_HEIGHT);
  ctx.fillStyle = circle;
  ctx.beginPath();
  ctx.arc(SHARE_WIDTH, 0, 400, 0, Math.PI * 2);
  ctx.fill();
}

// Retrato: foto com leve contraste, véu da categoria (multiply) e degradê até
// a cor base na parte de baixo, recortado com cantos arredondados.
function drawPortrait(ctx: CanvasRenderingContext2D, image: HTMLImageElement | null, rect: CanvasRect, base: string) {
  const layer = document.createElement('canvas');
  layer.width = Math.round(rect.width);
  layer.height = Math.round(rect.height);
  const lctx = layer.getContext('2d');
  if (!lctx) {
    return;
  }
  const local = { x: 0, y: 0, width: layer.width, height: layer.height };

  lctx.fillStyle = mixHex(base, '#000000', 0.7);
  lctx.fillRect(0, 0, layer.width, layer.height);
  if (image) {
    drawCover(lctx, image, local, 0.15);
    adjustContrastBrightness(lctx, layer.width, layer.height, 1.1, 0.92);
    lctx.save();
    lctx.globalCompositeOperation = 'multiply';
    lctx.globalAlpha = 0.5;
    lctx.fillStyle = base;
    lctx.fillRect(0, 0, layer.width, layer.height);
    lctx.restore();
  }
  const gradient = lctx.createLinearGradient(0, 0, 0, layer.height);
  gradient.addColorStop(0.3, rgba(base, 0));
  gradient.addColorStop(0.58, rgba(base, 0.6));
  gradient.addColorStop(0.86, rgba(base, 0.97));
  gradient.addColorStop(1, rgba(base, 0.97));
  lctx.fillStyle = gradient;
  lctx.fillRect(0, 0, layer.width, layer.height);

  ctx.save();
  roundedRectPath(ctx, rect, 36);
  ctx.clip();
  ctx.drawImage(layer, rect.x, rect.y, rect.width, rect.height);
  ctx.restore();
}

// Equivalente ao filter: contrast() brightness() do CSS, feito em pixels
// porque ctx.filter não existe em Safaris mais antigos.
function adjustContrastBrightness(ctx: CanvasRenderingContext2D, width: number, height: number, contrast: number, brightness: number) {
  try {
    const data = ctx.getImageData(0, 0, width, height);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      for (let c = 0; c < 3; c += 1) {
        const v = ((px[i + c] / 255 - 0.5) * contrast + 0.5) * brightness * 255;
        px[i + c] = v < 0 ? 0 : v > 255 ? 255 : v;
      }
    }
    ctx.putImageData(data, 0, 0);
  } catch {
    // Canvas contaminado: segue sem o ajuste, a foto ainda aparece.
  }
}

// object-fit: cover, com o ponto vertical de foco em `focusY` (0 = topo).
function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, rect: CanvasRect, focusY: number) {
  const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.drawImage(
    image,
    rect.x + (rect.width - width) / 2,
    rect.y + (rect.height - height) * focusY,
    width,
    height
  );
}

function roundedRectPath(ctx: CanvasRenderingContext2D, rect: CanvasRect, radius: number) {
  const { x, y, width, height } = rect;
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
