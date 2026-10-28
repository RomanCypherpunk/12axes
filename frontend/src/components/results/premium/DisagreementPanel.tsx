import type { CSSProperties, ReactNode } from 'react';
import { t } from '../../../i18n';
import type { AxisResult, CountryMatch, Disagreement, PersonalityMatch } from '../../../types/quiz';
import { resolveCountryFlagSrc } from '../../../utils/countryFlags';
import { catStyle } from '../../../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../../../utils/personalityImage';
import { SafeImg } from '../../editorial/primitives';
import { P } from './premiumText';

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

interface Props {
  disagreements: Disagreement[];
  /** Resultado do usuário por eixo: os nomes dos polos para dizer de que lado cada um fica. */
  results: Map<string, AxisResult>;
  /** Países e personalidades do relatório: de onde vêm a bandeira e o retrato de cada perfil. */
  countries: CountryMatch[];
  personalities: PersonalityMatch[];
}

// A trilha tem o polo esquerdo na ponta esquerda; o valor vem como % do polo ESQUERDO, então a posição visual é o complemento.
const at = (leftPercent: number): number => clamp(100 - leftPercent);

// Porcentagem e nome do polo em que um valor (% do polo esquerdo) cai.
function sideOf(leftPercent: number, result: AxisResult | undefined): { pct: number; pole: string } {
  const left = leftPercent >= 50;
  return { pct: Math.max(leftPercent, 100 - leftPercent), pole: result ? (left ? result.leftPole : result.rightPole) : '' };
}

/**
 * Onde você mais discorda da ideologia, da personalidade e do país mais compatíveis. Cada perfil é uma linha de duas
 * colunas: à esquerda quem ele é (retrato, bandeira ou o nome da ideologia) e à direita os três eixos de maior diferença,
 * nos cartões de "O que te distingue".
 */
export function DisagreementPanel({ disagreements, results, countries, personalities }: Props) {
  const photoOf = (item: Disagreement): ReactNode => {
    if (item.kind === 'personality') {
      const match = personalities.find((candidate) => candidate.personalityId === item.profileId);
      return (
        <SafeImg
          className="e-prem-gap-photo"
          src={resolvePersonalityImageSrc(match?.imagePath)}
          alt={t.portraitAlt(item.profileName)}
          fallback={personalityInitials(item.profileName)}
        />
      );
    }
    if (item.kind === 'country') {
      const match = countries.find((candidate) => candidate.countryId === item.profileId);
      return <SafeImg className="e-prem-gap-photo" src={resolveCountryFlagSrc(match?.flagPath)} alt={item.profileName} fallback={t.flagUnavailable} />;
    }
    return null;
  };

  return (
    <section className="e-panel e-prem" id="premium-discorda" data-reveal>
      <div className="e-sec-head">
        <h2 className="e-sec-title">{P.disagreeTitle}</h2>
        <p className="e-mleg" aria-hidden="true">
          <span>
            <i className="e-k-m" />
            {P.disagreeLegendProfile}
          </span>
          <span>
            <i className="e-k-y" />
            {P.positions.you}
          </span>
        </p>
      </div>

      {disagreements.map((item) => {
        const photo = photoOf(item);
        const axis = item.axes[0];
        const result = results.get(axis.axisId);
        const you = at(axis.userLeftPercent);
        const profile = at(axis.profileLeftPercent);
        const youSide = sideOf(axis.userLeftPercent, result);
        const profileSide = sideOf(axis.profileLeftPercent, result);
        return (
        <div key={item.kind} className="e-prem-gap-group" style={catStyle(item.ideologyCategory) as CSSProperties}>
          <aside className={photo ? 'e-prem-gap-who has-photo' : 'e-prem-gap-who'}>
            {photo}
            <span className="e-tag e-tag-white">{P.disagreeKinds[item.kind]}</span>
            <div className="e-prem-gap-name">
              <strong>{item.profileName}</strong>
            </div>
          </aside>

          <article className="e-dcard e-strong e-prem-gap-card">
            <div className="e-dcard-head">
              <span className="e-tag e-tag-white">{P.gapRank(1)}</span>
              <h3>{axis.label}</h3>
            </div>
            <div className="e-dcard-body">
              <p className="e-big">
                {Math.round(Math.abs(axis.difference))}
                <small>pts</small>
              </p>
              <p className="e-cap">{P.disagreeCaption(youSide.pct, youSide.pole, item.profileName, profileSide.pct, profileSide.pole)}</p>
            </div>
            <div className="e-mbar" aria-hidden="true">
              <span className="e-mtrack" />
              <span className="e-mfill" style={{ left: `${Math.min(profile, you)}%`, width: `${Math.abs(you - profile)}%` }} />
              <span className="e-mmed" style={{ left: `${profile}%` }} />
              <span className="e-myou e-strong" style={{ left: `${you}%` }} />
            </div>
            {result && (
              <div className="e-mlab">
                <span>{result.leftPole}</span>
                <span>{result.rightPole}</span>
              </div>
            )}
          </article>
        </div>
        );
      })}
    </section>
  );
}
