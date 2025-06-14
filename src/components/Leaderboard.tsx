
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
const demo = [
  { name: "DeathLord42", xp: 999 },
  { name: "SurviveQueen", xp: 888 },
  { name: "ToxinDoc", xp: 850 }
];
export const Leaderboard = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-green-400">
      <TrendingUp className="w-5 h-5" />
      Leaderboard
    </CardTitle>
    <CardContent className="space-y-1">
      {demo.map((e, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="font-bold text-white">{i + 1}.</span>
          <span className="text-white">{e.name}</span>
          <span className="ml-auto text-green-300 font-mono">XP: {e.xp}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);
