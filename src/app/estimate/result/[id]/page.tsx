'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResultSummary } from '@/components/estimate-result/result-summary';
import { ItemizedBreakdown } from '@/components/estimate-result/itemized-breakdown';
import { TimelinePhases } from '@/components/estimate-result/timeline-phases';
import { Disclaimer } from '@/components/estimate-result/disclaimer';
import { DownloadButton } from '@/components/estimate-result/download-button';
import { EstimateActions } from '@/components/estimate-result/estimate-actions';
import type { EstimateResult } from '@/lib/estimate-engine/types';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function EstimateResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Try localStorage first
    const stored = localStorage.getItem(`estimate-${id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEstimate(parsed.estimate);
        setProjectName(parsed.projectName);
        setLoading(false);
        return;
      } catch {
        // fall through to API
      }
    }

    // Try fetching from API (Supabase)
    fetch(`/api/estimate/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setEstimate(data.estimate_result);
        setProjectName(data.project_name);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (notFound || !estimate) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted">Estimate not found</p>
        <Link href="/estimate" className="text-primary hover:underline">
          Create a new estimate
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Success header */}
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <CheckCircle className="h-6 w-6 text-emerald-400" />
          <div>
            <p className="font-semibold text-emerald-300">Estimate Generated Successfully</p>
            <p className="text-sm text-emerald-400/80">
              We&apos;ve received your request and will follow up with a detailed quote.
            </p>
          </div>
        </div>

        <ResultSummary estimate={estimate} projectName={projectName} />
        <ItemizedBreakdown items={estimate.items} />
        <TimelinePhases
          phases={estimate.timeline}
          totalWeeksMin={estimate.totalWeeksMin}
          totalWeeksMax={estimate.totalWeeksMax}
        />
        <Disclaimer />

        <EstimateActions estimateId={id} projectName={projectName} />

        {/* Download & Nav */}
        <div className="no-print mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-glass-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-glass-bg-hover"
            >
              Print
            </button>
            <DownloadButton estimateId={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
