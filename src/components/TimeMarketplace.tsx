import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Zap, 
  Book, 
  Pill,
  Star,
  ShoppingCart,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useLifeClock } from '@/contexts/LifeClockContext';
import { toast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

// Time-based product interface
interface TimeProduct {
  id: string;
  name: string;
  category: 'gear' | 'booster' | 'course' | 'supplement';
  price: number;
  timeBonus: number; // hours added to life clock
  description: string;
  isAffiliate: boolean;
  affiliateUrl?: string;
  rating: number;
  image?: string;
  verified: boolean;
}

// Time marketplace products (BASE UNIT: 8 hours per unit)
const TIME_PRODUCTS: TimeProduct[] = [
  // GEAR (SURVIVALIST)
  {
    id: 'water_filter_tier1',
    name: 'LifeStraw Personal Water Filter',
    category: 'gear',
    price: 29.99,
    timeBonus: 32, // 4 units = 32 hours
    description: 'Removes 99.9% of waterborne bacteria and parasites',
    isAffiliate: true,
    affiliateUrl: 'https://lifestraw.com',
    rating: 4.8,
    verified: true
  },
  {
    id: 'first_aid_kit_premium',
    name: 'Premium First Aid Kit',
    category: 'gear',
    price: 89.99,
    timeBonus: 48, // 6 units = 48 hours
    description: 'Complete emergency medical supplies for survival situations',
    isAffiliate: true,
    affiliateUrl: 'https://example.com/first-aid',
    rating: 4.9,
    verified: true
  },
  {
    id: 'emergency_shelter',
    name: 'Emergency Bivvy Shelter',
    category: 'gear',
    price: 45.99,
    timeBonus: 40, // 5 units = 40 hours
    description: 'Lightweight emergency shelter that retains 90% body heat',
    isAffiliate: true,
    rating: 4.6,
    verified: true
  },

  // BOOSTERS (IMMEDIATE TIME)
  {
    id: 'time_booster_small',
    name: 'Time Boost (Small)',
    category: 'booster',
    price: 0.99,
    timeBonus: 4, // 0.5 units = 4 hours
    description: 'Instant 4-hour life extension boost',
    isAffiliate: false,
    rating: 5.0,
    verified: true
  },
  {
    id: 'time_booster_large',
    name: 'Time Boost (Large)',
    category: 'booster',
    price: 4.99,
    timeBonus: 24, // 3 units = 24 hours (1 day)
    description: 'Instant 24-hour life extension boost',
    isAffiliate: false,
    rating: 5.0,
    verified: true
  },

  // COURSES (KNOWLEDGE)
  {
    id: 'wilderness_survival_course',
    name: 'Wilderness Survival Masterclass',
    category: 'course',
    price: 199.99,
    timeBonus: 96, // 12 units = 96 hours (4 days)
    description: 'Comprehensive survival training course with certification',
    isAffiliate: true,
    affiliateUrl: 'https://example.com/survival-course',
    rating: 4.9,
    verified: true
  },
  {
    id: 'first_aid_certification',
    name: 'CPR & First Aid Certification',
    category: 'course',
    price: 79.99,
    timeBonus: 48, // 6 units = 48 hours (2 days)
    description: 'Official CPR and First Aid certification course',
    isAffiliate: true,
    rating: 4.8,
    verified: true
  },

  // SUPPLEMENTS (HEALTH)
  {
    id: 'multivitamin_premium',
    name: 'Premium Multivitamin Complex',
    category: 'supplement',
    price: 39.99,
    timeBonus: 16, // 2 units = 16 hours
    description: 'High-quality multivitamin with longevity compounds',
    isAffiliate: true,
    rating: 4.7,
    verified: true
  },
  {
    id: 'omega3_supplement',
    name: 'Omega-3 Fish Oil (Ultra Pure)',
    category: 'supplement',
    price: 29.99,
    timeBonus: 12, // 1.5 units = 12 hours
    description: 'Ultra-pure omega-3 supplement for heart and brain health',
    isAffiliate: true,
    rating: 4.6,
    verified: true
  }
];

// Category mapping
const categoryIcons = {
  gear: Shield,
  booster: Zap,
  course: Book,
  supplement: Pill
};

const categoryColors = {
  gear: 'text-warning',
  booster: 'text-accent',
  course: 'text-secondary',
  supplement: 'text-success'
};

export const TimeMarketplace = () => {
  const { logAction } = useLifeClock();
  const [selectedCategory, setSelectedCategory] = useState<string>('gear');

  // Group products by category
  const productsByCategory = TIME_PRODUCTS.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, TimeProduct[]>);

  const handlePurchase = (product: TimeProduct) => {
    if (product.category === 'booster') {
      // Direct time application for boosters
      const hoursToMinutes = product.timeBonus * 60;
      toast({
        title: "Time Boost Applied!",
        description: `+${product.timeBonus} hours added to your life clock`,
        variant: "default"
      });
      // In real implementation, this would apply the time directly to the life clock
      return;
    }

    if (product.isAffiliate && product.affiliateUrl) {
      // Open affiliate link
      window.open(product.affiliateUrl, '_blank');
      toast({
        title: "Redirecting to Purchase",
        description: `Opening ${product.name} purchase page. Time will be added after verified purchase.`,
        variant: "default"
      });
    } else {
      // Log appropriate action for the product
      const actionMapping = {
        'first_aid_kit_premium': 'buy_survival_kit_tier2',
        'water_filter_tier1': 'buy_survival_kit_tier1',
        'wilderness_survival_course': 'attend_survival_training_verified',
        'first_aid_certification': 'complete_first_aid_course_verified'
      };

      const actionId = actionMapping[product.id as keyof typeof actionMapping];
      if (actionId) {
        logAction(actionId, 'verified');
      } else {
        toast({
          title: "Purchase Simulated",
          description: `${product.name} would add ${product.timeBonus} hours to your life clock`,
          variant: "default"
        });
      }
    }
  };

  const formatTimeBonus = (hours: number): string => {
    if (hours >= 24) {
      const days = Math.round(hours / 24 * 10) / 10;
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  const categories = Object.keys(productsByCategory);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-playfair">
          <ShoppingCart className="w-6 h-6 text-primary" />
          Time Marketplace
          <Badge variant="secondary" className="ml-2">
            Buy Time
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 w-full mb-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex items-center gap-1 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {productsByCategory[category].map((product) => {
                const Icon = categoryIcons[product.category];

                return (
                  <div 
                    key={product.id}
                    className="p-4 rounded-lg border bg-card/50 border-primary/20 hover:border-primary/40 hover:bg-card/70 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", categoryColors[product.category])} />
                          <span className="font-semibold text-sm">{product.name}</span>
                          {product.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {product.description}
                        </p>

                        {/* Product Details */}
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{product.rating}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-success">
                            <Clock className="w-3 h-3" />
                            <span>+{formatTimeBonus(product.timeBonus)}</span>
                          </div>

                          {product.isAffiliate && (
                            <Badge variant="outline" className="text-xs">
                              <ExternalLink className="w-2 h-2 mr-1" />
                              Affiliate
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Purchase Section */}
                      <div className="text-right space-y-2">
                        <div className="text-lg font-bold">
                          ${product.price}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(product)}
                          className="w-full"
                        >
                          {product.category === 'booster' ? 'Buy Boost' : 'Purchase'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Affiliate Disclosure */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg text-xs text-center text-muted-foreground">
          Some products are affiliate links. Purchases help support BeatDeath development.
          Time bonuses are applied after verified purchase completion.
        </div>
      </CardContent>
    </Card>
  );
};