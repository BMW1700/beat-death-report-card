import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, Users, Target, Zap, Globe, TrendingUp, Trophy } from "lucide-react";
import { toast } from "sonner";

interface DeathHotspot {
  id: string;
  location: string;
  country: string;
  deadliestItem: string;
  avgDeathScore: number;
  totalScans: number;
  trending: boolean;
  topScanner: string;
}

const DEATH_HOTSPOTS: DeathHotspot[] = [
  {
    id: "1",
    location: "Tokyo, Japan",
    country: "🇯🇵",
    deadliestItem: "Fugu Knife",
    avgDeathScore: 94,
    totalScans: 1847,
    trending: true,
    topScanner: "TokyoReaper"
  },
  {
    id: "2",
    location: "London, UK", 
    country: "🇬🇧",
    deadliestItem: "Tea Kettle",
    avgDeathScore: 78,
    totalScans: 1456,
    trending: false,
    topScanner: "BritishBane"
  },
  {
    id: "3",
    location: "New York, USA",
    country: "🇺🇸", 
    deadliestItem: "Subway Rat",
    avgDeathScore: 89,
    totalScans: 2134,
    trending: true,
    topScanner: "NYCSlayer"
  },
  {
    id: "4",
    location: "Mumbai, India",
    country: "🇮🇳",
    deadliestItem: "Street Food",
    avgDeathScore: 85,
    totalScans: 987,
    trending: false,
    topScanner: "BombayBomber"
  },
  {
    id: "5",
    location: "Sydney, Australia",
    country: "🇦🇺",
    deadliestItem: "Drop Bear",
    avgDeathScore: 99,
    totalScans: 743,
    trending: true,
    topScanner: "AussieAnnih"
  }
];

const GLOBAL_CHALLENGES = [
  {
    title: "Global Kitchen Wars",
    description: "Which country has the deadliest kitchen?",
    participants: 45203,
    timeLeft: "3d 12h"
  },
  {
    title: "Bathroom Battle Royale",
    description: "International bathroom death competition",
    participants: 28967,
    timeLeft: "1d 6h"
  }
];

export const CollaborativeDeathMap = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [userContribution, setUserContribution] = useState(0);

  const handleContribute = (hotspotId: string) => {
    setUserContribution(prev => prev + 1);
    toast.success("📍 Contribution added!", {
      description: "Your scan has been added to the global death map!"
    });
  };

  const handleJoinGlobalChallenge = (challenge: any) => {
    toast.success("🌍 Joined global challenge!", {
      description: `Represent your country in ${challenge.title}!`
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-red-400";
    if (score >= 80) return "text-orange-400";
    if (score >= 70) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <Card className="glass-card border-success/30 success-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-success">
          <Globe className="w-6 h-6" />
          Global Death Map
          <Badge className="bg-success/20 text-success border-success/30">COLLABORATIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Challenges */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Global Challenges
          </h3>
          {GLOBAL_CHALLENGES.map((challenge, index) => (
            <div key={index} className="p-3 rounded-lg bg-card/30 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-sm text-foreground">{challenge.title}</div>
                  <div className="text-xs text-muted-foreground">{challenge.description}</div>
                </div>
                <Button size="sm" className="gradient-bg">
                  Join
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {challenge.participants.toLocaleString()} participants
                </div>
                <div>{challenge.timeLeft} left</div>
              </div>
            </div>
          ))}
        </div>

        {/* Death Hotspots */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Map className="w-4 h-4" />
            Death Hotspots Worldwide
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {DEATH_HOTSPOTS.map((hotspot) => (
              <div 
                key={hotspot.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedHotspot === hotspot.id 
                    ? "bg-primary/20 border-primary/50" 
                    : "bg-card/30 border-primary/20 hover:bg-card/40"
                }`}
                onClick={() => setSelectedHotspot(hotspot.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{hotspot.country}</span>
                    <div>
                      <div className="font-medium text-sm text-foreground">{hotspot.location}</div>
                      <div className="text-xs text-muted-foreground">
                        Top killer: {hotspot.deadliestItem}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${getScoreColor(hotspot.avgDeathScore)}`}>
                      {hotspot.avgDeathScore}/100
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {hotspot.totalScans} scans
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hotspot.trending && (
                      <Badge className="bg-destructive text-destructive-foreground text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        TRENDING
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Leader: {hotspot.topScanner}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContribute(hotspot.id);
                    }}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    Add Scan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Stats */}
        <div className="p-3 rounded-lg bg-success/10 border border-success/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm text-foreground">Your Global Impact</div>
              <div className="text-xs text-muted-foreground">Scans contributed to the map</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-success">{userContribution}</div>
              <div className="text-xs text-muted-foreground">contributions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};