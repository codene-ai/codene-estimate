'use client';

import { useState } from 'react';
import { CheckCircle2, PenLine, MessageSquareText, Loader2, ArrowRight } from 'lucide-react';

interface EstimateActionsProps {
  estimateId: string;
  projectName: string;
}

type ActionState = 'idle' | 'accept' | 'adjust' | 'review' | 'submitted';

export function EstimateActions({ estimateId, projectName }: EstimateActionsProps) {
  const [actionState, setActionState] = useState<ActionState>('idle');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  async function handleAction(action: string, notes?: string) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/estimate/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimateId, action, notes: notes || '', projectName }),
      });
      if (!res.ok) console.warn('Response API not available, storing locally');
      localStorage.setItem(`estimate-response-${estimateId}`, JSON.stringify({
        action, notes, timestamp: new Date().toISOString(),
      }));
      setSubmitted(action);
      setActionState('submitted');
    } catch {
      localStorage.setItem(`estimate-response-${estimateId}`, JSON.stringify({
        action, notes, timestamp: new Date().toISOString(),
      }));
      setSubmitted(action);
      setActionState('submitted');
    } finally {
      setSubmitting(false);
    }
  }

  if (actionState === 'submitted') {
    const messages: Record<string, { title: string; desc: string }> = {
      accept: { title: 'Quote Accepted!', desc: 'We\'ll be in touch shortly to kick off your project. Expect an email within 24 hours.' },
      adjust: { title: 'Adjustment Request Sent', desc: 'We\'ve received your notes and will send a revised estimate within 1-2 business days.' },
      review: { title: 'Review Requested', desc: 'A team member will review your estimate and reach out to discuss details within 24 hours.' },
    };
    const msg = messages[submitted || 'accept'];
    return (
      <div className="no-print my-10 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-emerald-500/20 p-3">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{msg.title}</p>
            <p className="mt-1 text-muted">{msg.desc}</p>
          </div>
        </div>
      </div>
    );
  }

  if (actionState === 'adjust') {
    return (
      <div className="no-print my-10 glass-panel rounded-2xl p-8">
        <h4 className="text-xl font-bold text-foreground">Adjust Line Items</h4>
        <p className="mt-2 text-muted">Tell us which features to add, remove, or modify. We&apos;ll send a revised estimate.</p>
        <textarea
          value={adjustNotes}
          onChange={(e) => setAdjustNotes(e.target.value)}
          placeholder="e.g., Remove video calling, add push notifications, reduce scope of admin panel..."
          className="glass-input mt-4 w-full px-4 py-3 text-sm text-foreground"
          rows={4}
        />
        <div className="mt-6 flex gap-4">
          <button onClick={() => setActionState('idle')} className="muted-btn rounded-xl px-6 py-3 text-sm font-medium text-muted hover:text-foreground">
            Cancel
          </button>
          <button
            onClick={() => handleAction('adjust', adjustNotes)}
            disabled={submitting || !adjustNotes.trim()}
            className="gel-btn inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenLine className="h-4 w-4" />}
            Submit Adjustments
          </button>
        </div>
      </div>
    );
  }

  if (actionState === 'review') {
    return (
      <div className="no-print my-10 glass-panel rounded-2xl p-8">
        <h4 className="text-xl font-bold text-foreground">Request Manual Review</h4>
        <p className="mt-2 text-muted">A team member will review your estimate and reach out to discuss details.</p>
        <textarea
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Any specific questions or concerns about the estimate? (optional)"
          className="glass-input mt-4 w-full px-4 py-3 text-sm text-foreground"
          rows={3}
        />
        <div className="mt-6 flex gap-4">
          <button onClick={() => setActionState('idle')} className="muted-btn rounded-xl px-6 py-3 text-sm font-medium text-muted hover:text-foreground">
            Cancel
          </button>
          <button
            onClick={() => handleAction('review', reviewNotes)}
            disabled={submitting}
            className="gel-btn inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}
            Request Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="no-print my-10">
      <h3 className="mb-2 text-center text-2xl font-bold text-foreground">What would you like to do?</h3>
      <p className="mb-6 text-center text-muted">Choose how you&apos;d like to proceed with this estimate</p>

      <div className="space-y-4">
        {/* Accept — most prominent */}
        <button
          onClick={() => handleAction('accept')}
          disabled={submitting}
          className="group neu-touchable flex w-full items-center gap-5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/10 p-6 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/15 hover:shadow-[0_0_30px_rgba(74,222,128,0.15)]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)]">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-emerald-300">Accept Quote</p>
            <p className="mt-1 text-sm text-emerald-400/70">Approve this estimate and let&apos;s get started on your project</p>
          </div>
          <ArrowRight className="h-5 w-5 text-emerald-400 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </button>

        {/* Adjust — second prominent */}
        <button
          onClick={() => setActionState('adjust')}
          className="group neu-touchable flex w-full items-center gap-5 rounded-2xl border-2 border-[rgba(184,115,51,0.25)] bg-[rgba(184,115,51,0.08)] p-6 text-left transition-all hover:border-[rgba(184,115,51,0.45)] hover:bg-[rgba(184,115,51,0.12)] hover:shadow-[0_0_30px_rgba(184,115,51,0.12)]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgba(184,115,51,0.15)] shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)]">
            <PenLine className="h-7 w-7 text-[#d4944c]" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-[#d4944c]">Adjust Line Items</p>
            <p className="mt-1 text-sm text-[rgba(212,148,76,0.7)]">Add, remove, or modify features for a revised estimate</p>
          </div>
          <ArrowRight className="h-5 w-5 text-[#d4944c] opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </button>

        {/* Review */}
        <button
          onClick={() => setActionState('review')}
          className="group neu-touchable flex w-full items-center gap-5 rounded-2xl border-2 border-cyan-500/20 bg-cyan-500/8 p-6 text-left transition-all hover:border-cyan-500/40 hover:bg-cyan-500/12 hover:shadow-[0_0_30px_rgba(56,189,248,0.12)]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.3)]">
            <MessageSquareText className="h-7 w-7 text-cyan-400" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-cyan-300">Request Manual Review</p>
            <p className="mt-1 text-sm text-cyan-400/70">Have a team member review and discuss the estimate with you</p>
          </div>
          <ArrowRight className="h-5 w-5 text-cyan-400 opacity-50 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
