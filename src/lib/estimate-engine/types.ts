export type Complexity = 'simple' | 'medium' | 'complex';

export type Platform = 'ios' | 'android' | 'both' | 'web_mobile';

export type LaunchTimeframe = 'asap' | '1-3months' | '3-6months' | '6-12months' | 'flexible';

export type BudgetRange = '<2k' | '2k-5k' | '5k-10k' | '10k-25k' | '25k-50k' | 'not-sure';

export type BudgetFlexibility = 'fixed' | 'somewhat-flexible' | 'very-flexible';

export type ExistingAppStatus = 'new' | 'rebuild' | 'add-features';

export type ExpectedUsers = '<1k' | '1k-10k' | '10k-100k' | '100k+' | 'not-sure';

export type DesignStyle = 'minimalist' | 'bold-colorful' | 'corporate' | 'playful' | 'dark-sleek' | 'other';

export type ContactMethod = 'email' | 'phone' | 'video-call';

export type PriorityFocus = 'speed' | 'quality' | 'cost';

export type ReferralSource = 'google' | 'referral' | 'social-media' | 'other';

export interface Feature {
  id: string;
  name: string;
  category: string;
  complexity: Complexity;
  hoursMin: number;
  hoursMax: number;
}

export interface FeatureCategory {
  id: string;
  name: string;
  features: Feature[];
}

export interface EstimateInput {
  selectedFeatures: string[];
  platform: Platform;
  customFeaturesText?: string;
}

export interface EstimateLineItem {
  featureId: string;
  name: string;
  category: string;
  complexity: Complexity;
  hoursMin: number;
  hoursMax: number;
  costMin: number;
  costMax: number;
}

export interface TimelinePhase {
  name: string;
  percentage: number;
  weeksMin: number;
  weeksMax: number;
}

export interface EstimateResult {
  items: EstimateLineItem[];
  platformMultiplier: number;
  platformLabel: string;
  overheadPercentage: number;
  baseHoursMin: number;
  baseHoursMax: number;
  adjustedHoursMin: number;
  adjustedHoursMax: number;
  totalCostMin: number;
  totalCostMax: number;
  timeline: TimelinePhase[];
  totalWeeksMin: number;
  totalWeeksMax: number;
  hourlyRate: number;
  customFeatureBuffer: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  jobTitle?: string;
  referralSource?: ReferralSource;
}

export interface ProjectDetails {
  projectName: string;
  projectDescription: string;
  targetAudience?: string;
  targetPlatforms: Platform;
  existingAppStatus: ExistingAppStatus;
  launchTimeframe: LaunchTimeframe;
  similarApps?: string;
  expectedUsers: ExpectedUsers;
}

export interface FeaturesSelection {
  selectedFeatures: string[];
  hasCustomFeatures: boolean;
  customFeaturesText?: string;
}

export interface DesignBranding {
  hasBrandGuidelines: 'yes' | 'no' | 'partially';
  hasWireframes: 'yes' | 'no' | 'rough-sketches';
  designStyle: DesignStyle[];
  designInspiration?: string;
  uploadedFiles: UploadedFile[];
}

export interface BudgetTimeline {
  budgetRange: BudgetRange;
  budgetFlexibility: BudgetFlexibility;
  priorityFocus: PriorityFocus;
  additionalNotes?: string;
  contactPreference: ContactMethod[];
  meetingAvailability?: string;
}

export interface FullSubmission {
  clientInfo: ClientInfo;
  projectDetails: ProjectDetails;
  features: FeaturesSelection;
  designBranding: DesignBranding;
  budgetTimeline: BudgetTimeline;
}
