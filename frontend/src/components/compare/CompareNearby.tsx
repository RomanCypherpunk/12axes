import { useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { CompareProfile, CompareProfiles, CountryMatch, IdeologyMatch, PartyMatch } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { localCatStyle } from '../../utils/ideologyColors';
import { resolvePartyLogoSrc } from '../../utils/partyLogos';
import { Ring, SafeImg } from '../editorial/primitives';
import { ProfileFace } from '../results/CompareSection';
import { flagAlt } from '../results/CountriesSection';
import { profileColor } from './CompareAxes';
import { colorOf } from './profileColors';

/** Um cartão por perfil, lado a lado, cada um encabeçado pelo rosto de quem ele representa. */
function NearGrid({
  profiles,
  render,
  even = false
}: {
  profiles: CompareProfile[];
  render: (profile: CompareProfile) => ReactNode;
  /** Cartões de mesma altura (os de ideologia, que abrem, ficam cada um no seu tamanho). */
  even?: boolean;
}) {
  return (
    <ul className={even ? 'e-cp-near is-even' : 'e-cp-near'} style={{ '--cols': profiles.length } as CSSProperties}>
      {profiles.map((profile, index) => (
        <li key={`${profile.item.type}:${profile.item.id}`} className="e-cp-near-col" style={profileColor(colorOf(profile, index))}>
          <p className="e-cp-near-who">
            <span className="e-cmpp-ring">
              <ProfileFace item={profile.item} className="e-close-face" />
            </span>
            {t.comparePageNearestFor(profile.item.name)}
          </p>
          {render(profile)}
        </li>
      ))}
    </ul>
  );
}

// Mesmo cartão da página de resultados: cor da própria categoria e "Saber mais sobre…" que abre o texto longo.
function IdeologyCard({ match }: { match: IdeologyMatch | null | undefined }) {
  const [open, setOpen] = useState(false);
  if (!match) return null;
  return (
    <article className={open ? 'e-ocard e-cp-ideology is-open' : 'e-ocard e-cp-ideology'} style={localCatStyle(match.category) as CSSProperties}>
      <span className="e-tag e-osolid">{match.category}</span>
      <h3 className={match.name.length >= 18 ? 'e-long-name' : undefined}>{match.name}</h3>
      <div className="e-ocard-more">
        <p className="e-ocard-text">{match.longDescription || match.description}</p>
      </div>
      <button type="button" className="e-morebtn" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        {open ? t.showLess : t.knowMoreAbout(match.name)}
      </button>
    </article>
  );
}

/** Ideologia mais próxima do conjunto dos perfis e, abaixo, a mais próxima de cada um. */
export function CompareIdeologies({ profiles, common }: { profiles: CompareProfile[]; common: IdeologyMatch | null }) {
  return (
    <section className="e-panel" id="cmp-ideologia">
      <h2>{t.comparePageIdeologyTitle}</h2>
      {common && (
        <article className="e-cp-common" style={localCatStyle(common.category) as CSSProperties}>
          <div className="e-cp-common-text">
            <span className="e-tag e-osolid">{t.comparePageCommonLabel}</span>
            <h3 className={common.name.length >= 18 ? 'e-long-name' : undefined}>{common.name}</h3>
            <p>{common.category}</p>
            {common.description && (
              <details className="e-more">
                <summary>{t.knowMoreAbout(common.name)}</summary>
                <p>{common.longDescription || common.description}</p>
              </details>
            )}
          </div>
          <Ring pct={common.compatibility} size={104} stroke={7} />
        </article>
      )}
      <NearGrid profiles={profiles} render={(profile) => <IdeologyCard match={profile.nearest?.ideology} />} />
    </section>
  );
}

function MatchPill({ value }: { value: number }) {
  return (
    <span className="e-tag e-tag-cat e-cp-pill">
      {Math.round(value)}% {t.matchWord}
    </span>
  );
}

// Só o essencial: bandeira, nome (com o período, se for uma experiência histórica) e a compatibilidade.
function CountryCard({ match }: { match: CountryMatch | null | undefined }) {
  if (!match) return null;
  return (
    <article className="e-cp-card-near">
      <SafeImg className="e-cp-flag" src={resolveCountryFlagSrc(match.flagPath)} alt={flagAlt(match)} fallback={t.flagUnavailable} />
      <h3>{match.name}</h3>
      {match.historical && match.period && <p>{match.period}</p>}
      <MatchPill value={match.compatibility} />
    </article>
  );
}

export function CompareCountries({ profiles }: { profiles: CompareProfile[] }) {
  if (profiles.every((profile) => !profile.nearest?.country)) return null;
  return (
    <section className="e-panel" id="cmp-paises">
      <h2>{t.comparePageCountriesTitle}</h2>
      <NearGrid even profiles={profiles} render={(profile) => <CountryCard match={profile.nearest?.country} />} />
    </section>
  );
}

function PartyCard({ match }: { match: PartyMatch | null | undefined }) {
  if (!match) return null;
  return (
    <article className="e-cp-card-near">
      <div className="e-cp-logo-row">
        <SafeImg className="e-cp-logo" src={resolvePartyLogoSrc(match.logoPath)} alt={t.partyLogoAlt(match.name)} fallback={t.partyLogoUnavailable} />
        {match.countryFlagPath && (
          <SafeImg
            className="e-flagmini"
            src={resolveCountryFlagSrc(match.countryFlagPath)}
            alt={t.flagAlt(match.historical ? t.flagHistoricLabel : t.flagLabel, match.countryName)}
            fallback=""
          />
        )}
      </div>
      <h3>{match.name}</h3>
      {match.historical && match.period && <p>{match.period}</p>}
      <MatchPill value={match.compatibility} />
    </article>
  );
}

export function CompareParties({ profiles }: { profiles: CompareProfiles['profiles'] }) {
  if (profiles.every((profile) => !profile.nearest?.party)) return null;
  return (
    <section className="e-panel" id="cmp-partidos">
      <h2>{t.comparePagePartiesTitle}</h2>
      <NearGrid even profiles={profiles} render={(profile) => <PartyCard match={profile.nearest?.party} />} />
    </section>
  );
}
