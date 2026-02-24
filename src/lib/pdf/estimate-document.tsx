import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { EstimateResult } from '@/lib/estimate-engine/types';
import { formatCurrency } from '@/lib/utils';

/* ── Slate + Copper Professional Palette ── */
const C = {
  black: '#0f172a',
  slate900: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate300: '#cbd5e1',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  copper: '#b87333',
  copperLight: '#d4944c',
  copperBg: '#fdf6ee',
  copperBorder: '#e8c9a0',
  divider: '#e2e8f0',
};

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9.5, fontFamily: 'Helvetica', color: C.slate900, backgroundColor: C.white },

  /* ── Header band ── */
  headerBand: { backgroundColor: C.slate900, marginHorizontal: -40, marginTop: -40, paddingHorizontal: 40, paddingVertical: 28, marginBottom: 24 },
  brandName: { fontSize: 10, fontWeight: 'bold', color: C.copper, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  docTitle: { fontSize: 22, fontWeight: 'bold', color: C.white, marginBottom: 4 },
  headerSub: { fontSize: 10, color: C.slate300 },

  /* ── Meta row ── */
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.divider },
  metaBlock: {},
  metaLabel: { fontSize: 7.5, fontWeight: 'bold', color: C.slate500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  metaValue: { fontSize: 10, color: C.slate900 },

  /* ── Summary cards ── */
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  summaryCard: { flex: 1, padding: 14, borderRadius: 6, borderWidth: 1 },
  summaryCardPrimary: { backgroundColor: C.copperBg, borderColor: C.copperBorder },
  summaryCardDefault: { backgroundColor: C.slate50, borderColor: C.divider },
  summaryLabel: { fontSize: 7.5, fontWeight: 'bold', color: C.slate500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  summaryValue: { fontSize: 15, fontWeight: 'bold' },
  summaryValueCopper: { color: C.copper },
  summaryValueDark: { color: C.slate900 },

  /* ── Section titles ── */
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: C.slate900, marginBottom: 10, marginTop: 4, paddingBottom: 6, borderBottomWidth: 2, borderBottomColor: C.copper },

  /* ── Table ── */
  tableHead: { flexDirection: 'row', backgroundColor: C.slate900, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 4 },
  tableHeadText: { fontWeight: 'bold', fontSize: 8, color: C.white, textTransform: 'uppercase', letterSpacing: 0.3 },
  tableRow: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: C.divider },
  tableRowAlt: { backgroundColor: C.slate50 },
  tableRowText: { fontSize: 9 },
  colFeature: { flex: 3 },
  colCategory: { flex: 2 },
  colComplexity: { flex: 1.2, textAlign: 'center' },
  colHours: { flex: 1, textAlign: 'center' },
  colCost: { flex: 2, textAlign: 'right' },
  tableFoot: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, backgroundColor: C.copperBg, borderRadius: 4, marginTop: 2 },
  tableFootText: { fontWeight: 'bold', fontSize: 9.5 },

  /* ── Timeline ── */
  phaseRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: C.divider },
  phaseRowAlt: { backgroundColor: C.slate50 },
  phaseName: { flex: 3, fontSize: 9.5 },
  phasePct: { flex: 1, textAlign: 'center', fontSize: 9, color: C.slate500 },
  phaseDuration: { flex: 2, textAlign: 'right', fontSize: 9.5 },
  phaseHead: { flexDirection: 'row', backgroundColor: C.slate900, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 4 },
  phaseHeadText: { fontWeight: 'bold', fontSize: 8, color: C.white, textTransform: 'uppercase', letterSpacing: 0.3 },

  /* ── Notes / Disclaimer ── */
  notesBox: { marginTop: 20, padding: 14, backgroundColor: C.slate50, borderRadius: 6, borderWidth: 1, borderColor: C.divider },
  notesTitle: { fontSize: 9, fontWeight: 'bold', color: C.slate700, marginBottom: 4 },
  notesText: { fontSize: 8, color: C.slate500, lineHeight: 1.5 },

  /* ── Footer ── */
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: C.divider, paddingTop: 8 },
  footerText: { fontSize: 7.5, color: C.slate500 },
  footerBrand: { fontSize: 7.5, fontWeight: 'bold', color: C.copper },
});

const categoryLabels: Record<string, string> = {
  'user-management': 'User Mgmt',
  communication: 'Comms',
  'data-content': 'Data',
  payments: 'Payments',
  media: 'Media',
  location: 'Location',
  advanced: 'Advanced',
  'ui-ux': 'UI/UX',
};

interface EstimateDocumentProps {
  estimate: EstimateResult;
  projectName: string;
  clientName: string;
}

export function EstimateDocument({ estimate, projectName, clientName }: EstimateDocumentProps) {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const totalHoursMin = Math.round(estimate.adjustedHoursMin);
  const totalHoursMax = Math.round(estimate.adjustedHoursMax);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── Dark Header Band ── */}
        <View style={s.headerBand}>
          <Text style={s.brandName}>CODENE</Text>
          <Text style={s.docTitle}>Project Estimate</Text>
          <Text style={s.headerSub}>{projectName}</Text>
        </View>

        {/* ── Meta info ── */}
        <View style={s.metaRow}>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Prepared For</Text>
            <Text style={s.metaValue}>{clientName}</Text>
          </View>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Platform</Text>
            <Text style={s.metaValue}>{estimate.platformLabel}</Text>
          </View>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Date</Text>
            <Text style={s.metaValue}>{dateStr}</Text>
          </View>
          <View style={s.metaBlock}>
            <Text style={s.metaLabel}>Estimate ID</Text>
            <Text style={s.metaValue}>#{Math.random().toString(36).substring(2, 8).toUpperCase()}</Text>
          </View>
        </View>

        {/* ── Summary Cards ── */}
        <View style={s.summaryRow}>
          <View style={[s.summaryCard, s.summaryCardPrimary]}>
            <Text style={s.summaryLabel}>Estimated Cost</Text>
            <Text style={[s.summaryValue, s.summaryValueCopper]}>
              {formatCurrency(estimate.totalCostMin)} – {formatCurrency(estimate.totalCostMax)}
            </Text>
          </View>
          <View style={[s.summaryCard, s.summaryCardDefault]}>
            <Text style={s.summaryLabel}>Timeline</Text>
            <Text style={[s.summaryValue, s.summaryValueDark]}>
              {estimate.totalWeeksMin}–{estimate.totalWeeksMax} weeks
            </Text>
          </View>
          <View style={[s.summaryCard, s.summaryCardDefault]}>
            <Text style={s.summaryLabel}>Total Hours</Text>
            <Text style={[s.summaryValue, s.summaryValueDark]}>
              {totalHoursMin}–{totalHoursMax}
            </Text>
          </View>
        </View>

        {/* ── Line Items Table ── */}
        <Text style={s.sectionTitle}>Itemized Breakdown</Text>
        <View style={s.tableHead}>
          <Text style={[s.tableHeadText, s.colFeature]}>Feature</Text>
          <Text style={[s.tableHeadText, s.colCategory]}>Category</Text>
          <Text style={[s.tableHeadText, s.colComplexity]}>Tier</Text>
          <Text style={[s.tableHeadText, s.colHours]}>Hours</Text>
          <Text style={[s.tableHeadText, s.colCost]}>Cost Range</Text>
        </View>
        {estimate.items.map((item, i) => (
          <View key={item.featureId} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
            <Text style={[s.tableRowText, s.colFeature]}>{item.name}</Text>
            <Text style={[s.tableRowText, s.colCategory, { color: C.slate500 }]}>{categoryLabels[item.category] || item.category}</Text>
            <Text style={[s.tableRowText, s.colComplexity, { textTransform: 'capitalize' }]}>{item.complexity}</Text>
            <Text style={[s.tableRowText, s.colHours]}>{item.hoursMin}–{item.hoursMax}</Text>
            <Text style={[s.tableRowText, s.colCost]}>{formatCurrency(item.costMin)} – {formatCurrency(item.costMax)}</Text>
          </View>
        ))}
        <View style={s.tableFoot}>
          <Text style={[s.tableFootText, s.colFeature]}>Total ({estimate.items.length} features)</Text>
          <Text style={[s.tableFootText, s.colCategory]} />
          <Text style={[s.tableFootText, s.colComplexity]} />
          <Text style={[s.tableFootText, s.colHours]}>{totalHoursMin}–{totalHoursMax}</Text>
          <Text style={[s.tableFootText, s.colCost, { color: C.copper }]}>
            {formatCurrency(estimate.totalCostMin)} – {formatCurrency(estimate.totalCostMax)}
          </Text>
        </View>

        {/* ── Timeline Table ── */}
        <View style={{ marginTop: 20 }}>
          <Text style={s.sectionTitle}>Production Timeline</Text>
          <View style={s.phaseHead}>
            <Text style={[s.phaseHeadText, { flex: 3 }]}>Phase</Text>
            <Text style={[s.phaseHeadText, { flex: 1, textAlign: 'center' }]}>Weight</Text>
            <Text style={[s.phaseHeadText, { flex: 2, textAlign: 'right' }]}>Duration</Text>
          </View>
          {estimate.timeline.map((phase, i) => (
            <View key={phase.name} style={[s.phaseRow, i % 2 === 1 ? s.phaseRowAlt : {}]}>
              <Text style={s.phaseName}>{phase.name}</Text>
              <Text style={s.phasePct}>{Math.round(phase.percentage * 100)}%</Text>
              <Text style={s.phaseDuration}>
                {phase.weeksMin === phase.weeksMax
                  ? `${phase.weeksMin} week${phase.weeksMin !== 1 ? 's' : ''}`
                  : `${phase.weeksMin}–${phase.weeksMax} weeks`}
              </Text>
            </View>
          ))}
          <View style={[s.tableFoot, { marginTop: 2 }]}>
            <Text style={[s.tableFootText, { flex: 3 }]}>Total Timeline</Text>
            <Text style={[s.tableFootText, { flex: 1, textAlign: 'center' }]}>100%</Text>
            <Text style={[s.tableFootText, { flex: 2, textAlign: 'right', color: C.copper }]}>
              {estimate.totalWeeksMin}–{estimate.totalWeeksMax} weeks
            </Text>
          </View>
        </View>

        {/* ── Rate & Multiplier Info ── */}
        <View style={[s.notesBox, { marginTop: 16 }]}>
          <Text style={s.notesTitle}>Pricing Basis</Text>
          <Text style={s.notesText}>
            Rate: $45–$60/hr  |  Platform: {estimate.platformLabel} ({estimate.platformMultiplier}x)  |  Project overhead: {Math.round(estimate.overheadPercentage * 100)}%
          </Text>
        </View>

        {/* ── Deposit Requirement ── */}
        <View style={s.notesBox}>
          <Text style={s.notesTitle}>Deposit Requirement</Text>
          <Text style={s.notesText}>
            A non-refundable deposit of $300–$500 is required for all projects before work begins. The deposit amount will be determined based on project scope and applied toward the total project cost.
          </Text>
        </View>

        {/* ── Subscription & Backend Costs ── */}
        <View style={s.notesBox}>
          <Text style={s.notesTitle}>Subscription & Backend Costs</Text>
          <Text style={s.notesText}>
            Any subscription costs for backend development services (hosting, databases, third-party APIs, cloud infrastructure) are subject to change based on current pricing at the time of development. All significant changes to pricing will be documented and presented in a formal change order that requires client written approval before proceeding.
          </Text>
        </View>

        {/* ── Disclaimer ── */}
        <View style={s.notesBox}>
          <Text style={s.notesTitle}>Disclaimer</Text>
          <Text style={s.notesText}>
            This is an automated estimate based on selected features. Final pricing and timeline may vary based on detailed requirements review, design complexity, third-party integrations, and other project-specific factors. This document does not constitute a binding contract.
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerBrand}>CODENE</Text>
          <Text style={s.footerText}>codene.us  |  {dateStr}</Text>
          <Text style={s.footerText}>Confidential</Text>
        </View>
      </Page>
    </Document>
  );
}
