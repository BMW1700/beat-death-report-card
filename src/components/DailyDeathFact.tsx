
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const DailyDeathFact = () => (
  <Card className="glass-card accent-glow">
    <CardContent className="flex items-center gap-3 py-3">
      <AlertTriangle className="w-6 h-6 text-warning" />
      <span className="text-warning font-medium text-sm">
        Daily Death Fact: <br />
        A lethal dose of caffeine for adults can be as low as 5 grams. That's about 42 cups of coffee. Please don't try this at home!
      </span>
    </CardContent>
  </Card>
);
