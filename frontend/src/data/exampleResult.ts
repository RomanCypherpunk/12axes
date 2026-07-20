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
      category: 'Esquerda Autoritária',
      description:
        'Vertente revolucionária do marxismo que defende a tomada do poder por um partido de vanguarda e a ditadura do proletariado, com economia planificada e coletivização, servindo de base aos regimes comunistas do século XX.',
      longDescription:
        'Vertente revolucionária do marxismo que defende a tomada do poder por um partido de vanguarda e a ditadura do proletariado, com economia planificada e coletivização, servindo de base aos regimes comunistas do século XX.',
      compatibility: 91
    },
    country: {
      countryId: 'uniao-sovietica-urss',
      name: 'União Soviética (URSS)',
      category: 'Socialismo estatal autoritário',
      description:
        'Primeiro Estado socialista do mundo, a URSS foi uma federação de partido único com economia planificada e poder centralizado, tornando-se superpotência global e polo do comunismo durante a Guerra Fria.',
      flagPath: '/countries/flags/uniao-sovietica-urss.png',
      historical: true,
      period: '1922–1991',
      compatibility: 88
    },
    personality: {
      personalityId: 'lenin',
      name: 'Vladimir Lênin',
      role: 'Revolucionário',
      lifespan: '1870–1924',
      description:
        'Líder da Revolução Russa de 1917 e fundador da União Soviética, Lênin teorizou o partido de vanguarda, a ditadura do proletariado e o imperialismo como fase final do capitalismo, moldando o comunismo do século XX.',
      imagePath: '/personalities/portraits/lenin.jpg',
      compatibility: 93
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
        leftPercent: 96,
        rightPercent: 4,
        dominantPole: 'Público',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 46,
        rightPercent: 54,
        dominantPole: 'Tradicionalista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'socialismo',
      name: 'Socialismo',
      category: 'Esquerda',
      description:
        'Doutrina que defende a propriedade social ou coletiva dos meios de produção e a distribuição mais igualitária da riqueza, buscando superar a exploração do capitalismo por cooperação e planejamento econômico.',
      longDescription:
        'Doutrina que defende a propriedade social ou coletiva dos meios de produção e a distribuição mais igualitária da riqueza, buscando superar a exploração do capitalismo por cooperação e planejamento econômico.',
      compatibility: 89
    },
    country: {
      countryId: 'suecia',
      name: 'Suécia',
      category: 'Social-democracia nórdica',
      description:
        'Monarquia parlamentar nórdica, a Suécia é referência de social-democracia, com amplo Estado de bem-estar, altos impostos, forte igualdade social e economia de mercado aberta e inovadora combinada a valores progressistas.',
      flagPath: '/countries/flags/suecia.gif',
      historical: false,
      period: '',
      compatibility: 76
    },
    personality: {
      personalityId: 'karl-marx',
      name: 'Karl Marx',
      role: 'Filósofo e economista',
      lifespan: '1818–1883',
      description:
        'Filósofo e economista alemão, Marx criou o materialismo histórico e a crítica do capitalismo, analisando a luta de classes e a exploração do trabalho, e tornou-se a maior referência do socialismo e do comunismo.',
      imagePath: '/personalities/portraits/karl-marx.jpg',
      compatibility: 94
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 89,
        rightPercent: 11,
        dominantPole: 'Democracia',
        intensity: 'Muito forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 96,
        rightPercent: 4,
        dominantPole: 'Público',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 88,
        rightPercent: 12,
        dominantPole: 'Progressista',
        intensity: 'Muito forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'centrismo',
      name: 'Centrismo',
      category: 'Centro',
      description:
        'Posição política que busca o equilíbrio entre esquerda e direita, valorizando moderação, pragmatismo e consenso, e combinando elementos de diferentes correntes para evitar extremos e favorecer reformas graduais.',
      longDescription:
        'Posição política que busca o equilíbrio entre esquerda e direita, valorizando moderação, pragmatismo e consenso, e combinando elementos de diferentes correntes para evitar extremos e favorecer reformas graduais.',
      compatibility: 85
    },
    country: {
      countryId: 'franca',
      name: 'França',
      category: 'Democracia social de mercado',
      description:
        'República semipresidencialista europeia, a França combina forte tradição republicana e laica, Estado social robusto, economia mista e destacado papel diplomático, cultural e militar na União Europeia e no mundo.',
      flagPath: '/countries/flags/franca.gif',
      historical: false,
      period: '',
      compatibility: 81
    },
    personality: {
      personalityId: 'macron',
      name: 'Emmanuel Macron',
      role: 'Estadista',
      lifespan: '1977–',
      description:
        'Estadista francês, Macron chegou à presidência da França como reformador centrista e liberal, defendendo o mercado, a integração europeia e reformas econômicas, buscando superar a divisão tradicional entre esquerda e direita.',
      imagePath: '/personalities/portraits/macron.jpg',
      compatibility: 90
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 70,
        rightPercent: 30,
        dominantPole: 'Democracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 63,
        rightPercent: 37,
        dominantPole: 'Público',
        intensity: 'Inclinado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 65,
        rightPercent: 35,
        dominantPole: 'Progressista',
        intensity: 'Inclinado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neoconservadorismo',
      name: 'Neoconservadorismo',
      category: 'Direita',
      description:
        'Corrente da direita que une livre mercado, valores tradicionais e política externa intervencionista, defendendo a promoção da democracia e dos interesses nacionais pela força militar e liderança global.',
      longDescription:
        'Corrente da direita que une livre mercado, valores tradicionais e política externa intervencionista, defendendo a promoção da democracia e dos interesses nacionais pela força militar e liderança global.',
      compatibility: 90
    },
    country: {
      countryId: 'eua-texas',
      name: 'Estados Unidos (Texas)',
      category: 'Região norte-americana de livre mercado conservador',
      description:
        'Segundo maior estado dos Estados Unidos, o Texas destaca-se pelo conservadorismo, pela cultura de forte liberdade individual, por baixa tributação e por uma economia de mercado dinâmica ligada à energia e à indústria.',
      flagPath: '/countries/flags/eua-texas.png',
      historical: false,
      period: '',
      compatibility: 79
    },
    personality: {
      personalityId: 'jair-bolsonaro',
      name: 'Jair Bolsonaro',
      role: 'Político',
      lifespan: '1955–',
      description:
        'Político brasileiro, Bolsonaro chegou à presidência liderando a direita nacionalista e conservadora, com pautas de segurança, valores tradicionais, liberalismo econômico e forte retórica anti-establishment.',
      imagePath: '/personalities/portraits/jair-bolsonaro.jpg',
      compatibility: 95
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 61,
        rightPercent: 39,
        dominantPole: 'Democracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 30,
        rightPercent: 70,
        dominantPole: 'Privado',
        intensity: 'Inclinado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 15,
        rightPercent: 85,
        dominantPole: 'Tradicionalista',
        intensity: 'Forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'nacionalismo',
      name: 'Nacionalismo',
      category: 'Centro',
      description:
        'Ideologia que coloca a nação como valor central, defendendo sua soberania, unidade e identidade, e priorizando os interesses do povo e do Estado nacional diante de influências externas e do globalismo.',
      longDescription:
        'Ideologia que coloca a nação como valor central, defendendo sua soberania, unidade e identidade, e priorizando os interesses do povo e do Estado nacional diante de influências externas e do globalismo.',
      compatibility: 83
    },
    country: {
      countryId: 'brasil-era-vargas',
      name: 'Brasil (Era Vargas)',
      category: 'Estado nacional-trabalhista',
      description:
        'Sob Vargas, o Brasil viveu um regime nacionalista e desenvolvimentista que promoveu industrialização dirigida pelo Estado, legislação trabalhista e centralização do poder, fundando as bases do trabalhismo brasileiro.',
      flagPath: '/countries/flags/brasil-era-vargas.png',
      historical: true,
      period: '1930–1945',
      compatibility: 78
    },
    personality: {
      personalityId: 'getulio-vargas',
      name: 'Getúlio Vargas',
      role: 'Estadista',
      lifespan: '1882–1954',
      description:
        'Estadista brasileiro, Vargas moldou o Brasil moderno com nacionalismo desenvolvimentista, industrialização dirigida pelo Estado e legislação trabalhista, fundando o trabalhismo e marcando décadas da política nacional.',
      imagePath: '/personalities/portraits/getulio-vargas.jpg',
      compatibility: 80
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 59,
        rightPercent: 41,
        dominantPole: 'Democracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 60,
        rightPercent: 40,
        dominantPole: 'Público',
        intensity: 'Inclinado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 24,
        rightPercent: 76,
        dominantPole: 'Tradicionalista',
        intensity: 'Forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'capitalismo',
      name: 'Capitalismo',
      category: 'Centro-Direita',
      description:
        'Sistema econômico baseado na propriedade privada, no livre mercado e na busca do lucro, em que a produção e os preços são regulados pela concorrência e pela oferta e demanda, com iniciativa individual como motor.',
      longDescription:
        'Sistema econômico baseado na propriedade privada, no livre mercado e na busca do lucro, em que a produção e os preços são regulados pela concorrência e pela oferta e demanda, com iniciativa individual como motor.',
      compatibility: 87
    },
    country: {
      countryId: 'eua-texas',
      name: 'Estados Unidos (Texas)',
      category: 'Região norte-americana de livre mercado conservador',
      description:
        'Segundo maior estado dos Estados Unidos, o Texas destaca-se pelo conservadorismo, pela cultura de forte liberdade individual, por baixa tributação e por uma economia de mercado dinâmica ligada à energia e à indústria.',
      flagPath: '/countries/flags/eua-texas.png',
      historical: false,
      period: '',
      compatibility: 77
    },
    personality: {
      personalityId: 'elon-musk',
      name: 'Elon Musk',
      role: 'Empresário',
      lifespan: '1971–',
      description:
        'Empresário e bilionário, Musk lidera empresas de tecnologia como Tesla e SpaceX e defende o aceleracionismo tecnológico, a colonização de Marte e ideias libertárias, influenciando o debate público global.',
      imagePath: '/personalities/portraits/elon-musk.jpg',
      compatibility: 91
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 61,
        rightPercent: 39,
        dominantPole: 'Democracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 19,
        rightPercent: 81,
        dominantPole: 'Privado',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 48,
        rightPercent: 52,
        dominantPole: 'Tradicionalista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'austrolibertarianismo',
      name: 'Austrolibertarianismo',
      category: 'Direita Libertária',
      description:
        'Corrente que une o libertarianismo à Escola Austríaca de economia, defendendo livre mercado, moeda sólida e crítica à intervenção estatal, com base na ação humana individual e na ordem espontânea do mercado.',
      longDescription:
        'Corrente que une o libertarianismo à Escola Austríaca de economia, defendendo livre mercado, moeda sólida e crítica à intervenção estatal, com base na ação humana individual e na ordem espontânea do mercado.',
      compatibility: 90
    },
    country: {
      countryId: 'liechtenstein',
      name: 'Liechtenstein',
      category: 'Monarquia constitucional libertária',
      description:
        'Minúsculo principado europeu, o Liechtenstein é uma monarquia constitucional próspera, com forte autonomia local, economia liberal baseada em finanças e indústria e um dos maiores níveis de renda por habitante do mundo.',
      flagPath: '/countries/flags/liechtenstein.png',
      historical: false,
      period: '',
      compatibility: 82
    },
    personality: {
      personalityId: 'mises',
      name: 'Ludwig von Mises',
      role: 'Economista',
      lifespan: '1881–1973',
      description:
        'Economista austríaco, Mises foi grande defensor do livre mercado e mostrou a impossibilidade do cálculo econômico racional no socialismo, tornando-se pilar da Escola Austríaca e inspiração do libertarianismo moderno.',
      imagePath: '/personalities/portraits/mises.jpg',
      compatibility: 88
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
        leftPercent: 5,
        rightPercent: 95,
        dominantPole: 'Privado',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 50,
        rightPercent: 50,
        dominantPole: 'Progressista',
        intensity: 'Equilibrado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'fascismo',
      name: 'Fascismo',
      category: 'Direita Autoritária',
      description:
        'Ideologia totalitária de ultranacionalismo que exalta o Estado forte, o culto ao líder, o militarismo e a mobilização de massas, suprimindo oposição e subordinando a economia corporativa aos objetivos nacionais.',
      longDescription:
        'Ideologia totalitária de ultranacionalismo que exalta o Estado forte, o culto ao líder, o militarismo e a mobilização de massas, suprimindo oposição e subordinando a economia corporativa aos objetivos nacionais.',
      compatibility: 81
    },
    country: {
      countryId: 'italia-fascista-mussolini',
      name: 'Itália Fascista (Mussolini)',
      category: 'Fascismo nacional-autoritário',
      description:
        'Berço do fascismo, a Itália de Mussolini foi uma ditadura totalitária que fundiu nacionalismo, culto ao líder, Estado corporativo e militarismo, suprimindo a oposição e buscando expansão imperial pela força.',
      flagPath: '/countries/flags/italia-fascista-mussolini.png',
      historical: true,
      period: '1922–1943',
      compatibility: 92
    },
    personality: {
      personalityId: 'mussolini',
      name: 'Benito Mussolini',
      role: 'Ditador',
      lifespan: '1883–1945',
      description:
        'Criador do fascismo, Mussolini governou a Itália como ditadura totalitária, fundindo nacionalismo, Estado corporativo, culto ao líder e militarismo expansionista, servindo de modelo a regimes autoritários europeus.',
      imagePath: '/personalities/portraits/mussolini.jpg',
      compatibility: 99
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Autocracia',
        intensity: 'Muito forte'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 68,
        rightPercent: 32,
        dominantPole: 'Público',
        intensity: 'Inclinado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 4,
        rightPercent: 96,
        dominantPole: 'Tradicionalista',
        intensity: 'Muito forte'
      }
    ]
  }
];

const en: ExampleResult[] = [
  {
    ideology: {
      ideologyId: 'marxismo-leninismo',
      name: 'Marxism–Leninism',
      category: 'Authoritarian Left',
      description:
        'Revolutionary branch of Marxism that advocates the seizure of power by a vanguard party and the dictatorship of the proletariat, with a planned economy and collectivization, serving as the foundation of the communist regimes of the 20th century.',
      longDescription:
        'Revolutionary branch of Marxism that advocates the seizure of power by a vanguard party and the dictatorship of the proletariat, with a planned economy and collectivization, serving as the foundation of the communist regimes of the 20th century.',
      compatibility: 91
    },
    country: {
      countryId: 'uniao-sovietica-urss',
      name: 'Soviet Union (USSR)',
      category: 'Authoritarian state socialism',
      description:
        "The world's first socialist state, the USSR was a single-party federation with a planned economy and centralized power, becoming a global superpower and the pole of communism during the Cold War.",
      flagPath: '/countries/flags/uniao-sovietica-urss.png',
      historical: true,
      period: '1922–1991',
      compatibility: 88
    },
    personality: {
      personalityId: 'lenin',
      name: 'Vladimir Lenin',
      role: 'Revolutionary',
      lifespan: '1870–1924',
      description:
        'Leader of the 1917 Russian Revolution and founder of the Soviet Union, Lenin theorized the vanguard party, the dictatorship of the proletariat, and imperialism as the final stage of capitalism, shaping 20th-century communism.',
      imagePath: '/personalities/portraits/lenin.jpg',
      compatibility: 93
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
        leftPercent: 96,
        rightPercent: 4,
        dominantPole: 'Public',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 46,
        rightPercent: 54,
        dominantPole: 'Traditionalist',
        intensity: 'Balanced'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'socialismo',
      name: 'Socialism',
      category: 'Left',
      description:
        'Doctrine that advocates social or collective ownership of the means of production and a more egalitarian distribution of wealth, seeking to overcome capitalist exploitation through cooperation and economic planning.',
      longDescription:
        'Doctrine that advocates social or collective ownership of the means of production and a more egalitarian distribution of wealth, seeking to overcome capitalist exploitation through cooperation and economic planning.',
      compatibility: 89
    },
    country: {
      countryId: 'suecia',
      name: 'Sweden',
      category: 'Nordic social democracy',
      description:
        'A Nordic parliamentary monarchy, Sweden is a benchmark of social democracy, with a broad welfare state, high taxes, strong social equality, and an open, innovative market economy combined with progressive values.',
      flagPath: '/countries/flags/suecia.gif',
      historical: false,
      period: '',
      compatibility: 76
    },
    personality: {
      personalityId: 'karl-marx',
      name: 'Karl Marx',
      role: 'Philosopher and economist',
      lifespan: '1818–1883',
      description:
        'A German philosopher and economist, Marx created historical materialism and the critique of capitalism, analyzing class struggle and the exploitation of labor, and became the greatest reference of socialism and communism.',
      imagePath: '/personalities/portraits/karl-marx.jpg',
      compatibility: 94
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 89,
        rightPercent: 11,
        dominantPole: 'Democracy',
        intensity: 'Very strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 96,
        rightPercent: 4,
        dominantPole: 'Public',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 88,
        rightPercent: 12,
        dominantPole: 'Progressive',
        intensity: 'Very strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'centrismo',
      name: 'Centrism',
      category: 'Center',
      description:
        'Political position that seeks balance between left and right, valuing moderation, pragmatism, and consensus, and combining elements of different currents to avoid extremes and favor gradual reforms.',
      longDescription:
        'Political position that seeks balance between left and right, valuing moderation, pragmatism, and consensus, and combining elements of different currents to avoid extremes and favor gradual reforms.',
      compatibility: 85
    },
    country: {
      countryId: 'franca',
      name: 'France',
      category: 'Social market democracy',
      description:
        'A European semi-presidential republic, France combines a strong republican and secular tradition, a robust welfare state, a mixed economy, and a prominent diplomatic, cultural, and military role in the European Union and the world.',
      flagPath: '/countries/flags/franca.gif',
      historical: false,
      period: '',
      compatibility: 81
    },
    personality: {
      personalityId: 'macron',
      name: 'Emmanuel Macron',
      role: 'Statesman',
      lifespan: '1977–',
      description:
        'A French statesman, Macron reached France\'s presidency as a centrist, liberal reformer, defending markets, European integration, and economic reforms, seeking to overcome the traditional divide between left and right.',
      imagePath: '/personalities/portraits/macron.jpg',
      compatibility: 90
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 70,
        rightPercent: 30,
        dominantPole: 'Democracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 63,
        rightPercent: 37,
        dominantPole: 'Public',
        intensity: 'Leaning'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 65,
        rightPercent: 35,
        dominantPole: 'Progressive',
        intensity: 'Leaning'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neoconservadorismo',
      name: 'Neoconservatism',
      category: 'Right',
      description:
        'Right-wing current that unites free markets, traditional values, and an interventionist foreign policy, advocating the promotion of democracy and national interests through military force and global leadership.',
      longDescription:
        'Right-wing current that unites free markets, traditional values, and an interventionist foreign policy, advocating the promotion of democracy and national interests through military force and global leadership.',
      compatibility: 90
    },
    country: {
      countryId: 'eua-texas',
      name: 'United States (Texas)',
      category: 'Conservative free-market American region',
      description:
        'The second-largest US state, Texas stands out for its conservatism, its culture of strong individual freedom, low taxation, and a dynamic market economy tied to energy and industry.',
      flagPath: '/countries/flags/eua-texas.png',
      historical: false,
      period: '',
      compatibility: 79
    },
    personality: {
      personalityId: 'jair-bolsonaro',
      name: 'Jair Bolsonaro',
      role: 'Politician',
      lifespan: '1955–',
      description:
        'A Brazilian politician, Bolsonaro reached the presidency leading the nationalist, conservative right, with agendas of security, traditional values, economic liberalism, and strong anti-establishment rhetoric.',
      imagePath: '/personalities/portraits/jair-bolsonaro.jpg',
      compatibility: 95
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 61,
        rightPercent: 39,
        dominantPole: 'Democracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 30,
        rightPercent: 70,
        dominantPole: 'Private',
        intensity: 'Leaning'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 15,
        rightPercent: 85,
        dominantPole: 'Traditionalist',
        intensity: 'Strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'nacionalismo',
      name: 'Nationalism',
      category: 'Center',
      description:
        'Ideology that places the nation as the central value, defending its sovereignty, unity, and identity, and prioritizing the interests of the people and the nation-state over external influences and globalism.',
      longDescription:
        'Ideology that places the nation as the central value, defending its sovereignty, unity, and identity, and prioritizing the interests of the people and the nation-state over external influences and globalism.',
      compatibility: 83
    },
    country: {
      countryId: 'brasil-era-vargas',
      name: 'Brazil (Vargas Era)',
      category: 'National-labourist state',
      description:
        'Under Vargas, Brazil experienced a nationalist, developmentalist regime that promoted state-directed industrialization, labor legislation, and the centralization of power, laying the foundations of Brazilian labourism.',
      flagPath: '/countries/flags/brasil-era-vargas.png',
      historical: true,
      period: '1930–1945',
      compatibility: 78
    },
    personality: {
      personalityId: 'getulio-vargas',
      name: 'Getúlio Vargas',
      role: 'Statesman',
      lifespan: '1882–1954',
      description:
        'A Brazilian statesman, Vargas shaped modern Brazil with developmentalist nationalism, state-directed industrialization, and labor legislation, founding Brazilian labourism and marking decades of national politics.',
      imagePath: '/personalities/portraits/getulio-vargas.jpg',
      compatibility: 80
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 59,
        rightPercent: 41,
        dominantPole: 'Democracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 60,
        rightPercent: 40,
        dominantPole: 'Public',
        intensity: 'Leaning'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 24,
        rightPercent: 76,
        dominantPole: 'Traditionalist',
        intensity: 'Strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'capitalismo',
      name: 'Capitalism',
      category: 'Center-Right',
      description:
        'Economic system based on private property, free markets, and the pursuit of profit, in which production and prices are regulated by competition and supply and demand, with individual initiative as its engine.',
      longDescription:
        'Economic system based on private property, free markets, and the pursuit of profit, in which production and prices are regulated by competition and supply and demand, with individual initiative as its engine.',
      compatibility: 87
    },
    country: {
      countryId: 'eua-texas',
      name: 'United States (Texas)',
      category: 'Conservative free-market American region',
      description:
        'The second-largest US state, Texas stands out for its conservatism, its culture of strong individual freedom, low taxation, and a dynamic market economy tied to energy and industry.',
      flagPath: '/countries/flags/eua-texas.png',
      historical: false,
      period: '',
      compatibility: 77
    },
    personality: {
      personalityId: 'elon-musk',
      name: 'Elon Musk',
      role: 'Entrepreneur',
      lifespan: '1971–',
      description:
        'An entrepreneur and billionaire, Musk leads technology companies such as Tesla and SpaceX and champions technological accelerationism, the colonization of Mars, and libertarian ideas, influencing the global public debate.',
      imagePath: '/personalities/portraits/elon-musk.jpg',
      compatibility: 91
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 61,
        rightPercent: 39,
        dominantPole: 'Democracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 19,
        rightPercent: 81,
        dominantPole: 'Private',
        intensity: 'Strong'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 48,
        rightPercent: 52,
        dominantPole: 'Traditionalist',
        intensity: 'Balanced'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'austrolibertarianismo',
      name: 'Austro-Libertarianism',
      category: 'Libertarian Right',
      description:
        'Current that unites libertarianism with the Austrian School of economics, defending free markets, sound money, and criticism of state intervention, based on individual human action and the spontaneous order of the market.',
      longDescription:
        'Current that unites libertarianism with the Austrian School of economics, defending free markets, sound money, and criticism of state intervention, based on individual human action and the spontaneous order of the market.',
      compatibility: 90
    },
    country: {
      countryId: 'liechtenstein',
      name: 'Liechtenstein',
      category: 'Libertarian constitutional monarchy',
      description:
        'A tiny European principality, Liechtenstein is a prosperous constitutional monarchy, with strong local autonomy, a liberal economy based on finance and industry, and one of the highest income levels per capita in the world.',
      flagPath: '/countries/flags/liechtenstein.png',
      historical: false,
      period: '',
      compatibility: 82
    },
    personality: {
      personalityId: 'mises',
      name: 'Ludwig von Mises',
      role: 'Economist',
      lifespan: '1881–1973',
      description:
        'An Austrian economist, Mises was a great defender of the free market and demonstrated the impossibility of rational economic calculation under socialism, becoming a pillar of the Austrian School and an inspiration for modern libertarianism.',
      imagePath: '/personalities/portraits/mises.jpg',
      compatibility: 88
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
        leftPercent: 5,
        rightPercent: 95,
        dominantPole: 'Private',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 50,
        rightPercent: 50,
        dominantPole: 'Progressive',
        intensity: 'Balanced'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'fascismo',
      name: 'Fascism',
      category: 'Authoritarian Right',
      description:
        'Totalitarian ideology of ultranationalism that exalts the strong state, the cult of the leader, militarism, and mass mobilization, suppressing opposition and subordinating the corporatist economy to national goals.',
      longDescription:
        'Totalitarian ideology of ultranationalism that exalts the strong state, the cult of the leader, militarism, and mass mobilization, suppressing opposition and subordinating the corporatist economy to national goals.',
      compatibility: 81
    },
    country: {
      countryId: 'italia-fascista-mussolini',
      name: 'Fascist Italy (Mussolini)',
      category: 'National-authoritarian fascism',
      description:
        "The birthplace of fascism, Mussolini's Italy was a totalitarian dictatorship that fused nationalism, a cult of the leader, a corporatist state, and militarism, suppressing opposition and seeking imperial expansion by force.",
      flagPath: '/countries/flags/italia-fascista-mussolini.png',
      historical: true,
      period: '1922–1943',
      compatibility: 92
    },
    personality: {
      personalityId: 'mussolini',
      name: 'Benito Mussolini',
      role: 'Dictator',
      lifespan: '1883–1945',
      description:
        'The creator of fascism, Mussolini ruled Italy as a totalitarian dictatorship, fusing nationalism, a corporatist state, a cult of the leader, and expansionist militarism, serving as a model for European authoritarian regimes.',
      imagePath: '/personalities/portraits/mussolini.jpg',
      compatibility: 99
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Autocracy',
        intensity: 'Very strong'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 68,
        rightPercent: 32,
        dominantPole: 'Public',
        intensity: 'Leaning'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 4,
        rightPercent: 96,
        dominantPole: 'Traditionalist',
        intensity: 'Very strong'
      }
    ]
  }
];

export const EXAMPLE_RESULTS: ExampleResult[] = LANG === 'en' ? en : pt;
