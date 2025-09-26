-- Fix function search_path security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_trending_scores()
RETURNS void AS $$
BEGIN
  -- Update viral challenges trending scores
  UPDATE public.viral_challenges 
  SET trending_score = (
    participants_count * 1.0 + 
    likes_count * 0.5 + 
    shares_count * 2.0 +
    CASE WHEN created_at > now() - INTERVAL '24 hours' THEN 10.0 ELSE 0.0 END
  );
  
  -- Update leaderboard ranks
  WITH ranked_entries AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY leaderboard_type ORDER BY score DESC) as new_rank
    FROM public.leaderboard_entries
    WHERE week_of = date_trunc('week', now())
  )
  UPDATE public.leaderboard_entries 
  SET rank = ranked_entries.new_rank
  FROM ranked_entries
  WHERE public.leaderboard_entries.id = ranked_entries.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;