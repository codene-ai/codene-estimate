'use client';

import { cn } from '@/lib/utils';

interface CheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Checkbox({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-glass-border text-primary accent-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed"
      />
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="mt-0.5 text-sm text-muted">{description}</p>
        )}
      </div>
    </label>
  );
}

export { Checkbox, type CheckboxProps };
