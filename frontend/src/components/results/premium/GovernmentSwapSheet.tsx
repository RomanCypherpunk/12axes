import type { CSSProperties } from 'react';
import { t } from '../../../i18n';
import type { GovernmentSeat, PersonalityMatch } from '../../../types/quiz';
import { catStyle } from '../../../utils/ideologyColors';
import { InfoSheet } from '../InfoSheet';
import { Portrait } from '../PersonalitiesSection';
import { P } from './premiumText';

interface Props {
  seat: GovernmentSeat;
  /** As opções já filtradas (sem a atual e sem quem ocupa outra cadeira). */
  options: PersonalityMatch[];
  /** O cargo está ocupado por uma escolha do usuário, não pela sugestão. */
  swapped: boolean;
  category: string;
  onPick: (personalityId: string) => void;
  onReset: () => void;
  onClose: () => void;
}

const pct = (match: PersonalityMatch) => Math.round(match.compatibility);

/** Escolher outra figura da mesma categoria para um cargo do governo ideal. */
export function GovernmentSwapSheet({ seat, options, swapped, category, onPick, onReset, onClose }: Props) {
  const seatName = P.seats[seat.seatKey];
  const categoryName = t.personalityCategories[seat.category as keyof typeof t.personalityCategories] ?? seat.category;
  return (
    <InfoSheet titleId="government-swap-title" className="e-gov-swap-sheet" style={catStyle(category) as CSSProperties} onClose={onClose}>
      <div className="e-gov-swap-body">
        <h3 id="government-swap-title">{P.governmentSwap.title(seatName)}</h3>
        <p className="e-gov-swap-lead">{P.governmentSwap.lead(categoryName)}</p>

        <div className="e-gov-swap-current">
          <Portrait match={seat.holder} className="e-gov-swap-face" />
          <span>
            <small>{swapped ? P.governmentSwap.swapped : P.governmentSwap.current}</small>
            <b>{seat.holder.name}</b>
            <em>
              {pct(seat.holder)}% {t.matchWord}
            </em>
          </span>
        </div>

        {options.length === 0 ? (
          <p className="e-gov-swap-none">{P.governmentSwap.none}</p>
        ) : (
          <ul className="e-gov-swap-list">
            {options.map((option) => (
              <li key={option.personalityId}>
                <button type="button" onClick={() => onPick(option.personalityId)}>
                  <Portrait match={option} className="e-gov-swap-face" />
                  <span>
                    <b>{option.name}</b>
                    <small>{[option.role, option.lifespan].filter(Boolean).join(' · ')}</small>
                  </span>
                  <em>
                    {pct(option)}% {t.matchWord}
                  </em>
                </button>
              </li>
            ))}
          </ul>
        )}

        {swapped && (
          <button type="button" className="e-btn e-btn-ghost e-btn-sm e-gov-swap-reset" onClick={onReset}>
            {P.governmentSwap.reset}
          </button>
        )}
      </div>
    </InfoSheet>
  );
}
