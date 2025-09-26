-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  age INTEGER,
  weight DECIMAL,
  weight_unit TEXT DEFAULT 'lbs' CHECK (weight_unit IN ('lbs', 'kg')),
  allergies TEXT,
  gender TEXT,
  location TEXT,
  survival_streak INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  danger_level INTEGER DEFAULT 1,
  survivalist_mode BOOLEAN DEFAULT false,
  immortal_mode BOOLEAN DEFAULT false,
  premium_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create death analyses table
CREATE TABLE public.death_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario TEXT,
  image_url TEXT,
  item_detected TEXT,
  confidence DECIMAL,
  toxicity_level INTEGER,
  kill_rating DECIMAL,
  kill_rating_text TEXT,
  lethal_dose TEXT,
  time_to_death TEXT,
  mechanism TEXT,
  survival_tips TEXT,
  final_words TEXT,
  category TEXT,
  is_public BOOLEAN DEFAULT true,
  community_corrected BOOLEAN DEFAULT false,
  original_detection TEXT,
  corrected_item TEXT,
  analysis_type TEXT DEFAULT 'text', -- 'text', 'image', 'camera'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);

-- Create leaderboard entries table
CREATE TABLE public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leaderboard_type TEXT NOT NULL, -- 'xp', 'survival_streak', 'analyses_count', 'community_corrections'
  score INTEGER NOT NULL,
  rank INTEGER,
  week_of DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community interactions table
CREATE TABLE public.community_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES public.death_analyses(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'like', 'share', 'comment', 'correction'
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create death duels table
CREATE TABLE public.death_duels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenger_scenario TEXT NOT NULL,
  opponent_scenario TEXT,
  challenger_score DECIMAL,
  opponent_score DECIMAL,
  winner_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending', -- pending, active, completed, expired
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create viral challenges table
CREATE TABLE public.viral_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL, -- 'scan', 'scenario', 'duel'
  parameters JSONB,
  participants_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  trending_score DECIMAL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.death_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.death_duels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viral_challenges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Death analyses policies
CREATE POLICY "Users can view public analyses" ON public.death_analyses FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their own analyses" ON public.death_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analyses" ON public.death_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analyses" ON public.death_analyses FOR DELETE USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view their own achievements" ON public.achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create achievements" ON public.achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Anyone can view leaderboard entries" ON public.leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "System can manage leaderboard entries" ON public.leaderboard_entries FOR ALL USING (true);

-- Community interactions policies
CREATE POLICY "Users can view all interactions" ON public.community_interactions FOR SELECT USING (true);
CREATE POLICY "Users can create their own interactions" ON public.community_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interactions" ON public.community_interactions FOR UPDATE USING (auth.uid() = user_id);

-- Death duels policies
CREATE POLICY "Users can view duels they're involved in" ON public.death_duels FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = opponent_id OR status = 'completed');
CREATE POLICY "Users can create duels" ON public.death_duels FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Users can update duels they're involved in" ON public.death_duels FOR UPDATE USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Viral challenges policies
CREATE POLICY "Anyone can view challenges" ON public.viral_challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON public.viral_challenges FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their own challenges" ON public.viral_challenges FOR UPDATE USING (auth.uid() = creator_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_total_xp ON public.profiles(total_xp DESC);
CREATE INDEX idx_death_analyses_user_id ON public.death_analyses(user_id);
CREATE INDEX idx_death_analyses_created_at ON public.death_analyses(created_at DESC);
CREATE INDEX idx_death_analyses_public ON public.death_analyses(is_public, created_at DESC);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_leaderboard_type_score ON public.leaderboard_entries(leaderboard_type, score DESC);
CREATE INDEX idx_community_interactions_analysis_id ON public.community_interactions(analysis_id);
CREATE INDEX idx_death_duels_status ON public.death_duels(status, created_at DESC);
CREATE INDEX idx_viral_challenges_trending ON public.viral_challenges(trending_score DESC, created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leaderboard_entries_updated_at BEFORE UPDATE ON public.leaderboard_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate trending scores
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for key tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.death_analyses REPLICA IDENTITY FULL;
ALTER TABLE public.leaderboard_entries REPLICA IDENTITY FULL;
ALTER TABLE public.community_interactions REPLICA IDENTITY FULL;
ALTER TABLE public.death_duels REPLICA IDENTITY FULL;
ALTER TABLE public.viral_challenges REPLICA IDENTITY FULL;