import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Letterhead, shared } from './letterhead';
import { C } from './brand';
import type { ChangeOrderData } from './types';

const s = StyleSheet.create({
  colChange: { flex: 3 },
  colImpact: { flex: 2 },
  colCost: { flex: 1.5, textAlign: 'right' },
  colTime: { flex: 1.5, textAlign: 'right' },
  impactSummary: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 16,
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
});

export function ChangeOrderDocument({ data }: { data: ChangeOrderData }) {
  const { client, project, requestedChanges } = data;

  return (
    <Document>
      <Letterhead title="Change Order" subtitle={project.name} docId={data.orderNumber} date={data.date}>
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
            <Text style={shared.metaLabel}>Order #</Text>
            <Text style={shared.metaValue}>{data.orderNumber}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Date</Text>
            <Text style={shared.metaValue}>{data.date}</Text>
          </View>
        </View>

        {/* Original Scope Reference */}
        <View style={{ marginBottom: 16 }}>
          <Text style={shared.sectionTitle}>Original Scope Reference</Text>
          <Text style={shared.bodyText}>{data.originalScope}</Text>
        </View>

        {/* Reason for Change */}
        <View style={{ marginBottom: 16 }}>
          <Text style={shared.sectionTitle}>Reason for Change</Text>
          <Text style={shared.bodyText}>{data.reason}</Text>
        </View>

        {/* Requested Changes Table */}
        <Text style={shared.sectionTitle}>Requested Changes</Text>
        <View style={shared.tableHead}>
          <Text style={[shared.tableHeadText, s.colChange]}>Change Description</Text>
          <Text style={[shared.tableHeadText, s.colImpact]}>Impact</Text>
          <Text style={[shared.tableHeadText, s.colCost]}>Cost Impact</Text>
          <Text style={[shared.tableHeadText, s.colTime]}>Time Impact</Text>
        </View>
        {requestedChanges.map((item, i) => (
          <View key={i} style={[shared.tableRow, i % 2 === 1 ? shared.tableRowAlt : {}]}>
            <Text style={[shared.tableRowText, s.colChange]}>{item.change}</Text>
            <Text style={[shared.tableRowText, s.colImpact, { color: C.slate500 }]}>{item.impact}</Text>
            <Text style={[shared.tableRowText, s.colCost]}>{item.costDelta}</Text>
            <Text style={[shared.tableRowText, s.colTime]}>{item.timeDelta}</Text>
          </View>
        ))}

        {/* Impact Summary */}
        <View style={s.impactSummary}>
          <View style={[shared.summaryCard, shared.summaryCardPrimary]}>
            <Text style={shared.summaryLabel}>Total Cost Impact</Text>
            <Text style={[shared.summaryValue, shared.summaryValueCopper, { fontSize: 13 }]}>{data.totalCostImpact}</Text>
          </View>
          <View style={[shared.summaryCard, shared.summaryCardDefault]}>
            <Text style={shared.summaryLabel}>Total Time Impact</Text>
            <Text style={[shared.summaryValue, shared.summaryValueDark, { fontSize: 13 }]}>{data.totalTimeImpact}</Text>
          </View>
        </View>

        {/* Terms */}
        <View style={shared.notesBox}>
          <Text style={shared.notesTitle}>Terms</Text>
          <Text style={shared.notesText}>
            This Change Order modifies the original Project Agreement. All other terms of the original agreement remain in effect. Additional costs will be invoiced according to the payment schedule established in the Project Agreement. Both parties must sign below to authorize these changes.
          </Text>
        </View>

        {data.notes && (
          <View style={shared.notesBox}>
            <Text style={shared.notesTitle}>Notes</Text>
            <Text style={shared.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Signatures */}
        <View style={s.signBlock}>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Client Approval</Text>
            <Text style={s.signName}>{client.name}</Text>
            <Text style={[s.signLabel, { marginTop: 20 }]}>Date: _______________</Text>
          </View>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Codene Approval</Text>
            <Text style={s.signName}>Codene Development</Text>
            <Text style={[s.signLabel, { marginTop: 20 }]}>Date: _______________</Text>
          </View>
        </View>
      </Letterhead>
    </Document>
  );
}
