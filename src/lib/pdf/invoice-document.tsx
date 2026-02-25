import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Letterhead, shared } from './letterhead';
import { C } from './brand';
import type { InvoiceData } from './types';
import { formatCurrency } from '@/lib/utils';

const s = StyleSheet.create({
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: 'center' },
  colRate: { flex: 1.5, textAlign: 'right' },
  colAmount: { flex: 1.5, textAlign: 'right' },
  totalSection: {
    marginTop: 4,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    width: 200,
  },
  totalLabel: {
    flex: 1,
    fontSize: 9,
    color: C.slate500,
    textAlign: 'right',
    paddingRight: 12,
  },
  totalValue: {
    fontSize: 9,
    color: C.slate900,
    width: 80,
    textAlign: 'right',
  },
  totalRowFinal: {
    flexDirection: 'row',
    paddingVertical: 6,
    width: 200,
    borderTopWidth: 2,
    borderTopColor: C.copper,
    marginTop: 4,
  },
  totalLabelFinal: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: C.slate900,
    textAlign: 'right',
    paddingRight: 12,
  },
  totalValueFinal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: C.copper,
    width: 80,
    textAlign: 'right',
  },
  statusBadge: {
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  const { client, project, lineItems } = data;
  const isPaid = data.balanceDue <= 0;

  return (
    <Document>
      <Letterhead title="Invoice" subtitle={project.name} docId={data.invoiceNumber}>
        {/* Client & Invoice Meta */}
        <View style={shared.metaRow}>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Bill To</Text>
            <Text style={shared.metaValue}>{client.name}</Text>
            {client.company && <Text style={{ fontSize: 9, color: C.slate500 }}>{client.company}</Text>}
            <Text style={{ fontSize: 9, color: C.slate500 }}>{client.email}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Invoice #</Text>
            <Text style={shared.metaValue}>{data.invoiceNumber}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Issue Date</Text>
            <Text style={shared.metaValue}>{data.issueDate}</Text>
          </View>
          <View style={shared.metaBlock}>
            <Text style={shared.metaLabel}>Due Date</Text>
            <Text style={[shared.metaValue, !isPaid ? { color: C.copper, fontWeight: 'bold' } : {}]}>{data.dueDate}</Text>
          </View>
        </View>

        {/* Line Items Table */}
        <Text style={shared.sectionTitle}>Invoice Details</Text>
        <View style={shared.tableHead}>
          <Text style={[shared.tableHeadText, s.colDesc]}>Description</Text>
          <Text style={[shared.tableHeadText, s.colQty]}>Qty</Text>
          <Text style={[shared.tableHeadText, s.colRate]}>Rate</Text>
          <Text style={[shared.tableHeadText, s.colAmount]}>Amount</Text>
        </View>
        {lineItems.map((item, i) => (
          <View key={i} style={[shared.tableRow, i % 2 === 1 ? shared.tableRowAlt : {}]}>
            <Text style={[shared.tableRowText, s.colDesc]}>{item.description}</Text>
            <Text style={[shared.tableRowText, s.colQty]}>{item.quantity}</Text>
            <Text style={[shared.tableRowText, s.colRate]}>{formatCurrency(item.rate)}</Text>
            <Text style={[shared.tableRowText, s.colAmount]}>{formatCurrency(item.amount)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalSection}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Subtotal</Text>
            <Text style={s.totalValue}>{formatCurrency(data.subtotal)}</Text>
          </View>
          {data.tax > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Tax</Text>
              <Text style={s.totalValue}>{formatCurrency(data.tax)}</Text>
            </View>
          )}
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.totalValue}>{formatCurrency(data.total)}</Text>
          </View>
          {data.amountPaid > 0 && (
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Paid</Text>
              <Text style={[s.totalValue, { color: '#16a34a' }]}>-{formatCurrency(data.amountPaid)}</Text>
            </View>
          )}
          <View style={s.totalRowFinal}>
            <Text style={s.totalLabelFinal}>Balance Due</Text>
            <Text style={s.totalValueFinal}>{formatCurrency(data.balanceDue)}</Text>
          </View>
        </View>

        {/* Status Badge */}
        <View style={[s.statusBadge, { backgroundColor: isPaid ? '#dcfce7' : C.copperBg }]}>
          <Text style={[s.statusText, { color: isPaid ? '#16a34a' : C.copper }]}>
            {isPaid ? 'PAID' : 'PAYMENT DUE'}
          </Text>
        </View>

        {/* Payment Info */}
        <View style={[shared.notesBox, { marginTop: 20 }]}>
          <Text style={shared.notesTitle}>Payment Information</Text>
          <Text style={shared.notesText}>
            Payment is due within 7 days of the invoice date. Accepted methods: Bank transfer, Zelle, PayPal, or Stripe.{data.paymentMethod ? ` Preferred: ${data.paymentMethod}.` : ''} Please reference invoice #{data.invoiceNumber} with your payment.
          </Text>
        </View>

        {/* Late Payment */}
        {!isPaid && (
          <View style={shared.notesBox}>
            <Text style={shared.notesTitle}>Late Payment Policy</Text>
            <Text style={shared.notesText}>
              Invoices not paid within 14 days of the due date may incur a late fee of 5% of the outstanding balance. Work on the project may be paused until the balance is settled.
            </Text>
          </View>
        )}

        {/* Notes */}
        {data.notes && (
          <View style={shared.notesBox}>
            <Text style={shared.notesTitle}>Notes</Text>
            <Text style={shared.notesText}>{data.notes}</Text>
          </View>
        )}
      </Letterhead>
    </Document>
  );
}
