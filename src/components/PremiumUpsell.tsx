
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, Shield, Zap, Crown } from "lucide-react";
import { toast } from "sonner";

// Note: Replace with your actual Supabase client or use environment variables
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Initialize Supabase client (this will be configured with your actual project)
let supabase: any = null;

const plans = [
  {
    name: "Survival Pro",
    price: "$9.99/mo",
    priceId: "price_survival_pro", // Replace with actual Stripe price ID
    icon: Shield,
    features: ["Unlimited scans", "Advanced survival tips", "Expert content", "Priority support"],
    color: "text-primary"
  },
  {
    name: "Prepper Premium", 
    price: "$19.99/mo",
    priceId: "price_prepper_premium", // Replace with actual Stripe price ID
    icon: Zap,
    features: ["Everything in Pro", "Custom survival plans", "Group challenges", "Wilderness scanner", "Emergency prep tools"],
    color: "text-warning"
  },
  {
    name: "Immortal Mode",
    price: "$49.99/mo", 
    priceId: "price_immortal_mode", // Replace with actual Stripe price ID
    icon: Crown,
    features: ["Everything in Premium", "AI survival coach", "1-on-1 expert consultation", "Exclusive content", "VIP community access"],
    color: "text-success"
  }
];

export const PremiumUpsell = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setLoading(plan.name);
    
    try {
      // For now, simulate subscription flow
      // TODO: Replace with actual Supabase client once configured
      
      toast.success(`Starting ${plan.name} subscription...`);
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This will be replaced with actual Stripe checkout
      toast.success(`${plan.name} subscription activated! 🎉`);
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Failed to start subscription. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold gradient-text mb-2">🚀 Level Up Your Survival Game</h2>
        <p className="text-muted-foreground">Join thousands of survivors mastering the art of beating death</p>
      </div>
      
      {plans.map((plan) => {
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
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.name}
                className="w-full gradient-bg hover:scale-105 transition-transform"
              >
                {loading === plan.name ? "Loading..." : `Get ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
