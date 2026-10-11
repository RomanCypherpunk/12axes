import { useState } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, DimensionMatch, PersonalityMatch, PersonalityRepresentation } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { SafeImg } from '../editorial/primitives';
import { Closeness } from './Closeness';
import { InfoSheet } from './InfoSheet';
import { DimList, FarList, MatchHero } from './parts';
import { SheetMatch } from './SheetMatch';

interface PersonalitiesSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  top: PersonalityMatch;
  dimensions: DimensionMatch[];
  distant: PersonalityMatch[];
  representation: PersonalityRepresentation;
  isSwitching: boolean;
  onRepresentationChange: (representation: PersonalityRepresentation) => void;
}

export function Portrait({ match, className }: { match: PersonalityMatch; className: string }) {
  return (
    <SafeImg
      className={className}
      src={resolvePersonalityImageSrc(match.imagePath)}
      alt={t.portraitAlt(match.name)}
      fallback={personalityInitials(match.name)}
    />
  );
}

export function PersonalitiesSection({
  top,
  dimensions,
  distant,
  axes,
  results,
  representation,
  isSwitching,
  onRepresentationChange
}: PersonalitiesSectionProps) {
  const [info, setInfo] = useState<PersonalityMatch | null>(null);

  return (
    <section className="e-panel" id="personalidades" data-reveal>
      <div className="e-personality-heading">
        <div>
          <h2>{t.personalitiesSectionTitle}</h2>
          <p className="e-personality-pool-note">{t.personalityPoolNote}</p>
        </div>
        <div className="e-personality-pool" role="group" aria-label={t.personalityPoolLabel}>
          <button
            type="button"
            className={representation === 'male' ? 'is-active' : undefined}
            aria-pressed={representation === 'male'}
            disabled={isSwitching}
            onClick={() => onRepresentationChange('male')}
          >
            {t.personalityPoolMen}
          </button>
          <button
            type="button"
            className={representation === 'female' ? 'is-active' : undefined}
            aria-pressed={representation === 'female'}
            disabled={isSwitching}
            onClick={() => onRepresentationChange('female')}
          >
            {isSwitching && representation !== 'female'
              ? t.personalityPoolLoading
              : t.personalityPoolWomen}
          </button>
        </div>
      </div>

      <MatchHero
        visual={<Portrait match={top} className="e-portrait" />}
        compatibility={top.compatibility}
        name={top.name}
        tags={[top.role, top.lifespan].filter(Boolean)}
        description={top.description}
      />

      <DimList
        items={dimensions.map(({ dimension, match }) => ({
          key: dimension,
          visual: <Portrait match={match} className="e-avatar" />,
          label: t.dimensionLabels[dimension],
          name: match.name,
          caption: match.role,
          compatibility: match.compatibility,
          infoLabel: t.personalityInfoAria(match.name),
          onInfo: () => setInfo(match)
        }))}
      />

      <FarList
        title={t.personalitiesDistantTitle}
        items={distant.map((match) => ({
          key: match.personalityId,
          name: match.name,
          caption: match.role
        }))}
      />
      {info && <PersonalityInfoSheet match={info} axes={axes} results={results} onClose={() => setInfo(null)} />}
    </section>
  );
}

// Detalhe completo de uma personalidade: todos os metadados exibíveis do catálogo.
export function PersonalityInfoSheet({ match, axes, results, onClose }: {
  match: PersonalityMatch;
  axes: Axis[];
  results: Map<string, AxisResult>;
  onClose: () => void;
}) {
  return (
    <InfoSheet titleId="e-person-sheet-title" onClose={onClose}>
      <div className="e-person-sheet-head">
        <Portrait match={match} className="e-avatar" />
        <div>
          <span className="e-tag e-tag-neutral">{t.personalityCategories[match.category]}</span>
          <h3 id="e-person-sheet-title">{match.name}</h3>
          <p className="e-axis-sheet-label">{[match.role, match.lifespan].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
      <SheetMatch compatibility={match.compatibility} />
      <p className="e-axis-sheet-text">{match.description}</p>
      <Closeness
        vector={match.vector}
        name={match.name}
        face={<Portrait match={match} className="e-close-face" />}
        axes={axes}
        results={results}
      />
    </InfoSheet>
  );
}
