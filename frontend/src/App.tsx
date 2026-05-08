import { useEffect, useMemo, useState } from 'react';
import { AxisResultBar } from './components/AxisResultBar';
import { IdeologyMatchCard } from './components/IdeologyMatchCard';
import { ProgressHeader } from './components/ProgressHeader';
import { QuestionCard } from './components/QuestionCard';
import { fetchQuiz, submitResults } from './services/quizApi';
import type { AnswerValue, QuizPayload, QuizResult } from './types/quiz';

type Screen = 'home' | 'quiz' | 'results';

export default function App() {
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screen, setScreen] = useState<Screen>('home');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuiz()
      .then(setQuiz)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
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
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setScreen('quiz');
  }

  function selectAnswer(answer: AnswerValue) {
    if (!currentQuestion || !quiz) {
      return;
    }
    setAnswers((previous) => ({ ...previous, [currentQuestion.id]: answer }));
    if (currentIndex < quiz.questions.length - 1) {
      window.setTimeout(() => setCurrentIndex((index) => Math.min(index + 1, quiz.questions.length - 1)), 160);
    }
  }

  async function finishQuiz() {
    if (!quiz || !canFinish) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = quiz.questions.map((question) => ({
        questionId: question.id,
        answer: answers[question.id] as AnswerValue
      }));
      const nextResult = await submitResults(payload);
      setResult(nextResult);
      setScreen('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel calcular o resultado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="app-shell center-shell">
        <div className="loading-panel">Carregando 12 Axes...</div>
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
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <span className="eyebrow">Quiz politico</span>
          <h1>12 Axes</h1>
          <p>{quiz.description}</p>
        </div>
        <div className="hero-stat">
          <strong>{quiz.questions.length}</strong>
          <span>perguntas</span>
        </div>
      </section>

      {screen === 'home' && (
        <section className="home-layout">
          <div className="intro-panel">
            <h2>Descubra seu perfil politico aproximado</h2>
            <p>
              Suas respostas serao convertidas em porcentagens nos 12 eixos e comparadas com a base de ideologias do projeto.
            </p>
            <button className="primary-button" type="button" onClick={startQuiz}>
              Comecar quiz
            </button>
          </div>
          <div className="axis-preview">
            {quiz.axes.map((axis) => (
              <div key={axis.id} className="axis-chip">
                <span>{axis.label}</span>
                <small>{axis.leftPole} x {axis.rightPole}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      {screen === 'quiz' && currentQuestion && (
        <section className="quiz-layout">
          <ProgressHeader current={currentIndex + 1} total={quiz.questions.length} />
          <QuestionCard
            question={currentQuestion}
            options={quiz.answerOptions}
            selected={answers[currentQuestion.id]}
            onSelect={selectAnswer}
          />
          <nav className="quiz-actions" aria-label="Navegacao do quiz">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
            >
              Voltar
            </button>
            {currentIndex < quiz.questions.length - 1 ? (
              <button
                className="secondary-button"
                type="button"
                onClick={() => setCurrentIndex((index) => Math.min(quiz.questions.length - 1, index + 1))}
                disabled={!answers[currentQuestion.id]}
              >
                Avancar
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={finishQuiz} disabled={!canFinish || isSubmitting}>
                {isSubmitting ? 'Calculando...' : 'Ver resultado'}
              </button>
            )}
          </nav>
          {error && <p className="inline-error">{error}</p>}
        </section>
      )}

      {screen === 'results' && result && (
        <section className="results-layout">
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
                <h2>Outras correspondencias</h2>
              </div>
              <div className="match-list">
                {result.matches.slice(1).map((match) => (
                  <IdeologyMatchCard key={match.ideologyId} match={match} />
                ))}
              </div>
              <button className="secondary-button full-button" type="button" onClick={startQuiz}>
                Refazer quiz
              </button>
            </section>
          </div>
        </section>
      )}
    </main>
  );
}
