'use client';

import { useEstimateFormStore } from '@/stores/estimate-form-store';
import { RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import type { DesignStyle, UploadedFile } from '@/lib/estimate-engine/types';

const brandGuidelinesOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'partially', label: 'Partially' },
];

const wireframeOptions = [
  { value: 'yes', label: "Yes \u2014 I'll upload them" },
  { value: 'no', label: 'No' },
  { value: 'rough-sketches', label: 'I have rough sketches' },
];

const designStyleOptions: { id: DesignStyle; label: string }[] = [
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'bold-colorful', label: 'Bold/Colorful' },
  { id: 'corporate', label: 'Corporate/Professional' },
  { id: 'playful', label: 'Playful/Fun' },
  { id: 'dark-sleek', label: 'Dark/Sleek' },
  { id: 'other', label: 'Other' },
];

export default function StepDesignBranding() {
  const {
    designBranding,
    updateDesignBranding,
    toggleDesignStyle,
    addUploadedFile,
    removeUploadedFile,
  } = useEstimateFormStore();

  const handleFilesAdded = (files: File[]) => {
    files.forEach((file) => {
      const uploaded: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      };
      addUploadedFile(uploaded);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Design & Branding
        </h2>
        <p className="mt-1 text-sm text-muted">
          Help us understand your design preferences and existing assets.
        </p>
      </div>

      <div className="space-y-4">
        <RadioGroup
          name="hasBrandGuidelines"
          label="Do you have brand guidelines?"
          variant="list"
          options={brandGuidelinesOptions}
          value={designBranding.hasBrandGuidelines}
          onChange={(value) =>
            updateDesignBranding({
              hasBrandGuidelines: value as typeof designBranding.hasBrandGuidelines,
            })
          }
        />

        <RadioGroup
          name="hasWireframes"
          label="Do you have wireframes or mockups?"
          variant="list"
          options={wireframeOptions}
          value={designBranding.hasWireframes}
          onChange={(value) =>
            updateDesignBranding({
              hasWireframes: value as typeof designBranding.hasWireframes,
            })
          }
        />

        <fieldset className="w-full">
          <legend className="mb-2 text-sm font-medium text-foreground">
            Design Style (select all that apply)
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {designStyleOptions.map((style) => (
              <Checkbox
                key={style.id}
                id={`design-style-${style.id}`}
                label={style.label}
                checked={designBranding.designStyle.includes(style.id)}
                onChange={() => toggleDesignStyle(style.id)}
              />
            ))}
          </div>
        </fieldset>

        <FileUpload
          onFilesAdded={handleFilesAdded}
          uploadedFiles={designBranding.uploadedFiles}
          onRemoveFile={removeUploadedFile}
        />

        <Textarea
          label="Design Inspiration (optional)"
          value={designBranding.designInspiration}
          onChange={(e) =>
            updateDesignBranding({ designInspiration: e.target.value })
          }
          placeholder="Any apps or websites with a design style you love?"
        />
      </div>
    </div>
  );
}
