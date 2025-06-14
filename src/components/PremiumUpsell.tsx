
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Gem } from "lucide-react";
export const PremiumUpsell = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-yellow-400">
      <Gem className="w-5 h-5" />
      Go BeatDeath Premium <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-sm text-gray-200">Unlock unlimited scans, exclusive badges, and advanced analytics. Try the next level soon!</span>
    </CardContent>
  </Card>
);
