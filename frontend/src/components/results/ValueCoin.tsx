import { FILLED_POLE_ICONS } from '../../data/filledPoleIcons';
import { religiousPoleIcon } from '../../data/religionIcons';
import type { Religion } from '../../utils/religion';
import { valueCoinMonogram } from '../../utils/politicalValues';
import { VALUE_COINS } from './valueCoins';

interface ValueCoinProps {
  valueId: string;
  name: string;
  size?: number;
  /** Religião escolhida pelo usuário: vira o ícone dos valores religiosos (padrão: a cruz do polo Religioso). */
  religion?: Religion | null;
}

// Cores da moeda: --cat é a cor da família da ideologia do usuário e --cat-bg o pastel dela (definidas no topo do
// resultado e do PDF). A borda é a mesma cor, escurecida. O cinza do Centro é o padrão fora de uma página de resultado.
const FILL = 'var(--cat, #4B5058)';
const BORDER = 'color-mix(in srgb, var(--cat, #4B5058) 55%, #000)';
const INK = 'var(--cat-bg, #DDE0E3)';

// Moeda redonda de um valor: cor da ideologia do usuário, borda fina e ícone preenchido. Sem ícone, mostra o monograma.
export function ValueCoin({ valueId, name, size = 112, religion }: ValueCoinProps) {
  const coin = VALUE_COINS[valueId];
  const faith = coin?.religious ? (religiousPoleIcon(religion) ?? FILLED_POLE_ICONS.religiao.right) : null;
  const icon = faith ? (
    <svg x="19" y="19" width="34" height="34" viewBox={faith.viewBox} style={{ fill: INK }}>
      {faith.paths.map((d) => (
        <path key={d} d={d} fillRule={faith.fillRule ?? 'evenodd'} clipRule={faith.fillRule ?? 'evenodd'} />
      ))}
    </svg>
  ) : coin?.glyph ? (
    <svg x="19" y="19" width="34" height="34" viewBox={coin.viewBox} style={{ fill: INK }}>
      {coin.glyph}
    </svg>
  ) : null;

  return (
    <svg className="e-vcoin" viewBox="0 0 72 72" width={size} height={size} aria-hidden="true" focusable="false">
      <circle cx="36" cy="36" r="34" style={{ fill: FILL, stroke: BORDER }} strokeWidth="2.5" />
      {icon ?? (
        <text x="36" y="43" textAnchor="middle" fontSize="22" fontWeight="700" style={{ fill: INK }}>
          {valueCoinMonogram(name)}
        </text>
      )}
    </svg>
  );
}
