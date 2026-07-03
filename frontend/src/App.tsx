import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { selectAllQuestionsBalanced, selectAndBalanceQuestions } from './utils/quizSelection';
import { AxisIcon } from './components/AxisIcon';
import { HOME_AXES } from './data/homeAxes';
import { fetchQuiz, submitResults } from './services/quizApi';
import type { AnswerValue, QuizPayload, QuizResult, QuizVariant } from './types/quiz';

type Screen = 'home' | 'variant' | 'quiz' | 'results';
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
  {
    variant: 'short',
    label: 'Curta',
    questionCount: '36 perguntas',
    description: 'Resultado rápido, ideal para uma primeira leitura do seu perfil',
    duration: 'Aprox. 5min',
    action: 'Começar versão curta'
  },
  {
    variant: 'extended',
    label: 'Completa',
    questionCount: '60 perguntas',
    description: 'Mais precisão para aproximar seu resultado dos perfis ideológicos.',
    duration: 'Aprox. 9min',
    action: 'Começar versão completa',
    featured: true
  },
  {
    variant: 'extreme',
    label: 'Extrema',
    questionCount: '240 perguntas',
    description: 'Saiba exatamente a síntese do seu pensamento com 100% de precisão.',
    duration: 'Aprox. 30min',
    action: 'Começar versão extrema'
  }
];

const HERO_LABELS = [
  'Gratuito',
  'Anônimo',
  'Rápido',
  'Resultado imediato'
];

const AXIS_EXPLANATIONS: Record<string, string> = {
  estrutura:
    'Mede se você prefere poder distribuído entre estados, municípios e comunidades locais ou um Estado nacional unitário com leis e comando mais uniformes.',
  representacao:
    'Compara confiança em eleições, oposição e instituições democráticas com preferência por liderança forte, tecnocracia, monarquia ou regimes autoritários.',
  poder:
    'Avalia o equilíbrio entre ordem, vigilância, punição e controle estatal versus privacidade, liberdade individual e autonomia civil.',
  imigracao:
    'Observa se você valoriza assimilação cultural, idioma e identidade nacional ou multiculturalismo, abertura migratória e pluralidade de costumes.',
  diplomacia:
    'Analisa sua posição sobre Forças Armadas, armamento, dissuasão e intervenção militar em contraste com negociação, pacifismo e organismos internacionais.',
  intervencao:
    'Mede a inclinação entre não intervencionismo externo e soberania nacional mais assertiva, nacionalismo geopolítico e defesa ativa de interesses nacionais.',
  economia:
    'Compara preferência por propriedade pública, estatais e serviços coletivos com propriedade privada, privatização e protagonismo empresarial.',
  controle:
    'Avalia planejamento estatal, regulação e política econômica ativa contra livre mercado, baixa interferência, autonomia monetária e competição.',
  comercio:
    'Mede protecionismo, soberania produtiva e defesa da indústria nacional contra globalismo, livre comércio e integração econômica internacional.',
  religiao:
    'Compara laicidade, separação entre religião e Estado e crítica a privilégios religiosos com influência pública da fé e valores religiosos.',
  moral:
    'Avalia progressismo cultural, direitos civis e mudanças sociais em contraste com tradição, família, costumes e conservadorismo moral.',
  tecnologia:
    'Mede entusiasmo por tecnologia, IA, engenharia genética e desenvolvimento técnico contra cautela biológica, ambiental e preservacionista.'
};

const SPECTRUM_ITEMS = [
  {
    id: 'left-authoritarian',
    label: 'Esquerda autoritária',
    tone: 'red',
    description:
      'Combina igualdade econômica, socialismo ou forte política econômica estatal com maior centralização, disciplina institucional e poder do Estado.'
  },
  {
    id: 'left-libertarian',
    label: 'Esquerda libertária',
    tone: 'green',
    description:
      'Valoriza progressismo, direitos civis, democracia direta, crítica ao capitalismo concentrado e mais liberdade social, cultural e comunitária.'
  },
  {
    id: 'center',
    label: 'Centro',
    tone: 'gray',
    description:
      'Busca equilíbrio entre esquerda e direita, mercado e Estado, reformas e estabilidade, com posicionamento político moderado ou pragmático.'
  },
  {
    id: 'right-libertarian',
    label: 'Direita libertária',
    tone: 'yellow',
    description:
      'Defende capitalismo, livre mercado, propriedade privada, menor intervenção estatal e liberdades individuais acima de soluções centralizadas.'
  },
  {
    id: 'right-authoritarian',
    label: 'Direita autoritária',
    tone: 'blue',
    description:
      'Combina valores de ordem, conservadorismo, autoridade, soberania nacional e hierarquia com economia mais pró-mercado ou nacionalista.'
  }
];

const FAQ_ITEMS = [
  {
    question: 'O teste é confiável?',
    answer:
      'O teste político 12 Axes é confiável como ferramenta de leitura e comparação de posicionamento político. Ele usa perguntas distribuídas por 12 eixos para reduzir vieses de um único tema, mas não substitui estudo, debate ou análise acadêmica.'
  },
  {
    question: 'Quanto tempo demora?',
    answer:
      'A versão curta demora cerca de 5 minutos. A versão completa leva aproximadamente 9 minutos. A versão extrema, com 240 perguntas, pode levar cerca de 30 minutos.'
  },
  {
    question: 'Posso refazer?',
    answer:
      'Sim. Você pode refazer o quiz político quantas vezes quiser, inclusive escolhendo outra profundidade para comparar se o resultado muda.'
  },
  {
    question: 'Existe resposta certa?',
    answer:
      'Não existe resposta certa. O teste ideológico mede preferências sobre democracia, monarquia, federalismo, imigração, religião na política, política econômica, comércio internacional, liberalismo, conservadorismo, progressismo e outros temas.'
  },
  {
    question: 'Como o algoritmo calcula?',
    answer:
      'Cada resposta soma pontos em um polo específico. O algoritmo calcula percentuais por eixo, compara seu vetor ideológico com perfis de correntes políticas, países e personalidades, e retorna as maiores compatibilidades.'
  },
  {
    question: 'O resultado muda?',
    answer:
      'Pode mudar se suas opiniões mudarem, se você responder com mais nuance ou se fizer uma versão mais longa. A versão extrema tende a reduzir oscilações por usar mais perguntas.'
  },
  {
    question: 'O teste é científico?',
    answer:
      'O 12 Axes não é um instrumento científico validado clinicamente. Ele é um teste político educativo, inspirado em modelos de espectro político e quiz ideológico, útil para reflexão e comparação.'
  },
  {
    question: 'Posso compartilhar?',
    answer:
      'Sim. Ao terminar, você pode compartilhar seu resultado para discutir ideologia política, espectro político, esquerda, direita, centro e os 12 eixos com outras pessoas.'
  },
  {
    question: 'O teste coleta dados?',
    answer:
      'O teste é anônimo e não exige cadastro. As respostas são usadas para calcular o resultado no momento do quiz, sem pedir nome, e-mail ou identificação pessoal.'
  },
  {
    question: 'Posso responder pelo celular?',
    answer:
      'Sim. A interface foi pensada para celular e desktop, então você pode fazer o teste político pelo navegador do smartphone.'
  }
];

function buildQuizForVariant(payload: QuizPayload, variant: QuizVariant): QuizPayload {
  return variant === 'extreme' ? selectAllQuestionsBalanced(payload) : selectAndBalanceQuestions(payload);
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
  const [isLoading, setIsLoading] = useState(FULL_MODE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isHomeSeoReady, setIsHomeSeoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimerRef = useRef<number | null>(null);
  const isAdvancingRef = useRef(false);

  useEffect(() => {
    if (!FULL_MODE) {
      return;
    }

    fetchQuiz(INITIAL_VARIANT)
      .then((payload) => {
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
  const homeAxes = quiz?.axes ?? HOME_AXES;

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
      setQuiz(buildQuizForVariant(nextQuiz, variant));
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
      const nextResult = await submitResults(
        quiz.variant ?? selectedVariant,
        payload
      );
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
        prepareImagesForExport
      } = shareCard;

      const { stage: builtStage, target } = buildShareCard(result, quiz);
      stage = builtStage;
      document.body.appendChild(stage);
      await prepareImagesForExport(target);

      const dataUrl = await toPng(target, {
        width: SHARE_WIDTH,
        height: SHARE_HEIGHT,
        backgroundColor: SHARE_COLORS.soft,
        pixelRatio: 1,
        cacheBust: false,
        skipFonts: true
      });

      downloadDataUrl(
        dataUrl,
        `12axes-perfil-${new Date().toISOString().slice(0, 10)}.png`
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
        <LoadingPanel message="Carregando análise política..." />
      </main>
    );
  }

  if (error && !quiz && FULL_MODE) {
    return (
      <main className="app-shell center-shell">
        <div className="error-panel">
          <h1>12 Axes</h1>
          <p>{error}</p>
          <button className="secondary-button" type="button" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  if (!quiz && (screen === 'quiz' || screen === 'results')) {
    return null;
  }

  return (
    <main className="app-shell" data-screen={screen}>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => setScreen('home')} aria-label="Voltar para o início">
          <span className="brand-num">12</span>
          <span className="brand-word">axes</span>
        </button>
        {screen === 'home' && (
          <nav className="home-nav" aria-label="Navegação principal">
            <a href="#como-funciona">Como funciona</a>
            <a href="#guia-eixos">12 Eixos</a>
            <a href="#espectro-politico">Espectro</a>
            <a href="#faq">FAQ</a>
          </nav>
        )}
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
      <span id="conteudo-principal" className="skip-target" tabIndex={-1} />

      {screen === 'home' && (
        <section className="home-layout" id="inicio">
          <div className="home-grid">
            <div className="intro-panel">
              <span className="intro-eyebrow fade-up d-1">
                <strong>Quiz político</strong>
              </span>
              <h1 className="fade-up d-2">
                Descubra sua <em>posição política</em> em apenas 5 minutos
              </h1>
              <p className="intro-lead fade-up d-3">
                Analise suas opiniões em 12 dimensões independentes, compare seus
                resultados com diferentes correntes políticas, países e personalidades
                e entenda como suas ideias se distribuem no espectro político.
              </p>
              <div className="intro-actions fade-up d-4">
                <button className="primary-button hero-cta" type="button" onClick={openVariantChooser}>
                  Começar o Quiz
                  <svg className="btn-arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
                <a className="secondary-button" href="#guia-eixos">
                  Ver os 12 eixos
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

            <div className="canvas-panel hero-axis-panel">
              <div className="axis-mosaic fade-up d-3" id="eixos">
                {homeAxes.map((axis, index) => (
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

          {isHomeSeoReady && (
          <div className="home-seo">
            <section className="seo-block fade-up" aria-labelledby="como-funciona">
              <div className="section-heading">
                <span className="eyebrow">Como funciona</span>
                <h2 id="como-funciona">Como funciona o quiz político 12 Axes</h2>
                <p>
                  Um teste de ideologia política simples e visual: você responde a
                  afirmações, o 12 Axes calcula seus percentuais e mostra onde você
                  está no espectro político em cada dimensão.
                </p>
              </div>
              <div className="step-grid">
                <article className="step-card">
                  <span className="step-num">1</span>
                  <h3>Responda às perguntas</h3>
                  <p>
                    Concorde ou discorde de afirmações sobre economia, Estado,
                    liberdades civis, valores, religião, política externa e tecnologia.
                  </p>
                </article>
                <article className="step-card">
                  <span className="step-num">2</span>
                  <h3>Análise em 12 eixos</h3>
                  <p>
                    Cada resposta posiciona você em 12 eixos ideológicos
                    independentes - do livre mercado ao planejamento, do
                    nacionalismo ao globalismo.
                  </p>
                </article>
                <article className="step-card">
                  <span className="step-num">3</span>
                  <h3>Descubra seu perfil</h3>
                  <p>
                    Receba seu perfil ideológico, ideologias mais compatíveis,
                    país mais próximo, personalidade relacionada e resultado por eixo.
                  </p>
                </article>
              </div>
            </section>

            <section className="seo-block fade-up" aria-labelledby="guia-eixos">
              <div className="section-heading">
                <span className="eyebrow">12 eixos</span>
                <h2 id="guia-eixos">O que significa cada eixo?</h2>
                <p>
                  O teste ideológico 12 Axes analisa federalismo, representação
                  política, democracia, eleições, imigração, comércio internacional,
                  religião na política, política econômica, moral e tecnologia em
                  dimensões separadas.
                </p>
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
                <span className="eyebrow">Espectro político</span>
                <h2 id="espectro-politico">Descubra seu espectro político</h2>
                <p>
                  O resultado ajuda a visualizar seu posicionamento político entre
                  esquerda, direita e centro, mas também separa tendências libertárias
                  e autoritárias que aparecem em ideologias como liberalismo,
                  libertarianismo, socialismo, conservadorismo e progressismo.
                </p>
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
                <span className="eyebrow">FAQ</span>
                <h2 id="faq">FAQ - Perguntas frequentes</h2>
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
                <span className="eyebrow">Versões</span>
                <h2 id="versoes-teste">Escolha a profundidade</h2>
                <p>
                  Comece pelo quiz político rápido ou faça uma análise mais completa
                  do seu espectro político. Todas as versões usam os mesmos 12 eixos
                  e retornam o resultado imediatamente.
                </p>
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
          </div>
          )}
        </section>
      )}

      {screen === 'variant' && (
        <section className="variant-layout" aria-labelledby="variant-title">
          <div className="variant-heading fade-up d-1">
            <span className="eyebrow">Escolha o formato</span>
            <h1 id="variant-title">Você quer velocidade ou precisão?</h1>
            <p>
              A versão curta revela o resultado de forma rápida. A completa aumenta
              a precisão para aproximar melhor seu resultado dos perfis ideológicos.
            </p>
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
              <LoadingPanel message="Carregando quiz..." />
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
        </Suspense>
      )}

      {screen === 'results' && quiz && result && (
        <Suspense
          fallback={(
            <section className="results-layout">
              <LoadingPanel message="Carregando resultado..." />
            </section>
          )}
        >
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

          <div className="fade-up d-5">
            <CountryMatchCard match={result.topCountryMatch} />
          </div>

          <div className="fade-up d-5">
            <PersonalityMatchCard match={result.topPersonalityMatch} />
          </div>

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
        </Suspense>
      )}
    </main>
  );
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}
