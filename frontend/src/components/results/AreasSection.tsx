import { useState } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, PersonalityMatch } from '../../types/quiz';
import { CountUpValue } from './CountUpValue';
import { InfoButton } from './InfoSheet';
import { PersonalityInfoSheet, Portrait } from './PersonalitiesSection';
import { Tabs } from './parts';

interface AreasSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  generalMatches: PersonalityMatch[];
  areaMatches: PersonalityMatch[];
}

export function AreasSection({ generalMatches, areaMatches, axes, results }: AreasSectionProps) {
  const [tab, setTab] = useState<'general' | 'area'>('general');
  const [info, setInfo] = useState<PersonalityMatch | null>(null);
  const matches = tab === 'general' ? generalMatches : areaMatches;

  if (generalMatches.length === 0 && areaMatches.length === 0) {
    return null;
  }

  return (
    <section className="e-panel" id="areas" data-reveal>
      <h2>{tab === 'general' ? t.areasGeneralTitle : t.areasSectionTitle}</h2>
      <Tabs
        label={t.areasTabsAria}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'general', label: t.areasGeneralTab },
          { value: 'area', label: t.areasByAreaTab }
        ]}
      />
      <ol className="e-rank">
        {matches.map((match, index) => (
          <li className="e-rk" key={match.personalityId}>
            <span className="e-rk-n">{String(index + 1).padStart(2, '0')}</span>
            <Portrait match={match} className="e-rk-av" />
            <div className="e-rk-i">
              <b>{match.name}</b>
              <small>{t.personalityCategories[match.category]}</small>
              <div className="e-bar">
                <i style={{ width: `${Math.max(0, Math.min(100, match.compatibility))}%` }} />
              </div>
            </div>
            <span className="e-pctc">
              <CountUpValue value={match.compatibility} decimals={0} />
            </span>
            <InfoButton
              className="e-axis-info"
              label={t.personalityInfoAria(match.name)}
              onClick={() => setInfo(match)}
            />
          </li>
        ))}
      </ol>
      {info && <PersonalityInfoSheet match={info} axes={axes} results={results} onClose={() => setInfo(null)} />}
    </section>
  );
}
