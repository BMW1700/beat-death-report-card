-- 1. Restrict life_actions SELECT to owner only (get_global_feed RPC uses SECURITY DEFINER)
DROP POLICY IF EXISTS "Users can view all actions" ON public.life_actions;
CREATE POLICY "Users can view their own actions"
  ON public.life_actions FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Restrict community_interactions SELECT to authenticated users only
DROP POLICY IF EXISTS "Users can view all interactions" ON public.community_interactions;
CREATE POLICY "Authenticated users can view interactions"
  ON public.community_interactions FOR SELECT
  TO authenticated
  USING (true);