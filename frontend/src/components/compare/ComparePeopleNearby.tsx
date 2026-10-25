import { useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { CompareProfile, CountryMatch, PartyMatch, PersonalityMatch, ProfileDimension, QuizResult } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { resolvePartyLogoSrc } from '../../utils/partyLogos';
import { SafeImg } from '../editorial/primitives';
import { ProfileFace } from '../results/CompareSection';
import { CountryHero, countryDimItems, flagAlt } from '../results/CountriesSection';
import { InfoSheet } from '../results/InfoSheet';
import { PartyHero, partyDimItems } from '../results/PartiesSection';
import { PersonalityHero, Portrait, personalityDimItems } from '../results/PersonalitiesSection';
import { Tabs, type DimItem } from '../results/parts';
import { profileColor } from './CompareAxes';
import { colorOf } from './profileColors';

/** As duas pessoas de uma comparação, na ordem da tela: o perfil (rosto e cor) e o resultado de cada uma. */
export interface NearbyPeople {
  profiles: [CompareProfile, CompareProfile];
  results: [QuizResult, QuizResult];
}

type Tab = 'current' | 'historical';

/** O que o popup de um país, personalidade ou partido mostra: a imagem, quem é e uma descrição curta. */
interface Popup {
  visual: ReactNode;
  label: string;
  title: string;
  caption: string;
  description: string;
  color: string;
}

/** "Mais perto de Davi", com o rosto e a cor da pessoa, acima do que é dela. */
function Who({ profile, index }: { profile: CompareProfile; index: number }) {
  return (
    <p className="e-ppl-who" style={profileColor(colorOf(profile, index)) as CSSProperties}>
      <span className="e-cmpp-ring">
        <ProfileFace item={profile.item} className="e-close-face" />
      </span>
      {t.comparePageNearestFor(profile.item.name)}
    </p>
  );
}

interface PairProps {
  id: string;
  title: string;
  people: NearbyPeople;
  tabs?: ReactNode;
  hero: (index: number) => ReactNode;
  dims: (index: number) => DimItem[];
  popup: Popup | null;
  onClosePopup: () => void;
}

// O molde das três seções: o mais compatível de cada um lado a lado e, abaixo, um cartão por dimensão
// com uma linha por pessoa; clicar numa linha abre o popup dela.
function Pair({ id, title, people, tabs, hero, dims, popup, onClosePopup }: PairProps) {
  const indexes = [0, 1] as const;
  // Um cartão por dimensão (politicamente, socialmente, economicamente), com uma linha por pessoa.
  const lists = indexes.map((index) => dims(index));
  const dimensionCards = [...new Set(lists.flatMap((list) => list.map((item) => item.key)))].map((key) => {
    const items = lists.map((list) => list.find((item) => item.key === key));
    return { key, label: (items[0] ?? items[1])?.label ?? '', items };
  });
  return (
    <section className="e-panel" id={id} data-reveal>
      <h2>{title}</h2>
      {tabs}
      <div className="e-ppl-pair">
        {indexes.map((index) => (
          <div key={index} className="e-ppl-col">
            <Who profile={people.profiles[index]} index={index} />
            {hero(index)}
          </div>
        ))}
      </div>

      {dimensionCards.length > 0 && <p className="e-sub">{t.dimensionsTitleShort}</p>}
      <ul className="e-pv-grid e-ppl-dims">
        {dimensionCards.map(({ key, label, items }) => (
          <li key={key} className="e-pv-card">
            <span className="e-pv-cat">{label}</span>
            {indexes.map((index) => {
              const item = items[index];
              if (!item) return null;
              return (
                <button
                  key={index}
                  type="button"
                  className="e-pv-row e-ppl-dimrow"
                  style={profileColor(colorOf(people.profiles[index], index)) as CSSProperties}
                  aria-label={item.infoLabel}
                  onClick={item.onInfo}
                >
                  {item.visual}
                  <span>
                    <b>{people.profiles[index].item.name}</b>
                    <strong>{item.name}</strong>
                  </span>
                </button>
              );
            })}
          </li>
        ))}
      </ul>

      {popup && (
        <InfoSheet titleId="people-near-sheet-title" style={{ '--pc': popup.color } as CSSProperties} onClose={onClosePopup}>
          <div className="e-value-sheet">
            {popup.visual}
            <span className="e-dim">{popup.label}</span>
            <h3 id="people-near-sheet-title">{popup.title}</h3>
            {popup.caption && <p className="e-axis-sheet-label">{popup.caption}</p>}
            <p>{popup.description}</p>
          </div>
        </InfoSheet>
      )}
    </section>
  );
}

interface Opened<M> {
  match: M;
  index: number;
  dimension: ProfileDimension;
}

const popupLabel = (people: NearbyPeople, index: number, dimension: ProfileDimension): string =>
  `${t.dimensionLabels[dimension]} · ${people.profiles[index].item.name}`;

export function CountriesPair({ people, id, title }: { people: NearbyPeople; id: string; title: string }) {
  const [tab, setTab] = useState<Tab>('current');
  const [info, setInfo] = useState<Opened<CountryMatch> | null>(null);
  const shown = (index: number) => {
    const result = people.results[index];
    return tab === 'current' ? result.topCountryMatch : result.topHistoricalCountryMatch;
  };
  const open = (index: number) => (match: CountryMatch, dimension: ProfileDimension) => setInfo({ match, index, dimension });

  return (
    <Pair
      id={id}
      title={title}
      people={people}
      tabs={
        <Tabs
          label={title}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'current', label: t.countryCurrentTab },
            { value: 'historical', label: t.countryHistoricalTab }
          ]}
        />
      }
      hero={(index) => <CountryHero key={shown(index).countryId} match={shown(index)} />}
      dims={(index) => countryDimItems(people.results[index].countryDimensionMatches, open(index))}
      popup={
        info && {
          visual: <SafeImg className="e-ppl-flag-lg" src={resolveCountryFlagSrc(info.match.flagPath)} alt={flagAlt(info.match)} fallback={t.flagUnavailable} />,
          label: popupLabel(people, info.index, info.dimension),
          title: info.match.name,
          caption: info.match.historical && info.match.period ? info.match.period : info.match.category,
          description: info.match.description,
          color: colorOf(people.profiles[info.index], info.index)
        }
      }
      onClosePopup={() => setInfo(null)}
    />
  );
}

export function PersonalitiesPair({ people, id, title }: { people: NearbyPeople; id: string; title: string }) {
  const [info, setInfo] = useState<Opened<PersonalityMatch> | null>(null);
  const open = (index: number) => (match: PersonalityMatch, dimension: ProfileDimension) => setInfo({ match, index, dimension });

  return (
    <Pair
      id={id}
      title={title}
      people={people}
      hero={(index) => <PersonalityHero match={people.results[index].topPersonalityMatch} />}
      dims={(index) => personalityDimItems(people.results[index].dimensionMatches, open(index))}
      popup={
        info && {
          visual: <Portrait match={info.match} className="e-ppl-portrait-lg" />,
          label: popupLabel(people, info.index, info.dimension),
          title: info.match.name,
          caption: [info.match.role, info.match.lifespan].filter(Boolean).join(' · '),
          description: info.match.description,
          color: colorOf(people.profiles[info.index], info.index)
        }
      }
      onClosePopup={() => setInfo(null)}
    />
  );
}

const currentPartyOf = (result: QuizResult): PartyMatch | null =>
  result.topPartyMatch ?? result.topPartyMatches?.find((match) => !match.historical) ?? result.topPartyMatches?.[0] ?? null;
const historicalPartyOf = (result: QuizResult): PartyMatch | null =>
  result.topHistoricalPartyMatch ?? result.topPartyMatches?.find((match) => match.historical) ?? null;

/** Os partidos são opcionais no resultado: quem chama só monta esta seção quando alguma das duas pessoas tem um. */
export function PartiesPair({ people, id, title }: { people: NearbyPeople; id: string; title: string }) {
  const [tab, setTab] = useState<Tab>('current');
  const [info, setInfo] = useState<Opened<PartyMatch> | null>(null);

  // Mesma regra da seção dos resultados: se falta a aba escolhida, vale a outra.
  const shown = (index: number): PartyMatch | null => {
    const result = people.results[index];
    return tab === 'current'
      ? (currentPartyOf(result) ?? historicalPartyOf(result))
      : (historicalPartyOf(result) ?? currentPartyOf(result));
  };
  const hasBothTabs = people.results.some((result) => currentPartyOf(result) && historicalPartyOf(result));
  const open = (index: number) => (match: PartyMatch, dimension: ProfileDimension) => setInfo({ match, index, dimension });

  return (
    <Pair
      id={id}
      title={title}
      people={people}
      tabs={
        hasBothTabs ? (
          <Tabs
            label={title}
            value={tab}
            onChange={setTab}
            options={[
              { value: 'current', label: t.partyCurrentTab },
              { value: 'historical', label: t.partyHistoricalTab }
            ]}
          />
        ) : undefined
      }
      hero={(index) => {
        const match = shown(index);
        return match ? <PartyHero key={match.partyId} match={match} /> : null;
      }}
      dims={(index) => partyDimItems(people.results[index].partyDimensionMatches ?? [], open(index))}
      popup={
        info && {
          visual: (
            <div className="e-dim-visual">
              <SafeImg className="e-ppl-logo-lg" src={resolvePartyLogoSrc(info.match.logoPath)} alt={t.partyLogoAlt(info.match.name)} fallback={t.partyLogoUnavailable} />
              {info.match.countryFlagPath && (
                <SafeImg
                  className="e-flagmini"
                  src={resolveCountryFlagSrc(info.match.countryFlagPath)}
                  alt={t.flagAlt(info.match.historical ? t.flagHistoricLabel : t.flagLabel, info.match.countryName)}
                  fallback=""
                />
              )}
            </div>
          ),
          label: popupLabel(people, info.index, info.dimension),
          title: info.match.name,
          caption: [info.match.category, info.match.historical ? info.match.period : '', info.match.countryName].filter(Boolean).join(' · '),
          description: info.match.description,
          color: colorOf(people.profiles[info.index], info.index)
        }
      }
      onClosePopup={() => setInfo(null)}
    />
  );
}
