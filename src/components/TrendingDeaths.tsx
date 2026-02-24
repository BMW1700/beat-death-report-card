
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Flame, Skull } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrendingItem {
  item_detected: string;
  kill_rating: number;
  category: string | null;
}

const categoryEmoji: Record<string, string> = {
  food: "🍔",
  chemical: "☠️",
  plant: "🌿",
  animal: "🐍",
  object: "🔪",
  beverage: "🥤",
};

export const TrendingDeaths = () => {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("death_analyses")
        .select("item_detected, kill_rating, category")
        .eq("is_public", true)
        .not("item_detected", "is", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        setTrending(data as TrendingItem[]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <Card className="glass-card border-accent/20">
        <CardTitle className="p-3 text-lg flex items-center gap-2 text-orange-400">
          <Flame className="w-5 h-5" />
          Trending Deaths
        </CardTitle>
        <CardContent className="flex items-center justify-center py-4">
          <Skull className="w-5 h-5 animate-death-pulse text-muted-foreground" />
          <span className="text-muted-foreground ml-2">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  if (trending.length === 0) {
    return (
      <Card className="glass-card border-accent/20">
        <CardTitle className="p-3 text-lg flex items-center gap-2 text-orange-400">
          <Flame className="w-5 h-5" />
          Trending Deaths
        </CardTitle>
        <CardContent className="text-center py-4 text-muted-foreground text-sm">
          No community scans yet. Be the first!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-accent/20">
      <CardTitle className="p-3 text-lg flex items-center gap-2 text-orange-400">
        <Flame className="w-5 h-5" />
        Trending Deaths
        <span className="text-xs text-muted-foreground ml-auto">Live</span>
      </CardTitle>
      <CardContent className="flex flex-row gap-3 overflow-x-auto pb-2">
        {trending.map((t, i) => (
          <span key={i} className="bg-destructive/20 rounded-lg px-4 py-2 min-w-[140px] flex flex-col items-center">
            <span className="text-2xl">{categoryEmoji[t.category || ""] || "💀"}</span>
            <span className="text-xs text-foreground mt-1 text-center">{t.item_detected}</span>
            {t.kill_rating && (
              <span className="text-[10px] text-muted-foreground">
                {t.kill_rating}/10 lethal
              </span>
            )}
          </span>
        ))}
      </CardContent>
    </Card>
  );
};
