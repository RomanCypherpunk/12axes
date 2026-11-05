import { LANG, t } from '../i18n';
import type { CountryMatch, PremiumReport, QuizResult } from '../types/quiz';
import { textWidth } from './compareShareCard';
import { resolveCountryFlagSrc } from './countryFlags';
import { resolveIdeologyColor } from './ideologyColors';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity } from './shareCard';
import {
  BOX_BORDER,
  CONTENT_WIDTH,
  P,
  SAFETY,
  SHARE_FONT_BODY,
  SHARE_FONT_DISPLAY,
  box,
  clamp,
  darkShell,
  downloadAndShare,
  el,
  fitBlock,
  mixHex,
  percentText,
  renderSectionPng,
  rgba,
  type Palette
} from './sectionShareParts';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento dos "Países para viver" — stories 1080x1920: os 10 países atuais mais compatíveis, cada um com a
 * posição, a bandeira, o nome, a barra e a porcentagem (peças em sectionShareParts).
 *
 * Os nomes mais longos de países atuais têm 33 caracteres ("Washington, D.C. (Estados Unidos)"). Os nomes ficam numa linha só
 * enquanto couberem em 24px ou mais; se algum não couber, todas as linhas ganham altura para duas linhas, sem quebrar o alinhamento.
 */

const LIST_PADDING_X = 38;
const RANK_WIDTH = 36;
const FLAG_WIDTH = 108;
const FLAG_HEIGHT = 72;
const PERCENT_WIDTH = 130;
const ROW_GAP = 24;
// O nome e a barra dividem o que sobra da linha: a caixa menos o padding, a borda, a posição, a bandeira, a porcentagem e os três espaços.
const NAME_WIDTH = CONTENT_WIDTH - LIST_PADDING_X * 2 - BOX_BORDER * 2 - RANK_WIDTH - FLAG_WIDTH - PERCENT_WIDTH - ROW_GAP * 3;
const ONE_LINE = 38;
const TWO_LINES = 60;
const MIN_ONE_LINE_SIZE = 24;
const LINE_HEIGHT = 1.15;

/** O maior tamanho (33px até 24px) em que o nome cabe numa linha só, ou null se nem em 24px ele cabe. */
function oneLineSize(name: string): number | null {
  for (let size = 33; size >= MIN_ONE_LINE_SIZE; size -= 1) {
    if (textWidth(name, 600, size, SHARE_FONT_BODY) <= NAME_WIDTH * SAFETY) return size;
  }
  return null;
}

function row(country: CountryMatch, index: number, nameHeight: number, twoLines: boolean, color: Palette): HTMLElement {
  const line = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: `${ROW_GAP}px`,
    padding: '21px 0',
    borderTop: index === 0 ? 'none' : `2px solid ${rgba(P, 0.14)}`
  });
  const flag = el('div', {
    flex: '0 0 auto',
    width: `${FLAG_WIDTH}px`,
    height: `${FLAG_HEIGHT}px`,
    borderRadius: '12px',
    background: mixHex(color.base, '#000000', 0.6)
  });
  flag.dataset.shareImage = 'flag';
  flag.dataset.shareSrc = resolveCountryFlagSrc(country.flagPath);

  const nameSize = twoLines
    ? fitBlock(country.name, { weight: 600, family: SHARE_FONT_BODY, width: NAME_WIDTH * SAFETY, height: nameHeight, lineHeight: LINE_HEIGHT, max: 33, min: 14, tracking: 0 })
    : (oneLineSize(country.name) ?? MIN_ONE_LINE_SIZE);
  const mid = el('div', { flex: '1 1 0', minWidth: '0' });
  const track = el('div', { height: '12px', borderRadius: '6px', background: rgba(P, 0.16), marginTop: '12px', overflow: 'hidden' });
  track.append(el('div', { height: '100%', width: `${clamp(country.compatibility)}%`, borderRadius: '6px', background: color.bg }));
  mid.append(
    el('div', {
      height: `${nameHeight}px`,
      overflow: 'hidden',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: String(LINE_HEIGHT),
      color: P,
      overflowWrap: 'break-word',
      ...(twoLines ? {} : { whiteSpace: 'nowrap' })
    }, country.name),
    track
  );
  line.append(
    el('div', { flex: `0 0 ${RANK_WIDTH}px`, width: `${RANK_WIDTH}px`, fontFamily: SHARE_FONT_BODY, fontWeight: '600', fontSize: '24px', color: rgba(P, 0.55) }, String(index + 1).padStart(2, '0')),
    flag,
    mid,
    el('div', {
      flex: `0 0 ${PERCENT_WIDTH}px`,
      width: `${PERCENT_WIDTH}px`,
      textAlign: 'right',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '46px',
      letterSpacing: '-1px',
      color: color.bg
    }, percentText(country.compatibility))
  );
  return line;
}

export function buildLivingShareCard(
  result: QuizResult,
  report: PremiumReport,
  religion: Religion | null
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
  const { stage, target } = darkShell(color);
  const countries = report.topCountries.slice(0, 10);

  // Todos os nomes numa linha, se couberem em 24px ou mais; senão todas as linhas têm altura para duas.
  const fitsOneLine = countries.every((country) => oneLineSize(country.name) !== null);
  const twoLines = !fitsOneLine;
  const nameHeight = twoLines ? TWO_LINES : ONE_LINE;

  const list = box({ padding: `24px ${LIST_PADDING_X}px` });
  countries.forEach((country, index) => list.append(row(country, index, nameHeight, twoLines, color)));

  target.append(
    buildShareHeader(t.shareLiving),
    buildShareIdentity(result, color.bg),
    list,
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

/** Gera o PNG 1080x1920 do cartão dos países para viver (data URL), sem baixar nem compartilhar. */
export function createLivingSharePng(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildLivingShareCard(result, report, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportLivingShare(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<void> {
  const dataUrl = await createLivingSharePng(result, report, religion);
  const first = report.topCountries[0];
  await downloadAndShare(dataUrl, {
    filePrefix: t.shareLivingFilePrefix,
    title: t.shareLivingTitle,
    text: t.shareLivingMessage(first?.name ?? '', Math.round(first?.compatibility ?? 0))
  });
}
