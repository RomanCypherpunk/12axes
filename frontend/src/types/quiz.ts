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

export interface Question {
  id: string;
  axisId: string;
  text: string;
  agreePole: Pole;
  weight: number;
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
}


export type CompareType = 'personality' | 'country' | 'ideology';

/** Perfil pesquisável na seção de comparação (já filtrado pela religião do usuário). */
export interface CompareItem {
  type: CompareType;
  id: string;
  name: string;
  caption: string;
  /** Retrato (personalidade) ou bandeira (país); ausente nas ideologias. */
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
