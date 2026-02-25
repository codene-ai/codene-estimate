'use client';

import { useState, useEffect } from 'react';
import {
  Lock,
  ArrowLeft,
  FileText,
  Send,
  Receipt,
  GitPullRequest,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Download,
  Plus,
  Trash2,
} from 'lucide-react';

/* ── Auth ──────────────────────────────────────────────────── */
function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const stored = sessionStorage.getItem('admin-token');
    if (stored) setToken(stored);
  }, []);
  return { token, setToken };
}

/* ── Shared form helpers ──────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="glass-input w-full px-3 py-2 text-sm text-foreground"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="glass-input w-full px-3 py-2 text-sm text-foreground"
    />
  );
}

/* ── Client Info Block ──────────────────────────────────── */
function ClientFields({ client, setClient }: {
  client: { name: string; email: string; phone: string; company: string };
  setClient: (c: any) => void;
}) {
  const set = (k: string, v: string) => setClient({ ...client, [k]: v });
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Client Name"><Input value={client.name} onChange={(v) => set('name', v)} placeholder="Jane Doe" /></Field>
      <Field label="Company"><Input value={client.company} onChange={(v) => set('company', v)} placeholder="Acme Inc (optional)" /></Field>
      <Field label="Email"><Input value={client.email} onChange={(v) => set('email', v)} placeholder="jane@example.com" type="email" /></Field>
      <Field label="Phone"><Input value={client.phone} onChange={(v) => set('phone', v)} placeholder="(555) 123-4567" /></Field>
    </div>
  );
}

/* ── Project Info Block ──────────────────────────────────── */
function ProjectFields({ project, setProject, showDesc = false }: {
  project: { name: string; description: string; platform: string };
  setProject: (p: any) => void;
  showDesc?: boolean;
}) {
  const set = (k: string, v: string) => setProject({ ...project, [k]: v });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Project Name"><Input value={project.name} onChange={(v) => set('name', v)} placeholder="MyApp" /></Field>
        <Field label="Platform"><Input value={project.platform} onChange={(v) => set('platform', v)} placeholder="iOS & Android" /></Field>
      </div>
      {showDesc && (
        <Field label="Description"><Textarea value={project.description} onChange={(v) => set('description', v)} placeholder="Brief project description..." /></Field>
      )}
    </div>
  );
}

/* ── Dynamic row list ────────────────────────────────────── */
function DynamicRows<T extends Record<string, string>>({
  items,
  setItems,
  columns,
  emptyRow,
}: {
  items: T[];
  setItems: (items: T[]) => void;
  columns: { key: keyof T; label: string; placeholder: string; flex?: number }[];
  emptyRow: T;
}) {
  const add = () => setItems([...items, { ...emptyRow }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof T, val: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    setItems(copy);
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {columns.map((col) => (
          <div key={String(col.key)} style={{ flex: col.flex || 1 }}>{col.label}</div>
        ))}
        <div style={{ width: 32 }} />
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {columns.map((col) => (
            <div key={String(col.key)} style={{ flex: col.flex || 1 }}>
              <input
                value={item[col.key]}
                onChange={(e) => update(i, col.key, e.target.value)}
                placeholder={col.placeholder}
                className="glass-input w-full px-2 py-1.5 text-xs text-foreground"
              />
            </div>
          ))}
          <button onClick={() => remove(i)} className="shrink-0 rounded p-1 text-muted hover:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1 text-xs text-primary hover:underline">
        <Plus className="h-3 w-3" /> Add row
      </button>
    </div>
  );
}

/* ── Document forms ──────────────────────────────────────── */

function ProposalForm({ onGenerate, loading }: { onGenerate: (type: string, data: any) => void; loading: boolean }) {
  const [client, setClient] = useState({ name: '', email: '', phone: '', company: '' });
  const [project, setProject] = useState({ name: '', description: '', platform: '' });
  const [scopeItems, setScopeItems] = useState([{ feature: '', description: '', hours: '', cost: '' }]);
  const [timeline, setTimeline] = useState([
    { phase: 'Discovery & Planning', weeks: '', description: 'Requirements gathering, project roadmap' },
    { phase: 'UI/UX Design', weeks: '', description: 'Wireframes, mockups, design system' },
    { phase: 'Development', weeks: '', description: 'Frontend and backend implementation' },
    { phase: 'QA & Testing', weeks: '', description: 'Testing, bug fixes, optimization' },
    { phase: 'Deployment & Launch', weeks: '', description: 'App store submission, production deploy' },
  ]);
  const [totalCostMin, setTotalCostMin] = useState('');
  const [totalCostMax, setTotalCostMax] = useState('');
  const [totalWeeksMin, setTotalWeeksMin] = useState('');
  const [totalWeeksMax, setTotalWeeksMax] = useState('');
  const [depositAmount, setDepositAmount] = useState('300');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      <SectionLabel title="Client Information" />
      <ClientFields client={client} setClient={setClient} />
      <SectionLabel title="Project" />
      <ProjectFields project={project} setProject={setProject} showDesc />
      <SectionLabel title="Scope of Work" />
      <DynamicRows
        items={scopeItems}
        setItems={setScopeItems}
        columns={[
          { key: 'feature', label: 'Feature', placeholder: 'User Authentication', flex: 2 },
          { key: 'description', label: 'Description', placeholder: 'Email/password + social login', flex: 3 },
          { key: 'hours', label: 'Hours', placeholder: '20-30' },
          { key: 'cost', label: 'Cost', placeholder: '$700-$1,050' },
        ]}
        emptyRow={{ feature: '', description: '', hours: '', cost: '' }}
      />
      <SectionLabel title="Timeline Phases" />
      <DynamicRows
        items={timeline}
        setItems={setTimeline}
        columns={[
          { key: 'phase', label: 'Phase', placeholder: 'Development', flex: 2 },
          { key: 'weeks', label: 'Weeks', placeholder: '3-4 wks' },
          { key: 'description', label: 'Description', placeholder: 'Implementation details', flex: 3 },
        ]}
        emptyRow={{ phase: '', weeks: '', description: '' }}
      />
      <SectionLabel title="Totals" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Cost Min ($)"><Input value={totalCostMin} onChange={setTotalCostMin} placeholder="5000" type="number" /></Field>
        <Field label="Cost Max ($)"><Input value={totalCostMax} onChange={setTotalCostMax} placeholder="8000" type="number" /></Field>
        <Field label="Weeks Min"><Input value={totalWeeksMin} onChange={setTotalWeeksMin} placeholder="6" type="number" /></Field>
        <Field label="Weeks Max"><Input value={totalWeeksMax} onChange={setTotalWeeksMax} placeholder="10" type="number" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Deposit ($)"><Input value={depositAmount} onChange={setDepositAmount} placeholder="300" type="number" /></Field>
        <Field label="Valid Until"><Input value={validUntil} onChange={setValidUntil} placeholder="March 30, 2026" /></Field>
      </div>
      <Field label="Additional Notes"><Textarea value={notes} onChange={setNotes} placeholder="Any extra notes..." /></Field>
      <button
        onClick={() => onGenerate('proposal', {
          client, project, scopeItems: scopeItems.filter((s) => s.feature),
          timeline: timeline.filter((t) => t.phase),
          totalCostMin: Number(totalCostMin), totalCostMax: Number(totalCostMax),
          totalWeeksMin: Number(totalWeeksMin), totalWeeksMax: Number(totalWeeksMax),
          depositAmount: Number(depositAmount), validUntil, notes,
        })}
        disabled={loading || !client.name || !project.name}
        className="gel-btn w-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Generate Proposal PDF'}
      </button>
    </div>
  );
}

function AgreementForm({ onGenerate, loading }: { onGenerate: (type: string, data: any) => void; loading: boolean }) {
  const [client, setClient] = useState({ name: '', email: '', phone: '', company: '' });
  const [project, setProject] = useState({ name: '', description: '', platform: '' });
  const [scopeSummary, setScopeSummary] = useState('');
  const [deliverables, setDeliverables] = useState(['']);
  const [totalCostMin, setTotalCostMin] = useState('');
  const [totalCostMax, setTotalCostMax] = useState('');
  const [depositAmount, setDepositAmount] = useState('300');
  const [paymentSchedule, setPaymentSchedule] = useState([
    { milestone: 'Project Deposit', percentage: '100', amount: '' },
    { milestone: 'Design Approval', percentage: '25', amount: '' },
    { milestone: 'Development Midpoint', percentage: '25', amount: '' },
    { milestone: 'Beta Delivery', percentage: '25', amount: '' },
    { milestone: 'Final Launch', percentage: '25', amount: '' },
  ]);
  const [startDate, setStartDate] = useState('');
  const [estimatedEndDate, setEstimatedEndDate] = useState('');
  const [revisionRounds, setRevisionRounds] = useState('2');

  return (
    <div className="space-y-6">
      <SectionLabel title="Client Information" />
      <ClientFields client={client} setClient={setClient} />
      <SectionLabel title="Project" />
      <ProjectFields project={project} setProject={setProject} />
      <SectionLabel title="Scope Summary" />
      <Textarea value={scopeSummary} onChange={setScopeSummary} placeholder="Describe the full scope of work..." rows={4} />
      <SectionLabel title="Deliverables" />
      {deliverables.map((d, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={d}
            onChange={(e) => { const copy = [...deliverables]; copy[i] = e.target.value; setDeliverables(copy); }}
            placeholder="e.g. Native iOS & Android app"
            className="glass-input flex-1 px-3 py-2 text-sm text-foreground"
          />
          <button onClick={() => setDeliverables(deliverables.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-400">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button onClick={() => setDeliverables([...deliverables, ''])} className="flex items-center gap-1 text-xs text-primary hover:underline">
        <Plus className="h-3 w-3" /> Add deliverable
      </button>
      <SectionLabel title="Financials" />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Cost Min ($)"><Input value={totalCostMin} onChange={setTotalCostMin} placeholder="5000" type="number" /></Field>
        <Field label="Cost Max ($)"><Input value={totalCostMax} onChange={setTotalCostMax} placeholder="8000" type="number" /></Field>
        <Field label="Deposit ($)"><Input value={depositAmount} onChange={setDepositAmount} placeholder="300" type="number" /></Field>
      </div>
      <SectionLabel title="Payment Schedule" />
      <DynamicRows
        items={paymentSchedule}
        setItems={setPaymentSchedule}
        columns={[
          { key: 'milestone', label: 'Milestone', placeholder: 'Design Approval', flex: 3 },
          { key: 'percentage', label: '%', placeholder: '25' },
          { key: 'amount', label: 'Amount', placeholder: '$1,500' },
        ]}
        emptyRow={{ milestone: '', percentage: '', amount: '' }}
      />
      <SectionLabel title="Timeline" />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Start Date"><Input value={startDate} onChange={setStartDate} placeholder="March 1, 2026" /></Field>
        <Field label="Est. End Date"><Input value={estimatedEndDate} onChange={setEstimatedEndDate} placeholder="June 1, 2026" /></Field>
        <Field label="Revision Rounds"><Input value={revisionRounds} onChange={setRevisionRounds} placeholder="2" type="number" /></Field>
      </div>
      <button
        onClick={() => onGenerate('agreement', {
          client, project, scopeSummary,
          deliverables: deliverables.filter(Boolean),
          totalCostMin: Number(totalCostMin), totalCostMax: Number(totalCostMax),
          depositAmount: Number(depositAmount),
          paymentSchedule: paymentSchedule.filter((p) => p.milestone).map((p) => ({
            ...p, percentage: Number(p.percentage),
          })),
          startDate, estimatedEndDate, revisionRounds: Number(revisionRounds),
        })}
        disabled={loading || !client.name || !project.name}
        className="gel-btn w-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Generate Agreement PDF'}
      </button>
    </div>
  );
}

function InvoiceForm({ onGenerate, loading }: { onGenerate: (type: string, data: any) => void; loading: boolean }) {
  const [client, setClient] = useState({ name: '', email: '', phone: '', company: '' });
  const [project, setProject] = useState({ name: '', description: '', platform: '' });
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString(36).toUpperCase().slice(-6)}`);
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [dueDate, setDueDate] = useState('');
  const [lineItems, setLineItems] = useState([{ description: '', quantity: '1', rate: '', amount: '' }]);
  const [amountPaid, setAmountPaid] = useState('0');
  const [tax, setTax] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const total = subtotal + Number(tax || 0);
  const balanceDue = total - Number(amountPaid || 0);

  return (
    <div className="space-y-6">
      <SectionLabel title="Client Information" />
      <ClientFields client={client} setClient={setClient} />
      <SectionLabel title="Project" />
      <ProjectFields project={project} setProject={setProject} />
      <SectionLabel title="Invoice Details" />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Invoice #"><Input value={invoiceNumber} onChange={setInvoiceNumber} /></Field>
        <Field label="Issue Date"><Input value={issueDate} onChange={setIssueDate} placeholder="March 1, 2026" /></Field>
        <Field label="Due Date"><Input value={dueDate} onChange={setDueDate} placeholder="March 8, 2026" /></Field>
      </div>
      <SectionLabel title="Line Items" />
      <DynamicRows
        items={lineItems}
        setItems={setLineItems}
        columns={[
          { key: 'description', label: 'Description', placeholder: 'Development - Sprint 1', flex: 4 },
          { key: 'quantity', label: 'Qty', placeholder: '1' },
          { key: 'rate', label: 'Rate', placeholder: '1500' },
          { key: 'amount', label: 'Amount', placeholder: '1500' },
        ]}
        emptyRow={{ description: '', quantity: '1', rate: '', amount: '' }}
      />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Tax ($)"><Input value={tax} onChange={setTax} placeholder="0" type="number" /></Field>
        <Field label="Amount Paid ($)"><Input value={amountPaid} onChange={setAmountPaid} placeholder="0" type="number" /></Field>
        <Field label="Payment Method"><Input value={paymentMethod} onChange={setPaymentMethod} placeholder="Zelle, PayPal..." /></Field>
      </div>
      <div className="glass-panel rounded-xl p-4 text-right">
        <p className="text-sm text-muted">Subtotal: <span className="font-semibold text-foreground">${subtotal.toLocaleString()}</span></p>
        <p className="text-sm text-muted">Tax: <span className="font-semibold text-foreground">${Number(tax).toLocaleString()}</span></p>
        <p className="mt-1 text-lg font-bold text-primary">Balance Due: ${balanceDue.toLocaleString()}</p>
      </div>
      <Field label="Notes"><Textarea value={notes} onChange={setNotes} placeholder="Thank you for your business..." /></Field>
      <button
        onClick={() => onGenerate('invoice', {
          client, project, invoiceNumber, issueDate, dueDate,
          lineItems: lineItems.filter((l) => l.description).map((l) => ({
            ...l, quantity: Number(l.quantity), rate: Number(l.rate), amount: Number(l.amount),
          })),
          subtotal, tax: Number(tax), total, amountPaid: Number(amountPaid), balanceDue,
          paymentMethod, notes,
        })}
        disabled={loading || !client.name || !project.name}
        className="gel-btn w-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Generate Invoice PDF'}
      </button>
    </div>
  );
}

function ChangeOrderForm({ onGenerate, loading }: { onGenerate: (type: string, data: any) => void; loading: boolean }) {
  const [client, setClient] = useState({ name: '', email: '', phone: '', company: '' });
  const [project, setProject] = useState({ name: '', description: '', platform: '' });
  const [orderNumber, setOrderNumber] = useState(`CO-${Date.now().toString(36).toUpperCase().slice(-6)}`);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [originalScope, setOriginalScope] = useState('');
  const [reason, setReason] = useState('');
  const [requestedChanges, setRequestedChanges] = useState([{ change: '', impact: '', costDelta: '', timeDelta: '' }]);
  const [totalCostImpact, setTotalCostImpact] = useState('');
  const [totalTimeImpact, setTotalTimeImpact] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      <SectionLabel title="Client Information" />
      <ClientFields client={client} setClient={setClient} />
      <SectionLabel title="Project" />
      <ProjectFields project={project} setProject={setProject} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Order #"><Input value={orderNumber} onChange={setOrderNumber} /></Field>
        <Field label="Date"><Input value={date} onChange={setDate} /></Field>
      </div>
      <Field label="Original Scope Reference"><Textarea value={originalScope} onChange={setOriginalScope} placeholder="Reference the original agreement scope..." /></Field>
      <Field label="Reason for Change"><Textarea value={reason} onChange={setReason} placeholder="Why is this change needed..." /></Field>
      <SectionLabel title="Requested Changes" />
      <DynamicRows
        items={requestedChanges}
        setItems={setRequestedChanges}
        columns={[
          { key: 'change', label: 'Change', placeholder: 'Add push notifications', flex: 3 },
          { key: 'impact', label: 'Impact', placeholder: 'Adds new service layer', flex: 2 },
          { key: 'costDelta', label: 'Cost +/-', placeholder: '+$800' },
          { key: 'timeDelta', label: 'Time +/-', placeholder: '+1 wk' },
        ]}
        emptyRow={{ change: '', impact: '', costDelta: '', timeDelta: '' }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Total Cost Impact"><Input value={totalCostImpact} onChange={setTotalCostImpact} placeholder="+$2,400" /></Field>
        <Field label="Total Time Impact"><Input value={totalTimeImpact} onChange={setTotalTimeImpact} placeholder="+2 weeks" /></Field>
      </div>
      <Field label="Notes"><Textarea value={notes} onChange={setNotes} placeholder="Any additional context..." /></Field>
      <button
        onClick={() => onGenerate('change-order', {
          client, project, orderNumber, date, originalScope, reason,
          requestedChanges: requestedChanges.filter((r) => r.change),
          totalCostImpact, totalTimeImpact, notes,
        })}
        disabled={loading || !client.name || !project.name}
        className="gel-btn w-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Generate Change Order PDF'}
      </button>
    </div>
  );
}

function CompletionForm({ onGenerate, loading }: { onGenerate: (type: string, data: any) => void; loading: boolean }) {
  const [client, setClient] = useState({ name: '', email: '', phone: '', company: '' });
  const [project, setProject] = useState({ name: '', description: '', platform: '' });
  const [completionDate, setCompletionDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [deliverables, setDeliverables] = useState([{ item: '', status: 'Delivered' }]);
  const [handoffItems, setHandoffItems] = useState([{ item: '', location: '' }]);
  const [supportPeriod, setSupportPeriod] = useState('');
  const [finalAmount, setFinalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('');

  const balanceDue = Number(finalAmount || 0) - Number(amountPaid || 0);

  return (
    <div className="space-y-6">
      <SectionLabel title="Client Information" />
      <ClientFields client={client} setClient={setClient} />
      <SectionLabel title="Project" />
      <ProjectFields project={project} setProject={setProject} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Completion Date"><Input value={completionDate} onChange={setCompletionDate} /></Field>
        <Field label="Support Period Ends"><Input value={supportPeriod} onChange={setSupportPeriod} placeholder="April 15, 2026" /></Field>
      </div>
      <SectionLabel title="Deliverables Checklist" />
      <DynamicRows
        items={deliverables}
        setItems={setDeliverables}
        columns={[
          { key: 'item', label: 'Deliverable', placeholder: 'iOS App - App Store', flex: 4 },
          { key: 'status', label: 'Status', placeholder: 'Delivered' },
        ]}
        emptyRow={{ item: '', status: 'Delivered' }}
      />
      <SectionLabel title="Handoff & Access" />
      <DynamicRows
        items={handoffItems}
        setItems={setHandoffItems}
        columns={[
          { key: 'item', label: 'Item', placeholder: 'Source code repository', flex: 2 },
          { key: 'location', label: 'Location / Access', placeholder: 'GitHub - transferred ownership', flex: 3 },
        ]}
        emptyRow={{ item: '', location: '' }}
      />
      <SectionLabel title="Financial Summary" />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Final Amount ($)"><Input value={finalAmount} onChange={setFinalAmount} placeholder="7500" type="number" /></Field>
        <Field label="Amount Paid ($)"><Input value={amountPaid} onChange={setAmountPaid} placeholder="7500" type="number" /></Field>
        <div className="glass-panel flex items-center justify-center rounded-xl p-3">
          <p className={`text-sm font-bold ${balanceDue > 0 ? 'text-primary' : 'text-emerald-400'}`}>
            {balanceDue > 0 ? `$${balanceDue.toLocaleString()} due` : 'Fully Paid'}
          </p>
        </div>
      </div>
      <Field label="Notes"><Textarea value={notes} onChange={setNotes} placeholder="Thank you for choosing Codene..." /></Field>
      <button
        onClick={() => onGenerate('completion', {
          client, project, completionDate,
          deliverables: deliverables.filter((d) => d.item),
          handoffItems: handoffItems.filter((h) => h.item),
          supportPeriod, finalAmount: Number(finalAmount), amountPaid: Number(amountPaid),
          balanceDue, notes,
        })}
        disabled={loading || !client.name || !project.name}
        className="gel-btn w-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Generate Completion PDF'}
      </button>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <h3 className="border-b border-glass-border pb-2 text-xs font-bold uppercase tracking-wider text-primary">
      {title}
    </h3>
  );
}

/* ── Document type cards ─────────────────────────────────── */
const DOC_TYPES = [
  { id: 'proposal', label: 'Proposal / SOW', icon: Send, desc: 'Scope, timeline, and cost estimate for client approval' },
  { id: 'agreement', label: 'Project Agreement', icon: FileText, desc: 'Binding contract with payment terms and legal clauses' },
  { id: 'invoice', label: 'Invoice', icon: Receipt, desc: 'Bill for milestone payments or completed work' },
  { id: 'change-order', label: 'Change Order', icon: GitPullRequest, desc: 'Scope changes with cost and timeline impact' },
  { id: 'completion', label: 'Project Completion', icon: CheckCircle2, desc: 'Deliverable handoff and project sign-off' },
] as const;

/* ── Main page ───────────────────────────────────────────── */
export default function DocumentsPage() {
  const { token, setToken } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel w-full max-w-sm p-8 text-center">
          <Lock className="mx-auto mb-4 h-8 w-8 text-primary" />
          <p className="text-sm text-muted mb-4">Sign in from the admin dashboard first</p>
          <a href="/admin" className="gel-btn inline-block px-6 py-2 text-sm font-semibold">Go to Admin</a>
        </div>
      </div>
    );
  }

  async function handleGenerate(type: string, data: any) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, data }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Generation failed' }));
        throw new Error(err.error || 'Generation failed');
      }

      // Download the PDF
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codene-${type}-${Date.now().toString(36)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || 'Failed to generate document');
    } finally {
      setLoading(false);
    }
  }

  const FORMS: Record<string, React.ComponentType<{ onGenerate: (type: string, data: any) => void; loading: boolean }>> = {
    proposal: ProposalForm,
    agreement: AgreementForm,
    invoice: InvoiceForm,
    'change-order': ChangeOrderForm,
    completion: CompletionForm,
  };

  const FormComponent = selectedType ? FORMS[selectedType] : null;

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-glass-border bg-[var(--background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/admin" className="rounded-lg p-2 text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <span className="text-lg font-bold text-primary">codene</span>
            <span className="text-sm text-muted">/ documents</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Pipeline Overview */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-foreground mb-2">Project Documents</h1>
          <p className="text-sm text-muted">Generate branded PDF documents for each stage of your project pipeline.</p>
          <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-2">
            {['Lead', 'Estimate', 'Proposal', 'Agreement', 'Production', 'Invoice', 'Completion'].map((stage, i, arr) => (
              <div key={stage} className="flex items-center gap-1 shrink-0">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  i <= 1 ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-glass-bg text-muted border border-glass-border'
                }`}>
                  {stage}
                </span>
                {i < arr.length - 1 && <span className="text-muted/30">→</span>}
              </div>
            ))}
          </div>
        </div>

        {!selectedType ? (
          /* Document Type Selection */
          <div className="grid gap-3 sm:grid-cols-2">
            {DOC_TYPES.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedType(doc.id)}
                className="glass-panel group flex items-start gap-4 rounded-xl p-5 text-left transition-all hover:border-primary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <doc.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{doc.label}</p>
                  <p className="mt-1 text-xs text-muted">{doc.desc}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Document Form */
          <div>
            <button
              onClick={() => { setSelectedType(null); setError(''); }}
              className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to documents
            </button>

            <div className="glass-panel rounded-xl p-6">
              <div className="mb-6 flex items-center gap-3">
                {(() => {
                  const doc = DOC_TYPES.find((d) => d.id === selectedType)!;
                  return (
                    <>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <doc.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{doc.label}</h2>
                        <p className="text-xs text-muted">{doc.desc}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              {FormComponent && <FormComponent onGenerate={handleGenerate} loading={loading} />}
            </div>
          </div>
        )}

        {/* Process Guide */}
        <div className="mt-10 glass-panel rounded-xl p-6">
          <h2 className="text-sm font-bold text-foreground mb-4">Your Project Pipeline — Quick Reference</h2>
          <div className="space-y-3 text-xs text-muted leading-relaxed">
            <div className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">1</span>
              <div><span className="font-semibold text-foreground">Lead comes in</span> — Client submits the estimate form on codene.us. You get an email + dashboard notification.</div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">2</span>
              <div><span className="font-semibold text-foreground">Review the estimate</span> — Check the auto-generated estimate in your admin dashboard. Adjust if needed.</div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">3</span>
              <div><span className="font-semibold text-foreground">Send the Proposal</span> — Generate a Proposal PDF with scope, timeline, and pricing. Email it to the client for review.</div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">4</span>
              <div><span className="font-semibold text-foreground">Sign the Agreement</span> — Once accepted, generate a Project Agreement. Both parties sign. Collect the deposit.</div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">5</span>
              <div><span className="font-semibold text-foreground">Build & invoice</span> — During production, send Invoices at each milestone. If scope changes, create a Change Order first.</div>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-bold">6</span>
              <div><span className="font-semibold text-foreground">Deliver & close</span> — Generate a Completion document. Hand off all deliverables, get final sign-off, collect remaining balance.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
