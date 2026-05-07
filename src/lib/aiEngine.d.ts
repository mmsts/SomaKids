export type BodyPart = 'head' | 'chest' | 'stomach';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Suggestion {
  level: 1 | 2 | 3;
  title: string;
  detail: string;
  emoji: string;
}

export interface Reasoning {
  tags: string[];
  rationale: string;
}

export interface BodySignal {
  symptom: string;
  confidence: number;
}

export interface EmotionSignal {
  emotion: string;
  confidence: number;
}

export interface AnalysisResult {
  interpretation: string;
  suggestions: Suggestion[];
  riskLevel: RiskLevel;
  reasoning: Reasoning;
  bodySignals: BodySignal[];
  emotionSignals: EmotionSignal[];
  emotionReasoning: string | null;
}

export function analyzeInput(bodyPart: BodyPart, text: string): AnalysisResult;
