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
      countryId: 'estados-unidos',
      name: 'Estados Unidos',
      category: 'República federal liberal',
      description:
        'Potência global e república federativa presidencialista, os Estados Unidos combinam forte tradição liberal, economia de mercado dinâmica, inovação tecnológica e um sistema bipartidário que polariza a vida política nacional.',
      flagPath: '/countries/flags/estados-unidos.gif',
      historical: false,
      period: '',
      compatibility: 83
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
      ideologyId: 'conservadorismo-cristao',
      name: 'Conservadorismo Cristão',
      category: 'Direita',
      description:
        'Vertente que fundamenta a política na moral e na tradição cristãs, defendendo família, vida e valores religiosos dentro da democracia, com ênfase na preservação dos costumes e da herança cultural do povo.',
      longDescription:
        'Vertente que fundamenta a política na moral e na tradição cristãs, defendendo família, vida e valores religiosos dentro da democracia, com ênfase na preservação dos costumes e da herança cultural do povo.',
      compatibility: 84
    },
    country: {
      countryId: 'brasil-regime-militar',
      name: 'Brasil do Regime Militar',
      category: 'Ditadura desenvolvimentista',
      description:
        'Regime instaurado em 1964, combinou repressão política, censura e órgãos de segurança com desenvolvimentismo estatal, grandes obras, reserva de mercado e moralismo conservador durante a Guerra Fria.',
      flagPath: '/countries/flags/brasil.gif',
      historical: true,
      period: '1964–1985',
      compatibility: 75
    },
    personality: {
      personalityId: 'jair-bolsonaro',
      name: 'Jair Bolsonaro',
      role: 'Político',
      lifespan: '1955–',
      description:
        'Político brasileiro, Bolsonaro chegou à presidência liderando a direita nacionalista e conservadora, com pautas de segurança, valores tradicionais, liberalismo econômico e forte retórica anti-establishment.',
      imagePath: '/personalities/portraits/jair-bolsonaro.jpg',
      compatibility: 84
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 66,
        rightPercent: 34,
        dominantPole: 'Democracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 49,
        rightPercent: 51,
        dominantPole: 'Privado',
        intensity: 'Equilibrado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Tradicionalista',
        intensity: 'Muito forte'
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
  },
  {
    ideology: {
      ideologyId: 'libertarianismo-hoppeano',
      name: 'Libertarianismo Hoppeano',
      category: 'Direita Libertária',
      description:
        'Corrente ligada a Hans-Hermann Hoppe que une anarcocapitalismo, propriedade privada absoluta e crítica à democracia, defendendo ordens sociais baseadas em contrato, exclusão voluntária e autoridade privada.',
      longDescription:
        'Corrente ligada a Hans-Hermann Hoppe que une anarcocapitalismo, propriedade privada absoluta e crítica à democracia, defendendo ordens sociais baseadas em contrato, exclusão voluntária e autoridade privada.',
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
      compatibility: 80
    },
    personality: {
      personalityId: 'hoppe',
      name: 'Hans-Hermann Hoppe',
      role: 'Economista',
      lifespan: '1949–',
      description:
        'Economista alemão, Hoppe radicalizou o anarcocapitalismo, defendendo a propriedade privada absoluta e criticando a democracia como sistema que corrói a liberdade, propondo ordens sociais baseadas em contrato voluntário.',
      imagePath: '/personalities/portraits/hoppe.jpg',
      compatibility: 95
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 30,
        rightPercent: 70,
        dominantPole: 'Autocracia',
        intensity: 'Inclinado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 3,
        rightPercent: 97,
        dominantPole: 'Privado',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Tradicionalista',
        intensity: 'Muito forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neoliberalismo',
      name: 'Neoliberalismo',
      category: 'Centro-Direita',
      description:
        'Corrente que defende livre mercado, desregulamentação, privatizações e disciplina fiscal, reduzindo o papel econômico do Estado e confiando na concorrência e na estabilidade monetária como motores da prosperidade.',
      longDescription:
        'Corrente que defende livre mercado, desregulamentação, privatizações e disciplina fiscal, reduzindo o papel econômico do Estado e confiando na concorrência e na estabilidade monetária como motores da prosperidade.',
      compatibility: 88
    },
    country: {
      countryId: 'chile',
      name: 'Chile',
      category: 'Democracia progressista latino-americana',
      description:
        'República presidencialista sul-americana, o Chile combina democracia estável, economia de mercado aberta e forte pauta social e progressista, herança do processo de redemocratização após a ditadura militar de Pinochet.',
      flagPath: '/countries/flags/chile.gif',
      historical: false,
      period: '',
      compatibility: 79
    },
    personality: {
      personalityId: 'milton-friedman',
      name: 'Milton Friedman',
      role: 'Economista',
      lifespan: '1912–2006',
      description:
        'Economista norte-americano, Friedman liderou o neoliberalismo e o monetarismo, defendendo o livre mercado, a estabilidade monetária e a redução do Estado como condições essenciais da liberdade e da prosperidade.',
      imagePath: '/personalities/portraits/milton-friedman.jpg',
      compatibility: 97
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
        leftPercent: 23,
        rightPercent: 77,
        dominantPole: 'Privado',
        intensity: 'Forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 36,
        rightPercent: 64,
        dominantPole: 'Tradicionalista',
        intensity: 'Inclinado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'monarquismo-constitucional',
      name: 'Monarquismo Constitucional',
      category: 'Centro',
      description:
        'Defesa da monarquia como símbolo de unidade e continuidade, com o rei submetido à constituição e ao parlamento, unindo tradição e estabilidade institucional à democracia representativa e ao Estado de direito.',
      longDescription:
        'Defesa da monarquia como símbolo de unidade e continuidade, com o rei submetido à constituição e ao parlamento, unindo tradição e estabilidade institucional à democracia representativa e ao Estado de direito.',
      compatibility: 85
    },
    country: {
      countryId: 'imperio-do-brasil',
      name: 'Império do Brasil',
      category: 'Monarquia constitucional histórica',
      description:
        'Único império das Américas por longo período, o Brasil imperial foi uma monarquia parlamentar sob Pedro I e Pedro II, marcada por estabilidade política, economia agrária escravista e forte centralização do Estado.',
      flagPath: '/countries/flags/imperio-do-brasil.png',
      historical: true,
      period: '1822–1889',
      compatibility: 62
    },
    personality: {
      personalityId: 'dom-pedro-ii',
      name: 'Dom Pedro II',
      role: 'Imperador',
      lifespan: '1825–1891',
      description:
        'Segundo imperador do Brasil, Dom Pedro II governou como monarca constitucional, valorizando parlamentarismo, estabilidade institucional, ciência, educação e abolição gradual, preservando a unidade nacional sob poder moderador.',
      imagePath: '/personalities/portraits/dom-pedro-segundo.jpg',
      compatibility: 85
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 41,
        rightPercent: 59,
        dominantPole: 'Autocracia',
        intensity: 'Equilibrado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 43,
        rightPercent: 57,
        dominantPole: 'Privado',
        intensity: 'Equilibrado'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 18,
        rightPercent: 82,
        dominantPole: 'Tradicionalista',
        intensity: 'Muito forte'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'socialismo-anticolonial',
      name: 'Socialismo Anticolonial',
      category: 'Esquerda',
      description:
        'Corrente socialista nascida das lutas de libertação nacional na África, Ásia e América Latina, defende soberania econômica, nacionalização dos recursos, não alinhamento entre as potências e solidariedade dos povos do Sul global contra o imperialismo.',
      longDescription:
        'Corrente socialista nascida das lutas de libertação nacional na África, Ásia e América Latina, defende soberania econômica, nacionalização dos recursos, não alinhamento entre as potências e solidariedade dos povos do Sul global contra o imperialismo.',
      compatibility: 93
    },
    country: {
      countryId: 'burkina-faso-de-sankara',
      name: 'Burkina Faso de Sankara',
      category: 'Socialismo anticolonial revolucionário',
      description:
        'Sob Thomas Sankara, Burkina Faso combinou autossuficiência alimentar, vacinação e alfabetização em massa, emancipação feminina, rejeição da dívida externa e ruptura frontal com o neocolonialismo francês.',
      flagPath: '/countries/flags/burkina-faso-de-sankara.png',
      historical: true,
      period: '1983–1987',
      compatibility: 93
    },
    personality: {
      personalityId: 'thomas-sankara',
      name: 'Thomas Sankara',
      role: 'Revolucionário',
      lifespan: '1949–1987',
      description:
        'Revolucionário de Burkina Faso, Sankara liderou um governo marxista e pan-africanista que promoveu autossuficiência, direitos das mulheres e reformas sociais radicais, tornando-se ícone anti-imperialista da África.',
      imagePath: '/personalities/portraits/thomas-sankara.png',
      compatibility: 93
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 50,
        rightPercent: 50,
        dominantPole: 'Autocracia',
        intensity: 'Equilibrado'
      },
      {
        axisId: 'economia',
        label: 'Economia',
        leftPole: 'Público',
        rightPole: 'Privado',
        leftPercent: 93,
        rightPercent: 7,
        dominantPole: 'Público',
        intensity: 'Muito forte'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressista',
        rightPole: 'Tradicionalista',
        leftPercent: 36,
        rightPercent: 64,
        dominantPole: 'Tradicionalista',
        intensity: 'Inclinado'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neorreacionarismo',
      name: 'Neorreacionarismo',
      category: 'Direita Autoritária',
      description:
        'Corrente que rejeita a democracia e o igualitarismo modernos e propõe substituí-los por governos hierárquicos e eficientes, geridos como empresas por um soberano, combinando tradicionalismo e tecnologia.',
      longDescription:
        'Corrente que rejeita a democracia e o igualitarismo modernos e propõe substituí-los por governos hierárquicos e eficientes, geridos como empresas por um soberano, combinando tradicionalismo e tecnologia.',
      compatibility: 97
    },
    country: {
      countryId: 'singapura',
      name: 'Singapura',
      category: 'Tecnocracia liberal-autoritativa',
      description:
        'Cidade-Estado asiática, Singapura é uma república parlamentarista dominada por um único partido, combinando capitalismo aberto, gestão tecnocrática eficiente, ordem rígida e liberdades políticas limitadas em nome do progresso.',
      flagPath: '/countries/flags/singapura.gif',
      historical: false,
      period: '',
      compatibility: 62
    },
    personality: {
      personalityId: 'curtis-yarvin',
      name: 'Curtis Yarvin',
      role: 'Teórico político',
      lifespan: '1973–',
      description:
        'Teórico político conhecido como Mencius Moldbug, Yarvin formulou o neorreacionarismo, propondo substituir a democracia por um Estado gerido como empresa por um soberano-executivo, no modelo do neocameralismo.',
      imagePath: '/personalities/portraits/curtis-yarvin.jpg',
      compatibility: 97
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representação',
        leftPole: 'Democracia',
        rightPole: 'Autocracia',
        leftPercent: 4,
        rightPercent: 96,
        dominantPole: 'Autocracia',
        intensity: 'Muito forte'
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
      countryId: 'estados-unidos',
      name: 'United States',
      category: 'Liberal federal republic',
      description:
        'A global power and presidential federal republic, the United States combines a strong liberal tradition, a dynamic market economy, technological innovation, and a two-party system that polarizes national political life.',
      flagPath: '/countries/flags/estados-unidos.gif',
      historical: false,
      period: '',
      compatibility: 83
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
      ideologyId: 'conservadorismo-cristao',
      name: 'Christian Conservatism',
      category: 'Right',
      description:
        'A current that grounds politics in Christian morality and tradition, defending family, life, and religious values within democracy, with an emphasis on preserving the customs and cultural heritage of the people.',
      longDescription:
        'A current that grounds politics in Christian morality and tradition, defending family, life, and religious values within democracy, with an emphasis on preserving the customs and cultural heritage of the people.',
      compatibility: 84
    },
    country: {
      countryId: 'brasil-regime-militar',
      name: 'Brazil under Military Rule',
      category: 'Developmentalist dictatorship',
      description:
        'A regime installed in 1964, it combined political repression, censorship, and security agencies with state developmentalism, large public works, market reserves, and conservative moralism during the Cold War.',
      flagPath: '/countries/flags/brasil.gif',
      historical: true,
      period: '1964–1985',
      compatibility: 75
    },
    personality: {
      personalityId: 'jair-bolsonaro',
      name: 'Jair Bolsonaro',
      role: 'Politician',
      lifespan: '1955–',
      description:
        'A Brazilian politician, Bolsonaro reached the presidency leading the nationalist, conservative right, with agendas of security, traditional values, economic liberalism, and strong anti-establishment rhetoric.',
      imagePath: '/personalities/portraits/jair-bolsonaro.jpg',
      compatibility: 84
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 66,
        rightPercent: 34,
        dominantPole: 'Democracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 49,
        rightPercent: 51,
        dominantPole: 'Private',
        intensity: 'Balanced'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Traditionalist',
        intensity: 'Very strong'
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
  },
  {
    ideology: {
      ideologyId: 'libertarianismo-hoppeano',
      name: 'Hoppean Libertarianism',
      category: 'Libertarian Right',
      description:
        'A current linked to Hans-Hermann Hoppe that unites anarcho-capitalism, absolute private property, and criticism of democracy, defending social orders based on contract, voluntary exclusion, and private authority.',
      longDescription:
        'A current linked to Hans-Hermann Hoppe that unites anarcho-capitalism, absolute private property, and criticism of democracy, defending social orders based on contract, voluntary exclusion, and private authority.',
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
      compatibility: 80
    },
    personality: {
      personalityId: 'hoppe',
      name: 'Hans-Hermann Hoppe',
      role: 'Economist',
      lifespan: '1949–',
      description:
        'A German economist, Hoppe radicalized anarcho-capitalism, defending absolute private property and criticizing democracy as a system that erodes liberty, proposing social orders based on voluntary contract.',
      imagePath: '/personalities/portraits/hoppe.jpg',
      compatibility: 95
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 30,
        rightPercent: 70,
        dominantPole: 'Autocracy',
        intensity: 'Leaning'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 3,
        rightPercent: 97,
        dominantPole: 'Private',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 10,
        rightPercent: 90,
        dominantPole: 'Traditionalist',
        intensity: 'Very strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neoliberalismo',
      name: 'Neoliberalism',
      category: 'Center-Right',
      description:
        'A current that advocates free markets, deregulation, privatization, and fiscal discipline, reducing the economic role of the state and relying on competition and monetary stability as engines of prosperity.',
      longDescription:
        'A current that advocates free markets, deregulation, privatization, and fiscal discipline, reducing the economic role of the state and relying on competition and monetary stability as engines of prosperity.',
      compatibility: 88
    },
    country: {
      countryId: 'chile',
      name: 'Chile',
      category: 'Latin American progressive democracy',
      description:
        'A South American presidential republic, Chile combines stable democracy, an open market economy, and a strong progressive social agenda, a legacy of the redemocratization process after the Pinochet military dictatorship.',
      flagPath: '/countries/flags/chile.gif',
      historical: false,
      period: '',
      compatibility: 79
    },
    personality: {
      personalityId: 'milton-friedman',
      name: 'Milton Friedman',
      role: 'Economist',
      lifespan: '1912–2006',
      description:
        'An American economist, Friedman led neoliberalism and monetarism, defending free markets, monetary stability, and a reduced state as essential conditions for liberty and prosperity.',
      imagePath: '/personalities/portraits/milton-friedman.jpg',
      compatibility: 97
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
        leftPercent: 23,
        rightPercent: 77,
        dominantPole: 'Private',
        intensity: 'Strong'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 36,
        rightPercent: 64,
        dominantPole: 'Traditionalist',
        intensity: 'Leaning'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'monarquismo-constitucional',
      name: 'Constitutional Monarchism',
      category: 'Center',
      description:
        'Defense of monarchy as a symbol of unity and continuity, with the king subject to the constitution and parliament, uniting tradition and institutional stability with representative democracy and the rule of law.',
      longDescription:
        'Defense of monarchy as a symbol of unity and continuity, with the king subject to the constitution and parliament, uniting tradition and institutional stability with representative democracy and the rule of law.',
      compatibility: 85
    },
    country: {
      countryId: 'imperio-do-brasil',
      name: 'Empire of Brazil',
      category: 'Historical constitutional monarchy',
      description:
        'The only long-lasting empire in the Americas, imperial Brazil was a parliamentary monarchy under Pedro I and Pedro II, marked by political stability, a slaveholding agrarian economy, and strong state centralization.',
      flagPath: '/countries/flags/imperio-do-brasil.png',
      historical: true,
      period: '1822–1889',
      compatibility: 62
    },
    personality: {
      personalityId: 'dom-pedro-ii',
      name: 'Dom Pedro II',
      role: 'Emperor',
      lifespan: '1825–1891',
      description:
        'The second emperor of Brazil, Dom Pedro II ruled as a constitutional monarch, valuing parliamentarism, institutional stability, science, education, and gradual abolition, preserving national unity under moderating power.',
      imagePath: '/personalities/portraits/dom-pedro-segundo.jpg',
      compatibility: 85
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 41,
        rightPercent: 59,
        dominantPole: 'Autocracy',
        intensity: 'Balanced'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 43,
        rightPercent: 57,
        dominantPole: 'Private',
        intensity: 'Balanced'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 18,
        rightPercent: 82,
        dominantPole: 'Traditionalist',
        intensity: 'Very strong'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'socialismo-anticolonial',
      name: 'Anti-Colonial Socialism',
      category: 'Left',
      description:
        'A socialist current born from national liberation struggles in Africa, Asia, and Latin America, advocating economic sovereignty, resource nationalization, non-alignment between powers, and solidarity among the peoples of the Global South against imperialism.',
      longDescription:
        'A socialist current born from national liberation struggles in Africa, Asia, and Latin America, advocating economic sovereignty, resource nationalization, non-alignment between powers, and solidarity among the peoples of the Global South against imperialism.',
      compatibility: 93
    },
    country: {
      countryId: 'burkina-faso-de-sankara',
      name: "Sankara's Burkina Faso",
      category: 'Revolutionary anti-colonial socialism',
      description:
        "Under Thomas Sankara, Burkina Faso combined food self-sufficiency, mass vaccination and literacy campaigns, women's emancipation, rejection of foreign debt, and a frontal break with French neocolonialism.",
      flagPath: '/countries/flags/burkina-faso-de-sankara.png',
      historical: true,
      period: '1983–1987',
      compatibility: 93
    },
    personality: {
      personalityId: 'thomas-sankara',
      name: 'Thomas Sankara',
      role: 'Revolutionary',
      lifespan: '1949–1987',
      description:
        'A revolutionary from Burkina Faso, Sankara led a Marxist and pan-Africanist government that promoted self-sufficiency, women\'s rights, and radical social reforms, becoming an anti-imperialist icon of Africa.',
      imagePath: '/personalities/portraits/thomas-sankara.png',
      compatibility: 93
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 50,
        rightPercent: 50,
        dominantPole: 'Autocracy',
        intensity: 'Balanced'
      },
      {
        axisId: 'economia',
        label: 'Economy',
        leftPole: 'Public',
        rightPole: 'Private',
        leftPercent: 93,
        rightPercent: 7,
        dominantPole: 'Public',
        intensity: 'Very strong'
      },
      {
        axisId: 'moral',
        label: 'Moral',
        leftPole: 'Progressive',
        rightPole: 'Traditionalist',
        leftPercent: 36,
        rightPercent: 64,
        dominantPole: 'Traditionalist',
        intensity: 'Leaning'
      }
    ]
  },
  {
    ideology: {
      ideologyId: 'neorreacionarismo',
      name: 'Neoreaction',
      category: 'Authoritarian Right',
      description:
        'A current that rejects modern democracy and egalitarianism and proposes replacing them with hierarchical, efficient governments, run like companies by a sovereign, combining traditionalism and technology.',
      longDescription:
        'A current that rejects modern democracy and egalitarianism and proposes replacing them with hierarchical, efficient governments, run like companies by a sovereign, combining traditionalism and technology.',
      compatibility: 97
    },
    country: {
      countryId: 'singapura',
      name: 'Singapore',
      category: 'Liberal-authoritative technocracy',
      description:
        'An Asian city-state, Singapore is a parliamentary republic dominated by a single party, combining open capitalism, efficient technocratic management, rigid order, and limited political freedoms in the name of progress.',
      flagPath: '/countries/flags/singapura.gif',
      historical: false,
      period: '',
      compatibility: 62
    },
    personality: {
      personalityId: 'curtis-yarvin',
      name: 'Curtis Yarvin',
      role: 'Political theorist',
      lifespan: '1973–',
      description:
        'A political theorist known as Mencius Moldbug, Yarvin formulated neoreaction, proposing to replace democracy with a state run as a company by a sovereign executive, in the model of neocameralism.',
      imagePath: '/personalities/portraits/curtis-yarvin.jpg',
      compatibility: 97
    },
    axes: [
      {
        axisId: 'representacao',
        label: 'Representation',
        leftPole: 'Democracy',
        rightPole: 'Autocracy',
        leftPercent: 4,
        rightPercent: 96,
        dominantPole: 'Autocracy',
        intensity: 'Very strong'
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
        leftPercent: 4,
        rightPercent: 96,
        dominantPole: 'Traditionalist',
        intensity: 'Very strong'
      }
    ]
  }
];

export const EXAMPLE_RESULTS: ExampleResult[] = LANG === 'en' ? en : pt;
