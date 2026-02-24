import { z } from 'zod';

export const clientInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  companyName: z.string().optional().or(z.literal('')),
  jobTitle: z.string().optional().or(z.literal('')),
  referralSource: z.enum(['google', 'referral', 'social-media', 'other']).optional(),
});

export const projectDetailsSchema = z.object({
  projectName: z.string().min(2, 'Project name is required'),
  projectDescription: z.string().min(20, 'Please provide at least a brief description (20+ characters)'),
  targetAudience: z.string().optional().or(z.literal('')),
  targetPlatforms: z.enum(['ios', 'android', 'both', 'web_mobile']),
  existingAppStatus: z.enum(['new', 'rebuild', 'add-features']),
  launchTimeframe: z.enum(['asap', '1-3months', '3-6months', '6-12months', 'flexible']),
  similarApps: z.string().optional().or(z.literal('')),
  expectedUsers: z.enum(['<1k', '1k-10k', '10k-100k', '100k+', 'not-sure']),
});

export const featuresSchema = z.object({
  selectedFeatures: z.array(z.string()).min(1, 'Please select at least one feature'),
  hasCustomFeatures: z.boolean(),
  customFeaturesText: z.string().optional().or(z.literal('')),
});

export const designBrandingSchema = z.object({
  hasBrandGuidelines: z.enum(['yes', 'no', 'partially']),
  hasWireframes: z.enum(['yes', 'no', 'rough-sketches']),
  designStyle: z.array(z.enum(['minimalist', 'bold-colorful', 'corporate', 'playful', 'dark-sleek', 'other'])).min(1, 'Please select at least one design style'),
  designInspiration: z.string().optional().or(z.literal('')),
});

export const budgetTimelineSchema = z.object({
  budgetRange: z.enum(['<2k', '2k-5k', '5k-10k', '10k-25k', '25k-50k', 'not-sure']),
  budgetFlexibility: z.enum(['fixed', 'somewhat-flexible', 'very-flexible']),
  priorityFocus: z.enum(['speed', 'quality', 'cost']),
  additionalNotes: z.string().optional().or(z.literal('')),
  contactPreference: z.array(z.enum(['email', 'phone', 'video-call'])).min(1, 'Please select at least one contact method'),
  meetingAvailability: z.string().optional().or(z.literal('')),
});

export const fullSubmissionSchema = z.object({
  clientInfo: clientInfoSchema,
  projectDetails: projectDetailsSchema,
  features: featuresSchema,
  designBranding: designBrandingSchema,
  budgetTimeline: budgetTimelineSchema,
});

export type ClientInfoData = z.infer<typeof clientInfoSchema>;
export type ProjectDetailsData = z.infer<typeof projectDetailsSchema>;
export type FeaturesData = z.infer<typeof featuresSchema>;
export type DesignBrandingData = z.infer<typeof designBrandingSchema>;
export type BudgetTimelineData = z.infer<typeof budgetTimelineSchema>;
export type FullSubmissionData = z.infer<typeof fullSubmissionSchema>;
