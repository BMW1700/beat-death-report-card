
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
export const ScanHistoryAnalytics = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-purple-400">
      <BarChart3 className="w-5 h-5" />
      Scan History Analytics <span className="text-xs text-gray-300">PREMIUM</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">View all your past scans and survival stats. Premium feature coming soon!</span>
    </CardContent>
  </Card>
);
