import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface ResponseNotificationParams {
  estimateId: string;
  action: string;
  notes: string;
  projectName: string;
}

const actionLabels: Record<string, string> = {
  accept: '✅ Quote Accepted',
  adjust: '✏️ Adjustment Requested',
  review: '🔍 Manual Review Requested',
};

export async function sendAdminResponseNotification(params: ResponseNotificationParams) {
  const { estimateId, action, notes, projectName } = params;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || !resend) {
    console.warn('ADMIN_EMAIL or RESEND_API_KEY not set, skipping response notification');
    return;
  }

  await resend.emails.send({
    from: 'Codene Estimates <noreply@codene.us>',
    to: adminEmail,
    subject: `${actionLabels[action] || action} — ${projectName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b87333;">${actionLabels[action] || action}</h2>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Estimate ID:</strong> ${estimateId}</p>
        ${notes ? `
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold;">Client Notes:</p>
            <p style="margin: 8px 0 0;">${notes}</p>
          </div>
        ` : ''}
        <p style="color: #64748b; font-size: 14px;">
          View estimate: https://codene.us/estimate/result/${estimateId}
        </p>
      </div>
    `,
  });
}
