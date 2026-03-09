import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gem, Shield, Zap, Crown, Skull } from "lucide-react";
import { useScanCredits } from "@/hooks/useScanCredits";
import { ScanCreditsBadge } from "@/components/ScanCreditsBadge";

const subscriptionPlans = [
  {
    name: "Survival Pro",
    price: "$9.99/mo",
    icon: Shield,
    features: ["Unlimited scans", "Premium AI model (Gemini Pro)", "Advanced survival tips", "Priority support"],
    color: "text-primary",
    tier: "survival_pro",
  },
  {
    name: "Prepper Premium",
    price: "$19.99/mo",
    icon: Zap,
    features: ["Everything in Pro", "Custom survival plans", "Group challenges", "Wilderness scanner", "Emergency prep tools"],
    color: "text-warning",
    tier: "prepper_premium",
  },
  {
    name: "Immortal Mode",
    price: "$49.99/mo",
    icon: Crown,
    features: ["Everything in Premium", "AI survival coach", "1-on-1 expert consultation", "Exclusive content", "VIP community access"],
    color: "text-success",
    tier: "immortal_mode",
  },
];

export const PremiumUpsell = () => {
  const { freeScansLeft, creditsRemaining, isSubscriber, purchaseScanPack, purchaseSubscription } = useScanCredits();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">🚀 Level Up Your Survival Game</h2>
        <p className="text-muted-foreground">Join thousands of survivors mastering the art of beating death</p>
        <div className="flex justify-center mt-3">
          <ScanCreditsBadge
            freeScansLeft={freeScansLeft}
            creditsRemaining={creditsRemaining}
            isSubscriber={isSubscriber}
          />
        </div>
      </div>

      {/* Scan Pack - impulse buy at the top */}
      <Card className="glass-card border-primary/40 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px]">
          Best Value
        </Badge>
        <CardTitle className="p-3 flex items-center gap-2 text-primary">
          <Skull className="w-5 h-5" />
          40 Scan Pack
          <span className="ml-auto text-lg font-bold">$1.99</span>
        </CardTitle>
        <CardContent className="space-y-3">
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Gem className="w-3 h-3 text-primary" />
              40 death scans (~$0.05 each)
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Gem className="w-3 h-3 text-primary" />
              Never expires
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Gem className="w-3 h-3 text-primary" />
              One-time purchase
            </li>
          </ul>
          <Button
            onClick={purchaseScanPack}
            className="w-full gradient-bg hover:scale-105 transition-transform"
          >
            Get 40 Scans — $1.99
          </Button>
        </CardContent>
      </Card>

      {/* Subscription tiers */}
      {subscriptionPlans.map((plan) => {
        const IconComponent = plan.icon;
        return (
          <Card key={plan.name} className="glass-card border-warning/30 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardTitle className={`p-3 flex items-center gap-2 ${plan.color}`}>
              <IconComponent className="w-5 h-5" />
              {plan.name}
              <span className="ml-auto text-lg font-bold">{plan.price}</span>
            </CardTitle>
            <CardContent className="space-y-3">
              <ul className="space-y-1 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Gem className="w-3 h-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => purchaseSubscription(plan.name)}
                className="w-full gradient-bg hover:scale-105 transition-transform"
                disabled
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
