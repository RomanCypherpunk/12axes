import type { QuizPayload, QuizResult } from '../types/quiz';
import { resolveCountryFlagSrc } from './countryFlags';
import { personalityInitials, resolvePersonalityImageSrc } from './personalityImage';

/**
 * Cartão de compartilhamento social 1080x1080.
 *
 * Montado a partir do resultado (não clona a página), no formato 1:1 com a
 * identidade visual do 12 Axes: cabeçalho da ideologia (com anel de match
 * preenchido pela porcentagem) + 12 eixos fiéis à página de resultados à
 * esquerda, e país e personalidade compatíveis à direita.
 */
export const SHARE_SIZE = 1080;

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

type Style = Partial<CSSStyleDeclaration>;

function el(tag: string, style: Style, text?: string): HTMLElement {
  const node = document.createElement(tag);
  Object.assign(node.style, style);
  if (text != null) {
    node.textContent = text;
  }
  return node;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function truncateText(value: string | undefined, max: number): string {
  if (!value) {
    return '';
  }
  if (value.length <= max) {
    return value;
  }
  const cut = value.lastIndexOf(' ', max - 1);
  return `${value.slice(0, cut > max / 2 ? cut : max - 1).trimEnd()}…`;
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
    width: `${SHARE_SIZE}px`,
    height: `${SHARE_SIZE}px`,
    padding: '40px',
    boxSizing: 'border-box',
    background: C.soft,
    fontFamily: SHARE_FONT_BODY,
    color: C.ink900,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
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
      fontSize: '32px',
      letterSpacing: '-0.03em',
      color: SHARE_COLORS.green700,
      textAlign: 'center'
    },
    'Seu perfil ideológico'
  );
}

function buildMatchRing(pct: number): HTMLElement {
  const C = SHARE_COLORS;
  const size = 112;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;

  const wrap = el('div', { position: 'relative', width: `${size}px`, height: `${size}px`, flex: '0 0 auto' });
  const svg = svgEl('svg', { width: size, height: size, viewBox: `0 0 ${size} ${size}` });
  svg.append(
    svgEl('circle', { cx: c, cy: c, r, fill: C.paper, stroke: C.ink100, 'stroke-width': stroke }),
    svgEl('circle', {
      cx: c, cy: c, r,
      fill: 'none',
      stroke: C.green500,
      'stroke-width': stroke,
      'stroke-linecap': 'round',
      'stroke-dasharray': circ.toFixed(2),
      'stroke-dashoffset': (circ * (1 - clamp(pct) / 100)).toFixed(2),
      transform: `rotate(-90 ${c} ${c})`
    })
  );
  Object.assign((svg as unknown as HTMLElement).style, { position: 'absolute', top: '0', left: '0' } as Style);

  const text = el('div', {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
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
      color: C.ink950
    }, `${Math.round(clamp(pct))}%`),
    el('div', {
      fontSize: '8.5px',
      fontWeight: '800',
      letterSpacing: '0.14em',
      color: C.green700,
      marginTop: '2px'
    }, 'MATCH')
  );

  wrap.append(svg as unknown as Node, text);
  return wrap;
}

function buildShareIdeologyHeader(result: QuizResult): HTMLElement {
  const C = SHARE_COLORS;
  const pct = clamp(result.topMatch.compatibility);

  const card = el('div', {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
    padding: '22px 26px',
    background: C.paper,
    border: `1px solid ${C.line}`,
    borderRadius: '18px',
    boxShadow: '0 1px 2px rgba(11, 16, 32, 0.05)',
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
      display: 'inline-block',
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
      fontSize: '40px',
      lineHeight: '1',
      letterSpacing: '-0.035em',
      color: C.ink950,
      margin: '11px 0 9px'
    }, result.topMatch.name),
    el('div', {
      fontSize: '13.5px',
      lineHeight: '1.45',
      color: C.ink500
    }, result.topMatch.longDescription || result.topMatch.description)
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
      padding: '4px 10px'
    }, 'Top match'),
    buildMatchRing(pct)
  );

  card.append(left, badge);
  return card;
}

function buildShareBody(result: QuizResult, quiz: QuizPayload): HTMLElement {
  const body = el('div', {
    display: 'flex',
    gap: '22px',
    flex: '1 1 auto',
    minHeight: '0'
  });

  const axisColors = new Map(quiz.axes.map((axis) => [axis.id, axis] as const));
  const leftCol = el('div', {
    flex: '1 1 0',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  });
  result.axes.forEach((axis) => leftCol.append(buildShareAxisRow(axis, axisColors.get(axis.axisId))));

  const rightCol = el('div', {
    flex: '0 0 352px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  });
  rightCol.append(
    buildShareSideGroup('País compatível', buildShareCountry(result.topCountryMatch)),
    buildShareSideGroup('Personalidade compatível', buildSharePersonality(result.topPersonalityMatch))
  );

  body.append(leftCol, rightCol);
  return body;
}

function buildShareSideGroup(label: string, card: HTMLElement): HTMLElement {
  const group = el('div', { display: 'flex', flexDirection: 'column', gap: '11px' });
  group.append(buildShareSideLabel(label), card);
  return group;
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

  const row = el('div', { display: 'flex', flexDirection: 'column', gap: '6px' });

  const head = el('div', {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px'
  });
  head.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '14px',
      letterSpacing: '-0.015em',
      color: C.ink950
    }, axis.label),
    buildLeanPill(axis, isBalanced, dom)
  );

  const meter = el('div', {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2.1fr) minmax(0, 1fr)',
    alignItems: 'center',
    gap: '12px'
  });
  meter.append(
    buildSharePole(axis.leftPole, axis.leftPercent, leftActive, leftColor, 'left'),
    buildShareTrack(position, fillLeft, fillWidth, isBalanced, dom),
    buildSharePole(axis.rightPole, axis.rightPercent, rightActive, rightColor, 'right')
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
    gap: '6px',
    padding: '4px 11px',
    borderRadius: '999px',
    fontSize: '10.5px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    flex: '0 0 auto',
    background: isBalanced ? C.ink50 : mixHex(dom, '#FFFFFF', 0.14),
    color: isBalanced ? C.ink500 : mixHex(dom, '#0B1020', 0.68),
    border: `1px solid ${isBalanced ? C.line : rgba(dom, 0.26)}`
  });
  pill.append(el('span', {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flex: '0 0 auto',
    background: isBalanced ? C.ink400 : dom
  }));
  pill.append(el('span', {}, isBalanced ? 'Equilibrado' : `${axis.intensity} · ${axis.dominantPole}`));
  return pill;
}

function buildSharePole(
  name: string,
  value: number,
  active: boolean,
  color: string,
  align: 'left' | 'right'
): HTMLElement {
  const C = SHARE_COLORS;
  const wrap = el('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    minWidth: '0',
    alignItems: align === 'right' ? 'flex-end' : 'flex-start'
  });
  wrap.append(
    el('div', {
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '1.2',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      color: active ? C.ink950 : C.ink500
    }, name),
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '-0.01em',
      color: active ? mixHex(color, '#0B1020', 0.7) : C.ink400
    }, `${Math.round(value)}%`)
  );
  return wrap;
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
    height: '10px',
    borderRadius: '999px',
    background: C.ink100,
    boxShadow: 'inset 0 1px 2px rgba(11, 16, 32, 0.07)'
  });
  track.append(el('div', {
    position: 'absolute',
    top: '-4px',
    bottom: '-4px',
    left: '50%',
    width: '2px',
    marginLeft: '-1px',
    background: 'repeating-linear-gradient(#CBD5E1 0 3px, transparent 3px 6px)',
    borderRadius: '2px'
  }));
  if (!isBalanced) {
    track.append(el('div', {
      position: 'absolute',
      top: '0',
      bottom: '0',
      left: `${fillLeft}%`,
      width: `${fillWidth}%`,
      borderRadius: '999px',
      background: `linear-gradient(135deg, ${mixHex(dom, '#FFFFFF', 0.82)} 0%, ${dom} 100%)`,
      boxShadow: `0 0 12px -2px ${rgba(dom, 0.55)}`
    }));
  }
  track.append(el('div', {
    position: 'absolute',
    top: '50%',
    left: `${position}%`,
    width: '16px',
    height: '16px',
    marginLeft: '-8px',
    marginTop: '-8px',
    borderRadius: '50%',
    background: C.paper,
    border: `3px solid ${isBalanced ? C.ink400 : dom}`,
    boxShadow: '0 2px 7px rgba(11, 16, 32, 0.22)'
  }));
  return track;
}

function buildShareSideLabel(text: string): HTMLElement {
  return el('div', {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: SHARE_COLORS.green700
  }, text);
}

function buildShareCountry(country: QuizResult['topCountryMatch']): HTMLElement {
  const C = SHARE_COLORS;
  const card = el('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '14px',
    background: C.paper,
    border: `1px solid ${C.line}`,
    borderRadius: '14px',
    boxShadow: '0 1px 2px rgba(11, 16, 32, 0.05)'
  });

  const frame = el('div', {
    width: '100%',
    height: '128px',
    borderRadius: '10px',
    background: '#f8fafc',
    border: `1px solid ${C.lineStrong}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  });
  const flag = el('img', {
    width: 'auto',
    height: 'auto',
    maxWidth: '86%',
    maxHeight: '102px',
    objectFit: 'contain'
  }) as HTMLImageElement;
  flag.src = resolveCountryFlagSrc(country.flagPath);
  flag.alt = `Bandeira de ${country.name}`;
  flag.dataset.kind = 'flag';
  frame.append(flag);

  const head = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '10px'
  });
  head.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '21px',
      letterSpacing: '-0.02em',
      color: C.ink950
    }, country.name),
    el('div', {
      fontWeight: '800',
      fontSize: '13px',
      color: C.green700,
      whiteSpace: 'nowrap'
    }, `${Math.round(country.compatibility)}% match`)
  );

  card.append(
    frame,
    head,
    el('div', { fontSize: '12px', lineHeight: '1.45', color: C.ink500 }, truncateText(country.description, 188))
  );
  return card;
}

function buildSharePersonality(person: QuizResult['topPersonalityMatch']): HTMLElement {
  const C = SHARE_COLORS;
  const card = el('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '11px',
    padding: '14px',
    background: C.paper,
    border: `1px solid ${C.line}`,
    borderRadius: '14px',
    boxShadow: '0 1px 2px rgba(11, 16, 32, 0.05)'
  });

  const top = el('div', { display: 'flex', alignItems: 'center', gap: '14px' });
  const frame = el('div', {
    flex: '0 0 auto',
    width: '84px',
    height: '100px',
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
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '21px',
      lineHeight: '1.05',
      letterSpacing: '-0.02em',
      color: C.ink950
    }, person.name),
    el('div', { fontSize: '12px', fontWeight: '700', color: C.ink500 },
      [person.role, person.lifespan].filter(Boolean).join(' · ')),
    el('div', { fontWeight: '800', fontSize: '13px', color: C.green700 },
      `${Math.round(person.compatibility)}% match`)
  );
  top.append(frame, text);

  card.append(
    top,
    el('div', { fontSize: '12px', lineHeight: '1.45', color: C.ink500 }, truncateText(person.description, 168))
  );
  return card;
}

export function prepareImagesForExport(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  return Promise.all(images.map(waitForImage)).then(() => {
    images.forEach((image) => {
      if (!image.complete || image.naturalWidth === 0) {
        replaceBrokenExportImage(image);
      }
    });
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
