import type { CSSProperties } from 'react';
import { t } from '../../../i18n';
import type { Axis, AxisAnalysis, AxisResult, CountryMatch, Disagreement, PersonalityMatch } from '../../../types/quiz';
import { resolveCountryFlagSrc } from '../../../utils/countryFlags';
import { catStyle, resolveIdeologyColor } from '../../../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../../../utils/personalityImage';
import { PoleIcon } from '../../AxisIcon';
import { profileColor } from '../../compare/axisTags';
import { SafeImg } from '../../editorial/primitives';
import { P } from './premiumText';

interface Props {
  analysis: AxisAnalysis[];
  axes: Axis[];
  results: Map<string, AxisResult>;
  /** Traz o nome e a imagem da ideologia, da personalidade e do país mais compatíveis (as etiquetas da barra). */
  disagreements: Disagreement[];
  /** Países e personalidades do relatório: de onde vêm a bandeira e o retrato das marcas. */
  countries: CountryMatch[];
  personalities: PersonalityMatch[];
}

// Toda cor é a do espectro político (categoria) da ideologia mais próxima de cada um: de você, da ideologia, da personalidade e do país.
const colorOf = (category: string | undefined): string => resolveIdeologyColor(category ?? '').base;

const profileOf = (disagreements: Disagreement[], kind: Disagreement['kind']) => disagreements.find((item) => item.kind === kind);

// Posição na trilha: o polo esquerdo fica à esquerda, e quanto maior o % do polo esquerdo, mais perto dele.
const at = (leftPercent: number): CSSProperties => ({ left: `${100 - leftPercent}%` });

export function AxisAnalysisPanel({ analysis, axes, results, disagreements, countries, personalities }: Props) {
  const ideology = profileOf(disagreements, 'ideology');
  const personality = profileOf(disagreements, 'personality');
  const country = profileOf(disagreements, 'country');
  const axisById = new Map(axes.map((axis) => [axis.id, axis]));

  // "Você" e "Ideologia" têm a cor da categoria da ideologia mais próxima de você; a personalidade e o país, a da ideologia mais próxima deles.
  const youColor = colorOf(ideology?.ideologyCategory);
  const ideologyColor = youColor;
  const cardStyle = catStyle(ideology?.ideologyCategory ?? '');
  const personalityColor = colorOf(personality?.ideologyCategory);
  const countryColor = colorOf(country?.ideologyCategory);

  // O retrato e a bandeira vêm das listas do relatório, achadas pelo id do perfil.
  const personalityMatch = personality && personalities.find((match) => match.personalityId === personality.profileId);
  const countryMatch = country && countries.find((match) => match.countryId === country.profileId);

  const personalityFace = personality && (
    <SafeImg
      className="e-close-face"
      src={resolvePersonalityImageSrc(personalityMatch?.imagePath)}
      alt={personality.profileName}
      fallback={personalityInitials(personality.profileName)}
    />
  );
  const countryFace = country && (
    <SafeImg className="e-close-face" src={resolveCountryFlagSrc(countryMatch?.flagPath)} alt={country.profileName} fallback={t.flagUnavailable} />
  );

  return (
    <section className="e-panel e-prem" id="premium-eixos" data-reveal>
      <h2>{P.axisTitle}</h2>

      <ol className="e-cp-axes e-prem-axes">
        {analysis.map((item) => {
          const axis = axisById.get(item.axisId);
          const result = results.get(item.axisId);
          if (!axis) return null;
          const readings = [
            `${P.positions.you} ${Math.round(item.userLeftPercent)}%`,
            item.personalityLeftPercent !== null && personality ? `${personality.profileName} ${Math.round(item.personalityLeftPercent)}%` : null,
            item.countryLeftPercent !== null && country ? `${country.profileName} ${Math.round(item.countryLeftPercent)}%` : null
          ].filter(Boolean);

          return (
            <li key={item.axisId} className="e-cp-axis e-prem-axis" style={{ ...cardStyle, '--al': axis.leftColor, '--ar': axis.rightColor } as CSSProperties}>
              <div className="e-axis-row-head e-prem-axis-head">
                <h3>{axis.label}</h3>
                <p className="e-prem-level">
                  {result && item.side !== 'balanced' ? `${result.dominantPole} · ` : ''}
                  {P.levelLabels[item.level]}
                </p>
              </div>

              <div
                className={`e-cp-track e-prem-track${item.side === 'left' ? ' is-fade-right' : item.side === 'right' ? ' is-fade-left' : ''}`}
                role="img" aria-label={`${axis.label}: ${readings.join(', ')}`}>
                <span className="e-amid" />
                {item.countryLeftPercent !== null && country && (
                  <span
                    className="e-cp-pin"
                    tabIndex={0}
                    data-tip={`${country.profileName} · ${Math.round(Math.max(item.countryLeftPercent, 100 - item.countryLeftPercent))}%`}
                    style={{ ...profileColor(countryColor), ...at(item.countryLeftPercent), zIndex: 3 }}
                  >
                    {countryFace}
                  </span>
                )}
                {item.personalityLeftPercent !== null && personality && (
                  <span
                    className="e-cp-pin"
                    tabIndex={0}
                    data-tip={`${personality.profileName} · ${Math.round(Math.max(item.personalityLeftPercent, 100 - item.personalityLeftPercent))}%`}
                    style={{ ...profileColor(personalityColor), ...at(item.personalityLeftPercent), zIndex: 4 }}
                  >
                    {personalityFace}
                  </span>
                )}
                <span
                  className="e-cp-pin e-cp-tag"
                  tabIndex={0}
                  data-tip={`${P.positions.you} · ${Math.round(Math.max(item.userLeftPercent, 100 - item.userLeftPercent))}%`}
                  style={{ ...profileColor(youColor), ...at(item.userLeftPercent), zIndex: 5 }}
                >
                  {P.positions.you}
                </span>
              </div>

              <div className="e-axis-poles">
                <div className={item.side === 'left' ? 'e-pole e-left e-win' : 'e-pole e-left'}>
                  <PoleIcon axisId={axis.id} side="left" className="e-ico" />
                  <b>{axis.leftPole}</b>
                </div>
                <div className={item.side === 'right' ? 'e-pole e-right e-win' : 'e-pole e-right'}>
                  <b>{axis.rightPole}</b>
                  <PoleIcon axisId={axis.id} side="right" className="e-ico" />
                </div>
              </div>

              {item.text && (
                <figure className="e-phrase">
                  <blockquote>{item.text}</blockquote>
                </figure>
              )}

              {item.impacts.length > 0 && (
                <details className="e-prem-impacts">
                  <summary>{P.impactsTitle}</summary>
                  <ul>
                    {item.impacts.map((impact) => (
                      <li key={impact.questionId}>
                        <span>{impact.question}</span>
                        <small>
                          {P.answerLabels[impact.answer]} · {P.points(impact.impact)}
                        </small>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
