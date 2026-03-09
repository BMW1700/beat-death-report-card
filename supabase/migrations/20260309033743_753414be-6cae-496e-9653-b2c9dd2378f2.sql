
-- Trigger to block counter column manipulation from authenticated role
CREATE OR REPLACE FUNCTION public.protect_challenge_counters()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF current_setting('request.jwt.claim.role', true) = 'authenticated' THEN
    IF (NEW.participants_count IS DISTINCT FROM OLD.participants_count) OR
       (NEW.likes_count IS DISTINCT FROM OLD.likes_count) OR
       (NEW.shares_count IS DISTINCT FROM OLD.shares_count) OR
       (NEW.trending_score IS DISTINCT FROM OLD.trending_score) OR
       (NEW.is_featured IS DISTINCT FROM OLD.is_featured) THEN
      NEW.participants_count := OLD.participants_count;
      NEW.likes_count := OLD.likes_count;
      NEW.shares_count := OLD.shares_count;
      NEW.trending_score := OLD.trending_score;
      NEW.is_featured := OLD.is_featured;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_challenge_counters_trigger
  BEFORE UPDATE ON public.viral_challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_challenge_counters();
