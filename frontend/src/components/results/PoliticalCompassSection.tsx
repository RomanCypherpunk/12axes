import { useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import { ideologyColorByKey, resolveIdeologyColor, type IdeologyColorKey } from '../../utils/ideologyColors';
import type { Axis } from '../../types/quiz';
import { centerSide, compassNoteHint, compassRegion, socialLevel, type CompassPosition } from '../../utils/politicalCompass';
import { clickableProps, InfoSheet } from './InfoSheet';

// Tom de cada categoria na grade: o matiz vem da cor base da identidade; saturação e luminosidade
// (0-100) ficam por conta de cada uma, para o resultado ser claro e saturado como a bússola clássica.
// `hue` só aparece quando o matiz da cor base precisa de ajuste (o ocre do Libertário vira amarelo).
const VIVID: Record<IdeologyColorKey, { saturation: number; lightness: number; hue?: number }> = {
  'esq-radical': { saturation: 85, lightness: 74 },
  terceira: { saturation: 65, lightness: 78 },
  'ext-direita': { saturation: 85, lightness: 66 },
  esquerda: { saturation: 65, lightness: 72 },
  centro: { saturation: 10, lightness: 80 },
  direita: { saturation: 90, lightness: 77 },
  anarquismo: { saturation: 0, lightness: 72 },
  libertario: { saturation: 90, lightness: 68, hue: 47 }
};
// Cores dos polos do eixo `moral` (rosa e marrom em axes.json); estas são só o plano B se o eixo faltar.
const FALLBACK_PROGRESSIVE = '#D23E84';
const FALLBACK_TRADITIONAL = '#74502C';
const WHITE = [255, 255, 255] as const;
// Meio da barra: moderados ficam num cinza neutro, entre o rosa e o marrom.
const NEUTRAL = [123, 127, 134] as const;
const SIZE = 9;

function mix(a: readonly number[], b: readonly number[], amount: number): number[] {
  return a.map((value, index) => value + (b[index] - value) * amount);
}

/** Rosa → cinza → marrom: `amount` 0 é a ponta progressista, 0,5 o cinza e 1 a ponta tradicionalista. */
function threeStop(start: readonly number[], middle: readonly number[], end: readonly number[], amount: number): number[] {
  return amount < 0.5 ? mix(start, middle, amount * 2) : mix(middle, end, (amount - 0.5) * 2);
}

function hexToRgb(hex: string): number[] {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.replace(/./g, '$&$&') : value;
  return [0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16));
}

function rgb(color: number[]): string {
  return `rgb(${color.map((value) => Math.round(value)).join(',')})`;
}

function hueOf([red, green, blue]: number[]): number {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  if (max === min) return 0;
  const delta = max - min;
  const hue = max === red ? ((green - blue) / delta) % 6 : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return (hue * 60 + 360) % 360;
}

function hslToRgb(hue: number, saturation: number, lightness: number): number[] {
  const s = saturation / 100;
  const l = lightness / 100;
  const k = (n: number) => (n + hue / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [channel(0), channel(8), channel(4)].map((value) => value * 255);
}

/** Base do Centro misturada, meio a meio, com a base da outra categoria; undefined se não for um par com o Centro. */
function centerMixColor(first: IdeologyColorKey, second: IdeologyColorKey): string | undefined {
  if (first === second || (first !== 'centro' && second !== 'centro')) return undefined;
  const other = first === 'centro' ? second : first;
  return rgb(mix(hexToRgb(ideologyColorByKey('centro').base), hexToRgb(ideologyColorByKey(other).base), 0.5));
}

function vividColor(key: IdeologyColorKey): number[] {
  const { saturation, lightness, hue } = VIVID[key];
  return hslToRgb(hue ?? hueOf(hexToRgb(ideologyColorByKey(key).base)), saturation, lightness);
}

// A grade é um mapa de blocos: cada região ocupa o retângulo de células que `compassRegion` lhe dá (em unidades de
// célula, de 0 a 9). A cor de um quadrado mistura a cor dos blocos que estão perto do centro dele: dentro de um bloco
// só vale a cor do próprio bloco, e só o anel de um quadrado em volta de cada divisa leva um pouco da cor vizinha.
// Quadrado a quadrado, sem degradê dentro da célula, para os blocos continuarem fáceis de distinguir.
const REGION_BLOCKS: { key: IdeologyColorKey; x: [number, number]; y: [number, number] }[] = [
  { key: 'esq-radical', x: [0, 3], y: [0, 3] },
  { key: 'terceira', x: [3, 6], y: [0, 3] },
  { key: 'ext-direita', x: [6, 9], y: [0, 3] },
  { key: 'esquerda', x: [0, 3], y: [3, 7] },
  { key: 'centro', x: [3, 6], y: [3, 7] },
  { key: 'direita', x: [6, 9], y: [3, 7] },
  { key: 'anarquismo', x: [0, 4.5], y: [7, 9] },
  { key: 'libertario', x: [4.5, 9], y: [7, 9] }
];
// Alcance da mistura, em células: quanto maior, mais a cor vizinha invade. Com 0,45 o quadrado da divisa fica
// com cerca de dois terços da própria cor e um terço da vizinha, e o miolo do bloco continua puro.
const BLEND_SPREAD = 0.45;
// Pesos abaixo disso valem zero, para o miolo de cada bloco ter exatamente a mesma cor.
const MIN_WEIGHT = 0.03;

function regionWeight(block: (typeof REGION_BLOCKS)[number], x: number, y: number): number {
  const dx = Math.max(block.x[0] - x, 0, x - block.x[1]);
  const dy = Math.max(block.y[0] - y, 0, y - block.y[1]);
  const weight = Math.exp(-(dx * dx + dy * dy) / (2 * BLEND_SPREAD ** 2));
  return weight < MIN_WEIGHT ? 0 : weight;
}

function cellColor(column: number, row: number): string {
  const x = column + 0.5;
  const y = row + 0.5;
  let total = 0;
  const sum = [0, 0, 0];
  for (const block of REGION_BLOCKS) {
    const weight = regionWeight(block, x, y);
    if (weight === 0) continue;
    total += weight;
    vividColor(block.key).forEach((value, index) => {
      sum[index] += value * weight;
    });
  }
  return rgb(sum.map((value) => value / total));
}

const GRID_CELLS: string[] = Array.from({ length: SIZE * SIZE }, (_, index) => cellColor(index % SIZE, Math.floor(index / SIZE)));

// Mantém o marcador inteiro dentro da grade mesmo nos extremos.
const clamp = (value: number): number => Math.max(4, Math.min(96, value));

export function Marker({ left, top, color, face, outline, title }: { left: number; top?: number; color?: string; face?: ReactNode; outline?: string; title?: string }) {
  const style: CSSProperties = { left: `${clamp(left)}%`, top: top === undefined ? '50%' : `${clamp(top)}%` };
  if (face) {
    // Em /compare o marcador é o retrato do perfil, contornado com a cor da região em que ele cai.
    return (
      <span className="e-compass-x e-compass-face" style={{ ...style, '--oc': outline } as CSSProperties} title={title} aria-hidden="true">
        {face}
      </span>
    );
  }
  if (color) style.background = color;
  return (
    <span className="e-compass-x" style={style} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </span>
  );
}

interface PoliticalCompassSectionProps {
  position: CompassPosition;
  /** Categoria da ideologia mais compatível (o "espectro"): dá a palavra e a cor da frase. */
  category: string;
  /** Eixo `moral` (Progressista × Tradicionalista): suas cores nas pontas pintam a barra, o "X" e o grifo. */
  moralAxis?: Axis;
}

/** Valores derivados da bússola (cores, frase e barra), compartilhados com o relatório em PDF. */
export function compassView(position: CompassPosition, category: string, moralAxis?: Axis) {
  const { traditional } = position;
  const spectrum = resolveIdeologyColor(category);
  // Só quando a ideologia mais compatível e a região da bússola são Centro e Esquerda (ou Centro e Direita) a frase
  // mostra a posição intermediária, centro-esquerda ou centro-direita; nos demais casos vale a categoria da ideologia.
  const compassKey = compassRegion(position);
  const centerSideKey = centerSide(spectrum.key, compassKey);
  const centerLabel = centerSideKey === 'esquerda' ? t.compassCenterLeft : t.compassCenterRight;
  // "X" da grade: quando a ideologia e a região da bússola divergem e uma delas é o Centro, a cor é a mistura
  // da base do Centro com a base da outra; nos demais casos vale a cor da categoria da página (--cat).
  const markerColor = centerMixColor(spectrum.key, compassKey);
  const social = socialLevel(traditional);
  const progressive = hexToRgb(moralAxis?.leftColor ?? FALLBACK_PROGRESSIVE);
  const traditionalist = hexToRgb(moralAxis?.rightColor ?? FALLBACK_TRADITIONAL);
  const stripCells = socialStripCells(moralAxis);
  // "X" e grifo na cor cheia da mesma escala da barra.
  const socialColor = rgb(threeStop(progressive, NEUTRAL, traditionalist, traditional / 100));
  // Nota sob a bússola: só quando a categoria da ideologia e a região da grade divergem sem ser centro-esquerda/direita.
  const noteHint = compassNoteHint(spectrum.key, compassKey);
  const region = ideologyColorByKey(compassKey);
  return { spectrum, centerSideKey, centerLabel, markerColor, social, stripCells, socialColor, noteHint, region };
}

/** Barra progressista/tradicionalista em tom pastel (rosa, cinza, marrom), também usada em /compare. */
export function socialStripCells(moralAxis?: Axis): string[] {
  const progressive = hexToRgb(moralAxis?.leftColor ?? FALLBACK_PROGRESSIVE);
  const traditionalist = hexToRgb(moralAxis?.rightColor ?? FALLBACK_TRADITIONAL);
  return Array.from({ length: SIZE }, (_, index) =>
    rgb(
      threeStop(
        mix(progressive, WHITE, 0.72),
        mix(NEUTRAL, WHITE, 0.72),
        mix(traditionalist, WHITE, 0.72),
        index / (SIZE - 1)
      )
    )
  );
}

export const COMPASS_GRID_CELLS = GRID_CELLS;
export const compassClamp = clamp;

export interface CompassMarker {
  key: string;
  left: number;
  top?: number;
  color?: string;
  /** Retrato, bandeira ou logo do perfil no lugar do "X" (com `outline` na borda). */
  face?: ReactNode;
  outline?: string;
  title?: string;
}

/**
 * Cores do contorno de um perfil em /compare: a da região da grade em que ele cai (a mesma base que
 * pinta o espectro dos resultados) e a do ponto da barra progressista/tradicionalista.
 */
export function compassOutlines(position: CompassPosition, moralAxis?: Axis): { region: string; social: string } {
  const { socialColor } = compassView(position, '', moralAxis);
  return { region: ideologyColorByKey(compassRegion(position)).base, social: socialColor };
}

/** Grade da bússola com um "X" por marcador (o resultado do usuário ou, em /compare, cada perfil). */
export function CompassChart({ ariaLabel, markers }: { ariaLabel: string; markers: CompassMarker[] }) {
  return (
    <div className="e-compass-chart" role="img" aria-label={ariaLabel}>
      <span className="e-compass-lbl is-top">{t.compassAuthoritarian}</span>
      <span className="e-compass-lbl is-left">{t.compassLeft}</span>
      <div className="e-compass-grid">
        {GRID_CELLS.map((color, index) => (
          <span key={index} style={{ background: color }} />
        ))}
        <i className="e-compass-axis is-x" aria-hidden="true" />
        <i className="e-compass-axis is-y" aria-hidden="true" />
        {markers.map(({ key, ...marker }) => (
          <Marker key={key} {...marker} />
        ))}
      </div>
      <span className="e-compass-lbl is-right">{t.compassRight}</span>
      <span className="e-compass-lbl is-bottom">{t.compassLibertarian}</span>
    </div>
  );
}

/** Barra progressista/tradicionalista com um "X" por marcador. */
export function SocialStrip({ cells, markers }: { cells: string[]; markers: CompassMarker[] }) {
  return (
    <div className="e-compass-bar" aria-hidden="true">
      <div className="e-compass-bar-lbls">
        <span>{t.compassProgressive}</span>
        <span>{t.compassTraditionalist}</span>
      </div>
      <div className="e-compass-strip">
        {cells.map((color, index) => (
          <span key={index} style={{ background: color }} />
        ))}
        {markers.map(({ key, ...marker }) => (
          <Marker key={key} {...marker} />
        ))}
      </div>
    </div>
  );
}

export function PoliticalCompassSection({ position, category, moralAxis }: PoliticalCompassSectionProps) {
  const { right, authoritarian, traditional } = position;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { spectrum, centerSideKey, centerLabel, markerColor, social, stripCells, socialColor, noteHint, region } = compassView(
    position,
    category,
    moralAxis
  );

  return (
    <section
      {...{ ...clickableProps(t.compassInfo.aria, () => setIsInfoOpen(true)), className: 'e-panel e-compass e-clickable' }}
      id="bussola"
      data-reveal
    >
      <h2>{t.compassTitle}</h2>

      <div className="e-compass-body">
        <CompassChart
          ariaLabel={t.compassAria(Math.round(right), Math.round(authoritarian), Math.round(traditional))}
          markers={[{ key: 'you', left: right, top: 100 - authoritarian, color: markerColor }]}
        />

        <div className="e-compass-read">
          <p className="e-compass-sentence">
            {centerSideKey ? (
              <>
                <span className="e-compass-spectrum" style={{ color: ideologyColorByKey(centerSideKey).base }}>
                  {centerLabel}
                </span>{' '}
                <span className="e-compass-conn">{t.compassWith}</span>{' '}
              </>
            ) : (
              <>
                <span className="e-compass-spectrum" style={{ color: spectrum.base }}>
                  {t.compassSpectrumLabels[spectrum.key]}
                </span>{' '}
                <span className="e-compass-conn">{t.compassWith}</span>{' '}
              </>
            )}
            <mark className="e-compass-mark" style={{ background: socialColor }}>
              {t.compassSocialLabels[social]}
            </mark>
            {t.compassSocialValues && (
              <>
                {' '}
                <span className="e-compass-conn">{t.compassSocialValues}</span>
              </>
            )}
          </p>

          <SocialStrip cells={stripCells} markers={[{ key: 'you', left: traditional, color: socialColor }]} />
        </div>
      </div>

      {noteHint && (
        <aside
          className="e-compass-note"
          role="note"
          style={{ '--note-bg': spectrum.bg, '--note-ink': spectrum.base, '--dot': region.base } as CSSProperties}
        >
          <strong>
            <i aria-hidden="true" />
            {t.compassNote.label} {t.compassSpectrumLabels[region.key]}
          </strong>
          <span>{t.compassNote.hints[noteHint]}</span>
        </aside>
      )}

      {isInfoOpen && (
        <InfoSheet titleId="compass-info-title" className="e-compass-sheet" onClose={() => setIsInfoOpen(false)}>
          <p className="e-axis-sheet-label">{t.compassTitle}</p>
          <h3 id="compass-info-title">{t.compassInfo.title}</h3>
          <ul className="e-compass-how">
            {[
              { lead: t.compassInfo.authLead, text: t.compassInfo.authText },
              { lead: t.compassInfo.econLead, text: t.compassInfo.econText },
              { lead: t.compassInfo.socialLead, text: t.compassInfo.socialText }
            ].map((item) => (
              <li key={item.lead}>
                <strong>{item.lead}</strong> {item.text}
              </li>
            ))}
          </ul>
        </InfoSheet>
      )}
    </section>
  );
}
