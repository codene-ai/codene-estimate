import type { EstimateInput, EstimateResult, EstimateLineItem, TimelinePhase } from './types';
import { getFeatureById } from './features';
import {
  HOURLY_RATE,
  PLATFORM_MULTIPLIERS,
  OVERHEAD_PERCENTAGE,
  CUSTOM_FEATURE_BUFFER_MIN,
  CUSTOM_FEATURE_BUFFER_MAX,
  TEAM_HOURS_PER_WEEK,
  TIMELINE_PHASES,
} from './multipliers';

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const { selectedFeatures, platform, customFeaturesText } = input;

  // Look up each selected feature by ID, skip any not found
  const features = selectedFeatures
    .map((id) => getFeatureById(id))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  // Get platform multiplier
  const platformConfig = PLATFORM_MULTIPLIERS[platform];
  const multiplier = platformConfig.multiplier;
  const overheadFactor = 1 + OVERHEAD_PERCENTAGE;
  const adjustmentFactor = multiplier * overheadFactor;

  // Create line items with adjusted costs reflecting platform multiplier and overhead
  const items: EstimateLineItem[] = features.map((feature) => ({
    featureId: feature.id,
    name: feature.name,
    category: feature.category,
    complexity: feature.complexity,
    hoursMin: feature.hoursMin,
    hoursMax: feature.hoursMax,
    costMin: Math.round(feature.hoursMin * adjustmentFactor * HOURLY_RATE),
    costMax: Math.round(feature.hoursMax * adjustmentFactor * HOURLY_RATE),
  }));

  // Sum base hours
  const baseHoursMin = features.reduce((sum, f) => sum + f.hoursMin, 0);
  const baseHoursMax = features.reduce((sum, f) => sum + f.hoursMax, 0);

  // Apply platform multiplier and overhead
  let adjustedHoursMin = baseHoursMin * multiplier * overheadFactor;
  let adjustedHoursMax = baseHoursMax * multiplier * overheadFactor;

  // Add custom feature buffer if custom features text is non-empty
  const hasCustomFeatures = customFeaturesText != null && customFeaturesText.trim().length > 0;
  const customFeatureBuffer = hasCustomFeatures ? CUSTOM_FEATURE_BUFFER_MIN : 0;

  if (hasCustomFeatures) {
    adjustedHoursMin += CUSTOM_FEATURE_BUFFER_MIN;
    adjustedHoursMax += CUSTOM_FEATURE_BUFFER_MAX;
  }

  // Calculate total costs
  const totalCostMin = Math.round(adjustedHoursMin * HOURLY_RATE);
  const totalCostMax = Math.round(adjustedHoursMax * HOURLY_RATE);

  // Calculate total weeks first, then distribute across phases
  const rawWeeksMin = adjustedHoursMin > 0 ? Math.max(1, Math.ceil(adjustedHoursMin / TEAM_HOURS_PER_WEEK)) : 0;
  const rawWeeksMax = adjustedHoursMax > 0 ? Math.max(1, Math.ceil(adjustedHoursMax / TEAM_HOURS_PER_WEEK)) : 0;

  const timeline: TimelinePhase[] = TIMELINE_PHASES.map((phase) => ({
    name: phase.name,
    percentage: phase.percentage,
    weeksMin: rawWeeksMin > 0 ? Math.max(0.5, Math.round((rawWeeksMin * phase.percentage) * 2) / 2) : 0,
    weeksMax: rawWeeksMax > 0 ? Math.max(0.5, Math.round((rawWeeksMax * phase.percentage) * 2) / 2) : 0,
  }));

  const totalWeeksMin = timeline.reduce((sum, phase) => sum + phase.weeksMin, 0);
  const totalWeeksMax = timeline.reduce((sum, phase) => sum + phase.weeksMax, 0);

  return {
    items,
    platformMultiplier: multiplier,
    platformLabel: platformConfig.label,
    overheadPercentage: OVERHEAD_PERCENTAGE,
    baseHoursMin,
    baseHoursMax,
    adjustedHoursMin,
    adjustedHoursMax,
    totalCostMin,
    totalCostMax,
    timeline,
    totalWeeksMin,
    totalWeeksMax,
    hourlyRate: HOURLY_RATE,
    customFeatureBuffer,
  };
}
