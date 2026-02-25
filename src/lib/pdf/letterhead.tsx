import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { C, BRAND } from './brand';

const s = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: C.slate900,
    backgroundColor: C.white,
  },
  headerBand: {
    backgroundColor: C.slate900,
    marginHorizontal: -40,
    marginTop: -40,
    paddingHorizontal: 40,
    paddingVertical: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  brandName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: C.copper,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  docTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: C.white,
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 9,
    color: C.slate300,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerRightText: {
    fontSize: 8,
    color: C.slate300,
    marginBottom: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: C.divider,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: C.slate500,
  },
  footerBrand: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: C.copper,
  },
});

interface LetterheadProps {
  title: string;
  subtitle?: string;
  docId?: string;
  date?: string;
  children: React.ReactNode;
}

export function Letterhead({ title, subtitle, docId, date, children }: LetterheadProps) {
  const dateStr = date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Page size="A4" style={s.page}>
      <View style={s.headerBand}>
        <View>
          <Text style={s.brandName}>{BRAND.name}</Text>
          <Text style={s.docTitle}>{title}</Text>
          {subtitle && <Text style={s.headerSub}>{subtitle}</Text>}
        </View>
        <View style={s.headerRight}>
          <Text style={s.headerRightText}>{dateStr}</Text>
          {docId && <Text style={s.headerRightText}>Ref: {docId}</Text>}
          <Text style={s.headerRightText}>{BRAND.website}</Text>
        </View>
      </View>

      {children}

      <View style={s.footer} fixed>
        <Text style={s.footerBrand}>{BRAND.name}</Text>
        <Text style={s.footerText}>{BRAND.website}  |  {dateStr}</Text>
        <Text style={s.footerText}>Confidential</Text>
      </View>
    </Page>
  );
}

/* ── Shared styles used across documents ── */
export const shared = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  metaBlock: {},
  metaLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: C.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 10,
    color: C.slate900,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: C.slate900,
    marginBottom: 8,
    marginTop: 4,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: C.copper,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: C.slate900,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tableHeadText: {
    fontWeight: 'bold',
    fontSize: 8,
    color: C.white,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: C.divider,
  },
  tableRowAlt: {
    backgroundColor: C.slate50,
  },
  tableRowText: {
    fontSize: 9,
  },
  tableFoot: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: C.copperBg,
    borderRadius: 4,
    marginTop: 2,
  },
  tableFootText: {
    fontWeight: 'bold',
    fontSize: 9.5,
  },
  notesBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: C.slate50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.divider,
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: C.slate700,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 8,
    color: C.slate500,
    lineHeight: 1.5,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  summaryCardPrimary: {
    backgroundColor: C.copperBg,
    borderColor: C.copperBorder,
  },
  summaryCardDefault: {
    backgroundColor: C.slate50,
    borderColor: C.divider,
  },
  summaryLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: C.slate500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  summaryValueCopper: {
    color: C.copper,
  },
  summaryValueDark: {
    color: C.slate900,
  },
  bodyText: {
    fontSize: 9.5,
    color: C.slate700,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 9,
    color: C.copper,
    marginRight: 6,
    width: 8,
  },
  bulletText: {
    fontSize: 9,
    color: C.slate700,
    flex: 1,
    lineHeight: 1.5,
  },
});
