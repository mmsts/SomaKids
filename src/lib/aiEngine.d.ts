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

// ───── Hybrid AI: LLM 增强层类型 ────────────────────────────────

/** LLM 返回的增强字段 */
export interface LLMEnhancement {
  /** 替代 interpretation 的温暖陪伴式话语 */
  interpretation: string | null;
  /** 替代 reasoning.rationale 的分析思路解释 */
  reasoning: string | null;
  /** 替代 emotionReasoning 的情绪洞察 */
  emotionReasoning: string | null;
  /** 额外的一条温和建议 */
  suggestion: string | null;
}

/**
 * 异步调用 LLM 增强规则引擎结果。
 *
 * 失败时返回 null，调用方应继续使用规则引擎的原始结果（静默 fallback）。
 */
export function enhanceAnalysisWithLLM(
  baseResult: AnalysisResult,
  bodyPart: BodyPart,
  expression: string
): Promise<LLMEnhancement | null>;
