import { useState, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, DimensionMatch, PersonalityMatch, ProfileDimension } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { SafeImg } from '../editorial/primitives';
import { DimList, FarList, MatchHero, type DimItem, type FarItem } from './parts';
import { ProfileSheet } from './ProfileSheet';

interface PersonalitiesSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  top: PersonalityMatch;
  dimensions: DimensionMatch[];
  distant: PersonalityMatch[];
  /** Para reusar a seção fora dos resultados (página de comparação entre pessoas). */
  title?: string;
  id?: string;
  header?: ReactNode;
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

/** Card da personalidade mais compatível. */
export function PersonalityHero({ match }: { match: PersonalityMatch }) {
  return (
    <MatchHero
      visual={<Portrait match={match} className="e-portrait" />}
      compatibility={match.compatibility}
      name={match.name}
      tags={[match.role, match.lifespan].filter(Boolean)}
      description={match.description}
    />
  );
}

export function personalityDimItems(dimensions: DimensionMatch[], onInfo?: (match: PersonalityMatch, dimension: ProfileDimension) => void): DimItem[] {
  return dimensions.map(({ dimension, match }) => ({
    key: dimension,
    visual: <Portrait match={match} className="e-avatar" />,
    label: t.dimensionLabels[dimension],
    name: match.name,
    caption: match.role,
    compatibility: match.compatibility,
    infoLabel: t.personalityInfoAria(match.name),
    onInfo: onInfo && (() => onInfo(match, dimension))
  }));
}

export function personalityFarItems(distant: PersonalityMatch[]): FarItem[] {
  return distant.map((match) => ({ key: match.personalityId, name: match.name, caption: match.role }));
}

export function PersonalitiesSection({ top, dimensions, distant, axes, results, title, id, header }: PersonalitiesSectionProps) {
  const [info, setInfo] = useState<PersonalityMatch | null>(null);

  return (
    <section className="e-panel" id={id ?? 'personalidades'} data-reveal>
      <h2>{title ?? t.personalitiesSectionTitle}</h2>
      {header}

      <PersonalityHero match={top} />

      <DimList items={personalityDimItems(dimensions, setInfo)} />

      <FarList title={t.personalitiesDistantTitle} items={personalityFarItems(distant)} />
      {info && <PersonalityInfoSheet match={info} onClose={() => setInfo(null)} />}
    </section>
  );
}

/** Ficha de uma personalidade: quem é, em poucas linhas. */
export function PersonalityInfoSheet({ match, onClose }: { match: PersonalityMatch; onClose: () => void }) {
  return (
    <ProfileSheet
      titleId="e-person-sheet-title"
      visual={<Portrait match={match} className="e-sheet-face" />}
      label={t.personalityCategories[match.category]}
      name={match.name}
      caption={[match.role, match.lifespan].filter(Boolean).join(' · ')}
      description={match.description}
      onClose={onClose}
    />
  );
}
