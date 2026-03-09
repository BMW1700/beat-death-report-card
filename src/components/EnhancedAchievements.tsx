import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Crown, Shield, Zap, Star, Lock, Unlock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Achievement {
  id: string;
  achievement_name: string;
  achievement_type: string;
  description: string | null;
  icon: string | null;
  rarity: string | null;
  xp_reward: number | null;
  unlocked_at: string | null;
}

// Static definitions for progress tracking (milestones users work toward)
const milestones = [
  { type: "first_action", name: "First Steps", desc: "Log your first life action", icon: "🔍", maxProgress: 1, rarity: "common" },
  { type: "streak_7", name: "Week Warrior", desc: "7-day survival streak", icon: "🔥", maxProgress: 7, rarity: "rare" },
  { type: "streak_30", name: "Streak Master", desc: "30-day survival streak", icon: "🔥", maxProgress: 30, rarity: "epic" },
  { type: "actions_10", name: "Getting Started", desc: "Log 10 life actions", icon: "📋", maxProgress: 10, rarity: "common" },
  { type: "actions_50", name: "Dedicated Survivor", desc: "Log 50 life actions", icon: "💪", maxProgress: 50, rarity: "rare" },
  { type: "xp_100", name: "Century Club", desc: "Earn 100 XP", icon: "⭐", maxProgress: 100, rarity: "rare" },
  { type: "xp_1000", name: "XP Legend", desc: "Earn 1,000 XP", icon: "👑", maxProgress: 1000, rarity: "legendary" },
];

const rarityColors: Record<string, string> = {
  common: "text-muted-foreground",
  rare: "text-primary",
  epic: "text-accent",
  legendary: "text-warning",
};

export const EnhancedAchievements = () => {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [actionCount, setActionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetch = async () => {
      const [achRes, profileRes, actionsRes] = await Promise.all([
        supabase.from("achievements").select("*").eq("user_id", user.id),
        supabase.from("profiles").select("total_xp, survival_streak").eq("user_id", user.id).single(),
        supabase.from("life_actions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      setUnlocked(achRes.data || []);
      setTotalXP(profileRes.data?.total_xp ?? 0);
      setStreak(profileRes.data?.survival_streak ?? 0);
      setActionCount(actionsRes.count ?? 0);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const unlockedTypes = new Set(unlocked.map(a => a.achievement_type));

  const getProgress = (type: string, max: number) => {
    if (unlockedTypes.has(type)) return max;
    if (type.startsWith("streak")) return Math.min(streak, max);
    if (type.startsWith("actions")) return Math.min(actionCount, max);
    if (type.startsWith("xp")) return Math.min(totalXP, max);
    if (type === "first_action") return Math.min(actionCount, max);
    return 0;
  };

  if (!user) return null;

  return (
    <Card className="glass-card border-warning/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-warning">
        <Trophy className="w-5 h-5" />
        Achievements
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {unlocked.length}/{milestones.length}
          </Badge>
          <Badge variant="outline" className="text-xs text-primary">
            {totalXP.toLocaleString()} XP
          </Badge>
        </div>
      </CardTitle>

      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center text-muted-foreground py-6 text-sm">Loading achievements...</div>
        ) : (
          milestones.map((m) => {
            const isUnlocked = unlockedTypes.has(m.type);
            const progress = getProgress(m.type, m.maxProgress);
            const pct = Math.min((progress / m.maxProgress) * 100, 100);
            const rColor = rarityColors[m.rarity] || "text-muted-foreground";

            return (
              <div
                key={m.type}
                className={`bg-card/30 rounded-lg p-3 border transition-all ${
                  isUnlocked ? "border-success/50 shadow-lg" : "border-accent/20"
                } hover:border-primary/30`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="text-2xl">{m.icon}</div>
                    {isUnlocked ? (
                      <Unlock className="absolute -bottom-1 -right-1 w-3 h-3 text-success" />
                    ) : (
                      <Lock className="absolute -bottom-1 -right-1 w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{m.name}</h4>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs ${rColor}`}>{m.rarity}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{progress}/{m.maxProgress}</span>
                      </div>
                      <Progress value={pct} className="h-1" />
                    </div>
                    {isUnlocked && (
                      <div className="text-xs text-success mt-1">✅ Unlocked!</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-primary">Survival XP</span>
            <span className="text-lg font-bold gradient-text">{totalXP.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Log actions and maintain streaks to unlock achievements!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
