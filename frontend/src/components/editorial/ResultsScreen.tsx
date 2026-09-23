import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, QuizPayload, QuizResult } from '../../types/quiz';
import { catStyle } from '../../utils/ideologyColors';
import { SupportSection } from '../SupportSection';
import { AreasSection } from '../results/AreasSection';
import { AxesSection } from '../results/AxesSection';
import { CountriesSection } from '../results/CountriesSection';
import { CountUpValue } from '../results/CountUpValue';
import { IdeologiesSection } from '../results/IdeologiesSection';
import { PersonalitiesSection } from '../results/PersonalitiesSection';
import { PhraseSection } from '../results/PhraseSection';
import { ResultsNav } from '../results/ResultsNav';
import { SignatureSection } from '../results/SignatureSection';
import { DownloadIcon, RefreshIcon, Ring } from './primitives';

interface ResultsScreenProps {
  result: QuizResult;
  quiz: QuizPayload | null;
  axes: Axis[];
  axisResults: Map<string, AxisResult>;
  isSharing: boolean;
  error: string | null;
  onRedo: () => void;
  onShare: () => void;
}

export function ResultsScreen({ result, quiz, axes, axisResults, isSharing, error, onRedo, onShare }: ResultsScreenProps) {
  const top = result.topMatch;

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

          <AxesSection axes={axes} results={axisResults} />

          <SignatureSection unusual={result.mostUnusualAxis} common={result.mostCommonAxis} tension={result.axisTension} />

          <CountriesSection
            current={result.topCountryMatch}
            historical={result.topHistoricalCountryMatch}
            dimensions={result.countryDimensionMatches}
            distant={result.bottomCountryMatches}
          />

          <PersonalitiesSection
            top={result.topPersonalityMatch}
            dimensions={result.dimensionMatches}
            distant={result.bottomPersonalityMatches}
          />

          <AreasSection generalMatches={result.personalityMatches} areaMatches={result.categoryBestMatches} />

          <IdeologiesSection others={result.matches.slice(1, 4)} distant={result.bottomIdeologyMatch} />

          <div className="e-actions">
            <button className="e-btn e-btn-primary" type="button" onClick={onRedo}>
              {t.redoAnalysis} <RefreshIcon />
            </button>
            <button className="e-btn e-btn-ghost" type="button" onClick={onShare} disabled={isSharing}>
              {isSharing ? t.generatingPng : t.share} <DownloadIcon />
            </button>
          </div>
          {error && <p className="inline-error" role="alert">{error}</p>}

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
          <ResultsNav />
        </aside>
      </div>
    </main>
  );
}
