export type AnswerValue =
  | 'STRONGLY_AGREE'
  | 'AGREE'
  | 'NEUTRAL'
  | 'DISAGREE'
  | 'STRONGLY_DISAGREE';

export type Pole = 'LEFT' | 'RIGHT';

export type QuizVariant = 'short' | 'extended' | 'extreme';

export interface Axis {
  id: string;
  label: string;
  leftPole: string;
  rightPole: string;
  leftColor: string;
  rightColor: string;
}

/** Termo do glossário no texto da pergunta: `start`/`end` são índices (UTF-16) em `text`. */
export interface QuestionTerm {
  start: number;
  end: number;
  term: string;
  definition: string;
}

/** O que significa concordar e discordar; `note` avisa quem pensa fora do enquadramento da pergunta. */
export interface QuestionHelp {
  agree: string;
  disagree: string;
  note?: string | null;
  agreeExample?: string | null;
  disagreeExample?: string | null;
}

export interface Question {
  id: string;
  axisId: string;
  text: string;
  agreePole: Pole;
  weight: number;
  terms?: QuestionTerm[];
  help?: QuestionHelp | null;
}

export interface AnswerOption {
  id: AnswerValue;
  label: string;
  scoreTowardAgreement: number;
}

export interface QuizPayload {
  title: string;
  description: string;
  variant: QuizVariant;
  questionCount: number;
  questionsPerAxis: number;
  axes: Axis[];
  questions: Question[];
  answerOptions: AnswerOption[];
  /** Perguntas de arquétipo exibidas ao fim do quiz (cada alternativa pontua em vários eixos). */
  archetypeQuestions?: ArchetypeQuestion[];
}

/** Ícone preenchido (mesmo formato de data/filledPoleIcons.ts). */
export interface QuestionIcon {
  viewBox: string;
  paths: string[];
  fillRule?: 'evenodd' | 'nonzero';
}

export interface ArchetypeQuestion {
  id: string;
  label: string;
  text: string;
  /** Selo do cabeçalho; sem ele, usa o ícone do tema pelo id. */
  icon?: QuestionIcon;
  /** Com icon, a alternativa mostra o ícone no lugar da letra. */
  options: { id: string; text: string; icon?: QuestionIcon }[];
  /** "tiles": alternativas em botões numa grade (3 colunas no desktop, 2 no mobile). Padrão: lista. */
  layout?: 'list' | 'tiles';
}

export interface SubmittedAnswer {
  questionId: string;
  answer: AnswerValue;
}

export interface AxisResult {
  axisId: string;
  label: string;
  leftPole: string;
  rightPole: string;
  leftPercent: number;
  rightPercent: number;
  dominantPole: string;
  intensity: string;
}

/** Partido, movimento, casa dinástica ou organização, sempre com o país associado. */
export interface PartyMatch {
  partyId: string;
  name: string;
  category: string;
  description: string;
  /** Logo oficial quadrado 1:1 (PNG), em /parties/logos/. */
  logoPath: string;
  logoSourceName?: string;
  logoSourceUrl?: string;
  logoNote?: string;
  countryId: string;
  /** Nome do país associado, no idioma da resposta. */
  countryName: string;
  /** Bandeira do país associado (a mesma do catálogo de países). */
  countryFlagPath: string;
  historical: boolean;
  period: string;
  compatibility: number;
  /** Vetor de 12 eixos (leftPercent) do perfil. */
  vector?: Record<string, number>;
}

export interface IdeologyMatch {
  ideologyId: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  phrase: string;
  compatibility: number;
}

export interface CountryMatch {
  countryId: string;
  name: string;
  category: string;
  description: string;
  flagPath: string;
  flagKind?: string;
  flagSourceName?: string;
  flagSourceUrl?: string;
  flagNote?: string;
  historical: boolean;
  period: string;
  compatibility: number;
  /** Vetor de 12 eixos (leftPercent) do país. */
  vector?: Record<string, number>;
}

/** Um perfil da linha do tempo: personalidade, país ou partido (os outros campos são nulos). */
export interface TimelineEntry {
  type: 'personality' | 'country' | 'party';
  personality: PersonalityMatch | null;
  country: CountryMatch | null;
  party: PartyMatch | null;
}

/** Uma era da linha do tempo, com os perfis da lista e do cartão da época mais compatível. */
export interface TimelineEra {
  key: 'antiguidade' | 'medieval' | 'moderna' | 'xix' | 'xx' | 'xxi';
  /** Ano em que a era começa (nulo na Antiguidade). */
  fromYear: number | null;
  /** Ano em que a era termina, exclusivo (nulo na era aberta, o século XXI). */
  toYear: number | null;
  /** Média da compatibilidade dos 10 perfis mais compatíveis da era (personalidades, países e partidos). */
  compatibility: number;
  /** Os 4 perfis mais compatíveis (até 3 personalidades, 3 países e 1 partido): cartão da época mais compatível. */
  entries: TimelineEntry[];
  /** Os 2 perfis da lista da linha do tempo (até 2 personalidades, 1 país e 1 partido). */
  highlights?: TimelineEntry[];
}

export type PersonalityCategory =
  | 'politico'
  | 'religioso'
  | 'economista'
  | 'filosofo'
  | 'teorico'
  | 'empresario'
  | 'intelectual'
  | 'ativista';

export interface PersonalityMatch {
  personalityId: string;
  name: string;
  role: string;
  category: PersonalityCategory;
  lifespan: string;
  description: string;
  imagePath: string;
  imageSourceName?: string;
  imageSourceUrl?: string;
  imageNote?: string;
  compatibility: number;
  /** Vetor de 12 eixos (leftPercent) da personalidade. */
  vector?: Record<string, number>;
}

export interface BookRecommendation {
  personalityId: string;
  personalityName: string;
  imagePath: string;
  title: string;
  /** Ano da primeira publicação; negativo = a.C. */
  year?: number;
  url: string;
  compatibility: number;
}

export interface AxisOutlier {
  axisId: string;
  label: string;
  userPercent: number;
  catalogMedian: number;
  distanceFromMedian: number;
  dominantPole: string | null;
  balanced: boolean;
  abovePole: string;
  abovePercent: number;
}

export interface AxisTension {
  firstAxisLabel: string;
  firstPole: string;
  secondAxisLabel: string;
  secondPole: string;
  matchingIdeologies: number;
  catalogSize: number;
  examples: string[];
}

export type ProfileDimension = 'political' | 'social' | 'economic';

export interface DimensionMatch {
  dimension: ProfileDimension;
  match: PersonalityMatch;
}

export interface CountryDimensionMatch {
  dimension: ProfileDimension;
  match: CountryMatch;
}

export interface PartyDimensionMatch {
  dimension: ProfileDimension;
  match: PartyMatch;
}

export interface QuizResult {
  axes: AxisResult[];
  topMatch: IdeologyMatch;
  matches: IdeologyMatch[];
  bottomIdeologyMatch: IdeologyMatch;
  topCountryMatch: CountryMatch;
  topCountryMatches: CountryMatch[];
  topHistoricalCountryMatch: CountryMatch;
  countryDimensionMatches: CountryDimensionMatch[];
  bottomCountryMatches: CountryMatch[];
  topPersonalityMatch: PersonalityMatch;
  personalityMatches: PersonalityMatch[];
  dimensionMatches: DimensionMatch[];
  categoryBestMatches: PersonalityMatch[];
  bottomPersonalityMatches: PersonalityMatch[];
  mostUnusualAxis: AxisOutlier;
  mostCommonAxis: AxisOutlier;
  // null quando o perfil nao contraria padrao nenhum (centristas e moderados).
  axisTension: AxisTension | null;
  /** Até 3 livros das personalidades mais compatíveis, com link de afiliado pronto. */
  bookRecommendations?: BookRecommendation[];
  /** Partido atual mais compatível. */
  topPartyMatch?: PartyMatch;
  /** Os 3 partidos/organizações mais compatíveis (atuais e históricos); vazio com o catálogo vazio. */
  topPartyMatches?: PartyMatch[];
  /** Partido histórico mais compatível. */
  topHistoricalPartyMatch?: PartyMatch;
  /** Dimensões (política, social, econômica) dos partidos compatíveis. */
  partyDimensionMatches?: PartyDimensionMatch[];
  /** Os 3 mais distantes, do menos ao mais distante. */
  bottomPartyMatches?: PartyMatch[];
  /** As seis eras, da Antiguidade ao século XXI, com os 4 perfis mais compatíveis de cada uma. */
  timeline?: TimelineEra[];
}


export type CompareType = 'personality' | 'country' | 'ideology' | 'party';

/** Perfil pesquisável na seção de comparação (já filtrado pela religião do usuário). */
export interface CompareItem {
  type: CompareType;
  id: string;
  name: string;
  caption: string;
  /** Retrato (personalidade), bandeira (país) ou logo quadrado (partido/organização); ausente nas ideologias. */
  imagePath?: string | null;
  category: string;
  historical: boolean;
}

export interface CompareDetail {
  item: CompareItem;
  description: string;
  compatibility: number;
  /** Vetor de 12 eixos (leftPercent) do perfil comparado. */
  vector: Record<string, number>;
}

/** Um perfil da página /compare: dados do catálogo e vetor de 12 eixos (leftPercent). */
export interface CompareProfile {
  item: CompareItem;
  vector: Record<string, number>;
  nearest: CompareNearest;
}

/** Ideologia, país e partido mais próximos de um perfil da comparação (o próprio perfil fica de fora). */
export interface CompareNearest {
  ideology: IdeologyMatch | null;
  country: CountryMatch | null;
  party: PartyMatch | null;
}

/** Compatibilidade entre dois perfis da comparação (índices em CompareProfiles.profiles). */
export interface ComparePair {
  first: number;
  second: number;
  compatibility: number;
}

export interface CompareProfiles {
  profiles: CompareProfile[];
  pairs: ComparePair[];
  /** Ideologia mais próxima da média dos perfis. */
  commonIdeology: IdeologyMatch | null;
}
