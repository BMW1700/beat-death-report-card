
CREATE TABLE public.life_actions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action_id text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  minutes_impact integer NOT NULL,
  method text DEFAULT 'self',
  logged_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.life_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own actions"
  ON public.life_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own actions"
  ON public.life_actions FOR SELECT
  USING (auth.uid() = user_id);
