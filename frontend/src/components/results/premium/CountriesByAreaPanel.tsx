import { useState, type ReactNode } from 'react';
import { t } from '../../../i18n';
import type { AreaCountryMatch, CountryMatch } from '../../../types/quiz';
import { resolveCountryFlagSrc } from '../../../utils/countryFlags';
import { SafeImg } from '../../editorial/primitives';
import { CountUpValue } from '../CountUpValue';
import { CountryInfoSheet, flagAlt } from '../CountriesSection';
import { DimRow } from '../parts';
import { P } from './premiumText';

/** O país atual mais próximo em cada área (sistema político, política externa...): uma linha por área, com a bandeira e a ficha do país. */
export function CountriesByAreaPanel({ areas, footer }: { areas: AreaCountryMatch[]; footer?: ReactNode }) {
  const [info, setInfo] = useState<CountryMatch | null>(null);
  if (areas.length === 0) return null;
  return (
    <section className="e-panel e-prem" id="premium-areas-paises" data-reveal>
      <h2>{P.areasTitle}</h2>
      <ul className="e-dims">
        {areas.map(({ area, country }) => (
          <DimRow
            key={area}
            open={{ label: t.personalityInfoAria(country.name), onOpen: () => setInfo(country) }}
            visual={<SafeImg className="e-flagimg" src={resolveCountryFlagSrc(country.flagPath)} alt={flagAlt(country)} fallback={t.flagUnavailable} />}
            label={P.areaLabels[area] ?? area}
            name={country.name}
          >
            <CountUpValue value={country.compatibility} decimals={0} />
          </DimRow>
        ))}
      </ul>
      {footer}
      {info && <CountryInfoSheet match={info} onClose={() => setInfo(null)} />}
    </section>
  );
}
