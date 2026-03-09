
-- 1. PROFILES: Create public view with only safe fields
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT
  user_id,
  username,
  display_name,
  avatar_url,
  total_xp,
  survival_streak,
  danger_level,
  survivalist_mode,
  immortal_mode,
  bio
FROM public.profiles;

-- 2. PROFILES: Replace "view all" SELECT policy with own-row-only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- 3. SCAN CREDITS: Drop the dangerous UPDATE policy
DROP POLICY IF EXISTS "Users can update their own credits" ON public.scan_credits;

-- 4. SCAN CREDITS: Create a safe decrement function
CREATE OR REPLACE FUNCTION public.consume_scan_credit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pack_id uuid;
  remaining int;
BEGIN
  -- Find oldest pack with credits
  SELECT id, credits_remaining INTO pack_id, remaining
  FROM public.scan_credits
  WHERE user_id = p_user_id AND credits_remaining > 0
  ORDER BY purchased_at ASC
  LIMIT 1;

  IF pack_id IS NULL THEN
    RETURN false;
  END IF;

  UPDATE public.scan_credits
  SET credits_remaining = credits_remaining - 1, updated_at = now()
  WHERE id = pack_id;

  RETURN true;
END;
$$;
