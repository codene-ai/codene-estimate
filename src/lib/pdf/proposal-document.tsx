import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Letterhead, shared } from './letterhead';
import { C } from './brand';
import type { ProposalData } from './types';
import { formatCurrency } from '@/lib/utils';

const s = StyleSheet.create({
  colFeature: { flex: 2.5 },
  colDesc: { flex: 3 },
  colHours: { flex: 1, textAlign: 'center' },
  colCost: { flex: 1.5, textAlign: 'right' },
  phaseCol: { flex: 2 },
  phaseWeeks: { flex: 1, textAlign: 'center' },
  phaseDesc: { flex: 3 },
  signBlock: {
    marginTop: 24,
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

interface Props {
  data: ProposalData;
}

export function ProposalDocument({ data }: Props) {
  const { client, project, scopeItems, timeline } = data;
  const docId = `PRO-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return (
    <Document>
      <Letterhead title="Project Proposal" subtitle={project.name} docId={docId}>
        {/* Client & Project Meta */}
        <View style={shared.metaRow}>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Prepared For</Text>
            <Text style={shared.metaValue}>{client.name}</Text>
            {client.company && <Text style={{ fontSize: 9, color: C.slate500 }}>{client.company}</Text>}
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Contact</Text>
            <Text style={shared.metaValue}>{client.email}</Text>
            <Text style={{ fontSize: 9, color: C.slate500 }}>{client.phone}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Platform</Text>
            <Text style={shared.metaValue}>{project.platform || 'TBD'}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Valid Until</Text>
            <Text style={shared.metaValue}>{data.validUntil}</Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <View style={[shared.summaryCard, shared.summaryCardPrimary]}>
            <Text style={shared.summaryLabel}>Estimated Investment</Text>
            <Text style={[shared.summaryValue, shared.summaryValueCopper]}>
              {formatCurrency(data.totalCostMin)} – {formatCurrency(data.totalCostMax)}
            </Text>
          </View>
          <View style={[shared.summaryCard, shared.summaryCardDefault]}>
            <Text style={shared.summaryLabel}>Timeline</Text>
            <Text style={[shared.summaryValue, shared.summaryValueDark]}>
              {data.totalWeeksMin}–{data.totalWeeksMax} weeks
            </Text>
          </View>
          <View style={[shared.summaryCard, shared.summaryCardDefault]}>
            <Text style={shared.summaryLabel}>Deposit Required</Text>
            <Text style={[shared.summaryValue, shared.summaryValueDark]}>
              {formatCurrency(data.depositAmount)}
            </Text>
          </View>
        </View>

        {/* Project Overview */}
        {project.description && (
          <View style={{ marginBottom: 16 }}>
            <Text style={shared.sectionTitle}>Project Overview</Text>
            <Text style={shared.bodyText}>{project.description}</Text>
          </View>
        )}

        {/* Scope of Work Table */}
        <Text style={shared.sectionTitle}>Scope of Work</Text>
        <View style={shared.tableHead}>
          <Text style={[shared.tableHeadText, s.colFeature]}>Feature</Text>
          <Text style={[shared.tableHeadText, s.colDesc]}>Description</Text>
          <Text style={[shared.tableHeadText, s.colHours]}>Hours</Text>
          <Text style={[shared.tableHeadText, s.colCost]}>Cost</Text>
        </View>
        {scopeItems.map((item, i) => (
          <View key={i} style={[shared.tableRow, i % 2 === 1 ? shared.tableRowAlt : {}]}>
            <Text style={[shared.tableRowText, s.colFeature]}>{item.feature}</Text>
            <Text style={[shared.tableRowText, s.colDesc, { color: C.slate500 }]}>{item.description}</Text>
            <Text style={[shared.tableRowText, s.colHours]}>{item.hours}</Text>
            <Text style={[shared.tableRowText, s.colCost]}>{item.cost}</Text>
          </View>
        ))}
        <View style={shared.tableFoot}>
          <Text style={[shared.tableFootText, s.colFeature]}>Total</Text>
          <Text style={[shared.tableFootText, s.colDesc]} />
          <Text style={[shared.tableFootText, s.colHours]} />
          <Text style={[shared.tableFootText, s.colCost, { color: C.copper }]}>
            {formatCurrency(data.totalCostMin)} – {formatCurrency(data.totalCostMax)}
          </Text>
        </View>

        {/* Timeline */}
        <View style={{ marginTop: 18 }}>
          <Text style={shared.sectionTitle}>Production Timeline</Text>
          <View style={shared.tableHead}>
            <Text style={[shared.tableHeadText, s.phaseCol]}>Phase</Text>
            <Text style={[shared.tableHeadText, s.phaseWeeks]}>Duration</Text>
            <Text style={[shared.tableHeadText, s.phaseDesc]}>Description</Text>
          </View>
          {timeline.map((phase, i) => (
            <View key={i} style={[shared.tableRow, i % 2 === 1 ? shared.tableRowAlt : {}]}>
              <Text style={[shared.tableRowText, s.phaseCol]}>{phase.phase}</Text>
              <Text style={[shared.tableRowText, s.phaseWeeks]}>{phase.weeks}</Text>
              <Text style={[shared.tableRowText, s.phaseDesc, { color: C.slate500 }]}>{phase.description}</Text>
            </View>
          ))}
        </View>

        {/* Payment Terms */}
        <View style={shared.notesBox}>
          <Text style={shared.notesTitle}>Payment Terms</Text>
          <Text style={shared.notesText}>
            A non-refundable deposit of {formatCurrency(data.depositAmount)} is required to begin work. The remaining balance is divided across project milestones. All payments are due within 7 days of invoice date.
          </Text>
        </View>

        {/* What's Included */}
        <View style={shared.notesBox}>
          <Text style={shared.notesTitle}>What&apos;s Included</Text>
          <View style={shared.bulletItem}>
            <Text style={shared.bullet}>•</Text>
            <Text style={shared.bulletText}>All design files and source code delivered upon final payment</Text>
          </View>
          <View style={shared.bulletItem}>
            <Text style={shared.bullet}>•</Text>
            <Text style={shared.bulletText}>Up to 2 rounds of design revisions per phase</Text>
          </View>
          <View style={shared.bulletItem}>
            <Text style={shared.bullet}>•</Text>
            <Text style={shared.bulletText}>14-day post-launch bug fix support at no additional cost</Text>
          </View>
          <View style={shared.bulletItem}>
            <Text style={shared.bullet}>•</Text>
            <Text style={shared.bulletText}>Deployment to production environment (App Store, Play Store, or hosting)</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={shared.notesBox}>
            <Text style={shared.notesTitle}>Additional Notes</Text>
            <Text style={shared.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={shared.notesBox}>
          <Text style={shared.notesTitle}>Disclaimer</Text>
          <Text style={shared.notesText}>
            This proposal is valid until {data.validUntil}. Final pricing may be adjusted based on detailed requirements review. Significant scope changes after project start will be documented via a formal Change Order. This document does not constitute a binding contract — a separate Project Agreement will be provided upon acceptance.
          </Text>
        </View>

        {/* Acceptance */}
        <View style={s.signBlock}>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Client Signature</Text>
            <Text style={s.signName}>{client.name}</Text>
            <Text style={s.signLabel}>Date: _______________</Text>
          </View>
          <View style={s.signLine}>
            <Text style={s.signLabel}>Codene Representative</Text>
            <Text style={s.signName}>Codene Development</Text>
            <Text style={s.signLabel}>Date: _______________</Text>
          </View>
        </View>
      </Letterhead>
    </Document>
  );
}
