import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { selectAllQuestionsBalanced, selectAndBalanceQuestions } from './utils/quizSelection';
import { HOME_AXES } from './data/homeAxes';
import type { ExampleResult } from './data/exampleResult';
import { LANG, setLang, t } from './i18n';
import { fetchQuiz, fetchSharedResult, submitResults } from './services/quizApi';
import type { AnswerValue, ArchetypeQuestion, QuizPayload, QuizResult, QuizVariant } from './types/quiz';
import { HomeScreen } from './components/editorial/HomeScreen';
import { VariantScreen } from './components/editorial/VariantScreen';
import { ResultsScreen } from './components/editorial/ResultsScreen';
import { ArrowIcon, Logo, SiteFooter } from './components/editorial/primitives';
import { useScrollReveal } from './hooks/useScrollReveal';
import { CHRISTIAN_DENOMINATIONS, parseReligion, RELIGION_CHOICES, type Religion } from './utils/religion';
import {
  answeredCount as savedAnsweredCount,
  clearProgress,
  loadProgress,
  restoreQuiz,
  saveProgress,
  type SavedProgress
} from './utils/quizProgress';
import { RELIGION_ICONS, RELIGION_QUESTION_ICON } from './data/religionIcons';

type Screen = 'home' | 'variant' | 'quiz' | 'archetype' | 'results';

const ProgressHeader = lazy(() =>
  import('./components/ProgressHeader').then((module) => ({ default: module.ProgressHeader }))
);
import { ArchetypeCard } from './components/ArchetypeCard';

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
// Link sem religion (ou com valor desconhecido) = ranking geral, sem filtro.
const SHARED_RELIGION: Religion | null =
  SHARED_RESULT_VALUES && typeof window !== 'undefined'
    ? parseReligion(new URLSearchParams(window.location.search).get('religion'))
    : null;

function sharedResultUrl(result: QuizResult, religion: Religion | null = null): string {
  const query = result.axes
    .map((axis, index) => `${AXIS_URL_KEYS[index] ?? `x${index}`}=${axis.leftPercent}`)
    .join('&');
  return `/results?${query}${religion ? `&religion=${religion}` : ''}`;
}

// Últimas perguntas do bloco de arquétipos: religião (letras A-D + "sem religião") e, só para
// quem escolhe cristianismo, a vertente (católica, protestante ou ortodoxa). Nenhuma das duas vai
// para o backend como arquétipo; viram o parâmetro religion do resultado.
const RELIGION_STEP_ID = 'religiao';
const RELIGION_OPTION_IDS = ['A', 'B', 'C', 'D', 'E'];
const DENOMINATION_STEP_ID = 'denominacao';
const DENOMINATION_OPTION_IDS = ['A', 'B', 'C'];

function religionQuestion(): ArchetypeQuestion {
  return {
    id: RELIGION_STEP_ID,
    label: t.religionLabel,
    text: t.religionQuestion,
    icon: RELIGION_QUESTION_ICON,
    options: [...RELIGION_CHOICES, 'none' as const].map((id, index) => ({
      id: RELIGION_OPTION_IDS[index],
      text: id === 'none' ? t.religionNone : t.religionNames[id],
      icon: RELIGION_ICONS[id]
    }))
  };
}

function denominationQuestion(): ArchetypeQuestion {
  return {
    id: DENOMINATION_STEP_ID,
    label: t.denominationLabel,
    text: t.denominationQuestion,
    icon: RELIGION_QUESTION_ICON,
    options: CHRISTIAN_DENOMINATIONS.map((id, index) => ({
      id: DENOMINATION_OPTION_IDS[index],
      text: t.denominationNames[id],
      icon: RELIGION_ICONS[id]
    }))
  };
}

// Escolheu cristianismo na pergunta de religião? Então vem a pergunta da vertente.
function chosenChristianity(choices: Record<string, string>): boolean {
  return choices[RELIGION_STEP_ID] === RELIGION_OPTION_IDS[RELIGION_CHOICES.indexOf('christianity')];
}

function buildArchetypeSteps(
  archetypes: ArchetypeQuestion[] | undefined,
  choices: Record<string, string>
): ArchetypeQuestion[] {
  return [
    ...(archetypes ?? []),
    religionQuestion(),
    ...(chosenChristianity(choices) ? [denominationQuestion()] : [])
  ];
}

// Religião usada no filtro do resultado: a vertente cristã escolhida ou a outra religião.
function resolveReligion(choices: Record<string, string>): Religion | null {
  if (chosenChristianity(choices)) {
    return CHRISTIAN_DENOMINATIONS[DENOMINATION_OPTION_IDS.indexOf(choices[DENOMINATION_STEP_ID] ?? '')] ?? null;
  }
  const choice = RELIGION_CHOICES[RELIGION_OPTION_IDS.indexOf(choices[RELIGION_STEP_ID] ?? '')];
  return choice && choice !== 'christianity' ? choice : null;
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
  const [religion, setReligion] = useState<Religion | null>(SHARED_RELIGION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  // Toggle do desktop; no mobile fica escondido e sempre ligado.
  const [autoAdvance, setAutoAdvance] = useState(true);
  // 'forward' | 'back': define de que lado a proxima pergunta entra.
  const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');
  const [isSharing, setIsSharing] = useState(false);
  const [isHomeSeoReady, setIsHomeSeoReady] = useState(false);
  const [currentExample, setCurrentExample] = useState<ExampleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archetypeIndex, setArchetypeIndex] = useState(0);
  const [archetypeChoices, setArchetypeChoices] = useState<Record<string, string>>({});
  const [archetypeDone, setArchetypeDone] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Quiz deixado pela metade em outra visita (ou antes de um erro/recarga).
  const [savedProgress, setSavedProgress] = useState<SavedProgress | null>(() =>
    SHARED_RESULT_VALUES ? null : loadProgress()
  );
  const advanceTimerRef = useRef<number | null>(null);
  const isAdvancingRef = useRef(false);
  // Pool completo (240 perguntas) recebido do backend, guardado para poder
  // sortear as 24 questões extras da extensão sem repetir as já respondidas.
  const poolRef = useRef<QuizPayload | null>(null);

  // Perguntas de arquétipo do backend + a de religião, no mesmo bloco e na mesma barra.
  const archetypeSteps = useMemo(
    () => buildArchetypeSteps(quiz?.archetypeQuestions, archetypeChoices),
    [quiz, archetypeChoices]
  );

  useEffect(() => {
    if (SHARED_RESULT_VALUES) {
      fetchSharedResult(SHARED_RESULT_VALUES, SHARED_RELIGION)
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
        // Quem recarrega /240questions no meio do quiz continua de onde parou.
        const saved = loadProgress();
        const restored = saved && saved.variant === INITIAL_VARIANT ? restoreQuiz(payload, saved) : null;
        if (saved && restored) {
          applyProgress(restored, saved);
          return;
        }
        if (saved) {
          clearProgress();
          setSavedProgress(null);
        }
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

  // Guarda o andamento a cada resposta: se a página recarregar ou quebrar, dá para continuar.
  useEffect(() => {
    if (!quiz || (screen !== 'quiz' && screen !== 'archetype')) {
      return;
    }
    if (Object.keys(answers).length === 0 && Object.keys(archetypeChoices).length === 0) {
      return;
    }
    saveProgress({
      variant: quiz.variant ?? selectedVariant,
      questionIds: quiz.questions.map((question) => question.id),
      answers,
      archetypeChoices,
      stage: screen === 'archetype' ? 'archetype' : 'quiz',
      index: screen === 'archetype' ? archetypeIndex : currentIndex
    });
  }, [quiz, screen, answers, archetypeChoices, currentIndex, archetypeIndex, selectedVariant]);

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
    setArchetypeIndex(0);
    setArchetypeChoices({});
    setArchetypeDone(false);
    setScreen('variant');
  }

  async function startQuiz(variant: QuizVariant = selectedVariant) {
    clearPendingAdvance();
    resetSharedUrl();
    clearProgress();
    setSavedProgress(null);
    setSelectedVariant(variant);
    setAnswers({});
    setResult(null);
    setError(null);
    setCurrentIndex(0);
    setArchetypeIndex(0);
    setArchetypeChoices({});
    setArchetypeDone(false);
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

  // Põe na tela um quiz guardado: mesmas perguntas, respostas e posição.
  function applyProgress(restored: QuizPayload, saved: SavedProgress) {
    const lastQuestion = Math.max(0, restored.questions.length - 1);
    const archetypeCount = (restored.archetypeQuestions?.length ?? 0) + 1;
    setSelectedVariant(saved.variant);
    setQuiz(restored);
    setAnswers(saved.answers);
    setArchetypeChoices(saved.archetypeChoices);
    setArchetypeDone(false);
    setResult(null);
    setError(null);
    if (saved.stage === 'archetype') {
      setCurrentIndex(lastQuestion);
      setArchetypeIndex(Math.min(saved.index, archetypeCount - 1));
      setScreen('archetype');
    } else {
      setCurrentIndex(Math.min(saved.index, lastQuestion));
      setArchetypeIndex(0);
      setScreen('quiz');
    }
  }

  async function resumeProgress() {
    if (!savedProgress) {
      return;
    }
    clearPendingAdvance();
    setError(null);
    setIsLoading(true);
    try {
      const payload = await fetchQuiz(savedProgress.variant);
      const restored = restoreQuiz(payload, savedProgress);
      if (!restored) {
        // As perguntas mudaram depois de um deploy: não dá para continuar com segurança.
        clearProgress();
        setSavedProgress(null);
        setError(t.resumeUnavailable);
        return;
      }
      poolRef.current = payload;
      resetSharedUrl();
      applyProgress(restored, savedProgress);
      setSavedProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errLoadQuiz);
    } finally {
      setIsLoading(false);
    }
  }

  function discardProgress() {
    clearProgress();
    setSavedProgress(null);
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

    if (!autoAdvance) {
      return;
    }

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
  // Fim das perguntas: primeiro as perguntas de arquétipo, depois o envio.
  function handleQuizEnd(answerMap = answers) {
    if (!quiz || isSubmitting) {
      return;
    }
    const firstMissingIndex = quiz.questions.findIndex((question) => !answerMap[question.id]);
    if (firstMissingIndex !== -1) {
      setCurrentIndex(firstMissingIndex);
      setError(t.errMissingAnswer);
      return;
    }
    clearPendingAdvance();
    setError(null);
    if (!archetypeDone) {
      setArchetypeIndex(0);
      setScreen('archetype');
      return;
    }
    void submitQuiz(answerMap);
  }

  // Escolher uma alternativa já avança; depois da última, calcula o resultado.
  function chooseArchetype(optionId: string) {
    const question = archetypeSteps[archetypeIndex];
    if (!quiz || !question || isSubmitting || isAdvancingRef.current) {
      return;
    }
    const nextChoices = { ...archetypeChoices, [question.id]: optionId };
    setArchetypeChoices(nextChoices);
    advanceArchetype(nextChoices, true);
  }

  function skipArchetype() {
    const question = archetypeSteps[archetypeIndex];
    if (!question || isSubmitting || isAdvancingRef.current) {
      return;
    }
    const nextChoices = { ...archetypeChoices };
    delete nextChoices[question.id];
    setArchetypeChoices(nextChoices);
    advanceArchetype(nextChoices, false);
  }

  function advanceArchetype(choices: Record<string, string>, withPause: boolean) {
    // A vertente cristã só entra na lista depois de escolher cristianismo, então conta com as novas escolhas.
    if (archetypeIndex >= buildArchetypeSteps(quiz?.archetypeQuestions, choices).length - 1) {
      setArchetypeDone(true);
      void submitQuiz(answers, choices);
      return;
    }
    setNavDirection('forward');
    if (!withPause) {
      setArchetypeIndex((index) => index + 1);
      return;
    }
    isAdvancingRef.current = true;
    setIsAdvancing(true);
    advanceTimerRef.current = window.setTimeout(() => {
      setArchetypeIndex((index) => index + 1);
      isAdvancingRef.current = false;
      setIsAdvancing(false);
      advanceTimerRef.current = null;
    }, 200);
  }

  function goBackFromArchetype() {
    clearPendingAdvance();
    setNavDirection('back');
    if (archetypeIndex > 0) {
      setArchetypeIndex((index) => index - 1);
      return;
    }
    if (quiz) {
      setScreen('quiz');
      setCurrentIndex(quiz.questions.length - 1);
    }
  }

  async function submitQuiz(answerMap = answers, archetype = archetypeChoices) {
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
      const { [RELIGION_STEP_ID]: _religion, [DENOMINATION_STEP_ID]: _denomination, ...archetypeOnly } = archetype;
      const chosenReligion = resolveReligion(archetype);
      const nextResult = await submitResults(
        quiz.variant ?? selectedVariant,
        payload,
        archetypeOnly,
        chosenReligion
      );
      setResult(nextResult);
      clearProgress();
      setIsSharedView(false);
      setReligion(chosenReligion);
      // URL compartilhável: quem abrir este link vê o mesmo resultado.
      window.history.replaceState(null, '', sharedResultUrl(nextResult, chosenReligion));
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
      const { buildShareCard, renderSharePng } = shareCard;

      const { stage: builtStage, target } = buildShareCard(result, exportQuiz, religion);
      stage = builtStage;
      document.body.appendChild(stage);

      const dataUrl = await renderSharePng(target, toPng);

      downloadDataUrl(
        dataUrl,
        `${t.shareFilePrefix}-${new Date().toISOString().slice(0, 10)}.png`
      );
      // Libera o botão antes da folha de compartilhamento: se ela ficar aberta ou
      // nunca resolver, o botão não pode ficar preso em "gerando".
      stage.remove();
      stage = null;
      setIsSharing(false);
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
    <div className="app-shell" data-screen={screen === 'archetype' ? 'quiz' : screen}>
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
                <a href={`${LANG === 'en' ? '/en' : ''}/ideologies`}>{t.navIdeologies}</a>
                <a href={`${LANG === 'en' ? '/en' : ''}/personalities`}>{t.navPersonalities}</a>
                <a href={`${LANG === 'en' ? '/en' : ''}/countries`}>{t.navCountries}</a>
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
          {(screen === 'quiz' || screen === 'archetype' || screen === 'results') && (
            <button className="e-btn e-btn-primary e-btn-sm" type="button" onClick={() => void startQuiz(selectedVariant)}>
              {screen === 'results' ? t.redoQuiz : t.restartQuiz} <ArrowIcon />
            </button>
          )}
        </div>
      </header>
      <span id="conteudo-principal" className="skip-target" tabIndex={-1} />

      {screen === 'home' && (savedProgress || error) && (
        <div className="ed e-resume" role="status" aria-live="polite">
          <div className="e-wrap">
            <div className="e-resume-card e-dark">
              {savedProgress && (
                <>
                  <div className="e-resume-body">
                    <p className="e-eyebrow">{t.resumeEyebrow}</p>
                    <h3>{t.resumeTitle}</h3>
                    <p className="e-resume-text">
                      {t.resumeBody(savedAnsweredCount(savedProgress), savedProgress.questionIds.length)}
                    </p>
                    <div className="e-resume-bar" aria-hidden="true">
                      <span
                        style={{
                          width: `${Math.max(2, Math.round((savedAnsweredCount(savedProgress) / savedProgress.questionIds.length) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="e-resume-actions">
                    <button className="e-btn e-btn-light" type="button" onClick={() => void resumeProgress()}>
                      {t.resumeContinue} <ArrowIcon />
                    </button>
                    <button className="e-btn e-btn-ghost" type="button" onClick={discardProgress}>
                      {t.resumeDiscard}
                    </button>
                  </div>
                </>
              )}
              {error && <p className="e-resume-error" role="alert">{error}</p>}
            </div>
          </div>
        </div>
      )}

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

      {/* Quiz e perguntas de arquétipo dividem o mesmo layout: o cabeçalho e a
          barra não remontam na passagem, só o card troca (sem a animação de
          entrada da tela). */}
      {quiz && ((screen === 'quiz' && currentQuestion) || (screen === 'archetype' && archetypeSteps[archetypeIndex])) && (
        <Suspense
          fallback={(
            <section className="quiz-layout">
              <QuizSkeleton message={t.loadingQuiz} />
            </section>
          )}
        >
        <section className="quiz-layout">
          <ProgressHeader
            current={screen === 'archetype' ? quiz.questions.length : currentIndex + 1}
            total={quiz.questions.length}
            questionsPerAxis={quiz.questionsPerAxis}
            axisCount={quiz.axes.length}
            extraCount={archetypeSteps.length}
            extraCurrent={screen === 'archetype' ? archetypeIndex + 1 : undefined}
          />

          {screen === 'quiz' && currentQuestion ? (
            <>
              <div
                className="question-stage"
                data-direction={navDirection}
                data-leaving={isAdvancing ? 'true' : undefined}
              >
              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                axisLabel={quiz.axes.find((axis) => axis.id === currentQuestion.axisId)?.label}
                axis={quiz.axes.find((axis) => axis.id === currentQuestion.axisId)}
                number={currentIndex + 1}
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
                <button
                  className="auto-advance-toggle"
                  type="button"
                  role="switch"
                  aria-checked={autoAdvance}
                  onClick={() => setAutoAdvance((value) => !value)}
                >
                  <span className="auto-advance-switch" aria-hidden="true" />
                  {t.autoAdvance}
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
                    {t.next}
                    <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </button>
                )}
              </nav>
            </>
          ) : archetypeSteps[archetypeIndex] ? (
            <>
              <div className="question-stage" data-direction={navDirection} data-leaving={isAdvancing ? 'true' : undefined}>
                {/* Depois da última escolha o resultado está sendo calculado: troca o cartão
                    congelado por um carregamento explícito. */}
                {isSubmitting ? <QuizSkeleton message={t.loadingAnalysis} /> : <ArchetypeCard
                  key={archetypeSteps[archetypeIndex].id}
                  question={archetypeSteps[archetypeIndex]}
                  index={archetypeIndex}
                  selected={archetypeChoices[archetypeSteps[archetypeIndex].id]}
                  disabled={isAdvancing || isSubmitting}
                  onSelect={chooseArchetype}
                />}
              </div>
              <nav className="quiz-actions" aria-label={t.quizNavAria}>
                <button className="secondary-button" type="button" onClick={goBackFromArchetype} disabled={isAdvancing || isSubmitting}>
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                  {t.back}
                </button>
                <button className="secondary-button archetype-skip" type="button" onClick={skipArchetype} disabled={isAdvancing || isSubmitting}>
                  {isSubmitting ? t.calculating : t.archetypeSkip}
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </nav>
            </>
          ) : null}
          {error && <p className="inline-error" role="alert">{error}</p>}
        </section>
        </Suspense>
      )}

      {screen === 'results' && result && (quiz || isSharedView) && (
        <ResultsScreen
          result={result}
          quiz={quiz}
          axes={homeAxes}
          axisResults={resultByAxis}
          isSharing={isSharing}
          error={error}
          onShare={() => void downloadResultsPng()}
          religion={religion}
        />
      )}

      {(screen === 'home' || screen === 'results') && <SiteFooter />}
    </div>
  );
}

export default function App() {
  return <MainApp />;
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
