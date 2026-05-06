import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'md' | 'lg';
}

const HEIGHT = { md: 'h-12 px-6 text-[15px]', lg: 'h-14 px-8 text-base' } as const;

export function GradientButton({
  children,
  size = 'lg',
  className = '',
  ...rest
}: Props) {
  return (
    <button
      className={`group relative ${HEIGHT[size]} rounded
                  bg-grad-aurora text-white font-semibold tracking-soft
                  shadow-btn-primary
                  transition-all duration-300 ease-soft
                  hover:shadow-btn-primary-hover hover:scale-[1.02]
                  active:scale-[0.97]
                  disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100
                  ${className}`}
      {...rest}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t bg-gradient-to-b from-white/40 to-transparent" />
      <span className="relative">{children}</span>
    </button>
  );
}
