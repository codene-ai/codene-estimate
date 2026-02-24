'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEstimateFormStore } from '@/stores/estimate-form-store';
import { StepIndicator } from './step-indicator';
import StepClientInfo from './step-client-info';
import StepProjectDetails from './step-project-details';
import StepFeatures from './step-features';
import StepDesignBranding from './step-design-branding';
import StepBudgetUpload from './step-budget-upload';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

const TOTAL_STEPS = 5;

export function FormWizard() {
  const router = useRouter();
  const { currentStep, nextStep, prevStep, isSubmitting, setIsSubmitting } =
    useEstimateFormStore();
  const store = useEstimateFormStore();
  const [error, setError] = useState<string | null>(null);

  function renderStep() {
    switch (currentStep) {
      case 0:
        return <StepClientInfo />;
      case 1:
        return <StepProjectDetails />;
      case 2:
        return <StepFeatures />;
      case 3:
        return <StepDesignBranding />;
      case 4:
        return <StepBudgetUpload />;
      default:
        return null;
    }
  }

  function validateCurrentStep(): boolean {
    switch (currentStep) {
      case 0: {
        const { name, email, phone } = store.clientInfo;
        if (!name || name.length < 2) {
          setError('Please enter your name');
          return false;
        }
        if (!email || !email.includes('@')) {
          setError('Please enter a valid email');
          return false;
        }
        if (!phone || phone.length < 7) {
          setError('Please enter a valid phone number');
          return false;
        }
        break;
      }
      case 1: {
        const { projectName, projectDescription } = store.projectDetails;
        if (!projectName || projectName.length < 2) {
          setError('Please enter a project name');
          return false;
        }
        if (!projectDescription || projectDescription.length < 20) {
          setError('Please provide a project description (at least 20 characters)');
          return false;
        }
        break;
      }
      case 2: {
        if (store.features.selectedFeatures.length === 0) {
          setError('Please select at least one feature');
          return false;
        }
        break;
      }
      case 3: {
        if (store.designBranding.designStyle.length === 0) {
          setError('Please select at least one design style');
          return false;
        }
        break;
      }
      case 4: {
        if (store.budgetTimeline.contactPreference.length === 0) {
          setError('Please select at least one contact method');
          return false;
        }
        break;
      }
    }
    setError(null);
    return true;
  }

  function handleNext() {
    if (validateCurrentStep()) {
      nextStep();
    }
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const submission = {
        clientInfo: {
          name: store.clientInfo.name,
          email: store.clientInfo.email,
          phone: store.clientInfo.phone,
          companyName: store.clientInfo.companyName || undefined,
          jobTitle: store.clientInfo.jobTitle || undefined,
          referralSource: store.clientInfo.referralSource || undefined,
        },
        projectDetails: {
          projectName: store.projectDetails.projectName,
          projectDescription: store.projectDetails.projectDescription,
          targetAudience: store.projectDetails.targetAudience || undefined,
          targetPlatforms: store.projectDetails.targetPlatforms,
          existingAppStatus: store.projectDetails.existingAppStatus,
          launchTimeframe: store.projectDetails.launchTimeframe,
          similarApps: store.projectDetails.similarApps || undefined,
          expectedUsers: store.projectDetails.expectedUsers,
        },
        features: {
          selectedFeatures: store.features.selectedFeatures,
          hasCustomFeatures: store.features.hasCustomFeatures,
          customFeaturesText: store.features.customFeaturesText || undefined,
        },
        designBranding: {
          hasBrandGuidelines: store.designBranding.hasBrandGuidelines,
          hasWireframes: store.designBranding.hasWireframes,
          designStyle: store.designBranding.designStyle,
          designInspiration: store.designBranding.designInspiration || undefined,
        },
        budgetTimeline: {
          budgetRange: store.budgetTimeline.budgetRange,
          budgetFlexibility: store.budgetTimeline.budgetFlexibility,
          priorityFocus: store.budgetTimeline.priorityFocus,
          additionalNotes: store.budgetTimeline.additionalNotes || undefined,
          contactPreference: store.budgetTimeline.contactPreference,
          meetingAvailability: store.budgetTimeline.meetingAvailability || undefined,
        },
      };

      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit estimate');
      }

      const result = await response.json();
      // Store estimate in localStorage so result page can read it without Supabase
      localStorage.setItem(`estimate-${result.id}`, JSON.stringify({
        estimate: result.estimate,
        projectName: result.projectName,
      }));
      router.push(`/estimate/result/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 sm:p-8">
      <StepIndicator currentStep={currentStep} />

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between border-t border-glass-border pt-6">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            Get My Estimate
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
