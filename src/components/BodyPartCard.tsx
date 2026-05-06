import type { ReactNode } from 'react';
import type { BodyPart } from '../types';

interface Props {
  part: BodyPart;
  active?: boolean;
  onSelect: () => void;
  delay?: number;
}

const META: Record<
  BodyPart,
  {
    label: string;
    sublabel: string;
    gradient: string;
    glowColor: string;
    icon: ReactNode;
  }
> = {
  head: {
    label: '头',
    sublabel: '小脑袋',
    gradient: 'bg-grad-aurora',
    glowColor: 'rgba(123, 107, 255, 0.45)',
    icon: (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <defs>
          <radialGradient id="g-head" cx="38%" cy="32%" r="80%">
            <stop offset="0%" stopColor="#C8B8FF" />
            <stop offset="55%" stopColor="#8B7FE8" />
            <stop offset="100%" stopColor="#4F7FE8" />
          </radialGradient>
        </defs>
        <ellipse cx="40" cy="38" rx="22" ry="26" fill="url(#g-head)" />
        <circle cx="20" cy="22" r="1.4" fill="#FFFFFF" opacity="0.7" />
        <circle cx="62" cy="20" r="1" fill="#FFFFFF" opacity="0.6" />
        <circle cx="56" cy="62" r="1.2" fill="#FFFFFF" opacity="0.5" />
      </svg>
    ),
  },
  chest: {
    label: '胸口',
    sublabel: '小心脏',
    gradient: 'bg-grad-dawn',
    glowColor: 'rgba(255, 184, 216, 0.5)',
    icon: (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <defs>
          <radialGradient id="g-chest" cx="40%" cy="35%" r="85%">
            <stop offset="0%" stopColor="#FFE0EC" />
            <stop offset="55%" stopColor="#FFB8D8" />
            <stop offset="100%" stopColor="#A48EFF" />
          </radialGradient>
        </defs>
        <path
          d="M40,62 C28,52 14,40 14,28 C14,18 22,14 28,16 C32,17 36,20 40,26 C44,20 48,17 52,16 C58,14 66,18 66,28 C66,40 52,52 40,62 Z"
          fill="url(#g-chest)"
        />
      </svg>
    ),
  },
  stomach: {
    label: '肚子',
    sublabel: '小肚肚',
    gradient: 'bg-grad-dusk',
    glowColor: 'rgba(168, 224, 204, 0.45)',
    icon: (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <defs>
          <radialGradient id="g-stomach" cx="40%" cy="34%" r="80%">
            <stop offset="0%" stopColor="#D4F0E4" />
            <stop offset="55%" stopColor="#A8E0CC" />
            <stop offset="100%" stopColor="#6BB8FF" />
          </radialGradient>
        </defs>
        <path
          d="M40,12 C58,12 68,26 64,42 C70,54 54,66 40,62 C26,66 10,54 16,42 C12,26 22,12 40,12 Z"
          fill="url(#g-stomach)"
        />
      </svg>
    ),
  },
};

export function BodyPartCard({ part, active = false, onSelect, delay = 0 }: Props) {
  const meta = META[part];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full glass rounded-xl p-7 sm:p-8 text-left
                  transition-all duration-300 ease-soft animate-fade-up
                  hover:scale-[1.025] hover:bg-white/[0.10]
                  active:scale-[0.98]
                  ${active ? 'ring-2 ring-brand-primary/60 shadow-glow-medium' : 'shadow-glow-soft'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* aura behind icon */}
      <div
        className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-40 transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: meta.glowColor }}
      />

      <div className="relative flex flex-col items-center gap-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 transition-transform duration-500 ease-soft group-hover:scale-105">
          {meta.icon}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-ink-primary tracking-soft">
            {meta.label}
          </div>
          <div className="mt-1 text-sm text-ink-tertiary">{meta.sublabel}</div>
        </div>
      </div>
    </button>
  );
}
