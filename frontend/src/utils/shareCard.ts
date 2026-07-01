import type { QuizPayload, QuizResult } from '../types/quiz';
import { resolveCountryFlagSrc } from './countryFlags';
import { personalityInitials, resolvePersonalityImageSrc } from './personalityImage';

/**
 * Cartão de compartilhamento social 1080x1440.
 *
 * Montado a partir do resultado (não clona a página), no formato 3:4 com a
 * identidade visual do 12 Axes: cabeçalho da ideologia (com anel de match
 * preenchido pela porcentagem) + 12 eixos fiéis à página de resultados à
 * esquerda, e país e personalidade compatíveis à direita.
 */
export const SHARE_WIDTH = 1080;
export const SHARE_HEIGHT = 1440;

export const SHARE_COLORS = {
  paper: '#FFFFFF',
  soft: '#FAFBFD',
  ink950: '#0B1020',
  ink900: '#111827',
  ink700: '#334155',
  ink500: '#64748B',
  ink400: '#94A3B8',
  ink300: '#CBD5E1',
  ink100: '#E2E8F0',
  ink50: '#F1F5F9',
  green700: '#15803D',
  green500: '#22C55E',
  green50: '#ECFDF3',
  line: 'rgba(11, 16, 32, 0.08)',
  lineStrong: 'rgba(11, 16, 32, 0.13)',
  balanced: '#94A3B8'
};
const SHARE_FONT_DISPLAY = '"Sora", ui-sans-serif, system-ui, -apple-system, sans-serif';
const SHARE_FONT_BODY = '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif';
const SHARE_ACCENT_GRAD = 'linear-gradient(135deg, #15803D 0%, #22C55E 55%, #4ADE80 100%)';
const SVG_NS = 'http://www.w3.org/2000/svg';
const SHARE_MATCH_RING_BG = 'rgba(34, 197, 94, 0.14)';

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

function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

const shareAxisIconPaths: Record<string, string[]> = {
  estrutura: [
    'M4 10h16',
    'M6 10v8',
    'M10 10v8',
    'M14 10v8',
    'M18 10v8',
    'M3 18h18',
    'm12 4 8 4H4l8-4Z'
  ],
  representacao: [
    'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M3 20a5 5 0 0 1 10 0',
    'M11 20a5 5 0 0 1 10 0'
  ],
  poder: [
    'M12 3 5 6v5c0 4.2 2.7 7.9 7 10 4.3-2.1 7-5.8 7-10V6l-7-3Z',
    'm9 12 2 2 4-5'
  ],
  imigracao: [
    'M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M3 20a5 5 0 0 1 10 0',
    'M14 8h6',
    'm17 5 3 3-3 3',
    'M15 16h6',
    'm18 13 3 3-3 3'
  ],
  diplomacia: [
    'M6 19c6-2 10-6 12-13',
    'M7 8c3 1 5 3 6 6',
    'M5 13c4 0 7 1 10 4',
    'M18 6c-3-1-6-1-9 1'
  ],
  intervencao: [
    'M7 12h10',
    'm13 8 4 4-4 4',
    'M5 5v14',
    'M19 5v14'
  ],
  economia: [
    'M4 18h16',
    'M7 18v-5',
    'M12 18V8',
    'M17 18v-8',
    'm6 11 6-6 6 4'
  ],
  controle: [
    'M4 7h16',
    'M4 12h16',
    'M4 17h16',
    'M9 5v4',
    'M15 10v4',
    'M11 15v4'
  ],
  comercio: [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
    'M3 12h18',
    'M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21',
    'M12 3c-2.4 2.5-3.6 5.5-3.6 9s1.2 6.5 3.6 9'
  ],
  religiao: [
    'M12 3v18',
    'M7 8h10',
    'M6 20h12'
  ],
  moral: [
    'M20 8c0 6-8 11-8 11S4 14 4 8a4 4 0 0 1 7-2.7A4 4 0 0 1 20 8Z'
  ],
  tecnologia: [
    'M8 8h8v8H8z',
    'M4 10h4',
    'M4 14h4',
    'M16 10h4',
    'M16 14h4',
    'M10 4v4',
    'M14 4v4',
    'M10 16v4',
    'M14 16v4'
  ]
};

const sharePoleIconPaths: Record<string, Record<PoleSide, string[]>> = {
  estrutura: {
    left: shareAxisIconPaths.estrutura,
    right: ['M6 8h12v12H6z', 'M9 8V5h6v3', 'M9 12h6', 'M9 16h6']
  },
  representacao: {
    left: shareAxisIconPaths.representacao,
    right: ['m4 9 4 3 4-7 4 7 4-3-2 10H6L4 9Z', 'M8 19h8']
  },
  poder: {
    left: shareAxisIconPaths.poder,
    right: ['M12 3v18', 'M6 9h12', 'M8 21h8', 'M5 13c1.5 2 4.5 2 6 0', 'M13 13c1.5 2 4.5 2 6 0']
  },
  imigracao: {
    left: ['M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M2 19a5 5 0 0 1 10 0', 'M15 5h5', 'M15 10h5', 'M15 15h5'],
    right: shareAxisIconPaths.imigracao
  },
  diplomacia: {
    left: ['M5 20V4', 'M5 5h11l-2 4 2 4H5'],
    right: shareAxisIconPaths.diplomacia
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
    left: shareAxisIconPaths.controle,
    right: ['M12 3v18', 'M17 7.5C16 5.8 14.3 5 12 5 9.2 5 7.5 6.3 7.5 8.5S9 12 12 12s4.5 1.2 4.5 3.5S14.8 19 12 19c-2.3 0-4-.8-5-2.5']
  },
  comercio: {
    left: shareAxisIconPaths.poder,
    right: shareAxisIconPaths.comercio
  },
  religiao: {
    left: ['M12 4v16', 'M4 12h16', 'M6 18 18 6'],
    right: shareAxisIconPaths.religiao
  },
  moral: {
    left: shareAxisIconPaths.moral,
    right: ['M7 4h10', 'M8 20h8', 'M9 4c0 5 6 5 6 10 0 2-1.3 4-3 6-1.7-2-3-4-3-6 0-5 6-5 6-10']
  },
  tecnologia: {
    left: shareAxisIconPaths.tecnologia,
    right: ['M5 19c8 0 13-5 14-14-7 1-13 5-14 14Z', 'M5 19c4-5 8-8 14-14']
  }
};

export function buildShareCard(
  result: QuizResult,
  quiz: QuizPayload
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const C = SHARE_COLORS;
  const stage = el('div', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '0',
    height: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '-1'
  }) as HTMLDivElement;

  const target = el('div', {
    width: `${SHARE_WIDTH}px`,
    height: `${SHARE_HEIGHT}px`,
    padding: '44px',
    boxSizing: 'border-box',
    background: C.soft,
    fontFamily: SHARE_FONT_BODY,
    color: C.ink900,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  }) as HTMLDivElement;

  target.append(
    buildShareTitle(),
    buildShareIdeologyHeader(result),
    buildShareBody(result, quiz)
  );
  stage.append(target);
  return { stage, target };
}

function buildShareTitle(): HTMLElement {
  return el(
    'div',
    {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '34px',
      letterSpacing: '-0.03em',
      color: SHARE_COLORS.green700,
      textAlign: 'center'
    },
    'Seu perfil ideológico'
  );
}

function buildMatchRing(pct: number): HTMLElement {
  const C = SHARE_COLORS;
  const size = 104;
  const safePct = clamp(pct);

  const wrap = el('div', {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    width: `${size}px`,
    height: `${size}px`,
    flex: '0 0 auto',
    borderRadius: '50%',
    background: `conic-gradient(from -90deg, ${C.green700} 0%, ${C.green500} ${safePct}%, ${SHARE_MATCH_RING_BG} 0%)`,
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '800',
    color: C.green700,
    fontVariantNumeric: 'tabular-nums'
  });
  wrap.append(el('div', {
    position: 'absolute',
    inset: '6px',
    borderRadius: '50%',
    background: C.paper,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -2px 6px rgba(0, 0, 0, 0.04)'
  }));

  const text = el('div', {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  });
  text.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '28px',
      lineHeight: '1',
      letterSpacing: '-0.02em',
      color: C.green700
    }, `${Math.round(safePct)}%`),
    el('div', {
      fontSize: '8.5px',
      fontWeight: '800',
      letterSpacing: '0.14em',
      color: C.ink500,
      marginTop: '2px'
    }, 'MATCH')
  );

  wrap.append(text);
  return wrap;
}

function buildShareIdeologyHeader(result: QuizResult): HTMLElement {
  const C = SHARE_COLORS;
  const pct = clamp(result.topMatch.compatibility);
  const description = result.topMatch.longDescription || result.topMatch.description;
  const descriptionFontSize = description.length > 270 ? '14px' : '14.6px';

  const card = el('div', {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '28px',
    padding: '26px 28px 25px',
    background: `linear-gradient(180deg, ${C.paper} 0%, ${C.green50} 132%)`,
    border: '1px solid rgba(34, 197, 94, 0.25)',
    borderRadius: '18px',
    boxShadow: '0 14px 30px -18px rgba(11, 16, 32, 0.24)',
    overflow: 'hidden'
  });
  card.append(el('div', {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '4px',
    background: SHARE_ACCENT_GRAD
  }));

  const left = el('div', { flex: '1 1 auto', minWidth: '0' });
  left.append(
    el('span', {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '26px',
      fontSize: '12px',
      fontWeight: '800',
      letterSpacing: '0.09em',
      textTransform: 'uppercase',
      color: C.green700,
      background: C.green50,
      border: '1px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '999px',
      padding: '4px 11px'
    }, result.topMatch.category),
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '42px',
      lineHeight: '1',
      letterSpacing: '-0.035em',
      color: C.ink950,
      margin: '10px 0 8px'
    }, result.topMatch.name),
    el('div', {
      fontSize: descriptionFontSize,
      lineHeight: '1.48',
      color: C.ink500
    }, description)
  );

  const badge = el('div', {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '9px'
  });
  badge.append(
    el('span', {
      fontSize: '11px',
      fontWeight: '800',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: C.green700,
      background: C.green50,
      border: '1px solid rgba(34, 197, 94, 0.2)',
      borderRadius: '999px',
      padding: '4px 10px',
      whiteSpace: 'nowrap'
    }, 'Top match'),
    buildMatchRing(pct)
  );

  card.append(left, badge);
  return card;
}

function buildShareBody(result: QuizResult, quiz: QuizPayload): HTMLElement {
  const body = el('div', {
    display: 'flex',
    gap: '20px',
    flex: '1 1 auto',
    minHeight: '0'
  });

  const axisColors = new Map(quiz.axes.map((axis) => [axis.id, axis] as const));
  const leftCol = el('div', {
    flex: '1 1 0',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
  });
  result.axes.forEach((axis) => leftCol.append(buildShareAxisRow(axis, axisColors.get(axis.axisId))));

  const rightCol = el('div', {
    flex: '0 0 362px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    minHeight: '0'
  });
  rightCol.append(
    buildShareCountry(result.topCountryMatch),
    buildSharePersonality(result.topPersonalityMatch)
  );

  body.append(leftCol, rightCol);
  return body;
}

function buildShareAxisRow(
  axis: QuizResult['axes'][number],
  meta?: { leftColor: string; rightColor: string }
): HTMLElement {
  const C = SHARE_COLORS;
  const leftColor = meta?.leftColor ?? C.balanced;
  const rightColor = meta?.rightColor ?? C.balanced;
  const isBalanced = axis.intensity === 'Equilibrado';
  const leaningRight = axis.dominantPole === axis.rightPole;
  const dom = isBalanced ? C.balanced : leaningRight ? rightColor : leftColor;
  const leftActive = !isBalanced && !leaningRight;
  const rightActive = !isBalanced && leaningRight;

  const position = clamp(axis.rightPercent);
  const fillLeft = Math.min(position, 50);
  const fillWidth = isBalanced ? 0 : Math.abs(position - 50);

  const row = el('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '7px 10px',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.86))',
    border: `1px solid ${rgba(dom, isBalanced ? 0.12 : 0.2)}`,
    boxShadow: '0 10px 22px -20px rgba(11, 16, 32, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
  });

  const head = el('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    minHeight: '20px'
  });
  head.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '14px',
      lineHeight: '1.05',
      letterSpacing: '0',
      color: C.ink950
    }, axis.label),
    buildLeanPill(axis, isBalanced, dom)
  );

  const meter = el('div', {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 0.92fr) minmax(142px, 1.16fr) minmax(0, 0.92fr)',
    alignItems: 'center',
    gap: '9px'
  });
  meter.append(
    buildSharePole(axis.axisId, axis.leftPole, axis.leftPercent, leftActive, leftColor, 'left'),
    buildShareTrack(position, fillLeft, fillWidth, isBalanced, dom),
    buildSharePole(axis.axisId, axis.rightPole, axis.rightPercent, rightActive, rightColor, 'right')
  );

  row.append(head, meter);
  return row;
}

function buildLeanPill(
  axis: QuizResult['axes'][number],
  isBalanced: boolean,
  dom: string
): HTMLElement {
  const C = SHARE_COLORS;
  const pill = el('div', {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    minHeight: '20px',
    padding: '0 8px',
    borderRadius: '999px',
    fontSize: '9.4px',
    lineHeight: '1',
    fontWeight: '800',
    whiteSpace: 'nowrap',
    flex: '0 0 auto',
    background: isBalanced ? C.ink50 : mixHex(dom, '#FFFFFF', 0.14),
    color: isBalanced ? C.ink500 : mixHex(dom, '#0B1020', 0.68),
    border: `1px solid ${isBalanced ? C.line : rgba(dom, 0.26)}`
  });
  pill.append(el('span', {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    flex: '0 0 auto',
    background: isBalanced ? C.ink400 : dom
  }));
  pill.append(el('span', {}, isBalanced ? 'Equilibrado' : `${axis.intensity} - ${axis.dominantPole}`));
  return pill;
}

function buildSharePole(
  axisId: string,
  name: string,
  value: number,
  active: boolean,
  color: string,
  side: PoleSide
): HTMLElement {
  const C = SHARE_COLORS;
  const ink = active ? mixHex(color, C.ink950, 0.78) : C.ink500;
  const wrap = el('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: side === 'right' ? 'flex-end' : 'flex-start',
    flexDirection: 'row',
    gap: '6px',
    minWidth: '0',
    minHeight: '36px',
    padding: '6px 8px',
    borderRadius: '10px',
    border: `1px solid ${active ? rgba(color, 0.44) : C.line}`,
    background: active
      ? `linear-gradient(180deg, ${mixHex(color, '#FFFFFF', 0.11)}, ${mixHex(color, '#FFFFFF', 0.05)})`
      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.62))',
    boxShadow: active
      ? `0 9px 18px -17px ${rgba(color, 0.64)}, inset 0 1px 0 rgba(255, 255, 255, 0.82)`
      : 'inset 0 1px 0 rgba(255, 255, 255, 0.72)'
  });

  const icon = el('span', {
    flex: '0 0 auto',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
    color: ink,
    background: active ? mixHex(color, '#FFFFFF', 0.13) : mixHex(C.ink100, '#FFFFFF', 0.76),
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72)'
  });
  icon.append(buildPoleGlyph(axisId, side));

  const text = el('span', {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '0',
    alignItems: side === 'right' ? 'flex-end' : 'flex-start',
    textAlign: side === 'right' ? 'right' : 'left',
    lineHeight: '1.06'
  });
  text.append(
    el('span', {
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: '9.6px',
      fontWeight: '800',
      color: active ? C.ink950 : C.ink700
    }, name),
    el('span', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontSize: '10.4px',
      fontWeight: '800',
      color: active ? ink : C.ink400
    }, `${Math.round(value)}%`)
  );

  if (side === 'right') {
    wrap.append(text, icon);
  } else {
    wrap.append(icon, text);
  }
  return wrap;
}

function buildPoleGlyph(axisId: string, side: PoleSide): SVGElement {
  const svg = svgEl('svg', {
    viewBox: '0 0 24 24',
    width: 16,
    height: 16,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 1.9,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  });
  const paths = sharePoleIconPaths[axisId]?.[side] ?? sharePoleIconPaths.estrutura[side];
  paths.forEach((path) => svg.append(svgEl('path', { d: path })));
  return svg;
}

function buildShareTrack(
  position: number,
  fillLeft: number,
  fillWidth: number,
  isBalanced: boolean,
  dom: string
): HTMLElement {
  const C = SHARE_COLORS;
  const track = el('div', {
    position: 'relative',
    height: '9px',
    borderRadius: '999px',
    background: `linear-gradient(90deg, ${C.ink100}, ${C.ink50} 50%, ${C.ink100})`,
    boxShadow: 'inset 0 1px 2px rgba(11, 16, 32, 0.1), 0 8px 18px -16px rgba(11, 16, 32, 0.35)',
    isolation: 'isolate'
  });
  track.append(el('div', {
    position: 'absolute',
    top: '-4px',
    bottom: '-4px',
    left: '50%',
    width: '2px',
    marginLeft: '-1px',
    zIndex: '2',
    background: mixHex(C.ink500, '#FFFFFF', 0.35),
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.82)',
    borderRadius: '2px',
    pointerEvents: 'none'
  }));
  if (!isBalanced) {
    track.append(el('div', {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: `${fillLeft}%`,
      width: `${fillWidth}%`,
      zIndex: '1',
      borderRadius: '999px',
      background: dom,
      boxShadow: `0 8px 18px -14px ${rgba(dom, 0.74)}`,
      pointerEvents: 'none'
    }));
  }
  const thumb = el('div', {
    position: 'absolute',
    top: '50%',
    left: `${position}%`,
    width: '22px',
    height: '22px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    zIndex: '3',
    background: isBalanced ? C.ink400 : dom,
    border: '3px solid #ffffff',
    boxShadow: `0 0 0 2px ${isBalanced ? 'rgba(148, 163, 184, 0.24)' : rgba(dom, 0.28)}, 0 8px 18px -12px rgba(11, 16, 32, 0.3)`
  });
  thumb.append(el('span', {
    position: 'absolute',
    inset: '4px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.26)',
    pointerEvents: 'none'
  }));
  track.append(thumb);
  return track;
}

function buildShareCountry(country: QuizResult['topCountryMatch']): HTMLElement {
  const C = SHARE_COLORS;
  const nameSize = country.name.length > 27 ? '18px' : country.name.length > 18 ? '20px' : '23px';
  const card = el('div', {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '13px',
    flex: '1 1 0',
    minHeight: '0',
    padding: '19px',
    background: `linear-gradient(180deg, ${C.paper} 0%, ${C.soft} 100%)`,
    border: `1px solid ${C.line}`,
    borderRadius: '14px',
    boxShadow: '0 3px 10px rgba(11, 16, 32, 0.06)',
    overflow: 'hidden'
  });
  card.append(el('div', {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '4px',
    background: SHARE_ACCENT_GRAD
  }));

  const frame = el('div', {
    width: '100%',
    height: '188px',
    borderRadius: '12px',
    background: '#f8fafc',
    border: `1px solid ${C.lineStrong}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 3px 10px rgba(11, 16, 32, 0.06)'
  });
  const flag = el('img', {
    width: 'auto',
    height: 'auto',
    maxWidth: '86%',
    maxHeight: '154px',
    objectFit: 'contain'
  }) as HTMLImageElement;
  flag.src = resolveCountryFlagSrc(country.flagPath);
  flag.alt = `Bandeira de ${country.name}`;
  flag.dataset.kind = 'flag';
  frame.append(flag);

  const head = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '9px',
    minWidth: '0'
  });
  head.append(
    (() => {
      const title = el('div', { minWidth: '0' });
      title.append(
        el('div', {
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '25px',
          padding: '0 8px',
          borderRadius: '8px',
          background: C.green50,
          border: '1px solid rgba(34, 197, 94, 0.18)',
          color: C.green700,
          fontSize: '9.6px',
          fontWeight: '800',
          letterSpacing: '0.09em',
          textTransform: 'uppercase'
        }, 'País mais compatível'),
        el('div', {
          fontFamily: SHARE_FONT_DISPLAY,
          fontWeight: '800',
          fontSize: nameSize,
          lineHeight: '1.02',
          letterSpacing: '0',
          color: C.ink950,
          marginTop: '8px',
          overflowWrap: 'anywhere'
        }, country.name)
      );
      return title;
    })(),
    el('div', {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '30px',
      padding: '6px 10px',
      borderRadius: '999px',
      background: C.green50,
      border: '1px solid rgba(34, 197, 94, 0.18)',
      fontWeight: '800',
      fontSize: '10.6px',
      color: C.green700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    }, `${Math.round(country.compatibility)}% match`)
  );

  const meta = el('div', { display: 'flex', flexWrap: 'wrap', gap: '6px' });
  [country.category, country.historical && country.period ? country.period : ''].filter(Boolean).forEach((item) => {
    meta.append(el('span', {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '24px',
      maxWidth: '100%',
      padding: '4px 8px',
      borderRadius: '999px',
      background: C.ink50,
      border: `1px solid ${C.line}`,
      color: C.ink500,
      fontSize: '9.4px',
      fontWeight: '800',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, String(item)));
  });

  card.append(frame, head, meta, el('div', {
    fontSize: '12.3px',
    lineHeight: '1.48',
    color: C.ink500
  }, country.description));
  return card;
}

function buildSharePersonality(person: QuizResult['topPersonalityMatch']): HTMLElement {
  const C = SHARE_COLORS;
  const nameSize = person.name.length > 24 ? '18px' : person.name.length > 16 ? '20px' : '23px';
  const card = el('div', {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '13px',
    flex: '1 1 0',
    minHeight: '0',
    padding: '19px',
    background: `linear-gradient(180deg, ${C.paper} 0%, ${C.soft} 100%)`,
    border: `1px solid ${C.line}`,
    borderRadius: '14px',
    boxShadow: '0 3px 10px rgba(11, 16, 32, 0.06)',
    overflow: 'hidden'
  });
  card.append(el('div', {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '4px',
    background: SHARE_ACCENT_GRAD
  }));

  const top = el('div', { display: 'flex', alignItems: 'center', gap: '15px', minWidth: '0' });
  const frame = el('div', {
    flex: '0 0 auto',
    width: '110px',
    height: '132px',
    borderRadius: '12px',
    background: '#f8fafc',
    border: `1px solid ${C.lineStrong}`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });
  const portrait = el('img', {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top'
  }) as HTMLImageElement;
  portrait.src = resolvePersonalityImageSrc(person.imagePath);
  portrait.alt = `Retrato de ${person.name}`;
  portrait.dataset.kind = 'portrait';
  portrait.dataset.initials = personalityInitials(person.name);
  frame.append(portrait);

  const text = el('div', { minWidth: '0', display: 'flex', flexDirection: 'column', gap: '5px' });
  text.append(
    el('div', {
      display: 'inline-flex',
      width: 'fit-content',
      alignItems: 'center',
      minHeight: '25px',
      padding: '0 8px',
      borderRadius: '8px',
      background: C.green50,
      border: '1px solid rgba(34, 197, 94, 0.18)',
      color: C.green700,
      fontSize: '9.3px',
      fontWeight: '800',
      letterSpacing: '0.09em',
      textTransform: 'uppercase'
    }, 'Personalidade'),
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: nameSize,
      lineHeight: '1.02',
      letterSpacing: '0',
      color: C.ink950
    }, person.name),
    el('div', {
      display: 'inline-flex',
      width: 'fit-content',
      alignItems: 'center',
      minHeight: '30px',
      padding: '6px 10px',
      borderRadius: '999px',
      background: C.green50,
      border: '1px solid rgba(34, 197, 94, 0.18)',
      fontWeight: '800',
      fontSize: '10.6px',
      color: C.green700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }, `${Math.round(person.compatibility)}% match`)
  );
  top.append(frame, text);

  const meta = el('div', { display: 'flex', flexWrap: 'wrap', gap: '6px' });
  [person.role, person.lifespan].filter(Boolean).forEach((item) => {
    meta.append(el('span', {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '24px',
      maxWidth: '100%',
      padding: '4px 8px',
      borderRadius: '999px',
      background: C.ink50,
      border: `1px solid ${C.line}`,
      color: C.ink500,
      fontSize: '9.4px',
      fontWeight: '800',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, String(item)));
  });

  card.append(top, meta, el('div', {
    fontSize: '12.3px',
    lineHeight: '1.5',
    color: C.ink500
  }, person.description));
  return card;
}

export async function prepareImagesForExport(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map(inlineImageForExport));
}

/**
 * Converte cada imagem para um data: URI ANTES da rasterização, para que o
 * html-to-image não precise refazer nenhum fetch de rede durante o export.
 *
 * O fetch interno do html-to-image (com cacheBust) pode falhar em produção
 * por cache/CORS/quirks de navegador e, quando falha, ele deixa a moldura
 * totalmente em branco — sem nem cair no fallback. Aqui usamos a imagem que
 * já foi carregada na tela (via canvas, sem rede) para gerar o data: URI;
 * se isso não for possível, tentamos um fetch e, em último caso, mostramos o
 * fallback (bandeira indisponível / iniciais).
 */
async function inlineImageForExport(image: HTMLImageElement): Promise<void> {
  const src = image.getAttribute('src') ?? '';
  if (!src) {
    replaceBrokenExportImage(image);
    return;
  }
  if (src.startsWith('data:')) {
    return;
  }

  await waitForImage(image);

  if (image.complete && image.naturalWidth > 0) {
    const dataUrl = canvasDataUrl(image);
    if (dataUrl) {
      await applyImageSrc(image, dataUrl);
      return;
    }
  }

  try {
    const dataUrl = await fetchAsDataUrl(src);
    await applyImageSrc(image, dataUrl);
  } catch {
    replaceBrokenExportImage(image);
  }
}

/** Desenha a imagem já carregada num canvas e retorna o data: URI (sem rede). */
function canvasDataUrl(image: HTMLImageElement): string | null {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL('image/png');
  } catch {
    // canvas "tainted" (imagem cross-origin sem CORS) — deixa o fetch tentar.
    return null;
  }
}

function fetchAsDataUrl(url: string): Promise<string> {
  return fetch(url, { cache: 'force-cache' })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.blob();
    })
    .then(
      (blob) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(reader.error);
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        })
    );
}

function applyImageSrc(image: HTMLImageElement, dataUrl: string): Promise<void> {
  return new Promise((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener(
      'error',
      () => {
        replaceBrokenExportImage(image);
        resolve();
      },
      { once: true }
    );
    image.src = dataUrl;
  });
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const timeout = window.setTimeout(resolve, 2500);
    const finish = () => {
      window.clearTimeout(timeout);
      resolve();
    };

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', finish, { once: true });
  });
}

function replaceBrokenExportImage(image: HTMLImageElement) {
  const C = SHARE_COLORS;
  const isPortrait = image.dataset.kind === 'portrait';
  const fallback = el('div', {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });
  fallback.setAttribute('role', 'img');
  fallback.setAttribute('aria-label', image.alt || '');

  if (isPortrait) {
    fallback.style.background = SHARE_ACCENT_GRAD;
    fallback.append(el('span', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '36px',
      color: '#ffffff'
    }, image.dataset.initials || '?'));
  } else {
    fallback.style.background = C.ink100;
    fallback.append(el('span', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '700',
      fontSize: '12px',
      color: C.ink500
    }, 'Bandeira indisponível'));
  }

  image.replaceWith(fallback);
}
