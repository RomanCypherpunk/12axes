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

const SHARE_FONT_DISPLAY = '"Sora", ui-sans-serif, system-ui, -apple-system, sans-serif';
const SHARE_FONT_BODY = '"Poppins", ui-sans-serif, system-ui, -apple-system, sans-serif';
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
  _quiz: QuizPayload
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
    background: color.base,
    fontFamily: SHARE_FONT_BODY,
    color: SHARE_COLORS.papel,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }) as HTMLDivElement;

  // Círculo decorativo: base misturada com 10% de Papel, canto superior direito.
  target.append(el('div', {
    position: 'absolute',
    top: '-120px',
    right: '-120px',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: mixHex(color.base, SHARE_COLORS.papel, 0.9),
    pointerEvents: 'none'
  }));

  const content = el('div', {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    minHeight: '0',
    gap: '30px'
  });

  content.append(
    buildShareHeader(),
    buildShareIdentity(result, color.bg),
    buildShareTwoColumns(result, color),
    buildShareLists(result, color),
    buildShareFooter()
  );

  target.append(content);
  stage.append(target);
  return { stage, target, backgroundColor: color.base };
}

function buildShareHeader(): HTMLElement {
  const P = SHARE_COLORS.papel;
  const header = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '18px'
  });
  header.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '800',
      fontSize: '30px',
      letterSpacing: '-0.03em',
      color: P,
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '4px'
    }),
    el('div', { flex: '1 1 auto', height: '1px', background: rgba(P, 0.35) }),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '14px',
      letterSpacing: '0.16em',
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
  const wrap = el('div', { display: 'flex', flexDirection: 'column', gap: '6px' });
  wrap.append(
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '20px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: bgColor
    }, result.topMatch.category),
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: '52px',
      lineHeight: '1.05',
      letterSpacing: '-0.02em',
      color: P
    }, result.topMatch.name)
  );
  return wrap;
}

function buildShareTwoColumns(
  result: QuizResult,
  color: { base: string; bg: string }
): HTMLElement {
  const row = el('div', {
    display: 'flex',
    gap: '24px',
    flex: '1 1 auto',
    minHeight: '0'
  });
  row.append(
    buildSharePersonalityPortrait(result.topPersonalityMatch, color),
    buildShareAxesColumn(result, color)
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
    flex: '0 0 370px',
    height: '746px',
    borderRadius: '36px',
    overflow: 'hidden',
    background: mixHex(color.base, '#000000', 0.7)
  });

  const portraitSrc = resolvePersonalityImageSrc(person.imagePath);
  frame.dataset.exportImageKind = 'portrait';
  frame.dataset.exportImageSrc = portraitSrc;
  const img = el('img', {
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    filter: 'grayscale(1)'
  }) as HTMLImageElement;
  img.src = portraitSrc;
  img.alt = person.name;
  img.dataset.kind = 'portrait';
  img.dataset.initials = personalityInitials(person.name);
  frame.append(img);

  // Véu da cor da categoria (multiply) + degradê até a base na parte de baixo.
  const veil = el('div', {
    position: 'absolute',
    inset: '0',
    background: color.base,
    opacity: '0.55'
  });
  veil.style.mixBlendMode = 'multiply';
  frame.append(veil);
  frame.append(el('div', {
    position: 'absolute',
    inset: '0',
    background: `linear-gradient(180deg, transparent 38%, ${color.base} 96%)`
  }));

  const text = el('div', {
    position: 'absolute',
    left: '28px',
    right: '28px',
    bottom: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  });
  const pct = clamp(person.compatibility);
  text.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '46px',
      lineHeight: '1',
      color: color.bg
    }, `${Math.round(pct)}%`),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '13px',
      letterSpacing: '0.1em',
      color: rgba(P, 0.88)
    }, t.shareMostCompatible),
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: '25px',
      lineHeight: '1.15',
      color: P,
      marginTop: '6px'
    }, person.name),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontSize: '14px',
      color: rgba(P, 0.82)
    }, person.role)
  );
  frame.append(text);

  return frame;
}

function buildShareAxesColumn(
  result: QuizResult,
  color: { base: string; bg: string }
): HTMLElement {
  const P = SHARE_COLORS.papel;
  const col = el('div', {
    flex: '1 1 auto',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  });
  col.append(el('div', {
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: '14px',
    letterSpacing: '0.1em',
    color: rgba(P, 0.72)
  }, t.shareYourAxes));

  const list = el('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: '1 1 auto',
    justifyContent: 'space-between'
  });
  result.axes.forEach((axis) => list.append(buildShareAxisLine(axis, color)));
  col.append(list);
  return col;
}

function buildShareAxisLine(
  axis: QuizResult['axes'][number],
  color: { base: string; bg: string }
): HTMLElement {
  const P = SHARE_COLORS.papel;
  const isBalanced = axis.intensity === 'Equilibrado';
  const leaningRight = axis.dominantPole === axis.rightPole;
  const winningPole = isBalanced ? axis.rightPole : leaningRight ? axis.rightPole : axis.leftPole;
  const winningPct = isBalanced ? 50 : leaningRight ? axis.rightPercent : axis.leftPercent;
  const side: PoleSide = leaningRight ? 'right' : 'left';

  const row = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderBottom: `1px solid ${rgba(P, 0.14)}`
  });

  const icon = el('span', {
    flex: '0 0 auto',
    width: '26px',
    height: '26px',
    display: 'grid',
    placeItems: 'center',
    color: color.bg
  });
  icon.append(buildPoleGlyph(axis.axisId, side));

  row.append(
    icon,
    el('span', {
      flex: '1 1 auto',
      minWidth: '0',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '500',
      fontSize: '17px',
      color: rgba(P, 0.92),
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }, `${axis.label} ${winningPole}`),
    el('span', {
      flex: '0 0 auto',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '18px',
      color: color.bg
    }, `${Math.round(winningPct)}%`)
  );

  return row;
}

function buildPoleGlyph(axisId: string, side: PoleSide): SVGElement {
  const svg = svgEl('svg', {
    viewBox: '0 0 24 24',
    width: 18,
    height: 18,
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

function buildShareLists(
  result: QuizResult,
  color: { base: string; bg: string }
): HTMLElement {
  const row = el('div', {
    display: 'flex',
    gap: '20px'
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
      'portrait'
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
  kind: 'portrait' | 'flag'
): HTMLElement {
  const P = SHARE_COLORS.papel;
  const box = el('div', {
    flex: '1 1 0',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    borderRadius: '28px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: `1px solid ${rgba(P, 0.16)}`
  });
  box.append(el('div', {
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: '13px',
    letterSpacing: '0.1em',
    color: rgba(P, 0.72)
  }, title));

  items.forEach((item) => {
    const line = el('div', { display: 'flex', alignItems: 'center', gap: '10px' });
    const avatarFrame = el('div', {
      flex: '0 0 auto',
      width: '34px',
      height: '34px',
      borderRadius: kind === 'portrait' ? '50%' : '6px',
      overflow: 'hidden',
      background: mixHex(color.base, '#000000', 0.6),
      display: 'grid',
      placeItems: 'center'
    });
    avatarFrame.dataset.exportImageKind = kind;
    avatarFrame.dataset.exportImageSrc = item.avatar;
    const avatarImg = el('img', {
      width: '100%',
      height: '100%',
      objectFit: kind === 'portrait' ? 'cover' : 'contain',
      filter: kind === 'portrait' ? 'grayscale(1)' : 'none'
    }) as HTMLImageElement;
    avatarImg.src = item.avatar;
    avatarImg.alt = item.alt;
    avatarImg.dataset.kind = kind;
    avatarImg.dataset.initials = item.initials;
    avatarFrame.append(avatarImg);

    line.append(
      avatarFrame,
      el('span', {
        flex: '1 1 auto',
        minWidth: '0',
        fontFamily: SHARE_FONT_BODY,
        fontWeight: '500',
        fontSize: '15px',
        color: rgba(P, 0.92),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }, item.label),
      el('span', {
        flex: '0 0 auto',
        fontFamily: SHARE_FONT_DISPLAY,
        fontWeight: '700',
        fontSize: '14px',
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
    paddingTop: '22px',
    borderTop: `1px solid ${rgba(P, 0.24)}`
  });
  footer.append(
    el('span', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '14px',
      letterSpacing: '0.08em',
      color: rgba(P, 0.9)
    }, t.shareFooterCta),
    el('span', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '14px',
      letterSpacing: '0.04em',
      color: P
    }, t.shareFooterUrl)
  );
  return footer;
}

export async function prepareImagesForExport(root: HTMLElement): Promise<void> {
  root.querySelectorAll<HTMLImageElement>('img[data-kind]').forEach((image) => {
    image.style.opacity = '0';
  });
  await waitForExportPaint();
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
  const kind = image.dataset.kind;
  const rasterOptions = kind === 'portrait'
    ? { width: 370, height: 746, fit: 'cover-top' as const }
    : undefined;
  if (!src) {
    replaceBrokenExportImage(image);
    return;
  }
  if (src.startsWith('data:')) {
    return;
  }

  try {
    const dataUrl = kind === 'portrait'
      ? await fetchAsPngDataUrl(src, rasterOptions)
      : await fetchAsOriginalDataUrl(src);
    await applyImageDataUrl(image, dataUrl);
    return;
  } catch {
    // Se o fetch direto falhar, ainda podemos aproveitar uma imagem já carregada.
  }

  await waitForImage(image);

  if (image.complete && image.naturalWidth > 0) {
    const dataUrl = canvasDataUrl(image, rasterOptions);
    if (dataUrl) {
      await applyImageDataUrl(image, dataUrl);
      return;
    }
  }

  replaceBrokenExportImage(image);
}

type RasterOptions = {
  width: number;
  height: number;
  fit: 'cover-top';
};

/** Desenha a imagem já carregada num canvas e retorna o data: URI (sem rede). */
function canvasDataUrl(image: HTMLImageElement, options?: RasterOptions): string | null {
  try {
    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;
    if (!sourceWidth || !sourceHeight) {
      return null;
    }
    const width = options?.width ?? sourceWidth;
    const height = options?.height ?? sourceHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (options?.fit === 'cover-top') {
      const scale = Math.max(width / sourceWidth, height / sourceHeight);
      const drawWidth = sourceWidth * scale;
      const drawHeight = sourceHeight * scale;
      ctx.drawImage(image, (width - drawWidth) / 2, 0, drawWidth, drawHeight);
    } else {
      ctx.drawImage(image, 0, 0, width, height);
    }
    return canvas.toDataURL('image/png');
  } catch {
    // canvas "tainted" (imagem cross-origin sem CORS) — deixa o fetch tentar.
    return null;
  }
}

function fetchAsPngDataUrl(url: string, options?: RasterOptions): Promise<string> {
  const href = new URL(url, window.location.href).href;
  return fetch(href, { cache: 'force-cache', credentials: 'same-origin' })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.blob();
    })
    .then((blob) => blobToPngDataUrl(blob, options));
}

function fetchAsOriginalDataUrl(url: string): Promise<string> {
  const href = new URL(url, window.location.href).href;
  return fetch(href, { cache: 'force-cache', credentials: 'same-origin' })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.blob();
    })
    .then(readBlobAsDataUrl);
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function blobToPngDataUrl(blob: Blob, options?: RasterOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const loadedImage = new Image();
    const cleanup = () => URL.revokeObjectURL(objectUrl);

    loadedImage.onload = () => {
      const dataUrl = canvasDataUrl(loadedImage, options);
      cleanup();
      if (dataUrl) {
        resolve(dataUrl);
      } else {
        reject(new Error('Could not convert image to PNG'));
      }
    };
    loadedImage.onerror = () => {
      cleanup();
      reject(new Error('Could not decode image'));
    };
    loadedImage.src = objectUrl;
  });
}

function applyImageDataUrl(image: HTMLImageElement, dataUrl: string): Promise<void> {
  if (image.dataset.kind === 'portrait') {
    replaceImageWithExportBackground(image, dataUrl);
    return Promise.resolve();
  }

  return applyImageElementSrc(image, dataUrl);
}

function applyImageElementSrc(image: HTMLImageElement, dataUrl: string): Promise<void> {
  return new Promise((resolve) => {
    const timeout = window.setTimeout(resolve, 1000);
    const finish = () => {
      window.clearTimeout(timeout);
      resolve();
    };

    image.addEventListener('load', finish, { once: true });
    image.addEventListener(
      'error',
      () => {
        replaceBrokenExportImage(image);
        finish();
      },
      { once: true }
    );
    image.src = dataUrl;
  });
}

function replaceImageWithExportBackground(image: HTMLImageElement, dataUrl: string) {
  const isPortrait = image.dataset.kind === 'portrait';
  const replacement = el('div', {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${dataUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: isPortrait ? 'center top' : 'center',
    backgroundSize: isPortrait ? 'cover' : 'contain',
    filter: image.style.filter || undefined
  });
  replacement.setAttribute('role', 'img');
  replacement.setAttribute('aria-label', image.alt || '');
  image.replaceWith(replacement);
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

function waitForExportPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function replaceBrokenExportImage(image: HTMLImageElement) {
  const isPortrait = image.dataset.kind === 'portrait';
  const fallback = el('div', {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.3)'
  });
  fallback.setAttribute('role', 'img');
  fallback.setAttribute('aria-label', image.alt || '');
  fallback.append(el('span', {
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '800',
    fontSize: isPortrait ? '48px' : '13px',
    color: SHARE_COLORS.papel
  }, image.dataset.initials || '?'));
  image.replaceWith(fallback);
}

export async function drawShareImagesOnPng(dataUrl: string, root: HTMLElement): Promise<string> {
  const overlays = collectCanvasOverlays(root);
  if (overlays.length === 0) {
    return dataUrl;
  }

  const base = await loadCanvasImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = base.naturalWidth || SHARE_WIDTH;
  canvas.height = base.naturalHeight || SHARE_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return dataUrl;
  }

  ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
  const scaleX = canvas.width / SHARE_WIDTH;
  const scaleY = canvas.height / SHARE_HEIGHT;

  for (const overlay of overlays) {
    try {
      const image = await loadCanvasAsset(overlay.src);
      const rect = {
        x: overlay.x * scaleX,
        y: overlay.y * scaleY,
        width: overlay.width * scaleX,
        height: overlay.height * scaleY
      };
      if (overlay.kind === 'portrait') {
        ctx.save();
        ctx.filter = 'grayscale(1)';
        drawCanvasCover(ctx, image, rect);
        ctx.restore();
      } else if (overlay.kind === 'avatar') {
        ctx.save();
        ctx.filter = 'grayscale(1)';
        drawCanvasCoverCircular(ctx, image, rect);
        ctx.restore();
      } else {
        drawCanvasContainRect(ctx, image, rect);
      }
    } catch {
      // Se o navegador nao decodificar o asset, mantemos o fallback gerado pelo DOM.
    }
  }

  return canvas.toDataURL('image/png');
}

type CanvasOverlayKind = 'flag' | 'portrait' | 'avatar';
type CanvasOverlay = {
  kind: CanvasOverlayKind;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
type CanvasRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function collectCanvasOverlays(root: HTMLElement): CanvasOverlay[] {
  const rootRect = root.getBoundingClientRect();
  return Array.from(root.querySelectorAll<HTMLElement>('[data-export-image-kind][data-export-image-src]'))
    .map((frame) => {
      const kind = frame.dataset.exportImageKind;
      const src = frame.dataset.exportImageSrc ?? '';
      const rect = frame.getBoundingClientRect();
      if ((kind !== 'flag' && kind !== 'portrait' && kind !== 'avatar') || !src || rect.width <= 0 || rect.height <= 0) {
        return null;
      }
      return {
        kind,
        src,
        x: rect.left - rootRect.left,
        y: rect.top - rootRect.top,
        width: rect.width,
        height: rect.height
      };
    })
    .filter((item): item is CanvasOverlay => item !== null);
}

async function loadCanvasAsset(src: string): Promise<HTMLImageElement> {
  const href = new URL(src, window.location.href).href;
  const response = await fetch(href, { cache: 'force-cache', credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    return await loadCanvasImage(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadCanvasImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not decode image'));
    image.src = src;
  });
}

function drawCanvasContainRect(ctx: CanvasRenderingContext2D, image: HTMLImageElement, frame: CanvasRect) {
  const scale = Math.min(frame.width / image.naturalWidth, frame.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.drawImage(
    image,
    frame.x + (frame.width - width) / 2,
    frame.y + (frame.height - height) / 2,
    width,
    height
  );
}

function drawCanvasCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, frame: CanvasRect) {
  const scale = Math.max(frame.width / image.naturalWidth, frame.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.save();
  canvasRoundedRectPath(ctx, frame.x, frame.y, frame.width, frame.height, 36);
  ctx.clip();
  ctx.drawImage(image, frame.x + (frame.width - width) / 2, frame.y, width, height);
  ctx.restore();
}

function drawCanvasCoverCircular(ctx: CanvasRenderingContext2D, image: HTMLImageElement, frame: CanvasRect) {
  const scale = Math.max(frame.width / image.naturalWidth, frame.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(frame.x + frame.width / 2, frame.y + frame.height / 2, frame.width / 2, frame.height / 2, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, frame.x + (frame.width - width) / 2, frame.y + (frame.height - height) / 2, width, height);
  ctx.restore();
}

function canvasRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
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
