import { useEffect, useMemo, useRef, useState } from 'react';
import { AxisResultBar } from '../components/AxisResultBar';
import { ProgressHeader } from '../components/ProgressHeader';
import { QuestionCard } from '../components/QuestionCard';
import { fetchElectionCandidates, fetchElectionQuiz, fetchSharedElectionResult, submitElectionResults } from '../services/quizApi';
import type { AnswerValue, Candidate, ElectionResult, QuizPayload } from '../types/quiz';
import { interleaveByPole } from '../utils/quizSelection';

type Screen = 'home' | 'quiz' | 'result';

// URL de resultado compartilhável: /eleicoes2026/resultado?est=65&rep=32.5&...
// (uma chave por eixo, valor = % do polo esquerdo, na mesma ordem de axes.json).
// Mesmo padrão usado pelo quiz principal em App.tsx.
const AXIS_URL_KEYS = ['est', 'rep', 'pod', 'imi', 'dip', 'int', 'eco', 'con', 'com', 'rel', 'mor', 'tec'];

function parseSharedElectionResultUrl(): number[] | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path !== '/eleicoes2026/resultado') {
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

function sharedElectionResultUrl(result: ElectionResult): string {
  const query = result.axes
    .map((axis, index) => `${AXIS_URL_KEYS[index] ?? `x${index}`}=${axis.leftPercent}`)
    .join('&');
  return `/eleicoes2026/resultado?${query}`;
}

const STEPS = [
  { title: 'Responda às perguntas', text: 'Concorde ou discorde de 36 afirmações sobre o Brasil atual: economia, segurança, imigração, religião e mais.' },
  { title: 'Análise em 12 eixos', text: 'Cada resposta posiciona você em 12 eixos políticos independentes, dos mesmos usados no teste ideológico completo.' },
  { title: 'Descubra sua candidatura', text: 'Veja qual candidatura presidencial mais se aproxima do seu conjunto de posições, eixo a eixo.' }
];

const AXIS_EXPLANATIONS: Record<string, string> = {
  estrutura: 'Mede se você prefere poder distribuído entre estados e municípios ou um comando federal mais uniforme sobre políticas públicas.',
  representacao: 'Compara confiança em eleições, oposição e instituições democráticas com preferência por decretos e liderança concentrada.',
  poder: 'Avalia o equilíbrio entre segurança pública, punição e controle estatal versus liberdades individuais e privacidade.',
  imigracao: 'Observa se você valoriza assimilação cultural e identidade nacional ou multiculturalismo e abertura migratória.',
  diplomacia: 'Analisa sua posição sobre Forças Armadas e dissuasão militar em contraste com negociação e pacifismo.',
  intervencao: 'Mede a inclinação entre não intervencionismo externo e soberania nacional mais assertiva.',
  economia: 'Compara preferência por propriedade pública e estatais com propriedade privada e protagonismo empresarial.',
  controle: 'Avalia planejamento estatal e regulação ativa contra livre mercado e baixa interferência.',
  comercio: 'Mede protecionismo e defesa da indústria nacional contra livre comércio e integração internacional.',
  religiao: 'Compara laicidade e separação entre religião e Estado com influência pública da fé e valores religiosos.',
  moral: 'Avalia progressismo cultural e direitos civis em contraste com tradição, família e costumes.',
  tecnologia: 'Mede entusiasmo por tecnologia e desenvolvimento técnico contra cautela biológica e ambiental.'
};

const FAQ_ITEMS = [
  {
    question: 'Como o resultado é calculado?',
    answer: 'Suas 36 respostas geram um vetor de 12 eixos, comparado ao vetor de posições de cada candidatura presidencial de 2026. A candidatura com menor distância vetorial aparece como mais compatível.'
  },
  {
    question: 'De onde vêm as posições das candidaturas?',
    answer: 'Cada candidatura é auditada individualmente a partir de discursos, entrevistas, programa de governo e votos públicos, seguindo o mesmo protocolo pergunta a pergunta usado no restante do catálogo 12 Axes.'
  },
  {
    question: 'Esse quiz é diferente do teste ideológico completo?',
    answer: 'Sim. Este quiz usa as mesmas 12 dimensões, mas com perguntas focadas no Brasil e nas eleições de 2026, e compara você com candidaturas em vez de ideologias, países ou personalidades históricas.'
  },
  {
    question: 'O 12 Axes indica em quem votar?',
    answer: 'Não. O resultado mostra compatibilidade de posições declaradas, não uma recomendação de voto. A decisão final é sempre sua.'
  },
  {
    question: 'Posso compartilhar meu resultado?',
    answer: 'Sim. A página de resultado tem um link único na URL do navegador, que você pode copiar e enviar para outra pessoa ver o mesmo resultado.'
  },
  {
    question: 'O teste coleta dados pessoais?',
    answer: 'Não. O quiz é anônimo, sem cadastro, nome ou e-mail. As respostas só são usadas para calcular o resultado no momento em que você responde.'
  }
];

export default function ElectionApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ElectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimerRef = useRef<number | null>(null);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current !== null) {
        window.clearTimeout(advanceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    void Promise.all([fetchElectionQuiz(), fetchElectionCandidates()])
      .then(async ([q, c]) => {
        setQuiz({ ...q, questions: interleaveByPole(q.questions) });
        setCandidates(c);
        const values = parseSharedElectionResultUrl();
        if (values) {
          setResult(await fetchSharedElectionResult(values));
          setScreen('result');
        }
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const question = quiz?.questions[index];
  const axes = useMemo(() => new Map(result?.axes.map((a) => [a.axisId, a]) ?? []), [result]);

  async function finish(finalAnswers = answers) {
    if (!quiz) return;
    try {
      const nextResult = await submitElectionResults(Object.entries(finalAnswers).map(([questionId, answer]) => ({ questionId, answer })));
      setResult(nextResult);
      setScreen('result');
      window.history.pushState(null, '', sharedElectionResultUrl(nextResult));
    } catch (e) {
      setError((e as Error).message);
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
    setIndex((current) => Math.max(0, current - 1));
  }

  function selectAnswer(answer: AnswerValue) {
    if (!question || !quiz || isAdvancingRef.current) return;
    const questionIndex = index;
    const next = { ...answers, [question.id]: answer };
    setAnswers(next);
    setError(null);

    if (questionIndex === quiz.questions.length - 1) {
      void finish(next);
      return;
    }

    isAdvancingRef.current = true;
    setIsAdvancing(true);
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
    }
    advanceTimerRef.current = window.setTimeout(() => {
      setIndex((current) => (current === questionIndex ? questionIndex + 1 : current));
      isAdvancingRef.current = false;
      setIsAdvancing(false);
      advanceTimerRef.current = null;
    }, 180);
  }

  async function restart() {
    clearPendingAdvance();
    if (window.location.pathname.replace(/\/+$/, '') === '/eleicoes2026/resultado') {
      window.history.replaceState(null, '', '/eleicoes2026');
    }
    setAnswers({});
    setIndex(0);
    setError(null);
    setScreen('quiz');
    try {
      const nextQuiz = await fetchElectionQuiz();
      setQuiz({ ...nextQuiz, questions: interleaveByPole(nextQuiz.questions) });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (error) {
    return (
      <main className="app-shell center-shell">
        <div className="error-panel">
          <h1>12 Axes</h1>
          <p>{error}</p>
          <button className="secondary-button" type="button" onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </main>
    );
  }

  if (!quiz) {
    return (
      <main className="app-shell center-shell">
        <div className="loading-panel">
          <div className="loading-mark" aria-hidden="true"><div className="loading-spinner" /></div>
          <div><h1>12 Axes</h1><p>Carregando Eleições 2026…</p></div>
        </div>
      </main>
    );
  }

  if (screen === 'home') {
    return (
      <main className="app-shell" data-screen="home">
        <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
        <header className="site-header">
          <button className="brand-lockup" type="button" aria-label="Início">
            <span className="brand-num">12</span><span className="brand-word">axes</span>
          </button>
          <nav className="home-nav" aria-label="Navegação principal">
            <a href="#como-funciona">Como funciona</a>
            <a href="#guia-eixos">Eixos</a>
            <a href="#candidaturas">Candidaturas</a>
            <a href="#faq">FAQ</a>
          </nav>
        </header>
        <span id="conteudo-principal" className="skip-target" tabIndex={-1} />

        <section className="home-layout" id="inicio">
          <div className="home-grid">
            <div className="intro-panel">
              <span className="intro-eyebrow fade-up d-1"><strong>ESPECIAL ELEIÇÕES 2026</strong></span>
              <h1 className="fade-up d-2">Descubra o candidato mais <em>compatível</em> com você.</h1>
              <p className="intro-lead fade-up d-3">
                Responda 36 perguntas sobre o Brasil atual e compare suas posições nos 12 eixos com os programas e posições públicas das candidaturas presidenciais.
              </p>
              <div className="intro-actions fade-up d-4">
                <button className="primary-button hero-cta" type="button" onClick={() => setScreen('quiz')}>
                  Começar análise eleitoral
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
                </button>
                <a className="secondary-button" href="#candidaturas">Ver candidaturas</a>
              </div>
              <div className="intro-meta fade-up d-5">
                {['36 perguntas', '12 eixos', 'resultado comparável'].map((label) => (
                  <span className="intro-meta-item" key={label}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="canvas-panel election-hero-visual fade-up d-3" aria-hidden="true">
              <img src="/brasil-urna.png" alt="" loading="eager" />
            </div>
          </div>

          <div className="home-seo">
            <section className="seo-block fade-up" aria-labelledby="como-funciona">
              <div className="section-heading">
                <span className="eyebrow">Como funciona</span>
                <h2 id="como-funciona">Uma análise eleitoral, não uma recomendação</h2>
                <p>O quiz calcula compatibilidade a partir das suas respostas, mantendo clara a diferença entre posição declarada e inferência editorial.</p>
              </div>
              <div className="step-grid">
                {STEPS.map((step, i) => (
                  <article className="step-card" key={step.title}>
                    <span className="step-num">{i + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="candidaturas">
              <div className="section-heading">
                <span className="eyebrow">Catálogo 2026</span>
                <h2 id="candidaturas">Candidaturas analisadas</h2>
                <p>Cada candidatura é auditada individualmente a partir de discursos, entrevistas e programa de governo.</p>
              </div>
              <div className="match-grid election-catalog-grid">
                {candidates.map((c) => (
                  <article className="match-card election-match-card" key={c.id}>
                    <img src={c.imagePath} alt="" loading="lazy" />
                    <p className="election-card-tag">{c.partyName} · {c.ballotNumber}</p>
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                    {!c.active && <small className="election-unavailable-badge">Indisponível no resultado</small>}
                  </article>
                ))}
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="guia-eixos">
              <div className="section-heading">
                <span className="eyebrow">12 eixos eleitorais</span>
                <h2 id="guia-eixos">O que significa cada eixo?</h2>
                <p>As mesmas 12 dimensões do teste ideológico 12 Axes, aplicadas ao contexto das eleições brasileiras de 2026.</p>
              </div>
              <div className="axis-guide-grid">
                {quiz.axes.map((axis, i) => (
                  <article key={axis.id} className="axis-guide-card">
                    <span className="axis-guide-index">{String(i + 1).padStart(2, '0')}</span>
                    <div className="axis-guide-copy">
                      <h3>{axis.label}: {axis.leftPole} × {axis.rightPole}</h3>
                      <p>{AXIS_EXPLANATIONS[axis.id]}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="faq">
              <div className="section-heading">
                <span className="eyebrow">FAQ</span>
                <h2 id="faq">Perguntas frequentes</h2>
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
          </div>
        </section>
      </main>
    );
  }

  if (screen === 'quiz' && question) {
    return (
      <main className="app-shell" data-screen="quiz">
        <header className="site-header">
          <button className="brand-lockup" type="button" onClick={() => setScreen('home')} aria-label="Voltar ao início">
            <span className="brand-num">12</span><span className="brand-word">axes</span>
          </button>
        </header>
        <section className="quiz-layout">
          <ProgressHeader current={index + 1} total={quiz.questions.length} />
          <QuestionCard
            key={question.id}
            question={question}
            axisLabel={quiz.axes.find((a) => a.id === question.axisId)?.label}
            options={quiz.answerOptions}
            selected={answers[question.id]}
            disabled={isAdvancing}
            onSelect={selectAnswer}
          />
          <nav className="quiz-actions" aria-label="Navegação do quiz">
            <button className="secondary-button" type="button" disabled={!index || isAdvancing} onClick={goToPreviousQuestion}>
              <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
              Voltar
            </button>
          </nav>
        </section>
      </main>
    );
  }

  const top = result?.matches[0];

  return (
    <main className="app-shell" data-screen="results">
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => setScreen('home')} aria-label="Voltar ao início">
          <span className="brand-num">12</span><span className="brand-word">axes</span>
        </button>
        <button className="primary-button header-cta" type="button" onClick={() => void restart()}>
          Refazer análise
          <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
        </button>
      </header>

      <section className="results-layout" id="resultados">
        <header className="results-hero">
          <div className="results-hero-text fade-up d-1">
            <span className="results-eyebrow">Eleições 2026</span>
            <h1>Você é mais compatível com <em>{top?.name}</em></h1>
            <p>O resultado compara suas respostas com os vetores eleitorais do catálogo 12 Axes.</p>
          </div>
          <aside className="results-meta-card election-results-meta-card fade-up d-2" aria-label="Resumo do resultado">
            <div className="results-meta-row"><span>Perguntas</span><strong>{quiz.questions.length}</strong></div>
            <div className="results-meta-row"><span>Eixos</span><strong>12</strong></div>
            <div className="results-meta-row"><span>Compatibilidade</span><strong>{top?.compatibility.toFixed(1)}%</strong></div>
          </aside>
        </header>

        {top && (
          <article className="personality-match-card election-featured-card fade-up d-3">
            <div className="personality-match-visual">
              <img src={top.imagePath} alt={`Retrato de ${top.name}`} loading="lazy" />
            </div>
            <div className="personality-match-content">
              <div className="personality-match-heading">
                <div>
                  <span className="personality-match-kicker">Candidatura mais compatível</span>
                  <h2>{top.name}</h2>
                </div>
                <span className="personality-match-score">{top.compatibility.toFixed(0)}% match</span>
              </div>
              <div className="personality-match-meta">
                <span>{top.party} · {top.ballotNumber}</span>
                <span>{top.partyName}</span>
              </div>
              <p>{top.description}</p>
            </div>
          </article>
        )}

        <section className="results-section results-section-axes fade-up d-4">
          <div className="section-heading">
            <span className="eyebrow">Seus eixos</span>
            <h2>Como suas posições se distribuem</h2>
          </div>
          <div className="axis-rows">
            {quiz.axes.map((a) => {
              const r = axes.get(a.id);
              return r ? <AxisResultBar key={a.id} axis={a} result={r} /> : null;
            })}
          </div>
        </section>

        <section className="results-section fade-up d-5">
          <div className="section-heading">
            <span className="eyebrow">Outras proximidades</span>
            <h2>Outras candidaturas compatíveis</h2>
          </div>
          <div className="match-grid">
            {result?.matches.slice(1).map((m, i) => (
              <article className="match-card election-match-card" key={m.candidateId}>
                <div className="match-card-header">
                  <div className="match-card-text">
                    <span>{i + 2}º mais compatível · {m.party} {m.ballotNumber}</span>
                    <h3>{m.name}</h3>
                  </div>
                </div>
                <img src={m.imagePath} alt="" loading="lazy" />
                <p>{m.description}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="results-cta fade-up d-5" data-export-hidden="true">
          <button className="primary-button" type="button" onClick={() => void restart()}>
            Refazer análise
            <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
          </button>
          {error && <p className="inline-error" role="alert">{error}</p>}
        </div>
      </section>
    </main>
  );
}
