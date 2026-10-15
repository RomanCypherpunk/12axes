import { useState } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, PartyDimensionMatch, PartyMatch } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { resolvePartyLogoSrc } from '../../utils/partyLogos';
import { SafeImg } from '../editorial/primitives';
import { Closeness } from './Closeness';
import { InfoSheet } from './InfoSheet';
import { DimList, FarList, MatchHero, Tabs } from './parts';
import { SheetMatch } from './SheetMatch';

interface PartiesSectionProps {
  current?: PartyMatch | null;
  historical?: PartyMatch | null;
  top?: PartyMatch[];
  dimensions?: PartyDimensionMatch[];
  distant: PartyMatch[];
  axes?: Axis[];
  results?: Map<string, AxisResult>;
}

// Tipo · período (se histórico) · país associado, abaixo do nome.
function tags(match: PartyMatch): string[] {
  return [match.category, match.historical ? match.period : '', match.countryName].filter(Boolean);
}

// Logo oficial quadrado 1:1 do partido/organização, sobre fundo claro para qualquer símbolo escuro.
function Logo({ match, className }: { match: PartyMatch; className: string }) {
  return (
    <SafeImg
      className={className}
      src={resolvePartyLogoSrc(match.logoPath)}
      alt={t.partyLogoAlt(match.name)}
      fallback={t.partyLogoUnavailable}
    />
  );
}

export function PartiesSection({
  current,
  historical,
  top = [],
  dimensions = [],
  distant,
  axes,
  results
}: PartiesSectionProps) {
  const currentMatch = current ?? top.find((m) => !m.historical) ?? top[0] ?? null;
  const historicalMatch = historical ?? top.find((m) => m.historical) ?? null;
  const [tab, setTab] = useState<'current' | 'historical'>('current');
  const [info, setInfo] = useState<PartyMatch | null>(null);

  const shown = tab === 'current' ? (currentMatch ?? historicalMatch) : (historicalMatch ?? currentMatch);
  if (!shown) {
    return null;
  }

  return (
    <section className="e-panel" id="partidos" data-reveal>
      <h2>{t.partiesSectionTitle}</h2>

      {currentMatch && historicalMatch && (
        <Tabs
          label={t.partiesSectionTitle}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'current', label: t.partyCurrentTab },
            { value: 'historical', label: t.partyHistoricalTab }
          ]}
        />
      )}

      <MatchHero
        key={shown.partyId}
        visual={<Logo match={shown} className="e-logobig" />}
        compatibility={shown.compatibility}
        name={shown.name}
        tags={tags(shown)}
        description={shown.description}
        kickerPrefix={
          shown.countryFlagPath ? (
            <SafeImg
              className="e-flagmini"
              src={resolveCountryFlagSrc(shown.countryFlagPath)}
              alt={t.flagAlt(shown.historical ? t.flagHistoricLabel : t.flagLabel, shown.countryName)}
              fallback=""
            />
          ) : null
        }
      />

      <DimList
        items={dimensions.map(({ dimension, match }) => ({
          key: dimension,
          visual: (
            <div className="e-dim-visual">
              <Logo match={match} className="e-logoimg" />
              {match.countryFlagPath && (
                <SafeImg
                  className="e-flagmini"
                  src={resolveCountryFlagSrc(match.countryFlagPath)}
                  alt={t.flagAlt(match.historical ? t.flagHistoricLabel : t.flagLabel, match.countryName)}
                  fallback=""
                />
              )}
            </div>
          ),
          label: t.dimensionLabels[dimension],
          name: match.name,
          caption: tags(match).join(' · '),
          compatibility: match.compatibility,
          infoLabel: t.personalityInfoAria(match.name),
          onInfo: () => setInfo(match)
        }))}
      />

      <FarList
        title={t.partiesDistantTitle}
        items={distant.map((match) => ({
          key: match.partyId,
          name: match.name,
          caption: tags(match).join(' · ')
        }))}
      />
      {info && <PartyInfoSheet match={info} axes={axes} results={results} onClose={() => setInfo(null)} />}
    </section>
  );
}

function PartyInfoSheet({ match, axes, results, onClose }: {
  match: PartyMatch;
  axes?: Axis[];
  results?: Map<string, AxisResult>;
  onClose: () => void;
}) {
  return (
    <InfoSheet titleId="e-party-sheet-title" onClose={onClose}>
      <div className="e-person-sheet-head">
        <Logo match={match} className="e-logoimg" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            {match.countryFlagPath && (
              <SafeImg
                className="e-flagmini"
                src={resolveCountryFlagSrc(match.countryFlagPath)}
                alt={t.flagAlt(match.historical ? t.flagHistoricLabel : t.flagLabel, match.countryName)}
                fallback=""
              />
            )}
            <span className="e-tag e-tag-neutral">{match.category}</span>
          </div>
          <h3 id="e-party-sheet-title">{match.name}</h3>
          <p className="e-axis-sheet-label">{tags(match).join(' · ')}</p>
        </div>
      </div>
      <SheetMatch compatibility={match.compatibility} />
      <p className="e-axis-sheet-text">{match.description}</p>
      {axes && results && (
        <Closeness
          vector={match.vector}
          name={match.name}
          face={<Logo match={match} className="e-logoimg e-close-face" />}
          axes={axes}
          results={results}
        />
      )}
    </InfoSheet>
  );
}
