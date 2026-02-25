import { Resend } from 'resend';
import type { EstimateResult, ClientInfo, ProjectDetails } from '@/lib/estimate-engine/types';
import { formatCurrency } from '@/lib/utils';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface NotificationParams {
  submissionId: string;
  clientInfo: ClientInfo;
  projectDetails: ProjectDetails;
  selectedFeatureCount: number;
  estimate: EstimateResult;
}

export async function sendAdminNotification(params: NotificationParams) {
  const { submissionId, clientInfo, projectDetails, selectedFeatureCount, estimate } = params;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || !resend) {
    console.warn('ADMIN_EMAIL or RESEND_API_KEY not set, skipping notification');
    return;
  }

  const costRange = `${formatCurrency(estimate.totalCostMin)} – ${formatCurrency(estimate.totalCostMax)}`;
  const timeRange = `${estimate.totalWeeksMin}–${estimate.totalWeeksMax} weeks`;

  await resend.emails.send({
    from: 'Codene Estimates <noreply@codene.us>',
    to: adminEmail,
    subject: `New Estimate Request: ${projectDetails.projectName} — ${clientInfo.name}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b87333;">New App Estimate Request</h2>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <h3 style="margin-top: 0;">Client Information</h3>
          <p><strong>Name:</strong> ${clientInfo.name}</p>
          <p><strong>Email:</strong> ${clientInfo.email}</p>
          <p><strong>Phone:</strong> ${clientInfo.phone}</p>
          ${clientInfo.companyName ? `<p><strong>Company:</strong> ${clientInfo.companyName}</p>` : ''}
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <h3 style="margin-top: 0;">Project Details</h3>
          <p><strong>Project:</strong> ${projectDetails.projectName}</p>
          <p><strong>Platform:</strong> ${estimate.platformLabel}</p>
          <p><strong>Features Selected:</strong> ${selectedFeatureCount}</p>
          <p><strong>Launch Timeline:</strong> ${projectDetails.launchTimeframe}</p>
        </div>

        <div style="background: #eef2ff; border-radius: 8px; padding: 20px; margin: 16px 0;">
          <h3 style="margin-top: 0; color: #b87333;">Estimate Generated</h3>
          <p style="font-size: 24px; font-weight: bold; color: #b87333;">${costRange}</p>
          <p><strong>Timeline:</strong> ${timeRange}</p>
        </div>

        <div style="margin: 20px 0; padding: 16px; background: #1e1e21; border-radius: 8px; text-align: center;">
          <a href="https://codene.us/admin" style="display: inline-block; padding: 12px 28px; background: linear-gradient(145deg, #303035, #262629); color: #d4944c; text-decoration: none; border-radius: 12px; font-weight: 600; border: 1px solid rgba(184,115,51,0.2);">
            Open Admin Portal
          </a>
        </div>

        <p style="color: #64748b; font-size: 14px;">
          Submission ID: ${submissionId}<br/>
          Client estimate: <a href="https://codene.us/estimate/result/${submissionId}" style="color: #b87333;">View</a>
        </p>
      </div>
    `,
  });
}
