import { P as PREMIUM_TEXT } from '../components/results/premium/premiumText';
import { LANG, t } from '../i18n';
import type { AreaCountryMatch, PremiumReport, QuizResult } from '../types/quiz';
import { resolveCountryFlagSrc } from './countryFlags';
import { resolveIdeologyColor } from './ideologyColors';
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
  percentText,
  renderSectionPng,
  rgba,
  type Palette
} from './sectionShareParts';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento de "Países mais próximos por área" — stories 1080x1920: uma grade de 3 por 2 que ocupa toda a área
 * entre a identidade e o rodapé, uma caixa por área (sistema político, política externa e organização territorial; sistema
 * econômico, sociedade e cultura e tecnologia e natureza). Cada caixa traz o número e o nome da área, a bandeira grande, o nome do
 * país, a compatibilidade em destaque e uma barra com ela (peças em sectionShareParts).
 *
 * Os nomes de país mais longos (até uns 35 caracteres) quebram em duas linhas; a fonte diminui para caberem.
 */

const COLUMNS = 3;
const ROWS = 2;
const GRID_WIDTH = 952;
const GRID_HEIGHT = 1130;
const GAP = 20;
const CELL_WIDTH = (GRID_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS;
const CELL_HEIGHT = (GRID_HEIGHT - GAP * (ROWS - 1)) / ROWS;
const PADDING = 20;
const TEXT_WIDTH = CELL_WIDTH - PADDING * 2;
const FLAG_WIDTH = TEXT_WIDTH;
const FLAG_HEIGHT = Math.round(FLAG_WIDTH * 2 / 3);
const LINE_HEIGHT = 1.2;
const LABEL_LINES = 2;
const LABEL_SIZE = 20;
const NAME_LINES = 2;
const NAME_SIZE = 34;
const PERCENT_SIZE = 64;
const BAR_HEIGHT = 12;

/** O número da área ("01") e o nome dela, em caixa-alta e até 2 linhas, com a fonte que couber. */
function areaHeader(index: number, label: string, color: Palette): HTMLElement {
  const upper = label.toLocaleUpperCase(LANG);
  const size = fitBlock(upper, {
    weight: 600,
    family: SHARE_FONT_BODY,
    width: TEXT_WIDTH * SAFETY,
    height: LABEL_LINES * LABEL_SIZE * LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
    max: LABEL_SIZE,
    min: 12,
    tracking: 0.1
  });
  const wrap = el('div', { width: `${TEXT_WIDTH}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' });
  wrap.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '30px',
      lineHeight: '1',
      letterSpacing: '0.04em',
      color: color.bg
    }, String(index + 1).padStart(2, '0')),
    el('div', {
      width: `${TEXT_WIDTH}px`,
      height: `${LABEL_LINES * LABEL_SIZE * LINE_HEIGHT}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: `${size}px`,
      lineHeight: String(LINE_HEIGHT),
      letterSpacing: '0.1em',
      color: rgba(P, 0.82),
      overflowWrap: 'break-word'
    }, upper)
  );
  return wrap;
}

/** O nome do país, em até 2 linhas, com a fonte que couber. */
function countryName(name: string): HTMLElement {
  const size = fitBlock(name, {
    weight: 700,
    family: SHARE_FONT_DISPLAY,
    width: TEXT_WIDTH * SAFETY,
    height: NAME_LINES * NAME_SIZE * LINE_HEIGHT,
    lineHeight: LINE_HEIGHT,
    max: NAME_SIZE,
    min: 18,
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

/** A barra da compatibilidade: trilho escuro e preenchimento na cor do perfil. */
function bar(percent: number, color: Palette): HTMLElement {
  const track = el('div', {
    width: `${TEXT_WIDTH}px`,
    height: `${BAR_HEIGHT}px`,
    borderRadius: `${BAR_HEIGHT}px`,
    background: rgba(P, 0.14),
    overflow: 'hidden'
  });
  track.append(el('div', {
    width: `${Math.max(0, Math.min(100, percent))}%`,
    height: '100%',
    borderRadius: `${BAR_HEIGHT}px`,
    background: color.bg
  }));
  return track;
}

function cell(index: number, item: AreaCountryMatch, color: Palette): HTMLElement {
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
    justifyContent: 'space-between',
    overflow: 'hidden'
  });
  // Um filete na cor do perfil no topo da caixa.
  const accent = el('div', { position: 'absolute', left: '0', top: '0', width: '100%', height: '8px', background: color.bg, opacity: '0.9' });
  // A bandeira é desenhada no canvas (com os cantos arredondados); o quadro só reserva o espaço.
  const flag = el('div', { width: `${FLAG_WIDTH}px`, height: `${FLAG_HEIGHT}px`, flex: 'none' });
  flag.dataset.shareImage = 'badge';
  flag.dataset.shareSrc = resolveCountryFlagSrc(item.country.flagPath);
  const percent = el('div', {
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: `${PERCENT_SIZE}px`,
    lineHeight: '1',
    letterSpacing: '-2px',
    color: color.bg
  }, percentText(item.country.compatibility));
  wrap.append(
    accent,
    areaHeader(index, PREMIUM_TEXT.areaLabels[item.area] ?? item.area, color),
    flag,
    countryName(item.country.name),
    percent,
    bar(item.country.compatibility, color)
  );
  return wrap;
}

export function buildAreasShareCard(
  result: QuizResult,
  report: PremiumReport,
  religion: Religion | null
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
  const { stage, target } = darkShell(color);

  const scene = el('div', { position: 'relative', alignSelf: 'center', width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` });
  (report.countriesByArea ?? []).slice(0, COLUMNS * ROWS).forEach((item, index) => scene.append(cell(index, item, color)));

  target.append(
    buildShareHeader(t.shareAreasHeader),
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

/** Gera o PNG 1080x1920 do cartão de países por área (data URL), sem baixar nem compartilhar. */
export function createAreasSharePng(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildAreasShareCard(result, report, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportAreasShare(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<void> {
  if ((report.countriesByArea ?? []).length === 0) return;
  const dataUrl = await createAreasSharePng(result, report, religion);
  await downloadAndShare(dataUrl, {
    filePrefix: t.shareAreasFilePrefix,
    title: t.shareAreasTitle,
    text: t.shareAreasMessage
  });
}
