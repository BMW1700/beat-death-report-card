
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
export const GlobalMarketingBanner = () => (
  <Card className="glass-card border-warning/30 warning-glow">
    <CardTitle className="p-3 flex items-center gap-2 text-warning">
      <Megaphone className="w-5 h-5" />
      GLOBAL EXPANSION <span className="text-xs text-muted-foreground">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-muted-foreground text-sm">Stay tuned for global campaigns and regional contests! 🌍🚀</span>
    </CardContent>
  </Card>
);
