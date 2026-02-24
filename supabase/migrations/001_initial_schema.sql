-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Client info
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  company_name TEXT,
  job_title TEXT,
  referral_source TEXT,

  -- Project details
  project_name TEXT NOT NULL,
  project_description TEXT NOT NULL,
  target_audience TEXT,
  target_platforms TEXT NOT NULL,
  existing_app_status TEXT NOT NULL,
  launch_timeframe TEXT NOT NULL,
  similar_apps TEXT,
  expected_users TEXT,

  -- Features
  selected_features JSONB NOT NULL DEFAULT '[]',
  custom_features_text TEXT,

  -- Design & branding
  has_brand_guidelines TEXT,
  has_wireframes TEXT,
  design_style JSONB DEFAULT '[]',
  design_inspiration TEXT,

  -- Budget & timeline
  budget_range TEXT NOT NULL,
  budget_flexibility TEXT,
  priority_focus TEXT,
  additional_notes TEXT,
  contact_preference JSONB DEFAULT '["email"]',
  meeting_availability TEXT,

  -- File references
  uploaded_files JSONB DEFAULT '[]',

  -- Estimate results
  estimate_result JSONB NOT NULL,
  estimate_min_cost NUMERIC(10,2),
  estimate_max_cost NUMERIC(10,2),
  estimate_weeks_min INTEGER,
  estimate_weeks_max INTEGER,

  -- Meta
  status TEXT DEFAULT 'new'
);

CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_email ON submissions(client_email);

-- Uploaded files tracking
CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
