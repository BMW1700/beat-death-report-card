import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skull, Zap, Crown, Tv } from "lucide-react";

interface ScanPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchasePack: () => void;
  onPurchaseSubscription: (tier: string) => void;
  freeScansLeft: number;
  creditsRemaining: number;
}

export function ScanPaywall({
  open,
  onOpenChange,
  onPurchasePack,
  onPurchaseSubscription,
  freeScansLeft,
  creditsRemaining,
}: ScanPaywallProps) {
  const totalRemaining = freeScansLeft + creditsRemaining;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-destructive/30 max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Skull className="w-12 h-12 text-destructive animate-death-pulse" />
          </div>
          <DialogTitle className="text-2xl font-playfair gradient-text">
            You've Used All Your Free Scans!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {totalRemaining === 0
              ? "0 scans remaining — grab more to keep scanning"
              : `${totalRemaining} scan${totalRemaining !== 1 ? "s" : ""} remaining`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Scan Pack - impulse buy */}
          <Card className="relative overflow-hidden border-primary/40 bg-card/80 hover:border-primary/60 transition-all duration-200 hover:scale-[1.02]">
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px]">
              Best Value
            </Badge>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold text-card-foreground text-lg">40 Scans</h3>
                  <p className="text-muted-foreground text-sm">One-time purchase</p>
                </div>
                <span className="ml-auto text-2xl font-bold text-primary">$1.99</span>
              </div>
              <p className="text-xs text-muted-foreground">
                ~$0.05 per scan · Never expires · Use anytime
              </p>
              <Button
                onClick={onPurchasePack}
                className="w-full gradient-bg text-primary-foreground font-semibold hover:scale-105 transition-transform"
              >
                Get 40 Scans — $1.99
              </Button>
            </div>
          </Card>

          {/* Subscription */}
          <Card className="relative overflow-hidden border-accent/40 bg-card/80 hover:border-accent/60 transition-all duration-200 hover:scale-[1.02]">
            <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground text-[10px]">
              Most Popular
            </Badge>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-bold text-card-foreground text-lg">Unlimited Scans</h3>
                  <p className="text-muted-foreground text-sm">Survival Pro subscription</p>
                </div>
                <span className="ml-auto text-2xl font-bold text-accent">$9.99<span className="text-sm font-normal">/mo</span></span>
              </div>
              <p className="text-xs text-muted-foreground">
                Unlimited scans · Premium AI model · Priority support
              </p>
              <Button
                onClick={() => onPurchaseSubscription("Survival Pro")}
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold hover:scale-105 transition-transform"
              >
                Go Unlimited — $9.99/mo
              </Button>
            </div>
          </Card>

          {/* Future: Ad-based free scan */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border opacity-50 cursor-not-allowed">
            <Tv className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Watch an ad for 1 free scan</span>
            <Badge variant="outline" className="ml-auto text-[10px]">Coming Soon</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
