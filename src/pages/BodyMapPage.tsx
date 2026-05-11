import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BodyPart, ConversationTurn, FlowData } from '../types';
import {
  BODY_GENTLE_QUESTION,
  BODY_LABEL,
  UNSURE_SYMPTOM,
} from '../lib/ai';
import { BodyPartCard } from '../components/BodyPartCard';
import { Companion } from '../components/Companion';
import { GhostButton } from '../components/GhostButton';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { ThinkingDots } from '../components/ThinkingDots';
import { Typewriter } from '../components/Typewriter';
import { VoiceButton } from '../components/VoiceButton';
import { analyzeExpression } from '../services/llmService';
import type {
  ConversationTurn as LLMConversationTurn,
} from '../services/llmService';

interface Props {
  onComplete: (data: FlowData) => void;
}

// ───── Flow Phase ─────────────────────────────────────────────

type FlowPhase = 'select-part' | 'express' | 'ai-thinking' | 'ai-asking';

// ───── Conversation State ─────────────────────────────────────

interface ConvState {
  part: BodyPart | null;
  initialExpression: string;
  hypothesis: string | null;
  question: string | null;
  confidence: number;
  confirmed: string[];
  rejected: string[];
  history: ConversationTurn[];
  round: number;
}

const INITIAL_CONV: ConvState = {
  part: null,
  initialExpression: '',
  hypothesis: null,
  question: null,
  confidence: 0,
  confirmed: [],
  rejected: [],
  history: [],
  round: 0,
};

// ───── Constants ──────────────────────────────────────────────

const CONFIDENCE_THRESHOLD = 70;
const MAX_ROUNDS = 4;
const CONFIDENCE_BOOST = 25;

const HINT_CHIPS: Record<BodyPart, string[]> = {
  head: ['痛痛的', '晕晕的', '闷闷的'],
  chest: ['砰砰跳', '紧紧的', '酸酸的'],
  stomach: ['翻江倒海', '紧张紧张', '咕咕叫'],
};

// ───── Main Component ─────────────────────────────────────────

export function BodyMapPage({ onComplete }: Props) {
  const [phase, setPhase] = useState<FlowPhase>('select-part');
  const [conv, setConv] = useState<ConvState>(INITIAL_CONV);

  // ───── Helpers ──────────────────────────────────────────────

  const buildFullExpression = useCallback((state: ConvState): string => {
    const childTurns = state.history.filter((t) => t.role === 'child');
    return childTurns.map((t) => t.content).join('，');
  }, []);

  const goToResult = useCallback(
    (state: ConvState) => {
      if (!state.part) return;
      onComplete({
        part: state.part,
        expression: buildFullExpression(state) || state.initialExpression,
        symptom: UNSURE_SYMPTOM,
        confirmedAfter: state.round,
      });
    },
    [onComplete, buildFullExpression]
  );

  // ───── Phase: Select Part ───────────────────────────────────

  const handleSelectPart = (p: BodyPart) => {
    setConv((prev) => ({ ...prev, part: p }));
    setPhase('express');
  };

  // ───── Phase: Express ───────────────────────────────────────

  const handleExpressionChange = (value: string) => {
    setConv((prev) => ({ ...prev, initialExpression: value }));
  };

  const handleSubmitExpression = async () => {
    const trimmed = conv.initialExpression.trim();
    if (!conv.part || !trimmed) return;

    const initialTurn: ConversationTurn = {
      role: 'child',
      content: trimmed,
      type: 'initial',
    };

    const nextState: ConvState = {
      ...conv,
      history: [initialTurn],
      round: 1,
    };

    setConv(nextState);
    setPhase('ai-thinking');

    try {
      const result = await analyzeExpression({
        bodyPart: conv.part,
        expression: trimmed,
        history: [initialTurn as LLMConversationTurn],
        confirmed: [],
        rejected: [],
      });

      setConv((prev) => ({
        ...prev,
        hypothesis: result.hypothesis,
        question: result.question,
        confidence: result.confidence,
        history: [
          ...prev.history,
          {
            role: 'companion',
            content: `${result.hypothesis} ${result.question}`,
            type: 'followup',
          },
        ],
      }));
      setPhase('ai-asking');
    } catch {
      goToResult({ ...nextState, confidence: 50 });
    }
  };

  // ───── Phase: AI Asking ─────────────────────────────────────

  const handleYes = async () => {
    const newConfidence = Math.min(100, conv.confidence + CONFIDENCE_BOOST);
    const newConfirmed = [
      ...conv.confirmed,
      ...(conv.hypothesis ? [conv.hypothesis] : []),
    ];
    const newRound = conv.round + 1;

    if (newConfidence >= CONFIDENCE_THRESHOLD || newRound > MAX_ROUNDS) {
      goToResult({
        ...conv,
        confidence: newConfidence,
        confirmed: newConfirmed,
        round: newRound,
      });
      return;
    }

    const answerTurn: ConversationTurn = {
      role: 'child',
      content: '是的',
      type: 'answer',
    };
    const nextHistory = [...conv.history, answerTurn];

    setConv((prev) => ({
      ...prev,
      confidence: newConfidence,
      confirmed: newConfirmed,
      history: nextHistory,
      round: newRound,
    }));
    setPhase('ai-thinking');

    try {
      const result = await analyzeExpression({
        bodyPart: conv.part!,
        expression: conv.initialExpression,
        history: nextHistory as LLMConversationTurn[],
        confirmed: newConfirmed,
        rejected: conv.rejected,
      });

      setConv((prev) => ({
        ...prev,
        hypothesis: result.hypothesis,
        question: result.question,
        confidence: result.confidence,
        history: [
          ...nextHistory,
          {
            role: 'companion',
            content: `${result.hypothesis} ${result.question}`,
            type: 'followup',
          },
        ],
      }));
      setPhase('ai-asking');
    } catch {
      goToResult({
        ...conv,
        confidence: newConfidence,
        confirmed: newConfirmed,
        history: nextHistory,
        round: newRound,
      });
    }
  };

  const handleNo = async () => {
    const newRejected = [
      ...conv.rejected,
      ...(conv.hypothesis ? [conv.hypothesis] : []),
    ];
    const newRound = conv.round + 1;

    if (newRound > MAX_ROUNDS) {
      goToResult({
        ...conv,
        rejected: newRejected,
        round: newRound,
      });
      return;
    }

    const answerTurn: ConversationTurn = {
      role: 'child',
      content: '不太像',
      type: 'answer',
    };
    const nextHistory = [...conv.history, answerTurn];

    setConv((prev) => ({
      ...prev,
      rejected: newRejected,
      history: nextHistory,
      round: newRound,
    }));
    setPhase('ai-thinking');

    try {
      const result = await analyzeExpression({
        bodyPart: conv.part!,
        expression: conv.initialExpression,
        history: nextHistory as LLMConversationTurn[],
        confirmed: conv.confirmed,
        rejected: newRejected,
      });

      setConv((prev) => ({
        ...prev,
        hypothesis: result.hypothesis,
        question: result.question,
        confidence: result.confidence,
        history: [
          ...nextHistory,
          {
            role: 'companion',
            content: `${result.hypothesis} ${result.question}`,
            type: 'followup',
          },
        ],
      }));
      setPhase('ai-asking');
    } catch {
      goToResult({
        ...conv,
        rejected: newRejected,
        history: nextHistory,
        round: newRound,
      });
    }
  };

  // ───── Back Navigation ──────────────────────────────────────

  const handleBack = () => {
    if (phase === 'express') {
      setPhase('select-part');
      setConv(INITIAL_CONV);
    } else if (phase === 'ai-thinking' || phase === 'ai-asking') {
      setPhase('express');
      setConv((prev) => ({
        ...INITIAL_CONV,
        part: prev.part,
        initialExpression: prev.initialExpression,
      }));
    }
  };

  // ───── Render ───────────────────────────────────────────────

  const showBack = phase !== 'select-part';

  const companionMood = useMemo(() => {
    if (phase === 'ai-thinking') return 'thinking';
    if (phase === 'ai-asking') return 'listening';
    return 'listening';
  }, [phase]);

  // Conditional rendering helpers
  const isSelectPart = phase === 'select-part';
  const isExpress = phase === 'express';
  const isAIThinking = phase === 'ai-thinking';
  const isAIAsking = phase === 'ai-asking';
  const isAIPhase = isAIThinking || isAIAsking;

  return (
    <main className="relative min-h-screen sky-bg stars">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-6 pb-3 backdrop-blur-md mx-auto max-w-md lg:max-w-[1400px]">
        <div className="min-w-[88px]">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-ink-tertiary hover:text-ink-primary transition-colors"
            >
              ← 上一步
            </button>
          ) : (
            <span className="text-sm text-ink-tertiary tracking-soft">
              SomaKids
            </span>
          )}
        </div>
        <div className="text-[12px] text-ink-tertiary tracking-soft">
          {isSelectPart ? '开始' : null}
          {isExpress ? '说说看' : null}
          {isAIPhase ? `理解中 · 第 ${conv.round} 轮` : null}
        </div>
        <div className="min-w-[88px]" />
      </header>

      {/* Content */}
      <div className="px-6 sm:px-10 lg:px-16 pt-6 pb-20 mx-auto max-w-md lg:max-w-[1400px] animate-fade-up">
        <div className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-16 lg:items-start">
          {/* Left: Companion + Context */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Companion mood={companionMood} size={128} />

            <div className="mt-6 lg:mt-8">
              <PhaseTitle phase={phase} conv={conv} />
              <PhaseSubtitle phase={phase} conv={conv} />
            </div>

            {/* Child expression reference (visible during AI phases) */}
            {isAIPhase && conv.initialExpression ? (
              <div className="mt-6 hidden lg:block max-w-sm animate-fade-up">
                <div className="text-[12px] text-ink-tertiary mb-2">
                  你说
                </div>
                <div className="text-[15px] text-ink-primary font-medium italic">
                  &ldquo;{conv.initialExpression}&rdquo;
                </div>
                {conv.history.length > 2 ? (
                  <div className="mt-2 text-[13px] text-ink-secondary">
                    {conv.history
                      .filter((t) => t.role === 'child' && t.type === 'answer')
                      .map((t, i) => (
                        <span key={i} className="inline-block mr-3">
                          {t.content === '是的' ? (
                            <span className="text-brand-primary">
                              ✓ {t.content}
                            </span>
                          ) : (
                            <span className="text-ink-tertiary">
                              ✗ {t.content}
                            </span>
                          )}
                        </span>
                      ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Right: Interaction Card */}
          <div className="mt-8 lg:mt-0">
            {isSelectPart ? <SelectPartView onSelect={handleSelectPart} /> : null}

            {isExpress && conv.part ? (
              <ExpressView
                part={conv.part}
                value={conv.initialExpression}
                onChange={handleExpressionChange}
                onSubmit={handleSubmitExpression}
              />
            ) : null}

            {isAIPhase && conv.part ? (
              <AIConversationView
                key={`round-${conv.round}-${conv.hypothesis}`}
                phase={phase}
                conv={conv}
                onYes={handleYes}
                onNo={handleNo}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

// ───── Sub-Components ─────────────────────────────────────────

function PhaseTitle({
  phase,
  conv,
}: {
  phase: FlowPhase;
  conv: ConvState;
}) {
  if (phase === 'select-part') {
    return (
      <h1 className="text-[28px] lg:text-[36px] font-bold tracking-soft leading-snug">
        今天，哪里不太舒服？
      </h1>
    );
  }
  if (phase === 'express') {
    return (
      <h1 className="text-[28px] lg:text-[36px] font-bold tracking-soft leading-snug">
        <span className="bg-grad-aurora bg-clip-text text-transparent">
          「{conv.part ? BODY_LABEL[conv.part] : ''}」
        </span>
      </h1>
    );
  }
  if (phase === 'ai-thinking') {
    return (
      <h1 className="text-[24px] lg:text-[30px] font-bold tracking-soft leading-snug text-ink-secondary">
        让我想一想…
      </h1>
    );
  }
  // ai-asking
  return (
    <h1 className="text-[22px] lg:text-[28px] font-bold tracking-soft leading-snug">
      我好像明白了一点…
    </h1>
  );
}

function PhaseSubtitle({
  phase,
  conv,
}: {
  phase: FlowPhase;
  conv: ConvState;
}) {
  if (phase === 'select-part') {
    return (
      <p className="mt-2 text-[15px] lg:text-[16px] text-ink-secondary">
        点一点告诉我，我会陪你慢慢说。
      </p>
    );
  }
  if (phase === 'express') {
    return (
      <p className="mt-2 text-[15px] lg:text-[16px] text-ink-secondary">
        {conv.part ? BODY_GENTLE_QUESTION[conv.part] : ''}
      </p>
    );
  }
  if (phase === 'ai-thinking') {
    return (
      <p className="mt-2 text-[14px] lg:text-[15px] text-ink-tertiary">
        SomaKids 在理解你的感受…
      </p>
    );
  }
  // ai-asking
  return (
    <p className="mt-2 text-[14px] lg:text-[15px] text-ink-tertiary">
      如果你觉得不像，告诉我「不太像」就好。
    </p>
  );
}

// ───── Select Part View ───────────────────────────────────────

function SelectPartView({ onSelect }: { onSelect: (p: BodyPart) => void }) {
  return (
    <section className="flex flex-col items-center lg:items-start">
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8 mt-4 lg:mt-12">
        <BodyPartCard part="head" onSelect={() => onSelect('head')} delay={0} />
        <BodyPartCard part="chest" onSelect={() => onSelect('chest')} delay={120} />
        <BodyPartCard part="stomach" onSelect={() => onSelect('stomach')} delay={240} />
      </div>
    </section>
  );
}

// ───── Express View ───────────────────────────────────────────

interface ExpressViewProps {
  part: BodyPart;
  value: string;
  onChange: (s: string) => void;
  onSubmit: () => void;
}

function ExpressView({ part, value, onChange, onSubmit }: ExpressViewProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = value.trim().length > 0;

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 400);
    return () => window.clearTimeout(t);
  }, []);

  const addChip = (chip: string) => {
    const next = value.trim() ? `${value.trim()} ${chip}` : chip;
    onChange(next);
    inputRef.current?.focus();
  };

  return (
    <section className="flex flex-col">
      <div className="lg:flex lg:items-stretch lg:gap-8">
        <GlassCard radius="xl" size="lg" glow="medium" className="w-full">
          <textarea
            ref={inputRef}
            rows={4}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
                onSubmit();
              }
            }}
            placeholder="比如:像翻江倒海一样……"
            className="w-full bg-transparent resize-none outline-none
                       text-ink-primary placeholder:text-ink-tertiary
                       text-[18px] leading-relaxed"
          />

          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-[13px] text-ink-tertiary">
                说不出来?试试这些 ✨
              </div>
              <div className="flex lg:hidden">
                <VoiceButton
                  mode="listen"
                  size="md"
                  restingLabel="点我录音"
                  toastText="正在听你说…"
                />
              </div>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap gap-2">
              {HINT_CHIPS[part].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addChip(chip)}
                  className="px-4 h-9 rounded-full text-[13px] text-ink-secondary
                             bg-white/[0.05] border border-white/10
                             hover:bg-white/[0.10] hover:text-ink-primary
                             transition-all duration-200 ease-soft active:scale-95"
                >
                  # {chip}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="hidden lg:flex flex-col items-center justify-center gap-2 min-w-[5.5rem]">
          <VoiceButton
            mode="listen"
            size="lg"
            restingLabel="点我录音"
            toastText="正在听你说…"
          />
        </div>
      </div>

      <div className="mt-8 w-full">
        <GradientButton onClick={onSubmit} disabled={!canSubmit} className="w-full">
          告诉我 →
        </GradientButton>
      </div>

      <p className="mt-4 text-[13px] text-ink-tertiary text-center lg:text-left">
        说一两个词也可以，身体的话我都听得懂。也可以点 🎤 用嘴巴告诉我。
      </p>
    </section>
  );
}

// ───── AI Conversation View ───────────────────────────────────

interface AIConversationViewProps {
  phase: 'ai-thinking' | 'ai-asking';
  conv: ConvState;
  onYes: () => void;
  onNo: () => void;
}

function AIConversationView({
  phase,
  conv,
  onYes,
  onNo,
}: AIConversationViewProps) {
  const isThinking = phase === 'ai-thinking';

  return (
    <section className="flex flex-col">
      <GlassCard
        radius="xl"
        size="lg"
        glow="medium"
        className="w-full min-h-[220px]"
      >
        {/* Status bar */}
        <div className="flex items-center justify-between gap-3 text-[12px] text-ink-tertiary tracking-soft mb-5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-brand-primary animate-pulse-soft' : 'bg-brand-primary'}`}
            />
            {isThinking
              ? `SomaKids 正在理解你…（第 ${conv.round} 轮）`
              : 'SomaKids 想确认一下'}
          </div>
          {!isThinking && conv.confidence > 0 ? (
            <span className="text-[11px] opacity-60">
              理解度 {conv.confidence}%
            </span>
          ) : null}
        </div>

        {/* Mobile: child expression reference */}
        <div className="lg:hidden mb-4 pb-3 border-b border-white/[0.06]">
          <div className="text-[12px] text-ink-tertiary mb-1">你说</div>
          <div className="text-[14px] text-ink-primary font-medium italic">
            &ldquo;{conv.initialExpression}&rdquo;
          </div>
        </div>

        {isThinking ? (
          <ThinkingContent />
        ) : (
          <AskingContent conv={conv} onYes={onYes} onNo={onNo} />
        )}
      </GlassCard>
    </section>
  );
}

function ThinkingContent() {
  return (
    <div className="flex flex-col items-start gap-4 py-4">
      <div className="flex items-center gap-3 text-ink-secondary text-[17px]">
        <ThinkingDots dotClassName="bg-brand-primary" />
        <span className="animate-pulse">让我再想想…</span>
      </div>
      <p className="text-[14px] text-ink-tertiary leading-relaxed max-w-md">
        SomaKids 在认真听你说话，试着理解你身体的小信号…
      </p>
    </div>
  );
}

function AskingContent({
  conv,
  onYes,
  onNo,
}: {
  conv: ConvState;
  onYes: () => void;
  onNo: () => void;
}) {
  const hypothesis = conv.hypothesis || '';
  const question = conv.question || '';

  return (
    <div className="flex flex-col">
      {/* Hypothesis — revealed with Typewriter */}
      <div className="min-h-[4em]">
        <div className="text-[17px] lg:text-[19px] font-medium leading-relaxed text-ink-primary">
          <Typewriter text={hypothesis} speed={40} />
        </div>
      </div>

      {/* Question */}
      {question ? (
        <div className="mt-4 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <span className="text-[16px] lg:text-[18px] text-ink-primary font-medium">
              {question}
            </span>
          </div>
        </div>
      ) : null}

      {/* Buttons */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <GradientButton onClick={onYes} className="w-full">
          是的
        </GradientButton>
        <GhostButton size="lg" onClick={onNo} className="w-full">
          不太像
        </GhostButton>
      </div>
    </div>
  );
}
