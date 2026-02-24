'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = ['Client Info', 'Project', 'Features', 'Design', 'Budget'];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                {/* Neumorphic circle */}
                <div
                  className="relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300"
                  style={
                    isCompleted
                      ? {
                          /* Pressed-in concave — completed */
                          background: '#252528',
                          boxShadow: [
                            'inset 4px 4px 10px rgba(0,0,0,0.55)',
                            'inset -3px -3px 8px rgba(50,50,55,0.06)',
                            '0 0 10px rgba(184,115,51,0.12)',
                          ].join(','),
                          border: '1px solid rgba(184,115,51,0.2)',
                        }
                      : isCurrent
                        ? {
                            /* Pressed-in concave — current active */
                            background: '#252528',
                            boxShadow: [
                              'inset 4px 4px 10px rgba(0,0,0,0.55)',
                              'inset -3px -3px 8px rgba(50,50,55,0.06)',
                              '0 0 14px rgba(184,115,51,0.15)',
                            ].join(','),
                            border: '1px solid rgba(184,115,51,0.25)',
                          }
                        : {
                            /* Raised convex — inactive */
                            background: 'linear-gradient(145deg, #303035, #262629)',
                            boxShadow: [
                              '5px 5px 12px rgba(0,0,0,0.45)',
                              '-3px -3px 8px rgba(50,50,55,0.05)',
                            ].join(','),
                            border: '1px solid rgba(200,200,210,0.03)',
                          }
                  }
                >
                  {/* Gold arc on current or completed step */}
                  {(isCurrent || isCompleted) && (
                    <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'conic-gradient(from 200deg at 50% 0%, transparent 0deg, rgba(184,115,51,0.2) 30deg, rgba(212,148,76,0.5) 70deg, rgba(184,115,51,0.6) 90deg, rgba(212,148,76,0.5) 110deg, rgba(184,115,51,0.2) 150deg, transparent 180deg, transparent 360deg)',
                          maskImage:
                            'radial-gradient(ellipse 60% 18% at 50% 0%, black 0%, transparent 100%)',
                          WebkitMaskImage:
                            'radial-gradient(ellipse 60% 18% at 50% 0%, black 0%, transparent 100%)',
                        }}
                      />
                    </div>
                  )}

                  <span
                    className={cn(
                      'relative z-10',
                      isCompleted && 'text-[#d4944c]',
                      isCurrent && 'text-[#d4944c]',
                      !isCompleted && !isCurrent && 'text-[rgba(200,200,210,0.4)]'
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isCurrent
                      ? 'text-[#d4944c]'
                      : isCompleted
                        ? 'text-[rgba(200,200,210,0.7)]'
                        : 'text-[rgba(200,200,210,0.3)]'
                  )}
                >
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className="mx-2 h-[2px] flex-1 rounded-full"
                  style={
                    index < currentStep
                      ? {
                          background: 'rgba(184,115,51,0.3)',
                          boxShadow: '0 0 6px rgba(184,115,51,0.15)',
                        }
                      : {
                          background: 'rgba(200,200,210,0.06)',
                        }
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
