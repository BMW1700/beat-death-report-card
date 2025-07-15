
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

// Mock trending items
const trending = [
  { text: "Drinking 5 energy drinks", emoji: "⚡" },
  { text: "Swallowing coins", emoji: "🪙" },
  { text: "Locked in a freezer", emoji: "🧊" },
  { text: "Eating 20 apples", emoji: "🍏" },
];

export const TrendingDeaths = () => (
  <Card className="glass-card border-accent/20">
    <CardTitle className="p-3 text-lg flex items-center gap-2 text-orange-400">
      <Flame className="w-5 h-5" />
      Trending Deaths
    </CardTitle>
    <CardContent className="flex flex-row gap-3 overflow-x-auto pb-2">
      {trending.map((t, i) => (
        <span key={i} className="bg-red-500/20 rounded-lg px-4 py-2 min-w-[140px] flex flex-col items-center">
          <span className="text-2xl">{t.emoji}</span>
          <span className="text-xs text-gray-100 mt-1">{t.text}</span>
        </span>
      ))}
    </CardContent>
  </Card>
);
