import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink, Shield, Zap, Award, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface GearItem {
  id: string;
  name: string;
  category: 'first-aid' | 'water' | 'fire' | 'tools' | 'food' | 'shelter';
  price: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  affiliate: boolean;
  urgency?: string;
  image: string;
}

const survivalGear: GearItem[] = [
  {
    id: "1",
    name: "LifeStraw Personal Water Filter",
    category: "water",
    price: "$24.99",
    rating: 4.8,
    reviews: 15642,
    badge: "BeatDeath Approved",
    description: "Filters 99.9% of bacteria & parasites. Essential for wilderness survival.",
    affiliate: true,
    urgency: "42% off today only!",
    image: "🚰"
  },
  {
    id: "2", 
    name: "Tactical First Aid Kit",
    category: "first-aid",
    price: "$89.99",
    rating: 4.9,
    reviews: 8234,
    badge: "Emergency Essential",
    description: "Military-grade medical supplies. Could save your life in critical situations.",
    affiliate: true,
    image: "🏥"
  },
  {
    id: "3",
    name: "Fire Steel Starter Kit",
    category: "fire", 
    price: "$19.99",
    rating: 4.7,
    reviews: 5678,
    badge: "Survivalist Choice",
    description: "Works in all weather. 12,000+ strikes guaranteed. Never rely on matches again.",
    affiliate: true,
    image: "🔥"
  },
  {
    id: "4",
    name: "Emergency Food Rations (30-day)",
    category: "food",
    price: "$199.99", 
    rating: 4.6,
    reviews: 3456,
    badge: "Prepper Favorite",
    description: "25-year shelf life. 2000 calories/day. Ready for any disaster.",
    affiliate: true,
    urgency: "Back in stock!",
    image: "🥫"
  },
  {
    id: "5",
    name: "Multi-Tool Survival Knife", 
    category: "tools",
    price: "$59.99",
    rating: 4.8,
    reviews: 9876,
    badge: "Essential Tool",
    description: "15 functions in one. Built to last. Every survivalist needs this.",
    affiliate: true,
    image: "🔪"
  },
  {
    id: "6",
    name: "Emergency Shelter Tent",
    category: "shelter",
    price: "$129.99",
    rating: 4.5,
    reviews: 2341,
    description: "Ultralight. Weatherproof. Sets up in 60 seconds. Your life may depend on shelter.",
    affiliate: true,
    image: "⛺"
  }
];

const categoryIcons = {
  'first-aid': Shield,
  'water': '💧',
  'fire': '🔥', 
  'tools': '🔧',
  'food': '🍽️',
  'shelter': '🏠'
};

const categoryColors = {
  'first-aid': 'text-destructive',
  'water': 'text-blue-400',
  'fire': 'text-orange-400',
  'tools': 'text-gray-400',
  'food': 'text-green-400',
  'shelter': 'text-purple-400'
};

export const SurvivalGearMarketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePurchase = (item: GearItem) => {
    // Simulate affiliate click tracking
    toast.success(`Opening ${item.name} purchase page...`);
    
    // In a real implementation, this would track the affiliate click
    // and redirect to the actual product page
    console.log(`Affiliate link clicked: ${item.name}`);
    
    // Simulate opening external link (in real app, would be actual affiliate URL)
    setTimeout(() => {
      toast.info("Affiliate partner opened! Happy shopping! 🛒");
    }, 1000);
  };

  const filteredGear = selectedCategory 
    ? survivalGear.filter(item => item.category === selectedCategory)
    : survivalGear;

  const categories = Array.from(new Set(survivalGear.map(item => item.category)));

  return (
    <Card className="glass-card border-warning/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-warning">
        <ShoppingCart className="w-5 h-5" />
        Survival Gear Store
        <Badge variant="outline" className="ml-auto text-xs text-success">
          💰 Earn Commission
        </Badge>
      </CardTitle>
      
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="text-xs"
          >
            All Gear
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="text-xs capitalize"
            >
              {category.replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Gear Grid */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredGear.map((item) => (
            <div
              key={item.id}
              className="bg-card/30 rounded-lg p-3 border border-accent/20 hover:border-primary/30 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm leading-tight">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {item.rating} ({item.reviews.toLocaleString()})
                          </span>
                        </div>
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
                            <Award className="w-2 h-2 mr-1" />
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{item.price}</div>
                      {item.urgency && (
                        <div className="text-xs text-destructive font-medium">
                          {item.urgency}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${categoryColors[item.category]}`}
                    >
                      {item.category.replace('-', ' ')}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(item)}
                      className="text-xs gradient-bg hover:scale-105 transition-transform"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-warning mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <div className="font-medium text-warning mb-1">Affiliate Disclosure</div>
              <p>We earn commission from purchases through these links. All recommendations are based on survival value and user reviews. Prices may vary.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};