
-- ============================================================
-- FIX 1: Profiles protection trigger — block subscription column changes
-- ============================================================
CREATE OR REPLACE FUNCTION public.protect_subscription_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (NEW.premium_user IS DISTINCT FROM OLD.premium_user) OR
     (NEW.subscription_active IS DISTINCT FROM OLD.subscription_active) OR
     (NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier) OR
     (NEW.free_scans_used IS DISTINCT FROM OLD.free_scans_used) THEN
    IF current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
      NEW.premium_user := OLD.premium_user;
      NEW.subscription_active := OLD.subscription_active;
      NEW.subscription_tier := OLD.subscription_tier;
      NEW.free_scans_used := OLD.free_scans_used;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_subscription_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_columns();

-- ============================================================
-- FIX 2: Drop scan_credits INSERT policy + create grant_scan_credits RPC
-- ============================================================
DROP POLICY IF EXISTS "Users can insert their own credits" ON public.scan_credits;

CREATE OR REPLACE FUNCTION public.grant_scan_credits(
  p_user_id uuid,
  p_amount integer,
  p_source text DEFAULT 'purchase',
  p_stripe_payment_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.scan_credits (user_id, credits_remaining, credits_purchased, source, stripe_payment_id)
  VALUES (p_user_id, p_amount, p_amount, p_source, p_stripe_payment_id);
  RETURN true;
END;
$$;

-- ============================================================
-- FIX 3: Drop achievements INSERT policy (unlock_achievement RPC handles it)
-- ============================================================
DROP POLICY IF EXISTS "System can create achievements" ON public.achievements;

-- ============================================================
-- FIX 4: Drop death_duels UPDATE policy + create submit_duel_response RPC
-- ============================================================
DROP POLICY IF EXISTS "Users can update duels they're involved in" ON public.death_duels;

CREATE OR REPLACE FUNCTION public.submit_duel_response(
  p_duel_id uuid,
  p_opponent_id uuid,
  p_opponent_scenario text,
  p_opponent_score numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_duel record;
BEGIN
  SELECT * INTO v_duel FROM public.death_duels WHERE id = p_duel_id AND status = 'pending';
  IF v_duel IS NULL THEN RETURN false; END IF;
  IF v_duel.opponent_id IS NOT NULL AND v_duel.opponent_id != p_opponent_id THEN
    RETURN false;
  END IF;
  IF v_duel.challenger_id = p_opponent_id THEN RETURN false; END IF;

  UPDATE public.death_duels
  SET opponent_id = p_opponent_id,
      opponent_scenario = p_opponent_scenario,
      opponent_score = p_opponent_score,
      status = 'completed',
      winner_id = CASE
        WHEN v_duel.challenger_score > p_opponent_score THEN v_duel.challenger_id
        WHEN p_opponent_score > v_duel.challenger_score THEN p_opponent_id
        ELSE NULL
      END
  WHERE id = p_duel_id;

  RETURN true;
END;
$$;

-- ============================================================
-- FIX 5: Restrict viral_challenges UPDATE + create counter RPCs
-- ============================================================
DROP POLICY IF EXISTS "Users can update their own challenges" ON public.viral_challenges;

CREATE POLICY "Users can update own challenge metadata"
  ON public.viral_challenges FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (
    auth.uid() = creator_id
  );

CREATE OR REPLACE FUNCTION public.join_viral_challenge(p_challenge_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.viral_challenges
  SET participants_count = COALESCE(participants_count, 0) + 1
  WHERE id = p_challenge_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.like_viral_challenge(p_challenge_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.viral_challenges
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = p_challenge_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.share_viral_challenge(p_challenge_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.viral_challenges
  SET shares_count = COALESCE(shares_count, 0) + 1
  WHERE id = p_challenge_id;
  RETURN FOUND;
END;
$$;
