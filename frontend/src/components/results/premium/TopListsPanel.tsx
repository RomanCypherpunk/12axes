import { useState } from 'react';
import { t } from '../../../i18n';
import type { Axis, AxisResult, CountryMatch } from '../../../types/quiz';
import { resolveCountryFlagSrc } from '../../../utils/countryFlags';
import { SafeImg } from '../../editorial/primitives';
import { CountUpValue } from '../CountUpValue';
import { CountryInfoSheet, flagAlt } from '../CountriesSection';
import { clickableProps } from '../InfoSheet';
import { P } from './premiumText';

interface TopCountriesProps {
  countries: CountryMatch[];
  axes: Axis[];
  results: Map<string, AxisResult>;
}

/** Mesma lista dos mais próximos de "Personalidades": posição, bandeira, nome, barra, porcentagem e o botão de detalhes. */
export function TopCountriesPanel({ countries, axes, results }: TopCountriesProps) {
  const [info, setInfo] = useState<CountryMatch | null>(null);
  return (
    <section className="e-panel e-prem" id="premium-paises" data-reveal>
      <h2>{P.countriesTitle}</h2>
      <ol className="e-rank">
        {countries.map((country, index) => (
          <li key={country.countryId} {...{ ...clickableProps(t.personalityInfoAria(country.name), () => setInfo(country)), className: 'e-rk e-clickable' }}>
            <span className="e-rk-n">{String(index + 1).padStart(2, '0')}</span>
            <SafeImg className="e-rk-flag" src={resolveCountryFlagSrc(country.flagPath)} alt={flagAlt(country)} fallback={t.flagUnavailable} />
            <div className="e-rk-i">
              <b>{country.name}</b>
              {country.historical && <small>{P.historical}</small>}
              <div className="e-bar">
                <i style={{ width: `${Math.max(0, Math.min(100, country.compatibility))}%` }} />
              </div>
            </div>
            <span className="e-pctc">
              <CountUpValue value={country.compatibility} decimals={0} />
            </span>
          </li>
        ))}
      </ol>
      {info && <CountryInfoSheet match={info} onClose={() => setInfo(null)} />}
    </section>
  );
}
