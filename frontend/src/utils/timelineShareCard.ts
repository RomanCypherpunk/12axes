import { P as PREMIUM_TEXT } from '../components/results/premium/premiumText';
import { LANG, t } from '../i18n';
import type { PremiumReport, QuizResult, TimelineEntry, TimelineEra } from '../types/quiz';
import { fitFontSize } from './compareShareCard';
import { resolveCountryFlagSrc } from './countryFlags';
import { resolveIdeologyColor } from './ideologyColors';
import { resolvePartyLogoSrc } from './partyLogos';
import { personalityInitials, resolvePersonalityImageSrc } from './personalityImage';
import type { Religion } from './religion';
import { buildShareFooter, buildShareHeader, buildShareIdentity } from './shareCard';
import {
  CONTENT_WIDTH,
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
 * Cartão de compartilhamento da "Linha do tempo ideológica" — stories 1080x1920: as seis eras, cada uma com os dois perfis mais
 * compatíveis, e a época mais compatível num quadro embaixo (peças em sectionShareParts).
 *
 * Cada linha e cada cartão de perfil têm altura fixa: o nome ocupa até duas linhas (a fonte diminui nos longos) e a data uma só.
 */

const ROW_HEIGHT = 164;
const CHIP_HEIGHT = 124;
const AVATAR = 84;
const ERA_COLUMN = 232;
const COLUMN_GAP = 14;
const DOT_COLUMN = 24;
// Largura de cada cartão de perfil: o que sobra da largura útil depois da coluna do ponto, da era e dos três espaços, dividido por dois.
const CHIP_WIDTH = (CONTENT_WIDTH - DOT_COLUMN - ERA_COLUMN - COLUMN_GAP * 3) / 2;
// O texto do perfil: o cartão menos a borda, o padding, o retrato e o espaço.
const CHIP_TEXT_WIDTH = CHIP_WIDTH - 4 - 28 - AVATAR - COLUMN_GAP;
const MOSAIC = 200;
const BEST_PADDING_X = 34;
const BEST_GAP = 34;
const BEST_TEXT_WIDTH = CONTENT_WIDTH - BEST_PADDING_X * 2 - 4 - MOSAIC - BEST_GAP;

interface EntryInfo {
  name: string;
  date: string;
  imageSrc: string;
  kind: 'person' | 'flag' | 'logo';
}

/** O nome, a data e a imagem de um perfil da linha do tempo (personalidade, país ou partido). */
function entryInfo(entry: TimelineEntry): EntryInfo | null {
  if (entry.type === 'personality' && entry.personality) {
    const match = entry.personality;
    return { name: match.name, date: match.lifespan, imageSrc: resolvePersonalityImageSrc(match.imagePath), kind: 'person' };
  }
  if (entry.type === 'country' && entry.country) {
    const match = entry.country;
    return {
      name: match.name,
      date: match.historical && match.period ? match.period : PREMIUM_TEXT.timelineCurrent,
      imageSrc: resolveCountryFlagSrc(match.flagPath),
      kind: 'flag'
    };
  }
  if (entry.type === 'party' && entry.party) {
    const match = entry.party;
    return {
      name: match.name,
      date: match.historical && match.period ? match.period : PREMIUM_TEXT.timelineCurrent,
      imageSrc: resolvePartyLogoSrc(match.logoPath),
      kind: 'logo'
    };
  }
  return null;
}

/** A era com a maior compatibilidade (empate: a mais antiga); as que não têm perfis ficam de fora. */
function bestEra(timeline: TimelineEra[]): TimelineEra | null {
  let best: TimelineEra | null = null;
  for (const era of timeline) {
    if (era.entries.length > 0 && (best === null || era.compatibility > best.compatibility)) best = era;
  }
  return best;
}

/** O retrato, a bandeira ou o logo num círculo com anel; a imagem é desenhada no canvas dentro do anel. */
function avatar(info: EntryInfo, color: Palette): HTMLElement {
  const ring = el('div', {
    flex: '0 0 auto',
    width: `${AVATAR}px`,
    height: `${AVATAR}px`,
    borderRadius: '50%',
    border: `3px solid ${color.bg}`,
    background: mixHex(color.base, '#000000', 0.6)
  });
  const photo = el('div', {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    fontFamily: SHARE_FONT_DISPLAY,
    fontWeight: '700',
    fontSize: '24px',
    color: rgba(P, 0.7)
  }, personalityInitials(info.name));
  photo.dataset.shareImage = info.kind === 'person' ? 'avatar' : info.kind === 'flag' ? 'flaground' : 'logoround';
  photo.dataset.shareSrc = info.imageSrc;
  ring.append(photo);
  return ring;
}

function chip(info: EntryInfo | undefined, color: Palette): HTMLElement {
  const box = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: `${COLUMN_GAP}px`,
    height: `${CHIP_HEIGHT}px`,
    padding: '14px',
    borderRadius: '26px',
    background: 'rgba(0, 0, 0, 0.22)',
    border: `2px solid ${rgba(P, 0.14)}`,
    minWidth: '0'
  });
  if (!info) return box;
  const nameSize = fitBlock(info.name, {
    weight: 600,
    family: SHARE_FONT_BODY,
    width: CHIP_TEXT_WIDTH * SAFETY,
    height: 2 * 26 * 1.2,
    lineHeight: 1.2,
    max: 26,
    min: 14,
    tracking: 0
  });
  const dateSize = fitFontSize(info.date || ' ', 400, SHARE_FONT_BODY, CHIP_TEXT_WIDTH * SAFETY, 1, 21, 12, 0);
  const text = el('div', { minWidth: '0', flex: '1 1 0' });
  text.append(
    el('div', { fontFamily: SHARE_FONT_BODY, fontWeight: '600', fontSize: `${nameSize}px`, lineHeight: '1.2', color: P, overflowWrap: 'break-word' }, info.name),
    el('div', {
      marginTop: '4px',
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '400',
      fontSize: `${dateSize}px`,
      lineHeight: '1.2',
      whiteSpace: 'nowrap',
      color: rgba(P, 0.7)
    }, info.date)
  );
  box.append(avatar(info, color), text);
  return box;
}

/** Uma linha da linha do tempo: o ponto, a era e os dois perfis, com o fio ligando ao ponto da próxima. */
function eraRow(era: TimelineEra, first: boolean, last: boolean, color: Palette): HTMLElement {
  const row = el('div', {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: `${DOT_COLUMN}px ${ERA_COLUMN}px 1fr 1fr`,
    columnGap: `${COLUMN_GAP}px`,
    alignItems: 'center',
    height: `${ROW_HEIGHT}px`,
    padding: '20px 0',
    borderTop: first ? 'none' : `2px solid ${rgba(P, 0.16)}`
  });
  const dot = el('div', {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: color.bg,
    alignSelf: 'start',
    marginTop: '12px',
    position: 'relative',
    zIndex: '1'
  });
  const eraName = PREMIUM_TEXT.timelineEraNames[era.key];
  const range = PREMIUM_TEXT.timelineRange(era.fromYear, era.toYear);
  const nameSize = fitBlock(eraName, {
    weight: 600,
    family: SHARE_FONT_DISPLAY,
    width: ERA_COLUMN * SAFETY,
    height: 2 * 33 * 1.15,
    lineHeight: 1.15,
    max: 33,
    min: 18,
    tracking: -0.015
  });
  const rangeSize = fitFontSize(range, 500, SHARE_FONT_BODY, ERA_COLUMN * SAFETY, 1, 22, 12, 0);
  const label = el('div', { alignSelf: 'start' });
  label.append(
    el('div', { fontFamily: SHARE_FONT_DISPLAY, fontWeight: '600', fontSize: `${nameSize}px`, lineHeight: '1.15', letterSpacing: '-0.015em' }, eraName),
    el('div', { marginTop: '8px', fontFamily: SHARE_FONT_BODY, fontWeight: '500', fontSize: `${rangeSize}px`, whiteSpace: 'nowrap', color: rgba(P, 0.7) }, range)
  );
  const infos = era.highlights.map(entryInfo).filter((info): info is EntryInfo => info !== null);
  row.append(dot, label, chip(infos[0], color), chip(infos[1], color));
  if (!last) {
    // O fio vai do centro deste ponto até o centro do ponto da próxima linha.
    row.append(
      el('div', { position: 'absolute', left: '10px', top: '44px', height: `${ROW_HEIGHT}px`, width: '3px', background: rgba(P, 0.3) })
    );
  }
  return row;
}

/** O quadro "Época mais compatível": o mosaico com os perfis dela, o nome e o período. */
function bestBox(era: TimelineEra, color: Palette): HTMLElement {
  const box = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: `${BEST_GAP}px`,
    padding: `30px ${BEST_PADDING_X}px`,
    borderRadius: '36px',
    background: 'rgba(0, 0, 0, 0.22)',
    border: `2px solid ${rgba(P, 0.14)}`
  });
  const infos = era.entries.map(entryInfo).filter((info): info is EntryInfo => info !== null).slice(0, 4);
  const mosaic = el('div', { flex: '0 0 auto', width: `${MOSAIC}px`, height: `${MOSAIC}px`, borderRadius: '26px' });
  mosaic.dataset.shareImage = 'mosaic';
  mosaic.dataset.shareSrc = JSON.stringify(infos.map((info) => ({ src: info.imageSrc, fit: info.kind === 'logo' ? 'contain' : 'cover' })));

  const label = t.shareBestEra;
  const labelSize = fitFontSize(label, 600, SHARE_FONT_BODY, BEST_TEXT_WIDTH * SAFETY, 1, 22, 12, 0.16);
  const eraName = PREMIUM_TEXT.timelineEraNames[era.key];
  const nameSize = fitFontSize(eraName, 600, SHARE_FONT_DISPLAY, BEST_TEXT_WIDTH * SAFETY, 1, 62, 30, -0.024);
  const range = PREMIUM_TEXT.timelineRange(era.fromYear, era.toYear);
  const rangeSize = fitFontSize(range, 400, SHARE_FONT_BODY, BEST_TEXT_WIDTH * SAFETY, 1, 28, 14, 0);
  const text = el('div', { flex: '1 1 0', minWidth: '0' });
  text.append(
    el('div', { fontFamily: SHARE_FONT_BODY, fontWeight: '600', fontSize: `${labelSize}px`, letterSpacing: '0.16em', whiteSpace: 'nowrap', color: color.bg }, label),
    el('div', {
      marginTop: '12px',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: '1.05',
      letterSpacing: '-0.024em',
      whiteSpace: 'nowrap'
    }, eraName),
    el('div', { marginTop: '10px', fontFamily: SHARE_FONT_BODY, fontWeight: '400', fontSize: `${rangeSize}px`, whiteSpace: 'nowrap', color: rgba(P, 0.75) }, range)
  );
  box.append(mosaic, text);
  return box;
}

export function buildTimelineShareCard(
  result: QuizResult,
  report: PremiumReport,
  religion: Religion | null
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category);
  const { stage, target } = darkShell(color);

  const list = el('div', { display: 'flex', flexDirection: 'column' });
  report.timeline.forEach((era, index) => list.append(eraRow(era, index === 0, index === report.timeline.length - 1, color)));

  target.append(buildShareHeader(t.shareTimeline), buildShareIdentity(result, color.bg), list);
  const best = bestEra(report.timeline);
  if (best) target.append(bestBox(best, color));
  target.append(
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

/** Gera o PNG 1080x1920 do cartão da linha do tempo (data URL), sem baixar nem compartilhar. */
export function createTimelineSharePng(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildTimelineShareCard(result, report, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportTimelineShare(result: QuizResult, report: PremiumReport, religion: Religion | null): Promise<void> {
  const dataUrl = await createTimelineSharePng(result, report, religion);
  const best = bestEra(report.timeline);
  await downloadAndShare(dataUrl, {
    filePrefix: t.shareTimelineFilePrefix,
    title: t.shareTimelineTitle,
    text: t.shareTimelineMessage(best ? PREMIUM_TEXT.timelineEraNames[best.key] : '')
  });
}
