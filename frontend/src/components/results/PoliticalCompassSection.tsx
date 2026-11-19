import { useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import { ideologyColorByKey, resolveIdeologyColor, type IdeologyColorKey } from '../../utils/ideologyColors';
import type { Axis } from '../../types/quiz';
import { compassRegion, economicLevel, socialLevel, type CompassPosition, type EconomicKey, type SocialKey } from '../../utils/politicalCompass';
import { COMPASS_COINS } from './compassCoins';
import { clickableProps, InfoSheet } from './InfoSheet';
import { DimRow } from './parts';
import { ValueCoin } from './ValueCoin';

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
const BLACK = [0, 0, 0] as const;
// Ponto da escala rosa, cinza e marrom de cada nível social (0 é a ponta progressista, 1 a tradicionalista).
const SOCIAL_AMOUNT: Record<SocialKey, number> = { veryProgressive: 0, progressive: 0.25, moderate: 0.5, traditional: 0.75, veryTraditional: 1 };
// Cor do retângulo econômico, na lógica do miolo da grade (verde, cinza, azul): as pontas são a Esquerda e a Direita,
// o meio é o Centro, e Centro-esquerda e Centro-direita ficam a meio caminho entre o Centro e a ponta.
const ECONOMIC_BLEND: Record<EconomicKey, [IdeologyColorKey, IdeologyColorKey, number]> = {
  left: ['esquerda', 'esquerda', 0],
  centerLeft: ['esquerda', 'centro', 0.5],
  center: ['centro', 'centro', 0],
  centerRight: ['centro', 'direita', 0.5],
  right: ['direita', 'direita', 0]
};

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
  /** O que aparece embaixo da seção (o botão de compartilhar o cartão de valores e bússola). */
  footer?: ReactNode;
}

/** Valores derivados da bússola (cores, frase e barra), compartilhados com o relatório em PDF. */
export function compassView(position: CompassPosition, category: string, moralAxis?: Axis) {
  const { traditional } = position;
  const spectrum = resolveIdeologyColor(category);
  const compassKey = compassRegion(position);
  // "X" da grade: quando a ideologia e a região da bússola divergem e uma delas é o Centro, a cor é a mistura
  // da base do Centro com a base da outra; nos demais casos vale a cor da categoria da página (--cat).
  const markerColor = centerMixColor(spectrum.key, compassKey);
  const progressive = hexToRgb(moralAxis?.leftColor ?? FALLBACK_PROGRESSIVE);
  const traditionalist = hexToRgb(moralAxis?.rightColor ?? FALLBACK_TRADITIONAL);
  // Cor cheia da escala progressista/tradicionalista: contorna o perfil em /compare.
  const socialColor = rgb(threeStop(progressive, NEUTRAL, traditionalist, traditional / 100));
  // Posição econômica (eixo esquerda-direita da grade), separada da categoria da ideologia (o espectro político).
  const economic = economicLevel(position.right);
  const [from, to, amount] = ECONOMIC_BLEND[economic];
  const blend = (pick: 'base' | 'bg') =>
    rgb(mix(hexToRgb(ideologyColorByKey(from)[pick]), hexToRgb(ideologyColorByKey(to)[pick]), amount));
  const economicColor = blend('base');
  const economicBg = blend('bg');
  // Retângulo social: o tom do nível na mesma escala da barra antiga, escurecido no texto e clareado no fundo.
  const social = socialLevel(traditional);
  const socialTone = threeStop(progressive, NEUTRAL, traditionalist, SOCIAL_AMOUNT[social]);
  const socialBase = rgb(mix(socialTone, BLACK, 0.3));
  const socialBg = rgb(mix(socialTone, WHITE, 0.82));
  return { spectrum, markerColor, socialColor, economic, economicColor, economicBg, social, socialBase, socialBg };
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

interface CompassTile {
  key: string;
  label: string;
  name: string;
  description: string;
  style: CSSProperties;
}

export function PoliticalCompassSection({ position, category, moralAxis, footer }: PoliticalCompassSectionProps) {
  const { right, authoritarian, traditional } = position;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedTile, setSelectedTile] = useState<CompassTile | null>(null);
  const { spectrum, markerColor, economic, economicColor, economicBg, social, socialBase, socialBg } = compassView(position, category, moralAxis);
  const tiles: CompassTile[] = [
    {
      key: `political:${spectrum.key}`,
      label: t.dimensionLabels.political,
      name: t.compassSpectrumLabels[spectrum.key],
      description: t.compassSpectrumDescriptions[spectrum.key],
      style: { '--cat': spectrum.base, '--cat-bg': spectrum.bg } as CSSProperties
    },
    {
      key: `economic:${economic}`,
      label: t.dimensionLabels.economic,
      name: t.compassEconomicLabels[economic],
      description: t.compassEconomicDescriptions[economic],
      style: { '--cat': economicColor, '--cat-bg': economicBg } as CSSProperties
    },
    {
      key: `social:${social}`,
      label: t.dimensionLabels.social,
      name: t.compassSocialLabels[social],
      description: t.compassSocialDescriptions[social],
      style: { '--cat': socialBase, '--cat-bg': socialBg } as CSSProperties
    }
  ];

  return (
    <section className="e-panel e-compass" id="bussola" data-reveal>
      <h2>{t.compassTitle}</h2>

      <div className="e-compass-body">
        <div {...{ ...clickableProps(t.compassInfo.aria, () => setIsInfoOpen(true)), className: 'e-compass-hit e-clickable' }}>
          <CompassChart
            ariaLabel={t.compassAria(Math.round(right), Math.round(authoritarian), Math.round(traditional))}
            markers={[{ key: 'you', left: right, top: 100 - authoritarian, color: markerColor }]}
          />
        </div>

        <div className="e-compass-read">
          <ul className="e-dims e-values-grid e-compass-tiles">
            {tiles.map((tile) => (
              <DimRow
                key={tile.key}
                style={tile.style}
                open={{ label: t.valueInfoAria(tile.name), onOpen: () => setSelectedTile(tile) }}
                visual={<ValueCoin valueId="" name={tile.name} size={48} coin={COMPASS_COINS[tile.key]} />}
                label={tile.label}
                name={tile.name}
              >
                {null}
              </DimRow>
            ))}
          </ul>
        </div>
      </div>

      {footer}

      {selectedTile && (
        <InfoSheet titleId="compass-tile-title" style={selectedTile.style} onClose={() => setSelectedTile(null)}>
          <div className="e-value-sheet">
            <ValueCoin valueId="" name={selectedTile.name} size={120} coin={COMPASS_COINS[selectedTile.key]} />
            <span className="e-dim">{selectedTile.label}</span>
            <h3 id="compass-tile-title">{selectedTile.name}</h3>
            <p>{selectedTile.description}</p>
          </div>
        </InfoSheet>
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
