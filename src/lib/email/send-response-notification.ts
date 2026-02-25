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
        <div style="margin: 20px 0; padding: 16px; background: #1e1e21; border-radius: 8px; text-align: center;">
          <a href="https://codene.us/admin" style="display: inline-block; padding: 12px 28px; background: linear-gradient(145deg, #303035, #262629); color: #d4944c; text-decoration: none; border-radius: 12px; font-weight: 600; border: 1px solid rgba(184,115,51,0.2);">
            Open Admin Portal
          </a>
        </div>

        <p style="color: #64748b; font-size: 14px;">
          Client estimate: <a href="https://codene.us/estimate/result/${estimateId}" style="color: #b87333;">View</a>
        </p>
      </div>
    `,
  });
}
