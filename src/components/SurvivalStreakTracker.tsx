import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Calendar, Target, Trophy, Clock, Zap } from "lucide-react";
import { toast } from "sonner";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalScans: number;
  lastScanDate: string;
  weeklyGoal: number;
  weeklyProgress: number;
  achievements: string[];
}

export const SurvivalStreakTracker = () => {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 7,
    longestStreak: 23,
    totalScans: 156,
    lastScanDate: new Date().toISOString().split('T')[0],
    weeklyGoal: 10,
    weeklyProgress: 7,
    achievements: ["Week Warrior", "Death Defier", "Scan Master"]
  });
  
  const [todayScanned, setTodayScanned] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState("");

  useEffect(() => {
    // Calculate time until streak reset (midnight)
    const updateTimeUntilReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleScanToday = () => {
    if (todayScanned) {
      toast.info("You've already scanned today! Come back tomorrow to continue your streak.");
      return;
    }

    setTodayScanned(true);
    setStreak(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      totalScans: prev.totalScans + 1,
      weeklyProgress: Math.min(prev.weeklyProgress + 1, prev.weeklyGoal),
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1)
    }));

    const newStreak = streak.currentStreak + 1;
    
    if (newStreak % 7 === 0) {
      toast.success(`🔥 ${newStreak} day streak! You're on fire!`);
    } else if (newStreak % 30 === 0) {
      toast.success(`🏆 ${newStreak} day streak! Legendary survivor!`);
    } else {
      toast.success("✅ Today's scan complete! Streak maintained!");
    }
  };

  const getStreakLevel = (days: number) => {
    if (days >= 30) return { level: "Legendary", color: "text-yellow-400", emoji: "🏆" };
    if (days >= 14) return { level: "Expert", color: "text-purple-400", emoji: "💎" };
    if (days >= 7) return { level: "Veteran", color: "text-blue-400", emoji: "⭐" };
    if (days >= 3) return { level: "Regular", color: "text-green-400", emoji: "🔥" };
    return { level: "Beginner", color: "text-gray-400", emoji: "🌱" };
  };

  const streakLevel = getStreakLevel(streak.currentStreak);
  const progressPercentage = (streak.weeklyProgress / streak.weeklyGoal) * 100;

  return (
    <Card className="glass-card border-success/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-success">
        <Flame className="w-5 h-5 animate-pulse" />
        Survival Streak
        <Badge variant="outline" className="ml-auto">
          {streakLevel.emoji} {streakLevel.level}
        </Badge>
      </CardTitle>
      
      <CardContent className="space-y-4">
        {/* Current Streak Display */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-success/10 rounded-lg p-4 border border-success/20">
          <div className="text-4xl font-bold gradient-text mb-1">
            {streak.currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">Days in a row</div>
          <div className={`text-lg font-semibold ${streakLevel.color} mt-1`}>
            {streakLevel.emoji} {streakLevel.level} Survivor
          </div>
        </div>

        {/* Today's Action */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Today's Progress</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Resets in {timeUntilReset}
            </div>
          </div>
          
          <Button
            onClick={handleScanToday}
            disabled={todayScanned}
            className={`w-full ${todayScanned 
              ? 'bg-success/20 text-success cursor-not-allowed' 
              : 'gradient-bg hover:scale-105 transition-transform'
            }`}
          >
            {todayScanned ? (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Today's Scan Complete! ✅
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Scan to Continue Streak
              </>
            )}
          </Button>
        </div>

        {/* Weekly Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Weekly Goal</span>
            <span className="text-muted-foreground">
              {streak.weeklyProgress}/{streak.weeklyGoal} scans
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {progressPercentage >= 100 && (
            <div className="text-xs text-success font-medium">
              🎯 Weekly goal achieved! Bonus XP earned!
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card/30 rounded-lg p-3 text-center border border-accent/20">
            <div className="text-lg font-bold text-warning">{streak.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          <div className="bg-card/30 rounded-lg p-3 text-center border border-accent/20">
            <div className="text-lg font-bold text-primary">{streak.totalScans}</div>
            <div className="text-xs text-muted-foreground">Total Scans</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Trophy className="w-4 h-4 text-warning" />
            Recent Achievements
          </div>
          <div className="flex flex-wrap gap-1">
            {streak.achievements.map((achievement, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {achievement}
              </Badge>
            ))}
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3 h-3 text-primary" />
            <span>
              {streak.currentStreak < 7 
                ? "Scan daily to build your survival instincts!" 
                : streak.currentStreak < 30
                ? "You're becoming a true survivalist! Keep going!"
                : "Legendary status! You're practically immortal!"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};