import { Award, Skull, Flame, Shield, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLifeClock } from "@/contexts/LifeClockContext";

export const DeathScore = () => {
  const { profile } = useAuth();
  const { state } = useLifeClock();

  const totalXp = profile?.total_xp ?? 0;
  const streak = profile?.survival_streak ?? 0;
  const actionsLogged = state.recentActions.length;
  const healthScore = profile?.health_score ?? 50;

  // Composite score: weighted blend of real metrics
  const compositeScore = Math.min(
    999,
    Math.round(totalXp * 0.4 + streak * 15 + actionsLogged * 2 + healthScore * 1.5)
  );

  const getLevel = (score: number) => {
    if (score >= 500) return { label: "Immortal", icon: <Shield className="w-4 h-4" />, color: "text-primary" };
    if (score >= 250) return { label: "Survivor", icon: <Flame className="w-4 h-4" />, color: "text-warning" };
    if (score >= 100) return { label: "Fighter", icon: <TrendingUp className="w-4 h-4" />, color: "text-success" };
    return { label: "Mortal", icon: <Skull className="w-4 h-4" />, color: "text-muted-foreground" };
  };

  const level = getLevel(compositeScore);

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center gap-3">
        <Award className="w-6 h-6 text-primary" />
        <span className="text-foreground font-bold">Death Score</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold gradient-text font-mono">{compositeScore}</span>
        <div className={`flex items-center gap-1.5 ${level.color}`}>
          {level.icon}
          <span className="text-sm font-semibold">{level.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="bg-card/30 rounded p-2 border border-accent/20">
          <span className="block font-semibold text-foreground">{totalXp}</span>
          Total XP
        </div>
        <div className="bg-card/30 rounded p-2 border border-accent/20">
          <span className="block font-semibold text-foreground">{streak}d</span>
          Streak
        </div>
        <div className="bg-card/30 rounded p-2 border border-accent/20">
          <span className="block font-semibold text-foreground">{actionsLogged}</span>
          Actions
        </div>
        <div className="bg-card/30 rounded p-2 border border-accent/20">
          <span className="block font-semibold text-foreground">{healthScore}</span>
          Health
        </div>
      </div>
    </div>
  );
};
