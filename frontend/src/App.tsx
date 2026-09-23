import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { selectAllQuestionsBalanced, selectAndBalanceQuestions, selectExtensionQuestions } from './utils/quizSelection';
import { HOME_AXES } from './data/homeAxes';
import type { ExampleResult } from './data/exampleResult';
import { LANG, setLang, t } from './i18n';
import { fetchQuiz, fetchSharedResult, submitResults } from './services/quizApi';
import type { AnswerValue, QuizPayload, QuizResult, QuizVariant } from './types/quiz';
import { HomeScreen } from './components/editorial/HomeScreen';
import { VariantScreen } from './components/editorial/VariantScreen';
import { ResultsScreen } from './components/editorial/ResultsScreen';
import { ArrowIcon, Logo, SiteFooter } from './components/editorial/primitives';
import { useScrollReveal } from './hooks/useScrollReveal';
import ElectionApp from './election/ElectionApp';

type Screen = 'home' | 'variant' | 'quiz' | 'extend' | 'results';
type ExtendChoice = 'yes' | 'no';

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

// Esqueleto com a forma real do que vai chegar (enunciado + cinco respostas),
// em vez de um spinner que nao diz nada sobre o conteudo.
function QuizSkeleton({ message }: { message: string }) {
  return (
    <div className="skeleton-stack" role="status" aria-live="polite">
      <span className="sr-only">{message}</span>
      <div className="skeleton-bar" data-w="45" aria-hidden="true" />
      <div className="skeleton-bar" data-w="70" aria-hidden="true" />
      <div className="skeleton-bar" data-tall="true" aria-hidden="true" />
      <div className="skeleton-bar" data-tall="true" aria-hidden="true" />
      <div className="skeleton-bar" data-tall="true" aria-hidden="true" />
    </div>
  );
}

function buildQuizForVariant(payload: QuizPayload, variant: QuizVariant): QuizPayload {
  return variant === 'extreme' ? selectAllQuestionsBalanced(payload) : selectAndBalanceQuestions(payload);
}

// Sorteia um índice aleatório dentro de EXAMPLE_RESULTS.
function randomExampleIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function MainApp() {
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
  // 'forward' | 'back': define de que lado a proxima pergunta entra.
  const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');
  const [isSharing, setIsSharing] = useState(false);
  const [isHomeSeoReady, setIsHomeSeoReady] = useState(false);
  const [currentExample, setCurrentExample] = useState<ExampleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtended, setIsExtended] = useState(false);
  const [extendChoice, setExtendChoice] = useState<ExtendChoice | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Home: blocos abaixo da dobra entram ao rolar (conteudo editorial longo).
  useScrollReveal(screen === 'home', [screen, isHomeSeoReady, currentExample]);

  // Resultados: cada secao entra ao alcancar a viewport. A pagina e longa e a
  // leitura e sequencial, entao o conteudo se revela conforme o usuario desce.
  useScrollReveal(screen === 'results' && Boolean(result), [screen, result]);


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

  // Cada tela é uma página própria: sem isso a tela nova abre na altura em que
  // o usuário estava rolando a anterior.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  function goHome() {
    setIsMenuOpen(false);
    setScreen('home');
  }

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
    setNavDirection('back');
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goToNextQuestion() {
    if (!currentQuestion || !answers[currentQuestion.id] || isAdvancingRef.current) {
      return;
    }
    clearPendingAdvance();
    setNavDirection('forward');
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
    setNavDirection('forward');
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
        await Promise.allSettled([
          document.fonts.load('400 30px "Poppins"'),
          document.fonts.load('500 30px "Poppins"'),
          document.fonts.load('600 30px "Poppins"'),
          document.fonts.load('600 30px "Sora"'),
          document.fonts.load('700 30px "Sora"'),
          document.fonts.load('800 30px "Sora"')
        ]);
        await document.fonts.ready;
      }

      const [{ toPng }, shareCard] = await Promise.all([
        import('html-to-image'),
        import('./utils/shareCard')
      ]);
      const {
        SHARE_HEIGHT,
        SHARE_WIDTH,
        buildShareCard,
        drawShareImagesOnPng,
        prepareImagesForExport
      } = shareCard;

      const { stage: builtStage, target, backgroundColor } = buildShareCard(result, exportQuiz);
      stage = builtStage;
      document.body.appendChild(stage);
      await prepareImagesForExport(target);

      let dataUrl = await toPng(target, {
        width: SHARE_WIDTH,
        height: SHARE_HEIGHT,
        backgroundColor,
        pixelRatio: 1,
        cacheBust: false,
        skipFonts: false
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
    <div className="app-shell" data-screen={screen}>
      <a className="skip-link" href="#conteudo-principal">
        {t.skipToContent}
      </a>
      <header className="ed e-nav">
        <div className="e-wrap">
          <Logo onClick={goHome} />
          {screen === 'home' && (
            <>
              <nav
                className={isMenuOpen ? 'e-nav-links e-open' : 'e-nav-links'}
                aria-label={t.mainNavAria}
                onClick={() => setIsMenuOpen(false)}
              >
                <a href="#como-funciona">{t.navHow}</a>
                <a href="#guia-eixos">{t.navAxes}</a>
                <a href="#espectro-politico">{t.navSpectrum}</a>
                <a href="#faq">{t.navFaq}</a>
                <a href="#apoie">{t.navSupport}</a>
                <button
                  className="e-lang"
                  type="button"
                  onClick={() => setLang(LANG === 'pt' ? 'en' : 'pt')}
                  aria-label={t.langToggleAria}
                >
                  {t.langToggleLabel}
                </button>
              </nav>
              <button className="e-btn e-btn-primary e-btn-sm" type="button" onClick={openVariantChooser}>
                {t.navStart} <ArrowIcon />
              </button>
              <button
                className="e-menu-btn"
                type="button"
                aria-label={t.menuAria}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            </>
          )}
          {screen === 'variant' && (
            <button className="e-back" type="button" onClick={goHome}>
              <ArrowIcon />
              {t.backToStart}
            </button>
          )}
          {(screen === 'quiz' || screen === 'extend' || screen === 'results') && (
            <button className="e-btn e-btn-primary e-btn-sm" type="button" onClick={() => void startQuiz(selectedVariant)}>
              {screen === 'results' ? t.redoQuiz : t.restartQuiz} <ArrowIcon />
            </button>
          )}
        </div>
      </header>
      <span id="conteudo-principal" className="skip-target" tabIndex={-1} />

      {screen === 'home' && (
        <HomeScreen
          example={currentExample}
          axes={homeAxes}
          showBelowFold={isHomeSeoReady}
          onOpenChooser={openVariantChooser}
          onStart={(variant) => void startQuiz(variant)}
        />
      )}

      {screen === 'variant' && <VariantScreen error={error} onStart={(variant) => void startQuiz(variant)} />}

      {screen === 'quiz' && quiz && currentQuestion && (
        <Suspense
          fallback={(
            <section className="quiz-layout">
              <QuizSkeleton message={t.loadingQuiz} />
            </section>
          )}
        >
        <section className="quiz-layout">
          <ProgressHeader
            current={currentIndex + 1}
            total={quiz.questions.length}
            questionsPerAxis={quiz.questionsPerAxis}
            axisCount={quiz.axes.length}
          />

          <div
            className="question-stage"
            data-direction={navDirection}
            data-leaving={isAdvancing ? 'true' : undefined}
          >
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            axisLabel={quiz.axes.find((axis) => axis.id === currentQuestion.axisId)?.label}
            options={quiz.answerOptions}
            selected={answers[currentQuestion.id]}
            disabled={isAdvancing || isSubmitting}
            onSelect={selectAnswer}
          />
          </div>

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
        <ResultsScreen
          result={result}
          quiz={quiz}
          axes={homeAxes}
          axisResults={resultByAxis}
          isSharing={isSharing}
          error={error}
          onRedo={() => void startQuiz(selectedVariant)}
          onShare={() => void downloadResultsPng()}
        />
      )}

      {(screen === 'home' || screen === 'results') && <SiteFooter />}
    </div>
  );
}

export default function App() {
  return window.location.pathname.replace(/\/+$/, '') .startsWith('/eleicoes2026') ? <ElectionApp /> : <MainApp />;
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
