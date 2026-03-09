
-- 1. Drop the overly permissive leaderboard policy
DROP POLICY IF EXISTS "System can manage leaderboard entries" ON public.leaderboard_entries;

-- 2. Add secure user-scoped write policy
CREATE POLICY "Users can upsert their own leaderboard entries"
  ON public.leaderboard_entries
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. SECURITY DEFINER function for safe leaderboard updates
CREATE OR REPLACE FUNCTION public.upsert_leaderboard_entry(
  p_user_id uuid,
  p_leaderboard_type text,
  p_score integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.leaderboard_entries (user_id, leaderboard_type, score, week_of, updated_at)
  VALUES (p_user_id, p_leaderboard_type, p_score, date_trunc('week', now())::date, now())
  ON CONFLICT (user_id, leaderboard_type, week_of)
  DO UPDATE SET score = EXCLUDED.score, updated_at = now();
EXCEPTION WHEN others THEN
  NULL; -- silently handle any conflict edge cases
END;
$$;

-- 4. SECURITY DEFINER function for achievement unlocks
CREATE OR REPLACE FUNCTION public.unlock_achievement(
  p_user_id uuid,
  p_achievement_type text,
  p_achievement_name text,
  p_description text,
  p_icon text,
  p_rarity text,
  p_xp_reward integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  already_unlocked boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.achievements
    WHERE user_id = p_user_id AND achievement_type = p_achievement_type
  ) INTO already_unlocked;

  IF already_unlocked THEN
    RETURN false;
  END IF;

  INSERT INTO public.achievements (
    user_id, achievement_type, achievement_name,
    description, icon, rarity, xp_reward, unlocked_at
  ) VALUES (
    p_user_id, p_achievement_type, p_achievement_name,
    p_description, p_icon, p_rarity, p_xp_reward, now()
  );

  IF p_xp_reward > 0 THEN
    PERFORM public.increment_xp(p_user_id, p_xp_reward);
  END IF;

  RETURN true;
END;
$$;
