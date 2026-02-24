import { NextRequest, NextResponse } from 'next/server';
import { fullSubmissionSchema } from '@/lib/validations/estimate-schema';
import { calculateEstimate } from '@/lib/estimate-engine/calculator';
import { sendAdminNotification } from '@/lib/email/send-notification';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const parsed = fullSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Calculate estimate
    const estimate = calculateEstimate({
      selectedFeatures: data.features.selectedFeatures,
      platform: data.projectDetails.targetPlatforms,
      customFeaturesText: data.features.customFeaturesText,
    });

    let submissionId = randomUUID();

    // Store in database if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createServerClient } = await import('@/lib/supabase/server');
        const supabase = createServerClient();

        const { data: submission, error: dbError } = await supabase
          .from('submissions')
          .insert({
            client_name: data.clientInfo.name,
            client_email: data.clientInfo.email,
            client_phone: data.clientInfo.phone,
            company_name: data.clientInfo.companyName || null,
            job_title: data.clientInfo.jobTitle || null,
            referral_source: data.clientInfo.referralSource || null,
            project_name: data.projectDetails.projectName,
            project_description: data.projectDetails.projectDescription,
            target_audience: data.projectDetails.targetAudience || null,
            target_platforms: data.projectDetails.targetPlatforms,
            existing_app_status: data.projectDetails.existingAppStatus,
            launch_timeframe: data.projectDetails.launchTimeframe,
            similar_apps: data.projectDetails.similarApps || null,
            expected_users: data.projectDetails.expectedUsers,
            selected_features: data.features.selectedFeatures,
            custom_features_text: data.features.customFeaturesText || null,
            has_brand_guidelines: data.designBranding.hasBrandGuidelines,
            has_wireframes: data.designBranding.hasWireframes,
            design_style: data.designBranding.designStyle,
            design_inspiration: data.designBranding.designInspiration || null,
            budget_range: data.budgetTimeline.budgetRange,
            budget_flexibility: data.budgetTimeline.budgetFlexibility,
            priority_focus: data.budgetTimeline.priorityFocus,
            additional_notes: data.budgetTimeline.additionalNotes || null,
            contact_preference: data.budgetTimeline.contactPreference,
            meeting_availability: data.budgetTimeline.meetingAvailability || null,
            uploaded_files: [],
            estimate_result: estimate,
            estimate_min_cost: estimate.totalCostMin,
            estimate_max_cost: estimate.totalCostMax,
            estimate_weeks_min: estimate.totalWeeksMin,
            estimate_weeks_max: estimate.totalWeeksMax,
          })
          .select('id')
          .single();

        if (!dbError && submission) {
          submissionId = submission.id;
        } else {
          console.warn('Database insert failed, using generated ID:', dbError);
        }
      } catch (dbErr) {
        console.warn('Supabase unavailable, using generated ID:', dbErr);
      }
    }

    // Send email notification (non-blocking)
    sendAdminNotification({
      submissionId,
      clientInfo: data.clientInfo,
      projectDetails: data.projectDetails,
      selectedFeatureCount: data.features.selectedFeatures.length,
      estimate,
    }).catch((err) => console.error('Email notification failed:', err));

    return NextResponse.json({
      id: submissionId,
      estimate,
      projectName: data.projectDetails.projectName,
    });
  } catch (error) {
    console.error('Estimate handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
