import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Clock, 
  Star, 
  Zap, 
  Shield, 
  Heart,
  TrendingUp,
  Package,
  ExternalLink
} from 'lucide-react';
import { useLifeClock } from '@/contexts/LifeClockContext';
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";

interface TimeProduct {
  id: string;
  name: string;
  category: 'gear' | 'booster' | 'course' | 'supplement';
  price: number;
  timeBonus: number; // minutes
  description: string;
  isAffiliate: boolean;
  rating: number;
  image: string;
  verified: boolean;
}

const TIME_PRODUCTS: TimeProduct[] = [
  {
    id: 'survival_kit_pro',
    name: 'Professional Survival Kit',
    category: 'gear',
    price: 89.99,
    timeBonus: 180, // 3 hours
    description: 'Complete 72-hour survival kit with emergency food, water purification, and medical supplies.',
    isAffiliate: true,
    rating: 4.8,
    image: '🎒',
    verified: true
  },
  {
    id: 'first_aid_certified',
    name: 'CPR/First Aid Certification',
    category: 'course',
    price: 45.00,
    timeBonus: 2160, // 36 hours
    description: 'Official Red Cross certification course. Learn life-saving skills.',
    isAffiliate: false,
    rating: 4.9,
    image: '🚑',
    verified: true
  },
  {
    id: 'time_booster_premium',
    name: 'Life Extension Booster',
    category: 'booster',
    price: 9.99,
    timeBonus: 60, // 1 hour
    description: 'Premium digital booster. Instant life clock bonus!',
    isAffiliate: false,
    rating: 4.2,
    image: '⚡',
    verified: false
  },
  {
    id: 'fitness_tracker_pro',
    name: 'Advanced Fitness Tracker',
    category: 'gear',
    price: 199.99,
    timeBonus: 120, // 2 hours
    description: 'Track your health metrics 24/7. Sync with Beat Death for automatic action logging.',
    isAffiliate: true,
    rating: 4.7,
    image: '⌚',
    verified: true
  },
  {
    id: 'multivitamin_premium',
    name: 'Longevity Supplement Pack',
    category: 'supplement',
    price: 39.99,
    timeBonus: 30, // 30 minutes
    description: 'Science-backed supplements for longevity. Monthly subscription.',
    isAffiliate: true,
    rating: 4.5,
    image: '💊',
    verified: true
  },
  {
    id: 'survival_training',
    name: 'Wilderness Survival Course',
    category: 'course',
    price: 149.99,
    timeBonus: 1440, // 24 hours
    description: 'Online wilderness survival training. Learn to thrive in any environment.',
    isAffiliate: true,
    rating: 4.6,
    image: '🏕️',
    verified: true
  }
];

const categoryIcons = {
  gear: Package,
  booster: Zap,
  course: TrendingUp,
  supplement: Heart
};

const categoryColors = {
  gear: 'text-warning',
  booster: 'text-accent',
  course: 'text-primary',
  supplement: 'text-success'
};

export const TimeMarketplace = () => {
  const { logAction } = useLifeClock();
  const [selectedCategory, setSelectedCategory] = useState('gear');

  // Group products by category
  const productsByCategory = TIME_PRODUCTS.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, TimeProduct[]>);

  const handlePurchase = (product: TimeProduct) => {
    if (product.category === 'booster') {
      // Digital booster - immediate time bonus
      // For demo, we'll log a custom action
      toast({
        title: "Booster Activated!",
        description: `+${product.timeBonus} minutes added to your life clock!`,
        variant: "default"
      });
      
      // TODO: Add custom time bonus logic here
      console.log(`Adding ${product.timeBonus} minutes from booster: ${product.name}`);
    } else {
      // Physical product or course - simulate affiliate link
      toast({
        title: "Redirecting...",
        description: `Opening ${product.name} purchase page`,
        variant: "default"
      });
      
      // Log the preparedness action
      if (product.category === 'gear') {
        logAction('buy_survival_kit_tier1', 'self');
      } else if (product.category === 'course') {
        logAction('complete_first_aid_course_verified', 'verified');
      }
      
      // Simulate opening affiliate link
      setTimeout(() => {
        toast({
          title: "Time Bonus Credited!",
          description: `+${product.timeBonus} minutes pending purchase verification`,
          variant: "default"
        });
      }, 1000);
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.round(minutes / 60 * 10) / 10;
    return `${hours}h`;
  };

  const categories = Object.keys(productsByCategory);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-playfair">
          <ShoppingCart className="w-6 h-6 text-primary" />
          Time Marketplace
          <Badge variant="outline" className="ml-2">
            Earn Life Time
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Buy products that extend your life clock. Affiliate purchases support Beat Death development.
        </p>
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
                  {category}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {productsByCategory[category].map((product) => {
                const Icon = categoryIcons[product.category];
                
                return (
                  <div 
                    key={product.id}
                    className="p-4 rounded-lg border border-primary/20 bg-card/30 hover:bg-card/50 transition-all duration-200 hover:border-primary/40"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="text-3xl">{product.image}</div>
                      
                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{product.name}</span>
                              {product.verified && (
                                <Shield className="w-3 h-3 text-success" />
                              )}
                              {product.isAffiliate && (
                                <Badge variant="outline" className="text-xs">
                                  Affiliate
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 text-warning fill-current" />
                              <span className="text-xs text-muted-foreground">
                                {product.rating}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">${product.price}</div>
                            <div className="flex items-center gap-1 text-success text-sm">
                              <Clock className="w-3 h-3" />
                              +{formatTime(product.timeBonus)}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {product.description}
                        </p>
                        
                        <Button 
                          size="sm"
                          onClick={() => handlePurchase(product)}
                          className="w-full"
                        >
                          {product.category === 'booster' ? 'Activate Booster' : 'Buy & Earn Time'}
                          <ExternalLink className="w-3 h-3 ml-2" />
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
        <div className="mt-4 p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground text-center">
          <Shield className="w-3 h-3 inline mr-1" />
          Affiliate partnerships help fund Beat Death development. 
          Time bonuses are applied after purchase verification.
        </div>
      </CardContent>
    </Card>
  );
};