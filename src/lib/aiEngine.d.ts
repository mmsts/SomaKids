export type BodyPart = 'head' | 'chest' | 'stomach';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Suggestion {
  level: 1 | 2 | 3;
  title: string;
  detail: string;
  emoji: string;
}

export interface AnalysisResult {
  interpretation: string;
  suggestions: Suggestion[];
  riskLevel: RiskLevel;
}

export function analyzeInput(bodyPart: BodyPart, text: string): AnalysisResult;
