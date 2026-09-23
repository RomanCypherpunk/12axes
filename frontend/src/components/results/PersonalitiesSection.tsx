import { t } from '../../i18n';
import type { DimensionMatch, PersonalityMatch } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { SafeImg } from '../editorial/primitives';
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
          compatibility: match.compatibility
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
    </section>
  );
}
