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
      ideologyId: 'aceleracionismo-de-direita',
      name: 'Aceleracionismo de Direita',
      category: 'Extrema Direita',
      description:
        'Corrente que defende acelerar as contradições do sistema por meio da tecnologia e do enfraquecimento das instituições liberais, apostando na ruptura da ordem vigente para dar origem a uma nova ordem social e política hierárquica.',
      longDescription:
        'Corrente que defende acelerar as contradições do sistema por meio da tecnologia e do enfraquecimento das instituições liberais, apostando na ruptura da ordem vigente para dar origem a uma nova ordem social e política hierárquica. A compatibilidade indica proximidade entre suas respostas e esse perfil.',
      phrase:
        'Quero acelerar, com tecnologia e mercados sem Estado, a superação das instituições liberais, para que uma nova ordem hierárquica surja.',
      compatibility: 94
    },
    country: {
      countryId: 'hong-kong',
      name: 'Hong Kong (China)',
      category: 'Região tecnocrática-financeira',
      description:
        'Centro financeiro global, Hong Kong é uma região autônoma de forte capitalismo de livre mercado e gestão tecnocrática, cuja ampla autonomia foi crescentemente restringida pelo controle político da China continental.',
      flagPath: '/countries/flags/hong-kong.png',
      historical: false,
      period: '',
      compatibility: 84
    },
    personality: {
      personalityId: 'curtis-yarvin',
      name: 'Curtis Yarvin',
      role: 'Teórico político',
      category: 'teorico',
      lifespan: '1973–',
      description:
        'Teórico político conhecido como Mencius Moldbug, Yarvin formulou o neorreacionarismo, propondo substituir a democracia por um Estado gerido como empresa por um soberano-executivo, no modelo do neocameralismo.',
      imagePath: '/personalities/portraits/curtis-yarvin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 20,
        rightPercent: 80,
        dominantPole: 'Autocracia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 22,
        rightPercent: 78,
        dominantPole: 'Privado',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 49,
        rightPercent: 51,
        dominantPole: 'Tradicionalista',
        intensity: 'Equilibrado'
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
      ideologyId: 'aceleracionismo-de-direita',
      name: 'Right-Wing Accelerationism',
      category: 'Far-Right',
      description:
        'Current that defends accelerating the system\'s contradictions through technology and the weakening of liberal institutions, betting on a break with the existing order to give rise to a new hierarchical social and political order.',
      longDescription:
        'Current that defends accelerating the system\'s contradictions through technology and the weakening of liberal institutions, betting on a break with the existing order to give rise to a new hierarchical social and political order. Compatibility indicates how close your answers are to this profile.',
      phrase:
        'I want to accelerate, with technology and markets without a state, the overcoming of liberal institutions, so that a new hierarchical order arises.',
      compatibility: 94
    },
    country: {
      countryId: 'hong-kong',
      name: 'Hong Kong (China)',
      category: 'Technocratic-financial region',
      description:
        'A global financial center, Hong Kong is an autonomous region of strong free-market capitalism and technocratic management, whose broad autonomy has been increasingly restricted by mainland China\'s political control.',
      flagPath: '/countries/flags/hong-kong.png',
      historical: false,
      period: '',
      compatibility: 84
    },
    personality: {
      personalityId: 'curtis-yarvin',
      name: 'Curtis Yarvin',
      role: 'Political theorist',
      category: 'teorico',
      lifespan: '1973–',
      description:
        'A political theorist known as Mencius Moldbug, Yarvin formulated neoreaction, proposing to replace democracy with a state run like a company by a sovereign-executive, on the model of neocameralism.',
      imagePath: '/personalities/portraits/curtis-yarvin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 20,
        rightPercent: 80,
        dominantPole: 'Autocracy',
        intensity: 'Strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 22,
        rightPercent: 78,
        dominantPole: 'Private',
        intensity: 'Strong'
      },
      {
        axisId: 'moral',
        label: 'Morality',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 49,
        rightPercent: 51,
        dominantPole: 'Traditionalist',
        intensity: 'Balanced'
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

const es: ExampleResult[] = [
  {
    ideology: {
      ideologyId: 'marxismo-leninismo',
      name: 'Marxismo–Leninismo',
      category: 'Izquierda radical',
      description:
        'Rama revolucionaria del marxismo que defiende la toma del poder por un partido de vanguardia y la dictadura del proletariado, con economía planificada y colectivización, base de los regímenes comunistas de...',
      longDescription:
        'Rama revolucionaria del marxismo que defiende la toma del poder por un partido de vanguardia y la dictadura del proletariado, con economía planificada y colectivización, base de los regímenes comunistas del siglo XX. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero una sociedad dirigida por un partido de vanguardia, con dictadura del proletariado y una economía planificada y colectivizada.',
      compatibility: 99
    },
    country: {
      countryId: 'cuba',
      name: 'Cuba',
      category: 'Socialismo igualitario de partido único',
      description:
        'Estado socialista de partido único en el Caribe, Cuba mantiene una economía planificada, fuerte control estatal y servicios públicos universales, con el poder centralizado desde la revolución liderada por Fidel Castro en 1959.',
      flagPath: '/countries/flags/cuba.gif',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'lenin',
      name: 'Vladimir Lenin',
      role: 'Revolucionario',
      category: 'politico',
      lifespan: '1870–1924',
      description:
        'Líder de la Revolución rusa de 1917 y fundador de la Unión Soviética, Lenin teorizó el partido de vanguardia, la dictadura del proletariado y el imperialismo como fase superior del capitalismo, y marcó el comunismo del siglo XX.',
      imagePath: '/personalities/portraits/lenin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Autocracia',
        intensity: 'Fuerte'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 89,
        rightPercent: 11,
        dominantPole: 'Pública',
        intensity: 'Muy fuerte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 54,
        rightPercent: 46,
        dominantPole: 'Progresista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-social',
      name: 'Liberalismo social',
      category: 'Izquierda',
      description:
        'Rama que combina las libertades individuales con una fuerte acción del Estado para garantizar bienestar, educación y salud, defendiendo la igualdad de oportunidades y la seguridad social dentro de la economía de mercado.',
      longDescription:
        'Rama que combina las libertades individuales con una fuerte acción del Estado para garantizar bienestar, educación y salud, defendiendo la igualdad de oportunidades y la seguridad social dentro de la economía de mercado. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero una sociedad de libertades individuales sostenida por una fuerte seguridad social, con el Estado garantizando salud y educación para todos.',
      compatibility: 98
    },
    country: {
      countryId: 'eua-nova-york',
      name: 'Nueva York (Estados Unidos)',
      category: 'Región financiera y cosmopolita',
      description:
        'Centro financiero y cultural de Estados Unidos, Nueva York combina una política liberal y progresista, una enorme diversidad de inmigrantes, una economía globalizada de servicios y un gran peso simbólico en el mundo.',
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
        'Primer ministro de Canadá (2015–2025) por el Partido Liberal, Trudeau promovió el multiculturalismo, la acogida de inmigrantes y refugiados, políticas progresistas de género y medioambiente, y un estilo de gobierno centrista con fuerte intervención social del Estado.',
      imagePath: '/personalities/portraits/justin-trudeau.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Democracia',
        intensity: 'Fuerte'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 64,
        rightPercent: 36,
        dominantPole: 'Pública',
        intensity: 'Inclinado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 79,
        rightPercent: 21,
        dominantPole: 'Progresista',
        intensity: 'Fuerte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'terceira-via',
      name: 'Tercera vía',
      category: 'Centro',
      description:
        'Renovación de la centroizquierda en los años 90 con Blair, Clinton y Giddens, que acepta los mercados globalizados y la disciplina fiscal, cambia asistencialismo por activación laboral, es dura con el crimen y apoya intervenciones liberales.',
      longDescription:
        'Renovación de la centroizquierda en los años 90 con Blair, Clinton y Giddens, que acepta los mercados globalizados y la disciplina fiscal, cambia asistencialismo por activación laboral, es dura con el crimen y apoya intervenciones liberales. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero un mercado globalizado con un Estado que invierta en educación, cambie asistencialismo por trabajo y sea duro con el crimen y sus causas.',
      compatibility: 94
    },
    country: {
      countryId: 'inglaterra',
      name: 'Inglaterra (Reino Unido)',
      category: 'País constituyente liberal-conservador',
      description:
        'Mayor país constituyente del Reino Unido, Inglaterra es gobernada directamente por Westminster sin parlamento propio, con Iglesia de Inglaterra establecida, servicio público de salud (NHS), centro financiero en Londres, mayoría pro-Brexit y creciente voto populista.',
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
        'Estadista francés, Macron llegó a la presidencia de Francia como reformista centrista y liberal, defendiendo los mercados, la integración europea y las reformas económicas, y buscando superar la división tradicional entre izquierda y derecha.',
      imagePath: '/personalities/portraits/macron.jpg',
      compatibility: 98
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democracia',
        intensity: 'Fuerte'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 44,
        rightPercent: 56,
        dominantPole: 'Privada',
        intensity: 'Equilibrado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 68,
        rightPercent: 32,
        dominantPole: 'Progresista',
        intensity: 'Inclinado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'alt-lite',
      name: 'Alt-Lite',
      category: 'Derecha',
      description:
        'Rama de la derecha radical nacionalista y antiglobalista, que enfatiza la identidad cultural, la crítica a la inmigración y la oposición a la corrección política, sin adoptar posturas basadas en la raza.',
      longDescription:
        'Rama de la derecha radical nacionalista y antiglobalista, que enfatiza la identidad cultural, la crítica a la inmigración y la oposición a la corrección política, sin adoptar posturas basadas en la raza. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero preservar la identidad cultural de mi pueblo, con control de la inmigración y libertad de expresión frente a la corrección política.',
      compatibility: 97
    },
    country: {
      countryId: 'hungria',
      name: 'Hungría',
      category: 'República nacional e iliberal',
      description:
        'República parlamentaria de Europa del Este, Hungría se gobierna bajo la llamada democracia iliberal, que une nacionalismo, conservadurismo cristiano, soberanía frente a la Unión Europea y fuerte control de los medios y las instituciones.',
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
        'Empresario y presidente de Estados Unidos, Trump lidera el populismo nacionalista del movimiento MAGA, con proteccionismo arancelario, política migratoria restrictiva y un discurso antisistema que redefinió la derecha.',
      imagePath: '/personalities/portraits/donald-trump.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 39,
        rightPercent: 61,
        dominantPole: 'Autocracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Privada',
        intensity: 'Fuerte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 21,
        rightPercent: 79,
        dominantPole: 'Tradicionalista',
        intensity: 'Fuerte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'aceleracionismo-de-direita',
      name: 'Aceleracionismo de derecha',
      category: 'Extrema derecha',
      description:
        'Corriente que defiende acelerar las contradicciones del sistema mediante la tecnología y el debilitamiento de las instituciones liberales, apostando por una ruptura con el orden existente para dar lugar a un nuevo orden social y político jerárquico.',
      longDescription:
        'Corriente que defiende acelerar las contradicciones del sistema mediante la tecnología y el debilitamiento de las instituciones liberales, apostando por una ruptura con el orden existente para dar lugar a un nuevo orden social y político jerárquico. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero acelerar, con tecnología y mercados sin Estado, la superación de las instituciones liberales para que surja un nuevo orden jerárquico.',
      compatibility: 94
    },
    country: {
      countryId: 'hong-kong',
      name: 'Hong Kong (China)',
      category: 'Región tecnocrática y financiera',
      description:
        'Centro financiero global, Hong Kong es una región autónoma de fuerte capitalismo de libre mercado y gestión tecnocrática, cuya amplia autonomía ha sido cada vez más restringida por el control político de China continental.',
      flagPath: '/countries/flags/hong-kong.png',
      historical: false,
      period: '',
      compatibility: 84
    },
    personality: {
      personalityId: 'curtis-yarvin',
      name: 'Curtis Yarvin',
      role: 'Teórico político',
      category: 'teorico',
      lifespan: '1973–',
      description:
        'Teórico político conocido como Mencius Moldbug, Yarvin formuló la neorreacción, que propone reemplazar la democracia por un Estado dirigido como una empresa por un soberano-ejecutivo, según el modelo del neocameralismo.',
      imagePath: '/personalities/portraits/curtis-yarvin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 20,
        rightPercent: 80,
        dominantPole: 'Autocracia',
        intensity: 'Fuerte'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 22,
        rightPercent: 78,
        dominantPole: 'Privada',
        intensity: 'Fuerte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 49,
        rightPercent: 51,
        dominantPole: 'Tradicionalista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'corporativismo',
      name: 'Corporativismo',
      category: 'Tercera posición',
      description:
        'Modelo que organiza la sociedad en corporaciones de trabajadores y empleadores integradas al Estado, buscando la armonía entre clases y una cooperación económica dirigida en lugar del conflicto o la libre competencia.',
      longDescription:
        'Modelo que organiza la sociedad en corporaciones de trabajadores y empleadores integradas al Estado, buscando la armonía entre clases y una cooperación económica dirigida en lugar del conflicto o la libre competencia. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero una sociedad organizada en corporaciones de empleadores y trabajadores integradas al Estado, en armonía dirigida entre las clases.',
      compatibility: 97
    },
    country: {
      countryId: 'burkina-faso',
      name: 'Burkina Faso',
      category: 'República militar panafricana y soberanista',
      description:
        'Nación saheliana de África Occidental, gobernada por un gobierno militar patriótico de transición que revivió el legado anticolonial y de autosuficiencia de Thomas Sankara, salió de la CEDEAO, creó la Alianza de Estados del Sahel (AES) y reorientó sus alianzas para afirmar la soberanía nacional.',
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
        'Líder del Integralismo brasileño, Plínio Salgado creó un movimiento nacionalista autoritario de inspiración cristiana, con el lema Dios, Patria y Familia y una estética de masas inspirada en los fascismos europeos de la década de 1930.',
      imagePath: '/personalities/portraits/plinio-salgado.jpg',
      compatibility: 96
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 28,
        rightPercent: 72,
        dominantPole: 'Autocracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 76,
        rightPercent: 24,
        dominantPole: 'Pública',
        intensity: 'Fuerte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 8,
        rightPercent: 92,
        dominantPole: 'Tradicionalista',
        intensity: 'Muy fuerte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-classico',
      name: 'Liberalismo clásico',
      category: 'Libertario',
      description:
        'Rama original del liberalismo que defiende los derechos naturales, la propiedad, el libre mercado y un Estado mínimo, y ve la libertad individual y la estricta limitación del poder como los cimientos de una sociedad justa.',
      longDescription:
        'Rama original del liberalismo que defiende los derechos naturales, la propiedad, el libre mercado y un Estado mínimo, y ve la libertad individual y la estricta limitación del poder como los cimientos de una sociedad justa. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero una sociedad de derechos naturales y propiedad sagrada, con Estado mínimo y libre mercado como cimientos de una vida justa.',
      compatibility: 97
    },
    country: {
      countryId: 'eua-new-hampshire',
      name: 'Nuevo Hampshire (Estados Unidos)',
      category: 'Región libertaria y fiscal',
      description:
        'Pequeño estado del noreste de Estados Unidos, Nuevo Hampshire es conocido por su fuerte cultura libertaria, sus bajos impuestos, la ausencia de impuesto estatal sobre la renta y un lema que exalta la libertad por encima de todo.',
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
        'Economista austríaco, Mises fue un gran defensor del libre mercado y demostró la imposibilidad del cálculo económico racional bajo el socialismo, convirtiéndose en pilar de la Escuela Austríaca e inspiración del libertarismo moderno.',
      imagePath: '/personalities/portraits/mises.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democracia',
        intensity: 'Fuerte'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Privada',
        intensity: 'Muy fuerte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 52,
        rightPercent: 48,
        dominantPole: 'Progresista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'anarquismo-kropotkiniano',
      name: 'Anarquismo kropotkiniano',
      category: 'Anarquista',
      description:
        'Corriente de Piotr Kropotkin que ve la ayuda mutua como ley de la naturaleza y propone comunas federadas, integración de agricultura e industria, ciencia al servicio de todos y una ética de solidaridad sin Estado.',
      longDescription:
        'Corriente de Piotr Kropotkin que ve la ayuda mutua como ley de la naturaleza y propone comunas federadas, integración de agricultura e industria, ciencia al servicio de todos y una ética de solidaridad sin Estado. La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
      phrase:
        'Quiero comunas libres federadas por la ayuda mutua, que unan campo y fábrica, con todo compartido según la necesidad y sin ningún Estado.',
      compatibility: 98
    },
    country: {
      countryId: 'rojava',
      name: 'Rojava (Siria del Norte y del Este)',
      category: 'Confederalismo democrático e igualitario',
      description:
        'Región autónoma del norte de Siria, Rojava se organiza mediante el confederalismo democrático, con autogestión local, igualdad de género, pluralismo étnico y ecología, inspirada en las ideas libertarias de Abdullah Öcalan.',
      flagPath: '/countries/flags/rojava.png',
      historical: false,
      period: '2012–presente',
      compatibility: 93
    },
    personality: {
      personalityId: 'bakunin',
      name: 'Mikhail Bakunin',
      role: 'Revolucionario',
      category: 'teorico',
      lifespan: '1814–1876',
      description:
        'Revolucionario ruso, Bakunin fue el gran teórico del anarquismo colectivista, opositor del Estado y del marxismo autoritario, y defensor de la revolución social espontánea y de la libre federación de comunidades y trabajadores.',
      imagePath: '/personalities/portraits/bakunin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representación',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 80,
        rightPercent: 20,
        dominantPole: 'Democracia',
        intensity: 'Fuerte'
      },
      {
        axisId: 'economia',
        label: 'Economía',
        leftPole: 'Pública',
        rightPole: 'Privada',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Pública',
        intensity: 'Fuerte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progresista',
        rightPole: 'Tradicionalista',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Progresista',
        intensity: 'Fuerte'
      }
    ]
  }
];

const de: ExampleResult[] = [
  {
    ideology: {
      ideologyId: 'marxismo-leninismo',
      name: 'Marxismus-Leninismus',
      category: 'Radikale Linke',
      description:
        'Revolutionärer Zweig des Marxismus, der die Machtergreifung durch eine Avantgardepartei und die Diktatur des Proletariats fordert, mit Planwirtschaft und Kollektivierung, und der als Grundlage der kommunistischen Regime des 20. Jahrhunderts diente...',
      longDescription:
        'Revolutionärer Zweig des Marxismus, der die Machtergreifung durch eine Avantgardepartei und die Diktatur des Proletariats fordert, mit Planwirtschaft und Kollektivierung, und der als Grundlage der kommunistischen Regime des 20. Jahrhunderts diente. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will eine Gesellschaft, die von einer Avantgardepartei geführt wird, mit der Diktatur des Proletariats und einer geplanten, kollektivierten Wirtschaft.',
      compatibility: 99
    },
    country: {
      countryId: 'cuba',
      name: 'Kuba',
      category: 'Egalitärer Einparteien-Sozialismus',
      description:
        'Als sozialistischer Einparteienstaat in der Karibik hat Kuba eine Planwirtschaft, starke staatliche Kontrolle und allgemeine öffentliche Dienste, mit zentralisierter Macht seit der von Fidel Castro 1959 angeführten Revolution.',
      flagPath: '/countries/flags/cuba.gif',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'lenin',
      name: 'Wladimir Lenin',
      role: 'Revolutionär',
      category: 'politico',
      lifespan: '1870–1924',
      description:
        'Lenin, Anführer der Russischen Revolution von 1917 und Gründer der Sowjetunion, entwickelte die Theorie der Avantgardepartei, der Diktatur des Proletariats und des Imperialismus als höchstes Stadium des Kapitalismus und prägte den Kommunismus des 20. Jahrhunderts.',
      imagePath: '/personalities/portraits/lenin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Autokratie',
        intensity: 'Stark'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 89,
        rightPercent: 11,
        dominantPole: 'Öffentlich',
        intensity: 'Sehr stark'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 54,
        rightPercent: 46,
        dominantPole: 'Progressiv',
        intensity: 'Ausgeglichen'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-social',
      name: 'Sozialliberalismus',
      category: 'Links',
      description:
        'Richtung, die individuelle Freiheiten mit starkem staatlichem Handeln verbindet, um Wohlfahrt, Bildung und Gesundheitsversorgung zu sichern, und die Chancengleichheit und soziale Sicherheit innerhalb der Marktwirtschaft verteidigt.',
      longDescription:
        'Richtung, die individuelle Freiheiten mit starkem staatlichem Handeln verbindet, um Wohlfahrt, Bildung und Gesundheitsversorgung zu sichern, und die Chancengleichheit und soziale Sicherheit innerhalb der Marktwirtschaft verteidigt. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will eine Gesellschaft individueller Freiheiten, getragen von starker sozialer Sicherheit, in der der Staat Gesundheit und Bildung für alle garantiert.',
      compatibility: 98
    },
    country: {
      countryId: 'eua-nova-york',
      name: 'New York (Vereinigte Staaten)',
      category: 'Finanzstarke kosmopolitische Region',
      description:
        'Als Finanz- und Kulturzentrum der Vereinigten Staaten verbindet New York eine liberale, progressive Politik, enorme Vielfalt durch Einwanderung, eine globalisierte Dienstleistungswirtschaft und großes symbolisches Gewicht in der Welt.',
      flagPath: '/countries/flags/eua-nova-york.png',
      historical: false,
      period: '',
      compatibility: 98
    },
    personality: {
      personalityId: 'justin-trudeau',
      name: 'Justin Trudeau',
      role: 'Staatsmann',
      category: 'politico',
      lifespan: '1971–',
      description:
        'Als Premierminister Kanadas (2015–2025) für die Liberale Partei förderte Trudeau Multikulturalismus, die Aufnahme von Einwanderern und Flüchtlingen, eine progressive Geschlechter- und Umweltpolitik und einen Regierungsstil der Mitte, gestützt auf starke soziale Eingriffe des Staates.',
      imagePath: '/personalities/portraits/justin-trudeau.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Demokratie',
        intensity: 'Stark'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 64,
        rightPercent: 36,
        dominantPole: 'Öffentlich',
        intensity: 'Tendenz'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 79,
        rightPercent: 21,
        dominantPole: 'Progressiv',
        intensity: 'Stark'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'terceira-via',
      name: 'Dritter Weg',
      category: 'Mitte',
      description:
        'Erneuerung der Mitte-links-Parteien in den 1990er Jahren unter Blair, Clinton und Giddens, die globalisierte Märkte und Haushaltsdisziplin akzeptiert, Sozialleistungen durch Arbeitsaktivierung ersetzt, hart gegen Kriminalität vorgeht und liberale Interventionen unterstützt.',
      longDescription:
        'Erneuerung der Mitte-links-Parteien in den 1990er Jahren unter Blair, Clinton und Giddens, die globalisierte Märkte und Haushaltsdisziplin akzeptiert, Sozialleistungen durch Arbeitsaktivierung ersetzt, hart gegen Kriminalität vorgeht und liberale Interventionen unterstützt. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will einen globalisierten Markt mit einem Staat, der in Bildung investiert, Sozialleistungen gegen Arbeit eintauscht und hart gegen Kriminalität und ihre Ursachen vorgeht.',
      compatibility: 94
    },
    country: {
      countryId: 'inglaterra',
      name: 'England (Vereinigtes Königreich)',
      category: 'Liberal-konservativer Landesteil',
      description:
        'Als größter Landesteil des Vereinigten Königreichs wird England ohne eigenes Parlament direkt von Westminster regiert, mit einer Staatskirche (Church of England), einem öffentlichen Gesundheitsdienst (NHS), einem Finanzzentrum in London, einer Brexit-Mehrheit und einem wachsenden populistischen Wähleranteil.',
      flagPath: '/countries/flags/inglaterra.png',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'macron',
      name: 'Emmanuel Macron',
      role: 'Staatsmann',
      category: 'politico',
      lifespan: '1977–',
      description:
        'Der französische Staatsmann Macron gelangte als zentristischer, liberaler Reformer an die Spitze Frankreichs, verteidigte Märkte, die europäische Integration und Wirtschaftsreformen und wollte die traditionelle Trennung zwischen Links und Rechts überwinden.',
      imagePath: '/personalities/portraits/macron.jpg',
      compatibility: 98
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Demokratie',
        intensity: 'Stark'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 44,
        rightPercent: 56,
        dominantPole: 'Privat',
        intensity: 'Ausgeglichen'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 68,
        rightPercent: 32,
        dominantPole: 'Progressiv',
        intensity: 'Tendenz'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'alt-lite',
      name: 'Alt-Lite',
      category: 'Rechts',
      description:
        'Zweig der radikalen Rechten, der nationalistisch und antiglobalistisch ist, kulturelle Identität betont, Einwanderung kritisiert und sich gegen politische Korrektheit stellt, ohne rassenbasierte Positionen zu übernehmen.',
      longDescription:
        'Zweig der radikalen Rechten, der nationalistisch und antiglobalistisch ist, kulturelle Identität betont, Einwanderung kritisiert und sich gegen politische Korrektheit stellt, ohne rassenbasierte Positionen zu übernehmen. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will die kulturelle Identität meines Volkes bewahren, mit Einwanderungskontrolle und Meinungsfreiheit gegen politische Korrektheit.',
      compatibility: 97
    },
    country: {
      countryId: 'hungria',
      name: 'Ungarn',
      category: 'Nationale illiberale Republik',
      description:
        'Als parlamentarische Republik in Osteuropa wird Ungarn unter einer sogenannten illiberalen Demokratie regiert, die Nationalismus, christlichen Konservatismus, Souveränität gegenüber der Europäischen Union und eine starke Kontrolle von Medien und Institutionen vereint.',
      flagPath: '/countries/flags/hungria.gif',
      historical: false,
      period: '',
      compatibility: 89
    },
    personality: {
      personalityId: 'donald-trump',
      name: 'Donald Trump',
      role: 'Politiker',
      category: 'politico',
      lifespan: '1946–',
      description:
        'Der Unternehmer und US-Präsident Trump führt den nationalistischen Populismus der MAGA-Bewegung an, mit Zollprotektionismus, restriktiver Einwanderungspolitik und einer Anti-Establishment-Rhetorik, die die Rechte neu definiert hat.',
      imagePath: '/personalities/portraits/donald-trump.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 39,
        rightPercent: 61,
        dominantPole: 'Autokratie',
        intensity: 'Tendenz'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Privat',
        intensity: 'Stark'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 21,
        rightPercent: 79,
        dominantPole: 'Traditionalistisch',
        intensity: 'Stark'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'aceleracionismo-de-direita',
      name: 'Rechter Akzelerationismus',
      category: 'Extreme Rechte',
      description:
        'Strömung, die die Beschleunigung der Widersprüche des Systems durch Technologie und die Schwächung liberaler Institutionen fordert und auf einen Bruch mit der bestehenden Ordnung setzt, damit eine neue hierarchische gesellschaftliche und politische Ordnung entsteht.',
      longDescription:
        'Strömung, die die Beschleunigung der Widersprüche des Systems durch Technologie und die Schwächung liberaler Institutionen fordert und auf einen Bruch mit der bestehenden Ordnung setzt, damit eine neue hierarchische gesellschaftliche und politische Ordnung entsteht. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will mit Technologie und Märkten ohne Staat die Überwindung der liberalen Institutionen beschleunigen, damit eine neue hierarchische Ordnung entsteht.',
      compatibility: 94
    },
    country: {
      countryId: 'hong-kong',
      name: 'Hongkong (China)',
      category: 'Technokratisch-finanzstarke Region',
      description:
        'Als globales Finanzzentrum ist Hongkong eine autonome Region mit stark marktwirtschaftlichem Kapitalismus und technokratischer Verwaltung, deren weitreichende Autonomie durch die politische Kontrolle des chinesischen Festlands zunehmend eingeschränkt wird.',
      flagPath: '/countries/flags/hong-kong.png',
      historical: false,
      period: '',
      compatibility: 84
    },
    personality: {
      personalityId: 'curtis-yarvin',
      name: 'Curtis Yarvin',
      role: 'Politischer Theoretiker',
      category: 'teorico',
      lifespan: '1973–',
      description:
        'Der als Mencius Moldbug bekannte politische Theoretiker Yarvin formulierte die Neoreaktion und schlug vor, die Demokratie durch einen wie ein Unternehmen geführten Staat unter einem souveränen Geschäftsführer zu ersetzen, nach dem Vorbild des Neokameralismus.',
      imagePath: '/personalities/portraits/curtis-yarvin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 20,
        rightPercent: 80,
        dominantPole: 'Autokratie',
        intensity: 'Stark'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 22,
        rightPercent: 78,
        dominantPole: 'Privat',
        intensity: 'Stark'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 49,
        rightPercent: 51,
        dominantPole: 'Traditionalistisch',
        intensity: 'Ausgeglichen'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'corporativismo',
      name: 'Korporatismus',
      category: 'Dritte Position',
      description:
        'Modell, das die Gesellschaft in Korporationen von Arbeitnehmern und Arbeitgebern gliedert, die in den Staat eingebunden sind, und statt Konflikt oder freiem Wettbewerb Harmonie zwischen den Klassen und gelenkte wirtschaftliche Zusammenarbeit anstrebt.',
      longDescription:
        'Modell, das die Gesellschaft in Korporationen von Arbeitnehmern und Arbeitgebern gliedert, die in den Staat eingebunden sind, und statt Konflikt oder freiem Wettbewerb Harmonie zwischen den Klassen und gelenkte wirtschaftliche Zusammenarbeit anstrebt. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will eine Gesellschaft, die in Korporationen von Arbeitgebern und Arbeitnehmern gegliedert und in den Staat eingebunden ist, in gelenkter Harmonie zwischen den Klassen.',
      compatibility: 97
    },
    country: {
      countryId: 'burkina-faso',
      name: 'Burkina Faso',
      category: 'Souveränistische panafrikanische Militärrepublik',
      description:
        'Westafrikanischer Sahelstaat, der von einer patriotischen Übergangs-Militärregierung geführt wird, die das antikoloniale und auf Selbstversorgung ausgerichtete Erbe Thomas Sankaras wiederbelebt hat, aus der ECOWAS ausgetreten ist, die Allianz der Sahelstaaten (AES) gegründet und die auswärtigen Partnerschaften neu ausgerichtet hat, um die nationale Souveränität zu behaupten.',
      flagPath: '/countries/flags/burkina-faso.png',
      historical: false,
      period: '',
      compatibility: 90
    },
    personality: {
      personalityId: 'plinio-salgado',
      name: 'Plínio Salgado',
      role: 'Politiker',
      category: 'politico',
      lifespan: '1895–1975',
      description:
        'Als Anführer des brasilianischen Integralismus schuf Plínio Salgado eine autoritäre nationalistische Bewegung christlicher Prägung mit dem Leitspruch Gott, Vaterland und Familie und einer Massenästhetik nach dem Vorbild der europäischen Faschismen der 1930er Jahre.',
      imagePath: '/personalities/portraits/plinio-salgado.jpg',
      compatibility: 96
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 28,
        rightPercent: 72,
        dominantPole: 'Autokratie',
        intensity: 'Tendenz'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 76,
        rightPercent: 24,
        dominantPole: 'Öffentlich',
        intensity: 'Stark'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 8,
        rightPercent: 92,
        dominantPole: 'Traditionalistisch',
        intensity: 'Sehr stark'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-classico',
      name: 'Klassischer Liberalismus',
      category: 'Libertär',
      description:
        'Ursprünglicher Zweig des Liberalismus, der Naturrechte, Eigentum, freie Märkte und einen minimalen Staat verteidigt und individuelle Freiheit sowie die strikte Begrenzung der Macht als Grundlagen einer gerechten Gesellschaft sieht.',
      longDescription:
        'Ursprünglicher Zweig des Liberalismus, der Naturrechte, Eigentum, freie Märkte und einen minimalen Staat verteidigt und individuelle Freiheit sowie die strikte Begrenzung der Macht als Grundlagen einer gerechten Gesellschaft sieht. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will eine Gesellschaft der Naturrechte und des unantastbaren Eigentums, mit einem minimalen Staat und freiem Markt als Grundlage eines gerechten Lebens.',
      compatibility: 97
    },
    country: {
      countryId: 'eua-new-hampshire',
      name: 'New Hampshire (Vereinigte Staaten)',
      category: 'Libertär-fiskalische Region',
      description:
        'New Hampshire, ein kleiner Bundesstaat im Nordosten der Vereinigten Staaten, ist bekannt für seine starke libertäre Kultur, niedrige Steuern, den Verzicht auf eine staatliche Einkommensteuer und ein Motto, das die Freiheit über alles stellt.',
      flagPath: '/countries/flags/eua-new-hampshire.png',
      historical: false,
      period: '',
      compatibility: 94
    },
    personality: {
      personalityId: 'mises',
      name: 'Ludwig von Mises',
      role: 'Ökonom',
      category: 'economista',
      lifespan: '1881–1973',
      description:
        'Der österreichische Ökonom Mises war ein großer Verteidiger des freien Marktes und wies die Unmöglichkeit rationaler Wirtschaftsrechnung im Sozialismus nach; er wurde zu einer Säule der Österreichischen Schule und zu einer Inspiration des modernen Libertarismus.',
      imagePath: '/personalities/portraits/mises.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Demokratie',
        intensity: 'Stark'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Privat',
        intensity: 'Sehr stark'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 52,
        rightPercent: 48,
        dominantPole: 'Progressiv',
        intensity: 'Ausgeglichen'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'anarquismo-kropotkiniano',
      name: 'Kropotkinscher Anarchismus',
      category: 'Anarchistisch',
      description:
        'Strömung Peter Kropotkins, die gegenseitige Hilfe als Naturgesetz sieht und föderierte Kommunen, die Verbindung von Landwirtschaft und Industrie, eine Wissenschaft im Dienst aller und eine Ethik der Solidarität ohne Staat vorschlägt.',
      longDescription:
        'Strömung Peter Kropotkins, die gegenseitige Hilfe als Naturgesetz sieht und föderierte Kommunen, die Verbindung von Landwirtschaft und Industrie, eine Wissenschaft im Dienst aller und eine Ethik der Solidarität ohne Staat vorschlägt. Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
      phrase:
        'Ich will freie Kommunen, die durch gegenseitige Hilfe föderiert sind und Land und Fabrik verbinden, in denen alles nach Bedarf geteilt wird und es überhaupt keinen Staat gibt.',
      compatibility: 98
    },
    country: {
      countryId: 'rojava',
      name: 'Rojava (Nord- und Ostsyrien)',
      category: 'Demokratisch-egalitärer Konföderalismus',
      description:
        'Rojava, eine autonome Region im Norden Syriens, organisiert sich durch demokratischen Konföderalismus, mit lokaler Selbstverwaltung, Geschlechtergleichheit, ethnischem Pluralismus und Ökologie, inspiriert von den libertären Ideen Abdullah Öcalans.',
      flagPath: '/countries/flags/rojava.png',
      historical: false,
      period: '2012–heute',
      compatibility: 93
    },
    personality: {
      personalityId: 'bakunin',
      name: 'Michail Bakunin',
      role: 'Revolutionär',
      category: 'teorico',
      lifespan: '1814–1876',
      description:
        'Der russische Revolutionär Bakunin war der große Theoretiker des kollektivistischen Anarchismus, stellte sich gegen den Staat und den autoritären Marxismus und verteidigte die spontane soziale Revolution und die freie Föderation von Gemeinschaften und Arbeitern.',
      imagePath: '/personalities/portraits/bakunin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Repräsentation',
        leftPole: 'Demokratie',
        rightPole: 'Autokratie',
        leftPercent: 80,
        rightPercent: 20,
        dominantPole: 'Demokratie',
        intensity: 'Stark'
      },
      {
        axisId: 'economia',
        label: 'Wirtschaft',
        leftPole: 'Öffentlich',
        rightPole: 'Privat',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Öffentlich',
        intensity: 'Stark'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressiv',
        rightPole: 'Traditionalistisch',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Progressiv',
        intensity: 'Stark'
      }
    ]
  }
];


const it: ExampleResult[] = [
  {
    ideology: {
      ideologyId: 'marxismo-leninismo',
      name: 'Marxismo–leninismo',
      category: 'Sinistra radicale',
      description:
        "Ramo rivoluzionario del marxismo che sostiene la conquista del potere da parte di un partito d'avanguardia e la dittatura del proletariato, con economia pianificata e collettivizzazione, base dei regimi comunisti del XX secolo...",
      longDescription:
        "Ramo rivoluzionario del marxismo che sostiene la conquista del potere da parte di un partito d'avanguardia e la dittatura del proletariato, con economia pianificata e collettivizzazione, base dei regimi comunisti del XX secolo. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.",
      phrase:
        "Voglio una società governata da un partito d'avanguardia, con la dittatura del proletariato e un'economia pianificata e collettivizzata.",
      compatibility: 99
    },
    country: {
      countryId: 'cuba',
      name: 'Cuba',
      category: 'Socialismo egualitario a partito unico',
      description:
        "Stato socialista a partito unico dei Caraibi, Cuba mantiene un'economia pianificata, un forte controllo statale e servizi pubblici universali, con il potere centralizzato dalla rivoluzione guidata da Fidel Castro nel 1959.",
      flagPath: '/countries/flags/cuba.gif',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'lenin',
      name: 'Vladimir Lenin',
      role: 'Leader della Rivoluzione russa',
      category: 'politico',
      lifespan: '1870–1924',
      description:
        "Leader della Rivoluzione russa del 1917 e fondatore dell'Unione Sovietica, Lenin teorizzò il partito d'avanguardia, la dittatura del proletariato e l'imperialismo come fase suprema del capitalismo, plasmando il comunismo del Novecento.",
      imagePath: '/personalities/portraits/lenin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Autocrazia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 89,
        rightPercent: 11,
        dominantPole: 'Pubblico',
        intensity: 'Molto forte'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
        leftPercent: 54,
        rightPercent: 46,
        dominantPole: 'Progressista',
        intensity: 'Equilibrato'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-social',
      name: 'Liberalismo sociale',
      category: 'Sinistra',
      description:
        "Ramo che combina libertà individuali con una forte azione statale per garantire benessere, istruzione e sanità, difendendo pari opportunità e sicurezza sociale entro l'economia di mercato.",
      longDescription:
        "Ramo che combina libertà individuali con una forte azione statale per garantire benessere, istruzione e sanità, difendendo pari opportunità e sicurezza sociale entro l'economia di mercato. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.",
      phrase:
        'Voglio una società di libertà individuali sostenute da una forte sicurezza sociale, con lo Stato che garantisce sanità e istruzione per tutti.',
      compatibility: 98
    },
    country: {
      countryId: 'eua-nova-york',
      name: 'New York (Stati Uniti)',
      category: 'Regione finanziaria e cosmopolita',
      description:
        "Centro finanziario e culturale degli Stati Uniti, New York combina una politica liberale e progressista, un'enorme diversità di immigrati, un'economia globalizzata basata sui servizi e un forte peso simbolico nel mondo.",
      flagPath: '/countries/flags/eua-nova-york.png',
      historical: false,
      period: '',
      compatibility: 98
    },
    personality: {
      personalityId: 'justin-trudeau',
      name: 'Justin Trudeau',
      role: 'Ex premier canadese',
      category: 'politico',
      lifespan: '1971–',
      description:
        "Primo ministro del Canada (2015–2025) per il Partito Liberale, Trudeau ha promosso il multiculturalismo, l'accoglienza di immigrati e rifugiati, politiche progressiste di genere e ambiente e uno stile di governo centrista sostenuto da un forte intervento sociale dello Stato.",
      imagePath: '/personalities/portraits/justin-trudeau.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Democrazia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 64,
        rightPercent: 36,
        dominantPole: 'Pubblico',
        intensity: 'Tendente'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
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
      name: 'Terza via',
      category: 'Centro',
      description:
        "Rinnovamento del centrosinistra degli anni Novanta con Blair, Clinton e Giddens, che accetta mercati globalizzati e disciplina fiscale, sostituisce il welfare con l'attivazione al lavoro, è duro sul crimine e sostiene interventi liberali.",
      longDescription:
        "Rinnovamento del centrosinistra degli anni Novanta con Blair, Clinton e Giddens, che accetta mercati globalizzati e disciplina fiscale, sostituisce il welfare con l'attivazione al lavoro, è duro sul crimine e sostiene interventi liberali. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.",
      phrase:
        'Voglio un mercato globalizzato con uno Stato che investa in istruzione, scambi welfare con lavoro e sia duro sul crimine e sulle sue cause.',
      compatibility: 94
    },
    country: {
      countryId: 'inglaterra',
      name: 'Inghilterra (Regno Unito)',
      category: 'Paese costitutivo liberal-conservatore',
      description:
        "Il più grande paese costitutivo del Regno Unito, l'Inghilterra è governata direttamente da Westminster senza un parlamento proprio, con una Chiesa d'Inghilterra stabilita, un servizio sanitario pubblico (NHS), un centro finanziario a Londra, una maggioranza pro-Brexit e un crescente voto populista.",
      flagPath: '/countries/flags/inglaterra.png',
      historical: false,
      period: '',
      compatibility: 93
    },
    personality: {
      personalityId: 'macron',
      name: 'Emmanuel Macron',
      role: 'Presidente della Francia',
      category: 'politico',
      lifespan: '1977–',
      description:
        "Statista francese, Macron è arrivato alla presidenza della Francia come riformatore centrista e liberale, difendendo i mercati, l'integrazione europea e le riforme economiche e cercando di superare la tradizionale divisione tra sinistra e destra.",
      imagePath: '/personalities/portraits/macron.jpg',
      compatibility: 98
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democrazia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 44,
        rightPercent: 56,
        dominantPole: 'Privato',
        intensity: 'Equilibrato'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
        leftPercent: 68,
        rightPercent: 32,
        dominantPole: 'Progressista',
        intensity: 'Tendente'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'alt-lite',
      name: 'Alt-Lite',
      category: 'Destra',
      description:
        "Ramo della destra radicale nazionalista e antiglobalista, che enfatizza l'identità culturale, la critica dell'immigrazione e l'opposizione al politicamente corretto, senza adottare posizioni basate sulla razza.",
      longDescription:
        "Ramo della destra radicale nazionalista e antiglobalista, che enfatizza l'identità culturale, la critica dell'immigrazione e l'opposizione al politicamente corretto, senza adottare posizioni basate sulla razza. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.",
      phrase:
        "Voglio preservare l'identità culturale del mio popolo, con controlli sull'immigrazione e libertà di parola contro il politicamente corretto.",
      compatibility: 97
    },
    country: {
      countryId: 'hungria',
      name: 'Ungheria',
      category: 'Repubblica nazionale illiberale',
      description:
        "Repubblica parlamentare dell'Europa orientale, l'Ungheria è governata secondo la cosiddetta democrazia illiberale, che unisce nazionalismo, conservatorismo cristiano, sovranità rispetto all'Unione Europea e un forte controllo di media e istituzioni.",
      flagPath: '/countries/flags/hungria.gif',
      historical: false,
      period: '',
      compatibility: 89
    },
    personality: {
      personalityId: 'donald-trump',
      name: 'Donald Trump',
      role: '47° presidente USA',
      category: 'politico',
      lifespan: '1946–',
      description:
        'Imprenditore e presidente degli Stati Uniti, Trump guida il populismo nazionalista del movimento MAGA, con protezionismo tariffario, una politica migratoria restrittiva e una retorica antisistema che ha ridefinito la destra.',
      imagePath: '/personalities/portraits/donald-trump.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 39,
        rightPercent: 61,
        dominantPole: 'Autocrazia',
        intensity: 'Tendente'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 25,
        rightPercent: 75,
        dominantPole: 'Privato',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
        leftPercent: 21,
        rightPercent: 79,
        dominantPole: 'Tradizionalista',
        intensity: 'Forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'aceleracionismo-de-direita',
      name: 'Accelerazionismo di destra',
      category: 'Estrema destra',
      description:
        "Corrente che sostiene di accelerare le contraddizioni del sistema con la tecnologia e l'indebolimento delle istituzioni liberali, scommettendo su una rottura con l'ordine esistente per far nascere un nuovo ordine sociale e politico gerarchico.",
      longDescription:
        "Corrente che sostiene di accelerare le contraddizioni del sistema con la tecnologia e l'indebolimento delle istituzioni liberali, scommettendo su una rottura con l'ordine esistente per far nascere un nuovo ordine sociale e politico gerarchico. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.",
      phrase:
        'Voglio accelerare, con tecnologia e mercati senza Stato, il superamento delle istituzioni liberali, perché emerga un nuovo ordine gerarchico.',
      compatibility: 94
    },
    country: {
      countryId: 'hong-kong',
      name: 'Hong Kong (Cina)',
      category: 'Regione tecnocratica e finanziaria',
      description:
        'Centro finanziario globale, Hong Kong è una regione autonoma di forte capitalismo di libero mercato e gestione tecnocratica, la cui ampia autonomia è stata sempre più limitata dal controllo politico della Cina continentale.',
      flagPath: '/countries/flags/hong-kong.png',
      historical: false,
      period: '',
      compatibility: 84
    },
    personality: {
      personalityId: 'curtis-yarvin',
      name: 'Curtis Yarvin',
      role: 'Padre del neoreazionismo',
      category: 'teorico',
      lifespan: '1973–',
      description:
        "Teorico politico noto come Mencius Moldbug, Yarvin ha formulato il neoreazionismo, proponendo di sostituire la democrazia con uno Stato gestito come un'azienda da un sovrano-amministratore, sul modello del neocameralismo.",
      imagePath: '/personalities/portraits/curtis-yarvin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 20,
        rightPercent: 80,
        dominantPole: 'Autocrazia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 22,
        rightPercent: 78,
        dominantPole: 'Privato',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
        leftPercent: 49,
        rightPercent: 51,
        dominantPole: 'Tradizionalista',
        intensity: 'Equilibrato'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'corporativismo',
      name: 'Corporativismo',
      category: 'Terza posizione',
      description:
        "Modello che organizza la società in corporazioni di lavoratori e datori di lavoro integrate nello Stato, cercando l'armonia tra le classi e una cooperazione economica diretta anziché conflitto o libera concorrenza.",
      longDescription:
        "Modello che organizza la società in corporazioni di lavoratori e datori di lavoro integrate nello Stato, cercando l'armonia tra le classi e una cooperazione economica diretta anziché conflitto o libera concorrenza. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.",
      phrase:
        "Voglio una società organizzata in corporazioni di datori di lavoro e lavoratori integrate nello Stato, in un'armonia diretta tra le classi.",
      compatibility: 97
    },
    country: {
      countryId: 'burkina-faso',
      name: 'Burkina Faso',
      category: 'Repubblica militare sovranista e panafricana',
      description:
        "Paese del Sahel governato da una giunta militare guidata da Ibrahim Traoré, che ha sciolto i partiti politici nel 2026, rinviato le elezioni, nazionalizzato le miniere d'oro, lasciato l'ECOWAS e formato l'Alleanza degli Stati del Sahel (AES), con una retorica sovranista e panafricanista ereditata da Sankara.",
      flagPath: '/countries/flags/burkina-faso.png',
      historical: false,
      period: '',
      compatibility: 90
    },
    personality: {
      personalityId: 'plinio-salgado',
      name: 'Plínio Salgado',
      role: 'Leader integralista brasiliano',
      category: 'politico',
      lifespan: '1895–1975',
      description:
        "Leader dell'Integralismo brasiliano, Plínio Salgado creò un movimento nazionalista autoritario di ispirazione cristiana, con il motto Dio, Patria e Famiglia e un'estetica di massa ispirata ai fascismi europei degli anni Trenta.",
      imagePath: '/personalities/portraits/plinio-salgado.jpg',
      compatibility: 96
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 28,
        rightPercent: 72,
        dominantPole: 'Autocrazia',
        intensity: 'Tendente'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 76,
        rightPercent: 24,
        dominantPole: 'Pubblico',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
        leftPercent: 8,
        rightPercent: 92,
        dominantPole: 'Tradizionalista',
        intensity: 'Molto forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'liberalismo-classico',
      name: 'Liberalismo classico',
      category: 'Libertario',
      description:
        'Ramo originario del liberalismo che difende diritti naturali, proprietà, libero mercato e Stato minimo, vedendo la libertà individuale e la stretta limitazione del potere come fondamento di una società giusta.',
      longDescription:
        'Ramo originario del liberalismo che difende diritti naturali, proprietà, libero mercato e Stato minimo, vedendo la libertà individuale e la stretta limitazione del potere come fondamento di una società giusta. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.',
      phrase:
        'Voglio una società di diritti naturali e proprietà sacra, con Stato minimo e libero mercato come fondamento di una vita giusta.',
      compatibility: 97
    },
    country: {
      countryId: 'eua-new-hampshire',
      name: 'New Hampshire (Stati Uniti)',
      category: 'Regione libertaria e fiscale',
      description:
        "Piccolo Stato del nord-est degli Stati Uniti, il New Hampshire è noto per la forte cultura libertaria, le tasse basse, l'assenza di un'imposta statale sul reddito e un motto che esalta la libertà sopra ogni cosa.",
      flagPath: '/countries/flags/eua-new-hampshire.png',
      historical: false,
      period: '',
      compatibility: 94
    },
    personality: {
      personalityId: 'mises',
      name: 'Ludwig von Mises',
      role: 'Economista austriaco',
      category: 'economista',
      lifespan: '1881–1973',
      description:
        "Economista austriaco, Mises fu un grande difensore del libero mercato e dimostrò l'impossibilità di un calcolo economico razionale sotto il socialismo, diventando un pilastro della Scuola austriaca e un'ispirazione per il libertarismo moderno.",
      imagePath: '/personalities/portraits/mises.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 74,
        rightPercent: 26,
        dominantPole: 'Democrazia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Privato',
        intensity: 'Molto forte'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
        leftPercent: 52,
        rightPercent: 48,
        dominantPole: 'Progressista',
        intensity: 'Equilibrato'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'anarquismo-kropotkiniano',
      name: 'Anarchismo kropotkiniano',
      category: 'Anarchico',
      description:
        'Corrente di Pëtr Kropotkin che vede il mutuo soccorso come legge della natura e propone comuni federate, integrazione di agricoltura e industria, scienza al servizio di tutti ed etica della solidarietà senza Stato.',
      longDescription:
        'Corrente di Pëtr Kropotkin che vede il mutuo soccorso come legge della natura e propone comuni federate, integrazione di agricoltura e industria, scienza al servizio di tutti ed etica della solidarietà senza Stato. La compatibilità indica quanto le tue risposte sono vicine a questo profilo.',
      phrase:
        'Voglio comuni libere federate dal mutuo soccorso, che uniscano campo e fabbrica, con tutto condiviso secondo il bisogno e nessuno Stato.',
      compatibility: 98
    },
    country: {
      countryId: 'rojava',
      name: "Rojava (Siria del Nord e dell'Est)",
      category: 'Confederalismo democratico ed egualitario',
      description:
        'Regione autonoma della Siria settentrionale, il Rojava si organizza attraverso il confederalismo democratico, con autogestione locale, parità di genere, pluralismo etnico ed ecologia, ispirato alle idee libertarie di Abdullah Öcalan.',
      flagPath: '/countries/flags/rojava.png',
      historical: false,
      period: '2012–heute',
      compatibility: 93
    },
    personality: {
      personalityId: 'bakunin',
      name: 'Mikhail Bakunin',
      role: 'Anarchico collettivista',
      category: 'teorico',
      lifespan: '1814–1876',
      description:
        "Rivoluzionario russo, Bakunin fu il grande teorico dell'anarchismo collettivista, opponendosi allo Stato e al marxismo autoritario e difendendo la rivoluzione sociale spontanea e la libera federazione di comunità e lavoratori.",
      imagePath: '/personalities/portraits/bakunin.jpg',
      compatibility: 100
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Rappresentanza',
        leftPole: 'Democrazia',
        rightPole: 'Autocrazia',
        leftPercent: 80,
        rightPercent: 20,
        dominantPole: 'Democrazia',
        intensity: 'Forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Pubblico',
        rightPole: 'Privato',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Pubblico',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Morale',
        leftPole: 'Progressista',
        rightPole: 'Tradizionalista',
        leftPercent: 81,
        rightPercent: 19,
        dominantPole: 'Progressista',
        intensity: 'Forte'
      }
    ]
  }
];

export const EXAMPLE_RESULTS: ExampleResult[] = LANG === 'pt' ? pt : LANG === 'es' ? es : LANG === 'de' ? de : LANG === 'it' ? it : en;
