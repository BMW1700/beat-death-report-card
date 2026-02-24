
DROP POLICY "Users can view their own actions" ON public.life_actions;
CREATE POLICY "Users can view all actions"
  ON public.life_actions FOR SELECT
  USING (true);
