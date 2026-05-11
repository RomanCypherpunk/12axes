import { useEffect, useMemo, useRef, useState } from 'react';
import { AxisResultBar } from './components/AxisResultBar';
import { AxisIcon } from './components/AxisIcon';
import { IdeologyMatchCard } from './components/IdeologyMatchCard';
import { ProgressHeader } from './components/ProgressHeader';
import { QuestionCard } from './components/QuestionCard';
import { fetchQuiz, submitResults } from './services/quizApi';
import type { AnswerValue, QuizPayload, QuizResult, QuizVariant } from './types/quiz';

type Screen = 'home' | 'variant' | 'quiz' | 'results';

const EXPORT_FONT_FAMILY = 'Arial, Helvetica, sans-serif';

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
    try {
      await exportResultAsPng(quiz, result, `12axes-resultado-${new Date().toISOString().slice(0, 10)}.png`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar a imagem do resultado.');
    } finally {
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
              <strong>120 Perguntas</strong>
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

async function exportResultAsPng(quiz: QuizPayload, result: QuizResult, fileName: string) {
  if (document.fonts) {
    await document.fonts.ready;
  }

  const width = 1400;
  const padding = 72;
  const axisRows = quiz.axes
    .map((axis) => ({
      axis,
      result: result.axes.find((axisResult) => axisResult.axisId === axis.id)
    }))
    .filter((entry): entry is { axis: QuizPayload['axes'][number]; result: QuizResult['axes'][number] } => Boolean(entry.result));
  const sectionTop = 550;
  const rowHeight = 124;
  const height = sectionTop + 126 + axisRows.length * rowHeight + 180;
  const scale = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Não foi possível preparar o arquivo PNG.');
  }

  context.scale(scale, scale);
  context.fillStyle = '#F7F7F2';
  context.fillRect(0, 0, width, height);

  drawBrand(context, padding, 64);
  context.fillStyle = '#111827';
  context.font = canvasFont(800, 54);
  context.fillText('Seu perfil ideológico', padding, 166);
  context.font = canvasFont(400, 23);
  context.fillStyle = '#667085';
  drawWrappedText(
    context,
    `Análise baseada em ${quiz.questions.length} respostas distribuídas em 12 dimensões fundamentais da ideologia política.`,
    padding,
    212,
    760,
    34,
    2
  );

  drawSummaryPanel(context, width - padding - 350, 90, 350, 170, [
    ['Perguntas respondidas', String(quiz.questions.length)],
    ['Eixos analisados', '12'],
    ['Top match', `${result.topMatch.compatibility.toFixed(1)}%`]
  ]);

  drawTopMatch(context, padding, 300, width - padding * 2, result);

  const sectionHeight = 126 + axisRows.length * rowHeight;
  drawRoundedBox(context, padding, sectionTop, width - padding * 2, sectionHeight, 28, '#FFFFFF', '#E5E7EB', 1);
  context.textAlign = 'center';
  context.fillStyle = '#07803A';
  context.font = canvasFont(800, 14);
  context.fillText('EIXOS POLÍTICOS', width / 2, sectionTop + 48);
  context.fillStyle = '#111827';
  context.font = canvasFont(800, 32);
  context.fillText('Resultado percentual por eixo', width / 2, sectionTop + 88);

  axisRows.forEach((entry, index) => {
    drawAxisResult(context, entry.axis, entry.result, padding + 124, sectionTop + 130 + index * rowHeight, width - padding * 2 - 248);
  });

  context.textAlign = 'left';
  context.fillStyle = '#667085';
  context.font = canvasFont(600, 18);
  context.fillText('12 Axes', padding, height - 72);

  const pngBlob = await canvasToPngBlob(canvas);
  downloadBlob(pngBlob, fileName);
}

function drawBrand(context: CanvasRenderingContext2D, x: number, y: number) {
  drawRoundedBox(context, x, y - 28, 28, 28, 8, '#13B85F');
  context.fillStyle = '#111827';
  context.font = canvasFont(800, 30);
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText('12 Axes', x + 42, y - 14);
  context.textBaseline = 'alphabetic';
}

function drawSummaryPanel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rows: Array<[string, string]>
) {
  drawRoundedBox(context, x, y, width, height, 28, '#FFFFFF', '#E5E7EB', 1);
  context.textAlign = 'left';
  rows.forEach(([label, value], index) => {
    const rowY = y + 48 + index * 48;
    context.fillStyle = '#667085';
    context.font = canvasFont(600, 16);
    context.fillText(label, x + 28, rowY);
    context.fillStyle = '#111827';
    context.font = canvasFont(800, 18);
    context.textAlign = 'right';
    context.fillText(value, x + width - 28, rowY);
    context.textAlign = 'left';
  });
}

function drawTopMatch(context: CanvasRenderingContext2D, x: number, y: number, width: number, result: QuizResult) {
  drawRoundedBox(context, x, y, width, 196, 28, '#F3FFF7', '#95E3B1', 2);
  context.fillStyle = '#07803A';
  context.font = canvasFont(800, 14);
  context.textAlign = 'left';
  context.fillText(result.topMatch.category.toUpperCase(), x + 32, y + 42);
  context.fillStyle = '#111827';
  context.font = canvasFont(800, 40);
  context.fillText(result.topMatch.name, x + 32, y + 88);
  context.fillStyle = '#4B5563';
  context.font = canvasFont(400, 19);
  drawWrappedText(context, result.topMatch.description, x + 32, y + 124, width - 250, 28, 2);

  context.strokeStyle = '#07803A';
  context.lineWidth = 7;
  context.beginPath();
  context.arc(x + width - 88, y + 88, 52, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = '#07803A';
  context.font = canvasFont(800, 28);
  context.textAlign = 'center';
  context.fillText(`${Math.round(result.topMatch.compatibility)}%`, x + width - 88, y + 90);
  context.font = canvasFont(800, 11);
  context.fillText('MATCH', x + width - 88, y + 112);
}

function drawAxisResult(
  context: CanvasRenderingContext2D,
  axis: QuizPayload['axes'][number],
  result: QuizResult['axes'][number],
  x: number,
  y: number,
  width: number
) {
  const cardWidth = 126;
  const cardHeight = 90;
  const barHeight = 74;
  const barX = x + cardWidth;
  const barY = y + 34;
  const barWidth = width - cardWidth * 2;
  const leftWidth = Math.max(0, Math.min(barWidth, (barWidth * result.leftPercent) / 100));
  const rightWidth = Math.max(0, barWidth - leftWidth);
  const leaningText = result.intensity === 'Equilibrado'
    ? 'Equilibrado'
    : `${result.intensity} para ${result.dominantPole}`;

  drawCenteredAxisTitle(context, `${result.label}:`, leaningText, x + width / 2, y);
  drawPoleCard(context, x, barY - 8, cardWidth, cardHeight, axis.leftColor, result.leftPole);
  drawPoleCard(context, barX + barWidth, barY - 8, cardWidth, cardHeight, axis.rightColor, result.rightPole);

  context.fillStyle = axis.leftColor;
  context.fillRect(barX, barY, leftWidth, barHeight);
  context.fillStyle = axis.rightColor;
  context.fillRect(barX + leftWidth, barY, rightWidth, barHeight);
  context.strokeStyle = '#202225';
  context.lineWidth = 6;
  context.strokeRect(barX, barY, barWidth, barHeight);
  context.beginPath();
  context.moveTo(barX + barWidth / 2, barY);
  context.lineTo(barX + barWidth / 2, barY + barHeight);
  context.stroke();

  context.font = canvasFont(500, 54);
  context.textBaseline = 'middle';
  context.textAlign = 'left';
  context.fillStyle = readableInk(axis.leftColor);
  context.fillText(`${result.leftPercent.toFixed(1)}%`, barX + 22, barY + barHeight / 2 + 2);
  context.textAlign = 'right';
  context.fillStyle = readableInk(axis.rightColor);
  context.fillText(`${result.rightPercent.toFixed(1)}%`, barX + barWidth - 22, barY + barHeight / 2 + 2);
  context.textBaseline = 'alphabetic';
}

function drawCenteredAxisTitle(
  context: CanvasRenderingContext2D,
  label: string,
  leaning: string,
  centerX: number,
  y: number
) {
  context.font = canvasFont(800, 30);
  const labelWidth = context.measureText(`${label} `).width;
  context.font = canvasFont(700, 30);
  const leaningWidth = context.measureText(leaning).width;
  const startX = centerX - (labelWidth + leaningWidth) / 2;

  context.textAlign = 'left';
  context.fillStyle = '#111827';
  context.font = canvasFont(800, 30);
  context.fillText(`${label} `, startX, y + 24);
  context.fillStyle = '#667085';
  context.font = canvasFont(700, 30);
  context.fillText(leaning, startX + labelWidth, y + 24);
}

function drawPoleCard(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  label: string
) {
  drawRoundedBox(context, x, y, width, height, 8, color, '#202225', 6);
  context.fillStyle = '#202225';
  context.fillRect(x + 3, y + height - 30, width - 6, 27);

  context.fillStyle = readableInk(color);
  context.textAlign = 'center';
  context.font = canvasFont(800, 34);
  context.fillText(label.slice(0, 2).toUpperCase(), x + width / 2, y + 48);

  context.fillStyle = '#FFFFFF';
  drawFittedText(context, label.toUpperCase(), x + width / 2, y + height - 12, width - 12, 14, 800);
}

function drawRoundedBox(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  stroke?: string,
  lineWidth = 1
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = lineWidth;
    context.stroke();
  }
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width <= maxWidth) {
      line = nextLine;
      return;
    }
    if (line) {
      lines.push(line);
    }
    line = word;
  });

  if (line) {
    lines.push(line);
  }

  lines.slice(0, maxLines).forEach((currentLine, index) => {
    const isLastVisibleLine = index === maxLines - 1 && lines.length > maxLines;
    context.fillText(isLastVisibleLine ? trimTextToWidth(context, `${currentLine}...`, maxWidth) : currentLine, x, y + index * lineHeight);
  });
}

function drawFittedText(
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  maxWidth: number,
  baseSize: number,
  weight: number
) {
  let size = baseSize;
  do {
    context.font = canvasFont(weight, size);
    size -= 1;
  } while (size > 8 && context.measureText(text).width > maxWidth);

  context.textAlign = 'center';
  context.fillText(text, centerX, y);
}

function trimTextToWidth(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  let trimmed = text;
  while (trimmed.length > 3 && context.measureText(trimmed).width > maxWidth) {
    trimmed = `${trimmed.slice(0, -4)}...`;
  }
  return trimmed;
}

function readableInk(hexColor: string) {
  const normalized = hexColor.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((part) => part + part).join('')
    : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.62 ? '#111111' : '#ffffff';
}

function canvasFont(weight: number, size: number) {
  return `${weight} ${size}px ${EXPORT_FONT_FAMILY}`;
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Não foi possível gerar o PNG do resultado.'));
        }
      }, 'image/png', 0.95);
    } catch {
      reject(new Error('O navegador bloqueou a exportação da imagem. Tente novamente após recarregar a página.'));
    }
  });
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
