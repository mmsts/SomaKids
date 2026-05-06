import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  glow?: 'none' | 'soft' | 'medium' | 'strong';
  radius?: 'lg' | 'xl' | '2xl';
  className?: string;
}

const PADDING = { sm: 'p-5', md: 'p-7', lg: 'p-9' } as const;
const GLOW = {
  none: '',
  soft: 'shadow-glow-soft',
  medium: 'shadow-glow-medium',
  strong: 'shadow-glow-strong',
} as const;
const RADIUS = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
} as const;

export function GlassCard({
  children,
  size = 'md',
  glow = 'soft',
  radius = 'xl',
  className = '',
  ...rest
}: Props) {
  return (
    <div
      className={`glass ${RADIUS[radius]} ${PADDING[size]} ${GLOW[glow]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
