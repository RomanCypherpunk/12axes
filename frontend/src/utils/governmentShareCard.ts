import { P as PREMIUM_TEXT } from '../components/results/premium/premiumText';
import { LANG, t } from '../i18n';
import type { GovernmentSeat, PremiumReport, QuizResult } from '../types/quiz';
import { seatIconElement } from './governmentSeatIcons';
import { resolveIdeologyColor } from './ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from './personalityImage';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity } from './shareCard';
import {
  P,
  SAFETY,
  SHARE_FONT_BODY,
  SHARE_FONT_DISPLAY,
  box,
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
 * Cartão de compartilhamento do "Governo ideal" — stories 1080x1920: uma grade de 3 por 3, uma caixa por cargo, na ordem do
 * governo (político, vice e economista; educação, estratégia e filosofia; assuntos sociais, indústria e cultura). Cada caixa
 * traz o cargo em cima, o rosto de quem o ocupa e o nome embaixo (peças em sectionShareParts).
 *
 * Os cargos são fixos; o que varia é o nome (até 35 caracteres), e a fonte diminui para ele caber nas duas linhas reservadas.
 */

type SeatKey = GovernmentSeat['seatKey'];

// Linha a linha, da esquerda para a direita: a mesma ordem do governo ideal na página.
const ORDER: SeatKey[] = ['lider', 'vice', 'economia', 'educacao', 'estrategia', 'filosofia', 'social', 'industria', 'cultura'];
const COLUMNS = 3;
const GRID_WIDTH = 952;
const GRID_HEIGHT = 1130;
const GAP = 20;
const CELL_WIDTH = (GRID_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS;
const CELL_HEIGHT = (GRID_HEIGHT - GAP * 2) / 3;
const PADDING = 18;
const ICON = 46;
const FACE = 132;
const SECTION_GAP = 12;
const TEXT_WIDTH = CELL_WIDTH - PADDING * 2;
const ROLE_LINES = 2;
const ROLE_SIZE = 18;
const NAME_LINES = 2;
const NAME_SIZE = 26;
const LINE_HEIGHT = 1.2;

/** O cargo, em caixa-alta e até 2 linhas, com a fonte que couber na largura da caixa. */
function roleLabel(role: string, color: Palette): HTMLElement {
  const upper = role.toLocaleUpperCase(LANG);
  const size = fitBlock(upper, {
    weight: 600,
    family: SHARE_FONT_BODY,
    width: TEXT_WIDTH * SAFETY,
    height: ROLE_LINES * ROLE_SIZE * LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
    max: ROLE_SIZE,
    min: 12,
    tracking: 0.1
  });
  return el('div', {
    width: `${TEXT_WIDTH}px`,
    height: `${ROLE_LINES * ROLE_SIZE * LINE_HEIGHT}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '600',
    fontSize: `${size}px`,
    lineHeight: String(LINE_HEIGHT),
    letterSpacing: '0.1em',
    color: rgba(P, 0.78),
    overflowWrap: 'break-word'
  }, upper);
}

/** O nome de quem ocupa o cargo, em até 2 linhas, com a fonte que couber. */
function nameLabel(name: string): HTMLElement {
  const size = fitBlock(name, {
    weight: 700,
    family: SHARE_FONT_DISPLAY,
    width: TEXT_WIDTH * SAFETY,
    height: NAME_LINES * NAME_SIZE * LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
    max: NAME_SIZE,
    min: 15,
    tracking: -0.01
  });
  return el('div', {
    width: `${TEXT_WIDTH}px`,
    height: `${NAME_LINES * NAME_SIZE * LINE_HEIGHT}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: `${size}px`,
    lineHeight: String(LINE_HEIGHT),
    letterSpacing: '-0.01em',
    color: '#FFFFFF',
    overflowWrap: 'break-word'
  }, name);
}

function cell(index: number, seat: GovernmentSeat, color: Palette): HTMLElement {
  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  const wrap = box({
    position: 'absolute',
    left: `${column * (CELL_WIDTH + GAP)}px`,
    top: `${row * (CELL_HEIGHT + GAP)}px`,
    width: `${CELL_WIDTH}px`,
    height: `${CELL_HEIGHT}px`,
    boxSizing: 'border-box',
    padding: `${PADDING}px`,
    borderRadius: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${SECTION_GAP}px`
  });
  const ring = el('div', {
    width: `${FACE}px`,
    height: `${FACE}px`,
    flex: 'none',
    borderRadius: '50%',
    border: `5px solid ${color.bg}`,
    boxShadow: `0 0 0 3px ${color.base}, 0 10px 24px rgba(0, 0, 0, 0.35)`,
    background: mixHex(color.base, '#000000', 0.6),
    boxSizing: 'border-box'
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
    fontSize: '34px',
    color: rgba(P, 0.7)
  }, personalityInitials(seat.holder.name));
  photo.dataset.shareImage = 'avatar';
  photo.dataset.shareSrc = resolvePersonalityImageSrc(seat.holder.imagePath);
  ring.append(photo);
  wrap.append(seatIconElement(ORDER[index], ICON, rgba(P, 0.85)), roleLabel(PREMIUM_TEXT.seats[ORDER[index]], color), ring, nameLabel(seat.holder.name));
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

  const scene = el('div', { position: 'relative', alignSelf: 'center', width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` });
  ORDER.forEach((key, index) => {
    const holder = byKey.get(key);
    if (holder) scene.append(cell(index, holder, color));
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
