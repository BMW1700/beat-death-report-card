
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Gem } from "lucide-react";
export const PremiumUpsell = () => (
  <Card className="glass-card border-warning/30">
    <CardTitle className="p-3 flex items-center gap-2 text-warning">
      <Gem className="w-5 h-5" />
      Go BeatDeath Premium <span className="text-xs text-muted-foreground">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-sm text-muted-foreground">Unlock unlimited scans, exclusive badges, and advanced analytics. Try the next level soon!</span>
    </CardContent>
  </Card>
);
