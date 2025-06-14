
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart } from "lucide-react";
export const DeathTrendsDashboard = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-purple-400">
      <LineChart className="w-5 h-5" />
      Trend Analytics Dashboard <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <div className="text-gray-300 text-sm">Track the most dangerous items and see real death risk trends with live charts & graphs. Coming soon!</div>
    </CardContent>
  </Card>
);
