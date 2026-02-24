'use client';

import type { TimelinePhase } from '@/lib/estimate-engine/types';

interface TimelinePhasesProps {
  phases: TimelinePhase[];
  totalWeeksMin: number;
  totalWeeksMax: number;
}

const phaseColors = [
  'bg-[#b87333]',
  'bg-teal-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-emerald-500',
];

export function TimelinePhases({ phases, totalWeeksMin, totalWeeksMax }: TimelinePhasesProps) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-bold text-foreground">Production Timeline</h3>
      <div className="glass-panel rounded-xl p-6">
        {/* Visual bar */}
        <div className="mb-6 flex h-8 overflow-hidden rounded-lg">
          {phases.map((phase, i) => (
            <div
              key={phase.name}
              className={`${phaseColors[i % phaseColors.length]} flex items-center justify-center text-xs font-medium text-white`}
              style={{ width: `${phase.percentage * 100}%` }}
              title={phase.name}
            >
              {phase.percentage >= 0.1 && (
                <span className="truncate px-1">{Math.round(phase.percentage * 100)}%</span>
              )}
            </div>
          ))}
        </div>

        {/* Phase details */}
        <div className="space-y-3">
          {phases.map((phase, i) => (
            <div key={phase.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${phaseColors[i % phaseColors.length]}`} />
                <span className="text-sm font-medium text-foreground">{phase.name}</span>
              </div>
              <span className="text-sm text-muted">
                {phase.weeksMin === phase.weeksMax
                  ? `${phase.weeksMin} week${phase.weeksMin !== 1 ? 's' : ''}`
                  : `${phase.weeksMin}–${phase.weeksMax} weeks`}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-glass-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Total Estimated Timeline</span>
            <span className="text-lg font-bold text-primary">
              {totalWeeksMin === totalWeeksMax
                ? `${totalWeeksMin} weeks`
                : `${totalWeeksMin}–${totalWeeksMax} weeks`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
