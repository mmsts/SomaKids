import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { FlowData } from '../types';
import { BODY_LABEL } from '../lib/ai';
import { analyzeInput, enhanceAnalysisWithLLM } from '../lib/aiEngine';
import type { RiskLevel, Suggestion, LLMEnhancement } from '../lib/aiEngine';
import { Companion } from '../components/Companion';
import { GhostButton } from '../components/GhostButton';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { ThinkingDots } from '../components/ThinkingDots';
import { Typewriter } from '../components/Typewriter';

interface Props {
  data: FlowData;
  onRestart: () => void;
  onHome: () => void;
}

type Stage = 'thinking' | 'understanding' | 'suggestions' | 'done';

const LEVEL_META: Record<1 | 2 | 3, { tag: string; index: string }> = {
  1: { tag: '即刻舒缓', index: '01' },
  2: { tag: '进阶观察', index: '02' },
  3: { tag: '就医指引', index: '03' },
};

const RISK_META: Record<
  RiskLevel,
  {
    label: string;
    glow: string;
    chipBg: string;
    chipBorder: string;
    chipText: string;
    dot: string;
  }
> = {
  low: {
    label: '信号轻微 · 留意观察',
    glow: 'rgba(168, 224, 204, 0.55)',
    chipBg: 'rgba(168, 224, 204, 0.12)',
    chipBorder: 'rgba(168, 224, 204, 0.40)',
    chipText: '#A8E0CC',
    dot: '#A8E0CC',
  },
  medium: {
    label: '中等信号 · 主动干预',
    glow: 'rgba(255, 213, 158, 0.55)',
    chipBg: 'rgba(255, 213, 158, 0.14)',
    chipBorder: 'rgba(255, 213, 158, 0.42)',
    chipText: '#FFD59E',
    dot: '#FFD59E',
  },
  high: {
    label: '信号明显 · 建议就医',
    glow: 'rgba(255, 158, 158, 0.55)',
    chipBg: 'rgba(255, 158, 158, 0.14)',
    chipBorder: 'rgba(255, 158, 158, 0.45)',
    chipText: '#FFB8B8',
    dot: '#FF9E9E',
  },
};

export function ResultPage({ data, onRestart, onHome }: Props) {
  const { part, expression } = data;
  const [stage, setStage] = useState<Stage>('thinking');

  // ───── Hybrid AI: 规则引擎 + LLM 增强 ─────────────────────────

  /** 1. 规则引擎结果：同步计算，立即显示 */
  const baseResult = useMemo(
    () => analyzeInput(part, expression),
    [part, expression],
  );

  /** 2. LLM 增强结果：异步获取，后台加载 */
  const [llmEnhancement, setLlmEnhancement] = useState<LLMEnhancement | null>(
    null
  );
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsEnhancing(true);
    enhanceAnalysisWithLLM(baseResult, part, expression)
      .then((enh) => {
        if (!cancelled && enh) setLlmEnhancement(enh);
      })
      .catch(() => {
        // 静默 fallback：LLM 失败不影响现有展示
      })
      .finally(() => {
        if (!cancelled) setIsEnhancing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [baseResult, part, expression]);

  /** 3. Typewriter 文本锁定为基础版本，防止 LLM 更新时重启动画 */
  const interpretationForTypewriter = useMemo(
    () => baseResult.interpretation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /** 4. 合并显示：Typewriter 完成后才应用 LLM 增强（避免动画中断） */
  const canApplyEnhanced = stage === 'suggestions' || stage === 'done';

  const result = useMemo(() => {
    if (!llmEnhancement || !canApplyEnhanced) return baseResult;
    return {
      ...baseResult,
      reasoning: {
        ...baseResult.reasoning,
        rationale:
          llmEnhancement.reasoning || baseResult.reasoning.rationale,
      },
      emotionReasoning:
        llmEnhancement.emotionReasoning || baseResult.emotionReasoning,
    };
  }, [baseResult, llmEnhancement, canApplyEnhanced]);

  useEffect(() => {
    const t = window.setTimeout(() => setStage('understanding'), 1500);
    return () => window.clearTimeout(t);
  }, []);

  const handleUnderstandDone = () => {
    window.setTimeout(() => setStage('suggestions'), 500);
    window.setTimeout(() => setStage('done'), 500 + 1400);
  };

  const showSuggestions = stage === 'suggestions' || stage === 'done';
  const showRestart = stage === 'done';
  const partLabel = BODY_LABEL[part];
  const risk = RISK_META[result.riskLevel];

  return (
    <main className="relative min-h-screen sky-bg stars">
      {/* Faint risk-tint glow at top */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[420px] blur-3xl opacity-50"
        style={{
          background: `radial-gradient(ellipse 60% 100% at 50% 0%, ${risk.glow}, transparent 70%)`,
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 pt-6 pb-3 mx-auto max-w-md lg:max-w-6xl">
        <button
          type="button"
          onClick={onRestart}
          className="text-sm text-ink-tertiary hover:text-ink-primary transition-colors"
        >
          ← 再说一次
        </button>
        <span className="text-[12px] text-ink-tertiary tracking-soft">
          ✨ 完成
        </span>
      </header>

      <div className="relative px-5 sm:px-8 pb-20 mx-auto max-w-md lg:max-w-6xl">
        {/* hero — keep narrow and centered */}
        <section className="flex flex-col items-center text-center pt-2 mx-auto max-w-md">
          <Companion
            mood={
              stage === 'thinking'
                ? 'thinking'
                : result.riskLevel === 'high'
                  ? 'worried'
                  : 'relieved'
            }
            size={104}
          />
          <h1 className="mt-7 text-[26px] font-bold tracking-soft animate-fade-up">
            我听懂啦
          </h1>
          <p
            className="mt-1.5 text-[14px] text-ink-tertiary animate-fade-up"
            style={{ animationDelay: '120ms' }}
          >
            把你的{partLabel},轻轻地放在我心里啦
          </p>
        </section>

        {/* Narrative cards — side by side on landscape */}
        <div className="mt-9 lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
          {/* You said */}
          <section className="animate-fade-up" style={{ animationDelay: '260ms' }}>
            <SectionLabel>你说</SectionLabel>
            <GlassCard radius="xl" size="md" glow="soft" className="mt-3">
              <div className="text-[18px] leading-relaxed text-ink-primary font-medium">
                {expression ? (
                  <>
                    <span className="text-ink-tertiary text-[15px] mr-1">"</span>
                    {expression}
                    <span className="text-ink-tertiary text-[15px] ml-1">"</span>
                  </>
                ) : (
                  <span className="text-ink-secondary">
                    (我没听到具体的话,但我感受到了你)
                  </span>
                )}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 px-3 h-7 rounded-full bg-white/[0.05] border border-white/10 text-[12px] text-ink-tertiary">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: risk.dot }}
                />
                关于 {partLabel}
              </div>
            </GlassCard>
          </section>

          {/* I understand */}
          <section className="mt-7 lg:mt-0 animate-fade-up" style={{ animationDelay: '460ms' }}>
            <SectionLabel>我理解为</SectionLabel>
            <GlassCard
              radius="xl"
              size="md"
              glow="medium"
              className="mt-3 min-h-[150px] relative overflow-hidden"
            >
              <div
                className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-40"
                style={{ background: risk.glow }}
              />
              <div className="relative">
                {stage === 'thinking' ? (
                  <div className="flex items-center gap-3 text-ink-secondary text-[16px] py-2">
                    <ThinkingDots dotClassName="bg-brand-primary" />
                    <span>让我把孩子的话整理一下…</span>
                  </div>
                ) : (
                  <div className="text-[17px] leading-[1.85] text-ink-primary">
                    <Typewriter
                      text={interpretationForTypewriter}
                      speed={38}
                      onDone={handleUnderstandDone}
                    />
                    {/* LLM 陪伴洞察：Typewriter 完成后淡入 */}
                    {canApplyEnhanced && llmEnhancement?.interpretation && (
                      <div className="mt-4 pt-4 border-t border-white/[0.08] animate-fade-up">
                        <p className="text-[14.5px] text-ink-secondary leading-[1.85] italic">
                          {llmEnhancement.interpretation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          </section>
        </div>

        {/* How SomaKids understood */}
        {showSuggestions && (
          <section className="mt-9 animate-fade-up">
            <div className="flex items-center gap-2">
              <SectionLabel>SomaKids 是怎么理解的？</SectionLabel>
              {isEnhancing && !llmEnhancement && (
                <span className="text-[11px] text-ink-tertiary animate-pulse">
                  ✨ AI 深度理解中…
                </span>
              )}
            </div>
            <GlassCard
              radius="xl"
              size="md"
              glow="soft"
              className="mt-3 relative overflow-hidden"
            >
              <div
                className="pointer-events-none absolute -top-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-30"
                style={{ background: risk.glow }}
              />
              <div className="relative">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {result.reasoning.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] text-[12px] text-ink-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Rationale */}
                <div
                  className="mt-5 pl-4 border-l-2"
                  style={{ borderColor: `${risk.dot}40` }}
                >
                  <p className="text-[14px] text-ink-secondary leading-[1.9]">
                    {result.reasoning.rationale}
                  </p>
                </div>
              </div>
            </GlassCard>
          </section>
        )}

        {/* Emotion signals */}
        {showSuggestions && result.emotionSignals.length > 0 && (
          <section className="mt-9 animate-fade-up">
            <SectionLabel>也可能和情绪有关</SectionLabel>
            <GlassCard
              radius="xl"
              size="md"
              glow="soft"
              className="mt-3 relative overflow-hidden"
            >
              <div
                className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-25"
                style={{ background: 'rgba(255, 200, 180, 0.35)' }}
              />
              <div className="relative">
                {/* Emotion chips */}
                <div className="flex flex-wrap gap-2">
                  {result.emotionSignals.map((es) => (
                    <span
                      key={es.emotion}
                      className="inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] text-[13px] text-ink-secondary"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'rgba(255, 184, 160, 0.8)' }}
                      />
                      {es.emotion}
                      <span className="text-[11px] text-ink-tertiary opacity-60">
                        {Math.round(es.confidence * 100)}%
                      </span>
                    </span>
                  ))}
                </div>

                {/* Emotion reasoning */}
                {result.emotionReasoning && (
                  <div
                    className="mt-5 pl-4 border-l-2"
                    style={{ borderColor: 'rgba(255, 184, 160, 0.25)' }}
                  >
                    <p className="text-[14px] text-ink-secondary leading-[1.9]">
                      {result.emotionReasoning}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </section>
        )}

        {/* Suggestions — two-column grid on landscape */}
        {showSuggestions && (
          <section className="mt-9 animate-fade-up">
            <div className="flex items-center justify-between gap-3 px-1">
              <SectionLabel>可以这样试试</SectionLabel>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full border text-[11px] font-medium whitespace-nowrap"
                style={{
                  background: risk.chipBg,
                  borderColor: risk.chipBorder,
                  color: risk.chipText,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: risk.dot }}
                />
                {risk.label}
              </span>
            </div>
            <p className="mt-2 px-1 text-[12.5px] text-ink-tertiary leading-relaxed">
              建议按照「即刻 → 观察 → 就医」的顺序逐级判断,程度由浅至深。
            </p>
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
              {result.suggestions.map((s) => (
                <SuggestionCard
                  key={s.level}
                  suggestion={s}
                  glow={risk.glow}
                  delay={(s.level - 1) * 220}
                  className={s.level === 3 ? 'lg:col-span-2' : ''}
                />
              ))}
            </div>

            {/* LLM 温暖建议：额外的情感陪伴建议 */}
            {canApplyEnhanced && llmEnhancement?.suggestion && (
              <GlassCard
                radius="xl"
                size="sm"
                glow="soft"
                className="mt-3 animate-fade-up"
                style={{ animationDelay: '800ms' }}
              >
                <div className="flex gap-4 items-start">
                  <div className="relative shrink-0">
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-50"
                      style={{ background: risk.glow }}
                    />
                    <div className="relative w-12 h-12 rounded-full glass-strong flex items-center justify-center text-[22px]">
                      💡
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] tracking-[0.12em] text-ink-tertiary font-mono">
                        AI
                      </span>
                      <span className="text-[12px] text-ink-tertiary">
                        陪伴建议
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] text-ink-secondary leading-relaxed">
                      {llmEnhancement.suggestion}
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}
          </section>
        )}

        {/* Restart */}
        {showRestart && (
          <section
            className="mt-10 animate-fade-up mx-auto max-w-md lg:max-w-xl"
            style={{ animationDelay: '200ms' }}
          >
            <GradientButton onClick={onRestart} className="w-full">
              再听一次身体的话 ✨
            </GradientButton>
            <div className="mt-3 flex justify-center">
              <GhostButton size="md" onClick={onHome}>
                返回首页
              </GhostButton>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="w-1 h-4 rounded-full bg-grad-aurora" />
      <span className="text-[13px] font-semibold tracking-[0.06em] text-ink-secondary">
        {children}
      </span>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  glow,
  delay,
  className = '',
}: {
  suggestion: Suggestion;
  glow: string;
  delay: number;
  className?: string;
}) {
  const meta = LEVEL_META[suggestion.level];
  return (
    <GlassCard
      radius="xl"
      size="sm"
      glow="soft"
      className={`animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex gap-4 items-start">
        <div className="relative shrink-0">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-70"
            style={{ background: glow }}
          />
          <div className="relative w-14 h-14 rounded-full glass-strong flex items-center justify-center text-[26px] leading-none">
            {suggestion.emoji}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] tracking-[0.12em] text-ink-tertiary font-mono">
              {meta.index}
            </span>
            <span className="text-[12px] text-ink-tertiary">{meta.tag}</span>
          </div>
          <div className="mt-1 text-[16px] font-semibold text-ink-primary leading-snug">
            {suggestion.title}
          </div>
          <div className="mt-1 text-[13.5px] text-ink-secondary leading-relaxed">
            {suggestion.detail}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
