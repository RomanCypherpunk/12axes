import { useState } from 'react';
import { t } from '../../i18n';
import { LockIcon } from './LockIcon';
import type { Axis, AxisResult, PersonalityMatch } from '../../types/quiz';
import { CountUpValue } from './CountUpValue';
import { clickableProps } from './InfoSheet';
import { PersonalityInfoSheet, Portrait } from './PersonalitiesSection';
import { Tabs } from './parts';

// Linhas do fundo desfocado da aba bloqueada.
const DECOY_ROWS = [0, 1, 2, 3, 4, 5, 6, 7];

interface AreasSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  generalMatches: PersonalityMatch[];
  areaMatches: PersonalityMatch[];
  /** A aba "Área de atuação" é do Relatório completo: sem acesso, ela mostra o convite em vez da lista. */
  areaLocked?: boolean;
  /** Ação do botão do convite (abrir a compra); sem ela o convite aparece sem botão. */
  onUnlock?: () => void;
}

export function AreasSection({ generalMatches, areaMatches, axes, results, areaLocked = false, onUnlock }: AreasSectionProps) {
  const [chosenTab, setTab] = useState<'general' | 'area'>('general');
  const [info, setInfo] = useState<PersonalityMatch | null>(null);
  // Sem acesso e sem como comprar (a compra está desligada), a aba de áreas não tem o que mostrar: some, e fica só a lista geral.
  const showAreaTab = !areaLocked || onUnlock !== undefined;
  const tab = showAreaTab ? chosenTab : 'general';
  const locked = tab === 'area' && areaLocked;
  const matches = tab === 'general' ? generalMatches : areaMatches;

  if (generalMatches.length === 0 && areaMatches.length === 0 && !showAreaTab) {
    return null;
  }

  return (
    <section className="e-panel" id="areas" data-reveal>
      <h2>{tab === 'general' ? t.areasGeneralTitle : t.areasSectionTitle}</h2>
      {showAreaTab && (
        <Tabs
          label={t.areasTabsAria}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'general', label: t.areasGeneralTab },
            { value: 'area', label: t.areasByAreaTab }
          ]}
        />
      )}
      {locked ? (
        <div className="e-locked">
          {/* Fundo só de enfeite: oito linhas genéricas, desfocadas, sem nenhum dado. */}
          <ol className="e-locked-bg" aria-hidden="true">
            {DECOY_ROWS.map((row) => (
              <li key={row}>
                <span className="e-pw-bar e-pw-num" />
                <span className="e-pw-dot e-pw-small" />
                <span className="e-locked-lines">
                  <span className="e-pw-bar e-pw-line" />
                  <span className="e-pw-bar e-pw-line e-pw-short" />
                </span>
                <span className="e-pw-bar e-pw-pct" />
              </li>
            ))}
          </ol>
          <div className="e-paywall-card e-locked-card">
            <span className="e-paywall-lock" aria-hidden="true">
              <LockIcon />
            </span>
            <h3>{t.areasLockedTitle}</h3>
            <p className="e-paywall-lead">{t.areasLockedText}</p>
            {onUnlock && (
              <button type="button" className="e-btn e-btn-primary" onClick={onUnlock}>
                {t.areasLockedCta}
              </button>
            )}
          </div>
        </div>
      ) : (
      <ol className="e-rank">
        {matches.map((match, index) => (
          <li key={match.personalityId} {...{ ...clickableProps(t.personalityInfoAria(match.name), () => setInfo(match)), className: 'e-rk e-clickable' }}>
            <span className="e-rk-n">{String(index + 1).padStart(2, '0')}</span>
            <Portrait match={match} className="e-rk-av" />
            <div className="e-rk-i">
              <b>{match.name}</b>
              <small>{t.personalityCategories[match.category]}</small>
              <div className="e-bar">
                <i style={{ width: `${Math.max(0, Math.min(100, match.compatibility))}%` }} />
              </div>
            </div>
            <span className="e-pctc">
              <CountUpValue value={match.compatibility} decimals={0} />
            </span>
          </li>
        ))}
      </ol>
      )}
      {info &&<PersonalityInfoSheet match={info} onClose={() => setInfo(null)} />}
    </section>
  );
}
