// Dicionário de UI PT/EN. O idioma é resolvido uma vez por carga de página
// (?lang → localStorage → navigator) e trocar de idioma recarrega a página,
// para que quiz e resultados sejam rebuscados já no idioma novo.
export type Lang = 'pt' | 'en';

const STORAGE_KEY = '12axes-lang';

// Idioma forçado pelo caminho: /en sempre inglês, /br sempre português,
// independente do aparelho ou da preferência salva.
function langForcedByPath(pathname: string): Lang | null {
  const path = (pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/');
  if (path === '/en') return 'en';
  if (path === '/br') return 'pt';
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
  if (fromUrl === 'pt' || fromUrl === 'en') {
    window.localStorage.setItem(STORAGE_KEY, fromUrl);
    return fromUrl;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'pt' || stored === 'en') {
    return stored;
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export const LANG: Lang = resolveLang();

export function setLang(lang: Lang) {
  window.localStorage.setItem(STORAGE_KEY, lang);
  const url = new URL(window.location.href);
  url.searchParams.delete('lang');
  // Em /en ou /br a URL é o que define o idioma, então o toggle troca de rota.
  if (langForcedByPath(url.pathname)) {
    url.pathname = lang === 'en' ? '/en' : '/br';
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
  versionsEyebrow: string;
  versionsTitle: string;
  versionsLead: string;
  variantEyebrow: string;
  variantTitle: string;
  variantLead: string;
  quizNavAria: string;
  back: string;
  next: string;
  calculating: string;
  seeResult: string;
  extendTitle: string;
  extendAria: string;
  extendYes: string;
  extendNo: string;
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
  redoAnalysis: string;
  share: string;
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
  supportEyebrow: string;
  supportTitle: string;
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
      duration: 'Aprox. 5min',
      action: 'Começar versão curta'
    },
    extended: {
      label: 'Completa',
      questionCount: '60 perguntas',
      description: 'Mais precisão para aproximar seu resultado dos perfis ideológicos.',
      duration: 'Aprox. 9min',
      action: 'Começar versão completa'
    },
    extreme: {
      label: 'Extrema',
      questionCount: '240 perguntas',
      description: 'Saiba exatamente a síntese do seu pensamento com 100% de precisão.',
      duration: 'Aprox. 30min',
      action: 'Começar versão extrema'
    }
  },
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
  faqTitle: 'FAQ - Perguntas frequentes',
  versionsEyebrow: 'Versões',
  versionsTitle: 'Escolha a profundidade',
  versionsLead:
    'Comece pelo quiz rápido ou aprofunde sua análise para um retrato mais preciso do seu perfil ideológico. Todas as versões usam os mesmos 12 eixos e retornam o resultado imediatamente.',
  variantEyebrow: 'Escolha o formato',
  variantTitle: 'Você quer velocidade ou precisão?',
  variantLead:
    'A versão curta revela o resultado de forma rápida. A completa aumenta a precisão para aproximar melhor seu resultado dos perfis ideológicos.',
  quizNavAria: 'Navegação do quiz',
  back: 'Voltar',
  next: 'Avançar',
  calculating: 'Calculando…',
  seeResult: 'Ver resultado',
  extendTitle: 'Deseja responder mais 24 questões para aumentar a precisão do seu resultado?',
  extendAria: 'Opções para estender o quiz',
  extendYes: 'Sim, quero aumentar a precisão',
  extendNo: 'Não, quero apenas ver meus resultados',
  errMissingAnswer: 'Ainda falta responder esta pergunta antes de ver o resultado.',
  errLoadQuiz: 'Não foi possível carregar o quiz.',
  errCalc: 'Não foi possível calcular o resultado.',
  errImage: 'Não foi possível gerar a imagem do resultado.',
  errHttp: (status) => `Erro HTTP ${status}`,
  resultsEyebrow: 'Análise concluída',
  resultsH1Pre: 'Seu ',
  resultsH1Em: 'perfil ideológico',
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
  redoAnalysis: 'Refazer análise',
  share: 'Compartilhar',
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
  supportEyebrow: 'Apoie o projeto',
  supportTitle: 'Apoie ',
  supportTitleEm: 'anonimamente',
  supportLead:
    'O 12 Axes é independente e gratuito. Se o teste te ajudou a entender melhor sua ideologia política, considere fazer uma doação 100% anônima em criptomoedas para manter o projeto no ar.',
  supportPrivacyNote: 'Não coletamos dados. Sua doação não é rastreada nem associada a você.',
  supportCopy: 'Copiar endereço',
  supportCopied: 'Copiado!',
  supportCopyAria: (label) => `Copiar endereço de ${label}`,
  supportCoins: [
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
      address: 'easternpaul90@walletofsatoshi.com'
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
  navSupport: 'Support',
  langToggleLabel: 'PT',
  langToggleAria: 'Mudar para português',
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
  faqTitle: 'FAQ - Frequently asked questions',
  versionsEyebrow: 'Versions',
  versionsTitle: 'Choose the depth',
  versionsLead:
    'Start with the quick quiz or go deeper for a more precise portrait of your ideological profile. All versions use the same 12 axes and return the result immediately.',
  variantEyebrow: 'Choose the format',
  variantTitle: 'Do you want speed or precision?',
  variantLead:
    'The short version reveals the result quickly. The full version increases precision to bring your result closer to the ideological profiles.',
  quizNavAria: 'Quiz navigation',
  back: 'Back',
  next: 'Next',
  calculating: 'Calculating…',
  seeResult: 'See results',
  extendTitle: 'Would you like to answer 24 more questions to improve the accuracy of your result?',
  extendAria: 'Options to extend the quiz',
  extendYes: 'Yes, improve my accuracy',
  extendNo: 'No, just show my results',
  errMissingAnswer: 'You still need to answer this question before seeing the result.',
  errLoadQuiz: 'Could not load the quiz.',
  errCalc: 'Could not calculate the result.',
  errImage: 'Could not generate the result image.',
  errHttp: (status) => `HTTP error ${status}`,
  resultsEyebrow: 'Analysis complete',
  resultsH1Pre: 'Your ',
  resultsH1Em: 'ideological profile',
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
  redoAnalysis: 'Retake analysis',
  share: 'Share',
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
  supportEyebrow: 'Support the project',
  supportTitle: 'Support ',
  supportTitleEm: 'anonymously',
  supportLead:
    '12 Axes is independent and free. If the quiz helped you better understand your political ideology, consider making a 100% anonymous crypto donation to help keep the project running.',
  supportPrivacyNote: "We don't collect data. Your donation isn't tracked or linked to you.",
  supportCopy: 'Copy address',
  supportCopied: 'Copied!',
  supportCopyAria: (label) => `Copy ${label} address`,
  supportCoins: [
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
      address: 'easternpaul90@walletofsatoshi.com'
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

export const t: Strings = LANG === 'en' ? en : pt;
