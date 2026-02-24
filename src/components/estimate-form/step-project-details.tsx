'use client';

import { useEstimateFormStore } from '@/stores/estimate-form-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';
import type { Platform, ExistingAppStatus, LaunchTimeframe, ExpectedUsers } from '@/lib/estimate-engine/types';

const platformOptions = [
  { value: 'ios', label: 'iOS Only' },
  { value: 'android', label: 'Android Only' },
  { value: 'both', label: 'Both iOS & Android' },
  { value: 'web_mobile', label: 'Web + Mobile' },
];

const existingAppOptions = [
  { value: 'new', label: 'New App' },
  { value: 'rebuild', label: 'Rebuild/Redesign Existing' },
  { value: 'add-features', label: 'Add Features to Existing' },
];

const launchTimeframeOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-3months', label: '1-3 Months' },
  { value: '3-6months', label: '3-6 Months' },
  { value: '6-12months', label: '6-12 Months' },
  { value: 'flexible', label: 'Flexible' },
];

const expectedUsersOptions = [
  { value: '<1k', label: 'Under 1,000' },
  { value: '1k-10k', label: '1,000 - 10,000' },
  { value: '10k-100k', label: '10,000 - 100,000' },
  { value: '100k+', label: '100,000+' },
  { value: 'not-sure', label: 'Not Sure' },
];

export default function StepProjectDetails() {
  const { projectDetails, updateProjectDetails } = useEstimateFormStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Project Details
        </h2>
        <p className="mt-1 text-sm text-muted">
          Help us understand what you're building.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Project Name"
          value={projectDetails.projectName}
          onChange={(e) => updateProjectDetails({ projectName: e.target.value })}
          placeholder="My Awesome App"
        />

        <Textarea
          label="Project Description"
          value={projectDetails.projectDescription}
          onChange={(e) =>
            updateProjectDetails({ projectDescription: e.target.value })
          }
          placeholder="Describe what your app should do, its main purpose, and key functionality..."
        />

        <Textarea
          label="Target Audience (optional)"
          value={projectDetails.targetAudience}
          onChange={(e) =>
            updateProjectDetails({ targetAudience: e.target.value })
          }
          placeholder="Who are the primary users of this app?"
        />

        <RadioGroup
          name="targetPlatforms"
          label="Target Platforms"
          variant="cards"
          options={platformOptions}
          value={projectDetails.targetPlatforms}
          onChange={(value) =>
            updateProjectDetails({ targetPlatforms: value as Platform })
          }
        />

        <RadioGroup
          name="existingAppStatus"
          label="App Status"
          variant="cards"
          options={existingAppOptions}
          value={projectDetails.existingAppStatus}
          onChange={(value) =>
            updateProjectDetails({
              existingAppStatus: value as ExistingAppStatus,
            })
          }
        />

        <Select
          label="Launch Timeframe"
          options={launchTimeframeOptions}
          value={projectDetails.launchTimeframe}
          onChange={(e) =>
            updateProjectDetails({
              launchTimeframe: e.target.value as LaunchTimeframe,
            })
          }
        />

        <Textarea
          label="Similar Apps (optional)"
          value={projectDetails.similarApps}
          onChange={(e) =>
            updateProjectDetails({ similarApps: e.target.value })
          }
          placeholder="Name any apps you'd like yours to be similar to, or describe what you admire about them..."
        />

        <Select
          label="Expected Number of Users"
          options={expectedUsersOptions}
          value={projectDetails.expectedUsers}
          onChange={(e) =>
            updateProjectDetails({
              expectedUsers: e.target.value as ExpectedUsers,
            })
          }
        />
      </div>
    </div>
  );
}
