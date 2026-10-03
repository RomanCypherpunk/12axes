import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../i18n';
import type { Axis, AxisResult, QuizPayload, QuizResult } from '../../types/quiz';
import { catStyle } from '../../utils/ideologyColors';
import { SupportSection } from '../SupportSection';
import { PdfReport } from '../report/PdfReport';
import '../../styles/report.css';
import { BooksSection } from '../results/BooksSection';
import { AreasSection } from '../results/AreasSection';
import { AxesSection } from '../results/AxesSection';
import { CompareSection } from '../results/CompareSection';
import { CountriesSection } from '../results/CountriesSection';
import { CountUpValue } from '../results/CountUpValue';
import { IdeologiesSection } from '../results/IdeologiesSection';
import { PersonalitiesSection } from '../results/PersonalitiesSection';
import { PhraseSection } from '../results/PhraseSection';
import { ResultsNav } from '../results/ResultsNav';
import { SignatureSection } from '../results/SignatureSection';
import type { Religion } from '../../utils/religion';
import { DownloadIcon, Ring, ShareImageIcon } from './primitives';

interface ResultsScreenProps {
  result: QuizResult;
  quiz: QuizPayload | null;
  axes: Axis[];
  axisResults: Map<string, AxisResult>;
  isSharing: boolean;
  error: string | null;
  onShare: () => void;
  religion?: Religion | null;
}

export function ResultsScreen({ result, quiz, axes, axisResults, isSharing, error, onShare, religion }: ResultsScreenProps) {
  const top = result.topMatch;
  const [printingPdf, setPrintingPdf] = useState(false);

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
      await Promise.allSettled(images.map((img) => (img.complete ? Promise.resolve() : img.decode())));
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

  return (
    <main className="ed e-res" id="resultados" style={catStyle(top.category) as CSSProperties}>
      <div className="e-wrap e-res-grid">
        <div className="e-res-main">
          <header className="e-res-head">
            <p className="e-eyebrow">{t.resultsEyebrow}</p>
            <h1>
              {t.resultsH1Pre}
              <span>{t.resultsH1Em}</span>
            </h1>
            <p className="e-lead">{quiz ? t.resultsLead(quiz.questions.length) : t.resultsLeadShared}</p>
          </header>

          <article className="e-panel e-top">
            <div className="e-top-head">
              <div>
                <span className="e-tag e-tag-solid">{top.category}</span>
                <h2 className={top.name.length >= 18 ? 'e-long-name' : undefined}>{top.name}</h2>
              </div>
              <Ring pct={top.compatibility} size={120} stroke={10} />
            </div>
            <p>{top.longDescription || top.description}</p>
          </article>

          <PhraseSection match={top} />

          <AxesSection axes={axes} results={axisResults} religion={religion} />

          <div className="e-actions">
            <button className="e-btn e-btn-ghost" type="button" onClick={onShare} disabled={isSharing}>
              {isSharing ? t.generatingPng : t.saveOrShare} <ShareImageIcon />
            </button>
          </div>

          <SignatureSection unusual={result.mostUnusualAxis} common={result.mostCommonAxis} tension={result.axisTension} />

          <CountriesSection
            current={result.topCountryMatch}
            historical={result.topHistoricalCountryMatch}
            dimensions={result.countryDimensionMatches}
            distant={result.bottomCountryMatches}
            axes={axes}
            results={axisResults}
          />

          <PersonalitiesSection
            top={result.topPersonalityMatch}
            dimensions={result.dimensionMatches}
            distant={result.bottomPersonalityMatches}
            axes={axes}
            results={axisResults}
          />

          <AreasSection generalMatches={result.personalityMatches} areaMatches={result.categoryBestMatches} axes={axes} results={axisResults} />

          <BooksSection books={result.bookRecommendations} />

          <IdeologiesSection others={result.matches.slice(1, 4)} distant={result.bottomIdeologyMatch} />

          <div className="e-actions">
            <button className="e-btn e-btn-primary" type="button" onClick={onShare} disabled={isSharing}>
              {isSharing ? t.generatingPng : t.saveOrShare} <ShareImageIcon />
            </button>
            <button className="e-btn e-btn-ghost" type="button" onClick={() => setPrintingPdf(true)} disabled={printingPdf}>
              {printingPdf ? t.generatingPdf : t.downloadPdf} <DownloadIcon />
            </button>
          </div>
          {error && <p className="inline-error" role="alert">{error}</p>}

          <CompareSection axes={axes} results={axisResults} religion={religion} userCategory={top.category} />

          <SupportSection variant="panel" />
        </div>

        <aside className="e-side" aria-label={t.resultsSummaryAria}>
          <div className="e-panel e-side-meta">
            {quiz && (
              <div>
                {t.metaAnswered}
                <b>{quiz.questions.length}</b>
              </div>
            )}
            <div>
              {t.metaAxes}
              <b>12</b>
            </div>
            <div>
              {t.metaTop}
              <b className="e-c">
                <CountUpValue value={top.compatibility} delayMs={420} />
              </b>
            </div>
          </div>
          <ResultsNav hasBooks={(result.bookRecommendations?.length ?? 0) > 0} />
        </aside>
      </div>
      {printingPdf &&
        createPortal(
          <div className="rp-root" aria-hidden="true">
            <PdfReport
              result={result}
              axes={axes}
              axisResults={axisResults}
              answeredCount={quiz ? quiz.questions.length : null}
              religion={religion}
            />
          </div>,
          document.body
        )}
    </main>
  );
}
