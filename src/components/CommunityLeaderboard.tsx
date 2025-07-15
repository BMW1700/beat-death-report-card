
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState } from "react";

type User = {
  name: string;
  xp: number;
};

const initialData: User[] = [
  { name: "DeathLord42", xp: 999 },
  { name: "SurviveQueen", xp: 888 },
  { name: "ToxinDoc", xp: 850 },
  { name: "MorbidMike", xp: 420 },
  { name: "VenomViktor", xp: 317 },
  { name: "GummyReaper", xp: 222 },
];

export const CommunityLeaderboard = () => {
  const [leaderboard] = useState<User[]>(initialData);

  return (
    <Card className="glass-card hover:purple-glow transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-accent">
        <Users className="w-5 h-5" />
        Community Leaderboard <span className="text-xs text-muted-foreground">Live</span>
      </CardTitle>
      <CardContent className="space-y-2">
        {leaderboard.map((e, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
            <span className="font-bold text-primary w-6">{i + 1}.</span>
            <span className="text-foreground font-medium flex-1">{e.name}</span>
            <span className="text-success font-mono text-sm">XP: {e.xp}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
