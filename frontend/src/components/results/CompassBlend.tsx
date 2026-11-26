import type { CSSProperties } from 'react';
import { COMPASS_CELLS, compassBlendCells } from '../../utils/compassQuadrants';

/** Quadradinhos em degradê da bússola, por cima dos quadrantes e por baixo das linhas: a página, o PDF e o cartão usam este mesmo desenho. */
export function CompassBlend({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox={`0 0 ${COMPASS_CELLS} ${COMPASS_CELLS}`} preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
      {compassBlendCells().map(({ column, row, color }) => (
        <rect key={`${column}-${row}`} x={column} y={row} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}
