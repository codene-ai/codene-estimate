'use client';

import { create } from 'zustand';
import type {
  Platform,
  LaunchTimeframe,
  BudgetRange,
  BudgetFlexibility,
  ExistingAppStatus,
  ExpectedUsers,
  DesignStyle,
  ContactMethod,
  PriorityFocus,
  ReferralSource,
  UploadedFile,
} from '@/lib/estimate-engine/types';

interface ClientInfoState {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  referralSource: ReferralSource | '';
}

interface ProjectDetailsState {
  projectName: string;
  projectDescription: string;
  targetAudience: string;
  targetPlatforms: Platform;
  existingAppStatus: ExistingAppStatus;
  launchTimeframe: LaunchTimeframe;
  similarApps: string;
  expectedUsers: ExpectedUsers;
}

interface FeaturesState {
  selectedFeatures: string[];
  hasCustomFeatures: boolean;
  customFeaturesText: string;
}

interface DesignBrandingState {
  hasBrandGuidelines: 'yes' | 'no' | 'partially';
  hasWireframes: 'yes' | 'no' | 'rough-sketches';
  designStyle: DesignStyle[];
  designInspiration: string;
  uploadedFiles: UploadedFile[];
}

interface BudgetTimelineState {
  budgetRange: BudgetRange;
  budgetFlexibility: BudgetFlexibility;
  priorityFocus: PriorityFocus;
  additionalNotes: string;
  contactPreference: ContactMethod[];
  meetingAvailability: string;
}

interface EstimateFormState {
  currentStep: number;
  clientInfo: ClientInfoState;
  projectDetails: ProjectDetailsState;
  features: FeaturesState;
  designBranding: DesignBrandingState;
  budgetTimeline: BudgetTimelineState;
  isSubmitting: boolean;

  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateClientInfo: (data: Partial<ClientInfoState>) => void;
  updateProjectDetails: (data: Partial<ProjectDetailsState>) => void;
  toggleFeature: (featureId: string) => void;
  setHasCustomFeatures: (value: boolean) => void;
  setCustomFeaturesText: (text: string) => void;
  updateDesignBranding: (data: Partial<DesignBrandingState>) => void;
  toggleDesignStyle: (style: DesignStyle) => void;
  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (fileId: string) => void;
  updateBudgetTimeline: (data: Partial<BudgetTimelineState>) => void;
  toggleContactPreference: (method: ContactMethod) => void;
  setIsSubmitting: (value: boolean) => void;
  reset: () => void;
}

const initialClientInfo: ClientInfoState = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
  jobTitle: '',
  referralSource: '',
};

const initialProjectDetails: ProjectDetailsState = {
  projectName: '',
  projectDescription: '',
  targetAudience: '',
  targetPlatforms: 'both',
  existingAppStatus: 'new',
  launchTimeframe: 'flexible',
  similarApps: '',
  expectedUsers: 'not-sure',
};

const initialFeatures: FeaturesState = {
  selectedFeatures: [],
  hasCustomFeatures: false,
  customFeaturesText: '',
};

const initialDesignBranding: DesignBrandingState = {
  hasBrandGuidelines: 'no',
  hasWireframes: 'no',
  designStyle: [],
  designInspiration: '',
  uploadedFiles: [],
};

const initialBudgetTimeline: BudgetTimelineState = {
  budgetRange: 'not-sure',
  budgetFlexibility: 'somewhat-flexible',
  priorityFocus: 'quality',
  additionalNotes: '',
  contactPreference: ['email'],
  meetingAvailability: '',
};

export const useEstimateFormStore = create<EstimateFormState>((set) => ({
  currentStep: 0,
  clientInfo: initialClientInfo,
  projectDetails: initialProjectDetails,
  features: initialFeatures,
  designBranding: initialDesignBranding,
  budgetTimeline: initialBudgetTimeline,
  isSubmitting: false,

  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  updateClientInfo: (data) =>
    set((state) => ({ clientInfo: { ...state.clientInfo, ...data } })),

  updateProjectDetails: (data) =>
    set((state) => ({ projectDetails: { ...state.projectDetails, ...data } })),

  toggleFeature: (featureId) =>
    set((state) => {
      const features = state.features.selectedFeatures;
      const newFeatures = features.includes(featureId)
        ? features.filter((id) => id !== featureId)
        : [...features, featureId];
      return { features: { ...state.features, selectedFeatures: newFeatures } };
    }),

  setHasCustomFeatures: (value) =>
    set((state) => ({ features: { ...state.features, hasCustomFeatures: value } })),

  setCustomFeaturesText: (text) =>
    set((state) => ({ features: { ...state.features, customFeaturesText: text } })),

  updateDesignBranding: (data) =>
    set((state) => ({ designBranding: { ...state.designBranding, ...data } })),

  toggleDesignStyle: (style) =>
    set((state) => {
      const styles = state.designBranding.designStyle;
      const newStyles = styles.includes(style)
        ? styles.filter((s) => s !== style)
        : [...styles, style];
      return { designBranding: { ...state.designBranding, designStyle: newStyles } };
    }),

  addUploadedFile: (file) =>
    set((state) => ({
      designBranding: {
        ...state.designBranding,
        uploadedFiles: [...state.designBranding.uploadedFiles, file],
      },
    })),

  removeUploadedFile: (fileId) =>
    set((state) => ({
      designBranding: {
        ...state.designBranding,
        uploadedFiles: state.designBranding.uploadedFiles.filter((f) => f.id !== fileId),
      },
    })),

  updateBudgetTimeline: (data) =>
    set((state) => ({ budgetTimeline: { ...state.budgetTimeline, ...data } })),

  toggleContactPreference: (method) =>
    set((state) => {
      const prefs = state.budgetTimeline.contactPreference;
      const newPrefs = prefs.includes(method)
        ? prefs.filter((m) => m !== method)
        : [...prefs, method];
      return { budgetTimeline: { ...state.budgetTimeline, contactPreference: newPrefs } };
    }),

  setIsSubmitting: (value) => set({ isSubmitting: value }),

  reset: () =>
    set({
      currentStep: 0,
      clientInfo: initialClientInfo,
      projectDetails: initialProjectDetails,
      features: initialFeatures,
      designBranding: initialDesignBranding,
      budgetTimeline: initialBudgetTimeline,
      isSubmitting: false,
    }),
}));
