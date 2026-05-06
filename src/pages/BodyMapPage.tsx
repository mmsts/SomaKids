import { useEffect, useMemo, useRef, useState } from 'react';
import type { BodyPart, FlowData, Symptom } from '../types';
import {
  BODY_GENTLE_QUESTION,
  BODY_LABEL,
  UNSURE_SYMPTOM,
  rankSymptoms,
} from '../lib/ai';
import { BodyPartCard } from '../components/BodyPartCard';
import { Companion } from '../components/Companion';
import { GhostButton } from '../components/GhostButton';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { StepDots } from '../components/StepDots';
import { ThinkingDots } from '../components/ThinkingDots';
import { Typewriter } from '../components/Typewriter';
import { VoiceButton } from '../components/VoiceButton';

interface Props {
  onComplete: (data: FlowData) => void;
}

export function BodyMapPage({ onComplete }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [part, setPart] = useState<BodyPart | null>(null);
  const [expression, setExpression] = useState('');
  const [guessIndex, setGuessIndex] = useState(0);

  const ranked = useMemo(
    () => (part ? rankSymptoms(part, expression) : []),
    [part, expression],
  );

  const handleSelectPart = (p: BodyPart) => {
    setPart(p);
    setStep(2);
  };

  const handleSubmitExpression = () => {
    if (!part) return;
    setGuessIndex(0);
    setStep(3);
  };

  const handleAnswer = (yes: boolean) => {
    if (!part) return;
    const current = ranked[guessIndex];
    if (yes) {
      onComplete({
        part,
        expression: expression.trim(),
        symptom: current,
        confirmedAfter: guessIndex + 1,
      });
      return;
    }
    if (guessIndex < 1 && ranked[1]) {
      setGuessIndex(1);
      return;
    }
    onComplete({
      part,
      expression: expression.trim(),
      symptom: UNSURE_SYMPTOM,
      confirmedAfter: guessIndex + 1,
    });
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setPart(null);
      setExpression('');
    } else if (step === 3) {
      setGuessIndex(0);
      setStep(2);
    }
  };

  return (
    <main className="relative min-h-screen sky-bg stars">
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-6 pb-3 backdrop-blur-md mx-auto max-w-md lg:max-w-[1400px]">
        <div className="min-w-[88px]">
          {step > 1 ? (
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
        <StepDots step={step} total={3} />
        <div className="min-w-[88px]" />
      </header>

      <div
        key={step}
        className="px-6 sm:px-10 lg:px-16 pt-8 pb-20 mx-auto max-w-md lg:max-w-[1400px] animate-fade-up"
      >
        {step === 1 && <Step1 onSelect={handleSelectPart} />}
        {step === 2 && part && (
          <Step2
            part={part}
            value={expression}
            onChange={setExpression}
            onSubmit={handleSubmitExpression}
          />
        )}
        {step === 3 && part && ranked[guessIndex] && (
          <Step3
            key={guessIndex}
            symptom={ranked[guessIndex]}
            attempt={guessIndex + 1}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </main>
  );
}

/* ── Step 1 ─────────────────────────────────────────────────────────── */

function Step1({ onSelect }: { onSelect: (p: BodyPart) => void }) {
  return (
    <section className="flex flex-col items-center text-center">
      <Companion mood="idle" size={140} />

      <h1 className="mt-10 text-[30px] lg:text-[40px] font-bold tracking-soft leading-snug">
        今天,哪里不太舒服?
      </h1>
      <p className="mt-3 text-[16px] lg:text-[18px] text-ink-secondary max-w-xl">
        点一点告诉我,我会陪你慢慢说。
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8 w-full">
        <BodyPartCard part="head" onSelect={() => onSelect('head')} delay={0} />
        <BodyPartCard
          part="chest"
          onSelect={() => onSelect('chest')}
          delay={120}
        />
        <BodyPartCard
          part="stomach"
          onSelect={() => onSelect('stomach')}
          delay={240}
        />
      </div>
    </section>
  );
}

/* ── Step 2 ─────────────────────────────────────────────────────────── */

const HINT_CHIPS: Record<BodyPart, string[]> = {
  head: ['痛痛的', '晕晕的', '闷闷的'],
  chest: ['砰砰跳', '紧紧的', '酸酸的'],
  stomach: ['翻江倒海', '紧张紧张', '咕咕叫'],
};

interface Step2Props {
  part: BodyPart;
  value: string;
  onChange: (s: string) => void;
  onSubmit: () => void;
}

function Step2({ part, value, onChange, onSubmit }: Step2Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = value.trim().length > 0;

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 480);
    return () => window.clearTimeout(t);
  }, []);

  const addChip = (chip: string) => {
    const next = value.trim() ? `${value.trim()} ${chip}` : chip;
    onChange(next);
    inputRef.current?.focus();
  };

  return (
    <section className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-16 lg:items-center">
      {/* Hero column — ~40% */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <Companion mood="idle" size={128} />
        <div className="mt-8">
          <div className="text-[16px] lg:text-[18px] text-ink-tertiary">你点了</div>
          <h2 className="mt-2 text-[32px] lg:text-[44px] font-bold tracking-soft leading-tight">
            <span className="bg-grad-aurora bg-clip-text text-transparent">
              「{BODY_LABEL[part]}」
            </span>
          </h2>
          <p className="mt-3 text-[16px] lg:text-[18px] text-ink-secondary leading-relaxed max-w-md lg:max-w-sm">
            {BODY_GENTLE_QUESTION[part]}
          </p>
        </div>
      </div>

      {/* Card column — ~60% */}
      <div className="mt-10 lg:mt-0 flex flex-col items-stretch text-left">
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

          {/* Desktop voice orb — outside the card */}
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
          <GradientButton
            onClick={onSubmit}
            disabled={!canSubmit}
            className="w-full"
          >
            继续 →
          </GradientButton>
        </div>

        <p className="mt-4 text-[13px] text-ink-tertiary text-center lg:text-left">
          说一两个词也可以,身体的话我都听得懂。也可以点 🎤 用嘴巴告诉我。
        </p>
      </div>
    </section>
  );
}

/* ── Step 3 ─────────────────────────────────────────────────────────── */

interface Step3Props {
  symptom: Symptom;
  attempt: number;
  onAnswer: (yes: boolean) => void;
}

function Step3({ symptom, attempt, onAnswer }: Step3Props) {
  const [phase, setPhase] = useState<'thinking' | 'guess'>('thinking');

  useEffect(() => {
    setPhase('thinking');
    const t = window.setTimeout(() => setPhase('guess'), 1200);
    return () => window.clearTimeout(t);
  }, [symptom.id]);

  const intro =
    attempt === 1 ? '嗯…让我想想…' : '那也许…是另一种感觉?';

  return (
    <section className="lg:grid lg:grid-cols-[2fr_3fr] lg:gap-16 lg:items-center">
      {/* Hero column */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <Companion mood="thinking" size={132} />
        <div className="hidden lg:block mt-8 max-w-sm">
          <div className="text-[16px] text-ink-tertiary">SomaKids 正在猜测…</div>
          <p className="mt-3 text-[17px] text-ink-secondary leading-relaxed">
            如果说得不太像也没关系,告诉我「不太是」就好,我们一起再想一想。
          </p>
        </div>
      </div>

      {/* Dialog column */}
      <div className="mt-10 lg:mt-0">
        <GlassCard
          size="lg"
          radius="xl"
          glow="medium"
          className="w-full text-left min-h-[220px]"
        >
          <div className="flex items-center justify-between gap-3 text-[12px] text-ink-tertiary tracking-soft">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse-soft" />
              SomaKids 在听你说
            </div>
            {phase === 'guess' && (
              <VoiceButton
                mode="speak"
                size="md"
                restingLabel="再听一遍"
                toastText="正在为你读出这段话…"
              />
            )}
          </div>

          <div className="mt-5 min-h-[5.5em]">
            {phase === 'thinking' ? (
              <span className="inline-flex items-center gap-3 text-ink-secondary text-[16px]">
                {intro}
                <ThinkingDots dotClassName="bg-brand-primary" />
              </span>
            ) : (
              <>
                <div className="text-ink-tertiary text-[14px] mb-2 animate-fade-in">
                  {intro}
                </div>
                <div className="text-[20px] font-medium leading-relaxed text-ink-primary">
                  <Typewriter text={symptom.guess} speed={48} />
                </div>
              </>
            )}
          </div>
        </GlassCard>

        <div className="mt-7 grid grid-cols-2 gap-3 w-full">
          <GradientButton
            onClick={() => onAnswer(true)}
            disabled={phase !== 'guess'}
            className="w-full"
          >
            是的!
          </GradientButton>
          <GhostButton
            size="lg"
            onClick={() => onAnswer(false)}
            disabled={phase !== 'guess'}
            className="w-full"
          >
            不太是
          </GhostButton>
        </div>

        {attempt > 1 && (
          <p className="mt-5 text-[12px] text-ink-tertiary text-center lg:text-left animate-fade-in">
            再不像也没关系,我们一起说「说不清楚」就好。
          </p>
        )}
      </div>
    </section>
  );
}
