interface Props {
  className?: string;
  dotClassName?: string;
}

export function ThinkingDots({ className = '', dotClassName = 'bg-ink-secondary' }: Props) {
  return (
    <span
      className={`inline-flex items-end gap-1.5 ${className}`}
      role="status"
      aria-label="思考中"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`block w-2 h-2 rounded-full ${dotClassName} animate-dot-bounce`}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}
