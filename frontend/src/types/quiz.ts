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
}

export interface PersonalityMatch {
  personalityId: string;
  name: string;
  role: string;
  lifespan: string;
  description: string;
  imagePath: string;
  imageSourceName?: string;
  imageSourceUrl?: string;
  imageNote?: string;
  compatibility: number;
}

export interface QuizResult {
  axes: AxisResult[];
  topMatch: IdeologyMatch;
  matches: IdeologyMatch[];
  topCountryMatch: CountryMatch;
  topPersonalityMatch: PersonalityMatch;
}

export interface Candidate {
  id: string; name: string; role: string; description: string; party: string; partyName: string;
  ballotNumber: string; runningMate: string; active: boolean; imagePath: string;
  imageSourceName?: string; imageSourceUrl?: string; imageNote?: string;
}
export interface CandidateMatch extends Candidate { candidateId: string; compatibility: number; }
export interface ElectionResult { axes: AxisResult[]; matches: CandidateMatch[]; }
