'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card, type CardProps };
