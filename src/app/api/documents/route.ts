import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { ProposalDocument } from '@/lib/pdf/proposal-document';
import { AgreementDocument } from '@/lib/pdf/agreement-document';
import { InvoiceDocument } from '@/lib/pdf/invoice-document';
import { ChangeOrderDocument } from '@/lib/pdf/change-order-document';
import { CompletionDocument } from '@/lib/pdf/completion-document';

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const expected = Buffer.from(`${adminPassword}:${new Date().toISOString().slice(0, 10)}`).toString('base64');
  return token === expected;
}

const DOCUMENT_COMPONENTS: Record<string, React.ComponentType<{ data: any }>> = {
  proposal: ProposalDocument as any,
  agreement: AgreementDocument as any,
  invoice: InvoiceDocument as any,
  'change-order': ChangeOrderDocument as any,
  completion: CompletionDocument as any,
};

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { type, data } = await request.json();

    const Component = DOCUMENT_COMPONENTS[type];
    if (!Component) {
      return NextResponse.json(
        { error: `Unknown document type: ${type}. Valid types: ${Object.keys(DOCUMENT_COMPONENTS).join(', ')}` },
        { status: 400 }
      );
    }

    const buffer = await renderToBuffer(
      React.createElement(Component, { data }) as any
    );

    const filename = `${type}-${Date.now().toString(36)}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 });
  }
}
