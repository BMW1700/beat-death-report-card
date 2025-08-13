import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Camera, Trophy, Zap, Users, Target } from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  itemName: string;
  deathRating: number;
  survivalTips: string[];
}

interface ViralSharingHubProps {
  scanResult?: ScanResult;
}

export const ViralSharingHub = ({ scanResult }: ViralSharingHubProps) => {
  const [shareCount, setShareCount] = useState(0);

  const generateShareContent = (type: 'achievement' | 'challenge' | 'streak') => {
    const templates = {
      achievement: [
        "🏆 Just survived scanning {item}! Death rating: {rating}/10. I'm getting better at beating death! #BeatDeath #SurvivalMode",
        "💀 Scanned {item} and lived to tell about it! My survival IQ is rising. Who's next? #BeatDeath #StayAlive",
        "🎯 {item} tried to kill me but I'm still here! Death rating: {rating}/10. Your turn! #BeatDeath #CantTouchThis"
      ],
      challenge: [
        "🔥 DEATH CHALLENGE: I just scanned {item} (death rating {rating}/10). Can you beat my survival score? #BeatDeathChallenge",
        "💪 Challenge accepted! Scanned {item} and survived. Who's brave enough to scan something deadlier? #BeatDeath #YourTurn",
        "⚡ Survival challenge: I scanned {item}. Tag 3 friends who think they're more survivable than me! #BeatDeathChallenge"
      ],
      streak: [
        "🔥 Day {streak} of beating death! Today's victim: {item}. My survival streak is unbreakable! #BeatDeath #SurvivalStreak",
        "💀 Survival streak: {streak} days! Just scanned {item} and I'm still alive. Death can't touch me! #BeatDeath #Immortal",
        "🎯 {streak}-day survival streak! Latest scan: {item}. I'm becoming unstoppable! #BeatDeath #StreakMaster"
      ]
    };

    const template = templates[type][Math.floor(Math.random() * templates[type].length)];
    return template
      .replace('{item}', scanResult?.itemName || 'a mysterious object')
      .replace('{rating}', scanResult?.deathRating?.toString() || '8')
      .replace('{streak}', Math.floor(Math.random() * 50 + 1).toString());
  };

  const shareContent = async (type: 'achievement' | 'challenge' | 'streak') => {
    const content = generateShareContent(type);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "BeatDeath - Survival Challenge",
          text: content,
          url: window.location.href,
        });
        setShareCount(prev => prev + 1);
        toast.success("Shared successfully! 🚀");
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(content + " " + window.location.href);
      setShareCount(prev => prev + 1);
      toast.success("Content copied to clipboard! 📋");
    }
  };

  const viralChallenges = [
    {
      title: "Death Duel",
      description: "Challenge friends to scan the same item",
      icon: Target,
      action: () => shareContent('challenge')
    },
    {
      title: "Survival Streak",
      description: "Show off your consecutive scanning days",
      icon: Zap,
      action: () => shareContent('streak')
    },
    {
      title: "Achievement Flex",
      description: "Brag about surviving your latest scan",
      icon: Trophy,
      action: () => shareContent('achievement')
    }
  ];

  return (
    <Card className="glass-card border-primary/30 viral-glow">
      <CardTitle className="p-3 flex items-center gap-2 text-primary">
        <Share2 className="w-5 h-5" />
        Go Viral 🚀
        <span className="ml-auto text-xs text-muted-foreground">{shareCount} shares</span>
      </CardTitle>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {viralChallenges.map((challenge) => {
            const IconComponent = challenge.icon;
            return (
              <Button
                key={challenge.title}
                variant="outline"
                onClick={challenge.action}
                className="flex items-center gap-3 p-3 h-auto text-left border-accent/20 hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <IconComponent className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{challenge.title}</div>
                  <div className="text-xs text-muted-foreground">{challenge.description}</div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="bg-card/30 rounded-lg p-3 border border-warning/20">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-warning">TikTok Ready</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Auto-generate viral content for TikTok, Instagram & Twitter with one tap!
          </p>
          <Button 
            size="sm" 
            onClick={() => shareContent('achievement')}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 transition-transform"
          >
            <Users className="w-3 h-3 mr-1" />
            Create Viral Post
          </Button>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            💀 Join 500K+ survivors sharing their death-defying moments
          </div>
        </div>
      </CardContent>
    </Card>
  );
};