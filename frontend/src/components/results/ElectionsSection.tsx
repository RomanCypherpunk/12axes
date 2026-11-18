import { useEffect, useRef, type ReactNode } from 'react';
import { LANG, t } from '../../i18n';
import type { ElectionResult } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { formatElectionDate, isElectionOver } from '../../utils/electionDate';
import { resolvePartyLogoSrc } from '../../utils/partyLogos';
import { SafeImg } from '../editorial/primitives';
import { MatchHero } from './parts';
import { Portrait } from './PersonalitiesSection';

interface ElectionsSectionProps {
  election: ElectionResult;
  /** O que aparece embaixo da seção (o botão de compartilhar o cartão dela). */
  footer?: ReactNode;
}

/** Eleição ativa: só o candidato mais próximo do usuário. A linha de etiquetas traz país, partido e match, lado a lado. */
export function ElectionsSection({ election, footer }: ElectionsSectionProps) {
  const top = election.candidates[0];
  if (!top) return null;
  const { candidate, party } = top;

  return (
    <section className="e-panel" id="eleicoes" data-reveal>
      <h2>{t.electionsClosestLabel}</h2>
      <p className="e-sub">
        {formatElectionDate(election.date, LANG)}
        {isElectionOver(election.date) ? ` · ${t.electionsEnded}` : ''}
      </p>

      <MatchHero
        className="e-match-election"
        visual={<Portrait match={candidate} className="e-election-portrait" />}
        compatibility={candidate.compatibility}
        name={candidate.name}
        tags={[candidate.role, party?.name ?? ''].filter(Boolean)}
        description={candidate.description}
        kickerPrefix={
          party ? (
            <>
              {party.countryFlagPath && (
                <SafeImg
                  className="e-flagmini"
                  src={resolveCountryFlagSrc(party.countryFlagPath)}
                  alt={t.flagAlt(t.flagLabel, party.countryName)}
                  fallback=""
                />
              )}
              <SafeImg
                className="e-election-logo"
                src={resolvePartyLogoSrc(party.logoPath)}
                alt={t.partyLogoAlt(party.name)}
                fallback={t.partyLogoUnavailable}
              />
            </>
          ) : null
        }
        note={t.electionsNotice}
      />
      {footer}
    </section>
  );
}

/** Seletor de país da eleição, ao lado do compartilhar: o botão mostra a bandeira da eleição atual e abre a lista de países. */
export function ElectionPicker({ elections, index, onSelect }: { elections: ElectionResult[]; index: number; onSelect: (index: number) => void }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: Event) => {
      const details = ref.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !details.contains(event.target as Node)) details.open = false;
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', close);
    };
  }, []);

  const entry = (election: ElectionResult) => {
    const party = election.candidates[0]?.party;
    return { flag: party?.countryFlagPath, label: party?.countryName || election.name };
  };
  const current = entry(elections[index]);
  const flagOf = (flag: string | undefined) =>
    flag ? <SafeImg className="e-election-pick-flag" src={resolveCountryFlagSrc(flag)} alt="" fallback="" /> : null;

  return (
    <details className="e-lang e-election-pick" ref={ref} onClick={(event) => event.stopPropagation()}>
      <summary aria-label={`${t.electionsPickAria}: ${current.label}`} title={current.label}>
        {flagOf(current.flag)}
        <svg className="e-lang-caret" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <ul className="e-lang-menu">
        {elections.map((election, position) => {
          const item = entry(election);
          return (
            <li key={election.id}>
              <button
                type="button"
                aria-current={position === index ? 'true' : undefined}
                onClick={() => {
                  onSelect(position);
                  if (ref.current) ref.current.open = false;
                }}
              >
                {flagOf(item.flag)}
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
