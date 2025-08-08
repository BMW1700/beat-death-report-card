import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Users, TrendingUp, Skull, Share, Timer } from "lucide-react";
import { toast } from "sonner";

const VIRAL_CHALLENGES = [
  {
    id: 1,
    title: "Deadliest Kitchen Challenge",
    description: "Scan 5 kitchen items and share your death scores! Tag #KitchenKills",
    reward: "Death Master Badge",
    difficulty: "Easy",
    timeLeft: "2d 14h",
    participants: 12847,
    trending: true
  },
  {
    id: 2,
    title: "Bathroom Death Derby",
    description: "Find the deadliest bathroom item! Winner gets featured!",
    reward: "Viral Star Badge + Feature",
    difficulty: "Medium", 
    timeLeft: "1d 8h",
    participants: 8394,
    trending: true
  },
  {
    id: 3,
    title: "Office Death Hunt",
    description: "Scan office supplies and create a death tier list! Share on social!",
    reward: "Corporate Killer Badge",
    difficulty: "Hard",
    timeLeft: "4d 2h",
    participants: 5672,
    trending: false
  }
];

export const ViralChallengeHub = () => {
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([]);

  const handleJoinChallenge = (challengeId: number) => {
    setJoinedChallenges(prev => [...prev, challengeId]);
    toast.success("Challenge joined! 🔥", {
      description: "Start scanning to climb the leaderboard!"
    });
  };

  const handleShareChallenge = (challenge: any) => {
    const shareText = `Join the ${challenge.title} on BeatDeath! Can you find deadlier items than me? 💀 #BeatDeath #${challenge.title.replace(/\s+/g, '')}`;
    
    if (navigator.share) {
      navigator.share({
        title: challenge.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Challenge shared! 📱");
    }
  };

  return (
    <Card className="glass-card border-destructive/30 danger-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Flame className="w-6 h-6" />
          Viral Death Challenges
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {VIRAL_CHALLENGES.map((challenge) => (
          <div key={challenge.id} className="p-4 rounded-lg bg-card/30 border border-primary/20">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">{challenge.title}</h3>
                  {challenge.trending && (
                    <Badge className="bg-destructive text-destructive-foreground text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      TRENDING
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {challenge.timeLeft}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {challenge.participants.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {challenge.reward}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {joinedChallenges.includes(challenge.id) ? (
                <Button size="sm" variant="outline" className="flex-1" disabled>
                  <Skull className="w-4 h-4 mr-2" />
                  Joined!
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="flex-1 gradient-bg"
                  onClick={() => handleJoinChallenge(challenge.id)}
                >
                  <Skull className="w-4 h-4 mr-2" />
                  Join Challenge
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleShareChallenge(challenge)}
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            New challenges daily! Tag #BeatDeath to go viral 🚀
          </p>
        </div>
      </CardContent>
    </Card>
  );
};