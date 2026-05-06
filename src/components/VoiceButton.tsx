import { useEffect, useRef, useState } from 'react';
import { Toast } from './Toast';

type Mode = 'listen' | 'speak';
type Size = 'md' | 'lg';

interface Props {
  /** listen = 麦克风(语音输入); speak = 喇叭(朗读) */
  mode?: Mode;
  size?: Size;
  className?: string;
  /** 自定义 aria-label */
  label?: string;
  /** 自定义点击后的 toast 文案 */
  toastText?: string;
  /** 按钮上方常驻提示词(非激活态) */
  restingLabel?: string;
}

const SIZE_MAP: Record<Size, { box: string; icon: string }> = {
  md: { box: 'w-12 h-12', icon: 'w-5 h-5' },
  lg: { box: 'w-14 h-14', icon: 'w-6 h-6' },
};

export function VoiceButton({
  mode = 'listen',
  size = 'lg',
  className = '',
  label,
  toastText,
  restingLabel,
}: Props) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick = () => {
    setActive(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setActive(false);
      timerRef.current = null;
    }, 1800);
  };

  const aria = label ?? (mode === 'listen' ? '语音输入' : '朗读这段话');
  const message =
    toastText ??
    (mode === 'listen' ? '正在听你说…' : '正在为你读出这段话…');
  const sz = SIZE_MAP[size];

  return (
    <>
      <span
        className={`relative inline-flex flex-col items-center gap-2 ${className}`}
      >
        {/* Reserved label space — prevents layout shift */}
        <div className="h-5 flex items-center justify-center w-full">
          {active ? (
            <span className="text-[11px] text-brand-primary whitespace-nowrap animate-fade-in">
              {message}
            </span>
          ) : restingLabel ? (
            <span className="text-[11px] text-ink-tertiary whitespace-nowrap">
              {restingLabel}
            </span>
          ) : null}
        </div>

        <span className="relative inline-flex shrink-0">
          {/* Resting outer aura — soft breathing, always on */}
          <span
            className="pointer-events-none absolute inset-[-30%] rounded-full bg-grad-aurora opacity-30 blur-xl animate-breathe"
            aria-hidden
          />

          {/* Click ripple — only while active */}
          {active && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-brand-primary/60 animate-ping"
              aria-hidden
            />
          )}

          <button
            type="button"
            aria-label={aria}
            aria-pressed={active}
            onClick={handleClick}
            className={`relative ${sz.box} rounded-full glass-strong flex items-center justify-center
                        shadow-glow-soft transition-all duration-200 ease-soft active:scale-95
                        hover:bg-white/[0.14] hover:shadow-glow-medium
                        focus-visible:outline-none
                        ${active ? 'bg-white/[0.16]' : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={`${sz.icon} transition-colors ${
                active ? 'text-brand-primary' : 'text-ink-primary'
              }`}
            >
              {mode === 'listen' ? (
                <>
                  <rect x="9" y="3" width="6" height="12" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="9" y1="22" x2="15" y2="22" />
                </>
              ) : (
                <>
                  <path d="M11 5L6 9H3v6h3l5 4V5z" />
                  <path d="M15.5 8.5a4 4 0 0 1 0 7" />
                  <path d="M18.5 5.5a8 8 0 0 1 0 13" />
                </>
              )}
            </svg>

            {/* Active tint ring */}
            {active && (
              <span
                className="pointer-events-none absolute inset-0 rounded-full bg-brand-primary/10"
                aria-hidden
              />
            )}
          </button>
        </span>
      </span>

      {active && <Toast message={message} />}
    </>
  );
}
