interface Props {
  step: number;
  total?: number;
  className?: string;
}

export function StepDots({ step, total = 3, className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={`第 ${step} 步,共 ${total} 步`}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const state =
          idx < step ? 'past' : idx === step ? 'current' : 'future';
        const cls =
          state === 'past'
            ? 'w-3 bg-brand-primary/60'
            : state === 'current'
              ? 'w-9 bg-grad-aurora shadow-glow-soft'
              : 'w-3 bg-white/10';
        return (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ease-soft ${cls}`}
          />
        );
      })}
    </div>
  );
}
