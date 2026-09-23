import { useState } from 'react';
import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';
import { CountUpValue } from './CountUpValue';
import { Portrait } from './PersonalitiesSection';
import { Tabs } from './parts';

interface AreasSectionProps {
  generalMatches: PersonalityMatch[];
  areaMatches: PersonalityMatch[];
}

export function AreasSection({ generalMatches, areaMatches }: AreasSectionProps) {
  const [tab, setTab] = useState<'general' | 'area'>('general');
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
      <ul className="e-near-grid">
        {matches.map((match) => (
          <li className="e-near" key={match.personalityId}>
            <Portrait match={match} className="" />
            <div>
              <span className="e-tag e-tag-neutral">{t.personalityCategories[match.category]}</span>
              <strong>{match.name}</strong>
              <small>{match.role}</small>
              <span className="e-pctc">
                <CountUpValue value={match.compatibility} decimals={0} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
