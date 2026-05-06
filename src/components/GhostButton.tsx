import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'md' | 'lg';
}

const HEIGHT = { md: 'h-12 px-5 text-[15px]', lg: 'h-14 px-7 text-base' } as const;

export function GhostButton({
  children,
  size = 'md',
  className = '',
  ...rest
}: Props) {
  return (
    <button
      className={`glass ${HEIGHT[size]} rounded text-ink-primary font-medium tracking-soft
                  transition-all duration-300 ease-soft
                  hover:bg-white/[0.10] hover:scale-[1.02]
                  active:scale-[0.97]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-transparent
                  ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
