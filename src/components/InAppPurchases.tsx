import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Skull, Zap } from "lucide-react";
import { useScanCredits } from "@/hooks/useScanCredits";
import { ScanCreditsBadge } from "@/components/ScanCreditsBadge";

export const InAppPurchases = () => {
  const { freeScansLeft, creditsRemaining, isSubscriber, purchaseScanPack } = useScanCredits();

  return (
    <Card className="glass-card border-primary/30">
      <CardTitle className="p-3 flex items-center gap-2 text-primary">
        <ShoppingCart className="w-5 h-5" />
        Quick Buy
        <ScanCreditsBadge
          freeScansLeft={freeScansLeft}
          creditsRemaining={creditsRemaining}
          isSubscriber={isSubscriber}
          className="ml-auto"
        />
      </CardTitle>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-primary/20">
          <Zap className="w-8 h-8 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-card-foreground">40 Scan Pack</p>
            <p className="text-xs text-muted-foreground">~$0.05 per scan · Never expires</p>
          </div>
          <Button
            size="sm"
            className="gradient-bg text-primary-foreground font-semibold flex-shrink-0"
            disabled
          >
            Soon
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Avatar flair, scan skips, and more coming soon!
        </p>
      </CardContent>
    </Card>
  );
};
