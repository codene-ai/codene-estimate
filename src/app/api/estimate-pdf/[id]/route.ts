import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { EstimateDocument } from '@/lib/pdf/estimate-document';
import type { EstimateResult } from '@/lib/estimate-engine/types';
import React from 'react';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let estimate: EstimateResult;
    let projectName: string;
    let clientName: string;

    // Try request body first (client-side data)
    if (body.estimate && body.projectName) {
      estimate = body.estimate;
      projectName = body.projectName;
      clientName = body.clientName || 'Client';
    } else {
      // Fall back to Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Estimate data not available' }, { status: 404 });
      }

      const { createServerClient } = await import('@/lib/supabase/server');
      const supabase = createServerClient();

      const { data, error } = await supabase
        .from('submissions')
        .select('project_name, client_name, estimate_result')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      }

      estimate = data.estimate_result as EstimateResult;
      projectName = data.project_name;
      clientName = data.client_name;
    }

    const buffer = await renderToBuffer(
      React.createElement(EstimateDocument, {
        estimate,
        projectName,
        clientName,
      }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="estimate-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
