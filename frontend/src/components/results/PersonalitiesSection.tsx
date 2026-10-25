import { useState, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, DimensionMatch, PersonalityMatch, ProfileDimension } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { SafeImg } from '../editorial/primitives';
import { Closeness } from './Closeness';
import { InfoSheet } from './InfoSheet';
import { DimList, FarList, MatchHero, type DimItem, type FarItem } from './parts';
import { SheetMatch } from './SheetMatch';

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
