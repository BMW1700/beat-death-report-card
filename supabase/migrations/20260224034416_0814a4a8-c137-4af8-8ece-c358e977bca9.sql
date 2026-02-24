CREATE OR REPLACE FUNCTION public.increment_xp(p_user_id uuid, p_xp integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.profiles
  SET total_xp = COALESCE(total_xp, 0) + p_xp,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;