'use client';

import { useEstimateFormStore } from '@/stores/estimate-form-store';
import { RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Star, DollarSign } from 'lucide-react';
import type {
  BudgetRange,
  BudgetFlexibility,
  PriorityFocus,
  ContactMethod,
} from '@/lib/estimate-engine/types';

const budgetRangeOptions = [
  { value: '<2k', label: 'Under $2k' },
  { value: '2k-5k', label: '$2k\u2013$5k' },
  { value: '5k-10k', label: '$5k\u2013$10k' },
  { value: '10k-25k', label: '$10k\u2013$25k' },
  { value: '25k-50k', label: '$25k\u2013$50k' },
  { value: 'not-sure', label: 'Not Sure Yet' },
];

const budgetFlexibilityOptions = [
  { value: 'fixed', label: 'Fixed Budget' },
  { value: 'somewhat-flexible', label: 'Somewhat Flexible' },
  { value: 'very-flexible', label: 'Very Flexible' },
];

const priorityFocusOptions = [
  { value: 'speed', label: 'Speed', description: 'Get it done fast' },
  { value: 'quality', label: 'Quality', description: 'Make it exceptional' },
  { value: 'cost', label: 'Cost', description: 'Keep it lean' },
];

const priorityIcons: Record<PriorityFocus, React.ReactNode> = {
  speed: <Zap className="h-5 w-5" />,
  quality: <Star className="h-5 w-5" />,
  cost: <DollarSign className="h-5 w-5" />,
};

const contactMethodOptions: { id: ContactMethod; label: string }[] = [
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'video-call', label: 'Video Call' },
];

export default function StepBudgetUpload() {
  const { budgetTimeline, updateBudgetTimeline, toggleContactPreference } =
    useEstimateFormStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Budget & Final Details
        </h2>
        <p className="mt-1 text-sm text-muted">
          Almost done! Let us know your budget and how to reach you.
        </p>
      </div>

      <div className="space-y-4">
        <RadioGroup
          name="budgetRange"
          label="Budget Range"
          variant="cards"
          options={budgetRangeOptions}
          value={budgetTimeline.budgetRange}
          onChange={(value) =>
            updateBudgetTimeline({ budgetRange: value as BudgetRange })
          }
        />

        <RadioGroup
          name="budgetFlexibility"
          label="Budget Flexibility"
          variant="list"
          options={budgetFlexibilityOptions}
          value={budgetTimeline.budgetFlexibility}
          onChange={(value) =>
            updateBudgetTimeline({
              budgetFlexibility: value as BudgetFlexibility,
            })
          }
        />

        <fieldset className="w-full">
          <legend className="mb-2 text-sm font-medium text-foreground">
            What's your priority?
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {priorityFocusOptions.map((option) => {
              const isSelected =
                budgetTimeline.priorityFocus === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    updateBudgetTimeline({
                      priorityFocus: option.value as PriorityFocus,
                    })
                  }
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary-light shadow-[0_0_12px_rgba(184,115,51,0.15)]'
                      : 'border-glass-border hover:bg-glass-bg-hover'
                  }`}
                >
                  <span
                    className={
                      isSelected ? 'text-primary' : 'text-muted'
                    }
                  >
                    {priorityIcons[option.value as PriorityFocus]}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                  <span className="text-xs text-muted">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <Textarea
          label="Additional Notes (optional)"
          value={budgetTimeline.additionalNotes}
          onChange={(e) =>
            updateBudgetTimeline({ additionalNotes: e.target.value })
          }
          placeholder="Any other details, questions, or requirements?"
        />

        <fieldset className="w-full">
          <legend className="mb-2 text-sm font-medium text-foreground">
            Preferred Contact Method
          </legend>
          <div className="flex flex-wrap gap-4">
            {contactMethodOptions.map((method) => (
              <Checkbox
                key={method.id}
                id={`contact-${method.id}`}
                label={method.label}
                checked={budgetTimeline.contactPreference.includes(method.id)}
                onChange={() => toggleContactPreference(method.id)}
              />
            ))}
          </div>
        </fieldset>

        <Textarea
          label="Meeting Availability (optional)"
          value={budgetTimeline.meetingAvailability}
          onChange={(e) =>
            updateBudgetTimeline({ meetingAvailability: e.target.value })
          }
          placeholder="What days/times work best for a kickoff call?"
        />
      </div>
    </div>
  );
}
