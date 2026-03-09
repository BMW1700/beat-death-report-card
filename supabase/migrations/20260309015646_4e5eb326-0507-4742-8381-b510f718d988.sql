
-- Create a function to get feed items with consent filtering
-- This avoids RLS issues and handles privacy server-side
CREATE OR REPLACE FUNCTION public.get_global_feed(p_limit integer DEFAULT 15)
RETURNS TABLE (
  id uuid,
  category text,
  description text,
  minutes_impact integer,
  logged_at timestamptz,
  username text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    la.id,
    la.category,
    la.description,
    la.minutes_impact,
    la.logged_at,
    -- Anonymize username: first 3 chars + ***
    CASE 
      WHEN LENGTH(COALESCE(p.display_name, p.username, 'Anonymous')) > 3 
      THEN SUBSTRING(COALESCE(p.display_name, p.username, 'Anonymous') FROM 1 FOR 3) || '***'
      ELSE COALESCE(p.display_name, p.username, 'Anonymous')
    END AS username
  FROM public.life_actions la
  JOIN public.profiles p ON la.user_id = p.user_id
  WHERE p.data_consent_level IS DISTINCT FROM 'none'
  ORDER BY la.logged_at DESC
  LIMIT p_limit;
END;
$$;
