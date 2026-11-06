import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { LANG, t } from '../../i18n';
import type { Axis, AxisResult, PremiumReport, QuizPayload, QuizResult } from '../../types/quiz';
import { catStyle } from '../../utils/ideologyColors';
import { PdfReport } from '../report/PdfReport';
import '../../styles/report.css';
import { BooksSection } from '../results/BooksSection';
import { AreasSection } from '../results/AreasSection';
import { AxesSection } from '../results/AxesSection';
import { CompareSection } from '../results/CompareSection';
import { ComparePersonSection } from '../results/ComparePersonSection';
import { CountriesSection } from '../results/CountriesSection';
import { IdeologiesSection } from '../results/IdeologiesSection';
import { PartiesSection } from '../results/PartiesSection';
import { PersonalitiesSection } from '../results/PersonalitiesSection';
import { PoliticalCompassSection } from '../results/PoliticalCompassSection';
import { PhraseSection } from '../results/PhraseSection';
import { ResultsNav } from '../results/ResultsNav';
import { SharePreviewSection } from '../results/SharePreviewSection';
import { SignatureSection } from '../results/SignatureSection';
import { PoliticalValuesSection } from '../results/PoliticalValuesSection';
import { computeCompass } from '../../utils/politicalCompass';
import { PARTIES_ENABLED } from '../../utils/partyLogos';
import type { SavedAnswers } from '../../utils/quizProgress';
import type { Religion } from '../../utils/religion';
import { MatchInsightProvider } from '../results/MatchInsight';
import { PaywallModal, type PaywallSource } from '../results/PaywallModal';
import { UnlockCelebration } from '../results/UnlockCelebration';
import { PaywallSection } from '../results/PaywallSection';
import { PreviewSwitch } from '../results/PreviewSwitch';
import { usePremiumAccess } from '../results/usePremiumAccess';
import { LockIcon } from '../results/LockIcon';
import { SectionShareButton, type ShareKind } from '../results/SectionShareButton';
import { CsvIcon, DownloadIcon, Ring, ShareImageIcon } from './primitives';
import { track } from '../../utils/analytics';
import { pdfButtonAction } from '../../utils/pdfAccess';
import { paywallEnabled, paywallMode, salesOpen } from '../../utils/paywallFlag';
import { downloadRankingXlsx } from '../../utils/rankingXlsx';

// Modo de desenvolvimento local do Relatório Completo: abre sem pagamento (o backend também precisa de PREMIUM_DEV_OPEN).
// Fica fora do build de produção porque a variável só existe em frontend/.env.local.
const PREMIUM_DEV_OPEN = import.meta.env.VITE_PREMIUM_DEV_OPEN === 'true';
// Compra do Relatório completo (Mercado Pago): VITE_PAYWALL_ENABLED = true (todos), preview (só navegadores marcados com ?paywall=1),
// paused (vendas pausadas: só quem já pagou vê o relatório) ou
// desligada (padrão). Ver utils/paywallFlag.
// Dois interruptores: VITE_PAYWALL_ENABLED (português, reais) e VITE_PAYWALL_EN_ENABLED (qualquer outro idioma, dólar, pela Paddle).
const PAYWALL_MODE = paywallMode(LANG === 'pt' ? import.meta.env.VITE_PAYWALL_ENABLED : import.meta.env.VITE_PAYWALL_EN_ENABLED);
const PremiumReportSection = lazy(() => import('../results/premium/PremiumReportSection'));

interface ResultsScreenProps {
  result: QuizResult;
  quiz: QuizPayload | null;
  axes: Axis[];
  axisResults: Map<string, AxisResult>;
  isSharing: boolean;
  error: string | null;
  onShare: () => void;
  religion?: Religion | null;
  /** Abre a edição das respostas; só vem quando este navegador guardou as respostas deste resultado. */
  onEditAnswers?: () => void;
  /** Respostas deste resultado, quando este navegador as tem: o relatório pago usa para mostrar o que mais pesou em cada eixo. */
  premiumAnswers?: SavedAnswers | null;
}

export function ResultsScreen({ result, quiz, axes, axisResults, isSharing, error, onShare, religion, onEditAnswers, premiumAnswers }: ResultsScreenProps) {
  const top = result.topMatch;
  const PAYWALL_ENABLED = useMemo(
    () =>
      paywallEnabled({
        mode: PAYWALL_MODE,
        search: window.location.search,
        storage: (() => {
          try {
            return window.localStorage;
          } catch {
            return null;
          }
        })()
      }),
    []
  );
  // Com as vendas pausadas o relatório segue aberto a quem pagou (PAYWALL_ENABLED), mas ninguém vê a compra (SALES_OPEN).
  const SALES_OPEN = useMemo(
    () =>
      salesOpen({
        mode: PAYWALL_MODE,
        enabled: PAYWALL_ENABLED,
        search: window.location.search,
        storage: (() => {
          try {
            return window.localStorage;
          } catch {
            return null;
          }
        })()
      }),
    [PAYWALL_ENABLED]
  );
  const showParties = PARTIES_ENABLED && (result.topPartyMatches?.length ?? 0) > 0;
  const politicalValues = result.politicalValues ?? [];
  const compass = computeCompass(axisResults);
  const [printingPdf, setPrintingPdf] = useState(false);
  // Cartão de compartilhamento de uma seção (países, personalidades, partidos ou valores e bússola). O módulo do cartão (e o
  // html-to-image) só carrega no clique.
  const [sharingKind, setSharingKind] = useState<ShareKind | null>(null);
  const [shareError, setShareError] = useState<{ kind: ShareKind; message: string } | null>(null);
  const shareSection = async (kind: ShareKind) => {
    if (sharingKind) return;
    setSharingKind(kind);
    setShareError(null);
    track('share_section', { section: kind });
    try {
      const sharedReligion = religion ?? null;
      if (kind === 'countries') await (await import('../../utils/countriesShareCard')).exportCountriesShare(result, sharedReligion);
      else if (kind === 'personalities') await (await import('../../utils/personalitiesShareCard')).exportPersonalitiesShare(result, sharedReligion);
      else if (kind === 'parties') await (await import('../../utils/partiesShareCard')).exportPartiesShare(result, sharedReligion);
      else if (kind === 'compass') await (await import('../../utils/compassShareCard')).exportCompassShare(result, axes, sharedReligion);
      else if (premiumReport) {
        // As seções do relatório pago usam o relatório que já está carregado na página.
        if (kind === 'government') await (await import('../../utils/governmentShareCard')).exportGovernmentShare(result, premiumReport, sharedReligion);
        else if (kind === 'timeline') await (await import('../../utils/timelineShareCard')).exportTimelineShare(result, premiumReport, sharedReligion);
        else await (await import('../../utils/livingShareCard')).exportLivingShare(result, premiumReport, sharedReligion);
      }
    } catch {
      setShareError({ kind, message: t.errImage });
    } finally {
      setSharingKind(null);
    }
  };
  const shareButton = (kind: ShareKind) => (
    <SectionShareButton
      kind={kind}
      sharing={sharingKind === kind}
      error={shareError?.kind === kind ? shareError.message : null}
      onShare={() => void shareSection(kind)}
    />
  );
  // Identidade do resultado para o relatório pago: os 12 valores, na ordem dos eixos.
  const premiumVector = useMemo(() => result.axes.map((axis) => axis.leftPercent), [result]);
  // Resultado visto: uma vez por resultado (quem fez o teste agora ou abriu um link). Junto com quiz_start e quiz_complete mostra
  // onde o funil perde gente antes do convite.
  const vectorKey = premiumVector.join(',');
  useEffect(() => {
    track('result_view', { entry: quiz ? 'quiz' : 'link', category: top.category });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vectorKey]);
  // O relatório pago, quando carregado: de lá vêm a aba "Área de atuação" e o ranking da planilha.
  const [premiumReport, setPremiumReport] = useState<PremiumReport | null>(null);
  // Só em desenvolvimento (PREMIUM_DEV_OPEN): alterna entre a página paga e a grátis (com o convite), para ajustar o layout
  // dos dois lados sem pagar. Também aceita ?preview=free no endereço.
  const [preview, setPreview] = useState<'paid' | 'free'>(() =>
    new URLSearchParams(window.location.search).get('preview') === 'free' ? 'free' : 'paid'
  );
  const previewAsFree = PREMIUM_DEV_OPEN && preview === 'free';
  const realAccess = usePremiumAccess(premiumVector, PAYWALL_ENABLED && (!PREMIUM_DEV_OPEN || previewAsFree));
  // Na pré-visualização grátis o acesso é sempre "sem acesso", mesmo que haja um token guardado.
  // Mas o estado de "sem acesso" real (compra em andamento, erro do pagamento) continua valendo, para o convite mostrar o que aconteceu.
  const access = previewAsFree
    ? { ...realAccess, state: realAccess.state.status === 'locked' ? realAccess.state : { status: 'locked' as const, problem: null, busy: false } }
    : realAccess;
  const [paywallOpen, setPaywallOpen] = useState(false);
  // De onde veio a abertura do modal e quando, para o modal_close dizer a origem e quanto tempo a pessoa ficou.
  const paywallOpened = useRef<{ source: PaywallSource; at: number }>({ source: 'section_final', at: 0 });
  // Comemoração na volta do pagamento. Para ver sem pagar: em desenvolvimento (npm run dev, ou o backend com PREMIUM_DEV_OPEN), abrir o resultado com ?celebrate=1.
  const [celebrationClosed, setCelebrationClosed] = useState(false);
  const devCelebrate = (import.meta.env.DEV || PREMIUM_DEV_OPEN) && new URLSearchParams(window.location.search).get('celebrate') === '1';
  const celebrating = (access.justPaid || devCelebrate) && !celebrationClosed;
  const openPaywall = (source: PaywallSource) => {
    track('paywall_view', { source });
    paywallOpened.current = { source, at: Date.now() };
    setPaywallOpen(true);
  };
  const closePaywall = () => {
    const { source, at } = paywallOpened.current;
    track('modal_close', { source, seconds_open: Math.round((Date.now() - at) / 1000) });
    setPaywallOpen(false);
  };
  const premiumToken = access.state.status === 'unlocked' ? access.state.token : null;
  const hasPremium = (PREMIUM_DEV_OPEN && !previewAsFree) || premiumToken !== null;
  const shownReport = hasPremium ? premiumReport : null;

  // O PDF é do Relatório completo: sem acesso (e com a compra ligada), o botão abre o modal de compra em vez de imprimir.
  const handlePdf = () => {
    const action = pdfButtonAction(SALES_OPEN, hasPremium);
    track('pdf_export_click', { locked: action === 'openModal' });
    if (action === 'openModal') openPaywall('pdf');
    else setPrintingPdf(true);
  };

  // O relatório é montado fora da tela; quando imagens e fontes carregam, o diálogo de
  // impressão do navegador gera o PDF. O título da aba vira o nome sugerido do arquivo.
  useEffect(() => {
    if (!printingPdf) {
      return;
    }
    let cancelled = false;
    const previousTitle = document.title;
    const finish = () => {
      document.title = previousTitle;
      setPrintingPdf(false);
    };
    (async () => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('.rp-root img'));
      // O relatório fica fora da tela, e imagens "lazy" fora da tela nunca carregam: sem isto a espera abaixo não termina.
      images.forEach((img) => {
        img.loading = 'eager';
      });
      // Teto de 12 s: uma imagem que não chega não pode travar a geração do PDF.
      await Promise.race([
        Promise.allSettled(images.map((img) => (img.complete ? Promise.resolve() : img.decode()))),
        new Promise((resolve) => setTimeout(resolve, 12000))
      ]);
      await document.fonts?.ready;
      if (cancelled) {
        return;
      }
      document.title = `${t.report.fileName}-${new Date().toISOString().slice(0, 10)}`;
      window.addEventListener('afterprint', finish, { once: true });
      window.print();
    })();
    return () => {
      cancelled = true;
      window.removeEventListener('afterprint', finish);
    };
  }, [printingPdf]);

  // Compartilhar, baixar o PDF e exportar a planilha: logo depois do cartão do resultado e, com acesso, de novo no fim.
  const actions = (
    <div className="e-actions">
      <button className="e-btn e-btn-primary" type="button" onClick={onShare} disabled={isSharing}>
        {isSharing ? t.generatingPng : t.saveOrShare} <ShareImageIcon />
      </button>
      <button className="e-btn e-btn-ghost e-btn-wrap" type="button" onClick={handlePdf} disabled={printingPdf || (hasPremium && !shownReport)}>
        {printingPdf ? t.generatingPdf : SALES_OPEN || hasPremium ? t.downloadPdfFull : t.downloadPdf}{' '}
        {SALES_OPEN && !hasPremium ? <LockIcon className="e-btn-lock" /> : <DownloadIcon />}
      </button>
      {shownReport && (
        <button className="e-btn e-btn-ghost" type="button" onClick={() => void downloadRankingXlsx(shownReport.ranking, LANG, top.category)}>
          {t.exportCsv} <CsvIcon />
        </button>
      )}
    </div>
  );

  const screen = (
    <main className="ed e-res" id="resultados" style={catStyle(top.category) as CSSProperties}>
      <div className="e-wrap e-res-grid">
        <div className="e-res-main">
          <header className="e-res-head">
            <p className="e-eyebrow">{t.resultsEyebrow}</p>
            <h1>
              {t.resultsH1Pre}
              <span>{t.resultsH1Em}</span>
            </h1>
          </header>

          <article className="e-panel e-top">
            <div className="e-top-head">
              <div>
                <span className="e-tag e-tag-solid">{top.category}</span>
                <h2 className={top.name.length >= 18 ? 'e-long-name' : undefined}>{top.name}</h2>
              </div>
              <Ring pct={top.compatibility} size={120} stroke={6} />
            </div>
            <PhraseSection match={top} />
          </article>

          <AxesSection axes={axes} results={axisResults} religion={religion} onEditAnswers={onEditAnswers} />

          <div className="e-actions">
            <button className="e-btn e-btn-ghost" type="button" onClick={onShare} disabled={isSharing}>
              {isSharing ? t.generatingPng : t.saveOrShare} <ShareImageIcon />
            </button>
          </div>

          <SignatureSection unusual={result.mostUnusualAxis} common={result.mostCommonAxis} tension={result.axisTension} axes={axes} results={axisResults} />

          <CountriesSection
            current={result.topCountryMatch}
            historical={result.topHistoricalCountryMatch}
            dimensions={result.countryDimensionMatches}
            distant={result.bottomCountryMatches}
            axes={axes}
            results={axisResults}
            footer={shareButton('countries')}
          />

          <PersonalitiesSection
            footer={shareButton('personalities')}
            top={result.topPersonalityMatch}
            dimensions={result.dimensionMatches}
            distant={result.bottomPersonalityMatches}
            axes={axes}
            results={axisResults}
          />

          <AreasSection
            generalMatches={result.personalityMatches}
            areaMatches={shownReport?.personalitiesByArea ?? []}
            axes={axes}
            results={axisResults}
            areaLocked={!hasPremium}
            onUnlock={SALES_OPEN ? () => openPaywall('areas') : undefined}
          />

          <BooksSection books={result.bookRecommendations} />

          {/* Cartão do resultado e as ações (compartilhar, PDF, planilha): logo depois dos livros. */}
          <SharePreviewSection result={result} quiz={quiz} axes={axes} religion={religion} isSharing={isSharing} onShare={onShare} />

          {actions}
          {error && <p className="inline-error" role="alert">{error}</p>}

          {showParties && (
            <PartiesSection
              footer={shareButton('parties')}
              current={result.topPartyMatch}
              historical={result.topHistoricalPartyMatch}
              top={result.topPartyMatches ?? []}
              dimensions={result.partyDimensionMatches ?? []}
              distant={result.bottomPartyMatches ?? []}
              axes={axes}
              results={axisResults}
            />
          )}

          <PoliticalValuesSection values={politicalValues} category={top.category} religion={religion} footer={shareButton('compass')} />

          <IdeologiesSection others={result.matches.slice(1, 4)} distant={result.bottomIdeologyMatch} />

          {compass && (
            <PoliticalCompassSection
              position={compass}
              category={top.category}
              moralAxis={axes.find((axis) => axis.id === 'moral')}
              footer={shareButton('compass')}
            />
          )}

          {hasPremium ? (
            <Suspense fallback={null}>
              <PremiumReportSection
                vector={premiumVector}
                answers={premiumAnswers ?? null}
                token={premiumToken}
                religion={religion ?? null}
                axes={axes}
                results={axisResults}
                devOpen={PREMIUM_DEV_OPEN && !previewAsFree}
                onReport={(report) => {
                  setPremiumReport(report);
                  if (report) track('premium_report_view');
                }}
                onDenied={access.revoke}
                shareButton={shareButton}
              />
            </Suspense>
          ) : (
            SALES_OPEN && <PaywallSection access={access} onOpen={openPaywall} result={result} axes={axes} results={axisResults} religion={religion ?? null} />
          )}

          {hasPremium && actions}

          {celebrating && <UnlockCelebration name={top.name} category={top.category} token={premiumToken ?? (devCelebrate ? 'token-de-teste' : null)} onClose={() => setCelebrationClosed(true)} />}

          {paywallOpen && !hasPremium && SALES_OPEN && (
            <PaywallModal
              access={access}
              category={top.category}
              source={paywallOpened.current.source}
              onClose={closePaywall}
            />
          )}

          {PREMIUM_DEV_OPEN && <PreviewSwitch value={preview} onChange={setPreview} />}

          <ComparePersonSection axes={axes} results={axisResults} religion={religion} />

          <CompareSection
            axes={axes}
            results={axisResults}
            religion={religion}
            userCategory={top.category}
            closest={result.topPersonalityMatch}
            farthest={result.bottomPersonalityMatches?.[0] ?? null}
          />
        </div>

        <aside className="e-side" aria-label={t.resultsSummaryAria}>
          <ResultsNav premium={hasPremium} premiumTarget={SALES_OPEN ? 'relatorio-completo' : null} hasBooks={(result.bookRecommendations?.length ?? 0) > 0} hasCompass={compass !== null} hasParties={showParties} hasValues={politicalValues.length > 0} />
        </aside>
      </div>
      {printingPdf && pdfButtonAction(SALES_OPEN, hasPremium) === 'print' &&
        createPortal(
          <div className="rp-root" aria-hidden="true">
            <PdfReport
              result={result}
              axes={axes}
              axisResults={axisResults}
              answeredCount={quiz ? quiz.questions.length : null}
              religion={religion}
              premium={hasPremium ? shownReport : null}
            />
          </div>,
          document.body
        )}
    </main>
  );

  // No relatório pago, as fichas de personalidades, países e partidos mostram o que aproxima e afasta o usuário de cada um.
  return hasPremium ? (
    <MatchInsightProvider axes={axes} results={axisResults}>
      {screen}
    </MatchInsightProvider>
  ) : (
    screen
  );
}
