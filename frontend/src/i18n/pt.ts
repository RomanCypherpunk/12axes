// Dicionário de UI em português: só é baixado por quem abre o site em português.
import type { PersonalityCategory, ProfileDimension } from '../types/quiz';
import type { Strings } from './index';

export const pt: Strings = {
  htmlLang: 'pt-BR',
  docTitle: '12 Axes — Teste Político Grátis e Quiz de Ideologia em 12 Eixos',
  loadingAnalysis: 'Carregando análise política...',
  loadingQuiz: 'Carregando quiz...',
  loadingResult: 'Carregando resultado...',
  tryAgain: 'Tentar novamente',
  crashTitle: 'Algo deu errado',
  crashBody: 'A página encontrou um erro inesperado. Recarregue para tentar de novo.',
  crashBodyWithProgress: 'A página encontrou um erro inesperado, mas suas respostas estão guardadas. Recarregue e escolha continuar de onde parou.',
  crashReload: 'Recarregar a página',
  resumeEyebrow: 'Quiz em andamento',
  resumeTitle: 'Continue de onde parou',
  resumeBody: (answered, total) => `Você já respondeu ${answered} de ${total} perguntas. Suas respostas estão guardadas neste navegador.`,
  resumeContinue: 'Continuar',
  resumeDiscard: 'Começar de novo',
  resumeUnavailable: 'Não foi possível retomar o quiz anterior. Comece um novo.',
  doneEyebrow: 'Teste concluído',
  doneTitle: 'Você já fez o teste',
  doneBody: (name) => `Seu resultado foi ${name}. Ele está guardado neste navegador, é só abrir de novo.`,
  doneView: 'Ver resultados',
  doneRetake: 'Refazer o teste',
  editAnswersButton: 'Editar respostas',
  editAnswersTitle: 'Editar respostas',
  editAnswersGroupsAria: 'Eixos',
  editAnswersArchetype: 'Arquétipo',
  editAnswersReligion: 'Sua religião',
  editAnswersChanged: (count) => (count === 0 ? 'Nenhuma alteração' : count === 1 ? '1 resposta alterada' : `${count} respostas alteradas`),
  editAnswersCancel: 'Cancelar',
  editAnswersSave: 'Gravar respostas',
  editAnswersSaving: 'Recalculando…',
  editAnswersDiscard: 'Descartar as alterações que você ainda não salvou?',
  editAnswersLoading: 'Carregando suas respostas…',
  editAnswersUnavailable: 'Não foi possível abrir suas respostas: as perguntas mudaram depois que você fez o teste.',
  skipToContent: 'Pular para o conteúdo',
  backToStartAria: 'Voltar para o início',
  mainNavAria: 'Navegação principal',
  navHow: 'Como funciona',
  navAxes: '12 Eixos',
  navSpectrum: 'Espectro',
  navFaq: 'FAQ',
  navBooks: 'Livros',
  navIdeologies: 'Ideologias',
  navPersonalities: 'Personalidades',
  navCountries: 'Países',
  navParties: 'Partidos',
  navCompare: 'Comparar',
  navSupport: 'Apoie',
  langToggleLabel: 'EN',
  langToggleAria: 'Switch to English',
  redoQuiz: 'Refazer quiz',
  religionLabel: 'Religião',
  religionQuestion: 'Você segue alguma religião? Usamos isso só para ajustar as recomendações.',
  religionNone: 'Sem religião, agnóstico ou ateu',
  religionNames: {
    christianity: 'Cristianismo',
    judaism: 'Judaísmo',
    islam: 'Islamismo',
    buddhism: 'Budismo',
    hinduism: 'Hinduísmo',
    other: 'Outra religião'
  },
  denominationLabel: 'Vertente cristã',
  denominationQuestion: 'Qual é a sua vertente cristã? Usamos isso só para ajustar as recomendações.',
  denominationNames: { catholic: 'Católica', protestant: 'Protestante', orthodox: 'Ortodoxa' },
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
  heroDeckDot: (position, total) => `Ver exemplo ${position} de ${total}`,
  heroDeckAlt: (ideology) => `Exemplo do cartão de resultado compartilhável: ${ideology}`,
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
  questionHelpAria: 'Entender esta pergunta',
  questionHelpLabel: 'Entenda',
  themeToDarkAria: 'Ativar modo escuro',
  themeToLightAria: 'Ativar modo claro',
  questionHelpTitle: 'Sobre esta pergunta',
  questionHelpAgree: 'Se você concorda',
  questionHelpDisagree: 'Se você discorda',
  questionHelpNote: 'Vale lembrar',
  questionHelpExample: 'Exemplo',
  closeLabel: 'Fechar',
  personalityInfoAria: (name) => `Ver detalhes de ${name}`,
  closenessTitle: 'O que te aproxima',
  closenessYou: 'Você',
  compareEyebrow: 'Análise comparativa',
  compareTitle: 'Análise comparativa',
  compareLead: 'Escolha uma personalidade, país ou ideologia e veja, eixo por eixo, onde você se aproxima ou se afasta.',
  compareSearchLabel: 'Buscar perfil para comparar',
  compareSearchPlaceholder: 'Busque uma personalidade, país ou ideologia',
  compareView: 'Visualizar',
  compareFieldCaption: 'Personalidade, país ou ideologia',
  compareFullView: 'Ver comparação completa',
  compareExamplePlaceholder: 'Ex.: Getúlio Vargas',
  compareAxesTitle: 'Seus 12 eixos',
  compareNoResults: 'Nenhum perfil encontrado.',
  compareLoading: 'Comparando…',
  compareLoadError: 'Não foi possível carregar a comparação. Tente de novo.',
  compareTypeLabels: { personality: 'Personalidade', country: 'País', ideology: 'Ideologia', party: 'Partido ou organização' },
  compareAxisAdverbs: {
    estrutura: 'estruturalmente',
    economia: 'economicamente',
    comercio: 'comercialmente',
    religiao: 'religiosamente',
    moral: 'moralmente',
    tecnologia: 'tecnologicamente',
    diplomacia: 'diplomaticamente'
  },
  compareClosestLine: (adverb, name) => `Você é ${adverb} compatível com ${name}.`,
  compareFarthestLine: (adverb, name) => `Você é ${adverb} distante de ${name}.`,
  compareClosestFallback: (axis, name) => `Em ${axis}, você é compatível com ${name}.`,
  compareFarthestFallback: (axis, name) => `Em ${axis}, você é distante de ${name}.`,
  compareIdentical: (name) => `Você e ${name} têm posições praticamente idênticas em todos os eixos.`,
  compareNearestLine: (axis, name) => `Seu eixo mais próximo de ${name} é ${axis}.`,
  compareNoFarLine: (name) => `Nenhum eixo está muito distante de ${name}.`,
  compareValues: (pole, you, them, name) => `${pole}: você ${you}% · ${name} ${them}%.`,
  compareOptionAria: (name, type) => `${name}, ${type}`,
  comparePageDocTitle: 'Comparar perfis — 12 Axes',
  comparePageEyebrow: 'Comparar perfis',
  comparePageTitle: 'Lado a lado, nos 12 eixos',
  comparePageProfilesTitle: 'Perfis',
  comparePageNeedMore: 'Escolha mais um perfil para comparar.',
  comparePageFull: 'Até 3 perfis. Remova um para escolher outro.',
  comparePageRemove: 'Remover',
  comparePageRemoveAria: (name) => `Remover ${name} da comparação`,
  comparePageUnknown: 'Perfil não encontrado',
  comparePageNotFound: 'Um dos perfis deste link não existe. Remova-o e escolha outro.',
  comparePageAxesTitle: 'Os 12 eixos',
  comparePageAxisAria: (axis, values) => `${axis}: ${values}`,
  comparePageCompassAria: (points) => `Bússola política: ${points}`,
  comparePagePointAria: (name, right, authoritarian, traditional) =>
    `${name}, ${right}% à direita, ${authoritarian}% autoritário, ${traditional}% tradicionalista`,
  comparePageLegendAria: 'Legenda da bússola',
  comparePagePairsTitle: 'Compatibilidade entre eles',
  comparePageSignatureTitle: 'O que os distingue',
  comparePageIdeologyTitle: 'Ideologia mais próxima',
  comparePageNavIdeologies: 'Ideologias',
  comparePageNavAxes: '12 Eixos',
  comparePageNavSignature: 'Distinção',
  comparePageNavCountries: 'Países',
  comparePageNavParties: 'Partidos',
  comparePageNavCompass: 'Bússola',
  comparePageNavCompatibility: 'Compatibilidade',
  comparePageCommonLabel: 'Em comum',
  comparePageNearestFor: (name) => `Mais perto de ${name}`,
  comparePageCountriesTitle: 'Países mais próximos',
  comparePagePartiesTitle: 'Partidos mais próximos',
  comparePageBalanced: 'Equilibrado',
  comparePageUnitPoints: 'pts',
  comparePageUnitPoint: 'pt',
  comparePageDivergeCap: (high, low, points) => `${high} e ${low} ficam a ${points} ${points === 1 ? 'ponto' : 'pontos'} um do outro nesse eixo.`,
  comparePageAgreeCap: (points) => `Aqui eles se encontram: só ${points} ${points === 1 ? 'ponto' : 'pontos'} de diferença.`,
  comparePageOpposite: 'Lados opostos',
  comparePageOppositeCount: (count, total) => `Em ${count} dos ${total} eixos eles ficam em lados opostos.`,
  comparePageNoOpposite: 'Nenhum eixo coloca os perfis em lados opostos.',
  comparePageDiverge: 'Onde mais divergem',
  comparePageAgree: 'Onde mais concordam',
  comparePagePairLabel: 'Compatibilidade',
  peopleTitle: 'Compare com outra pessoa',
  peopleLead: 'Cole o link do resultado de outra pessoa e veja, eixo por eixo, onde vocês se aproximam ou se afastam.',
  peopleNameLabel: 'Nome da outra pessoa',
  peopleNameCaption: 'Nome',
  peopleUrlCaption: 'Link do resultado',
  peopleNamePlaceholder: 'Ex.: João',
  peopleUrlLabel: 'Link do resultado da outra pessoa',
  peopleUrlPlaceholder: 'Cole o link aqui',
  peoplePaste: 'Colar',
  peoplePasteBlocked: 'O navegador não deixou ler a área de transferência. Cole o link no campo com Ctrl+V.',
  peoplePasteBlockedTouch: 'Não consegui ler a área de transferência. Toque e segure no campo do link e escolha Colar.',
  peoplePasteEmpty: 'Não há nada copiado. Copie o link do resultado e toque em Colar.',
  peopleCompare: 'Comparar',
  peopleNameRequired: 'Escreva o nome da outra pessoa.',
  peopleLinkMissing: (keys) => `Este link não tem todos os eixos (faltam: ${keys}). Cole o link completo do resultado.`,
  peopleLinkInvalid: (keys) => `Valor inválido no link (${keys}). Cada eixo vai de 0 a 100.`,
  peopleYou: 'Você',
  peopleOther: 'Outra pessoa',
  peopleBoth: 'Vocês',
  compareBoth: 'Os dois',
  peopleShare: 'Compartilhar comparação',
  shareCompareLabel: 'COMPARAÇÃO',
  shareCompareFilePrefix: '12axes-comparacao',
  shareCompareTitle: (percent) => `Nossa compatibilidade política: ${percent}% | 12axes.vercel.app`,
  shareCompareMessage: (other, percent, mine, theirs, url) =>
    `Comparei meu perfil político com o de ${other} no Quiz Político 12 Axes!\n\n` +
    `🤝 Compatibilidade entre nós: ${percent}%\n\n` +
    `💡 Minha ideologia:\n${mine}\n\n` +
    `💡 Ideologia de ${other}:\n${theirs}\n\n` +
    `👉 Veja a comparação e faça o teste:\n${url}`,
  peopleSignatureTitle: 'O que distingue vocês',
  peopleDiverge: 'Onde mais divergem',
  peopleAgree: 'Onde mais concordam',
  peopleAgreeCap: (points) => `Aqui vocês se encontram: só ${points} ${points === 1 ? 'ponto' : 'pontos'} de diferença.`,
  peopleOppositeCount: (count, total) => `Em ${count} dos ${total} eixos vocês ficam em lados opostos.`,
  peopleNoOpposite: 'Nenhum eixo coloca vocês em lados opostos.',
  peopleBlocked: 'O navegador bloqueou a nova aba.',
  peopleRename: (name) => `Editar o nome de ${name}`,
  peopleNameInputLabel: 'Nome',
  peopleOpenLink: 'Abrir a comparação',
  peoplePersonalitiesTitle: 'Personalidades mais próximas',
  peopleValuesTitle: 'Valores',
  peopleSharedValuesTitle: 'Valores em comum',
  peoplePairsTitle: 'Compatibilidade entre vocês',
  peopleNavPersonalities: 'Personalidades',
  peopleNavValues: 'Valores',
  peopleNavSharedValues: 'Em comum',
  peoplePageDocTitle: 'Comparar com outra pessoa — 12 Axes',
  peoplePageTitle: 'Vocês dois, nos 12 eixos',
  peoplePagePeopleTitle: 'Pessoas',
  peoplePageBadLink: 'Este link de comparação está incompleto. Abra o seu resultado e use "Compare com outra pessoa".',
  peoplePageLoadError: 'Não foi possível carregar a comparação. Tente de novo.',
  peoplePageLoading: 'Comparando…',
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
    },
    {
      question: 'O que é o 12 Axes?',
      answer: 'O 12 Axes é um teste político gratuito que mede sua posição em 12 eixos (estrutura do Estado, representação, liberdades, imigração, diplomacia, intervenção, economia, controle econômico, comércio, religião, moral e tecnologia) e mostra sua ideologia política, país e personalidade compatíveis.'
    },
    {
      question: 'O 12 Axes tem bússola política (political compass)?',
      answer: 'Sim. No fim do resultado há uma bússola política em dois eixos, esquerda × direita e autoritário × libertário, com uma barra progressista × tradicionalista. Ela resume seus 12 eixos de forma visual, mas não substitui a análise completa.'
    },
    {
      question: 'Como descobrir minha ideologia política compatível?',
      answer: 'Faça o quiz político, com 36, 60 ou 240 perguntas. O resultado mostra as ideologias mais compatíveis com as suas respostas, com a porcentagem de compatibilidade e a posição de cada uma nos 12 eixos.'
    },
    {
      question: 'Posso descobrir qual país ou personalidade combina comigo?',
      answer: 'Sim. Além da ideologia, o resultado compara seu perfil com países atuais, regimes históricos e personalidades políticas, mostrando os mais compatíveis e os mais distantes de você.'
    },
    {
      question: 'Quantas perguntas tem o quiz de política?',
      answer: 'Há três versões: a rápida, com 36 perguntas, a completa, com 60, e a extrema, com 240. Todas cobrem os mesmos 12 eixos; quanto mais perguntas, mais preciso tende a ser o resultado.'
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
    { icon: 'books', title: 'Livros recomendados', text: 'Uma obra de cada personalidade compatível com você' },
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
  navTakeTest: 'Fazer o teste',
  menuAria: 'Abrir menu',
  roseAria: 'Rosa dos 12 eixos',
  spectrumBarAria: 'Barra do espectro político com as oito categorias',
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
  swapQuestion: 'Trocar',
  swapQuestionAria: 'Trocar esta pergunta por outra do mesmo tema',
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
  metaTop: 'Top match',
  axesSectionEyebrow: 'Eixos políticos',
  axesSectionTitle: 'Seus 12 eixos',
  proximityEyebrow: 'Proximidade ideológica',
  otherMatches: 'Outras ideologias',
  navOnThisPage: 'Nesta página',
  resultsNavReport: 'Análise completa',
  resultsNavAxes: '12 eixos',
  resultsNavSignature: 'Distinção',
  resultsNavCountries: 'Países',
  resultsNavPersonalities: 'Personalidades',
  resultsNavAreas: 'Áreas',
  resultsNavBooks: 'Livros',
  resultsNavParties: 'Partidos',
  resultsNavIdeologies: 'Ideologias',
  resultsNavCompass: 'Bússola',
  resultsNavValues: 'Valores',
  valuesSectionTitle: 'Seus valores',
  valuesNeutralTag: 'Posição equilibrada',
  valueInfoAria: (name) => `Ver detalhes de ${name}`,
  compassTitle: 'Bússola política',
  compassAuthoritarian: 'Autoritarismo',
  compassLibertarian: 'Anarquismo',
  compassLeft: 'Esquerda',
  compassRight: 'Direita',
  compassProgressive: 'Progressista',
  compassTraditionalist: 'Tradicionalista',
  compassInfo: {
    aria: 'Como a bússola política é feita',
    title: 'Como a bússola é feita',
    authLead: 'O eixo autoritário × libertário',
    authText: 'mede o grau de concentração do poder político e de intervenção do Estado sobre a vida dos indivíduos. Considera três dimensões principais: liberdades individuais, representação política e estrutura do Estado.',
    econLead: 'O eixo esquerda × direita',
    econText: 'mede o quanto sua posição é de esquerda ou de direita pela organização da economia: de propriedade coletiva e planejamento estatal, de um lado, a propriedade privada e livre mercado, do outro. Considera as dimensões fundamentais de economia (propriedade dos meios de produção) e controle (mercado contra regulação e planejamento).',
    socialLead: 'O eixo social',
    socialText: 'mede a orientação dos seus valores entre progressismo e tradicionalismo, refletindo sua posição em questões de costumes, cultura e valores sociais.'
  },
  compassWith: 'com valores sociais',
  compassSocialValues: '',
  compassCenterLeft: 'Centro-esquerda',
  compassCenterRight: 'Centro-direita',
  compassSpectrumLabels: {
    'esq-radical': 'Esquerda radical',
    esquerda: 'Esquerda',
    centro: 'Centrista',
    direita: 'Direita',
    'ext-direita': 'Extrema direita',
    terceira: 'Terceira posição',
    libertario: 'Libertário',
    anarquismo: 'Anarquista'
  },
  compassSocialLabels: {
    veryProgressive: 'Fortemente progressistas',
    progressive: 'Progressistas',
    moderate: 'Moderados',
    traditional: 'Tradicionalistas',
    veryTraditional: 'Fortemente tradicionalistas'
  },
  compassNote: {
    label: 'Na bússola:',
    hints: {
      terceira: 'A Terceira posição une Estado forte a nação e tradição. A bússola mede economia e poder; nação, moral e religião ficam de fora.',
      'ext-direita': 'A Extrema direita se define por hierarquia e identidade. A bússola mede economia e poder; moral, religião e nação ficam de fora.',
      'esq-radical': 'A Esquerda radical se define por revolução e coletivização. A bússola mede economia e poder; o projeto revolucionário fica de fora.',
      libertarian: 'Sua ideologia fica na divisa entre duas regiões. A bússola mede economia e poder, e uma diferença pequena em um deles decide o lado.',
      generic: 'A bússola mede 5 dos 12 eixos; os outros 7 ficam de fora.'
    }
  },
  compassAria: (right, authoritarian, traditional) =>
    `Sua posição: ${right}% rumo à direita, ${authoritarian}% rumo ao autoritarismo e ${traditional}% rumo ao tradicionalismo.`,
  countriesSectionTitle: 'Países mais próximos de você',
  countryCurrentTab: 'País atual',
  countryHistoricalTab: 'Experiência histórica',
  countriesDistantTitle: 'Os mais distantes de você',
  partiesSectionTitle: 'Partidos mais próximos de você',
  partyCurrentTab: 'Partido atual',
  partyHistoricalTab: 'Partido histórico',
  partiesDistantTitle: 'Os mais distantes de você',
  partyLogoAlt: (name) => `Símbolo de ${name}`,
  partyLogoUnavailable: 'Símbolo indisponível',
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
  exportCsv: 'Exportar planilha',
  paywallTitle: 'Relatório completo',
  paywallLead: 'Obtenha o relatório completo para descobrir seu perfil político com profundidade.',
  paywallUnlockTitle: 'Desbloquear agora',
  paywallPreviewTitles: [
    'Análise completa, eixo a eixo',
    'Onde você mais discorda',
    'Seu governo ideal',
    'Sua linha do tempo ideológica',
    '10 países ou regiões para viver'
  ],
  paywallModalTag: 'Seu relatório completo',
  paywallModalTitle: 'Entenda o seu perfil político com profundidade',
  paywallModalLead: 'Vá além do resultado: veja o que está por trás de cada eixo, onde você mais discorda e quem governaria ao seu lado.',
  paywallIncludesTitle: 'O que você vai receber:',
  paywallIncludes: [
    { lead: 'Análise dos 12 eixos, um por um:', text: 'o que a sua posição em cada eixo significa e o que mais pesou nas suas respostas.' },
    { lead: 'Onde você mais discorda:', text: 'da sua ideologia, personalidade e país mais próximos, eixo a eixo.' },
    { lead: 'Seu governo ideal:', text: 'nove cargos preenchidos pelas personalidades mais compatíveis com você.' },
    { lead: 'Sua linha do tempo ideológica:', text: 'os perfis mais próximos de cada era, da Antiguidade ao século XXI.' },
    { lead: 'Para qual país se mudar:', text: 'os 10 países atuais mais próximos dos seus ideais políticos, para saber onde você se sentiria em casa.' },
    { lead: 'Personalidades por área de atuação:', text: 'a mais compatível com você em política, filosofia, economia e nas demais áreas.' },
    { lead: 'Ranking completo e planilha:', text: 'a sua compatibilidade com todo o catálogo, para exportar em Excel.' }
  ],
  paywallGuarantee: 'Garantia de reembolso de 7 dias',
  paywallPayWith: 'Formas de pagamento: Pix e cartão',
  paywallPrice: 'R$ 14,99',
  paywallCta: 'Desbloquear o relatório completo',
  paywallChecking: 'Confirmando o seu pagamento...',
  paywallProblems: {
    denied: 'Este pagamento não vale para este resultado, ou foi reembolsado.',
    unavailable: 'Serviço indisponível no momento, tente novamente em alguns instantes.',
    timeout: 'O pagamento ainda não foi confirmado. Se você pagou com Pix, pode levar alguns minutos.'
  },
  paywallRetry: 'Conferir de novo',
  paywallOpening: 'Abrindo o pagamento...',
  areasLockedTitle: 'Desbloquear agora',
  areasLockedText: 'Obtenha o relatório completo para ver a personalidade mais próxima de você em cada área de atuação.',
  areasLockedCta: 'Desbloquear o relatório completo',
  personalitiesDistantTitle: 'As mais distantes de você',
  ideologyDistantTitle: 'A ideologia mais distante de você',
  phraseTitle: 'Uma frase que te descreve',
  aboutIdeology: (ideology) => `Sobre o ${ideology}`,
  knowMoreAbout: (name) => `Saber mais sobre ${name}`,
  showLess: 'Mostrar menos',
  matchTopKicker: 'Mais compatível',
  dimensionsTitleShort: 'Também próximos, por dimensão',
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
  signatureBigCap: (pole) => `das ideologias puxam menos que você para ${pole.toLowerCase()}.`,
  signatureAtMedian: 'Na mediana',
  signatureAtCentre: 'No centro',
  tensionRareShort: (count, total) => `Só ${count} de ${total} ideologias juntam essas duas posições.`,
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
  sharePreviewTitle: 'Seu cartão de resultado',
  sharePreviewCompareTitle: 'Cartão da comparação',
  sharePreviewAlt: 'Prévia do seu cartão de resultado para compartilhar',
  sharePreviewLoading: 'Gerando a prévia do seu cartão',
  generatingPdf: 'Gerando PDF...',
  downloadPdf: 'Download PDF',
  report: {
    fileName: '12axes-relatorio',
    docLabel: 'Relatório completo',
    profileEyebrow: 'Seu perfil ideológico',
    headerLabel: (ideology) => `Relatório do perfil político · ${ideology}`,
    kpiCountry: 'País mais próximo',
    kpiPersonality: 'Personalidade',
    kpiAxes: 'Eixos analisados',
    kpiAnswered: (count) => `${count} perguntas respondidas`,
    tocTitle: 'Neste relatório',
    generatedOn: (date) => `Gerado em ${date}`,
    axesIntro: 'Sua posição em cada um dos 12 eixos. A barra parte do centro (50%) em direção ao polo para onde você pende; o selo indica a intensidade.',
    intensityLegend: 'Intensidade',
    intensityLevels: ['Equilibrado · até 57%', 'Inclinado · 58 a 72%', 'Forte · 73 a 87%', 'Muito forte · 88% ou mais'],
    alsoClose: 'Também próximos, por dimensão do seu perfil',
    continued: 'continuação',
    areasIntro: 'As personalidades do catálogo cujo perfil nos 12 eixos mais se parece com o seu.',
    booksIntro: 'Uma obra de cada uma das personalidades mais próximas dos seus resultados.',
    aboutTitle: 'Sobre este relatório',
    aboutText: 'O 12 Axes compara suas respostas com perfis de ideologias, países e personalidades nos mesmos 12 eixos. A compatibilidade mede proximidade entre perfis; não é diagnóstico científico nem rótulo definitivo. Suas respostas não são armazenadas.',
    ctaTitle: 'Refaça o teste ou compartilhe'
  },
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
  compatibilityLevels: {
    veryHigh: 'Compatibilidade muito alta',
    high: 'Compatibilidade alta',
    medium: 'Compatibilidade média',
    low: 'Compatibilidade baixa',
    veryLow: 'Compatibilidade muito baixa'
  },
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
  footerRights: '© 2026. Todos os direitos reservados',
  footerProject: 'Projeto',
  footerExplore: 'Explorar',
  footerAbout: 'Sobre',
  footerContribute: 'Contribuições',
  footerLicense: 'Licença',
  footerFullReport: 'Relatório Completo',
  footerTerms: 'Termos de uso',
  footerPrivacy: 'Privacidade',
  footerRefund: 'Reembolso',
  footerReport: 'Reportar',
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
      id: 'usdt',
      name: 'Dólar Tether (USDT)',
      network: 'Ethereum',
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
