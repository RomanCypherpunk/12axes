import { LANG, t } from '../i18n';
import type { ElectionCandidateMatch, ElectionResult, QuizResult } from '../types/quiz';
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
  percentText,
  renderSectionPng,
  rgba,
  type Palette
} from './sectionShareParts';
import { shortResultUrl } from './shortLinks';

/**
 * Cartão de compartilhamento da seção "Eleições" — stories 1080x1920 (peças em sectionShareParts).
 * Retrato do candidato mais próximo (com o logo do partido no canto), os outros candidatos e o aviso de que é afinidade, não voto.
 */

const HERO_HEIGHT = 940;
const HERO_PADDING = 40;
const NAME_LINE_HEIGHT = 1.1;
const LOGO_SIZE = 120;

/** O candidato mais compatível: a foto cobre a caixa (véu e degradê desenhados no canvas) e o texto fica embaixo, à esquerda. */
function hero(match: ElectionCandidateMatch, color: Palette): HTMLElement {
  const { candidate, party } = match;
  const frame = el('div', { position: 'relative', height: `${HERO_HEIGHT}px`, borderRadius: '36px', overflow: 'hidden' });
  frame.dataset.shareImage = 'portrait';
  frame.dataset.shareSrc = resolvePersonalityImageSrc(candidate.imagePath);

  if (party) {
    // O logo do partido numa caixa branca no canto (o canvas desenha a imagem por cima da inicial).
    const logo = el('div', {
      position: 'absolute',
      top: '28px',
      right: '28px',
      width: `${LOGO_SIZE}px`,
      height: `${LOGO_SIZE}px`,
      borderRadius: '24px',
      background: '#FFFFFF',
      display: 'grid',
      placeItems: 'center',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '36px',
      color: '#9AA0A8'
    }, personalityInitials(party.name));
    logo.dataset.shareImage = 'logosmall';
    logo.dataset.shareSrc = resolvePartyLogoSrc(party.logoPath);
    const badge = el('div', { position: 'absolute', top: '124px', right: '16px', width: '60px', height: '40px' });
    badge.dataset.shareImage = 'badgesmall';
    badge.dataset.shareSrc = resolveCountryFlagSrc(party.countryFlagPath);
    frame.append(logo, badge);
  }

  const nameSize = fitBlock(candidate.name, {
    weight: 600,
    family: SHARE_FONT_DISPLAY,
    width: (CONTENT_WIDTH - HERO_PADDING * 2) * SAFETY,
    height: 2 * 62 * NAME_LINE_HEIGHT,
    lineHeight: NAME_LINE_HEIGHT,
    max: 62,
    min: 28,
    tracking: -0.0242
  });
  const text = el('div', {
    position: 'absolute',
    left: `${HERO_PADDING}px`,
    right: `${HERO_PADDING}px`,
    bottom: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  });
  text.append(
    el('div', {
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '700',
      fontSize: '128px',
      lineHeight: '1',
      letterSpacing: '-4px',
      color: color.bg
    }, percentText(candidate.compatibility)),
    el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '600',
      fontSize: '28px',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      color: color.bg
    }, t.electionsClosestLabel),
    el('div', {
      marginTop: '10px',
      fontFamily: SHARE_FONT_DISPLAY,
      fontWeight: '600',
      fontSize: `${nameSize}px`,
      lineHeight: String(NAME_LINE_HEIGHT),
      letterSpacing: '-0.0242em',
      overflowWrap: 'break-word',
      color: P
    }, candidate.name)
  );
  if (party) {
    text.append(el('div', {
      fontFamily: SHARE_FONT_BODY,
      fontWeight: '500',
      fontSize: '30px',
      lineHeight: '1.25',
      color: rgba(P, 0.85)
    }, party.name));
  }
  frame.append(text);
  return frame;
}

function notice(): HTMLElement {
  return el('div', {
    padding: '0 8px',
    fontFamily: SHARE_FONT_BODY,
    fontWeight: '500',
    fontSize: '26px',
    lineHeight: '1.4',
    fontStyle: 'italic',
    color: rgba(P, 0.7)
  }, t.electionsNotice);
}

export function buildElectionsShareCard(
  result: QuizResult,
  election: ElectionResult,
  religion: Religion | null
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const color = resolveIdeologyColor(result.topMatch.category, result.topMatch.ideologyId);
  const { stage, target } = darkShell(color);
  const top = election.candidates[0];

  target.append(
    buildShareHeader(t.shareElectionsHeader),
    buildShareIdentity(result, color.bg),
    hero(top, color),
    notice(),
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

/** Gera o PNG 1080x1920 do cartão de eleições (data URL), sem baixar nem compartilhar. */
export function createElectionsSharePng(result: QuizResult, election: ElectionResult, religion: Religion | null): Promise<string> {
  return renderSectionPng(() => buildElectionsShareCard(result, election, religion));
}

/** Gera o PNG, baixa e abre a folha de compartilhamento do aparelho (quando existe). */
export async function exportElectionsShare(result: QuizResult, election: ElectionResult | undefined, religion: Religion | null): Promise<void> {
  if (!election || election.candidates.length === 0) return;
  const dataUrl = await createElectionsSharePng(result, election, religion);
  const top = election.candidates[0];
  await downloadAndShare(dataUrl, {
    filePrefix: t.shareElectionsFilePrefix,
    title: t.shareElectionsTitle,
    text: t.shareElectionsMessage(top.candidate.name, top.party?.name ?? '', Math.round(top.candidate.compatibility))
  });
}
