import { useState } from 'react';
import { t } from '../../i18n';
import type { DimensionMatch, PersonalityMatch } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { SafeImg } from '../editorial/primitives';
import { InfoSheet } from './InfoSheet';
import { DimList, FarList, MatchHero } from './parts';

interface PersonalitiesSectionProps {
  top: PersonalityMatch;
  dimensions: DimensionMatch[];
  distant: PersonalityMatch[];
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

export function PersonalitiesSection({ top, dimensions, distant }: PersonalitiesSectionProps) {
  const [info, setInfo] = useState<PersonalityMatch | null>(null);

  return (
    <section className="e-panel" id="personalidades" data-reveal>
      <h2>{t.personalitiesSectionTitle}</h2>

      <MatchHero
        visual={<Portrait match={top} className="e-portrait" />}
        kicker={t.personalityKicker}
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
          caption: match.role,
          compatibility: match.compatibility
        }))}
      />
      {info && <PersonalityInfoSheet match={info} onClose={() => setInfo(null)} />}
    </section>
  );
}

// Detalhe completo de uma personalidade: todos os metadados exibíveis do catálogo.
export function PersonalityInfoSheet({ match, onClose }: { match: PersonalityMatch; onClose: () => void }) {
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
      <p className="e-person-sheet-pct">
        <strong>{Math.round(match.compatibility)}%</strong> {t.matchWord}
      </p>
      <p className="e-axis-sheet-text">{match.description}</p>
    </InfoSheet>
  );
}
