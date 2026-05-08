import { useEffect, useMemo, useRef, useState } from 'react';
import { AxisResultBar } from './components/AxisResultBar';
import { AxisIcon } from './components/AxisIcon';
import { IdeologyMatchCard } from './components/IdeologyMatchCard';
import { ProgressHeader } from './components/ProgressHeader';
import { QuestionCard } from './components/QuestionCard';
import { fetchQuiz, submitResults } from './services/quizApi';
import type { AnswerValue, QuizPayload, QuizResult } from './types/quiz';

type Screen = 'home' | 'quiz' | 'results';

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
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    fetchQuiz()
      .then(setQuiz)
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

  const currentQuestion = quiz?.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const canFinish = Boolean(quiz && answeredCount === quiz.questions.length);

  const resultByAxis = useMemo(() => {
    if (!result) {
      return new Map<string, QuizResult['axes'][number]>();
    }
    return new Map(result.axes.map((axis) => [axis.axisId, axis]));
  }, [result]);

  function startQuiz() {
    clearPendingAdvance();
    setAnswers({});
    setResult(null);
    setError(null);
    setCurrentIndex(0);
    setScreen('quiz');
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
      void finishQuiz(nextAnswers);
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
    }, 180);
  }

  async function finishQuiz(answerMap = answers) {
    if (!quiz || isSubmitting) {
      return;
    }
    const firstMissingIndex = quiz.questions.findIndex((question) => !answerMap[question.id]);
    if (firstMissingIndex !== -1) {
      setCurrentIndex(firstMissingIndex);
      setError('Ainda falta responder esta pergunta antes de ver o resultado.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const payload = quiz.questions.map((question) => ({
        questionId: question.id,
        answer: answerMap[question.id] as AnswerValue
      }));
      const nextResult = await submitResults(payload);
      setResult(nextResult);
      setScreen('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível calcular o resultado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="app-shell center-shell">
        <div className="loading-panel">
          <div className="loading-spinner" />
          <p>Carregando 12 Axes…</p>
        </div>
      </main>
    );
  }

  if (error && !quiz) {
    return (
      <main className="app-shell center-shell">
        <div className="error-panel">
          <h1>12 Axes</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <main className="app-shell" data-screen={screen}>
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => setScreen('home')} aria-label="Voltar para o início">
          <span>12</span> Axes
        </button>
        <nav className="site-nav" aria-label="Seções principais">
          <a href="#inicio" className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>Início</a>
          <a href="#sobre">Sobre o quiz</a>
          <a href="#eixos">Eixos</a>
          <a href="#metodologia">Metodologia</a>
          <a href="#resultados" className={screen === 'results' ? 'active' : ''}>Resultados</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="primary-button header-cta" type="button" onClick={startQuiz}>
          {screen === 'results' ? 'Refazer quiz' : 'Começar quiz'}
          <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </header>

      {screen === 'home' && (
        <section className="home-layout" id="inicio">
          <div className="home-grid">
            <div className="intro-panel fade-up d-1">
              <span className="eyebrow">Quiz político</span>
              <h1>
                Descubra seu <em>perfil político</em> nos 12 eixos.
              </h1>
              <p>
                Responda 48 perguntas e veja onde você se posiciona em temas
                que moldam o debate político atual.
              </p>
              <div className="hero-actions">
                <button className="primary-button" type="button" onClick={startQuiz}>
                  Começar quiz
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
                <span className="hero-note">100% gratuito · sem cadastro</span>
              </div>
              <div className="trust-row" aria-label="Características do quiz">
                <span>Resultados detalhados</span>
                <span>Respostas anônimas</span>
                <span>Base ideológica local</span>
              </div>
            </div>

            <div className="axis-preview fade-up d-2" id="eixos">
              {quiz.axes.map((axis) => (
                <article
                  key={axis.id}
                  className={`axis-chip${TONE_RED_AXES.has(axis.id) ? ' tone-red' : ''}`}
                >
                  <div className="axis-chip-head">
                    <span className="axis-chip-icon" aria-hidden="true">
                      <AxisIcon id={axis.id} />
                    </span>
                    <strong>{axis.label}</strong>
                  </div>
                  <small>{axis.leftPole} × {axis.rightPole}</small>
                </article>
              ))}
            </div>

            <aside className="hero-stat fade-up d-3" aria-label="Total de perguntas">
              <strong>{quiz.questions.length}</strong>
              <span>perguntas</span>
              <small>para mapear sua posição nos 12 eixos políticos.</small>
            </aside>
          </div>

          <div className="home-strip fade-up d-4" aria-label="Como funciona">
            <div className="home-strip-item">
              <span className="home-strip-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 7h16M4 12h10M4 17h16" />
                </svg>
              </span>
              <span><strong>12 eixos</strong> mapeados</span>
            </div>
            <div className="home-strip-item">
              <span className="home-strip-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <span><strong>~6 min</strong> para responder</span>
            </div>
            <div className="home-strip-item">
              <span className="home-strip-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 12 9 6l4 4 8-8" />
                  <path d="M14 4h7v7" />
                </svg>
              </span>
              <span><strong>Resultados</strong> comparativos</span>
            </div>
            <div className="home-strip-item">
              <span className="home-strip-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v18" />
                  <path d="M6 8h12" />
                  <path d="M5 13h14" />
                </svg>
              </span>
              <span><strong>Imparcial</strong> e baseado em dados</span>
            </div>
          </div>
        </section>
      )}

      {screen === 'quiz' && currentQuestion && (
        <section className="quiz-layout">
          <header className="quiz-meta">
            <div className="quiz-meta-text">
              <span className="eyebrow">Quiz político</span>
              <h1>12 Axes</h1>
            </div>
            <div className="quiz-meta-stat" aria-label="Progresso">
              <strong>{Object.keys(answers).length}</strong>
              <span>de {quiz.questions.length}</span>
            </div>
          </header>

          <ProgressHeader current={currentIndex + 1} total={quiz.questions.length} />

          <QuestionCard
            question={currentQuestion}
            axisLabel={quiz.axes.find((axis) => axis.id === currentQuestion.axisId)?.label}
            options={quiz.answerOptions}
            selected={answers[currentQuestion.id]}
            disabled={isAdvancing || isSubmitting}
            onSelect={selectAnswer}
          />

          <nav className="quiz-actions" aria-label="Navegação do quiz">
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
              Voltar
            </button>
            {currentIndex < quiz.questions.length - 1 ? (
              <button
                className="primary-button"
                type="button"
                onClick={goToNextQuestion}
                disabled={!answers[currentQuestion.id] || isAdvancing}
              >
                Avançar
                <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={() => finishQuiz()} disabled={!canFinish || isSubmitting}>
                {isSubmitting ? 'Calculando…' : 'Ver resultado'}
                <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            )}
          </nav>
          {error && <p className="inline-error" role="alert">{error}</p>}
        </section>
      )}

      {screen === 'results' && result && (
        <section className="results-layout" id="resultados">
          <header className="results-hero">
            <div>
              <span className="eyebrow">Seus resultados</span>
              <h1>
                <em>Resultados</em> 12 Axes
              </h1>
              <p>
                Seu perfil político baseado nas 12 dimensões fundamentais da
                ideologia. Confira abaixo o resultado em cada eixo e suas
                correspondências ideológicas.
              </p>
            </div>
            <div className="result-meta-card">
              <div className="result-meta-icon">
                <AxisIcon id="controle" />
              </div>
              <div>
                <strong>Perfil analisado</strong>
                <span>12 eixos · {quiz.questions.length} perguntas</span>
              </div>
            </div>
          </header>

          <IdeologyMatchCard match={result.topMatch} featured />

          <div className="results-grid">
            <section className="results-section">
              <div className="section-heading">
                <span className="eyebrow">Eixos</span>
                <h2>Seu resultado percentual</h2>
              </div>
              {quiz.axes.map((axis) => {
                const axisResult = resultByAxis.get(axis.id);
                return axisResult ? <AxisResultBar key={axis.id} axis={axis} result={axisResult} /> : null;
              })}
            </section>

            <section className="results-section">
              <div className="section-heading">
                <span className="eyebrow">Proximidade</span>
                <h2>Outras correspondências</h2>
              </div>
              <div className="match-list">
                {result.matches.slice(1).map((match) => (
                  <IdeologyMatchCard key={match.ideologyId} match={match} />
                ))}
              </div>
              <button className="primary-button full-button" type="button" onClick={startQuiz}>
                Refazer quiz
                <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <path d="M21 4v5h-5" />
                </svg>
              </button>
            </section>
          </div>
        </section>
      )}
    </main>
  );
}
