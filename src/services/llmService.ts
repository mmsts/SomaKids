// ============================================================
// SomaKids LLM Service — 百度千帆 ModelBuilder v2 API
// ============================================================
// 认证方式：直接用 ModelBuilder API Key（Bearer Token）
// API 格式：OpenAI-compatible /v2/chat/completions
// 开发环境走 Vite proxy 绕过 CORS，生产环境直接调用
// ============================================================

type BodyPart = 'head' | 'chest' | 'stomach';
type RiskLevel = 'low' | 'medium' | 'high';

interface BodySignal {
  symptom: string;
  confidence: number;
}

interface EmotionSignal {
  emotion: string;
  confidence: number;
}

export interface LLMInput {
  bodyPart: BodyPart;
  userExpression: string;
  bodySignals: BodySignal[];
  emotionSignals: EmotionSignal[];
  riskLevel: RiskLevel;
}

export interface LLMInterpretationResult {
  reasoning: string;
  emotionalInsight: string;
  companionMessage: string;
  suggestion: string;
}

// 调用同域 API 端点，由 Vercel Edge Function / Vite proxy 转发到千帆 API
const API_URL = '/api/chat';

function getModelName(): string {
  return import.meta.env.VITE_QIANFAN_MODEL || 'ernie-4.5-turbo-128k';
}

// ============================================================
// Prompt Engineering
// ============================================================

function buildSystemPrompt(): string {
  return `你是 SomaKids AI Companion，一位温柔、有同理心的儿童身体感受理解助手。

你的角色是帮助家长更好地理解孩子表达的身体感受，而不是做出医疗诊断。

重要原则：
- SomaKids 不是医疗诊断系统，它帮助家长理解孩子的情绪和身体不适
- 专注于"理解"而非"诊断"
- 避免使用确诊语气、医学术语堆砌或恐吓式表达
- 温和地表达不确定性
- 把情绪安全放在首位
- 像一个理解儿童、帮助家长的朋友那样说话
- 承认身体感觉和情绪经常是相连的
- 用中文回答，语言要温暖、口语化、有陪伴感
- 每段文字控制在 3-5 句话，不要太长

禁止：
- 医疗诊断或确诊语气
- "孩子可能患有XX病"这类表达
- 绝对化判断（"一定"、"必然"）
- 恐吓式表达

示例风格：
❌ 不要说："孩子可能患有胃炎。"
✅ 要说："SomaKids 会优先联想到肚子胀胀的不舒服感。有时候小朋友在紧张、吃太快、或者积食的时候，也会这样表达。"`;
}

function buildUserPrompt(input: LLMInput): string {
  const partLabels: Record<BodyPart, string> = {
    head: '头部',
    chest: '胸部',
    stomach: '肚子/胃部',
  };

  const riskLabels: Record<RiskLevel, string> = {
    low: '轻微',
    medium: '中等',
    high: '需要关注',
  };

  const bodySignalsText =
    input.bodySignals.length > 0
      ? input.bodySignals
          .map(
            (s) =>
              `- ${s.symptom}（置信度 ${Math.round(s.confidence * 100)}%）`
          )
          .join('\n')
      : '- 未检测到明确的身体信号';

  const emotionSignalsText =
    input.emotionSignals.length > 0
      ? input.emotionSignals
          .map(
            (s) =>
              `- ${s.emotion}（置信度 ${Math.round(s.confidence * 100)}%）`
          )
          .join('\n')
      : '- 未检测到明显的情绪信号';

  return `请根据以下信息，为家长生成温暖的理解回应：

【孩子说的话】
身体部位：${partLabels[input.bodyPart]}
原话："${input.userExpression || '（未提供具体描述）'}"

【SomaKids 规则分析结果】
身体信号：
${bodySignalsText}

情绪信号：
${emotionSignalsText}

风险等级：${riskLabels[input.riskLevel]}

请生成以下四个部分的内容，以 JSON 格式返回：

1. reasoning (string): SomaKids 是如何理解孩子的描述的。用温暖、有陪伴感的语言解释分析思路，让家长感到被理解。2-4句话。
2. emotionalInsight (string): 对孩子情绪状态的温柔洞察。探讨身体感觉和情绪可能如何相连，给家长情感上的支持。2-4句话。
3. companionMessage (string): SomaKids 想对家长说的温暖话语。像一位理解孩子的朋友在分享观察，帮助家长更懂孩子。3-5句话。
4. suggestion (string): 一条温和、实用的建议，聚焦于亲子互动和情感陪伴，而非医疗处理。1-2句话。

注意：
- 不要输出 markdown 代码块
- 不要添加 JSON 之外的任何文字
- 确保 JSON 格式合法，所有字段都是字符串

返回格式：
{"reasoning":"...","emotionalInsight":"...","companionMessage":"...","suggestion":"..."}`;
}

// ============================================================
// 核心 API 调用 — 千帆 v2 (OpenAI-compatible)
// ============================================================

export async function generateInterpretation(
  input: LLMInput
): Promise<LLMInterpretationResult> {
  const model = getModelName();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(input) },
      ],
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `LLM API 请求失败: ${response.status} ${response.statusText}${errText ? ` — ${errText}` : ''}`
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(`LLM API 错误: ${data.error.message}`);
  }

  const generatedText = data.choices?.[0]?.message?.content;
  if (!generatedText) {
    throw new Error('LLM API 返回空结果');
  }

  return parseLLMResponse(generatedText);
}

// ============================================================
// 响应解析
// ============================================================

function parseLLMResponse(text: string): LLMInterpretationResult {
  try {
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr) as Record<string, string>;

    return {
      reasoning: sanitize(parsed.reasoning || parsed.reasoning_zh || ''),
      emotionalInsight: sanitize(
        parsed.emotionalInsight ||
          parsed.emotional_insight ||
          parsed.emotionInsight ||
          ''
      ),
      companionMessage: sanitize(
        parsed.companionMessage || parsed.companion_message || ''
      ),
      suggestion: sanitize(parsed.suggestion || ''),
    };
  } catch {
    return {
      reasoning: '',
      emotionalInsight: '',
      companionMessage: sanitize(text.slice(0, 600)),
      suggestion: '',
    };
  }
}

function sanitize(text: string): string {
  return text
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .trim();
}

// ============================================================
// Dynamic Conversational Guidance — 追问生成
// ============================================================

export interface ConversationTurn {
  role: 'child' | 'companion';
  content: string;
  type?: 'initial' | 'followup' | 'answer';
}

export interface FollowUpInput {
  bodyPart: BodyPart;
  userExpression: string;
  conversationHistory: ConversationTurn[];
}

export interface FollowUpResult {
  /** 追问内容，为空字符串表示不需要追问 */
  followUpQuestion: string;
  /** companion 情绪基调 */
  companionTone: 'gentle' | 'curious' | 'caring' | 'playful';
  /** 情绪方向洞察，供 UI 参考 */
  emotionalDirection: string | null;
}

function buildFollowUpPrompt(input: FollowUpInput): string {
  const partLabels: Record<BodyPart, string> = {
    head: '头部',
    chest: '胸部',
    stomach: '肚子/胃部',
  };

  const historyText = input.conversationHistory
    .map((t) => `${t.role === 'child' ? '孩子' : 'SomaKids'}：${t.content}`)
    .join('\n');

  const askedQuestions = input.conversationHistory
    .filter((t) => t.role === 'companion' && t.type === 'followup')
    .map((t) => t.content);

  return `你是 SomaKids AI Companion，正在温柔地理解一个孩子的身体感受。

孩子说的是关于「${partLabels[input.bodyPart]}」的感受。

对话历史：
${historyText}

${askedQuestions.length > 0 ? `已经问过的问题（绝对不要重复类似的）：\n${askedQuestions.map((q) => `- ${q}`).join('\n')}\n` : ''}

请生成一个温柔的追问，帮助孩子更具体地表达感受。

追问设计原则：
- 简短：总共不超过 35 个字
- 像大朋友在和小朋友说话，温柔、口语化
- 给出 2 个具体的选择，帮助孩子回答（用"还是""或者"连接）
- 非医疗化、非诊断、不制造焦虑
- 要让孩子感到"被理解"，而不是"被审问"
- 如果孩子的表达已经很具体了，不需要追问，followUpQuestion 设为空字符串

优秀示例：
输入："肚子要爆炸了"
输出：{"followUpQuestion":"是胀胀的感觉吗，还是像被压住了一样？","companionTone":"gentle","emotionalDirection":"可能是胀气或积食带来的胀满感"}

输入："心里怪怪的"
输出：{"followUpQuestion":"是像想哭哭，还是有点想吐吐呢？","companionTone":"caring","emotionalDirection":"情绪与身体感觉交织的不安"}

输入："胸口堵堵的"
输出：{"followUpQuestion":"像有东西压着吗，还是有点喘不过气呀？","companionTone":"gentle","emotionalDirection":"紧张或焦虑引发的胸闷感"}

注意：
- 不要输出 markdown 代码块
- 不要添加 JSON 之外的任何文字
- 确保 JSON 格式合法

返回格式：
{"followUpQuestion":"...","companionTone":"gentle/curious/caring/playful 之一","emotionalDirection":"..."}`;
}

/**
 * 动态生成温柔的追问，帮助孩子更具体地表达身体感受。
 *
 * @param input 包含身体部位、孩子表达、对话历史
 * @returns 追问内容；若表达已足够具体，followUpQuestion 为空字符串
 * @throws 网络或 API 错误时抛出，由调用方 fallback
 */
export async function generateFollowUpQuestion(
  input: FollowUpInput
): Promise<FollowUpResult> {
  const model = getModelName();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildFollowUpPrompt(input) },
      ],
      temperature: 0.75,
      top_p: 0.9,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `追问 API 请求失败: ${response.status} ${response.statusText}${errText ? ` — ${errText}` : ''}`
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(`追问 API 错误: ${data.error.message}`);
  }

  const generatedText = data.choices?.[0]?.message?.content;
  if (!generatedText) {
    throw new Error('追问 API 返回空结果');
  }

  return parseFollowUpResponse(generatedText);
}

function parseFollowUpResponse(text: string): FollowUpResult {
  try {
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr) as Record<string, string>;

    const validTones = ['gentle', 'curious', 'caring', 'playful'] as const;
    const tone = parsed.companionTone || 'gentle';

    return {
      followUpQuestion: sanitize(parsed.followUpQuestion || ''),
      companionTone: validTones.includes(tone as (typeof validTones)[number])
        ? (tone as (typeof validTones)[number])
        : 'gentle',
      emotionalDirection: sanitize(parsed.emotionalDirection || parsed.emotional_direction || ''),
    };
  } catch {
    return {
      followUpQuestion: '',
      companionTone: 'gentle',
      emotionalDirection: null,
    };
  }
}

// ============================================================
// AI-Driven Expression Analysis — 驱动对话循环的核心
// ============================================================

export interface ExpressionAnalysisInput {
  bodyPart: BodyPart;
  expression: string;
  history: ConversationTurn[];
  confirmed: string[];
  rejected: string[];
}

export interface ExpressionAnalysisResult {
  /** AI 的理解假设（如"我觉得你可能是肚子胀胀的"） */
  hypothesis: string;
  /** 确认问题（不超过15字） */
  question: string;
  /** 置信度 0-100 */
  confidence: number;
  /** 检测到的信号标签 */
  signals: string[];
  /** companion 情绪基调 */
  tone: 'gentle' | 'curious' | 'caring' | 'playful';
}

function buildAnalyzePrompt(input: ExpressionAnalysisInput): string {
  const partLabels: Record<BodyPart, string> = {
    head: '头部',
    chest: '胸部',
    stomach: '肚子/胃部',
  };

  const historyText =
    input.history.length > 0
      ? input.history
          .map((t) => `${t.role === 'child' ? '孩子' : 'SomaKids'}：${t.content}`)
          .join('\n')
      : '（刚开始对话）';

  const confirmedText = input.confirmed.length > 0 ? input.confirmed.join('、') : '无';
  const rejectedText = input.rejected.length > 0 ? input.rejected.join('、') : '无';

  const isRetry = input.rejected.length > 0;

  return `${isRetry ? '【重新思考】孩子否认了之前的理解，请生成一个新的理解方向。' : '【初次理解】'}

你是 SomaKids AI Companion，正在温柔地理解孩子的身体感受。

身体部位：${partLabels[input.bodyPart]}
孩子说的话："${input.expression}"

对话历史：
${historyText}

已确认的理解：${confirmedText}
已排除的理解：${rejectedText}

请生成以下四个字段，以 JSON 格式返回：

1. hypothesis (string): 你对孩子的温柔理解。
   - 用"我觉得..."或"会不会是..."开头
   - 2-3句话，像大朋友在和小朋友说话
   - 不要医疗诊断，不要绝对化
   - 如果已有部分确认信号，可以在理解中体现
   ${isRetry ? '- 必须和已排除的理解方向不同' : ''}

2. question (string): 一个简短的确认问题。
   - 不超过15个字
   - 让孩子可以轻松回答"是的"或"不太像"
   - 温柔、像聊天一样

3. confidence (number): 你对这个理解的确定程度（0-100）。
   - 如果孩子用了很具体的描述词（如"痛"、"胀"、"晕"），给 50-70
   - 如果描述很模糊（如"怪怪的"、"不舒服"），给 20-40
   - 如果已有部分确认信号，可适当提高
   - 初次理解最高不超过 70（给孩子确认的空间）

4. signals (string[]): 检测到的具体信号标签（1-3个）。
   - 如 ["胀气", "紧张", "积食"]
   - 不要和已排除的信号重复

5. tone (string): companion 的情绪基调。
   - 可选：gentle / curious / caring / playful

返回严格 JSON：
{"hypothesis":"...","question":"...","confidence":50,"signals":["..."],"tone":"gentle"}`;
}

/**
 * 分析孩子表达，生成理解假设 + 确认问题 + 置信度。
 *
 * 这是 AI-Driven Conversational Flow 的核心引擎：
 * - 每次调用生成一个新的理解方向
 * - rejected 列表确保不重复已排除的方向
 * - confidence 决定是否需要继续追问
 */
export async function analyzeExpression(
  input: ExpressionAnalysisInput
): Promise<ExpressionAnalysisResult> {
  const model = getModelName();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildAnalyzePrompt(input) },
      ],
      temperature: 0.75,
      top_p: 0.9,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `分析 API 请求失败: ${response.status} ${response.statusText}${errText ? ` — ${errText}` : ''}`
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(`分析 API 错误: ${data.error.message}`);
  }

  const generatedText = data.choices?.[0]?.message?.content;
  if (!generatedText) {
    throw new Error('分析 API 返回空结果');
  }

  return parseAnalyzeResponse(generatedText);
}

function parseAnalyzeResponse(text: string): ExpressionAnalysisResult {
  try {
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;

    const validTones = ['gentle', 'curious', 'caring', 'playful'] as const;
    const tone = String(parsed.tone || 'gentle');

    const rawConfidence = Number(parsed.confidence ?? 40);
    const confidence = Number.isNaN(rawConfidence)
      ? 40
      : Math.max(0, Math.min(100, rawConfidence));

    const signals = Array.isArray(parsed.signals)
      ? parsed.signals.map((s) => String(s))
      : [];

    return {
      hypothesis: sanitize(String(parsed.hypothesis || '')),
      question: sanitize(String(parsed.question || '')),
      confidence,
      signals,
      tone: validTones.includes(tone as (typeof validTones)[number])
        ? (tone as (typeof validTones)[number])
        : 'gentle',
    };
  } catch {
    // 解析失败时的兜底
    return {
      hypothesis: sanitize(text.slice(0, 200)),
      question: '是这样的感觉吗？',
      confidence: 30,
      signals: [],
      tone: 'gentle',
    };
  }
}
