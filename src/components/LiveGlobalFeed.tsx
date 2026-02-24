import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeedItem {
  id: string;
  category: string;
  description: string;
  minutes_impact: number;
  logged_at: string;
  username: string;
}

export const LiveGlobalFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      // Get recent public life_actions joined with profiles for username
      const { data, error } = await supabase
        .from('life_actions')
        .select('id, category, description, minutes_impact, logged_at, user_id')
        .order('logged_at', { ascending: false })
        .limit(15);

      if (error || !data) {
        setLoading(false);
        return;
      }

      // Get usernames for these users
      const userIds = [...new Set(data.map(d => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, username, display_name')
        .in('user_id', userIds);

      const profileMap = new Map(
        (profiles || []).map(p => [p.user_id, p.display_name || p.username || 'Anonymous'])
      );

      // Anonymize: show first 3 chars + ***
      const feedItems: FeedItem[] = data.map(d => {
        const name = profileMap.get(d.user_id) || 'Anonymous';
        const anonymized = name.length > 3 ? name.slice(0, 3) + '***' : name;
        return {
          id: d.id,
          category: d.category,
          description: d.description,
          minutes_impact: d.minutes_impact,
          logged_at: d.logged_at,
          username: anonymized,
        };
      });

      setItems(feedItems);
      setLoading(false);
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getCategoryEmoji = (cat: string) => {
    const map: Record<string, string> = {
      exercise: "🏋️",
      diet: "🥗",
      substances: "⚠️",
      behavior: "🧘",
      preparedness: "🛡️",
    };
    return map[cat] || "📋";
  };

  return (
    <Card className="glass-card border-primary/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-primary">
        <Activity className="w-5 h-5 animate-pulse" />
        Live Global Feed
        <Badge variant="outline" className="ml-auto text-xs">
          <Users className="w-3 h-3 mr-1" />
          {items.length} recent
        </Badge>
      </CardTitle>
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">
            <Activity className="w-8 h-8 mx-auto mb-2 animate-spin opacity-50" />
            <p className="text-sm">Loading global activity...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No activity yet. Be the first to log an action!</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-card/30 rounded-lg p-3 border border-accent/20 hover:border-primary/30 transition-colors animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getCategoryEmoji(item.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-foreground text-sm truncate">
                      {item.username}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {timeAgo(item.logged_at)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate">{item.description}</span>
                    <Badge
                      variant={item.minutes_impact > 0 ? "default" : "destructive"}
                      className="ml-2 shrink-0 text-xs"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {item.minutes_impact > 0 ? "+" : ""}{item.minutes_impact}m
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
