import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trees, AlertTriangle, Compass, Skull, Shield } from "lucide-react";
import { toast } from "sonner";

interface WildernessItem {
  name: string;
  category: 'plant' | 'animal' | 'weather' | 'terrain' | 'water';
  dangerLevel: number;
  immediateAction: string;
  survivalTip: string;
  found: boolean;
}

const wildernessDatabase: WildernessItem[] = [
  {
    name: "Death Cap Mushroom",
    category: "plant",
    dangerLevel: 10,
    immediateAction: "DO NOT CONSUME. Seek immediate medical attention if ingested.",
    survivalTip: "White gills, bulbous base, grows near oak trees. 30g can kill an adult.",
    found: false
  },
  {
    name: "Poison Ivy",
    category: "plant", 
    dangerLevel: 4,
    immediateAction: "Wash with dish soap immediately. Remove contaminated clothing.",
    survivalTip: "Leaves of three, let it be. Urushiol oil remains potent for years.",
    found: false
  },
  {
    name: "Black Widow Spider",
    category: "animal",
    dangerLevel: 7,
    immediateAction: "Apply ice, elevate limb, seek medical attention. Don't panic.",
    survivalTip: "Red hourglass marking. Bites rarely fatal but cause severe pain.",
    found: false
  },
  {
    name: "Flash Flood Zone",
    category: "weather",
    dangerLevel: 9,
    immediateAction: "Get to higher ground immediately. Never drive through flood water.",
    survivalTip: "6 inches of moving water can knock you down. 12 inches can carry away a car.",
    found: false
  },
  {
    name: "Thin Ice",
    category: "terrain",
    dangerLevel: 8,
    immediateAction: "Don't walk on ice less than 4 inches thick. Spread weight if trapped.",
    survivalTip: "Ice picks, rope, and knowledge of self-rescue are essential.",
    found: false
  },
  {
    name: "Stagnant Water",
    category: "water",
    dangerLevel: 6,
    immediateAction: "Boil for 3+ minutes or use purification tablets before drinking.",
    survivalTip: "Giardia, E.coli, and parasites thrive in still water. Always purify.",
    found: false
  }
];

export const WildernessScanner = () => {
  const [scannedItems, setScannedItems] = useState<WildernessItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const simulateWildernessScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const availableItems = wildernessDatabase.filter(item => !scannedItems.some(scanned => scanned.name === item.name));
      if (availableItems.length === 0) {
        toast.success("You've discovered all wilderness dangers! True survivalist! 🏆");
        setIsScanning(false);
        return;
      }

      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      setScannedItems(prev => [randomItem, ...prev.slice(0, 4)]); // Keep last 5 scans
      setScanCount(prev => prev + 1);
      setIsScanning(false);

      if (randomItem.dangerLevel >= 8) {
        toast.error(`🚨 EXTREME DANGER: ${randomItem.name} detected!`);
      } else if (randomItem.dangerLevel >= 6) {
        toast.warning(`⚠️ HIGH RISK: ${randomItem.name} identified!`);
      } else {
        toast.success(`✅ Moderate threat: ${randomItem.name} catalogued.`);
      }
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      plant: "🌿",
      animal: "🐍", 
      weather: "⛈️",
      terrain: "🏔️",
      water: "💧"
    };
    return icons[category as keyof typeof icons] || "⚠️";
  };

  const getDangerColor = (level: number) => {
    if (level >= 8) return "text-destructive";
    if (level >= 6) return "text-warning"; 
    return "text-primary";
  };

  return (
    <Card className="glass-card border-success/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-success">
        <Trees className="w-5 h-5" />
        Wilderness Death Scanner
        <Badge variant="outline" className="ml-auto text-xs">
          {scanCount} discoveries
        </Badge>
      </CardTitle>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Button
            onClick={simulateWildernessScan}
            disabled={isScanning}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold"
          >
            {isScanning ? (
              <>
                <Compass className="w-5 h-5 mr-2 animate-spin" />
                Scanning Environment...
              </>
            ) : (
              <>
                <Trees className="w-5 h-5 mr-2" />
                Scan Wilderness Area
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            🏕️ Identify deadly plants, animals & environmental hazards
          </p>
        </div>

        {scannedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Recent Discoveries
            </div>
            
            {scannedItems.map((item, index) => (
              <div key={`${item.name}-${index}`} className="bg-card/30 rounded-lg p-3 border border-accent/20">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <Badge variant={item.dangerLevel >= 8 ? "destructive" : item.dangerLevel >= 6 ? "secondary" : "default"}>
                        <Skull className="w-3 h-3 mr-1" />
                        {item.dangerLevel}/10
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="bg-destructive/10 border border-destructive/20 rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                          <span className="font-semibold text-destructive">Immediate Action:</span>
                        </div>
                        <p className="text-destructive">{item.immediateAction}</p>
                      </div>
                      
                      <div className="bg-success/10 border border-success/20 rounded p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Shield className="w-3 h-3 text-success" />
                          <span className="font-semibold text-success">Survival Tip:</span>
                        </div>
                        <p className="text-success">{item.survivalTip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="text-center text-xs text-muted-foreground">
            🎯 <span className="font-semibold">Survivalist Pro Tip:</span> Master all 50+ wilderness dangers to unlock expert status
          </div>
        </div>
      </CardContent>
    </Card>
  );
};