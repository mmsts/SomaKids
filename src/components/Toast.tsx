import type { ReactNode } from 'react';

interface Props {
  message: ReactNode;
}

export function Toast({ message }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none animate-fade-up"
    >
      <div className="glass-strong rounded-full px-5 h-11 flex items-center gap-3 shadow-glow-medium">
        <span className="relative inline-flex">
          <span className="absolute inset-0 rounded-full bg-brand-primary/40 animate-ping" />
          <span className="relative w-2 h-2 rounded-full bg-brand-primary" />
        </span>
        <span className="text-[14px] text-ink-primary tracking-soft whitespace-nowrap">
          {message}
        </span>
      </div>
    </div>
  );
}
