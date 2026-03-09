
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Trophy, Skull, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type LeaderboardEntry = {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  total_xp: number;
  survival_streak: number;
  rank: number;
};

export const CommunityLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardType, setLeaderboardType] = useState<'xp' | 'streak'>('xp');
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
    
    // Set up real-time subscription for leaderboard updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leaderboardType]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const orderBy = leaderboardType === 'xp' ? 'total_xp' : 'survival_streak';
      
      const { data, error } = await supabase
        .from('profiles_public')
        .select('user_id, display_name, username, total_xp, survival_streak')
        .order(orderBy, { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      const leaderboardWithRanks = data?.map((entry, index) => ({
        ...entry,
        id: entry.user_id || `rank-${index}`,
        rank: index + 1
      })) || [];

      setLeaderboard(leaderboardWithRanks);
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-4 h-4 text-orange-600" />;
    return <Target className="w-4 h-4 text-muted-foreground" />;
  };

  const getScoreDisplay = (entry: LeaderboardEntry) => {
    return leaderboardType === 'xp' 
      ? `${entry.total_xp} XP`
      : `${entry.survival_streak} days`;
  };

  return (
    <Card className="glass-card hover:purple-glow transition-all duration-300">
      <CardTitle className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Users className="w-5 h-5" />
          Community Leaders
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setLeaderboardType('xp')}
            className={`text-xs px-2 py-1 rounded ${
              leaderboardType === 'xp' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            XP
          </button>
          <button
            onClick={() => setLeaderboardType('streak')}
            className={`text-xs px-2 py-1 rounded ${
              leaderboardType === 'streak' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Streak
          </button>
        </div>
      </CardTitle>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="w-8 h-5 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Skull className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No survivors yet...</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div 
              key={entry.id} 
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                entry.user_id === user?.id 
                  ? 'bg-primary/20 border border-primary/30' 
                  : 'bg-card/30 hover:bg-card/50'
              }`}
            >
              <div className="flex items-center gap-2 w-8">
                {getRankIcon(entry.rank)}
                <span className="font-bold text-primary text-sm">{entry.rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {entry.display_name || entry.username}
                </div>
                {entry.username && entry.display_name && (
                  <div className="text-xs text-muted-foreground">@{entry.username}</div>
                )}
              </div>
              <span className="text-success font-mono text-sm whitespace-nowrap">
                {getScoreDisplay(entry)}
              </span>
              {entry.user_id === user?.id && (
                <span className="text-xs text-primary font-medium">You</span>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
