import { useState, type CSSProperties } from 'react';
import { t } from '../../i18n';
import { ideologyColorByKey, resolveIdeologyColor, type IdeologyColorKey } from '../../utils/ideologyColors';
import type { Axis } from '../../types/quiz';
import { centerSide, compassRegion, socialLevel, type CompassPosition } from '../../utils/politicalCompass';
import { InfoButton, InfoSheet } from './InfoSheet';

// A grade é um mapa de regiões: cada categoria do espectro ancora o seu pastel no centro do bloco que
// ocupa (colunas e linhas contadas de 0) e as cores se misturam suavemente entre os blocos.
const ANCHORS: { key: IdeologyColorKey; column: number; row: number }[] = [
  { key: 'esq-radical', column: 1, row: 1 },
  { key: 'terceira', column: 4, row: 1 },
  { key: 'ext-direita', column: 7, row: 1 },
  { key: 'esquerda', column: 1, row: 4.5 },
  { key: 'centro', column: 4, row: 4.5 },
  { key: 'direita', column: 7, row: 4.5 },
  { key: 'anarquismo', column: 1.5, row: 7.5 },
  { key: 'libertario', column: 6.5, row: 7.5 }
];
// Alcance da mistura, em células: quanto maior, mais suave (e menos nítido cada bloco).
const BLEND_SPREAD = 1.7;
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
  anarquismo: { saturation: 0, lightness: 76 },
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

function regionColor(column: number, row: number): string {
  let total = 0;
  const sum = [0, 0, 0];
  for (const anchor of ANCHORS) {
    const distance2 = (column - anchor.column) ** 2 + (row - anchor.row) ** 2;
    const weight = Math.exp(-distance2 / (2 * BLEND_SPREAD ** 2));
    const color = vividColor(anchor.key);
    total += weight;
    color.forEach((value, index) => {
      sum[index] += value * weight;
    });
  }
  return rgb(sum.map((value) => value / total));
}

const GRID_CELLS: string[] = Array.from({ length: SIZE * SIZE }, (_, index) => {
  const column = index % SIZE;
  const row = Math.floor(index / SIZE);
  return regionColor(column, row);
});

// Mantém o marcador inteiro dentro da grade mesmo nos extremos.
const clamp = (value: number): number => Math.max(4, Math.min(96, value));

function Marker({ left, top, color }: { left: number; top?: number; color?: string }) {
  const style: CSSProperties = { left: `${clamp(left)}%`, top: top === undefined ? '50%' : `${clamp(top)}%` };
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

export function PoliticalCompassSection({ position, category, moralAxis }: PoliticalCompassSectionProps) {
  const { right, authoritarian, traditional } = position;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
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
  // Barra em tom pastel (rosa, cinza, marrom); "X" e grifo na cor cheia da mesma escala.
  const stripCells = Array.from({ length: SIZE }, (_, index) =>
    rgb(
      threeStop(
        mix(progressive, WHITE, 0.72),
        mix(NEUTRAL, WHITE, 0.72),
        mix(traditionalist, WHITE, 0.72),
        index / (SIZE - 1)
      )
    )
  );
  const socialColor = rgb(threeStop(progressive, NEUTRAL, traditionalist, traditional / 100));

  return (
    <section className="e-panel e-compass" id="bussola" data-reveal>
      <InfoButton className="e-axis-info e-card-info" label={t.compassInfo.aria} onClick={() => setIsInfoOpen(true)} />
      <h2>{t.compassTitle}</h2>

      <div className="e-compass-body">
        <div
          className="e-compass-chart"
          role="img"
          aria-label={t.compassAria(Math.round(right), Math.round(authoritarian), Math.round(traditional))}
        >
          <span className="e-compass-lbl is-top">{t.compassAuthoritarian}</span>
          <span className="e-compass-lbl is-left">{t.compassLeft}</span>
          <div className="e-compass-grid">
            {GRID_CELLS.map((color, index) => (
              <span key={index} style={{ background: color }} />
            ))}
            <i className="e-compass-axis is-x" aria-hidden="true" />
            <i className="e-compass-axis is-y" aria-hidden="true" />
            <Marker left={right} top={100 - authoritarian} color={markerColor} />
          </div>
          <span className="e-compass-lbl is-right">{t.compassRight}</span>
          <span className="e-compass-lbl is-bottom">{t.compassLibertarian}</span>
        </div>

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

          <div className="e-compass-bar" aria-hidden="true">
            <div className="e-compass-bar-lbls">
              <span>{t.compassProgressive}</span>
              <span>{t.compassTraditionalist}</span>
            </div>
            <div className="e-compass-strip">
              {stripCells.map((color, index) => (
                <span key={index} style={{ background: color }} />
              ))}
              <Marker left={traditional} color={socialColor} />
            </div>
          </div>
        </div>
      </div>

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
