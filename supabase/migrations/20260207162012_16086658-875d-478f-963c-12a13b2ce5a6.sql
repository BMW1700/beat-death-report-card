
-- Create scan_credits table
CREATE TABLE public.scan_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  credits_remaining INTEGER NOT NULL DEFAULT 0,
  credits_purchased INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'free',
  stripe_payment_id TEXT,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scan_credits ENABLE ROW LEVEL SECURITY;

-- RLS policies for scan_credits
CREATE POLICY "Users can view their own credits"
ON public.scan_credits
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
ON public.scan_credits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON public.scan_credits
FOR UPDATE
USING (auth.uid() = user_id);

-- Add columns to profiles for scan tracking
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS subscription_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS free_scans_used INTEGER DEFAULT 0;

-- Trigger for updated_at on scan_credits
CREATE TRIGGER update_scan_credits_updated_at
BEFORE UPDATE ON public.scan_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
