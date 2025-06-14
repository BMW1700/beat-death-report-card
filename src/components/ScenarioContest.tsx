
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
export const ScenarioContest = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-yellow-300">
      <Award className="w-5 h-5" />
      Scenario Contest <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">Submit your wildest death scenario, vote on submissions, and win! Community voting soon!</span>
    </CardContent>
  </Card>
);
