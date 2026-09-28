// Dicionário de UI PT/EN/RU. O idioma é resolvido uma vez por carga de página
// (?lang → localStorage → navigator) e trocar de idioma recarrega a página,
// para que quiz e resultados sejam rebuscados já no idioma novo.
import type { PersonalityCategory, ProfileDimension } from '../types/quiz';

export type Lang = 'pt' | 'en' | 'ru';

const LANGS: readonly Lang[] = ['pt', 'en', 'ru'];

function isLang(value: string | null): value is Lang {
  return LANGS.includes(value as Lang);
}

const STORAGE_KEY = '12axes-lang';

// Idioma forçado pelo caminho: /en sempre inglês, /br sempre português,
// independente do aparelho ou da preferência salva.
function langForcedByPath(pathname: string): Lang | null {
  const path = (pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/');
  if (path === '/en') return 'en';
  if (path === '/br') return 'pt';
  if (path === '/ru') return 'ru';
  return null;
}

export function resolveLang(): Lang {
  if (typeof window === 'undefined') {
    return 'pt';
  }
  const forced = langForcedByPath(window.location.pathname);
  if (forced) {
    return forced;
  }
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLang(fromUrl)) {
    window.localStorage.setItem(STORAGE_KEY, fromUrl);
    return fromUrl;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLang(stored)) {
    return stored;
  }
  const browserLang = navigator.language?.toLowerCase() ?? '';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('ru')) return 'ru';
  return 'en';
}

export const LANG: Lang = resolveLang();

// O botão de idioma alterna em ciclo: PT → EN → RU → PT.
export function nextLang(lang: Lang): Lang {
  return LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
}

export function setLang(lang: Lang) {
  window.localStorage.setItem(STORAGE_KEY, lang);
  const url = new URL(window.location.href);
  url.searchParams.delete('lang');
  // Em /en ou /br a URL é o que define o idioma, então o toggle troca de rota.
  if (langForcedByPath(url.pathname)) {
    url.pathname = lang === 'pt' ? '/br' : `/${lang}`;
  }
  window.location.href = url.toString();
}

interface QuizFormatStrings {
  label: string;
  questionCount: string;
  description: string;
  duration: string;
  action: string;
}

interface Strings {
  htmlLang: string;
  docTitle: string;
  loadingAnalysis: string;
  loadingQuiz: string;
  loadingResult: string;
  tryAgain: string;
  skipToContent: string;
  backToStartAria: string;
  mainNavAria: string;
  navHow: string;
  navAxes: string;
  navSpectrum: string;
  navFaq: string;
  navIdeologies: string;
  navPersonalities: string;
  navCountries: string;
  navSupport: string;
  langToggleLabel: string;
  langToggleAria: string;
  redoQuiz: string;
  restartQuiz: string;
  heroEyebrow: string;
  h1Pre: string;
  h1Em: string;
  h1Post: string;
  introLead: string;
  startQuiz: string;
  seeAxes: string;
  heroLabels: string[];
  heroTeaserLabel: string;
  heroTeaserTag: string;
  formats: { short: QuizFormatStrings; extended: QuizFormatStrings; extreme: QuizFormatStrings };
  axisExplanations: Record<string, string>;
  axisInfoAria: (label: string) => string;
  closeLabel: string;
  personalityInfoAria: (name: string) => string;
  closenessTitle: string;
  closenessYou: string;
  homeAxes: Record<string, { label: string; leftPole: string; rightPole: string }>;
  spectrumItems: { id: string; label: string; tone: string; description: string }[];
  faqItems: { question: string; answer: string }[];
  howEyebrow: string;
  howTitle: string;
  howLead: string;
  steps: { title: string; text: string }[];
  axesGuideEyebrow: string;
  axesGuideTitle: string;
  axesGuideLead: string;
  discoveryEyebrow: string;
  discoveryTitle: string;
  discoveryLead: string;
  discoveryItems: { icon: string; title: string; text: string }[];
  exampleEyebrow: string;
  exampleTitle: string;
  exampleCaption: string;
  exampleCta: string;
  spectrumEyebrow: string;
  spectrumTitle: string;
  spectrumLead: string;
  faqTitle: string;
  faqLead: string;
  navStart: string;
  menuAria: string;
  roseAria: string;
  spectrumBarAria: string;
  footerTagline: string;
  versionsEyebrow: string;
  versionsTitle: string;
  versionsLead: string;
  variantEyebrow: string;
  variantTitlePre: string;
  variantTitleEm: string;
  backToStart: string;
  depthLabel: string;
  depthAria: (level: number) => string;
  recommended: string;
  formatNotes: string[];
  variantLead: string;
  quizNavAria: string;
  autoAdvance: string;
  back: string;
  next: string;
  calculating: string;
  seeResult: string;
  archetypeSkip: string;
  errMissingAnswer: string;
  errLoadQuiz: string;
  errCalc: string;
  errImage: string;
  errHttp: (status: number) => string;
  resultsEyebrow: string;
  resultsH1Pre: string;
  resultsH1Em: string;
  resultsLead: (count: number) => string;
  resultsLeadShared: string;
  resultsSummaryAria: string;
  metaAnswered: string;
  metaAxes: string;
  metaTop: string;
  axesSectionEyebrow: string;
  axesSectionTitle: string;
  proximityEyebrow: string;
  otherMatches: string;
  navOnThisPage: string;
  resultsNavAxes: string;
  resultsNavSignature: string;
  resultsNavCountries: string;
  resultsNavPersonalities: string;
  resultsNavAreas: string;
  resultsNavBooks: string;
  resultsNavIdeologies: string;
  countriesSectionTitle: string;
  countryCurrentTab: string;
  countryHistoricalTab: string;
  countriesDistantTitle: string;
  personalitiesSectionTitle: string;
  personalitiesByAreaTitle: string;
  dimensionsTitle: string;
  dimensionLabels: Record<ProfileDimension, string>;
  areasGeneralTitle: string;
  booksEyebrow: string;
  booksTitle: string;
  booksTopLabel: string;
  booksAuthorLabel: string;
  booksLead: string;
  booksWhy: (pct: number) => string;
  booksYearBc: (year: number) => string;
  booksCta: string;
  areasSectionTitle: string;
  areasTabsAria: string;
  areasGeneralTab: string;
  areasByAreaTab: string;
  personalitiesDistantTitle: string;
  ideologyDistantTitle: string;
  phraseTitle: string;
  phraseNote: (ideology: string) => string;
  signatureTitle: string;
  signatureUnusualLabel: string;
  signatureCommonLabel: string;
  signatureUnusualLead: (pole: string, percent: number) => string;
  signatureUnusualLeadMax: (pole: string) => string;
  signatureUnusualLeadBalanced: (axis: string, pole: string, percent: number) => string;
  signatureUnusualNote: (axis: string) => string;
  signatureCommonLead: (axis: string) => string;
  signatureCommonNote: (pole: string) => string;
  signatureCommonNoteBalanced: (axis: string) => string;
  tensionLabel: string;
  tensionCombo: (firstPole: string, secondPole: string) => string;
  tensionRare: (count: number, total: number) => string;
  tensionUnique: string;
  tensionExamples: (names: string) => string;
  tensionNote: (firstAxis: string, secondAxis: string) => string;
  signatureMedian: string;
  signatureYou: string;
  personalityCategories: Record<PersonalityCategory, string>;
  redoAnalysis: string;
  share: string;
  saveOrShare: string;
  generatingPng: string;
  shareFilePrefix: string;
  shareMessage: (
    ideology: string,
    ideologyPct: number,
    country: string,
    countryPct: number,
    personality: string,
    personalityPct: number
  ) => string;
  progress: (current: number, total: number) => string;
  progressDone: (percent: number) => string;
  archetypeHeader: string;
  archetypeStep: (current: number, total: number) => string;
  progressAria: (percent: number) => string;
  answersAria: string;
  countryKicker: string;
  flagLabel: string;
  flagHistoricLabel: string;
  flagAlt: (label: string, name: string) => string;
  flagUnavailable: string;
  flagUnavailableAria: (name: string) => string;
  personalityKicker: string;
  portraitAlt: (name: string) => string;
  portraitUnavailableAria: (name: string) => string;
  compatibilityAria: (pct: string) => string;
  matchWord: string;
  shareTitle: string;
  shareTopMatch: string;
  shareCountry: string;
  sharePersonality: string;
  shareResultLabel: string;
  shareMostCompatible: string;
  shareYourAxes: string;
  shareOtherPersonalities: string;
  shareNearbyCountries: string;
  shareFooterCta: string;
  shareFooterUrl: string;
  supportEyebrow: string;
  supportTitle: string;
  ossEyebrow: string;
  ossTitle: string;
  ossLead: string;
  ossCards: { title: string; text: string }[];
  ossBarText: string;
  ossGithubCta: string;
  ossIssueCta: string;
  supportTitleEm: string;
  supportLead: string;
  supportPrivacyNote: string;
  supportCopy: string;
  supportCopied: string;
  supportCopyAria: (label: string) => string;
  supportCoins: {
    id: string;
    name: string;
    network: string;
    address: string;
  }[];
}

const pt: Strings = {
  htmlLang: 'pt-BR',
  docTitle: '12 Axes — Quiz Político e Teste Ideológico em 12 Eixos',
  loadingAnalysis: 'Carregando análise política...',
  loadingQuiz: 'Carregando quiz...',
  loadingResult: 'Carregando resultado...',
  tryAgain: 'Tentar novamente',
  skipToContent: 'Pular para o conteúdo',
  backToStartAria: 'Voltar para o início',
  mainNavAria: 'Navegação principal',
  navHow: 'Como funciona',
  navAxes: '12 Eixos',
  navSpectrum: 'Espectro',
  navFaq: 'FAQ',
  navIdeologies: 'Ideologias',
  navPersonalities: 'Personalidades',
  navCountries: 'Países',
  navSupport: 'Apoie',
  langToggleLabel: 'EN',
  langToggleAria: 'Switch to English',
  redoQuiz: 'Refazer quiz',
  restartQuiz: 'Reiniciar quiz',
  heroEyebrow: 'Descoberta política',
  h1Pre: 'Você sabe mesmo qual é a sua ',
  h1Em: 'ideologia política',
  h1Post: '?',
  introLead:
    'Talvez você esteja se classificando errado. Em poucos minutos, descubra sua ideologia real, o país que mais pensa como você e o líder político mais parecido com suas ideias.',
  startQuiz: 'Descobrir meu perfil',
  seeAxes: 'Ver os 12 eixos',
  heroLabels: ['Gratuito', 'Anônimo', 'Rápido', 'Resultado imediato'],
  heroTeaserLabel: 'match',
  heroTeaserTag: 'Exemplo de resultado',
  formats: {
    short: {
      label: 'Curta',
      questionCount: '36 perguntas',
      description: 'Resultado rápido, ideal para uma primeira leitura do seu perfil',
      duration: 'Aprox. 5 min',
      action: 'Começar versão curta'
    },
    extended: {
      label: 'Completa',
      questionCount: '60 perguntas',
      description: 'Mais precisão para aproximar seu resultado dos perfis ideológicos.',
      duration: 'Aprox. 9 min',
      action: 'Começar versão completa'
    },
    extreme: {
      label: 'Extrema',
      questionCount: '240 perguntas',
      description: 'Saiba exatamente a síntese do seu pensamento com 100% de precisão.',
      duration: 'Aprox. 30 min',
      action: 'Começar versão extrema'
    }
  },
  axisInfoAria: (label) => `O que significa o eixo ${label}?`,
  closeLabel: 'Fechar',
  personalityInfoAria: (name) => `Ver detalhes de ${name}`,
  closenessTitle: 'O que te aproxima',
  closenessYou: 'Você',
  axisExplanations: {
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
  },
  homeAxes: {},
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Esquerda radical',
      tone: 'darkred',
      description:
        'Comunismo revolucionário ou totalitário de partido único, com economia planificada, forte centralização e concentração do poder do Estado.'
    },
    {
      id: 'left',
      label: 'Esquerda',
      tone: 'green',
      description:
        'Defende social-democracia, progressismo e maior intervenção do Estado na economia dentro da democracia liberal.'
    },
    {
      id: 'center',
      label: 'Centro',
      tone: 'gray',
      description:
        'Busca equilíbrio entre esquerda e direita, mercado e Estado, reformas e estabilidade, com posicionamento político moderado ou pragmático.'
    },
    {
      id: 'right',
      label: 'Direita',
      tone: 'blue',
      description:
        'Defende conservadorismo, liberalismo econômico e nacionalismo moderado dentro da democracia liberal.'
    },
    {
      id: 'right-extreme',
      label: 'Extrema direita',
      tone: 'navy',
      description:
        'Fascismo, nacionalismo racial e teocracias opressivas, com rejeição explícita da democracia e concentração autoritária do poder.'
    },
    {
      id: 'third-position',
      label: 'Terceira posição',
      tone: 'purple',
      description:
        'Síntese nacionalista e corporativista que rejeita tanto o capitalismo liberal quanto o marxismo, fora do eixo tradicional esquerda-direita.'
    },
    {
      id: 'libertarian',
      label: 'Libertário',
      tone: 'amber',
      description:
        'Defende Estado mínimo, livre mercado, propriedade privada e liberdades individuais, sem propor a abolição total do Estado.'
    },
    {
      id: 'anarchist',
      label: 'Anarquista',
      tone: 'charcoal',
      description:
        'Rejeita o Estado e toda autoridade coercitiva, defendendo organização social livre, voluntária e autogerida, de esquerda ou de direita.'
    }
  ],
  faqItems: [
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
  ],
  howEyebrow: 'Como funciona',
  howTitle: 'Como funciona o quiz político 12 Axes',
  howLead:
    'Um teste de ideologia política simples e visual: você responde a afirmações, o 12 Axes calcula seus percentuais e mostra onde você está no espectro político em cada dimensão.',
  steps: [
    {
      title: 'Responda às perguntas',
      text: 'Concorde ou discorde de afirmações sobre economia, Estado, liberdades civis, valores, religião, política externa e tecnologia.'
    },
    {
      title: 'Análise em 12 eixos',
      text: 'Cada resposta posiciona você em 12 eixos ideológicos independentes - do livre mercado ao planejamento, do nacionalismo ao globalismo.'
    },
    {
      title: 'Descubra seu perfil',
      text: 'Receba seu perfil ideológico, ideologias mais compatíveis, país mais próximo, personalidade relacionada e resultado por eixo.'
    }
  ],
  axesGuideEyebrow: '12 eixos',
  axesGuideTitle: 'O que significa cada eixo?',
  axesGuideLead:
    'O teste ideológico 12 Axes analisa federalismo, representação política, democracia, eleições, imigração, comércio internacional, religião na política, política econômica, moral e tecnologia em dimensões separadas.',
  discoveryEyebrow: 'O que você vai descobrir',
  discoveryTitle: 'Um retrato completo das suas convicções políticas',
  discoveryLead:
    'Mais do que esquerda ou direita: seu resultado mostra com quem, onde e com que intensidade suas ideias realmente combinam.',
  discoveryItems: [
    { icon: 'ideology', title: 'Sua ideologia', text: 'Qual corrente política combina com você' },
    { icon: 'country', title: 'Seu país', text: 'Que nação pensa parecido com você' },
    { icon: 'personality', title: 'Seu líder político', text: 'Qual figura histórica é seu par ideológico' },
    { icon: 'spectrum', title: 'Seu espectro', text: 'Onde você fica entre esquerda e direita' },
    { icon: 'profile', title: 'Seu perfil', text: 'Um retrato completo das suas convicções' },
    { icon: 'compatibility', title: 'Compatibilidade', text: 'O quanto você realmente concorda com sua própria ideologia' }
  ],
  exampleEyebrow: 'Exemplo real',
  exampleTitle: 'É assim que fica o seu resultado',
  exampleCaption: 'Exemplo ilustrativo com dados reais do catálogo do 12 Axes.',
  exampleCta: 'Quero ver o meu resultado',
  spectrumEyebrow: 'Espectro político',
  spectrumTitle: 'Descubra seu espectro político',
  spectrumLead:
    'O resultado ajuda a visualizar seu posicionamento político entre esquerda, direita e centro, além de identificar formas mais radicais, autoritárias ou libertárias que não cabem nesse eixo, como extrema direita, esquerda radical, terceira posição, libertarianismo e anarquismo.',
  faqTitle: 'Perguntas frequentes',
  faqLead: 'Tudo o que as pessoas costumam perguntar antes de fazer o teste.',
  navStart: 'Começar',
  menuAria: 'Abrir menu',
  roseAria: 'Rosa dos 12 eixos',
  spectrumBarAria: 'Barra do espectro político com as oito categorias',
  footerTagline: 'Quiz político independente · 12axes.vercel.app',
  versionsEyebrow: 'Versões',
  versionsTitle: 'Escolha a profundidade',
  versionsLead:
    'Comece pelo quiz rápido ou aprofunde sua análise para um retrato mais preciso do seu perfil ideológico. Todas as versões usam os mesmos 12 eixos e retornam o resultado imediatamente.',
  variantEyebrow: 'Escolha o formato',
  variantTitlePre: 'Você quer velocidade ou ',
  variantTitleEm: 'precisão?',
  backToStart: 'Voltar ao início',
  depthLabel: 'Profundidade',
  depthAria: (level) => `Profundidade ${level} de 3`,
  recommended: 'Recomendada',
  formatNotes: ['Todas as versões usam os mesmos 12 eixos', 'Anônimo, sem cadastro', 'Resultado imediato'],
  variantLead:
    'A versão curta revela o resultado de forma rápida. A completa aumenta a precisão para aproximar melhor seu resultado dos perfis ideológicos.',
  quizNavAria: 'Navegação do quiz',
  autoAdvance: 'Avançar ao responder',
  back: 'Voltar',
  next: 'Avançar',
  calculating: 'Calculando…',
  seeResult: 'Ver resultado',
  archetypeSkip: 'Pular',
  errMissingAnswer: 'Ainda falta responder esta pergunta antes de ver o resultado.',
  errLoadQuiz: 'Não foi possível carregar o quiz.',
  errCalc: 'Não foi possível calcular o resultado.',
  errImage: 'Não foi possível gerar a imagem do resultado.',
  errHttp: (status) => `Erro HTTP ${status}`,
  resultsEyebrow: 'Análise concluída',
  resultsH1Pre: 'Seu perfil ',
  resultsH1Em: 'ideológico',
  resultsLead: (count) =>
    `Análise baseada em ${count} respostas distribuídas em 12 dimensões fundamentais da ideologia política. Confira sua posição em cada eixo e suas correspondências ideológicas.`,
  resultsLeadShared:
    'Resultado compartilhado: a posição em cada um dos 12 eixos políticos e as correspondências ideológicas calculadas a partir dele. Faça o teste para descobrir o seu.',
  resultsSummaryAria: 'Resumo da análise',
  metaAnswered: 'Perguntas respondidas',
  metaAxes: 'Eixos analisados',
  metaTop: 'Top match',
  axesSectionEyebrow: 'Eixos políticos',
  axesSectionTitle: 'Resultado percentual por eixo',
  proximityEyebrow: 'Proximidade ideológica',
  otherMatches: 'Outras correspondências',
  navOnThisPage: 'Nesta página',
  resultsNavAxes: 'Os 12 eixos',
  resultsNavSignature: 'O que te distingue',
  resultsNavCountries: 'Países',
  resultsNavPersonalities: 'Personalidades',
  resultsNavAreas: 'Áreas de atuação',
  resultsNavBooks: 'Para ler',
  resultsNavIdeologies: 'Outras ideologias',
  countriesSectionTitle: 'Países mais próximos de você',
  countryCurrentTab: 'País atual',
  countryHistoricalTab: 'Experiência histórica',
  countriesDistantTitle: 'Os mais distantes de você',
  personalitiesSectionTitle: 'Personalidades mais próximas de você',
  personalitiesByAreaTitle: 'Também próximos, por área de atuação',
  dimensionsTitle: 'Também próximos, por dimensão do seu perfil',
  dimensionLabels: {
    political: 'Politicamente',
    social: 'Socialmente',
    economic: 'Economicamente',
  },
  booksEyebrow: 'Para ir além',
  booksTitle: 'Para ler',
  booksTopLabel: 'Mais próxima de você',
  booksAuthorLabel: 'Autor',
  booksLead: 'Uma obra de cada uma das personalidades mais próximas dos seus resultados.',
  booksWhy: (pct) => `${pct}% compatível`,
  booksYearBc: (year) => `${year} a.C.`,
  booksCta: 'Ver na Amazon',
  areasGeneralTitle: 'Os mais próximos dos seus resultados',
  areasSectionTitle: 'Os mais próximos por área de atuação',
  areasTabsAria: 'Modo de exibição das personalidades',
  areasGeneralTab: 'Compatibilidade geral',
  areasByAreaTab: 'Área de atuação',
  personalitiesDistantTitle: 'As mais distantes de você',
  ideologyDistantTitle: 'A ideologia mais distante de você',
  phraseTitle: 'Uma frase que te descreve',
  phraseNote: (ideology) => `É assim que alguém do ${ideology} resumiria a sociedade que quer.`,
  signatureTitle: 'O que te distingue',
  signatureUnusualLabel: 'Sua posição mais incomum',
  signatureCommonLabel: 'Sua posição mais comum',
  signatureUnusualLead: (pole, percent) => `Você puxa mais para ${pole.toLowerCase()} que ${Math.round(percent)}% das ideologias do catálogo.`,
  signatureUnusualLeadMax: (pole) => `Nenhuma ideologia do catálogo puxa tanto para ${pole.toLowerCase()} quanto você.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Sua posição em ${axis} é de meio-termo. Mesmo assim, isso já te coloca mais para ${pole.toLowerCase()} que ${Math.round(percent)}% das ideologias do catálogo.`,
  signatureUnusualNote: (axis) => `De todos os 12 eixos, ${axis} é onde você mais se afasta do conjunto. É o traço que mais te diferencia.`,
  signatureCommonLead: (axis) => `Sua posição em ${axis} é praticamente a mediana do catálogo.`,
  signatureCommonNote: (pole) => `Aqui você está em terreno comum. Não puxa para ${pole.toLowerCase()} nem para o polo oposto.`,
  signatureCommonNoteBalanced: (axis) => `Você fica no centro em ${axis}, e o catálogo também. É onde seu perfil menos se distingue.`,
  tensionLabel: 'Sua tensão interna',
  tensionCombo: (firstPole, secondPole) => `${firstPole} e ${secondPole} ao mesmo tempo`,
  tensionRare: (count, total) => `Só ${count} das ${total} ideologias do catálogo juntam essas duas posições.`,
  tensionUnique: 'Nenhuma ideologia do catálogo junta essas duas posições.',
  tensionExamples: (names) => `Quem chega perto: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `No catálogo, ${firstAxis} e ${secondAxis} costumam andar na mesma direção. Você inverte esse padrão.`,
  signatureMedian: 'Mediana das ideologias',
  signatureYou: 'Você',
  personalityCategories: {
    politico: 'Política',
    religioso: 'Religião',
    economista: 'Economia',
    filosofo: 'Filosofia',
    teorico: 'Teoria política',
    empresario: 'Empresariado',
    intelectual: 'Vida intelectual',
    ativista: 'Ativismo',
  },
  redoAnalysis: 'Refazer análise',
  share: 'Compartilhar',
  saveOrShare: 'Compartilhar resultado',
  generatingPng: 'Gerando PNG...',
  shareFilePrefix: '12axes-perfil',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `Descobri meu perfil ideológico no Quiz Político 12 Axes!\n\n` +
    `💡 Ideologia mais compatível:\n` +
    `${ideology} - ${ideologyPct}% de compatibilidade\n\n` +
    `🌎 País/Nação mais compatível:\n` +
    `${country} - ${countryPct}% de compatibilidade\n\n` +
    `👤 Personalidade mais compatível:\n` +
    `${personality} - ${personalityPct}% de compatibilidade\n\n` +
    `👉 Faça o teste e compartilhe seu resultado:\nhttps://12axes.vercel.app/`,
  progress: (current, total) => `Pergunta ${current} de ${total}`,
  progressDone: (percent) => `${percent}% concluído`,
  archetypeHeader: 'Identificando seu arquétipo',
  archetypeStep: (current, total) => `${current} de ${total}`,
  progressAria: (percent) => `Progresso do quiz: ${percent}%`,
  answersAria: 'Opções de resposta',
  countryKicker: 'País mais compatível',
  flagLabel: 'Bandeira',
  flagHistoricLabel: 'Bandeira / símbolo histórico',
  flagAlt: (label, name) => `${label} de ${name}`,
  flagUnavailable: 'Bandeira indisponível',
  flagUnavailableAria: (name) => `Bandeira indisponível de ${name}`,
  personalityKicker: 'Personalidade mais compatível',
  portraitAlt: (name) => `Retrato de ${name}`,
  portraitUnavailableAria: (name) => `Retrato indisponível de ${name}`,
  compatibilityAria: (pct) => `Compatibilidade: ${pct} por cento`,
  matchWord: 'match',
  shareTitle: 'Seu perfil ideológico | 12axes.vercel.app',
  shareTopMatch: 'Top match',
  shareCountry: 'País mais compatível',
  sharePersonality: 'Personalidade',
  shareResultLabel: 'MEU RESULTADO',
  shareMostCompatible: 'MAIS COMPATÍVEL',
  shareYourAxes: 'SEUS 12 EIXOS',
  shareOtherPersonalities: 'OUTRAS PERSONALIDADES',
  shareNearbyCountries: 'PAÍSES PRÓXIMOS',
  shareFooterCta: 'DESCUBRA SEU PERFIL',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Apoie o projeto',
  supportTitle: '',
  ossEyebrow: 'Código aberto',
  ossTitle: 'Um projeto independente e transparente',
  ossLead: 'Você não precisa confiar na nossa palavra. O código do 12 Axes é público: dá para ver como cada resposta é pontuada, como a compatibilidade é calculada e de onde vêm os perfis.',
  ossCards: [
    { title: 'Independente', text: 'Sem vínculo com partidos, governos ou campanhas. Ninguém paga para aparecer no seu resultado.' },
    { title: 'Auditável', text: 'A pontuação das respostas e o cálculo de compatibilidade estão no código, sem caixa-preta.' },
    { title: 'Verificável', text: 'Perguntas, ideologias, países e personalidades ficam em arquivos versionados, com histórico público.' },
    { title: 'Colaborativo', text: 'Achou uma pergunta enviesada ou um perfil impreciso? Abra uma issue ou envie um pull request.' }
  ],
  ossBarText: 'Leia o código, audite os dados e contribua pelo GitHub.',
  ossGithubCta: 'Ver no GitHub',
  ossIssueCta: 'Sugerir melhoria',
  supportTitleEm: 'Apoie',
  supportLead:
    'O 12 Axes é independente e gratuito. Se o teste te ajudou a entender melhor sua ideologia política, considere fazer uma doação via Pix ou criptomoedas para manter o projeto no ar.',
  supportPrivacyNote: 'Não coletamos dados. Para doar sem se identificar, use criptomoedas.',
  supportCopy: 'Copiar',
  supportCopied: 'Copiado!',
  supportCopyAria: (label) => `Copiar endereço de ${label}`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Chave aleatória',
      address: 'bf3e8e0b-27fe-4845-b5e2-358ca0281847'
    },
    {
      id: 'btc',
      name: 'Bitcoin',
      network: 'On-chain',
      address: 'bc1qsuy8r8gvl39apjykqzlgh7hku79ecarezhz2zj'
    },
    {
      id: 'lightning',
      name: 'Bitcoin',
      network: 'Lightning',
      address: 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhk2ctnw3jhymnsv96kcwfsa0gczg'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      network: 'ERC-20',
      address: '0xDe821e55D6101AA42D05DBf2C07ad0BB866C23a5'
    },
    {
      id: 'xmr',
      name: 'Monero',
      network: 'XMR',
      address:
        '85Du1EuRPkybMVXTVptC6z31dsGPpTthsiMKM3yjY7YE24BUCkyNMd9Q82kwe5CvE7BegtDTNxaG8VwYdVvTgbjDU6DpuN1'
    }
  ]
};

const en: Strings = {
  htmlLang: 'en',
  docTitle: '12 Axes — Political Quiz and Ideology Test across 12 Axes',
  loadingAnalysis: 'Loading political analysis...',
  loadingQuiz: 'Loading quiz...',
  loadingResult: 'Loading results...',
  tryAgain: 'Try again',
  skipToContent: 'Skip to content',
  backToStartAria: 'Back to start',
  mainNavAria: 'Main navigation',
  navHow: 'How it works',
  navAxes: '12 Axes',
  navSpectrum: 'Spectrum',
  navFaq: 'FAQ',
  navIdeologies: 'Ideologies',
  navPersonalities: 'Personalities',
  navCountries: 'Countries',
  navSupport: 'Support',
  langToggleLabel: 'RU',
  langToggleAria: 'Переключить на русский',
  redoQuiz: 'Retake quiz',
  restartQuiz: 'Restart quiz',
  heroEyebrow: 'Political discovery',
  h1Pre: 'Do you really know your ',
  h1Em: 'political ideology',
  h1Post: '?',
  introLead:
    'You might be labeling yourself wrong. In a few minutes, discover your real ideology, the country that thinks most like you, and the political leader closest to your ideas.',
  startQuiz: 'Discover my profile',
  seeAxes: 'See the 12 axes',
  heroLabels: ['Free', 'Anonymous', 'Fast', 'Instant result'],
  heroTeaserLabel: 'match',
  heroTeaserTag: 'Example result',
  formats: {
    short: {
      label: 'Short',
      questionCount: '36 questions',
      description: 'A quick result, ideal for a first reading of your profile',
      duration: 'About 5 min',
      action: 'Start short version'
    },
    extended: {
      label: 'Full',
      questionCount: '60 questions',
      description: 'More precision to bring your result closer to the ideological profiles.',
      duration: 'About 9 min',
      action: 'Start full version'
    },
    extreme: {
      label: 'Extreme',
      questionCount: '240 questions',
      description: 'Know the exact synthesis of your thinking with 100% precision.',
      duration: 'About 30 min',
      action: 'Start extreme version'
    }
  },
  axisInfoAria: (label) => `What does the ${label} axis mean?`,
  closeLabel: 'Close',
  personalityInfoAria: (name) => `See details about ${name}`,
  closenessTitle: 'What brings you closer',
  closenessYou: 'You',
  axisExplanations: {
    estrutura:
      'Measures whether you prefer power distributed among states, cities, and local communities or a unitary national state with more uniform laws and command.',
    representacao:
      'Compares trust in elections, opposition, and democratic institutions with a preference for strong leadership, technocracy, monarchy, or authoritarian regimes.',
    poder:
      'Evaluates the balance between order, surveillance, punishment, and state control versus privacy, individual freedom, and civil autonomy.',
    imigracao:
      'Looks at whether you value cultural assimilation, language, and national identity or multiculturalism, open migration, and plurality of customs.',
    diplomacia:
      'Analyzes your position on armed forces, weapons, deterrence, and military intervention in contrast with negotiation, pacifism, and international organizations.',
    intervencao:
      'Measures the leaning between external non-interventionism and more assertive national sovereignty, geopolitical nationalism, and active defense of national interests.',
    economia:
      'Compares a preference for public ownership, state companies, and collective services with private property, privatization, and business leadership.',
    controle:
      'Evaluates state planning, regulation, and active economic policy against free markets, low interference, monetary autonomy, and competition.',
    comercio:
      'Measures protectionism, productive sovereignty, and defense of national industry against globalism, free trade, and international economic integration.',
    religiao:
      'Compares secularism, separation of religion and state, and criticism of religious privileges with the public influence of faith and religious values.',
    moral:
      'Evaluates cultural progressivism, civil rights, and social change in contrast with tradition, family, customs, and moral conservatism.',
    tecnologia:
      'Measures enthusiasm for technology, AI, genetic engineering, and technical development against biological, environmental, and preservationist caution.'
  },
  homeAxes: {
    estrutura: { label: 'Structure', leftPole: 'Federal', rightPole: 'Unitary' },
    representacao: { label: 'Representation', leftPole: 'Democracy', rightPole: 'Autocracy' },
    poder: { label: 'Power', leftPole: 'Security', rightPole: 'Liberty' },
    imigracao: { label: 'Immigration', leftPole: 'Assimilation', rightPole: 'Multiculturalism' },
    diplomacia: { label: 'Diplomacy', leftPole: 'Militarist', rightPole: 'Pacifist' },
    intervencao: { label: 'Intervention', leftPole: 'Non-interventionist', rightPole: 'Nationalist' },
    economia: { label: 'Economy', leftPole: 'Public', rightPole: 'Private' },
    controle: { label: 'Control', leftPole: 'Planning', rightPole: 'Free market' },
    comercio: { label: 'Trade', leftPole: 'Protectionism', rightPole: 'Globalism' },
    religiao: { label: 'Religion', leftPole: 'Irreligious', rightPole: 'Religious' },
    moral: { label: 'Morality', leftPole: 'Progressive', rightPole: 'Traditionalist' },
    tecnologia: { label: 'Technology', leftPole: 'Technology', rightPole: 'Biology' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Radical left',
      tone: 'darkred',
      description:
        'Revolutionary or totalitarian single-party communism, with a planned economy, strong centralization, and concentrated state power.'
    },
    {
      id: 'left',
      label: 'Left',
      tone: 'green',
      description:
        'Advocates social democracy, progressivism, and greater state intervention in the economy within liberal democracy.'
    },
    {
      id: 'center',
      label: 'Center',
      tone: 'gray',
      description:
        'Seeks balance between left and right, market and state, reform and stability, with a moderate or pragmatic political stance.'
    },
    {
      id: 'right',
      label: 'Right',
      tone: 'blue',
      description:
        'Advocates conservatism, economic liberalism, and moderate nationalism within liberal democracy.'
    },
    {
      id: 'right-extreme',
      label: 'Far-right',
      tone: 'navy',
      description:
        'Fascism, racial nationalism, and oppressive theocracies, with explicit rejection of democracy and authoritarian concentration of power.'
    },
    {
      id: 'third-position',
      label: 'Third position',
      tone: 'purple',
      description:
        'A nationalist, corporatist synthesis that rejects both liberal capitalism and Marxism, outside the traditional left-right axis.'
    },
    {
      id: 'libertarian',
      label: 'Libertarian',
      tone: 'amber',
      description:
        'Advocates a minimal state, free markets, private property, and individual liberties, without proposing the total abolition of the state.'
    },
    {
      id: 'anarchist',
      label: 'Anarchist',
      tone: 'charcoal',
      description:
        'Rejects the state and all coercive authority, advocating free, voluntary, and self-managed social organization, from the left or the right.'
    }
  ],
  faqItems: [
    {
      question: 'Is the test reliable?',
      answer:
        'The 12 Axes political test is reliable as a tool for reading and comparing political positions. It uses questions spread across 12 axes to reduce single-topic bias, but it does not replace study, debate, or academic analysis.'
    },
    {
      question: 'How long does it take?',
      answer:
        'The short version takes about 5 minutes. The full version takes roughly 9 minutes. The extreme version, with 240 questions, can take about 30 minutes.'
    },
    {
      question: 'Can I retake it?',
      answer:
        'Yes. You can retake the political quiz as many times as you like, including choosing another depth to compare whether your result changes.'
    },
    {
      question: 'Is there a right answer?',
      answer:
        'There is no right answer. The ideology test measures preferences about democracy, monarchy, federalism, immigration, religion in politics, economic policy, international trade, liberalism, conservatism, progressivism, and other topics.'
    },
    {
      question: 'How does the algorithm calculate?',
      answer:
        'Each answer adds points to a specific pole. The algorithm calculates percentages per axis, compares your ideological vector with the profiles of political currents, countries, and personalities, and returns the highest compatibilities.'
    },
    {
      question: 'Does the result change?',
      answer:
        'It can change if your opinions change, if you answer with more nuance, or if you take a longer version. The extreme version tends to reduce fluctuations by using more questions.'
    },
    {
      question: 'Is the test scientific?',
      answer:
        '12 Axes is not a clinically validated scientific instrument. It is an educational political test, inspired by political spectrum models and ideology quizzes, useful for reflection and comparison.'
    },
    {
      question: 'Can I share it?',
      answer:
        'Yes. When you finish, you can share your result to discuss political ideology, the political spectrum, left, right, center, and the 12 axes with other people.'
    },
    {
      question: 'Does the test collect data?',
      answer:
        'The test is anonymous and requires no sign-up. Answers are used to calculate the result at quiz time, without asking for your name, email, or personal identification.'
    },
    {
      question: 'Can I take it on my phone?',
      answer:
        'Yes. The interface was designed for mobile and desktop, so you can take the political test in your smartphone browser.'
    }
  ],
  howEyebrow: 'How it works',
  howTitle: 'How the 12 Axes political quiz works',
  howLead:
    'A simple, visual political ideology test: you respond to statements, 12 Axes calculates your percentages, and shows where you stand on the political spectrum in each dimension.',
  steps: [
    {
      title: 'Answer the questions',
      text: 'Agree or disagree with statements about the economy, the state, civil liberties, values, religion, foreign policy, and technology.'
    },
    {
      title: 'Analysis across 12 axes',
      text: 'Each answer positions you on 12 independent ideological axes - from free markets to planning, from nationalism to globalism.'
    },
    {
      title: 'Discover your profile',
      text: 'Receive your ideological profile, most compatible ideologies, closest country, related personality, and per-axis results.'
    }
  ],
  axesGuideEyebrow: '12 axes',
  axesGuideTitle: 'What does each axis mean?',
  axesGuideLead:
    'The 12 Axes ideology test analyzes federalism, political representation, democracy, elections, immigration, international trade, religion in politics, economic policy, morality, and technology in separate dimensions.',
  discoveryEyebrow: 'What you will discover',
  discoveryTitle: 'A complete portrait of your political convictions',
  discoveryLead:
    'More than left or right: your result shows who, where, and how strongly your ideas actually align.',
  discoveryItems: [
    { icon: 'ideology', title: 'Your ideology', text: 'Which political current matches you' },
    { icon: 'country', title: 'Your country', text: 'Which nation thinks most like you' },
    { icon: 'personality', title: 'Your political leader', text: 'Which historical figure is your ideological match' },
    { icon: 'spectrum', title: 'Your spectrum', text: 'Where you fall between left and right' },
    { icon: 'profile', title: 'Your profile', text: 'A complete portrait of your convictions' },
    { icon: 'compatibility', title: 'Compatibility', text: 'How much you truly agree with your own ideology' }
  ],
  exampleEyebrow: 'Real example',
  exampleTitle: "Here's what your result looks like",
  exampleCaption: 'Illustrative example using real data from the 12 Axes catalog.',
  exampleCta: 'I want to see my result',
  spectrumEyebrow: 'Political spectrum',
  spectrumTitle: 'Discover your political spectrum',
  spectrumLead:
    'The result helps you visualize your political position between left, right, and center, and also identifies more radical, authoritarian, or libertarian forms that fall outside that axis, such as far-right, radical left, third position, libertarianism, and anarchism.',
  faqTitle: 'Frequently asked questions',
  faqLead: 'Everything people usually ask before taking the test.',
  navStart: 'Start',
  menuAria: 'Open menu',
  roseAria: 'Rose of the 12 axes',
  spectrumBarAria: 'Political spectrum bar with the eight categories',
  footerTagline: 'Independent political quiz · 12axes.vercel.app',
  versionsEyebrow: 'Versions',
  versionsTitle: 'Choose the depth',
  versionsLead:
    'Start with the quick quiz or go deeper for a more precise portrait of your ideological profile. All versions use the same 12 axes and return the result immediately.',
  variantEyebrow: 'Choose the format',
  variantTitlePre: 'Do you want speed or ',
  variantTitleEm: 'precision?',
  backToStart: 'Back to start',
  depthLabel: 'Depth',
  depthAria: (level) => `Depth ${level} of 3`,
  recommended: 'Recommended',
  formatNotes: ['All versions use the same 12 axes', 'Anonymous, no sign-up', 'Instant result'],
  variantLead:
    'The short version reveals the result quickly. The full version increases precision to bring your result closer to the ideological profiles.',
  quizNavAria: 'Quiz navigation',
  autoAdvance: 'Advance on answer',
  back: 'Back',
  next: 'Next',
  calculating: 'Calculating…',
  seeResult: 'See results',
  archetypeSkip: 'Skip',
  errMissingAnswer: 'You still need to answer this question before seeing the result.',
  errLoadQuiz: 'Could not load the quiz.',
  errCalc: 'Could not calculate the result.',
  errImage: 'Could not generate the result image.',
  errHttp: (status) => `HTTP error ${status}`,
  resultsEyebrow: 'Analysis complete',
  resultsH1Pre: 'Your ideological ',
  resultsH1Em: 'profile',
  resultsLead: (count) =>
    `Analysis based on ${count} answers distributed across 12 fundamental dimensions of political ideology. Check your position on each axis and your ideological matches.`,
  resultsLeadShared:
    'Shared result: the position on each of the 12 political axes and the ideological matches calculated from it. Take the test to discover yours.',
  resultsSummaryAria: 'Analysis summary',
  metaAnswered: 'Questions answered',
  metaAxes: 'Axes analyzed',
  metaTop: 'Top match',
  axesSectionEyebrow: 'Political axes',
  axesSectionTitle: 'Percentage result per axis',
  proximityEyebrow: 'Ideological proximity',
  otherMatches: 'Other matches',
  navOnThisPage: 'On this page',
  resultsNavAxes: 'The 12 axes',
  resultsNavSignature: 'What sets you apart',
  resultsNavCountries: 'Countries',
  resultsNavPersonalities: 'Figures',
  resultsNavAreas: 'Fields',
  resultsNavBooks: 'Further reading',
  resultsNavIdeologies: 'Other ideologies',
  countriesSectionTitle: 'Countries closest to you',
  countryCurrentTab: 'Present-day',
  countryHistoricalTab: 'Historical',
  countriesDistantTitle: 'Furthest from you',
  personalitiesSectionTitle: 'Figures closest to you',
  personalitiesByAreaTitle: 'Also close to you, by field',
  dimensionsTitle: 'Also close to you, by dimension of your profile',
  dimensionLabels: {
    political: 'Politically',
    social: 'Socially',
    economic: 'Economically',
  },
  booksEyebrow: 'Go further',
  booksTitle: 'Further reading',
  booksTopLabel: 'Closest to you',
  booksAuthorLabel: 'Author',
  booksLead: 'One work by each of the figures closest to your results.',
  booksWhy: (pct) => `${pct}% compatible`,
  booksYearBc: (year) => `${year} BC`,
  booksCta: 'See on Amazon',
  areasGeneralTitle: 'The closest figures to your results',
  areasSectionTitle: 'The closest figures by field',
  areasTabsAria: 'How figures are grouped',
  areasGeneralTab: 'Overall compatibility',
  areasByAreaTab: 'Field',
  personalitiesDistantTitle: 'Furthest from you',
  ideologyDistantTitle: 'The ideology furthest from you',
  phraseTitle: 'A sentence that describes you',
  phraseNote: (ideology) => `This is how someone from ${ideology} would sum up the society they want.`,
  signatureTitle: 'What sets you apart',
  signatureUnusualLabel: 'Your most unusual position',
  signatureCommonLabel: 'Your most typical position',
  signatureUnusualLead: (pole, percent) => `You lean further toward ${pole.toLowerCase()} than ${Math.round(percent)}% of the ideologies in the catalog.`,
  signatureUnusualLeadMax: (pole) => `No ideology in the catalog leans as far toward ${pole.toLowerCase()} as you do.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `Your position on ${axis} is middle of the road. Even so, that puts you further toward ${pole.toLowerCase()} than ${Math.round(percent)}% of the ideologies in the catalog.`,
  signatureUnusualNote: (axis) => `Of all 12 axes, ${axis} is where you depart most from the field. It is the trait that sets you apart.`,
  signatureCommonLead: (axis) => `Your position on ${axis} sits almost exactly at the catalog median.`,
  signatureCommonNote: (pole) => `This is common ground. You lean neither toward ${pole.toLowerCase()} nor to the opposite pole.`,
  signatureCommonNoteBalanced: (axis) => `You sit at the centre on ${axis}, and so does the catalog. This is where your profile stands out least.`,
  tensionLabel: 'Your internal tension',
  tensionCombo: (firstPole, secondPole) => `${firstPole} and ${secondPole} at the same time`,
  tensionRare: (count, total) => `Only ${count} of the ${total} ideologies in the catalog hold both of these positions.`,
  tensionUnique: 'No ideology in the catalog holds both of these positions.',
  tensionExamples: (names) => `Closest matches: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `In the catalog, ${firstAxis} and ${secondAxis} usually move together. You reverse that pattern.`,
  signatureMedian: 'Ideology median',
  signatureYou: 'You',
  personalityCategories: {
    politico: 'Politics',
    religioso: 'Religion',
    economista: 'Economics',
    filosofo: 'Philosophy',
    teorico: 'Political theory',
    empresario: 'Business',
    intelectual: 'Intellectual life',
    ativista: 'Activism',
  },
  redoAnalysis: 'Retake analysis',
  share: 'Share',
  saveOrShare: 'Share result',
  generatingPng: 'Generating PNG...',
  shareFilePrefix: '12axes-profile',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `I discovered my ideological profile on the 12 Axes Political Quiz!\n\n` +
    `💡 Most compatible ideology:\n` +
    `${ideology} - ${ideologyPct}% compatibility\n\n` +
    `🌎 Most compatible country/nation:\n` +
    `${country} - ${countryPct}% compatibility\n\n` +
    `👤 Most compatible personality:\n` +
    `${personality} - ${personalityPct}% compatibility\n\n` +
    `👉 Take the test and share your result:\nhttps://12axes.vercel.app/en`,
  progress: (current, total) => `Question ${current} of ${total}`,
  progressDone: (percent) => `${percent}% complete`,
  archetypeHeader: 'Identifying your archetype',
  archetypeStep: (current, total) => `${current} of ${total}`,
  progressAria: (percent) => `Quiz progress: ${percent}%`,
  answersAria: 'Answer options',
  countryKicker: 'Most compatible country',
  flagLabel: 'Flag',
  flagHistoricLabel: 'Flag / historical symbol',
  flagAlt: (label, name) => `${label} of ${name}`,
  flagUnavailable: 'Flag unavailable',
  flagUnavailableAria: (name) => `Flag unavailable for ${name}`,
  personalityKicker: 'Most compatible personality',
  portraitAlt: (name) => `Portrait of ${name}`,
  portraitUnavailableAria: (name) => `Portrait unavailable for ${name}`,
  compatibilityAria: (pct) => `Compatibility: ${pct} percent`,
  matchWord: 'match',
  shareTitle: 'My ideological profile | 12axes.vercel.app',
  shareTopMatch: 'Top match',
  shareCountry: 'Most compatible country',
  sharePersonality: 'Personality',
  shareResultLabel: 'MY RESULT',
  shareMostCompatible: 'MOST COMPATIBLE',
  shareYourAxes: 'YOUR 12 AXES',
  shareOtherPersonalities: 'OTHER PERSONALITIES',
  shareNearbyCountries: 'NEARBY COUNTRIES',
  shareFooterCta: 'DISCOVER YOUR PROFILE',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Support the project',
  supportTitle: '',
  ossEyebrow: 'Open source',
  ossTitle: 'An independent, transparent project',
  ossLead: "You don't have to take our word for it. The 12 Axes code is public: you can see how every answer is scored, how compatibility is calculated and where the profiles come from.",
  ossCards: [
    { title: 'Independent', text: 'No ties to parties, governments or campaigns. Nobody pays to appear in your result.' },
    { title: 'Auditable', text: 'Answer scoring and the compatibility calculation live in the code, with no black box.' },
    { title: 'Verifiable', text: 'Questions, ideologies, countries and personalities are stored in versioned files with a public history.' },
    { title: 'Collaborative', text: 'Found a biased question or an inaccurate profile? Open an issue or send a pull request.' }
  ],
  ossBarText: 'Read the code, audit the data and contribute on GitHub.',
  ossGithubCta: 'View on GitHub',
  ossIssueCta: 'Suggest an improvement',
  supportTitleEm: 'Support',
  supportLead:
    '12 Axes is independent and free. If the quiz helped you better understand your political ideology, consider donating via Pix or crypto to help keep the project running.',
  supportPrivacyNote: "We don't collect data. To donate without identifying yourself, use crypto.",
  supportCopy: 'Copy',
  supportCopied: 'Copied!',
  supportCopyAria: (label) => `Copy ${label} address`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Random key',
      address: 'bf3e8e0b-27fe-4845-b5e2-358ca0281847'
    },
    {
      id: 'btc',
      name: 'Bitcoin',
      network: 'On-chain',
      address: 'bc1qsuy8r8gvl39apjykqzlgh7hku79ecarezhz2zj'
    },
    {
      id: 'lightning',
      name: 'Bitcoin',
      network: 'Lightning',
      address: 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhk2ctnw3jhymnsv96kcwfsa0gczg'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      network: 'ERC-20',
      address: '0xDe821e55D6101AA42D05DBf2C07ad0BB866C23a5'
    },
    {
      id: 'xmr',
      name: 'Monero',
      network: 'XMR',
      address:
        '85Du1EuRPkybMVXTVptC6z31dsGPpTthsiMKM3yjY7YE24BUCkyNMd9Q82kwe5CvE7BegtDTNxaG8VwYdVvTgbjDU6DpuN1'
    }
  ]
};

const ru: Strings = {
  htmlLang: 'ru',
  docTitle: '12 Axes — политический тест на идеологию по 12 осям',
  loadingAnalysis: 'Загружаем политический анализ...',
  loadingQuiz: 'Загружаем тест...',
  loadingResult: 'Загружаем результаты...',
  tryAgain: 'Попробовать снова',
  skipToContent: 'Перейти к содержанию',
  backToStartAria: 'Вернуться в начало',
  mainNavAria: 'Основная навигация',
  navHow: 'Как это работает',
  navAxes: '12 осей',
  navSpectrum: 'Спектр',
  navFaq: 'Вопросы',
  navIdeologies: 'Идеологии',
  navPersonalities: 'Личности',
  navCountries: 'Страны',
  navSupport: 'Поддержать',
  langToggleLabel: 'PT',
  langToggleAria: 'Mudar para português',
  redoQuiz: 'Пройти заново',
  restartQuiz: 'Начать тест заново',
  heroEyebrow: 'Политическое самопознание',
  h1Pre: 'Вы действительно знаете свою ',
  h1Em: 'политическую идеологию',
  h1Post: '?',
  introLead:
    'Возможно, вы причисляете себя не к тому лагерю. За несколько минут узнайте свою настоящую идеологию, страну, которая думает так же, как вы, и политического лидера, чьи взгляды ближе всего к вашим.',
  startQuiz: 'Узнать свой профиль',
  seeAxes: 'Смотреть 12 осей',
  heroLabels: ['Бесплатно', 'Анонимно', 'Быстро', 'Мгновенный результат'],
  heroTeaserLabel: 'совпадение',
  heroTeaserTag: 'Пример результата',
  formats: {
    short: {
      label: 'Короткий',
      questionCount: '36 вопросов',
      description: 'Быстрый результат — идеально для первого знакомства со своим профилем',
      duration: 'Около 5 мин',
      action: 'Начать короткую версию'
    },
    extended: {
      label: 'Полный',
      questionCount: '60 вопросов',
      description: 'Больше точности, чтобы результат точнее совпал с идеологическими профилями.',
      duration: 'Около 9 мин',
      action: 'Начать полную версию'
    },
    extreme: {
      label: 'Экстремальный',
      questionCount: '240 вопросов',
      description: 'Точный синтез вашего мировоззрения со 100% точностью.',
      duration: 'Около 30 мин',
      action: 'Начать экстремальную версию'
    }
  },
  axisInfoAria: (label) => `Что означает ось «${label}»?`,
  closeLabel: 'Закрыть',
  personalityInfoAria: (name) => `Подробнее: ${name}`,
  closenessTitle: 'Что вас сближает',
  closenessYou: 'Вы',
  axisExplanations: {
    estrutura:
      'Показывает, предпочитаете ли вы власть, распределённую между регионами, городами и местными сообществами, или унитарное национальное государство с более единообразными законами и управлением.',
    representacao:
      'Сравнивает доверие к выборам, оппозиции и демократическим институтам с предпочтением сильного лидерства, технократии, монархии или авторитарных режимов.',
    poder:
      'Оценивает баланс между порядком, слежкой, наказанием и государственным контролем, с одной стороны, и приватностью, личной свободой и гражданской автономией — с другой.',
    imigracao:
      'Показывает, что для вас важнее: культурная ассимиляция, язык и национальная идентичность или мультикультурализм, открытая миграция и многообразие обычаев.',
    diplomacia:
      'Анализирует ваше отношение к вооружённым силам, оружию, сдерживанию и военному вмешательству в сравнении с переговорами, пацифизмом и международными организациями.',
    intervencao:
      'Показывает склонность к внешнему невмешательству или к более напористому национальному суверенитету, геополитическому национализму и активной защите национальных интересов.',
    economia:
      'Сравнивает предпочтение общественной собственности, государственных компаний и коллективных услуг с частной собственностью, приватизацией и ведущей ролью бизнеса.',
    controle:
      'Оценивает государственное планирование, регулирование и активную экономическую политику в противовес свободному рынку, минимальному вмешательству, денежной автономии и конкуренции.',
    comercio:
      'Показывает отношение к протекционизму, производственному суверенитету и защите отечественной промышленности в противовес глобализму, свободной торговле и международной экономической интеграции.',
    religiao:
      'Сравнивает светскость, отделение религии от государства и критику религиозных привилегий с общественным влиянием веры и религиозных ценностей.',
    moral:
      'Оценивает культурный прогрессизм, гражданские права и социальные перемены в сравнении с традицией, семьёй, обычаями и моральным консерватизмом.',
    tecnologia:
      'Показывает энтузиазм по отношению к технологиям, ИИ, генной инженерии и техническому развитию в противовес биологической, экологической и охранительной осторожности.'
  },
  homeAxes: {
    estrutura: { label: 'Устройство', leftPole: 'Федерализм', rightPole: 'Унитаризм' },
    representacao: { label: 'Представительство', leftPole: 'Демократия', rightPole: 'Автократия' },
    poder: { label: 'Власть', leftPole: 'Безопасность', rightPole: 'Свобода' },
    imigracao: { label: 'Иммиграция', leftPole: 'Ассимиляция', rightPole: 'Мультикультурализм' },
    diplomacia: { label: 'Дипломатия', leftPole: 'Милитаризм', rightPole: 'Пацифизм' },
    intervencao: { label: 'Вмешательство', leftPole: 'Невмешательство', rightPole: 'Национализм' },
    economia: { label: 'Экономика', leftPole: 'Государственная', rightPole: 'Частная' },
    controle: { label: 'Регулирование', leftPole: 'Планирование', rightPole: 'Свободный рынок' },
    comercio: { label: 'Торговля', leftPole: 'Протекционизм', rightPole: 'Глобализм' },
    religiao: { label: 'Религия', leftPole: 'Нерелигиозность', rightPole: 'Религиозность' },
    moral: { label: 'Мораль', leftPole: 'Прогрессизм', rightPole: 'Традиционализм' },
    tecnologia: { label: 'Технологии', leftPole: 'Технологии', rightPole: 'Биология' }
  },
  spectrumItems: [
    {
      id: 'left-radical',
      label: 'Радикальные левые',
      tone: 'darkred',
      description:
        'Революционный или тоталитарный однопартийный коммунизм с плановой экономикой, сильной централизацией и сосредоточенной государственной властью.'
    },
    {
      id: 'left',
      label: 'Левые',
      tone: 'green',
      description:
        'Выступают за социал-демократию, прогрессизм и более активное участие государства в экономике в рамках либеральной демократии.'
    },
    {
      id: 'center',
      label: 'Центр',
      tone: 'gray',
      description:
        'Ищет баланс между левыми и правыми, рынком и государством, реформами и стабильностью; умеренная или прагматичная позиция.'
    },
    {
      id: 'right',
      label: 'Правые',
      tone: 'blue',
      description:
        'Выступают за консерватизм, экономический либерализм и умеренный национализм в рамках либеральной демократии.'
    },
    {
      id: 'right-extreme',
      label: 'Ультраправые',
      tone: 'navy',
      description:
        'Фашизм, расовый национализм и репрессивные теократии с открытым отрицанием демократии и авторитарной концентрацией власти.'
    },
    {
      id: 'third-position',
      label: 'Третий путь',
      tone: 'purple',
      description:
        'Националистический корпоративистский синтез, отвергающий и либеральный капитализм, и марксизм, — вне традиционной оси «левые — правые».'
    },
    {
      id: 'libertarian',
      label: 'Либертарианцы',
      tone: 'amber',
      description:
        'Выступают за минимальное государство, свободный рынок, частную собственность и личные свободы, не предлагая полностью упразднить государство.'
    },
    {
      id: 'anarchist',
      label: 'Анархисты',
      tone: 'charcoal',
      description:
        'Отвергают государство и любую принудительную власть, выступая за свободную, добровольную и самоуправляемую организацию общества — слева или справа.'
    }
  ],
  faqItems: [
    {
      question: 'Можно ли доверять тесту?',
      answer:
        'Политический тест 12 Axes надёжен как инструмент для осмысления и сравнения политических позиций. Вопросы распределены по 12 осям, чтобы снизить перекос в сторону одной темы, но тест не заменяет изучения, дискуссий и академического анализа.'
    },
    {
      question: 'Сколько времени это займёт?',
      answer:
        'Короткая версия занимает около 5 минут, полная — примерно 9 минут. Экстремальная версия из 240 вопросов может занять около 30 минут.'
    },
    {
      question: 'Можно пройти тест ещё раз?',
      answer:
        'Да. Проходите политический тест сколько угодно раз — в том числе выбирая другую глубину, чтобы сравнить, меняется ли результат.'
    },
    {
      question: 'Есть ли правильный ответ?',
      answer:
        'Правильного ответа нет. Тест на идеологию измеряет ваши предпочтения в вопросах демократии, монархии, федерализма, иммиграции, роли религии в политике, экономической политики, международной торговли, либерализма, консерватизма, прогрессизма и других тем.'
    },
    {
      question: 'Как алгоритм считает результат?',
      answer:
        'Каждый ответ добавляет баллы определённому полюсу. Алгоритм рассчитывает проценты по каждой оси, сравнивает ваш идеологический вектор с профилями политических течений, стран и личностей и выдаёт наибольшие совпадения.'
    },
    {
      question: 'Может ли результат измениться?',
      answer:
        'Может — если изменятся ваши взгляды, если вы ответите с большим количеством нюансов или пройдёте более длинную версию. Экстремальная версия за счёт большего числа вопросов обычно даёт меньше колебаний.'
    },
    {
      question: 'Это научный тест?',
      answer:
        '12 Axes — не клинически валидированный научный инструмент. Это образовательный политический тест, вдохновлённый моделями политического спектра и тестами на идеологию; он полезен для размышлений и сравнения.'
    },
    {
      question: 'Можно поделиться результатом?',
      answer:
        'Да. В конце вы можете поделиться результатом, чтобы обсудить с другими политическую идеологию, политический спектр, левых, правых, центр и 12 осей.'
    },
    {
      question: 'Тест собирает данные?',
      answer:
        'Тест анонимный и не требует регистрации. Ответы используются только для расчёта результата во время прохождения — без имени, электронной почты или других личных данных.'
    },
    {
      question: 'Можно пройти тест с телефона?',
      answer:
        'Да. Интерфейс рассчитан и на мобильные устройства, и на компьютеры, так что тест можно пройти в браузере смартфона.'
    }
  ],
  howEyebrow: 'Как это работает',
  howTitle: 'Как устроен политический тест 12 Axes',
  howLead:
    'Простой и наглядный тест на политическую идеологию: вы отвечаете на утверждения, 12 Axes рассчитывает проценты и показывает, где вы находитесь на политическом спектре по каждому измерению.',
  steps: [
    {
      title: 'Ответьте на вопросы',
      text: 'Соглашайтесь или не соглашайтесь с утверждениями об экономике, государстве, гражданских свободах, ценностях, религии, внешней политике и технологиях.'
    },
    {
      title: 'Анализ по 12 осям',
      text: 'Каждый ответ определяет ваше положение на 12 независимых идеологических осях — от свободного рынка до планирования, от национализма до глобализма.'
    },
    {
      title: 'Узнайте свой профиль',
      text: 'Получите свой идеологический профиль, самые совместимые идеологии, ближайшую страну, близкую вам личность и результаты по каждой оси.'
    }
  ],
  axesGuideEyebrow: '12 осей',
  axesGuideTitle: 'Что означает каждая ось?',
  axesGuideLead:
    'Тест на идеологию 12 Axes по отдельности анализирует федерализм, политическое представительство, демократию, выборы, иммиграцию, международную торговлю, роль религии в политике, экономическую политику, мораль и технологии.',
  discoveryEyebrow: 'Что вы узнаете',
  discoveryTitle: 'Полный портрет ваших политических убеждений',
  discoveryLead:
    'Больше, чем «левый или правый»: результат показывает, с кем, где и насколько сильно на самом деле совпадают ваши взгляды.',
  discoveryItems: [
    { icon: 'ideology', title: 'Ваша идеология', text: 'Какое политическое течение вам подходит' },
    { icon: 'country', title: 'Ваша страна', text: 'Какая страна думает так же, как вы' },
    { icon: 'personality', title: 'Ваш политический лидер', text: 'Какая историческая фигура ближе всего к вам идеологически' },
    { icon: 'spectrum', title: 'Ваш спектр', text: 'Где вы находитесь между левыми и правыми' },
    { icon: 'profile', title: 'Ваш профиль', text: 'Полный портрет ваших убеждений' },
    { icon: 'compatibility', title: 'Совместимость', text: 'Насколько вы на самом деле согласны со своей идеологией' }
  ],
  exampleEyebrow: 'Реальный пример',
  exampleTitle: 'Так выглядит ваш результат',
  exampleCaption: 'Иллюстративный пример на реальных данных из каталога 12 Axes.',
  exampleCta: 'Хочу увидеть свой результат',
  spectrumEyebrow: 'Политический спектр',
  spectrumTitle: 'Узнайте своё место на политическом спектре',
  spectrumLead:
    'Результат помогает увидеть вашу политическую позицию между левыми, правыми и центром, а также выявляет более радикальные, авторитарные или либертарианские формы, лежащие вне этой оси: ультраправых, радикальных левых, третий путь, либертарианство и анархизм.',
  faqTitle: 'Частые вопросы',
  faqLead: 'Всё, о чём обычно спрашивают перед прохождением теста.',
  navStart: 'Начать',
  menuAria: 'Открыть меню',
  roseAria: 'Роза 12 осей',
  spectrumBarAria: 'Шкала политического спектра с восемью категориями',
  footerTagline: 'Независимый политический тест · 12axes.vercel.app',
  versionsEyebrow: 'Версии',
  versionsTitle: 'Выберите глубину',
  versionsLead:
    'Начните с быстрого теста или погрузитесь глубже, чтобы получить более точный портрет своего идеологического профиля. Все версии используют те же 12 осей и сразу показывают результат.',
  variantEyebrow: 'Выберите формат',
  variantTitlePre: 'Вам важнее скорость или ',
  variantTitleEm: 'точность?',
  backToStart: 'Вернуться в начало',
  depthLabel: 'Глубина',
  depthAria: (level) => `Глубина ${level} из 3`,
  recommended: 'Рекомендуем',
  formatNotes: ['Все версии используют те же 12 осей', 'Анонимно, без регистрации', 'Мгновенный результат'],
  variantLead:
    'Короткая версия быстро покажет результат. Полная версия точнее и лучше сопоставляет ваш результат с идеологическими профилями.',
  quizNavAria: 'Навигация по тесту',
  autoAdvance: 'Переходить дальше после ответа',
  back: 'Назад',
  next: 'Далее',
  calculating: 'Считаем…',
  seeResult: 'Смотреть результат',
  archetypeSkip: 'Пропустить',
  errMissingAnswer: 'Чтобы увидеть результат, сначала ответьте на этот вопрос.',
  errLoadQuiz: 'Не удалось загрузить тест.',
  errCalc: 'Не удалось рассчитать результат.',
  errImage: 'Не удалось создать изображение результата.',
  errHttp: (status) => `Ошибка HTTP ${status}`,
  resultsEyebrow: 'Анализ завершён',
  resultsH1Pre: 'Ваш идеологический ',
  resultsH1Em: 'профиль',
  resultsLead: (count) =>
    `Анализ основан на ${count} ${count % 10 === 1 && count % 100 !== 11 ? 'ответе' : 'ответах'}, распределённых по 12 ключевым измерениям политической идеологии. Посмотрите свою позицию на каждой оси и идеологические совпадения.`,
  resultsLeadShared:
    'Результат, которым поделились: позиция на каждой из 12 политических осей и рассчитанные по ней идеологические совпадения. Пройдите тест, чтобы узнать свой.',
  resultsSummaryAria: 'Сводка анализа',
  metaAnswered: 'Отвечено вопросов',
  metaAxes: 'Проанализировано осей',
  metaTop: 'Лучшее совпадение',
  axesSectionEyebrow: 'Политические оси',
  axesSectionTitle: 'Результат по осям в процентах',
  proximityEyebrow: 'Идеологическая близость',
  otherMatches: 'Другие совпадения',
  navOnThisPage: 'На этой странице',
  resultsNavAxes: '12 осей',
  resultsNavSignature: 'Чем вы выделяетесь',
  resultsNavCountries: 'Страны',
  resultsNavPersonalities: 'Личности',
  resultsNavAreas: 'Сферы',
  resultsNavBooks: 'Что почитать',
  resultsNavIdeologies: 'Другие идеологии',
  countriesSectionTitle: 'Самые близкие вам страны',
  countryCurrentTab: 'Современные',
  countryHistoricalTab: 'Исторические',
  countriesDistantTitle: 'Самые далёкие от вас',
  personalitiesSectionTitle: 'Самые близкие вам личности',
  personalitiesByAreaTitle: 'Также близки вам — по сферам',
  dimensionsTitle: 'Также близки вам — по измерениям профиля',
  dimensionLabels: {
    political: 'Политически',
    social: 'Социально',
    economic: 'Экономически',
  },
  booksEyebrow: 'Идите дальше',
  booksTitle: 'Что почитать',
  booksTopLabel: 'Ближе всего к вам',
  booksAuthorLabel: 'Автор',
  booksLead: 'По одной книге от каждой из личностей, наиболее близких к вашим результатам.',
  booksWhy: (pct) => `Совместимость ${pct}%`,
  booksYearBc: (year) => `${year} г. до н. э.`,
  booksCta: 'Смотреть на Amazon',
  areasGeneralTitle: 'Самые близкие к вашим результатам личности',
  areasSectionTitle: 'Самые близкие личности по сферам',
  areasTabsAria: 'Как сгруппированы личности',
  areasGeneralTab: 'Общая совместимость',
  areasByAreaTab: 'Сфера',
  personalitiesDistantTitle: 'Самые далёкие от вас',
  ideologyDistantTitle: 'Самая далёкая от вас идеология',
  phraseTitle: 'Фраза, которая вас описывает',
  phraseNote: (ideology) => `Так сторонник идеологии «${ideology}» описал бы общество, к которому стремится.`,
  signatureTitle: 'Чем вы выделяетесь',
  signatureUnusualLabel: 'Ваша самая необычная позиция',
  signatureCommonLabel: 'Ваша самая типичная позиция',
  signatureUnusualLead: (pole, percent) => `Вы ближе к полюсу «${pole}», чем ${Math.round(percent)}% идеологий каталога.`,
  signatureUnusualLeadMax: (pole) => `Ни одна идеология каталога не склоняется к полюсу «${pole}» так сильно, как вы.`,
  signatureUnusualLeadBalanced: (axis, pole, percent) =>
    `По оси «${axis}» вы занимаете срединную позицию. Но даже так вы ближе к полюсу «${pole}», чем ${Math.round(percent)}% идеологий каталога.`,
  signatureUnusualNote: (axis) => `Из всех 12 осей именно по оси «${axis}» вы сильнее всего отличаетесь от остальных. Это ваша отличительная черта.`,
  signatureCommonLead: (axis) => `Ваша позиция по оси «${axis}» почти точно совпадает с медианой каталога.`,
  signatureCommonNote: (pole) => `Это общая территория: вы не склоняетесь ни к полюсу «${pole}», ни к противоположному.`,
  signatureCommonNoteBalanced: (axis) => `По оси «${axis}» вы в центре — как и каталог. Здесь ваш профиль выделяется меньше всего.`,
  tensionLabel: 'Ваше внутреннее противоречие',
  tensionCombo: (firstPole, secondPole) => `${firstPole} и ${secondPole} одновременно`,
  tensionRare: (count, total) => `Только ${count} из ${total} идеологий каталога сочетают обе эти позиции.`,
  tensionUnique: 'Ни одна идеология каталога не сочетает обе эти позиции.',
  tensionExamples: (names) => `Ближайшие совпадения: ${names}.`,
  tensionNote: (firstAxis, secondAxis) => `В каталоге оси «${firstAxis}» и «${secondAxis}» обычно меняются вместе. У вас эта закономерность обратная.`,
  signatureMedian: 'Медиана идеологий',
  signatureYou: 'Вы',
  personalityCategories: {
    politico: 'Политика',
    religioso: 'Религия',
    economista: 'Экономика',
    filosofo: 'Философия',
    teorico: 'Политическая теория',
    empresario: 'Бизнес',
    intelectual: 'Интеллектуальная жизнь',
    ativista: 'Активизм',
  },
  redoAnalysis: 'Пройти анализ заново',
  share: 'Поделиться',
  saveOrShare: 'Поделиться результатом',
  generatingPng: 'Создаём PNG...',
  shareFilePrefix: '12axes-profile',
  shareMessage: (ideology, ideologyPct, country, countryPct, personality, personalityPct) =>
    `Я узнал(а) свой идеологический профиль в политическом тесте 12 Axes!\n\n` +
    `💡 Самая совместимая идеология:\n` +
    `${ideology} — совместимость ${ideologyPct}%\n\n` +
    `🌎 Самая совместимая страна:\n` +
    `${country} — совместимость ${countryPct}%\n\n` +
    `👤 Самая совместимая личность:\n` +
    `${personality} — совместимость ${personalityPct}%\n\n` +
    `👉 Пройдите тест и поделитесь своим результатом:\nhttps://12axes.vercel.app/ru`,
  progress: (current, total) => `Вопрос ${current} из ${total}`,
  progressDone: (percent) => `Пройдено ${percent}%`,
  archetypeHeader: 'Определяем ваш архетип',
  archetypeStep: (current, total) => `${current} из ${total}`,
  progressAria: (percent) => `Прогресс теста: ${percent}%`,
  answersAria: 'Варианты ответа',
  countryKicker: 'Самая совместимая страна',
  flagLabel: 'Флаг',
  flagHistoricLabel: 'Флаг / исторический символ',
  flagAlt: (label, name) => `${label}: ${name}`,
  flagUnavailable: 'Флаг недоступен',
  flagUnavailableAria: (name) => `Флаг недоступен: ${name}`,
  personalityKicker: 'Самая совместимая личность',
  portraitAlt: (name) => `Портрет: ${name}`,
  portraitUnavailableAria: (name) => `Портрет недоступен: ${name}`,
  compatibilityAria: (pct) => `Совместимость: ${pct}%`,
  matchWord: 'совпадение',
  shareTitle: 'Мой идеологический профиль | 12axes.vercel.app',
  shareTopMatch: 'Лучшее совпадение',
  shareCountry: 'Самая совместимая страна',
  sharePersonality: 'Личность',
  shareResultLabel: 'МОЙ РЕЗУЛЬТАТ',
  shareMostCompatible: 'САМОЕ СОВМЕСТИМОЕ',
  shareYourAxes: 'ВАШИ 12 ОСЕЙ',
  shareOtherPersonalities: 'ДРУГИЕ ЛИЧНОСТИ',
  shareNearbyCountries: 'БЛИЗКИЕ СТРАНЫ',
  shareFooterCta: 'УЗНАЙТЕ СВОЙ ПРОФИЛЬ',
  shareFooterUrl: '12AXES.VERCEL.APP',
  supportEyebrow: 'Поддержите проект',
  supportTitle: '',
  ossEyebrow: 'Открытый код',
  ossTitle: 'Независимый и прозрачный проект',
  ossLead: 'Не нужно верить нам на слово. Код 12 Axes открыт: вы можете посмотреть, как оценивается каждый ответ, как рассчитывается совместимость и откуда берутся профили.',
  ossCards: [
    { title: 'Независимость', text: 'Никаких связей с партиями, правительствами или кампаниями. Никто не платит за место в вашем результате.' },
    { title: 'Проверяемость', text: 'Оценка ответов и расчёт совместимости находятся в коде — никакого «чёрного ящика».' },
    { title: 'Прозрачность', text: 'Вопросы, идеологии, страны и личности хранятся в версионируемых файлах с публичной историей.' },
    { title: 'Совместная работа', text: 'Нашли предвзятый вопрос или неточный профиль? Откройте issue или отправьте pull request.' }
  ],
  ossBarText: 'Читайте код, проверяйте данные и участвуйте в разработке на GitHub.',
  ossGithubCta: 'Открыть на GitHub',
  ossIssueCta: 'Предложить улучшение',
  supportTitleEm: 'Поддержать',
  supportLead:
    '12 Axes — независимый и бесплатный проект. Если тест помог вам лучше понять свою политическую идеологию, поддержите его работу пожертвованием через Pix или в криптовалюте.',
  supportPrivacyNote: 'Мы не собираем данные. Чтобы сделать пожертвование анонимно, используйте криптовалюту.',
  supportCopy: 'Копировать',
  supportCopied: 'Скопировано!',
  supportCopyAria: (label) => `Скопировать адрес ${label}`,
  supportCoins: [
    {
      id: 'pix',
      name: 'Pix',
      network: 'Случайный ключ',
      address: 'bf3e8e0b-27fe-4845-b5e2-358ca0281847'
    },
    {
      id: 'btc',
      name: 'Bitcoin',
      network: 'On-chain',
      address: 'bc1qsuy8r8gvl39apjykqzlgh7hku79ecarezhz2zj'
    },
    {
      id: 'lightning',
      name: 'Bitcoin',
      network: 'Lightning',
      address: 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhk2ctnw3jhymnsv96kcwfsa0gczg'
    },
    {
      id: 'eth',
      name: 'Ethereum',
      network: 'ERC-20',
      address: '0xDe821e55D6101AA42D05DBf2C07ad0BB866C23a5'
    },
    {
      id: 'xmr',
      name: 'Monero',
      network: 'XMR',
      address:
        '85Du1EuRPkybMVXTVptC6z31dsGPpTthsiMKM3yjY7YE24BUCkyNMd9Q82kwe5CvE7BegtDTNxaG8VwYdVvTgbjDU6DpuN1'
    }
  ]
};

export const t: Strings = { pt, en, ru }[LANG];
