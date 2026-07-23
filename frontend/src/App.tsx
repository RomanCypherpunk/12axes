import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { selectAllQuestionsBalanced, selectAndBalanceQuestions, selectExtensionQuestions } from './utils/quizSelection';
import { AxisIcon } from './components/AxisIcon';
import { HOME_AXES } from './data/homeAxes';
import type { ExampleResult } from './data/exampleResult';
import { LANG, setLang, t } from './i18n';
import { fetchQuiz, fetchSharedResult, submitResults } from './services/quizApi';
import type { AnswerValue, QuizPayload, QuizResult, QuizVariant } from './types/quiz';
import { resolveCountryFlagSrc } from './utils/countryFlags';
import { resolvePersonalityImageSrc } from './utils/personalityImage';
import { SupportSection } from './components/SupportSection';

type Screen = 'home' | 'variant' | 'quiz' | 'extend' | 'results';
type ExtendChoice = 'yes' | 'no';
type QuizFormatOption = {
  variant: QuizVariant;
  label: string;
  questionCount: string;
  description: string;
  duration: string;
  action: string;
  featured?: boolean;
};

const AxisResultBar = lazy(() =>
  import('./components/AxisResultBar').then((module) => ({ default: module.AxisResultBar }))
);
const CountryMatchCard = lazy(() =>
  import('./components/CountryMatchCard').then((module) => ({ default: module.CountryMatchCard }))
);
const PersonalityMatchCard = lazy(() =>
  import('./components/PersonalityMatchCard').then((module) => ({ default: module.PersonalityMatchCard }))
);
const IdeologyMatchCard = lazy(() =>
  import('./components/IdeologyMatchCard').then((module) => ({ default: module.IdeologyMatchCard }))
);
const ProgressHeader = lazy(() =>
  import('./components/ProgressHeader').then((module) => ({ default: module.ProgressHeader }))
);
const QuestionCard = lazy(() =>
  import('./components/QuestionCard').then((module) => ({ default: module.QuestionCard }))
);

// Mantém compatibilidade com a rota direta antiga.
const FULL_MODE =
  typeof window !== 'undefined' &&
  window.location.pathname.replace(/\/+$/, '').endsWith('/240questions');

const INITIAL_VARIANT: QuizVariant = FULL_MODE ? 'extreme' : 'short';

// URL de resultado compartilhável: /results?est=65&rep=32.5&... (uma chave por
// eixo, valor = % do polo esquerdo, na mesma ordem de axes.json).
const AXIS_URL_KEYS = ['est', 'rep', 'pod', 'imi', 'dip', 'int', 'eco', 'con', 'com', 'rel', 'mor', 'tec'];

function parseSharedResultUrl(): number[] | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  if (path !== '/results') {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const rawValues = AXIS_URL_KEYS.map((key) => params.get(key));
  if (rawValues.some((raw) => raw === null || raw.trim() === '')) {
    return null;
  }
  const values = rawValues.map((raw) => Number(raw));
  if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
    return null;
  }
  return values;
}

const SHARED_RESULT_VALUES = parseSharedResultUrl();

function sharedResultUrl(result: QuizResult): string {
  const query = result.axes
    .map((axis, index) => `${AXIS_URL_KEYS[index] ?? `x${index}`}=${axis.leftPercent}`)
    .join('&');
  return `/results?${query}`;
}

function LoadingPanel({ message }: { message: string }) {
  return (
    <div className="loading-panel">
      <div className="loading-mark" aria-hidden="true">
        <div className="loading-spinner" />
      </div>
      <div>
        <h1>12 Axes</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

const QUIZ_FORMATS: QuizFormatOption[] = [
  { variant: 'short', ...t.formats.short },
  { variant: 'extended', ...t.formats.extended, featured: true },
  { variant: 'extreme', ...t.formats.extreme }
];

const HERO_LABELS = t.heroLabels;

const AXIS_EXPLANATIONS: Record<string, string> = t.axisExplanations;

const SPECTRUM_ITEMS = t.spectrumItems;

const FAQ_ITEMS = t.faqItems;

function buildQuizForVariant(payload: QuizPayload, variant: QuizVariant): QuizPayload {
  return variant === 'extreme' ? selectAllQuestionsBalanced(payload) : selectAndBalanceQuestions(payload);
}

// Sorteia um índice aleatório dentro de EXAMPLE_RESULTS.
function randomExampleIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

const TONE_RED_AXES = new Set([
  'imigracao',
  'intervencao',
  'controle',
  'religiao',
  'tecnologia'
]);

export default function App() {
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedVariant, setSelectedVariant] = useState<QuizVariant>(INITIAL_VARIANT);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(FULL_MODE || SHARED_RESULT_VALUES !== null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isHomeSeoReady, setIsHomeSeoReady] = useState(false);
  const [currentExample, setCurrentExample] = useState<ExampleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtended, setIsExtended] = useState(false);
  const [extendChoice, setExtendChoice] = useState<ExtendChoice | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const isAdvancingRef = useRef(false);
  // Pool completo (240 perguntas) recebido do backend, guardado para poder
  // sortear as 24 questões extras da extensão sem repetir as já respondidas.
  const poolRef = useRef<QuizPayload | null>(null);

  useEffect(() => {
    if (SHARED_RESULT_VALUES) {
      fetchSharedResult(SHARED_RESULT_VALUES)
        .then((sharedResult) => {
          setResult(sharedResult);
          setIsSharedView(true);
          setScreen('results');
        })
        .catch((err: Error) => setError(err.message))
        .finally(() => setIsLoading(false));
      return;
    }

    if (!FULL_MODE) {
      return;
    }

    fetchQuiz(INITIAL_VARIANT)
      .then((payload) => {
        poolRef.current = payload;
        setQuiz(buildQuizForVariant(payload, INITIAL_VARIANT));
        setScreen('quiz');
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  // Carrega os exemplos sob demanda (import dinâmico) em vez de embuti-los no
  // bundle inicial — cada visitante só usa 1 dos 16 exemplos por sessão, então
  // não faz sentido baixar o texto de todos de cara. Sorteia um índice fixo
  // pelo resto da sessão assim que o módulo resolve.
  useEffect(() => {
    let cancelled = false;
    import('./data/exampleResult').then(({ EXAMPLE_RESULTS }) => {
      if (cancelled) {
        return;
      }
      const index = randomExampleIndex(EXAMPLE_RESULTS.length);
      setCurrentExample(EXAMPLE_RESULTS[index] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (screen !== 'home') {
      setIsHomeSeoReady(false);
      return;
    }

    setIsHomeSeoReady(false);
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(() => setIsHomeSeoReady(true), { timeout: 1600 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setIsHomeSeoReady(true), 900);
    return () => window.clearTimeout(timeoutId);
  }, [screen]);

  const currentQuestion = quiz?.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const canFinish = Boolean(quiz && answeredCount === quiz.questions.length);

  const resultByAxis = useMemo(() => {
    if (!result) {
      return new Map<string, QuizResult['axes'][number]>();
    }
    return new Map(result.axes.map((axis) => [axis.axisId, axis]));
  }, [result]);
  const homeAxes = useMemo(
    () => quiz?.axes ?? HOME_AXES.map((axis) => ({ ...axis, ...(t.homeAxes[axis.id] ?? {}) })),
    [quiz]
  );

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.docTitle;
  }, []);

  function resetSharedUrl() {
    if (window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '') === '/results') {
      window.history.replaceState(null, '', '/');
    }
    setIsSharedView(false);
  }

  function openVariantChooser() {
    clearPendingAdvance();
    resetSharedUrl();
    setAnswers({});
    setResult(null);
    setError(null);
    setCurrentIndex(0);
    setIsExtended(false);
    setExtendChoice(null);
    setScreen('variant');
  }

  async function startQuiz(variant: QuizVariant = selectedVariant) {
    clearPendingAdvance();
    resetSharedUrl();
    setSelectedVariant(variant);
    setAnswers({});
    setResult(null);
    setError(null);
    setCurrentIndex(0);
    setIsExtended(false);
    setExtendChoice(null);
    setIsLoading(true);

    try {
      const nextQuiz = await fetchQuiz(variant);
      poolRef.current = nextQuiz;
      setQuiz(buildQuizForVariant(nextQuiz, variant));
      setScreen('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errLoadQuiz);
    } finally {
      setIsLoading(false);
    }
  }

  function clearPendingAdvance() {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    isAdvancingRef.current = false;
    setIsAdvancing(false);
  }

  function goToPreviousQuestion() {
    clearPendingAdvance();
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goToNextQuestion() {
    if (!currentQuestion || !answers[currentQuestion.id] || isAdvancingRef.current) {
      return;
    }
    clearPendingAdvance();
    setCurrentIndex((index) => Math.min((quiz?.questions.length ?? 1) - 1, index + 1));
  }

  function selectAnswer(answer: AnswerValue) {
    if (!currentQuestion || !quiz || isSubmitting || isAdvancingRef.current) {
      return;
    }
    const questionIndex = currentIndex;
    const nextAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(nextAnswers);
    setError(null);

    if (questionIndex === quiz.questions.length - 1) {
      handleQuizEnd(nextAnswers);
      return;
    }

    isAdvancingRef.current = true;
    setIsAdvancing(true);
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
    }
    advanceTimerRef.current = window.setTimeout(() => {
      setCurrentIndex((index) => (index === questionIndex ? questionIndex + 1 : index));
      isAdvancingRef.current = false;
      setIsAdvancing(false);
      advanceTimerRef.current = null;
    }, 200);
  }

  // Fim do quiz: na versão curta (36) ainda não estendida, oferece as 24
  // questões extras antes de calcular; nas demais, vai direto ao resultado.
  function handleQuizEnd(answerMap = answers) {
    if (quiz?.variant === 'short' && !isExtended) {
      clearPendingAdvance();
      setExtendChoice(null);
      setError(null);
      setScreen('extend');
      return;
    }
    void finishQuiz(answerMap);
  }

  // Igual às demais perguntas: clicar na opção já avança, sem botão "Avançar".
  function chooseExtend(choice: ExtendChoice) {
    if (isSubmitting) {
      return;
    }
    setExtendChoice(choice);
    if (choice === 'yes') {
      extendQuiz();
    } else {
      void finishQuiz();
    }
  }

  // Volta da tela de extensão para a última questão respondida.
  function goBackFromExtend() {
    if (!quiz) {
      return;
    }
    setScreen('quiz');
    setCurrentIndex(quiz.questions.length - 1);
  }

  // Estende o quiz curto de 36 → 60: sorteia 24 novas questões (2 por eixo,
  // uma LEFT e uma RIGHT), sem repetir as já respondidas, e segue na 37ª.
  function extendQuiz() {
    const pool = poolRef.current;
    if (!quiz || !pool) {
      void finishQuiz();
      return;
    }
    const usedIds = new Set(quiz.questions.map((question) => question.id));
    const extraQuestions = selectExtensionQuestions(pool, usedIds, 1);
    if (extraQuestions.length === 0) {
      void finishQuiz();
      return;
    }
    const startIndex = quiz.questions.length;
    const nextQuestions = [...quiz.questions, ...extraQuestions];
    setQuiz({ ...quiz, questions: nextQuestions, questionCount: nextQuestions.length });
    setIsExtended(true);
    setError(null);
    setCurrentIndex(startIndex);
    setScreen('quiz');
  }

  async function finishQuiz(answerMap = answers) {
    if (!quiz || isSubmitting) {
      return;
    }
    const firstMissingIndex = quiz.questions.findIndex((question) => !answerMap[question.id]);
    if (firstMissingIndex !== -1) {
      setCurrentIndex(firstMissingIndex);
      setError(t.errMissingAnswer);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const payload = quiz.questions.map((question) => ({
        questionId: question.id,
        answer: answerMap[question.id] as AnswerValue
      }));
      const nextResult = await submitResults(
        quiz.variant ?? selectedVariant,
        payload
      );
      setResult(nextResult);
      setIsSharedView(false);
      // URL compartilhável: quem abrir este link vê o mesmo resultado.
      window.history.replaceState(null, '', sharedResultUrl(nextResult));
      setScreen('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errCalc);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function downloadResultsPng() {
    if (!result || isSharing) {
      return;
    }
    setIsSharing(true);
    setError(null);
    const exportQuiz: QuizPayload = quiz ?? {
      title: '',
      description: '',
      variant: selectedVariant,
      questionCount: 0,
      questionsPerAxis: 0,
      axes: homeAxes,
      questions: [],
      answerOptions: []
    };

    let stage: HTMLDivElement | null = null;
    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      const [{ toPng }, shareCard] = await Promise.all([
        import('html-to-image'),
        import('./utils/shareCard')
      ]);
      const {
        SHARE_COLORS,
        SHARE_HEIGHT,
        SHARE_WIDTH,
        buildShareCard,
        drawShareImagesOnPng,
        prepareImagesForExport
      } = shareCard;

      const { stage: builtStage, target } = buildShareCard(result, exportQuiz);
      stage = builtStage;
      document.body.appendChild(stage);
      await prepareImagesForExport(target);

      let dataUrl = await toPng(target, {
        width: SHARE_WIDTH,
        height: SHARE_HEIGHT,
        backgroundColor: SHARE_COLORS.soft,
        pixelRatio: 1,
        cacheBust: false,
        skipFonts: true
      });
      dataUrl = await drawShareImagesOnPng(dataUrl, target);

      downloadDataUrl(
        dataUrl,
        `${t.shareFilePrefix}-${new Date().toISOString().slice(0, 10)}.png`
      );
      await tryNativeShare(dataUrl, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errImage);
    } finally {
      stage?.remove();
      setIsSharing(false);
    }
  }

  if (isLoading) {
    return (
      <main className="app-shell center-shell">
        <LoadingPanel message={t.loadingAnalysis} />
      </main>
    );
  }

  if (error && !quiz && !result && (FULL_MODE || SHARED_RESULT_VALUES !== null)) {
    return (
      <main className="app-shell center-shell">
        <div className="error-panel">
          <h1>12 Axes</h1>
          <p>{error}</p>
          <button className="secondary-button" type="button" onClick={() => window.location.reload()}>
            {t.tryAgain}
          </button>
        </div>
      </main>
    );
  }

  if (!quiz && screen === 'quiz') {
    return null;
  }
  if (!quiz && !result && screen === 'results') {
    return null;
  }

  return (
    <main className="app-shell" data-screen={screen}>
      <a className="skip-link" href="#conteudo-principal">
        {t.skipToContent}
      </a>
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => setScreen('home')} aria-label={t.backToStartAria}>
          <span className="brand-num">12</span>
          <span className="brand-word">axes</span>
        </button>
        {screen === 'home' && (
          <nav className="home-nav" aria-label={t.mainNavAria}>
            <a href="#como-funciona">{t.navHow}</a>
            <a href="#guia-eixos">{t.navAxes}</a>
            <a href="#espectro-politico">{t.navSpectrum}</a>
            <a href="#faq">{t.navFaq}</a>
            <a className="nav-support-link" href="#apoie">{t.navSupport}</a>
            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLang(LANG === 'pt' ? 'en' : 'pt')}
              aria-label={t.langToggleAria}
            >
              {t.langToggleLabel}
            </button>
          </nav>
        )}
        {(screen === 'quiz' || screen === 'extend' || screen === 'results') && (
          <button className="primary-button header-cta" type="button" onClick={() => void startQuiz(selectedVariant)}>
            {screen === 'results' ? t.redoQuiz : t.restartQuiz}
            <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        )}
      </header>
      <span id="conteudo-principal" className="skip-target" tabIndex={-1} />

      {screen === 'home' && (
        <section className="home-layout" id="inicio">
          <div className="home-grid">
            <div className="intro-panel">
              <span className="intro-eyebrow fade-up d-1">
                <strong>{t.heroEyebrow}</strong>
              </span>
              <h1 className="fade-up d-2">
                {t.h1Pre}<em>{t.h1Em}</em>{t.h1Post}
              </h1>
              <p className="intro-lead fade-up d-3">
                {t.introLead}
              </p>
              <div className="intro-actions fade-up d-4">
                <button className="primary-button hero-cta" type="button" onClick={openVariantChooser}>
                  {t.startQuiz}
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
                <a className="secondary-button" href="#guia-eixos">
                  {t.seeAxes}
                </a>
              </div>
              <div className="intro-meta fade-up d-5">
                {HERO_LABELS.map((label) => (
                  <span className="intro-meta-item" key={label}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="canvas-panel hero-result-teaser fade-up d-3" id="eixos">
              {currentExample && (
              <div className="hero-teaser-fade">
                <div className="hero-teaser-card">
                  <div className="hero-teaser-card-head">
                    <div className="hero-teaser-tag">
                      <span />
                      {t.heroTeaserTag}
                    </div>
                    <span className="hero-teaser-category">{currentExample.ideology.category}</span>
                  </div>
                  <div className="hero-teaser-top">
                    <div
                      className="compatibility-ring hero-teaser-ring"
                      style={{ ['--pct' as string]: currentExample.ideology.compatibility }}
                    >
                      <span>
                        {currentExample.ideology.compatibility}%<small>{t.heroTeaserLabel}</small>
                      </span>
                    </div>
                    <div className="hero-teaser-text">
                      <strong>{currentExample.ideology.name}</strong>
                      <p>{currentExample.ideology.description}</p>
                    </div>
                  </div>
                </div>
                <div className="hero-teaser-thumbs">
                  <div className="hero-teaser-thumb">
                    <div className="hero-teaser-thumb-frame">
                      <img
                        src={resolveCountryFlagSrc(currentExample.country.flagPath)}
                        alt={currentExample.country.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="hero-teaser-thumb-body">
                      <div className="hero-teaser-thumb-head">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
                        </svg>
                        {t.countryKicker}
                      </div>
                      <strong>{currentExample.country.name}</strong>
                      <p>{currentExample.country.description}</p>
                      <div className="hero-teaser-thumb-meter">
                        <div className="hero-teaser-thumb-meter-track">
                          <div
                            className="hero-teaser-thumb-meter-fill"
                            style={{ width: `${currentExample.country.compatibility}%` }}
                          />
                        </div>
                        <strong>{currentExample.country.compatibility}%</strong>
                      </div>
                    </div>
                  </div>
                  <div className="hero-teaser-thumb">
                    <div className="hero-teaser-thumb-frame is-portrait">
                      <img
                        src={resolvePersonalityImageSrc(currentExample.personality.imagePath)}
                        alt={currentExample.personality.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="hero-teaser-thumb-body">
                      <div className="hero-teaser-thumb-head">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        {t.personalityKicker}
                      </div>
                      <strong>{currentExample.personality.name}</strong>
                      <p>{currentExample.personality.description}</p>
                      <div className="hero-teaser-thumb-meter">
                        <div className="hero-teaser-thumb-meter-track">
                          <div
                            className="hero-teaser-thumb-meter-fill"
                            style={{ width: `${currentExample.personality.compatibility}%` }}
                          />
                        </div>
                        <strong>{currentExample.personality.compatibility}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>

          {isHomeSeoReady && (
          <div className="home-seo">
            <section className="seo-block fade-up" aria-labelledby="descubra">
              <div className="section-heading">
                <span className="eyebrow">{t.discoveryEyebrow}</span>
                <h2 id="descubra">{t.discoveryTitle}</h2>
                <p>{t.discoveryLead}</p>
              </div>
              <div className="discovery-grid">
                {t.discoveryItems.map((item) => (
                  <article className="discovery-card" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="seo-block example-result fade-up" aria-labelledby="exemplo-resultado">
              <div className="section-heading">
                <span className="eyebrow">{t.exampleEyebrow}</span>
                <h2 id="exemplo-resultado">{t.exampleTitle}</h2>
                <p>{t.exampleCaption}</p>
              </div>
              {currentExample && (
              <Suspense fallback={null}>
                <div className="example-result-fade">
                  <IdeologyMatchCard match={currentExample.ideology} featured />
                  <div className="axis-rows example-axis-rows">
                    {currentExample.axes.map((axisResult) => {
                      const axis = homeAxes.find((candidate) => candidate.id === axisResult.axisId);
                      return axis ? <AxisResultBar key={axisResult.axisId} axis={axis} result={axisResult} /> : null;
                    })}
                  </div>
                  <CountryMatchCard match={currentExample.country} />
                  <PersonalityMatchCard match={currentExample.personality} />
                </div>
              </Suspense>
              )}
              <div className="example-result-cta">
                <button className="primary-button" type="button" onClick={openVariantChooser}>
                  {t.exampleCta}
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="como-funciona">
              <div className="section-heading">
                <span className="eyebrow">{t.howEyebrow}</span>
                <h2 id="como-funciona">{t.howTitle}</h2>
                <p>{t.howLead}</p>
              </div>
              <div className="step-grid">
                {t.steps.map((step, index) => (
                  <article className="step-card" key={step.title}>
                    <span className="step-num">{index + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="guia-eixos">
              <div className="section-heading">
                <span className="eyebrow">{t.axesGuideEyebrow}</span>
                <h2 id="guia-eixos">{t.axesGuideTitle}</h2>
                <p>{t.axesGuideLead}</p>
              </div>
              <div className="axis-guide-grid">
                {homeAxes.map((axis, index) => (
                  <article
                    key={axis.id}
                    className={`axis-guide-card${TONE_RED_AXES.has(axis.id) ? ' tone-red' : ''}`}
                  >
                    <span className="axis-guide-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="axis-guide-icon" aria-hidden="true">
                      <AxisIcon id={axis.id} />
                    </span>
                    <div className="axis-guide-copy">
                      <h3>{axis.label}: {axis.leftPole} × {axis.rightPole}</h3>
                      <p>{AXIS_EXPLANATIONS[axis.id]}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="espectro-politico">
              <div className="section-heading">
                <span className="eyebrow">{t.spectrumEyebrow}</span>
                <h2 id="espectro-politico">{t.spectrumTitle}</h2>
                <p>{t.spectrumLead}</p>
              </div>
              <div className="spectrum-grid">
                {SPECTRUM_ITEMS.map((item) => (
                  <article className={`spectrum-card tone-${item.tone}`} key={item.id}>
                    <span className="spectrum-dot" aria-hidden="true" />
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="faq">
              <div className="section-heading">
                <span className="eyebrow">{t.navFaq}</span>
                <h2 id="faq">{t.faqTitle}</h2>
              </div>
              <div className="faq-list">
                {FAQ_ITEMS.map((item) => (
                  <details className="faq-item" key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="seo-block final-cta fade-up" aria-labelledby="versoes-teste">
              <div className="section-heading">
                <span className="eyebrow">{t.versionsEyebrow}</span>
                <h2 id="versoes-teste">{t.versionsTitle}</h2>
                <p>{t.versionsLead}</p>
              </div>
              <div className="home-format-grid">
                {QUIZ_FORMATS.map((format) => (
                  <article className="home-format-card" key={format.variant}>
                    <span>{format.label}</span>
                    <h3>{format.questionCount}</h3>
                    <p>{format.description}</p>
                    <strong>{format.duration}</strong>
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => void startQuiz(format.variant)}
                    >
                      {format.action}
                      <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14" />
                        <path d="m13 6 6 6-6 6" />
                      </svg>
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <SupportSection />
          </div>
          )}
        </section>
      )}

      {screen === 'variant' && (
        <section className="variant-layout" aria-labelledby="variant-title">
          <div className="variant-heading fade-up d-1">
            <span className="eyebrow">{t.variantEyebrow}</span>
            <h1 id="variant-title">{t.variantTitle}</h1>
            <p>{t.variantLead}</p>
          </div>

          <div className="variant-grid">
            {QUIZ_FORMATS.map((format, index) => (
              <button
                key={format.variant}
                className={`variant-card fade-up d-${index + 2}${format.featured ? ' featured' : ''}`}
                type="button"
                onClick={() => void startQuiz(format.variant)}
              >
                <span className="variant-card-kicker">{format.label}</span>
                <span className="variant-card-title">{format.questionCount}</span>
                <span className="variant-card-description">{format.description}</span>
                <span className="variant-card-meta">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  {format.duration}
                </span>
                <span className="variant-card-action">{format.action}</span>
              </button>
            ))}
          </div>
          {error && <p className="inline-error" role="alert">{error}</p>}
        </section>
      )}

      {screen === 'quiz' && quiz && currentQuestion && (
        <Suspense
          fallback={(
            <section className="quiz-layout">
              <LoadingPanel message={t.loadingQuiz} />
            </section>
          )}
        >
        <section className="quiz-layout">
          <ProgressHeader current={currentIndex + 1} total={quiz.questions.length} />

          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            axisLabel={quiz.axes.find((axis) => axis.id === currentQuestion.axisId)?.label}
            options={quiz.answerOptions}
            selected={answers[currentQuestion.id]}
            disabled={isAdvancing || isSubmitting}
            onSelect={selectAnswer}
          />

          <nav className="quiz-actions" aria-label={t.quizNavAria}>
            <button
              className="secondary-button"
              type="button"
              onClick={goToPreviousQuestion}
              disabled={currentIndex === 0 || isAdvancing}
            >
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
              {t.back}
            </button>
            {currentIndex < quiz.questions.length - 1 ? (
              <button
                className="primary-button"
                type="button"
                onClick={goToNextQuestion}
                disabled={!answers[currentQuestion.id] || isAdvancing}
              >
                {t.next}
                <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={() => handleQuizEnd()} disabled={!canFinish || isSubmitting}>
                {quiz.variant === 'short' && !isExtended ? t.next : isSubmitting ? t.calculating : t.seeResult}
                <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            )}
          </nav>
          {error && <p className="inline-error" role="alert">{error}</p>}
        </section>
        </Suspense>
      )}

      {screen === 'extend' && quiz && (
        <section className="quiz-layout">
          <article className="question-card extend-card" aria-labelledby="extend-title">
            <header className="question-card-header">
              <p className="question-axis">{t.progress(quiz.questions.length, 60)}</p>
              <h2 id="extend-title">{t.extendTitle}</h2>
            </header>
            <div className="answer-grid" role="radiogroup" aria-label={t.extendAria}>
              <button
                className={extendChoice === 'yes' ? 'answer-button selected' : 'answer-button'}
                data-answer="STRONGLY_AGREE"
                type="button"
                role="radio"
                aria-checked={extendChoice === 'yes'}
                disabled={isSubmitting}
                onClick={() => chooseExtend('yes')}
              >
                <span className="answer-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="m6 12 4 4 8-8" />
                  </svg>
                </span>
                <span>{t.extendYes}</span>
                <span aria-hidden="true" />
              </button>
              <button
                className={extendChoice === 'no' ? 'answer-button selected' : 'answer-button'}
                data-answer="NEUTRAL"
                type="button"
                role="radio"
                aria-checked={extendChoice === 'no'}
                disabled={isSubmitting}
                onClick={() => chooseExtend('no')}
              >
                <span className="answer-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="m7 7 10 10" />
                    <path d="m17 7-10 10" />
                  </svg>
                </span>
                <span>{t.extendNo}</span>
                <span aria-hidden="true" />
              </button>
            </div>
          </article>

          <nav className="quiz-actions" aria-label={t.quizNavAria}>
            <button className="secondary-button" type="button" onClick={goBackFromExtend} disabled={isSubmitting}>
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
              {t.back}
            </button>
          </nav>
          {error && <p className="inline-error" role="alert">{error}</p>}
        </section>
      )}

      {screen === 'results' && result && (quiz || isSharedView) && (
        <Suspense
          fallback={(
            <section className="results-layout">
              <LoadingPanel message={t.loadingResult} />
            </section>
          )}
        >
        <section className="results-layout" id="resultados">
          <header className="results-hero">
            <div className="results-hero-text fade-up d-1">
              <span className="results-eyebrow">{t.resultsEyebrow}</span>
              <h1>
                {t.resultsH1Pre}<em>{t.resultsH1Em}</em>
              </h1>
              <p>{quiz ? t.resultsLead(quiz.questions.length) : t.resultsLeadShared}</p>
            </div>
            <aside className="results-meta-card fade-up d-2" aria-label={t.resultsSummaryAria}>
              {quiz && (
                <div className="results-meta-row">
                  <span>{t.metaAnswered}</span>
                  <strong>{quiz.questions.length}</strong>
                </div>
              )}
              <div className="results-meta-row">
                <span>{t.metaAxes}</span>
                <strong>12</strong>
              </div>
              <div className="results-meta-row">
                <span>{t.metaTop}</span>
                <strong>{result.topMatch.compatibility.toFixed(1)}%</strong>
              </div>
            </aside>
          </header>

          <div className="fade-up d-3">
            <IdeologyMatchCard match={result.topMatch} featured />
          </div>

          <section className="results-section results-section-axes fade-up d-4">
            <div className="section-heading">
              <span className="eyebrow">{t.axesSectionEyebrow}</span>
              <h2>{t.axesSectionTitle}</h2>
            </div>
            <div className="axis-rows">
              {(quiz?.axes ?? homeAxes).map((axis) => {
                const axisResult = resultByAxis.get(axis.id);
                return axisResult ? <AxisResultBar key={axis.id} axis={axis} result={axisResult} /> : null;
              })}
            </div>
          </section>

          <div className="fade-up d-5">
            <CountryMatchCard match={result.topCountryMatch} />
          </div>

          <div className="fade-up d-5">
            <PersonalityMatchCard match={result.topPersonalityMatch} />
          </div>

          <section className="results-section fade-up d-5">
            <div className="section-heading">
              <span className="eyebrow">{t.proximityEyebrow}</span>
              <h2>{t.otherMatches}</h2>
            </div>
            <div className="match-grid">
              {result.matches.slice(1, 4).map((match) => (
                <IdeologyMatchCard key={match.ideologyId} match={match} />
              ))}
            </div>
          </section>

          <div className="results-cta fade-up d-5" data-export-hidden="true">
            <button className="primary-button" type="button" onClick={() => void startQuiz(selectedVariant)}>
              {t.redoAnalysis}
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <path d="M21 4v5h-5" />
              </svg>
            </button>
            <button className="secondary-button" type="button" onClick={() => void downloadResultsPng()} disabled={isSharing}>
              {isSharing ? t.generatingPng : t.share}
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
            </button>
            {error && <p className="inline-error" role="alert">{error}</p>}
          </div>

          <SupportSection />
        </section>
        </Suspense>
      )}
    </main>
  );
}

// Abre a folha de compartilhamento nativa (iPhone/Android) com a imagem do
// resultado e um texto pronto. Em navegadores sem Web Share API (ou se o
// usuário cancelar), fica só o download que já aconteceu antes.
async function tryNativeShare(dataUrl: string, result: QuizResult) {
  if (typeof navigator.share !== 'function') {
    return;
  }
  try {
    const message = t.shareMessage(
      result.topMatch.name,
      Math.round(result.topMatch.compatibility),
      result.topCountryMatch.name,
      Math.round(result.topCountryMatch.compatibility),
      result.topPersonalityMatch.name,
      Math.round(result.topPersonalityMatch.compatibility)
    );

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], `${t.shareFilePrefix}.png`, { type: 'image/png' });
    const textShare: ShareData = { title: t.shareTitle, text: message };
    const fileShare: ShareData = { ...textShare, files: [file] };

    if (navigator.canShare?.({ files: [file] }) === false) {
      await navigator.share(textShare);
      return;
    }

    try {
      await navigator.share(fileShare);
    } catch (err) {
      if (isShareAbort(err)) {
        return;
      }
      await navigator.share(textShare);
    }
  } catch {
    // Cancelado pelo usuário ou sem permissão — o download já garantiu a imagem.
  }
}

function isShareAbort(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
