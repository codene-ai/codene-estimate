import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Letterhead, shared } from './letterhead';
import { C } from './brand';
import type { AgreementData } from './types';
import { formatCurrency } from '@/lib/utils';

const s = StyleSheet.create({
  clauseNum: {
    fontSize: 10,
    fontWeight: 'bold',
    color: C.copper,
    marginRight: 8,
    width: 20,
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: C.slate900,
    marginBottom: 4,
  },
  clauseBody: {
    fontSize: 9,
    color: C.slate700,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  clauseRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  clauseContent: {
    flex: 1,
  },
  colMilestone: { flex: 3 },
  colPct: { flex: 1, textAlign: 'center' },
  colAmount: { flex: 2, textAlign: 'right' },
  signBlock: {
    marginTop: 28,
    flexDirection: 'row',
    gap: 40,
  },
  signLine: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: C.slate300,
    paddingTop: 6,
  },
  signLabel: {
    fontSize: 8,
    color: C.slate500,
    marginBottom: 2,
  },
  signName: {
    fontSize: 9,
    color: C.slate700,
  },
});

function Clause({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <View style={s.clauseRow}>
      <Text style={s.clauseNum}>{num}.</Text>
      <View style={s.clauseContent}>
        <Text style={s.clauseTitle}>{title}</Text>
        {children}
      </View>
    </View>
  );
}

export function AgreementDocument({ data }: { data: AgreementData }) {
  const { client, project, paymentSchedule } = data;
  const docId = `AGR-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <Document>
      <Letterhead title="Project Agreement" subtitle={project.name} docId={docId}>
        {/* Parties */}
        <View style={shared.metaRow}>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Client</Text>
            <Text style={shared.metaValue}>{client.name}</Text>
            {client.company && <Text style={{ fontSize: 9, color: C.slate500 }}>{client.company}</Text>}
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Developer</Text>
            <Text style={shared.metaValue}>Codene Development</Text>
            <Text style={{ fontSize: 9, color: C.slate500 }}>codene.us</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Start Date</Text>
            <Text style={shared.metaValue}>{data.startDate}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Est. Completion</Text>
            <Text style={shared.metaValue}>{data.estimatedEndDate}</Text>
          </View>
        </View>

        {/* Clauses */}
        <Clause num={1} title="Scope of Work">
          <Text style={s.clauseBody}>{data.scopeSummary}</Text>
          <Text style={[s.clauseBody, { fontWeight: 'bold', marginTop: 4 }]}>Deliverables:</Text>
          {data.deliverables.map((d, i) => (
            <View key={i} style={shared.bulletItem}>
              <Text style={shared.bullet}>•</Text>
              <Text style={shared.bulletText}>{d}</Text>
            </View>
          ))}
        </Clause>

        <Clause num={2} title="Project Cost">
          <Text style={s.clauseBody}>
            The total project cost is estimated at {formatCurrency(data.totalCostMin)} to {formatCurrency(data.totalCostMax)}, based on the agreed scope of work. The final cost will depend on actual hours worked within each phase.
          </Text>
        </Clause>

        <Clause num={3} title="Payment Schedule">
          <Text style={s.clauseBody}>
            A non-refundable deposit of {formatCurrency(data.depositAmount)} is due upon signing this agreement. Remaining payments are structured as follows:
          </Text>
          <View style={[shared.tableHead, { marginTop: 6 }]}>
            <Text style={[shared.tableHeadText, s.colMilestone]}>Milestone</Text>
            <Text style={[shared.tableHeadText, s.colPct]}>%</Text>
            <Text style={[shared.tableHeadText, s.colAmount]}>Amount</Text>
          </View>
          {paymentSchedule.map((item, i) => (
            <View key={i} style={[shared.tableRow, i % 2 === 1 ? shared.tableRowAlt : {}]}>
              <Text style={[shared.tableRowText, s.colMilestone]}>{item.milestone}</Text>
              <Text style={[shared.tableRowText, s.colPct]}>{item.percentage}%</Text>
              <Text style={[shared.tableRowText, s.colAmount]}>{item.amount}</Text>
            </View>
          ))}
          <Text style={[s.clauseBody, { marginTop: 6 }]}>All invoices are due within 7 days of issue.</Text>
        </Clause>

        <Clause num={4} title="Timeline">
          <Text style={s.clauseBody}>
            Work will begin on {data.startDate} with an estimated completion of {data.estimatedEndDate}. Timeline is subject to timely client feedback and approvals. Delays in client responses may extend the completion date.
          </Text>
        </Clause>

        <Clause num={5} title="Revisions & Changes">
          <Text style={s.clauseBody}>
            This agreement includes up to {data.revisionRounds} rounds of revisions per project phase. Additional revisions or scope changes beyond the agreed deliverables will require a formal Change Order with associated cost and timeline adjustments approved in writing by both parties.
          </Text>
        </Clause>

        <Clause num={6} title="Intellectual Property">
          <Text style={s.clauseBody}>
            Upon receipt of full payment, the Client receives full ownership of all custom code, designs, and assets created specifically for this project. Codene retains the right to use general-purpose tools, libraries, and frameworks. Third-party assets (fonts, icons, stock media) remain subject to their respective licenses.
          </Text>
        </Clause>

        <Clause num={7} title="Confidentiality">
          <Text style={s.clauseBody}>
            Both parties agree to keep all project details, business information, and communications confidential. Neither party will disclose proprietary information to third parties without written consent. Codene may reference the project in its portfolio with Client approval.
          </Text>
        </Clause>

        <Clause num={8} title="Termination">
          <Text style={s.clauseBody}>
            Either party may terminate this agreement with 14 days written notice. In the event of termination, the Client will pay for all work completed up to the termination date. The deposit is non-refundable. Completed deliverables will be transferred upon payment settlement.
          </Text>
        </Clause>

        <Clause num={9} title="Warranty & Support">
          <Text style={s.clauseBody}>
            Codene provides a 14-day post-launch warranty period to address bugs or defects in the delivered work at no additional cost. Issues arising from client modifications, third-party services, or new requirements are not covered under this warranty. Extended support is available as a separate engagement.
          </Text>
        </Clause>

        <Clause num={10} title="Limitation of Liability">
          <Text style={s.clauseBody}>
            Codene&apos;s total liability under this agreement shall not exceed the total amount paid by the Client. Codene is not liable for indirect, incidental, or consequential damages, including lost profits or data loss, except in cases of gross negligence.
          </Text>
        </Clause>

        {/* Signature Block */}
        <View style={s.signBlock}>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Client Signature</Text>
            <Text style={s.signName}>{client.name}</Text>
            <Text style={[s.signLabel, { marginTop: 20 }]}>Date: _______________</Text>
          </View>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Codene Representative</Text>
            <Text style={s.signName}>Codene Development</Text>
            <Text style={[s.signLabel, { marginTop: 20 }]}>Date: _______________</Text>
          </View>
        </View>
      </Letterhead>
    </Document>
  );
}
