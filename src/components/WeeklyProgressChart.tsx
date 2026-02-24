import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DayData {
  day: string;
  minutes: number;
  actions: number;
}

export const WeeklyProgressChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DayData[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchWeekData = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data: rows, error } = await supabase
        .from('life_actions')
        .select('minutes_impact, logged_at')
        .eq('user_id', user.id)
        .gte('logged_at', sevenDaysAgo.toISOString())
        .order('logged_at', { ascending: true });

      if (error || !rows) return;

      // Group by day
      const dayMap = new Map<string, { minutes: number; actions: number }>();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Initialize all 7 days
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - 6 + i);
        const key = d.toDateString();
        dayMap.set(key, { minutes: 0, actions: 0 });
      }

      rows.forEach(row => {
        const key = new Date(row.logged_at).toDateString();
        const existing = dayMap.get(key);
        if (existing) {
          existing.minutes += row.minutes_impact;
          existing.actions += 1;
        }
      });

      const chartData: DayData[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - 6 + i);
        const key = d.toDateString();
        const entry = dayMap.get(key) || { minutes: 0, actions: 0 };
        chartData.push({
          day: dayNames[d.getDay()],
          minutes: entry.minutes,
          actions: entry.actions,
        });
      }

      setData(chartData);
    };

    fetchWeekData();
  }, [user]);

  const totalWeekMinutes = data.reduce((s, d) => s + d.minutes, 0);
  const totalWeekActions = data.reduce((s, d) => s + d.actions, 0);

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-primary text-base">
          <Calendar className="w-5 h-5" />
          Weekly Progress
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {totalWeekActions} actions • {totalWeekMinutes > 0 ? "+" : ""}{totalWeekMinutes}m net
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 && data.some(d => d.actions > 0) ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value > 0 ? "+" : ""}${value}m`, "Net Minutes"]}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.minutes >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                    opacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Log actions to see your weekly progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
