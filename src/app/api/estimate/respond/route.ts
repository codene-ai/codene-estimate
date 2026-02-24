import { NextRequest, NextResponse } from 'next/server';
import { sendAdminResponseNotification } from '@/lib/email/send-response-notification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { estimateId, action, notes, projectName } = body;

    if (!estimateId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createServerClient } = await import('@/lib/supabase/server');
        const supabase = createServerClient();

        const statusMap: Record<string, string> = {
          accept: 'accepted',
          adjust: 'adjustment-requested',
          review: 'review-requested',
        };

        await supabase
          .from('submissions')
          .update({
            status: statusMap[action] || action,
            additional_notes: notes || null,
          })
          .eq('id', estimateId);
      } catch (err) {
        console.warn('Supabase update failed:', err);
      }
    }

    // Send notification email
    sendAdminResponseNotification({
      estimateId,
      action,
      notes,
      projectName,
    }).catch((err) => console.error('Response notification failed:', err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Response handler error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
