import type { CSSProperties } from 'react';
import type { CandidateMatch } from '../types/quiz';

interface CandidateCompatibilityChartProps {
  matches: CandidateMatch[];
}

interface CompatibilityTone {
  /** Preenchimento da barra. */
  bar: string;
  /** Cor do número da porcentagem, legível sobre o fundo claro do cartão. */
  ink: string;
}

/**
 * Faixas de compatibilidade definidas no design das eleições 2026.
 * Avaliadas do maior para o menor: a primeira faixa satisfeita vence.
 */
const COMPATIBILITY_TONES: Array<{ min: number; tone: CompatibilityTone }> = [
  { min: 89, tone: { bar: '#00bf63', ink: '#00783e' } },
  { min: 79, tone: { bar: '#7ed957', ink: '#487a32' } },
  { min: 69, tone: { bar: '#c1ff72', ink: '#728a3d' } },
  { min: 59, tone: { bar: '#ffbd59', ink: '#b68945' } },
  { min: 49, tone: { bar: '#ff751f', ink: '#bf5b1d' } },
  { min: -Infinity, tone: { bar: '#ff3131', ink: '#a11f1f' } }
];

export function toneForCompatibility(compatibility: number): CompatibilityTone {
  return COMPATIBILITY_TONES.find((band) => compatibility >= band.min)!.tone;
}

export function CandidateCompatibilityChart({ matches }: CandidateCompatibilityChartProps) {
  if (!matches.length) return null;

  return (
    <ol className="compat-chart" aria-label="Compatibilidade com cada candidatura">
      {matches.map((match, position) => {
        // Arredondamos uma vez só: a largura da barra e o número exibido precisam
        // contar a mesma história (52.4 e 51.6 não podem virar "52%" com barras diferentes).
        const value = Math.round(clamp(match.compatibility));
        const tone = toneForCompatibility(value);
        const rowStyle = {
          ['--compat-bar']: tone.bar,
          ['--compat-ink']: tone.ink,
          ['--compat-pct']: `${value}%`,
          ['--compat-delay']: `${position * 90}ms`
        } as CSSProperties;

        return (
          <li className="compat-row" key={match.candidateId} style={rowStyle}>
            <div className="compat-identity">
              <span className="compat-portrait">
                <img src={match.imagePath} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="compat-name">{match.shortName || match.name}</span>
            </div>

            <div className="compat-meter">
              <div
                className="compat-track"
                role="img"
                aria-label={`${match.name}: ${value}% de compatibilidade`}
              >
                <span className="compat-fill" aria-hidden="true" />
              </div>
              <span className="compat-value" aria-hidden="true">{value}%</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
