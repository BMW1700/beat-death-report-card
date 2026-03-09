
-- Add referral columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid;

-- Function to generate 8-char alphanumeric referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Update handle_new_user to auto-assign referral codes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_code text;
BEGIN
  -- Generate unique referral code
  LOOP
    new_code := public.generate_referral_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_code);
  END LOOP;

  INSERT INTO public.profiles (user_id, username, display_name, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    new_code
  );
  RETURN NEW;
END;
$$;

-- Backfill existing profiles that don't have referral codes
DO $$
DECLARE
  r record;
  new_code text;
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text;
  i int;
BEGIN
  FOR r IN SELECT id FROM public.profiles WHERE referral_code IS NULL LOOP
    LOOP
      result := '';
      FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
      END LOOP;
      new_code := result;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_code);
    END LOOP;
    UPDATE public.profiles SET referral_code = new_code WHERE id = r.id;
  END LOOP;
END;
$$;

-- RPC to process a referral: validates code, grants 5 credits to referrer
CREATE OR REPLACE FUNCTION public.process_referral(p_referral_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_referrer_id uuid;
  v_current_user_id uuid;
BEGIN
  v_current_user_id := auth.uid();
  IF v_current_user_id IS NULL THEN RETURN false; END IF;

  -- Check if user already used a referral
  SELECT referred_by INTO v_referrer_id FROM public.profiles WHERE user_id = v_current_user_id;
  IF v_referrer_id IS NOT NULL THEN RETURN false; END IF;

  -- Find referrer by code
  SELECT user_id INTO v_referrer_id FROM public.profiles WHERE referral_code = upper(p_referral_code);
  IF v_referrer_id IS NULL THEN RETURN false; END IF;

  -- Can't refer yourself
  IF v_referrer_id = v_current_user_id THEN RETURN false; END IF;

  -- Mark current user as referred
  UPDATE public.profiles SET referred_by = v_referrer_id WHERE user_id = v_current_user_id;

  -- Grant 5 credits to referrer
  PERFORM public.grant_scan_credits(v_referrer_id, 5, 'referral');
  -- Grant 5 credits to new user
  PERFORM public.grant_scan_credits(v_current_user_id, 5, 'referral_bonus');

  RETURN true;
END;
$$;
