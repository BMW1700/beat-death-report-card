
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Pin } from "lucide-react";
export const RegionalTrending = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-red-400">
      <Pin className="w-5 h-5" />
      Regional Trending Items <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">Discover what's risky near you—local trending scans from the BeatDeath community.</span>
    </CardContent>
  </Card>
);
