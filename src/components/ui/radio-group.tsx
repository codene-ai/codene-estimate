'use client';

import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'list' | 'cards';
  error?: string;
}

function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  variant = 'list',
  error,
}: RadioGroupProps) {
  return (
    <fieldset className="w-full">
      <legend className="mb-2 text-sm font-medium text-foreground">
        {label}
      </legend>

      <div
        className={cn(
          variant === 'list' && 'space-y-2',
          variant === 'cards' && 'grid gap-3 sm:grid-cols-2'
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const inputId = `${name}-${option.value}`;

          if (variant === 'cards') {
            return (
              <label
                key={option.value}
                htmlFor={inputId}
                className="group relative flex cursor-pointer items-start gap-3 rounded-[16px] p-4 transition-all duration-300"
                style={
                  isSelected
                    ? {
                        /* Pressed-in concave — selected */
                        background: '#252528',
                        boxShadow: [
                          'inset 4px 4px 10px rgba(0,0,0,0.5)',
                          'inset -3px -3px 8px rgba(50,50,55,0.05)',
                          '0 0 10px rgba(184,115,51,0.1)',
                        ].join(','),
                        border: '1px solid rgba(184,115,51,0.18)',
                      }
                    : {
                        /* Raised convex — unselected */
                        background: 'linear-gradient(145deg, #303035, #262629)',
                        boxShadow: [
                          '5px 5px 14px rgba(0,0,0,0.45)',
                          '-3px -3px 10px rgba(50,50,55,0.05)',
                        ].join(','),
                        border: '1px solid rgba(200,200,210,0.03)',
                      }
                }
              >
                {/* Subtle gold arc on selected */}
                {isSelected && (
                  <div className="pointer-events-none absolute inset-0 rounded-[16px] overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'conic-gradient(from 200deg at 50% 0%, transparent 0deg, rgba(212,148,76,0.12) 40deg, rgba(184,115,51,0.22) 90deg, rgba(212,148,76,0.12) 140deg, transparent 180deg, transparent 360deg)',
                        maskImage:
                          'radial-gradient(ellipse 50% 12% at 50% 0%, black 0%, transparent 100%)',
                        WebkitMaskImage:
                          'radial-gradient(ellipse 50% 12% at 50% 0%, black 0%, transparent 100%)',
                      }}
                    />
                  </div>
                )}

                <input
                  type="radio"
                  id={inputId}
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange(option.value)}
                  className="relative z-10 mt-0.5 h-4 w-4 text-primary accent-primary focus:ring-2 focus:ring-primary/30"
                />
                <div className="relative z-10">
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isSelected ? 'text-[#d4944c]' : 'text-[rgba(200,200,210,0.8)]'
                    )}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <p className="mt-0.5 text-sm text-muted">
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            );
          }

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-4 w-4 text-primary accent-primary focus:ring-2 focus:ring-primary/30"
              />
              <div>
                <span className="text-sm font-medium text-foreground">
                  {option.label}
                </span>
                {option.description && (
                  <p className="mt-0.5 text-sm text-muted">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
    </fieldset>
  );
}

export { RadioGroup, type RadioGroupProps, type RadioOption };
