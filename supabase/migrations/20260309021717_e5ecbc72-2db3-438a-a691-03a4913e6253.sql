-- Drop the permissive ALL policy on leaderboard_entries that lets users manipulate scores
DROP POLICY IF EXISTS "Users can upsert their own leaderboard entries" ON public.leaderboard_entries;