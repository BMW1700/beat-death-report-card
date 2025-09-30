-- Add comprehensive health data fields to profiles table for life expectancy calculation

-- Add email (required for data monetization)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Exercise & Physical Activity
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exercise_frequency TEXT; -- daily, 3-5x_week, 1-2x_week, rarely, never
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exercise_intensity TEXT; -- high, moderate, light, none
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exercise_history_years INTEGER DEFAULT 0;

-- Diet & Nutrition
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS diet_quality_score INTEGER DEFAULT 5; -- 1-10 scale
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS diet_restrictions TEXT; -- vegan, vegetarian, keto, etc
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS supplements JSONB DEFAULT '[]'::jsonb;

-- Sleep & Recovery
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sleep_hours_avg NUMERIC(3,1) DEFAULT 7.0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sleep_quality_score INTEGER DEFAULT 5; -- 1-10 scale
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sleep_disorders TEXT;

-- Mental Health & Wellness
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stress_level INTEGER DEFAULT 5; -- 1-10 scale
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS happiness_score INTEGER DEFAULT 7; -- 1-10 scale
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS social_connections_score INTEGER DEFAULT 5; -- 1-10 scale
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS life_satisfaction_score INTEGER DEFAULT 7; -- 1-10 scale
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mental_health_score INTEGER DEFAULT 7; -- 1-10 scale

-- Substance Use
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS smoking_status TEXT; -- never, former, current_light, current_heavy
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alcohol_frequency TEXT; -- never, rarely, moderate, heavy
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS substance_use TEXT;

-- Medical History
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chronic_conditions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS family_health_history JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS medication_count INTEGER DEFAULT 0;

-- Product Interests & Data Monetization
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS desired_products JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_consent_level TEXT DEFAULT 'none'; -- none, bronze, silver, gold
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS calculated_baseline_years INTEGER DEFAULT 80;

-- Onboarding completion tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT 50; -- 0-100 overall health score

-- Create index on email for lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Add comment explaining data monetization tiers
COMMENT ON COLUMN public.profiles.data_consent_level IS 'Data sharing consent tier: none (no sharing), bronze ($1-5), silver ($5-25), gold ($25-100+)';
COMMENT ON COLUMN public.profiles.calculated_baseline_years IS 'Personalized baseline life expectancy calculated from health assessment';