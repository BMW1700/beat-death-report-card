
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
    <Card className="bg-slate-800 border-slate-700 hover:shadow-xl transition duration-200">
      <CardTitle className="p-3 flex items-center gap-2 text-cyan-400">
        <Users className="w-5 h-5" />
        Community Leaderboard <span className="text-xs text-gray-300">Live</span>
      </CardTitle>
      <CardContent className="space-y-1">
        {leaderboard.map((e, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-bold text-white">{i + 1}.</span>
            <span className="text-white">{e.name}</span>
            <span className="ml-auto text-green-300 font-mono">XP: {e.xp}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
