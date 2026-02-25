import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Letterhead, shared } from './letterhead';
import { C } from './brand';
import type { CompletionData } from './types';
import { formatCurrency } from '@/lib/utils';

const s = StyleSheet.create({
  colItem: { flex: 4 },
  colStatus: { flex: 1.5, textAlign: 'center' },
  colLocation: { flex: 3 },
  checkmark: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
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
  thankYou: {
    marginTop: 20,
    padding: 16,
    backgroundColor: C.copperBg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.copperBorder,
    alignItems: 'center',
  },
  thankYouTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: C.copper,
    marginBottom: 4,
  },
  thankYouText: {
    fontSize: 9,
    color: C.slate700,
    textAlign: 'center',
    lineHeight: 1.5,
  },
});

export function CompletionDocument({ data }: { data: CompletionData }) {
  const { client, project, deliverables, handoffItems } = data;
  const docId = `CMP-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <Document>
      <Letterhead title="Project Completion" subtitle={project.name} docId={docId} date={data.completionDate}>
        {/* Meta */}
        <View style={shared.metaRow}>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Client</Text>
            <Text style={shared.metaValue}>{client.name}</Text>
            {client.company && <Text style={{ fontSize: 9, color: C.slate500 }}>{client.company}</Text>}
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Project</Text>
            <Text style={shared.metaValue}>{project.name}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Completion Date</Text>
            <Text style={shared.metaValue}>{data.completionDate}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Support Until</Text>
            <Text style={shared.metaValue}>{data.supportPeriod}</Text>
          </View>
        </View>

        {/* Deliverables Checklist */}
        <Text style={shared.sectionTitle}>Deliverables Checklist</Text>
        <View style={shared.tableHead}>
          <Text style={[shared.tableHeadText, s.colItem]}>Deliverable</Text>
          <Text style={[shared.tableHeadText, s.colStatus]}>Status</Text>
        </View>
        {deliverables.map((item, i) => (
          <View key={i} style={[shared.tableRow, i % 2 === 1 ? shared.tableRowAlt : {}]}>
            <Text style={[shared.tableRowText, s.colItem]}>{item.item}</Text>
            <Text style={[shared.tableRowText, s.colStatus, s.checkmark]}>{item.status}</Text>
          </View>
        ))}

        {/* Handoff Items */}
        <View style={{ marginTop: 16 }}>
          <Text style={shared.sectionTitle}>Handoff & Access</Text>
          <View style={shared.tableHead}>
            <Text style={[shared.tableHeadText, s.colItem]}>Item</Text>
            <Text style={[shared.tableHeadText, s.colLocation]}>Location / Access</Text>
          </View>
          {handoffItems.map((item, i) => (
            <View key={i} style={[shared.tableRow, i % 2 === 1 ? shared.tableRowAlt : {}]}>
              <Text style={[shared.tableRowText, s.colItem]}>{item.item}</Text>
              <Text style={[shared.tableRowText, s.colLocation, { color: C.slate500 }]}>{item.location}</Text>
            </View>
          ))}
        </View>

        {/* Financial Summary */}
        <View style={{ marginTop: 16 }}>
          <Text style={shared.sectionTitle}>Financial Summary</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[shared.summaryCard, shared.summaryCardDefault]}>
              <Text style={shared.summaryLabel}>Final Amount</Text>
              <Text style={[shared.summaryValue, shared.summaryValueDark]}>{formatCurrency(data.finalAmount)}</Text>
            </View>
            <View style={[shared.summaryCard, shared.summaryCardDefault]}>
              <Text style={shared.summaryLabel}>Amount Paid</Text>
              <Text style={[shared.summaryValue, { color: '#16a34a' }]}>{formatCurrency(data.amountPaid)}</Text>
            </View>
            <View style={[shared.summaryCard, data.balanceDue > 0 ? shared.summaryCardPrimary : shared.summaryCardDefault]}>
              <Text style={shared.summaryLabel}>Balance Due</Text>
              <Text style={[shared.summaryValue, data.balanceDue > 0 ? shared.summaryValueCopper : { color: '#16a34a' }]}>
                {data.balanceDue > 0 ? formatCurrency(data.balanceDue) : 'PAID'}
              </Text>
            </View>
          </View>
        </View>

        {/* Post-Launch Support */}
        <View style={shared.notesBox}>
          <Text style={shared.notesTitle}>Post-Launch Support</Text>
          <Text style={shared.notesText}>
            Codene will provide complimentary bug fix support through {data.supportPeriod}. This covers defects in the delivered work only — new features, content changes, or issues caused by third-party services are not included. Extended maintenance and support packages are available upon request.
          </Text>
        </View>

        {data.notes && (
          <View style={shared.notesBox}>
            <Text style={shared.notesTitle}>Notes</Text>
            <Text style={shared.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Acceptance */}
        <View style={shared.notesBox}>
          <Text style={shared.notesTitle}>Client Acceptance</Text>
          <Text style={shared.notesText}>
            By signing below, the Client confirms receipt of all deliverables listed above and accepts the project as complete. Any remaining balance is due within 7 days of signing.
          </Text>
        </View>

        {/* Signatures */}
        <View style={s.signBlock}>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Client Acceptance</Text>
            <Text style={s.signName}>{client.name}</Text>
            <Text style={[s.signLabel, { marginTop: 20 }]}>Date: _______________</Text>
          </View>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Codene Representative</Text>
            <Text style={s.signName}>Codene Development</Text>
            <Text style={[s.signLabel, { marginTop: 20 }]}>Date: _______________</Text>
          </View>
        </View>

        {/* Thank You */}
        <View style={s.thankYou}>
          <Text style={s.thankYouTitle}>Thank You for Choosing Codene</Text>
          <Text style={s.thankYouText}>
            We appreciate your trust in our team. If you need future development, maintenance, or new features, we&apos;re always here to help. We&apos;d also love a referral if you know someone who could use our services.
          </Text>
        </View>
      </Letterhead>
    </Document>
  );
}
