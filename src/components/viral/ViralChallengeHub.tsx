import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Users, TrendingUp, Skull, Share, Timer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  participants_count: number | null;
  likes_count: number | null;
  shares_count: number | null;
  trending_score: number | null;
  expires_at: string | null;
  is_featured: boolean | null;
}

export const ViralChallengeHub = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from("viral_challenges")
      .select("*")
      .order("trending_score", { ascending: false })
      .limit(5);

    if (!error && data) {
      setChallenges(data);
    }
    setLoading(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) { toast.error("Sign in to join challenges"); return; }
    setActionLoading(challengeId);
    const { data } = await supabase.rpc("join_viral_challenge", { p_challenge_id: challengeId });
    if (data) {
      setJoinedChallenges(prev => [...prev, challengeId]);
      setChallenges(prev => prev.map(c => c.id === challengeId ? { ...c, participants_count: (c.participants_count || 0) + 1 } : c));
      toast.success("Challenge joined! 🔥");
    }
    setActionLoading(null);
  };

  const handleShareChallenge = async (challenge: Challenge) => {
    const shareText = `Join the ${challenge.title} on BeatDeath! 💀 #BeatDeath`;
    if (navigator.share) {
      navigator.share({ title: challenge.title, text: shareText, url: window.location.href });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Challenge link copied! 📱");
    }
    if (user) {
      await supabase.rpc("share_viral_challenge", { p_challenge_id: challenge.id });
      setChallenges(prev => prev.map(c => c.id === challenge.id ? { ...c, shares_count: (c.shares_count || 0) + 1 } : c));
    }
  };

  const getTimeLeft = (expiresAt: string | null) => {
    if (!expiresAt) return "No limit";
    const d = new Date(expiresAt);
    return d > new Date() ? formatDistanceToNow(d, { addSuffix: false }) + " left" : "Expired";
  };

  if (loading) {
    return (
      <Card className="glass-card border-destructive/30">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (challenges.length === 0) {
    return (
      <Card className="glass-card border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Flame className="w-6 h-6" />
            Viral Death Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No active challenges yet. Be the first to create one!</p>
        </CardContent>
      </Card>
    );
  }

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
        {challenges.map((challenge) => (
          <div key={challenge.id} className="p-4 rounded-lg bg-card/30 border border-primary/20">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">{challenge.title}</h3>
                  {(challenge.trending_score || 0) > 10 && (
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
                    {getTimeLeft(challenge.expires_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {(challenge.participants_count || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {challenge.challenge_type}
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
                  disabled={actionLoading === challenge.id}
                >
                  {actionLoading === challenge.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Skull className="w-4 h-4 mr-2" />
                  )}
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
