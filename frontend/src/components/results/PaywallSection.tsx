import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { t } from '../../i18n';
import { fetchReportPreview } from '../../services/premiumApi';
import type { Axis, AxisResult, QuizResult, ReportPreview } from '../../types/quiz';
import { track } from '../../utils/analytics';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { SafeImg } from '../editorial/primitives';
import { LockIcon, UnlockIcon } from './LockIcon';
import type { PaywallSource } from './PaywallModal';
import { UnlockButton } from './UnlockButton';
import type { PremiumAccess } from './usePremiumAccess';

// Cada seção do Relatório completo aparece como um painel próprio: o título nítido, o começo da seção como ela é na página paga
// (do servidor, sem acesso: só o que o convite mostra) e o resto desfocado, com o botão que abre a compra. Enquanto o começo não
// chega (ou se o servidor falhar), cada painel mostra um teaser simples com dados gratuitos do resultado. O que está desfocado são
// só formas genéricas, sem nenhum dado do usuário.
const DECOY_ROWS = [0, 1, 2];

// As linhas e os painéis iguais aos da página paga vêm em um pedaço à parte, só para quem vê o convite.
const AxisPreviewRow = lazy(() => import('./premium/PreviewPanels').then((module) => ({ default: module.AxisPreviewRow })));
const DisagreePreview = lazy(() => import('./premium/PreviewPanels').then((module) => ({ default: module.DisagreePreview })));
const GovernmentPreview = lazy(() => import('./premium/PreviewPanels').then((module) => ({ default: module.GovernmentPreview })));
const TimelinePreview = lazy(() => import('./premium/PreviewPanels').then((module) => ({ default: module.TimelinePreview })));

function BlurRow() {
  return (
    <div className="e-pw-row">
      <span className="e-pw-dot e-pw-small" />
      <span className="e-pw-bar e-pw-line" />
      <span className="e-pw-bar e-pw-line e-pw-short" />
    </div>
  );
}

interface BlockProps {
  title: string;
  source: PaywallSource;
  /** O texto do botão por cima do desfoque. */
  cta: string;
  onOpen: (source: PaywallSource) => void;
  /** O que aparece nítido, com dados reais e gratuitos do resultado. */
  teaser: ReactNode;
  /** O que fica desfocado embaixo do teaser: só formas genéricas. */
  blurred: ReactNode;
  sectionRef?: Ref<HTMLElement>;
}

function Block({ title, source, cta, onOpen, teaser, blurred, sectionRef }: BlockProps) {
  return (
    <section className="e-panel e-pw-sec" data-reveal ref={sectionRef}>
      <h2>{title}</h2>
      <div className="e-pw-tease">{teaser}</div>
      <div className="e-pw-rest">
        <div className="e-pw-body" aria-hidden="true">
          {blurred}
        </div>
        <UnlockButton onClick={() => onOpen(source)} label={cta} />
      </div>
    </section>
  );
}

// O eixo em que a pessoa mais se afasta do centro: o mais interessante para abrir a análise.
function featuredAxis(axes: Axis[], results: Map<string, AxisResult>): { axis: Axis; result: AxisResult } | null {
  let best: { axis: Axis; result: AxisResult } | null = null;
  for (const axis of axes) {
    const result = results.get(axis.id);
    if (!result) continue;
    if (!best || Math.abs(result.leftPercent - 50) > Math.abs(best.result.leftPercent - 50)) best = { axis, result };
  }
  return best;
}

function NamedRows({ labels }: { labels: string[] }) {
  return (
    <ul className="e-pw-seats">
      {labels.map((label) => (
        <li key={label}>
          <span className="e-pw-dot e-pw-blur" />
          <span>
            <small>{label}</small>
            <span className="e-pw-bar e-pw-line e-pw-blur" />
          </span>
        </li>
      ))}
    </ul>
  );
}

interface PaywallSectionProps {
  access: PremiumAccess;
  onOpen: (source: PaywallSource) => void;
  result: QuizResult;
  axes: Axis[];
  results: Map<string, AxisResult>;
  religion: string | null;
}

/**
 * Convites ao Relatório completo na página do resultado, uma seção de cada vez (eixo a eixo, onde você discorda, governo ideal,
 * linha do tempo e países), e o cartão final com o preço. Só aparece sem acesso.
 */
export function PaywallSection({ access, onOpen, result, axes, results, religion }: PaywallSectionProps) {
  const { state, retry } = access;
  const firstRef = useRef<HTMLElement>(null);
  const locked = state.status === 'locked';
  // O primeiro convite chegou à tela: uma vez por visita ao resultado. Separa quem nem rolou até aqui de quem viu e não abriu o modal.
  useEffect(() => {
    const node = firstRef.current;
    if (!locked || !node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          track('paywall_section_seen');
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [locked]);

  // O comecinho do relatório, do servidor (só o que o convite mostra). Sem ele (servidor antigo, falha), cada painel mostra o teaser
  // simples, com os dados gratuitos do resultado.
  const vector = useMemo(() => result.axes.map((axis) => axis.leftPercent), [result]);
  const vectorKey = vector.join(',');
  const [preview, setPreview] = useState<ReportPreview | null>(null);
  useEffect(() => {
    if (!locked) return;
    let cancelled = false;
    fetchReportPreview(vector, religion)
      .then((next) => {
        if (!cancelled) setPreview(next);
      })
      .catch(() => {
        // sem o comecinho, ficam os teasers simples
      });
    return () => {
      cancelled = true;
    };
    // `vectorKey` representa o vetor (o array é novo a cada resultado).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, vectorKey, religion]);

  if (state.status === 'off' || state.status === 'unlocked') return null;

  if (state.status === 'checking') {
    return (
      <section className="e-panel e-paywall-checking" id="relatorio-completo" aria-busy="true">
        <h2>{t.paywallTitle}</h2>
        <p className="e-paywall-note" role="status">{t.paywallChecking}</p>
      </section>
    );
  }

  const [axesTitle, disagreeTitle, governmentTitle, timelineTitle, countriesTitle] = t.paywallPreviewTitles;
  const featured = featuredAxis(axes, results);
  const personality = result.topPersonalityMatch;
  const country = result.topCountryMatch;
  const tease = t.paywallTeaser;
  const problem = state.problem;

  // Enquanto o comecinho do servidor não chega (ou se falhar): o eixo mais forte com os dados gratuitos do resultado.
  const simpleAxisTeaser = featured && (
    <div className="e-pw-axis-tease" style={{ '--al': featured.axis.leftColor, '--ar': featured.axis.rightColor } as CSSProperties}>
      <p className="e-pw-tag">{tease.axisTag}</p>
      <div className="e-pw-axis-head">
        <h3>{featured.axis.label}</h3>
        <span>
          {featured.result.dominantPole} · {Math.round(Math.max(featured.result.leftPercent, featured.result.rightPercent))}%
        </span>
      </div>
      <div className="e-pw-ruler" aria-hidden="true">
        <i style={{ left: `${100 - featured.result.leftPercent}%` }} />
      </div>
      <div className="e-pw-poles" aria-hidden="true">
        <small>{featured.axis.leftPole}</small>
        <small>{featured.axis.rightPole}</small>
      </div>
    </div>
  );

  const disagreeFallback = (
    <Block
      title={disagreeTitle}
      source="section_disagree"
      cta={t.paywallBlockCta.disagree}
      onOpen={onOpen}
      teaser={
        <div className="e-pw-who">
          <SafeImg
            className="e-pw-face"
            src={resolvePersonalityImageSrc(personality.imagePath)}
            alt={t.portraitAlt(personality.name)}
            fallback={personalityInitials(personality.name)}
          />
          <div>
            <b>{personality.name}</b>
            <p>{tease.disagreeWith(personality.name)}</p>
          </div>
        </div>
      }
      blurred={
        <>
          {DECOY_ROWS.map((row) => (
            <div key={row} className="e-pw-axis">
              <span className="e-pw-bar e-pw-line e-pw-short" />
              <span className="e-pw-track" />
            </div>
          ))}
        </>
      }
    />
  );

  const governmentFallback = (
    <Block
      title={governmentTitle}
      source="section_government"
      cta={t.paywallBlockCta.government}
      onOpen={onOpen}
      teaser={<NamedRows labels={tease.seats} />}
      blurred={
        <>
          <BlurRow />
          <BlurRow />
        </>
      }
    />
  );

  const timelineFallback = (
    <Block
      title={timelineTitle}
      source="section_timeline"
      cta={t.paywallBlockCta.timeline}
      onOpen={onOpen}
      teaser={<NamedRows labels={tease.eras} />}
      blurred={
        <>
          <BlurRow />
          <BlurRow />
        </>
      }
    />
  );

  return (
    <div id="relatorio-completo" className="e-pw-stack">
      <Block
        title={axesTitle}
        source="section_axes"
        cta={t.paywallBlockCta.axes}
        onOpen={onOpen}
        sectionRef={firstRef}
        teaser={
          preview ? (
            <Suspense fallback={simpleAxisTeaser}>
              <AxisPreviewRow preview={preview} axes={axes} results={results} country={country} personality={personality} />
            </Suspense>
          ) : (
            simpleAxisTeaser
          )
        }
        blurred={
          <>
            <div className="e-pw-axis">
              <span className="e-pw-bar e-pw-line" />
              <span className="e-pw-bar e-pw-line e-pw-short" />
              <span className="e-pw-bar e-pw-line" />
            </div>
            {DECOY_ROWS.slice(0, 2).map((row) => (
              <div key={row} className="e-pw-axis">
                <span className="e-pw-bar e-pw-line" />
                <span className="e-pw-track" />
                <span className="e-pw-bar e-pw-line e-pw-short" />
              </div>
            ))}
          </>
        }
      />

      {preview ? (
        <Suspense fallback={disagreeFallback}>
          <DisagreePreview preview={preview} personality={personality} onUnlock={() => onOpen('section_disagree')} />
        </Suspense>
      ) : (
        disagreeFallback
      )}

      {preview ? (
        <Suspense fallback={governmentFallback}>
          <GovernmentPreview preview={preview} onUnlock={() => onOpen('section_government')} />
        </Suspense>
      ) : (
        governmentFallback
      )}

      {preview ? (
        <Suspense fallback={timelineFallback}>
          <TimelinePreview preview={preview} onUnlock={() => onOpen('section_timeline')} />
        </Suspense>
      ) : (
        timelineFallback
      )}

      <Block
        title={countriesTitle}
        source="section_countries"
        cta={t.paywallBlockCta.countries}
        onOpen={onOpen}
        teaser={
          <ol className="e-rank e-pw-rank">
            <li className="e-rk">
              <span className="e-rk-n">01</span>
              <SafeImg className="e-rk-flag" src={resolveCountryFlagSrc(country.flagPath)} alt={country.name} fallback={t.flagUnavailable} />
              <div className="e-rk-i">
                <b>{country.name}</b>
                <small>{tease.topCountry}</small>
                <div className="e-bar">
                  <i style={{ width: `${Math.max(0, Math.min(100, country.compatibility))}%` }} />
                </div>
              </div>
              <span className="e-pctc">{Math.round(country.compatibility)}%</span>
            </li>
          </ol>
        }
        blurred={
          <>
            {DECOY_ROWS.map((row) => (
              <BlurRow key={row} />
            ))}
          </>
        }
      />

      <section className="e-pw-final" data-reveal>
        <span className="e-paywall-lock" aria-hidden="true">
          <LockIcon />
        </span>
        <h2>{t.paywallUnlockTitle}</h2>
        <p className="e-paywall-lead">{t.paywallLead}</p>
        <button className="e-btn e-btn-primary e-btn-wrap" type="button" onClick={() => onOpen('section_final')}>
          <UnlockIcon />
          {t.paywallCta}
        </button>
        <p className="e-paywall-note">
          {t.paywallPrice} · {t.paywallOnce}
        </p>
        <p className="e-paywall-note">{t.paywallGuarantee}</p>
        {problem && (
          <p className="inline-error" role="alert">
            {t.paywallProblems[problem]}{' '}
            {problem !== 'denied' && (
              <button className="e-btn e-btn-ghost e-btn-sm" type="button" onClick={retry}>
                {t.paywallRetry}
              </button>
            )}
          </p>
        )}
      </section>
    </div>
  );
}
