/* ── Types for all pipeline document templates ── */

export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface ProjectInfo {
  name: string;
  description?: string;
  platform?: string;
}

export interface ProposalData {
  client: ClientInfo;
  project: ProjectInfo;
  scopeItems: { feature: string; description: string; hours: string; cost: string }[];
  totalCostMin: number;
  totalCostMax: number;
  totalWeeksMin: number;
  totalWeeksMax: number;
  timeline: { phase: string; weeks: string; description: string }[];
  depositAmount: number;
  validUntil: string;
  notes?: string;
}

export interface AgreementData {
  client: ClientInfo;
  project: ProjectInfo;
  scopeSummary: string;
  deliverables: string[];
  totalCostMin: number;
  totalCostMax: number;
  depositAmount: number;
  paymentSchedule: { milestone: string; percentage: number; amount: string }[];
  startDate: string;
  estimatedEndDate: string;
  revisionRounds: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  client: ClientInfo;
  project: ProjectInfo;
  issueDate: string;
  dueDate: string;
  lineItems: { description: string; quantity: number; rate: number; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod?: string;
  notes?: string;
}

export interface ChangeOrderData {
  orderNumber: string;
  client: ClientInfo;
  project: ProjectInfo;
  date: string;
  originalScope: string;
  requestedChanges: { change: string; impact: string; costDelta: string; timeDelta: string }[];
  totalCostImpact: string;
  totalTimeImpact: string;
  reason: string;
  notes?: string;
}

export interface CompletionData {
  client: ClientInfo;
  project: ProjectInfo;
  completionDate: string;
  deliverables: { item: string; status: string }[];
  handoffItems: { item: string; location: string }[];
  supportPeriod: string;
  finalAmount: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
}
