'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant: 'simple' | 'medium' | 'complex';
  children: React.ReactNode;
}

function Badge({ variant, children }: BadgeProps) {
  const variantStyles = {
    simple: 'bg-emerald-500/15 text-emerald-400',
    medium: 'bg-amber-500/15 text-amber-400',
    complex: 'bg-rose-500/15 text-rose-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps };
