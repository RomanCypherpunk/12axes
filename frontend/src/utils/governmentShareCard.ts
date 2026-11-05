import { P as PREMIUM_TEXT } from '../components/results/premium/premiumText';
import { LANG, t } from '../i18n';
import type { GovernmentSeat, PremiumReport, QuizResult } from '../types/quiz';
import { resolveIdeologyColor } from './ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from './personalityImage';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity } from './shareCard';
import {
  P,
  SAFETY,
  SHARE_FONT_BODY,
  SHARE_FONT_DISPLAY,
  darkShell,
  downloadAndShare,
  el,
  fitBlock,
  mixHex,
  renderSectionPng,
  rgba,
  type Palette
} from './sectionShareParts';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento do "Governo ideal" — stories 1080x1920: a mesa redonda com as nove cadeiras e, ao lado de cada rosto,
 * o nome e o cargo de quem a ocupa (peças em sectionShareParts).
 *
 * A disposição é a da página de resultado: o líder na cabeceira, com o texto em cima do rosto; os quatro da direita com o texto à
 * direita do rosto, alinhado à esquerda; os quatro da esquerda com o texto à esquerda, alinhado à direita. O texto de cada cargo
 * fica numa coluna de largura fixa, ao lado do rosto, então nenhum nome invade o rosto ou o texto de outro cargo.
 *
 * Os cargos são fixos; o que varia é o nome (até 35 caracteres), e a fonte diminui para ele caber nas linhas reservadas.
 */

type SeatKey = GovernmentSeat['seatKey'];
type Side = 'top' | 'left' | 'right';

// Em volta da mesa, no sentido horário a partir do topo: o líder na cabeceira e o vice logo à direita dele.
const ORDER: SeatKey[] = ['lider', 'vice', 'economia', 'educacao', 'estrategia', 'filosofia', 'social', 'industria', 'cultura'];
const SCENE_WIDTH = 952;
const SCENE_HEIGHT = 1130;
const CENTER_X = SCENE_WIDTH / 2;
// O líder, no topo, leva o texto em cima do rosto e por isso a cena tem mais espaço acima da mesa do que abaixo.
const CENTER_Y = 620;
// A mesa é pequena porque o texto precisa de espaço ao lado de cada rosto: com 952px de largura, o texto (190px) e o rosto ocupam
// o que sobra dos dois lados. Os rostos ficam numa elipse um pouco mais alta que larga e as cadeiras num círculo junto da mesa.
const TABLE_RADIUS = 112;
// Os rostos ficam em duas colunas alinhadas (uma de cada lado da mesa), em quatro linhas fixas, e o líder no topo.
const FACE_RX = 228;
const ROW_OFFSETS = [-330, -110, 110, 330];
const LEADER_Y = 150;
const CHAIR_RADIUS = 142;
const CHAIR_SCALE = 0.85;
const FACE = 112;
const LABEL_WIDTH = 176;
const LABEL_GAP = 16;
const NAME_LINES = 2;
const ROLE_LINES = 3;
const NAME_SIZE = 18;
const ROLE_SIZE = 23;
const LINE_HEIGHT = 1.25;

const SVG_NS = 'http://www.w3.org/2000/svg';
function svgNode(tag: string, attrs: Record<string, string | number>): SVGElement {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

const radians = (degrees: number) => (degrees * Math.PI) / 180;
// O ângulo de cada cargo, em graus a partir do topo e no sentido horário (o líder em 0).
const angleOf = (index: number) => index * 40;

/** De que lado do rosto fica o texto: o líder em cima, o vice e os três seguintes à direita, os outros quatro à esquerda. */
function sideOf(index: number): Side {
  if (index === 0) return 'top';
  return index <= 4 ? 'right' : 'left';
}

/** A mesa redonda com sombra e as nove cadeiras (uma por cargo, em volta dela), desenhadas em SVG. */
function table(color: Palette): SVGElement {
  const svg = svgNode('svg', { width: SCENE_WIDTH, height: SCENE_HEIGHT, viewBox: `0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}` });
  svg.style.position = 'absolute';
  svg.style.left = '0';
  svg.style.top = '0';
  svg.style.overflow = 'visible';
  const defs = svgNode('defs', {});
  const filter = svgNode('filter', { id: 'gov-shadow', x: '-30%', y: '-30%', width: '160%', height: '170%' });
  filter.append(svgNode('feDropShadow', { dx: 0, dy: 14, stdDeviation: 12, 'flood-color': '#000000', 'flood-opacity': 0.4 }));
  defs.append(filter);
  svg.append(
    defs,
    svgNode('ellipse', { cx: CENTER_X, cy: CENTER_Y, rx: TABLE_RADIUS + 8, ry: TABLE_RADIUS + 8, fill: mixHex(color.bg, color.base, 0.6), filter: 'url(#gov-shadow)' }),
    svgNode('ellipse', { cx: CENTER_X, cy: CENTER_Y, rx: TABLE_RADIUS, ry: TABLE_RADIUS, fill: color.bg }),
    svgNode('ellipse', { cx: CENTER_X, cy: CENTER_Y, rx: TABLE_RADIUS - 32, ry: TABLE_RADIUS - 32, fill: 'none', stroke: mixHex(color.bg, color.base, 0.75), 'stroke-width': 2 })
  );
  ORDER.forEach((_, index) => {
    const angle = angleOf(index);
    const x = CENTER_X + CHAIR_RADIUS * Math.sin(radians(angle));
    const y = CENTER_Y - CHAIR_RADIUS * Math.cos(radians(angle));
    const chair = svgNode('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle}) scale(${CHAIR_SCALE})` });
    chair.append(
      svgNode('rect', { x: -23, y: -30, width: 46, height: 11, rx: 5.5, fill: color.bg }),
      svgNode('rect', { x: -22, y: -17, width: 44, height: 34, rx: 11, fill: mixHex(color.bg, color.base, 0.55) })
    );
    svg.append(chair);
  });
  return svg;
}

/** Onde fica o centro do rosto de um cargo: o líder no topo; à direita, de cima para baixo, o vice e os três seguintes; à esquerda, de baixo para cima, os quatro últimos. */
function facePosition(index: number): { x: number; y: number } {
  if (index === 0) return { x: CENTER_X, y: LEADER_Y };
  if (index <= 4) return { x: CENTER_X + FACE_RX, y: CENTER_Y + ROW_OFFSETS[index - 1] };
  return { x: CENTER_X - FACE_RX, y: CENTER_Y + ROW_OFFSETS[8 - index] };
}

/** O nome (caixa-alta, até 2 linhas) e o cargo (até 3 linhas), com a fonte que couber, alinhados para o lado do rosto. */
function label(name: string, role: string, side: Side, nameColor: string): HTMLElement {
  const upperName = name.toLocaleUpperCase(LANG);
  const nameSize = fitBlock(upperName, {
    weight: 600,
    family: SHARE_FONT_BODY,
    width: LABEL_WIDTH * SAFETY,
    height: NAME_LINES * NAME_SIZE * LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
    max: NAME_SIZE,
    min: 11,
    tracking: 0.09
  });
  const roleSize = fitBlock(role, {
    weight: 500,
    family: SHARE_FONT_BODY,
    width: LABEL_WIDTH * SAFETY,
    height: ROLE_LINES * ROLE_SIZE * LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
    max: ROLE_SIZE,
    min: 13,
    tracking: 0
  });
  const place: Partial<CSSStyleDeclaration> =
    side === 'top'
      ? { left: '50%', bottom: `calc(100% + 14px)`, transform: 'translateX(-50%)', alignItems: 'center', textAlign: 'center', justifyContent: 'flex-end' }
      : side === 'right'
        ? { left: `calc(100% + ${LABEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)', alignItems: 'flex-start', textAlign: 'left' }
        : { right: `calc(100% + ${LABEL_GAP}px)`, top: '50%', transform: 'translateY(-50%)', alignItems: 'flex-end', textAlign: 'right' };
  const box = el('div', {
    position: 'absolute',
    width: `${LABEL_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    ...place
  });
  box.append(
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: String(LINE_HEIGHT),
      letterSpacing: '0.09em',
      color: nameColor,
      overflowWrap: 'break-word'
    }, upperName),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '500',
      fontSize: `${roleSize}px`,
      lineHeight: String(LINE_HEIGHT),
      color: rgba(P, 0.95),
      overflowWrap: 'break-word'
    }, role)
  );
  return box;
}

function seat(index: number, holder: GovernmentSeat, color: Palette): HTMLElement {
  const { x, y } = facePosition(index);
  const wrap = el('div', {
    position: 'absolute',
    left: `${x.toFixed(1)}px`,
    top: `${y.toFixed(1)}px`,
    width: `${FACE}px`,
    height: `${FACE}px`,
    transform: 'translate(-50%, -50%)'
  });
  const ring = el('div', {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: `5px solid ${color.bg}`,
    boxShadow: `0 0 0 3px ${color.base}, 0 10px 24px rgba(0, 0, 0, 0.35)`,
    background: mixHex(color.base, '#000000', 0.6)
  });
  // A foto é desenhada no canvas dentro do anel; as iniciais só aparecem se ela não carregar.
  const photo = el('div', {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: '26px',
    color: rgba(P, 0.7)
  }, personalityInitials(holder.holder.name));
  photo.dataset.shareImage = 'avatar';
  photo.dataset.shareSrc = resolvePersonalityImageSrc(holder.holder.imagePath);
  ring.append(photo);
  wrap.append(ring, label(holder.holder.name, PREMIUM_TEXT.seats[ORDER[index]], sideOf(index), color.bg));
  return wrap;
}

export function buildGovernmentShareCard(
  result: QuizResult,
  report: PremiumReport,
  religion: Religion | null
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
  const { stage, target } = darkShell(color);
  const byKey = new Map(report.idealGovernment.map((item) => [item.seatKey, item]));

  const scene = el('div', { position: 'relative', alignSelf: 'center', width: `${SCENE_WIDTH}px`, height: `${SCENE_HEIGHT}px` });
  scene.append(table(color));
  ORDER.forEach((key, index) => {
    const holder = byKey.get(key);
    if (holder) scene.append(seat(index, holder, color));
  });

  target.append(
    buildShareHeader(t.shareIdealGovernment),
    buildShareIdentity(result, color.bg),
    scene,
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

/** Gera o PNG 1080x1920 do cartão do governo ideal (data URL), sem baixar nem compartilhar. */
export function createGovernmentSharePng(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildGovernmentShareCard(result, report, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportGovernmentShare(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<void> {
  const dataUrl = await createGovernmentSharePng(result, report, religion);
  const leader = report.idealGovernment.find((item) => item.seatKey === 'lider')?.holder.name ?? '';
  await downloadAndShare(dataUrl, {
    filePrefix: t.shareGovernmentFilePrefix,
    title: t.shareGovernmentTitle,
    text: t.shareGovernmentMessage(leader)
  });
}
