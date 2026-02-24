'use client';

import { formatCurrencyRange, formatWeeksRange } from '@/lib/utils';
import type { EstimateResult } from '@/lib/estimate-engine/types';
import { Clock, DollarSign, Layers } from 'lucide-react';

interface ResultSummaryProps {
  estimate: EstimateResult;
  projectName: string;
}

export function ResultSummary({ estimate, projectName }: ResultSummaryProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
        Your Estimate for &ldquo;{projectName}&rdquo;
      </h2>
      <p className="mt-2 text-muted">
        {estimate.platformLabel} &middot; {estimate.items.length} features selected
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="glass-panel-elevated rounded-xl border border-primary/20 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-2 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted">Estimated Cost</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrencyRange(estimate.totalCostMin, estimate.totalCostMax)}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted">Timeline</p>
              <p className="text-xl font-bold text-foreground">
                {formatWeeksRange(estimate.totalWeeksMin, estimate.totalWeeksMax)}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[rgba(184,115,51,0.20)] p-2 text-[#d4944c]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted">Total Hours</p>
              <p className="text-xl font-bold text-foreground">
                {Math.round(estimate.adjustedHoursMin)}–{Math.round(estimate.adjustedHoursMax)} hrs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit badge */}
      <div className="mt-4 rounded-lg border border-[rgba(184,115,51,0.25)] bg-[rgba(184,115,51,0.08)] px-4 py-3 text-center">
        <p className="text-sm text-muted">
          <span className="font-semibold text-[#d4944c]">$250–$500 deposit</span>{' '}
          required before project kickoff — applied toward total cost
        </p>
      </div>
    </div>
  );
}
