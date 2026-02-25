'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  Lock,
  LogOut,
  RefreshCw,
  ChevronRight,
  X,
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  PenLine,
  Loader2,
} from 'lucide-react';

type Submission = {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string | null;
  project_name: string;
  target_platforms: string;
  estimate_min_cost: number;
  estimate_max_cost: number;
  estimate_weeks_min: number;
  estimate_weeks_max: number;
  status: string;
  budget_range: string;
  launch_timeframe: string;
};

type SubmissionDetail = Submission & {
  project_description: string;
  target_audience: string | null;
  existing_app_status: string;
  similar_apps: string | null;
  expected_users: string;
  selected_features: string[];
  custom_features_text: string | null;
  has_brand_guidelines: string;
  has_wireframes: string;
  design_style: string[];
  design_inspiration: string | null;
  budget_flexibility: string;
  priority_focus: string;
  additional_notes: string | null;
  contact_preference: string[];
  meeting_availability: string | null;
  estimate_result: Record<string, unknown>;
  job_title: string | null;
  referral_source: string | null;
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30' },
  accepted: { label: 'Accepted', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  'adjustment-requested': { label: 'Adjustment', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
  'review-requested': { label: 'Review', color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/30' },
  'in-progress': { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
  declined: { label: 'Declined', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' },
  archived: { label: 'Archived', color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/30' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || { label: status, color: 'text-muted', bg: 'bg-muted-bg border-glass-border' };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.color} ${s.bg}`}>
      {s.label}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Login Screen ──────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Invalid password');
        return;
      }

      const { token } = await res.json();
      sessionStorage.setItem('admin-token', token);
      onLogin(token);
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Admin Portal</h1>
            <p className="text-xs text-muted">Codene Estimates</p>
          </div>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="glass-input mb-4 w-full px-4 py-3 text-sm text-foreground"
          autoFocus
        />

        {error && (
          <div className="mb-4 flex items-center gap-2 text-sm text-error">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="gel-btn w-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

// ─── Detail Panel ──────────────────────────────────────────
function DetailPanel({
  submission,
  token,
  onClose,
  onUpdated,
}: {
  submission: SubmissionDetail | null;
  token: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (submission) setNewStatus(submission.status);
  }, [submission]);

  if (!submission) return null;

  async function handleStatusChange() {
    if (!newStatus || newStatus === submission!.status) return;
    setUpdating(true);
    try {
      await fetch(`/api/admin/submissions/${submission!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      onUpdated();
    } catch {
      // silent
    } finally {
      setUpdating(false);
    }
  }

  const s = submission;
  const costRange = `${formatCurrency(s.estimate_min_cost)} – ${formatCurrency(s.estimate_max_cost)}`;
  const weeks = s.estimate_weeks_min === s.estimate_weeks_max
    ? `${s.estimate_weeks_min} weeks`
    : `${s.estimate_weeks_min}–${s.estimate_weeks_max} weeks`;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60" onClick={onClose} />
      {/* Panel */}
      <div className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[var(--background)] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-glass-border bg-[var(--background)] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">{s.project_name}</h2>
            <p className="text-xs text-muted">{s.client_name} &middot; {timeAgo(s.created_at)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-glass-bg-hover hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 px-6 py-6">
          {/* Status + Cost */}
          <div className="flex items-center justify-between">
            <StatusBadge status={s.status} />
            <span className="text-xl font-bold text-primary">{costRange}</span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted"><Clock className="h-3.5 w-3.5" /> Timeline</div>
              <p className="mt-1 text-sm font-semibold text-foreground">{weeks}</p>
            </div>
            <div className="glass-panel rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-muted"><DollarSign className="h-3.5 w-3.5" /> Budget</div>
              <p className="mt-1 text-sm font-semibold text-foreground">{s.budget_range}</p>
            </div>
          </div>

          {/* Client Info */}
          <Section title="Client">
            <InfoRow icon={User} label="Name" value={s.client_name} />
            <InfoRow icon={Mail} label="Email" value={s.client_email} link={`mailto:${s.client_email}`} />
            <InfoRow icon={Phone} label="Phone" value={s.client_phone} link={`tel:${s.client_phone}`} />
            {s.company_name && <InfoRow icon={Building} label="Company" value={s.company_name} />}
            {s.job_title && <InfoRow icon={User} label="Title" value={s.job_title} />}
          </Section>

          {/* Project */}
          <Section title="Project">
            <InfoRow icon={FileText} label="Platform" value={s.target_platforms} />
            <InfoRow icon={FileText} label="Status" value={s.existing_app_status} />
            <InfoRow icon={Clock} label="Launch" value={s.launch_timeframe} />
            <InfoRow icon={FileText} label="Users" value={s.expected_users} />
            {s.similar_apps && <InfoRow icon={FileText} label="Similar Apps" value={s.similar_apps} />}
            <div className="mt-2">
              <p className="text-xs font-medium text-muted">Description</p>
              <p className="mt-1 text-sm text-foreground/80">{s.project_description}</p>
            </div>
          </Section>

          {/* Features */}
          <Section title={`Features (${Array.isArray(s.selected_features) ? s.selected_features.length : 0})`}>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(s.selected_features) ? s.selected_features : []).map((f) => (
                <span key={f} className="rounded-full border border-glass-border bg-glass-bg px-2.5 py-0.5 text-xs text-foreground/70">
                  {f.replace(/-/g, ' ').replace(/_/g, ' ')}
                </span>
              ))}
            </div>
            {s.custom_features_text && (
              <div className="mt-3">
                <p className="text-xs font-medium text-muted">Custom Features</p>
                <p className="mt-1 text-sm text-foreground/80">{s.custom_features_text}</p>
              </div>
            )}
          </Section>

          {/* Design */}
          <Section title="Design">
            <InfoRow icon={FileText} label="Brand Guidelines" value={s.has_brand_guidelines} />
            <InfoRow icon={FileText} label="Wireframes" value={s.has_wireframes} />
            <InfoRow icon={FileText} label="Style" value={Array.isArray(s.design_style) ? s.design_style.join(', ') : String(s.design_style)} />
            {s.design_inspiration && <InfoRow icon={FileText} label="Inspiration" value={s.design_inspiration} />}
          </Section>

          {/* Notes */}
          {s.additional_notes && (
            <Section title="Client Notes">
              <p className="text-sm text-foreground/80">{s.additional_notes}</p>
            </Section>
          )}

          {/* Contact Preferences */}
          <Section title="Contact">
            <InfoRow icon={Mail} label="Preference" value={Array.isArray(s.contact_preference) ? s.contact_preference.join(', ') : String(s.contact_preference)} />
            {s.meeting_availability && <InfoRow icon={Clock} label="Availability" value={s.meeting_availability} />}
            {s.referral_source && <InfoRow icon={FileText} label="Referral" value={s.referral_source} />}
          </Section>

          {/* Status Change */}
          <Section title="Update Status">
            <div className="flex gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="glass-input flex-1 px-3 py-2 text-sm text-foreground"
              >
                {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <button
                onClick={handleStatusChange}
                disabled={updating || newStatus === s.status}
                className="gel-btn px-4 py-2 text-xs font-semibold disabled:opacity-30"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </Section>

          {/* View client-facing estimate */}
          <a
            href={`/estimate/result/${s.id}`}
            target="_blank"
            className="neu-btn-raised flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground"
          >
            <Eye className="h-4 w-4" /> View Client Estimate Page
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  link?: string;
}) {
  const content = link ? (
    <a href={link} className="text-primary hover:underline">{value}</a>
  ) : (
    <span className="text-foreground/80">{value}</span>
  );
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
      <span className="shrink-0 text-muted">{label}:</span>
      {content}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) onLogout();
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token, filter, onLogout]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  async function openDetail(id: string) {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDetail(await res.json());
      }
    } catch {
      // silent
    } finally {
      setDetailLoading(false);
    }
  }

  // Stats
  const newCount = submissions.filter((s) => s.status === 'new').length;
  const acceptedCount = submissions.filter((s) => s.status === 'accepted').length;
  const pendingCount = submissions.filter((s) => ['adjustment-requested', 'review-requested'].includes(s.status)).length;
  const totalValue = submissions.reduce((sum, s) => sum + (s.estimate_max_cost || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-glass-border bg-[var(--background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">codene</span>
            <span className="text-sm text-muted">/ admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin/documents" className="rounded-lg p-2 text-muted hover:text-foreground" title="Documents">
              <FileText className="h-4 w-4" />
            </a>
            <button onClick={fetchSubmissions} className="rounded-lg p-2 text-muted hover:text-foreground" title="Refresh">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onLogout} className="rounded-lg p-2 text-muted hover:text-foreground" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="New" value={newCount} color="text-cyan-400" />
          <StatCard label="Accepted" value={acceptedCount} color="text-emerald-400" />
          <StatCard label="Pending" value={pendingCount} color="text-amber-400" />
          <StatCard label="Pipeline" value={formatCurrency(totalValue)} color="text-primary" />
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {['all', 'new', 'accepted', 'adjustment-requested', 'review-requested', 'in-progress', 'completed', 'declined'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filter === f
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'border-glass-border bg-glass-bg text-muted hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'All' : (STATUS_MAP[f]?.label || f)}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {loading && submissions.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-20 text-center text-muted">
            <FileText className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p>No submissions found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.map((s) => (
              <button
                key={s.id}
                onClick={() => openDetail(s.id)}
                className="group glass-panel flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all hover:border-primary/20"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">{s.project_name}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                    <span>{s.client_name}</span>
                    {s.company_name && <span>&middot; {s.company_name}</span>}
                    <span>&middot; {timeAgo(s.created_at)}</span>
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(s.estimate_min_cost)}–{formatCurrency(s.estimate_max_cost)}
                  </p>
                  <p className="text-xs text-muted">
                    {s.estimate_weeks_min}–{s.estimate_weeks_max} wks &middot; {s.target_platforms}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedId && (
        detailLoading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DetailPanel
            submission={detail}
            token={token}
            onClose={() => { setSelectedId(null); setDetail(null); }}
            onUpdated={() => { fetchSubmissions(); if (selectedId) openDetail(selectedId); }}
          />
        )
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('admin-token');
    if (stored) setToken(stored);
  }, []);

  function handleLogout() {
    sessionStorage.removeItem('admin-token');
    setToken(null);
  }

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
