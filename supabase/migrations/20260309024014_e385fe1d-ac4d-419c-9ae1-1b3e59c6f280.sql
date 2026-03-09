
-- profiles_public is a VIEW (read-only by nature), no RLS needed.
-- The previous migration already applied fixes 1-5 successfully before failing on the view.
-- We just need to confirm the view part is handled. Since it's a view, writes are impossible.
-- No action needed for profiles_public.

-- Create deduct_free_scan RPC (since the trigger now blocks client-side free_scans_used updates)
CREATE OR REPLACE FUNCTION public.deduct_free_scan(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_used integer;
BEGIN
  SELECT free_scans_used INTO v_used FROM public.profiles WHERE user_id = p_user_id;
  IF v_used IS NULL OR v_used >= 3 THEN RETURN false; END IF;
  
  UPDATE public.profiles
  SET free_scans_used = COALESCE(free_scans_used, 0) + 1
  WHERE user_id = p_user_id;
  RETURN true;
END;
$$;
