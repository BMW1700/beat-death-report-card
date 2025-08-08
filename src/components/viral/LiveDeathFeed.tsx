import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, Clock, Skull, Flame, Trophy, Share } from "lucide-react";
import { toast } from "sonner";

interface DeathScan {
  id: string;
  user: string;
  item: string;
  deathScore: number;
  location: string;
  timeAgo: string;
  reactions: number;
  trending: boolean;
}

const MOCK_SCANS: DeathScan[] = [
  {
    id: "1",
    user: "DeathSeeker92",
    item: "Kitchen Knife",
    deathScore: 98,
    location: "Los Angeles, CA",
    timeAgo: "2m ago",
    reactions: 47,
    trending: true
  },
  {
    id: "2", 
    user: "ToxicHunter",
    item: "Tide Pods",
    deathScore: 95,
    location: "New York, NY", 
    timeAgo: "5m ago",
    reactions: 31,
    trending: true
  },
  {
    id: "3",
    user: "MorbidMike",
    item: "Coffee Mug",
    deathScore: 12,
    location: "Austin, TX",
    timeAgo: "8m ago", 
    reactions: 8,
    trending: false
  },
  {
    id: "4",
    user: "DangerousDeeDee",
    item: "Hair Dryer",
    deathScore: 73,
    location: "Miami, FL",
    timeAgo: "12m ago",
    reactions: 23,
    trending: false
  },
  {
    id: "5",
    user: "ReaperRecon",
    item: "Toothbrush",
    deathScore: 8,
    location: "Seattle, WA", 
    timeAgo: "15m ago",
    reactions: 3,
    trending: false
  }
];

export const LiveDeathFeed = () => {
  const [scans, setScans] = useState<DeathScan[]>(MOCK_SCANS);
  const [reacted, setReacted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new scans coming in
      const newScan: DeathScan = {
        id: Date.now().toString(),
        user: `User${Math.floor(Math.random() * 1000)}`,
        item: ["Banana", "Phone Charger", "Pencil", "Water Bottle", "Laptop"][Math.floor(Math.random() * 5)],
        deathScore: Math.floor(Math.random() * 100),
        location: ["Global", "USA", "UK", "Canada", "Australia"][Math.floor(Math.random() * 5)],
        timeAgo: "Just now",
        reactions: 0,
        trending: Math.random() > 0.7
      };
      
      setScans(prev => [newScan, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleReact = (scanId: string) => {
    if (reacted.has(scanId)) return;
    
    setScans(prev => prev.map(scan => 
      scan.id === scanId 
        ? { ...scan, reactions: scan.reactions + 1 }
        : scan
    ));
    
    setReacted(prev => new Set([...prev, scanId]));
    toast.success("💀 Reaction added!");
  };

  const handleShare = (scan: DeathScan) => {
    const shareText = `${scan.user} just scanned "${scan.item}" and got a death score of ${scan.deathScore}/100! 💀 Can you beat it? #BeatDeath`;
    
    if (navigator.share) {
      navigator.share({
        title: "BeatDeath Scan",
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Scan shared! 📱");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-red-400";
    if (score >= 70) return "text-orange-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 30) return "text-blue-400";
    return "text-green-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-red-900/30 border-red-500/30";
    if (score >= 70) return "bg-orange-900/30 border-orange-500/30";
    if (score >= 50) return "bg-yellow-900/30 border-yellow-500/30";
    if (score >= 30) return "bg-blue-900/30 border-blue-500/30";
    return "bg-green-900/30 border-green-500/30";
  };

  return (
    <Card className="glass-card border-primary/30 purple-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Activity className="w-6 h-6" />
          Live Death Feed
          <Badge className="bg-primary/20 text-primary border-primary/30">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {scans.map((scan) => (
            <div key={scan.id} className="p-3 rounded-lg bg-card/30 border border-primary/20 hover:bg-card/40 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-foreground">{scan.user}</span>
                    {scan.trending && (
                      <Badge className="bg-destructive text-destructive-foreground text-xs">
                        <Flame className="w-3 h-3 mr-1" />
                        HOT
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground">scanned</span>
                    <span className="font-medium text-foreground">"{scan.item}"</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold border ${getScoreBg(scan.deathScore)}`}>
                  <span className={getScoreColor(scan.deathScore)}>{scan.deathScore}/100</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {scan.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {scan.timeAgo}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleReact(scan.id)}
                    disabled={reacted.has(scan.id)}
                    className="h-6 px-2 text-xs"
                  >
                    <Skull className="w-3 h-3 mr-1" />
                    {scan.reactions}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleShare(scan)}
                    className="h-6 px-2 text-xs"
                  >
                    <Share className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4 pt-3 border-t border-primary/20">
          <p className="text-xs text-muted-foreground">
            🔴 Live updates from death scanners worldwide
          </p>
        </div>
      </CardContent>
    </Card>
  );
};