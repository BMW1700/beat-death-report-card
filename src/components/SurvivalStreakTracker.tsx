import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Clock, Zap, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActions: number;
  weeklyCount: number;
}

export const SurvivalStreakTracker = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0, longestStreak: 0, totalActions: 0, weeklyCount: 0
  });
  const [timeUntilReset, setTimeUntilReset] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      setTimeUntilReset(`${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from('life_actions')
        .select('logged_at')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error || !data) return;

      const totalActions = data.length;

      // Calculate current streak from distinct days
      const uniqueDates = [...new Set(data.map((r: any) => new Date(r.logged_at).toDateString()))];
      let currentStreak = 0;
      const checkDate = new Date();
      while (uniqueDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Calculate longest streak
      const sortedDates = uniqueDates
        .map(d => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());
      let longestStreak = 0;
      let tempStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const diff = (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / 86400000;
        if (Math.round(diff) === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

      // Weekly count
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyCount = data.filter((r: any) => new Date(r.logged_at) >= weekAgo).length;

      setStreak({ currentStreak, longestStreak, totalActions, weeklyCount });

      // Sync streak back to profiles for leaderboard
      supabase.from('profiles')
        .update({ survival_streak: currentStreak })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) console.error('[Streak] Sync error:', error);
        });
    };

    fetchStreak();
  }, [user]);

  const getStreakLevel = (days: number) => {
    if (days >= 30) return { level: "Legendary", color: "text-yellow-400", emoji: "🏆" };
    if (days >= 14) return { level: "Expert", color: "text-purple-400", emoji: "💎" };
    if (days >= 7) return { level: "Veteran", color: "text-blue-400", emoji: "⭐" };
    if (days >= 3) return { level: "Regular", color: "text-green-400", emoji: "🔥" };
    return { level: "Beginner", color: "text-muted-foreground", emoji: "🌱" };
  };

  const streakLevel = getStreakLevel(streak.currentStreak);
  const weeklyGoal = 10;
  const progressPercentage = Math.min(100, (streak.weeklyCount / weeklyGoal) * 100);

  return (
    <Card className="glass-card border-success/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-success">
        <Flame className="w-5 h-5 animate-pulse" />
        Survival Streak
        <Badge variant="outline" className="ml-auto">
          {streakLevel.emoji} {streakLevel.level}
        </Badge>
      </CardTitle>

      <CardContent className="space-y-4">
        <div className="text-center bg-gradient-to-r from-primary/10 to-success/10 rounded-lg p-4 border border-success/20">
          <div className="text-4xl font-bold gradient-text mb-1">{streak.currentStreak}</div>
          <div className="text-sm text-muted-foreground">Days in a row</div>
          <div className={`text-lg font-semibold ${streakLevel.color} mt-1`}>
            {streakLevel.emoji} {streakLevel.level} Survivor
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Streak resets in</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeUntilReset}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Weekly Goal</span>
            <span className="text-muted-foreground">{streak.weeklyCount}/{weeklyGoal} actions</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {progressPercentage >= 100 && (
            <div className="text-xs text-success font-medium">🎯 Weekly goal achieved!</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card/30 rounded-lg p-3 text-center border border-accent/20">
            <div className="text-lg font-bold text-warning">{streak.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          <div className="bg-card/30 rounded-lg p-3 text-center border border-accent/20">
            <div className="text-lg font-bold text-primary">{streak.totalActions}</div>
            <div className="text-xs text-muted-foreground">Total Actions</div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-primary" />
            <span>
              {streak.currentStreak === 0
                ? "Log an action to start your streak!"
                : streak.currentStreak < 7
                ? "Keep logging daily to build your streak!"
                : streak.currentStreak < 30
                ? "You're becoming a true survivalist!"
                : "Legendary status! Practically immortal!"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
