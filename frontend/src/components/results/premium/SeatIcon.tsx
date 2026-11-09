import type { GovernmentSeat } from '../../../types/quiz';
import { SEAT_ICONS } from '../../../utils/governmentSeatIcons';

/** O ícone do cargo (o mesmo do cartão de compartilhamento), na cor do texto ao redor. */
export function SeatIcon({ seatKey }: { seatKey: GovernmentSeat['seatKey'] }) {
  const icon = SEAT_ICONS[seatKey];
  return (
    <svg className="e-gov-gicon" viewBox={icon.viewBox} aria-hidden="true" focusable="false">
      {icon.paths.map((path) => (
        <path key={path.d.slice(0, 24)} d={path.d} fill="currentColor" fillRule={path.evenodd ? 'evenodd' : undefined} clipRule={path.evenodd ? 'evenodd' : undefined} />
      ))}
    </svg>
  );
}
