import { LANG } from '../i18n';
import type { AxisResult, CountryMatch, IdeologyMatch, PersonalityMatch } from '../types/quiz';

export interface ExampleResult {
  ideology: IdeologyMatch;
  country: CountryMatch;
  personality: PersonalityMatch;
  axes: AxisResult[];
}

const pt: ExampleResult[] = [
  {
    ideology: {
      ideologyId: 'marxismo-leninismo',
      name: 'Marxismo-Leninismo',
      category: 'Esquerda Radical',
      description:
        'Vertente revolucionária do marxismo que defende a tomada do poder por um partido de vanguarda e a ditadura do proletariado, com economia planificada e coletivização, servindo de base aos regimes comunistas do século XX.',
      longDescription:
        'Vertente revolucionária do marxismo que defende a tomada do poder por um partido de vanguarda e a ditadura do proletariado, com economia planificada e coletivização, servindo de base aos regimes comunistas do século XX. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero uma sociedade dirigida por um partido de vanguarda, com ditadura do proletariado e economia planificada e coletivizada.',
      compatibility: 99
    },
    country: {
      countryId: 'cuba',
      name: 'Cuba',
      category: 'Socialismo unipartidário-igualitário',
      description:
        'Estado socialista de partido único no Caribe, Cuba mantém economia planificada, forte controle estatal e serviços públicos universais, com poder centralizado desde a revolução liderada por Fidel Castro em 1959.',
      flagPath: '/countries/flags/cuba.gif',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'lenin',
      name: 'Vladimir Lênin',
      role: 'Revolucionário',
      category: 'politico',
      lifespan: '1870–1924',
      description:
        'Líder da Revolução Russa de 1917 e fundador da União Soviética, Lênin teorizou o partido de vanguarda, a ditadura do proletariado e o imperialismo como fase final do capitalismo, moldando o comunismo do século XX.',
      imagePath: '/personalities/portraits/lenin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Autocracia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 89,
        rightPercent: 11,
        dominantPole: 'Público',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 54,
        rightPercent: 46,
        dominantPole: 'Progressista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-social',
      name: 'Liberalismo Social',
      category: 'Esquerda',
      description:
        'Vertente que combina liberdades individuais com forte ação do Estado para garantir bem-estar, educação e saúde, defendendo igualdade de oportunidades e seguridade social dentro da economia de mercado.',
      longDescription:
        'Vertente que combina liberdades individuais com forte ação do Estado para garantir bem-estar, educação e saúde, defendendo igualdade de oportunidades e seguridade social dentro da economia de mercado. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero uma sociedade de liberdades individuais sustentada por seguridade social forte, com Estado garantindo saúde e educação a todos.',
      compatibility: 98
    },
    country: {
      countryId: 'eua-nova-york',
      name: 'Nova York (Estados Unidos)',
      category: 'Região financeira-cosmopolita',
      description:
        'Centro financeiro e cultural dos Estados Unidos, Nova York combina política liberal e progressista, enorme diversidade de imigrantes, economia globalizada baseada em serviços e forte peso simbólico no mundo.',
      flagPath: '/countries/flags/eua-nova-york.png',
      historical: false,
      period: '',
      compatibility: 98
    },
    personality: {
      personalityId: 'justin-trudeau',
      name: 'Justin Trudeau',
      role: 'Estadista',
      category: 'politico',
      lifespan: '1971–',
      description:
        'Primeiro-ministro do Canadá (2015–2025) pelo Partido Liberal, Trudeau promoveu multiculturalismo, acolhimento a imigrantes e refugiados, pautas progressistas de gênero e ambientais, e um estilo de governo centrista apoiado em forte intervenção social do Estado.',
      imagePath: '/personalities/portraits/justin-trudeau.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Democracia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 64,
        rightPercent: 36,
        dominantPole: 'Público',
        intensity: 'Inclinado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 79,
        rightPercent: 21,
        dominantPole: 'Progressista',
        intensity: 'Forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'terceira-via',
      name: 'Terceira Via',
      category: 'Centro',
      description:
        'Renovação da centro-esquerda nos anos 1990, com Blair, Clinton e Giddens, que aceita o mercado globalizado e a disciplina fiscal, troca assistência por ativação para o trabalho, é dura com o crime e apoia intervenções liberais.',
      longDescription:
        'Renovação da centro-esquerda nos anos 1990, com Blair, Clinton e Giddens, que aceita o mercado globalizado e a disciplina fiscal, troca assistência por ativação para o trabalho, é dura com o crime e apoia intervenções liberais. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero um mercado globalizado com um Estado que invista em educação, troque assistência por trabalho e seja duro com o crime e suas causas.',
      compatibility: 94
    },
    country: {
      countryId: 'inglaterra',
      name: 'Inglaterra (Reino Unido)',
      category: 'Nação constituinte liberal-conservadora',
      description:
        'Maior país constituinte do Reino Unido, a Inglaterra é governada diretamente por Westminster, sem parlamento próprio, com Igreja Anglicana oficial, serviço de saúde público (NHS), centro financeiro em Londres e maioria pelo Brexit e crescente voto populista.',
      flagPath: '/countries/flags/inglaterra.png',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'macron',
      name: 'Emmanuel Macron',
      role: 'Estadista',
      category: 'politico',
      lifespan: '1977–',
      description:
        'Estadista francês, Macron chegou à presidência da França como reformador centrista e liberal, defendendo o mercado, a integração europeia e reformas econômicas, buscando superar a divisão tradicional entre esquerda e direita.',
      imagePath: '/personalities/portraits/macron.jpg',
      compatibility: 98
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democracia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 44,
        rightPercent: 56,
        dominantPole: 'Privado',
        intensity: 'Equilibrado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 68,
        rightPercent: 32,
        dominantPole: 'Progressista',
        intensity: 'Inclinado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'alt-lite',
      name: 'Direita alternativa',
      category: 'Direita',
      description:
        'Vertente da direita radical, nacionalista e antiglobalista, que enfatiza a identidade cultural, a crítica à imigração e o combate ao politicamente correto, sem adotar posições de base racial.',
      longDescription:
        'Vertente da direita radical, nacionalista e antiglobalista, que enfatiza a identidade cultural, a crítica à imigração e o combate ao politicamente correto, sem adotar posições de base racial. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero preservar a identidade cultural do meu povo, com controle da imigração e liberdade de expressão contra o politicamente correto.',
      compatibility: 97
    },
    country: {
      countryId: 'hungria',
      name: 'Hungria',
      category: 'República nacional-iliberal',
      description:
        'República parlamentarista do Leste Europeu, a Hungria é governada sob a chamada democracia iliberal, unindo nacionalismo, conservadorismo cristão, soberania diante da União Europeia e forte controle de mídia e instituições.',
      flagPath: '/countries/flags/hungria.gif',
      historical: false,
      period: '',
      compatibility: 89
    },
    personality: {
      personalityId: 'donald-trump',
      name: 'Donald Trump',
      role: 'Político',
      category: 'politico',
      lifespan: '1946–',
      description:
        'Empresário e presidente dos Estados Unidos, Trump lidera o populismo nacionalista do movimento MAGA, com protecionismo tarifário, política migratória restritiva e retórica anti-establishment que redefiniu a direita.',
      imagePath: '/personalities/portraits/donald-trump.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 39,
        rightPercent: 61,
        dominantPole: 'Autocracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Privado',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 21,
        rightPercent: 79,
        dominantPole: 'Tradicionalista',
        intensity: 'Forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neoliberalismo-autoritario',
      name: 'Neoliberalismo Autoritário',
      category: 'Direita',
      description:
        'Regime que implanta o livre mercado radical sob uma ditadura militar, com privatizações, abertura comercial e economistas da Escola de Chicago, restringindo sindicatos, partidos e opositores em nome da ordem e do anticomunismo.',
      longDescription:
        'Regime que implanta o livre mercado radical sob uma ditadura militar, com privatizações, abertura comercial e economistas da Escola de Chicago, restringindo sindicatos, partidos e opositores em nome da ordem e do anticomunismo. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero implantar mercados abertos, privatizações e disciplina fiscal sob um governo forte, com ordem política e restrições à oposição.',
      compatibility: 98
    },
    country: {
      countryId: 'el-salvador',
      name: 'El Salvador',
      category: 'República securitário-digital',
      description:
        'República presidencialista da América Central, El Salvador ganhou destaque pela dura política de segurança contra as gangues e pela adoção do bitcoin, unindo forte apoio popular e concentração de poder no Executivo.',
      flagPath: '/countries/flags/el-salvador.png',
      historical: false,
      period: '',
      compatibility: 90
    },
    personality: {
      personalityId: 'augusto-pinochet',
      name: 'Augusto Pinochet',
      role: 'Ditador',
      category: 'politico',
      lifespan: '1915–2006',
      description:
        'General e ditador chileno, Pinochet derrubou Allende e instaurou um regime militar anticomunista, combinando repressão política, conservadorismo autoritário e reformas neoliberais.',
      imagePath: '/personalities/portraits/augusto-pinochet.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 14,
        rightPercent: 86,
        dominantPole: 'Autocracia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 12,
        rightPercent: 88,
        dominantPole: 'Privado',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 11,
        rightPercent: 89,
        dominantPole: 'Tradicionalista',
        intensity: 'Muito forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'corporativismo',
      name: 'Corporativismo',
      category: 'Terceira Posição',
      description:
        'Modelo que organiza a sociedade em corporações de trabalhadores e empregadores integradas ao Estado, buscando harmonia entre classes e cooperação econômica dirigida em vez de conflito ou livre concorrência.',
      longDescription:
        'Modelo que organiza a sociedade em corporações de trabalhadores e empregadores integradas ao Estado, buscando harmonia entre classes e cooperação econômica dirigida em vez de conflito ou livre concorrência. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero uma sociedade organizada em corporações de patrões e trabalhadores integradas ao Estado, em harmonia dirigida entre as classes.',
      compatibility: 97
    },
    country: {
      countryId: 'burkina-faso',
      name: 'Burkina Faso',
      category: 'República militar soberanista e pan-africanista',
      description:
        'País do Sahel da África Ocidental liderado por um governo militar de transição patriótico, que resgatou o legado anticolonial e autossuficiente de Thomas Sankara, promoveu a saída da CEDEAO, formou a Aliança dos Estados do Sahel (AES) e reorientou parcerias internacionais em defesa da soberania nacional.',
      flagPath: '/countries/flags/burkina-faso.png',
      historical: false,
      period: '',
      compatibility: 90
    },
    personality: {
      personalityId: 'plinio-salgado',
      name: 'Plínio Salgado',
      role: 'Político',
      category: 'politico',
      lifespan: '1895–1975',
      description:
        'Líder do integralismo brasileiro, Plínio Salgado criou um movimento nacionalista autoritário de inspiração cristã, com o lema Deus, Pátria e Família e estética de massas inspirada nos fascismos europeus dos anos 1930.',
      imagePath: '/personalities/portraits/plinio-salgado.jpg',
      compatibility: 96
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 28,
        rightPercent: 72,
        dominantPole: 'Autocracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 76,
        rightPercent: 24,
        dominantPole: 'Público',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 8,
        rightPercent: 92,
        dominantPole: 'Tradicionalista',
        intensity: 'Muito forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-classico',
      name: 'Liberalismo Clássico',
      category: 'Libertário',
      description:
        'Vertente original do liberalismo que defende direitos naturais, propriedade, livre mercado e Estado mínimo, vendo a liberdade individual e a limitação rígida do poder como fundamentos da sociedade justa.',
      longDescription:
        'Vertente original do liberalismo que defende direitos naturais, propriedade, livre mercado e Estado mínimo, vendo a liberdade individual e a limitação rígida do poder como fundamentos da sociedade justa. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero uma sociedade de direitos naturais e propriedade sagrada, com Estado mínimo e mercado livre como base da vida justa.',
      compatibility: 97
    },
    country: {
      countryId: 'eua-new-hampshire',
      name: 'New Hampshire (Estados Unidos)',
      category: 'Região libertária-fiscal',
      description:
        'Pequeno estado do nordeste dos Estados Unidos, New Hampshire é conhecido por sua forte cultura libertária, baixa tributação, ausência de imposto de renda estadual e lema que exalta a liberdade acima de tudo.',
      flagPath: '/countries/flags/eua-new-hampshire.png',
      historical: false,
      period: '',
      compatibility: 94
    },
    personality: {
      personalityId: 'mises',
      name: 'Ludwig von Mises',
      role: 'Economista',
      category: 'economista',
      lifespan: '1881–1973',
      description:
        'Economista austríaco, Mises foi grande defensor do livre mercado e mostrou a impossibilidade do cálculo econômico racional no socialismo, tornando-se pilar da Escola Austríaca e inspiração do libertarianismo moderno.',
      imagePath: '/personalities/portraits/mises.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democracia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Privado',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 52,
        rightPercent: 48,
        dominantPole: 'Progressista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'anarquismo-kropotkiniano',
      name: 'Anarquismo Kropotkiniano',
      category: 'Anarquismo',
      description:
        'Corrente de Piotr Kropotkin que vê na ajuda mútua uma lei da natureza e propõe comunas federadas, integração entre agricultura e indústria, ciência a serviço de todos e ética da solidariedade sem Estado.',
      longDescription:
        'Corrente de Piotr Kropotkin que vê na ajuda mútua uma lei da natureza e propõe comunas federadas, integração entre agricultura e indústria, ciência a serviço de todos e ética da solidariedade sem Estado. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero comunas livres federadas pela ajuda mútua, unindo campo e fábrica, com tudo repartido segundo a necessidade e nenhum Estado.',
      compatibility: 98
    },
    country: {
      countryId: 'rojava',
      name: 'Rojava (Norte e Leste da Síria)',
      category: 'Confederalismo democrático-igualitário',
      description:
        'Região autônoma no norte da Síria, Rojava organiza-se pelo confederalismo democrático, com autogestão local, igualdade de gênero, pluralismo étnico e ecologia, inspirada nas ideias libertárias de Abdullah Öcalan.',
      flagPath: '/countries/flags/rojava.png',
      historical: false,
      period: '2012–presente',
      compatibility: 93
    },
    personality: {
      personalityId: 'bakunin',
      name: 'Mikhail Bakunin',
      role: 'Revolucionário',
      category: 'teorico',
      lifespan: '1814–1876',
      description:
        'Revolucionário russo, Bakunin foi o grande teórico do anarquismo coletivista, opondo-se ao Estado e ao marxismo autoritário e defendendo a revolução social espontânea e a livre federação de comunidades e trabalhadores.',
      imagePath: '/personalities/portraits/bakunin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 80,
        rightPercent: 20,
        dominantPole: 'Democracia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Público',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Progressista',
        intensity: 'Forte'
      }
    ]
  }
];

const en: ExampleResult[] = [
  {
    ideology: {
      ideologyId: 'marxismo-leninismo',
      name: 'Marxism–Leninism',
      category: 'Radical Left',
      description:
        'Revolutionary branch of Marxism that advocates the seizure of power by a vanguard party and the dictatorship of the proletariat, with a planned economy and collectivization, serving as the foundation of the communist regimes of...',
      longDescription:
        'Revolutionary branch of Marxism that advocates the seizure of power by a vanguard party and the dictatorship of the proletariat, with a planned economy and collectivization, serving as the foundation of the communist regimes of the 20th century. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want a society ruled by a vanguard party, with the dictatorship of the proletariat and a planned, collectivized economy.',
      compatibility: 99
    },
    country: {
      countryId: 'cuba',
      name: 'Cuba',
      category: 'One-party egalitarian socialism',
      description:
        'A single-party socialist state in the Caribbean, Cuba maintains a planned economy, strong state control, and universal public services, with power centralized since the revolution led by Fidel Castro in 1959.',
      flagPath: '/countries/flags/cuba.gif',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'lenin',
      name: 'Vladimir Lenin',
      role: 'Revolutionary',
      category: 'politico',
      lifespan: '1870–1924',
      description:
        'Leader of the 1917 Russian Revolution and founder of the Soviet Union, Lenin theorized the vanguard party, the dictatorship of the proletariat, and imperialism as the final stage of capitalism, shaping 20th-century communism.',
      imagePath: '/personalities/portraits/lenin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Autocracy',
        intensity: 'Strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 89,
        rightPercent: 11,
        dominantPole: 'Public',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 54,
        rightPercent: 46,
        dominantPole: 'Progressive',
        intensity: 'Balanced'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-social',
      name: 'Social Liberalism',
      category: 'Left',
      description:
        'Branch that combines individual freedoms with strong state action to guarantee welfare, education, and healthcare, defending equal opportunity and social security within the market economy.',
      longDescription:
        'Branch that combines individual freedoms with strong state action to guarantee welfare, education, and healthcare, defending equal opportunity and social security within the market economy. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want a society of individual freedoms sustained by strong social security, with the state guaranteeing health and education for all.',
      compatibility: 98
    },
    country: {
      countryId: 'eua-nova-york',
      name: 'New York (United States)',
      category: 'Financial-cosmopolitan region',
      description:
        'The financial and cultural center of the United States, New York combines liberal, progressive politics, enormous immigrant diversity, a globalized service-based economy, and strong symbolic weight in the world.',
      flagPath: '/countries/flags/eua-nova-york.png',
      historical: false,
      period: '',
      compatibility: 98
    },
    personality: {
      personalityId: 'justin-trudeau',
      name: 'Justin Trudeau',
      role: 'Statesman',
      category: 'politico',
      lifespan: '1971–',
      description:
        'Prime Minister of Canada (2015–2025) for the Liberal Party, Trudeau promoted multiculturalism, welcoming immigrants and refugees, progressive gender and environmental policies, and a centrist governing style backed by strong state social intervention.',
      imagePath: '/personalities/portraits/justin-trudeau.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Democracy',
        intensity: 'Strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 64,
        rightPercent: 36,
        dominantPole: 'Public',
        intensity: 'Leaning'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 79,
        rightPercent: 21,
        dominantPole: 'Progressive',
        intensity: 'Strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'terceira-via',
      name: 'Third Way',
      category: 'Center',
      description:
        '1990s renewal of the center-left under Blair, Clinton and Giddens that accepts globalized markets and fiscal discipline, replaces welfare with work activation, is tough on crime and backs liberal interventions.',
      longDescription:
        '1990s renewal of the center-left under Blair, Clinton and Giddens that accepts globalized markets and fiscal discipline, replaces welfare with work activation, is tough on crime and backs liberal interventions. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want a globalized market with a state that invests in education, trades welfare for work, and is tough on crime and its causes.',
      compatibility: 94
    },
    country: {
      countryId: 'inglaterra',
      name: 'England (United Kingdom)',
      category: 'Liberal-conservative constituent country',
      description:
        'The largest constituent country of the United Kingdom, England is governed directly by Westminster with no parliament of its own, with an established Church of England, a public health service (NHS), a financial centre in London, a Brexit majority and a growing populist vote.',
      flagPath: '/countries/flags/inglaterra.png',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'macron',
      name: 'Emmanuel Macron',
      role: 'Statesman',
      category: 'politico',
      lifespan: '1977–',
      description:
        'A French statesman, Macron reached France\'s presidency as a centrist, liberal reformer, defending markets, European integration, and economic reforms, seeking to overcome the traditional divide between left and right.',
      imagePath: '/personalities/portraits/macron.jpg',
      compatibility: 98
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democracy',
        intensity: 'Strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 44,
        rightPercent: 56,
        dominantPole: 'Private',
        intensity: 'Balanced'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 68,
        rightPercent: 32,
        dominantPole: 'Progressive',
        intensity: 'Leaning'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'alt-lite',
      name: 'Alt-Lite',
      category: 'Right',
      description:
        'Branch of the radical right that is nationalist and anti-globalist, emphasizing cultural identity, criticism of immigration and opposition to political correctness, without adopting race-based positions.',
      longDescription:
        'Branch of the radical right that is nationalist and anti-globalist, emphasizing cultural identity, criticism of immigration and opposition to political correctness, without adopting race-based positions. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want to preserve my people\'s cultural identity, with immigration controls and free speech against political correctness.',
      compatibility: 97
    },
    country: {
      countryId: 'hungria',
      name: 'Hungary',
      category: 'National-illiberal republic',
      description:
        'A parliamentary republic in Eastern Europe, Hungary is governed under so-called illiberal democracy, uniting nationalism, Christian conservatism, sovereignty vis-à-vis the European Union, and strong control of media and institutions.',
      flagPath: '/countries/flags/hungria.gif',
      historical: false,
      period: '',
      compatibility: 89
    },
    personality: {
      personalityId: 'donald-trump',
      name: 'Donald Trump',
      role: 'Politician',
      category: 'politico',
      lifespan: '1946–',
      description:
        'An entrepreneur and US president, Trump leads the nationalist populism of the MAGA movement, with tariff protectionism, restrictive immigration policy, and anti-establishment rhetoric that redefined the right.',
      imagePath: '/personalities/portraits/donald-trump.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 39,
        rightPercent: 61,
        dominantPole: 'Autocracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Private',
        intensity: 'Strong'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 21,
        rightPercent: 79,
        dominantPole: 'Traditionalist',
        intensity: 'Strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neoliberalismo-autoritario',
      name: 'Authoritarian Neoliberalism',
      category: 'Right',
      description:
        'Regime that introduces radical free-market policies under a military dictatorship, with privatizations, trade opening and Chicago School economists, restricting unions, parties and opponents in the name of order and anticommunism.',
      longDescription:
        'Regime that introduces radical free-market policies under a military dictatorship, with privatizations, trade opening and Chicago School economists, restricting unions, parties and opponents in the name of order and anticommunism. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want open markets, privatizations and fiscal discipline under a strong government, with political order and restrictions on the opposition.',
      compatibility: 98
    },
    country: {
      countryId: 'el-salvador',
      name: 'El Salvador',
      category: 'Security-digital republic',
      description:
        'A presidential republic in Central America, El Salvador gained prominence for its tough security policy against gangs and its adoption of bitcoin, uniting strong popular support and the concentration of power in the executive.',
      flagPath: '/countries/flags/el-salvador.png',
      historical: false,
      period: '',
      compatibility: 90
    },
    personality: {
      personalityId: 'augusto-pinochet',
      name: 'Augusto Pinochet',
      role: 'Dictator',
      category: 'politico',
      lifespan: '1915–2006',
      description:
        'A Chilean general and dictator, Pinochet overthrew Allende and established an anti-communist military regime, combining political repression, authoritarian conservatism, and neoliberal reforms.',
      imagePath: '/personalities/portraits/augusto-pinochet.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 14,
        rightPercent: 86,
        dominantPole: 'Autocracy',
        intensity: 'Strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 12,
        rightPercent: 88,
        dominantPole: 'Private',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 11,
        rightPercent: 89,
        dominantPole: 'Traditionalist',
        intensity: 'Very strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'corporativismo',
      name: 'Corporatism',
      category: 'Third Position',
      description:
        'Model that organizes society into corporations of workers and employers integrated into the state, seeking harmony between classes and directed economic cooperation instead of conflict or free competition.',
      longDescription:
        'Model that organizes society into corporations of workers and employers integrated into the state, seeking harmony between classes and directed economic cooperation instead of conflict or free competition. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want a society organized into corporations of employers and workers integrated into the state, in directed harmony between the classes.',
      compatibility: 97
    },
    country: {
      countryId: 'burkina-faso',
      name: 'Burkina Faso',
      category: 'Sovereigntist pan-African military republic',
      description:
        'West African Sahelian nation led by a patriotic transition military government that revived Thomas Sankara\'s anti-colonial and self-reliance legacy, exited ECOWAS, established the Alliance of Sahel States (AES), and reoriented foreign partnerships to assert national sovereignty.',
      flagPath: '/countries/flags/burkina-faso.png',
      historical: false,
      period: '',
      compatibility: 90
    },
    personality: {
      personalityId: 'plinio-salgado',
      name: 'Plínio Salgado',
      role: 'Politician',
      category: 'politico',
      lifespan: '1895–1975',
      description:
        'Leader of Brazilian Integralism, Plínio Salgado created an authoritarian nationalist movement of Christian inspiration, with the motto God, Fatherland and Family and mass aesthetics inspired by the European fascisms of the 1930s.',
      imagePath: '/personalities/portraits/plinio-salgado.jpg',
      compatibility: 96
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 28,
        rightPercent: 72,
        dominantPole: 'Autocracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 76,
        rightPercent: 24,
        dominantPole: 'Public',
        intensity: 'Strong'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 8,
        rightPercent: 92,
        dominantPole: 'Traditionalist',
        intensity: 'Very strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-classico',
      name: 'Classical Liberalism',
      category: 'Libertarian',
      description:
        'Original branch of liberalism that defends natural rights, property, free markets, and a minimal state, seeing individual freedom and the strict limitation of power as the foundations of a just society.',
      longDescription:
        'Original branch of liberalism that defends natural rights, property, free markets, and a minimal state, seeing individual freedom and the strict limitation of power as the foundations of a just society. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want a society of natural rights and sacred property, with a minimal state and free market as the foundations of a just life.',
      compatibility: 97
    },
    country: {
      countryId: 'eua-new-hampshire',
      name: 'New Hampshire (United States)',
      category: 'Libertarian-fiscal region',
      description:
        'A small state in the northeastern United States, New Hampshire is known for its strong libertarian culture, low taxation, absence of a state income tax, and a motto that exalts liberty above all.',
      flagPath: '/countries/flags/eua-new-hampshire.png',
      historical: false,
      period: '',
      compatibility: 94
    },
    personality: {
      personalityId: 'mises',
      name: 'Ludwig von Mises',
      role: 'Economist',
      category: 'economista',
      lifespan: '1881–1973',
      description:
        'An Austrian economist, Mises was a great defender of the free market and demonstrated the impossibility of rational economic calculation under socialism, becoming a pillar of the Austrian School and an inspiration for modern libertarianism.',
      imagePath: '/personalities/portraits/mises.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democracy',
        intensity: 'Strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Private',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 52,
        rightPercent: 48,
        dominantPole: 'Progressive',
        intensity: 'Balanced'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'anarquismo-kropotkiniano',
      name: 'Kropotkinian Anarchism',
      category: 'Anarchist',
      description:
        'Current of Peter Kropotkin that sees mutual aid as a law of nature and proposes federated communes, integration of farming and industry, science serving all and an ethics of solidarity without the state.',
      longDescription:
        'Current of Peter Kropotkin that sees mutual aid as a law of nature and proposes federated communes, integration of farming and industry, science serving all and an ethics of solidarity without the state. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want free communes federated by mutual aid, joining field and factory, with everything shared by need and no state at all.',
      compatibility: 98
    },
    country: {
      countryId: 'rojava',
      name: 'Rojava (North and East Syria)',
      category: 'Democratic-egalitarian confederalism',
      description:
        'An autonomous region in northern Syria, Rojava organizes itself through democratic confederalism, with local self-management, gender equality, ethnic pluralism, and ecology, inspired by the libertarian ideas of Abdullah Öcalan.',
      flagPath: '/countries/flags/rojava.png',
      historical: false,
      period: '2012–presente',
      compatibility: 93
    },
    personality: {
      personalityId: 'bakunin',
      name: 'Mikhail Bakunin',
      role: 'Revolutionary',
      category: 'teorico',
      lifespan: '1814–1876',
      description:
        'A Russian revolutionary, Bakunin was the great theorist of collectivist anarchism, opposing the state and authoritarian Marxism and defending spontaneous social revolution and the free federation of communities and workers.',
      imagePath: '/personalities/portraits/bakunin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 80,
        rightPercent: 20,
        dominantPole: 'Democracy',
        intensity: 'Strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Public',
        intensity: 'Strong'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Progressive',
        intensity: 'Strong'
      }
    ]
  }
];

export const EXAMPLE_RESULTS: ExampleResult[] = LANG === 'en' ? en : pt;
