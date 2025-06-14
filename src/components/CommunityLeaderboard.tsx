
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
export const CommunityLeaderboard = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-cyan-400">
      <Users className="w-5 h-5" />
      Community Leaderboard <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">See who's scanned the most dangerous stuff and survived to tell the tale. Global stats coming soon!</span>
    </CardContent>
  </Card>
);
