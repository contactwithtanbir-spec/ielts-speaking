export type IELTSPart = 'Part 1' | 'Part 2' | 'Part 3';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type SpeakingLevel =
  | 'Beginner (Band 4.0 - 4.5)'
  | 'Elementary (Band 5.0 - 5.5)'
  | 'Intermediate (Band 6.0 - 6.5)'
  | 'Upper-Intermediate (Band 7.0 - 7.5)'
  | 'Advanced (Band 8.0+)';

export interface UserProfile {
  name: string;
  email: string;
  targetBand: number;
  currentLevel: string;
  joinedDate: string;
}

export interface IELTSQuestion {
  id: string;
  part: IELTSPart;
  topic: string;
  question: string;
  cuePoints?: string[];
  prepTimeSeconds: number;
  recommendedSpeakingSeconds: number;
  difficulty: DifficultyLevel;
  sampleAnswer?: string;
}

export interface CriterionFeedback {
  band: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface IELTSCriteriaScores {
  fluencyCoherence: CriterionFeedback;
  lexicalResource: CriterionFeedback;
  grammaticalRangeAccuracy: CriterionFeedback;
  pronunciation: CriterionFeedback;
}

export interface MistakeCorrection {
  original: string;
  correction: string;
  explanation: string;
}

export interface VocabularySuggestion {
  term: string;
  advancedAlternative: string;
  example: string;
}

export interface BetterExpression {
  original: string;
  refined: string;
}

export interface EvaluationResult {
  overallBand: number;
  criteria: IELTSCriteriaScores;
  strengths: string[];
  mistakes: MistakeCorrection[];
  vocabularySuggestions: VocabularySuggestion[];
  pronunciationFeedback: string[];
  betterExpressions: BetterExpression[];
  roomForImprovement: string[];
  nextPracticeRecommendation: string;
}

export interface PracticeSession {
  id: string;
  date: string;
  part: IELTSPart;
  difficulty: DifficultyLevel;
  topic: string;
  question: string;
  cuePoints?: string[];
  transcript: string;
  audioDurationSeconds: number;
  audioUrl?: string;
  evaluation: EvaluationResult;
}

export type PageView =
  | 'landing'
  | 'register'
  | 'dashboard'
  | 'practice'
  | 'evaluation'
  | 'progress'
  | 'profile';
