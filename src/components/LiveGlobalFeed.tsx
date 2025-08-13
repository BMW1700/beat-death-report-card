import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, MapPin, Skull, Clock, Users, Zap } from "lucide-react";
import { toast } from "sonner";

interface ScanActivity {
  id: string;
  username: string;
  location: string;
  item: string;
  deathRating: number;
  timeAgo: string;
  avatar: string;
  survived: boolean;
}

const generateRandomActivity = (): ScanActivity => {
  const usernames = [
    "SurvivalKing42", "DeathDefier", "ToxinHunter", "SafetyFirst", "WildernessWolf", 
    "PrepperPro", "LifeHacker", "DangerSeeker", "CautionMaster", "RiskTaker99",
    "SurvivalistSam", "DeathBeatr", "SafeScanner", "ThrillSeeker", "LifeSaver"
  ];
  
  const locations = [
    "New York", "Los Angeles", "London", "Tokyo", "Sydney", "Berlin",
    "Toronto", "Miami", "Seattle", "Austin", "Denver", "Portland"
  ];
  
  const items = [
    "Bleach bottle", "Raw chicken", "Death cap mushroom", "Battery acid", 
    "Moldy bread", "Expired medicine", "Cleaning chemicals", "Wild berries",
    "Rusty nail", "Unknown pills", "Household ammonia", "Old meat",
    "Energy drink", "Supplement powder", "Protein bar", "Vitamin bottle"
  ];

  const avatars = ["🧑‍💼", "👩‍🔬", "🧑‍🎓", "👨‍🏭", "👩‍⚕️", "🧑‍🍳", "👨‍🎨", "👩‍🚒"];

  return {
    id: Math.random().toString(36).substr(2, 9),
    username: usernames[Math.floor(Math.random() * usernames.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    item: items[Math.floor(Math.random() * items.length)],
    deathRating: Math.floor(Math.random() * 10) + 1,
    timeAgo: `${Math.floor(Math.random() * 59) + 1}m ago`,
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
    survived: Math.random() > 0.3 // 70% survival rate
  };
};

export const LiveGlobalFeed = () => {
  const [activities, setActivities] = useState<ScanActivity[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [totalScans, setTotalScans] = useState(127843);

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 8 }, generateRandomActivity);
    setActivities(initialActivities);

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        const newActivity = generateRandomActivity();
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10
        setTotalScans(prev => prev + 1);
        
        // Show toast for high-danger scans
        if (newActivity.deathRating >= 8) {
          toast.error(`🚨 ${newActivity.username} just scanned ${newActivity.item} (${newActivity.deathRating}/10 danger)!`);
        }
      }
    }, 3000 + Math.random() * 4000); // 3-7 second intervals

    return () => clearInterval(interval);
  }, [isLive]);

  const getDangerColor = (rating: number) => {
    if (rating >= 8) return "text-destructive";
    if (rating >= 6) return "text-warning";
    return "text-success";
  };

  const getDangerBadge = (rating: number) => {
    if (rating >= 8) return "destructive";
    if (rating >= 6) return "secondary";
    return "default";
  };

  return (
    <Card className="glass-card border-primary/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-primary">
        <Activity className={`w-5 h-5 ${isLive ? 'animate-pulse' : ''}`} />
        Live Global Scans
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {totalScans.toLocaleString()}
          </Badge>
          <Button
            size="sm"
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
            className="text-xs px-2 py-1"
          >
            {isLive ? "🔴 LIVE" : "⏸️ PAUSED"}
          </Button>
        </div>
      </CardTitle>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-card/30 rounded-lg p-3 border border-accent/20 hover:border-primary/30 transition-colors animate-fade-in"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{activity.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground truncate">
                    {activity.username}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {activity.timeAgo}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Scanned:</span>
                  <span className="font-medium text-foreground">{activity.item}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getDangerBadge(activity.deathRating)}>
                    <Skull className="w-3 h-3 mr-1" />
                    {activity.deathRating}/10
                  </Badge>
                  {activity.survived ? (
                    <Badge variant="outline" className="text-success border-success/50">
                      ✅ Survived
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-destructive border-destructive/50">
                      💀 RIP
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Waiting for global scan activity...</p>
          </div>
        )}
      </CardContent>
      
      <div className="px-3 pb-3">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-primary" />
            <span>Join the global survival community! Your scans appear here live.</span>
          </div>
        </div>
      </div>
    </Card>
  );
};