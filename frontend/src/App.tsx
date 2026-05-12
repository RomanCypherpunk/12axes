import { useEffect, useMemo, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { AxisResultBar } from './components/AxisResultBar';
import { AxisIcon } from './components/AxisIcon';
import { IdeologyMatchCard } from './components/IdeologyMatchCard';
import { ProgressHeader } from './components/ProgressHeader';
import { QuestionCard } from './components/QuestionCard';
import { fetchQuiz, submitResults } from './services/quizApi';
import type { AnswerValue, QuizPayload, QuizResult, QuizVariant } from './types/quiz';

type Screen = 'home' | 'variant' | 'quiz' | 'results';

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
  const [selectedVariant, setSelectedVariant] = useState<QuizVariant>('short');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    fetchQuiz('short')
      .then((payload) => setQuiz(shuffleQuizQuestions(payload)))
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

  function openVariantChooser() {
    clearPendingAdvance();
    setAnswers({});
    setResult(null);
    setError(null);
    setCurrentIndex(0);
    setScreen('variant');
  }

  async function startQuiz(variant: QuizVariant = selectedVariant) {
    clearPendingAdvance();
    setSelectedVariant(variant);
    setAnswers({});
    setResult(null);
    setError(null);
    setCurrentIndex(0);
    setIsLoading(true);

    try {
      const nextQuiz = await fetchQuiz(variant);
      setQuiz(shuffleQuizQuestions(nextQuiz));
      setScreen('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o quiz.');
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
    }, 200);
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
      const nextResult = await submitResults(quiz.variant ?? selectedVariant, payload);
      setResult(nextResult);
      setScreen('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível calcular o resultado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function downloadResultsPng() {
    if (!quiz || !result || isSharing) {
      return;
    }
    setIsSharing(true);
    setError(null);

    let stage: HTMLDivElement | null = null;
    try {
      const axesSection = document.querySelector('.results-section-axes');
      if (!axesSection) {
        throw new Error('Página de resultados não encontrada.');
      }

      if (document.fonts) {
        await document.fonts.ready;
      }

      const { stage: builtStage, target } = buildExportNode(result, axesSection);
      stage = builtStage;
      document.body.appendChild(stage);

      const dataUrl = await toPng(target, {
        backgroundColor: '#F7F7F2',
        pixelRatio: Math.min(2, window.devicePixelRatio || 1),
        cacheBust: true
      });

      downloadDataUrl(
        dataUrl,
        `12axes-resultado-${new Date().toISOString().slice(0, 10)}.png`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar a imagem do resultado.');
    } finally {
      stage?.remove();
      setIsSharing(false);
    }
  }

  if (isLoading) {
    return (
      <main className="app-shell center-shell">
        <div className="loading-panel">
          <div className="loading-spinner" />
          <div>
            <h1 style={{ fontSize: '1.4rem', marginBottom: 6 }}>12 Axes</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Carregando análise política…</p>
          </div>
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
          <span>12 Axes</span>
        </button>
        {(screen === 'quiz' || screen === 'results') && (
          <button className="primary-button header-cta" type="button" onClick={() => void startQuiz(selectedVariant)}>
            {screen === 'results' ? 'Refazer quiz' : 'Reiniciar quiz'}
            <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        )}
      </header>

      {screen === 'home' && (
        <section className="home-layout" id="inicio">
          <div className="home-grid">
            <div className="intro-panel">
              <span className="intro-eyebrow fade-up d-1">
                <strong>Análise política</strong>
                <small>· 12 dimensões · 36 perguntas</small>
              </span>
              <h1 className="fade-up d-2">
                Descubra seu <em>perfil ideológico</em> em 12 eixos.
              </h1>
              <p className="intro-lead fade-up d-3">
                Análise detalhada baseada nas suas respostas. Resultados percentuais,
                comparação ideológica e visualização precisa da sua posição no
                espectro político brasileiro.
              </p>
              <div className="intro-actions fade-up d-4">
                <button className="primary-button" type="button" onClick={openVariantChooser}>
                  Começar Quiz
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </div>
              <div className="intro-meta fade-up d-5">
                <span className="intro-meta-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <strong>~5 min</strong>
                </span>
                <span className="intro-meta-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                  36 perguntas
                </span>
                <span className="intro-meta-item">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Anônimo
                </span>
              </div>
            </div>

            <div className="canvas-panel">
              <div className="canvas-stat fade-up d-2">
                <span className="canvas-stat-num">36</span>
                <div className="canvas-stat-text">
                  <strong>perguntas curadas</strong>
                  <span>distribuídas em 12 eixos políticos</span>
                </div>
                <span className="canvas-stat-tag">ao vivo</span>
              </div>

              <div className="axis-mosaic fade-up d-3" id="eixos">
                {quiz.axes.map((axis, index) => (
                  <article
                    key={axis.id}
                    className={`axis-tile${TONE_RED_AXES.has(axis.id) ? ' tone-red' : ''}`}
                  >
                    <span className="axis-tile-num">0{index + 1 < 10 ? index + 1 : index + 1}</span>
                    <span className="axis-tile-icon" aria-hidden="true">
                      <AxisIcon id={axis.id} />
                    </span>
                    <div>
                      <span className="axis-tile-name">{axis.label}</span>
                      <span className="axis-tile-poles">{axis.leftPole} × {axis.rightPole}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {screen === 'variant' && (
        <section className="variant-layout" aria-labelledby="variant-title">
          <div className="variant-heading fade-up d-1">
            <span className="eyebrow">Escolha o formato</span>
            <h1 id="variant-title">Qual versão do teste você quer fazer?</h1>
            <p>
              A versão curta revela o resultado de forma rápida. A completa aumenta
              a precisão para aproximar melhor seu resultado dos perfis ideológicos.
            </p>
          </div>

          <div className="variant-grid">
            <button className="variant-card fade-up d-2" type="button" onClick={() => void startQuiz('short')}>
              <span className="variant-card-kicker">Curta</span>
              <strong>36 perguntas</strong>
              <span>Descubra sua ideologia aproximada de forma rápida</span>
              <span className="variant-card-action">Começar versão curta</span>
            </button>

            <button className="variant-card featured fade-up d-3" type="button" onClick={() => void startQuiz('extended')}>
              <span className="variant-card-kicker">Completo</span>
              <strong>60 perguntas</strong>
              <span>Responda o quiz completo para descobrir exatamente a síntese do seu pensamento</span>
              <span className="variant-card-action">Começar versão completa</span>
            </button>
          </div>
          {error && <p className="inline-error" role="alert">{error}</p>}
        </section>
      )}

      {screen === 'quiz' && currentQuestion && (
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
            <div className="results-hero-text fade-up d-1">
              <span className="results-eyebrow">Análise concluída</span>
              <h1>
                Seu <em>perfil ideológico</em>
              </h1>
              <p>
                Análise baseada em {quiz.questions.length} respostas distribuídas
                em 12 dimensões fundamentais da ideologia política. Confira sua
                posição em cada eixo e suas correspondências ideológicas.
              </p>
            </div>
            <aside className="results-meta-card fade-up d-2" aria-label="Resumo da análise">
              <div className="results-meta-row">
                <span>Perguntas respondidas</span>
                <strong>{quiz.questions.length}</strong>
              </div>
              <div className="results-meta-row">
                <span>Eixos analisados</span>
                <strong>12</strong>
              </div>
              <div className="results-meta-row">
                <span>Top match</span>
                <strong>{result.topMatch.compatibility.toFixed(1)}%</strong>
              </div>
            </aside>
          </header>

          <div className="fade-up d-3">
            <IdeologyMatchCard match={result.topMatch} featured />
          </div>

          <section className="results-section results-section-axes fade-up d-4">
            <div className="section-heading">
              <span className="eyebrow">Eixos políticos</span>
              <h2>Resultado percentual por eixo</h2>
            </div>
            <div className="axis-rows">
              {quiz.axes.map((axis) => {
                const axisResult = resultByAxis.get(axis.id);
                return axisResult ? <AxisResultBar key={axis.id} axis={axis} result={axisResult} /> : null;
              })}
            </div>
          </section>

          <section className="results-section fade-up d-5">
            <div className="section-heading">
              <span className="eyebrow">Proximidade ideológica</span>
              <h2>Outras correspondências</h2>
            </div>
            <div className="match-grid">
              {result.matches.slice(1, 4).map((match) => (
                <IdeologyMatchCard key={match.ideologyId} match={match} />
              ))}
            </div>
          </section>

          <div className="results-cta fade-up d-5" data-export-hidden="true">
            <button className="primary-button" type="button" onClick={() => void startQuiz(selectedVariant)}>
              Refazer análise
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-3-6.7" />
                <path d="M21 4v5h-5" />
              </svg>
            </button>
            <button className="secondary-button" type="button" onClick={() => void downloadResultsPng()} disabled={isSharing}>
              {isSharing ? 'Gerando PNG...' : 'Compartilhar'}
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
            </button>
            {error && <p className="inline-error" role="alert">{error}</p>}
          </div>
        </section>
      )}
    </main>
  );
}

function shuffleQuizQuestions(quiz: QuizPayload): QuizPayload {
  return {
    ...quiz,
    questions: shuffleArray(quiz.questions)
  };
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function buildExportNode(
  result: QuizResult,
  axesSection: Element
): { stage: HTMLDivElement; target: HTMLDivElement } {
  const stage = document.createElement('div');
  Object.assign(stage.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '0',
    height: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '-1'
  } as Partial<CSSStyleDeclaration>);

  const target = document.createElement('div');
  target.className = 'export-root';
  Object.assign(target.style, {
    width: '1100px',
    padding: '48px',
    background: '#F7F7F2',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  } as Partial<CSSStyleDeclaration>);

  const card = document.createElement('article');
  card.className = 'export-ideology-card';

  const category = document.createElement('span');
  category.className = 'export-ideology-category';
  category.textContent = result.topMatch.category;

  const name = document.createElement('h2');
  name.className = 'export-ideology-name';
  name.textContent = result.topMatch.name;

  const description = document.createElement('p');
  description.className = 'export-ideology-description';
  description.textContent = result.topMatch.longDescription;

  const axesClone = axesSection.cloneNode(true) as HTMLElement;
  axesClone.classList.remove('fade-up');
  axesClone.querySelectorAll<HTMLElement>('.fade-up').forEach((el) => {
    el.classList.remove('fade-up');
  });

  card.append(category, name, description);
  target.append(card, axesClone);
  stage.append(target);

  return { stage, target };
}
