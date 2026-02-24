'use client';

import { useEstimateFormStore } from '@/stores/estimate-form-store';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const referralSourceOptions = [
  { value: 'google', label: 'Google' },
  { value: 'referral', label: 'Referral' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

export default function StepClientInfo() {
  const { clientInfo, updateClientInfo } = useEstimateFormStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Tell us about yourself
        </h2>
        <p className="mt-1 text-sm text-muted">
          We'll use this info to get back to you with your estimate.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          value={clientInfo.name}
          onChange={(e) => updateClientInfo({ name: e.target.value })}
          placeholder="John Doe"
        />

        <Input
          label="Email Address"
          type="email"
          value={clientInfo.email}
          onChange={(e) => updateClientInfo({ email: e.target.value })}
          placeholder="john@example.com"
        />

        <Input
          label="Phone Number"
          type="tel"
          value={clientInfo.phone}
          onChange={(e) => updateClientInfo({ phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
        />

        <Input
          label="Company Name (optional)"
          value={clientInfo.companyName}
          onChange={(e) => updateClientInfo({ companyName: e.target.value })}
          placeholder="Acme Inc."
        />

        <Input
          label="Job Title (optional)"
          value={clientInfo.jobTitle}
          onChange={(e) => updateClientInfo({ jobTitle: e.target.value })}
          placeholder="Product Manager"
        />

        <Select
          label="How did you hear about us?"
          options={referralSourceOptions}
          value={clientInfo.referralSource}
          onChange={(e) =>
            updateClientInfo({
              referralSource: e.target.value as typeof clientInfo.referralSource,
            })
          }
          placeholder="Select an option"
        />
      </div>
    </div>
  );
}
