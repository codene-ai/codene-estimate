import { Platform } from './types';

export const HOURLY_RATE = 35;
export const HOURLY_RATE_DISPLAY = '$30–$40';
export const DEPOSIT_MIN = 250;
export const DEPOSIT_MAX = 500;

export const PLATFORM_MULTIPLIERS: Record<Platform, { multiplier: number; label: string }> = {
  ios: { multiplier: 1.0, label: 'iOS Only' },
  android: { multiplier: 1.0, label: 'Android Only' },
  both: { multiplier: 1.4, label: 'iOS & Android' },
  web_mobile: { multiplier: 1.65, label: 'Web + Mobile' },
};

export const OVERHEAD_PERCENTAGE = 0.10;

export const CUSTOM_FEATURE_BUFFER_MIN = 6;
export const CUSTOM_FEATURE_BUFFER_MAX = 14;

export const TEAM_HOURS_PER_WEEK = 25;

export const TIMELINE_PHASES = [
  { name: 'Discovery & Planning', percentage: 0.065 },
  { name: 'UI/UX Design', percentage: 0.175 },
  { name: 'Development', percentage: 0.525 },
  { name: 'QA & Testing', percentage: 0.175 },
  { name: 'Deployment & Launch', percentage: 0.06 },
];
