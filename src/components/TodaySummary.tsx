import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useLifeClock } from "@/contexts/LifeClockContext";

function formatMinutes(mins: number): string {
  const abs = Math.abs(mins);
  if (abs >= 1440) return `${mins > 0 ? "+" : "-"}${Math.round(abs / 1440)} day${Math.round(abs / 1440) !== 1 ? "s" : ""}`;
  if (abs >= 60) return `${mins > 0 ? "+" : "-"}${Math.round(abs / 60)} hr${Math.round(abs / 60) !== 1 ? "s" : ""}`;
  return `${mins > 0 ? "+" : "-"}${abs} min`;
}

export function TodaySummary() {
  const { state } = useLifeClock();
  const today = new Date().toDateString();

  const todayActions = state.recentActions.filter(
    (a) => new Date(a.timestamp).toDateString() === today
  );

  const totalMinutes = todayActions.reduce((sum, a) => sum + a.playful_minutes, 0);
  const isPositive = totalMinutes >= 0;

  const motivationalMessage = todayActions.length === 0
    ? "No actions logged yet today. Start your streak!"
    : isPositive
    ? totalMinutes > 1440
      ? "🔥 Incredible day! You're adding serious time to your life."
      : "💪 Positive day so far. Keep the momentum!"
    : "⚠️ Net negative today. One healthy action can turn it around.";

  return (
    <Card className="glass-card border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-primary" />
          Today's Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>{todayActions.length} action{todayActions.length !== 1 ? "s" : ""} logged</span>
          </div>
          <div className={`flex items-center gap-1 font-semibold text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {formatMinutes(totalMinutes)}
          </div>
        </div>

        {todayActions.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {todayActions.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center justify-between text-xs py-1">
                <span className="text-muted-foreground truncate flex-1">{
                  state.actionMappings.find(m => m.action_id === a.action_id)?.description || a.action_id
                }</span>
                <span className={`ml-2 font-medium whitespace-nowrap ${a.playful_minutes >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatMinutes(a.playful_minutes)}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-1">{motivationalMessage}</p>
      </CardContent>
    </Card>
  );
}
