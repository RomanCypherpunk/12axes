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
  /** Árvores dos valores completos (só no quiz de 240 perguntas). */
  valueTrees?: ValueTree[];
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
  /** Tema do ícone do cabeçalho (chave de THEME_ICONS no ArchetypeCard); sem ele vale o id da pergunta. */
  theme?: string;
  /** Selo do cabeçalho; sem ele, usa o ícone do tema pelo id. */
  icon?: QuestionIcon;
  /** Com icon, a alternativa mostra o ícone no lugar da letra. */
  /** wide: em layout tiles, a alternativa ocupa a linha inteira, em formato de faixa (ex.: "Sem religião"). */
  options: { id: string; text: string; icon?: QuestionIcon; wide?: boolean }[];
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

/** Opção de um nó da árvore de valores: leva a outro nó (next) ou a um valor final (value), nunca aos dois. */
export interface ValueTreeOption {
  /** Posição da opção no nó, em texto ("0", "1", ...). */
  id: string;
  text: string;
  next: string | null;
  value: string | null;
}

export interface ValueTreeNode {
  id: string;
  text: string;
  options: ValueTreeOption[];
}

/** Árvore de decisão de uma categoria dos valores completos (quiz de 240 perguntas). */
export interface ValueTree {
  categoryId: string;
  label: string;
  root: string;
  nodes: ValueTreeNode[];
}

/** Imagem de um valor completo e a fonte dela. */
export interface FullValueIcon {
  /** Arquivo em /values/<categoria>/. */
  file: string;
  sourceUrl: string;
  author: string;
  license: string;
  modified: boolean;
}

/** Valor que o usuário declarou numa categoria (um por categoria, sem intensidade). */
export interface FullValue {
  categoryId: string;
  categoryLabel: string;
  valueId: string;
  name: string;
  description: string;
  neutral: boolean;
  /** Nulo enquanto o valor não tem imagem livre. */
  icon: FullValueIcon | null;
}

/** Valor político do usuário em uma categoria (econômicos, ...), derivado dos eixos. */
export interface PoliticalValue {
  categoryId: string;
  categoryLabel: string;
  valueId: string;
  name: string;
  description: string;
  /** Verdadeiro quando o valor é o neutro da categoria (usuário perto do centro nos eixos dela). */
  neutral: boolean;
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
  /** Espectro da pessoa (categoria da ideologia mais próxima do vetor dela): a cor dela no governo ideal. */
  spectrum?: string | null;
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
  /** Um valor político nomeado por categoria, derivado só dos eixos. */
  politicalValues?: PoliticalValue[];
  /** Valores que o usuário declarou na árvore do quiz de 240 perguntas; ausente/nulo nos outros casos (aí vale politicalValues). */
  fullValues?: FullValue[] | null;
  /** Chave curta dos valores declarados para o link (`f=`). */
  fullValuesKey?: string | null;
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
  /** Só na comparação entre pessoas: iniciais do nome, no lugar da bolinha colorida da ideologia. */
  initials?: string;
}

export interface CompareDetail {
  item: CompareItem;
  description: string;
  compatibility: number;
  /** Vetor de 12 eixos (leftPercent) do perfil comparado. */
  vector: Record<string, number>;
  /** Religiões do perfil no catálogo (vazia quando não há vínculo). */
  religions?: string[];
  /** Espectro do perfil (categoria da ideologia mais próxima do vetor dele). */
  spectrum?: string;
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

// Relatório Completo (pago): só chega do endpoint protegido, nunca da API livre.

/** Quanto uma resposta puxou um eixo, em pontos de leftPercent (positivo = polo esquerdo). */
export interface AnswerImpact {
  questionId: string;
  question: string;
  answer: AnswerValue;
  impact: number;
}

export interface AxisAnalysis {
  axisId: string;
  label: string;
  userLeftPercent: number;
  side: 'left' | 'right' | 'balanced';
  /** equilibrado, inclinado, forte ou muito_forte */
  level: 'equilibrado' | 'inclinado' | 'forte' | 'muito_forte';
  /** Texto fixo daquela inclinação; nulo enquanto não houver texto. */
  text: string | null;
  /** Por que quem tem essa tendência costuma ser elogiado e criticado; nulo no equilibrado. */
  pros: string | null;
  cons: string | null;
  impacts: AnswerImpact[];
  ideologyLeftPercent: number | null;
  personalityLeftPercent: number | null;
  countryLeftPercent: number | null;
}

export interface AxisDivergence {
  axisId: string;
  label: string;
  userLeftPercent: number;
  profileLeftPercent: number;
  /** Usuário menos perfil: positivo = o usuário está mais para o polo esquerdo. */
  difference: number;
}

export interface Disagreement {
  kind: 'ideology' | 'personality' | 'country';
  profileId: string;
  profileName: string;
  /** Categoria (espectro político) da ideologia mais próxima deste perfil: a cor dele na tela. */
  ideologyCategory: string;
  axes: AxisDivergence[];
}

/** O comecinho do relatório pago, para o convite da compra: só o que o convite mostra; o resto fica atrás do token. */
export interface ReportPreview {
  /** O eixo mais forte, só com o início do texto e sem as respostas. */
  analysis: AxisAnalysis;
  /** Ideologia, personalidade e país mais compatíveis (só nome e cor; `axes` vem vazio). */
  profiles: Disagreement[];
  /** Só o líder e o vice-líder do governo ideal. */
  government: GovernmentSeat[];
  /** Só a primeira era (Antiguidade), com os perfis da lista (`entries` vazio e `compatibility` 0). */
  timeline: TimelineEra[];
}

export interface GovernmentSeat {
  seatKey: 'lider' | 'vice' | 'economia' | 'educacao' | 'estrategia' | 'filosofia' | 'social' | 'industria' | 'cultura';
  category: string;
  holder: PersonalityMatch;
  /** As figuras mais compatíveis da categoria (a titular inclusive), para o usuário trocar quem ocupa o cargo; vazia na prévia. */
  candidates: PersonalityMatch[];
}

export interface RankingRow {
  id: string;
  name: string;
  category: string;
  historical: boolean;
  compatibility: number;
}

export interface PremiumRanking {
  ideologies: RankingRow[];
  personalities: RankingRow[];
  countries: RankingRow[];
  parties: RankingRow[];
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
  highlights: TimelineEntry[];
}

export interface PremiumReport {
  axisAnalysis: AxisAnalysis[];
  topCountries: CountryMatch[];
  personalitiesByArea: PersonalityMatch[];
  disagreements: Disagreement[];
  idealGovernment: GovernmentSeat[];
  timeline: TimelineEra[];
  ranking: PremiumRanking;
}
