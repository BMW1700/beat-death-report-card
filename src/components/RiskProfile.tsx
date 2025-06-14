
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
export const RiskProfile = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-cyan-300">
      <ShieldCheck className="w-5 h-5" />
      Personalized Risk Profile <span className="text-xs text-gray-300">COMING SOON</span>
    </CardTitle>
    <CardContent>
      <div className="text-gray-200 text-sm">Get tailored stats, patterns, and survival analysis based on your BeatDeath scan history. Stay tuned!</div>
    </CardContent>
  </Card>
);
