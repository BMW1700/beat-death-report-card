
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const DailyDeathFact = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardContent className="flex items-center gap-3 py-3">
      <AlertTriangle className="w-6 h-6 text-yellow-400" />
      <span className="text-yellow-300 font-medium text-sm">
        Daily Death Fact: <br />
        A lethal dose of caffeine for adults can be as low as 5 grams. That's about 42 cups of coffee. Please don't try this at home!
      </span>
    </CardContent>
  </Card>
);
