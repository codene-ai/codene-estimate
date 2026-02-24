import { AlertCircle, FileText, DollarSign } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="space-y-4">
      {/* Main Disclaimer */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-muted" />
          <div>
            <p className="text-sm font-medium text-foreground">Important Disclaimer</p>
            <p className="mt-1 text-sm text-muted">
              This is an automated estimate based on the features you selected.
              Final pricing and timeline may vary based on a detailed requirements
              review, design complexity, third-party integrations, and other
              project-specific factors. A member of our team will review your
              submission and follow up with a refined quote.
            </p>
          </div>
        </div>
      </div>

      {/* Deposit Requirement */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex gap-3">
          <DollarSign className="h-5 w-5 shrink-0 text-[#d4944c]" />
          <div>
            <p className="text-sm font-medium text-foreground">Deposit Requirement</p>
            <p className="mt-1 text-sm text-muted">
              A non-refundable deposit of <span className="font-semibold text-foreground">$250–$500</span> is
              required for all projects before work begins. The deposit amount will be
              determined based on project scope and applied toward the total project cost.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription & Backend Costs */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex gap-3">
          <FileText className="h-5 w-5 shrink-0 text-cyan-400" />
          <div>
            <p className="text-sm font-medium text-foreground">Subscription & Backend Costs</p>
            <p className="mt-1 text-sm text-muted">
              Any subscription costs for backend development services (hosting, databases,
              third-party APIs, cloud infrastructure) are subject to change based on
              current pricing at the time of development. All significant changes to
              pricing will be documented and presented in a formal change order that
              requires client written approval before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
