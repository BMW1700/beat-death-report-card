import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Crown, Shield, Zap, Target, Star, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'scanning' | 'survival' | 'social' | 'streaks' | 'expert';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  reward: string;
  rarity: number; // 1-100, lower = rarer
}

const achievements: Achievement[] = [
  {
    id: "first_scan",
    title: "First Contact",
    description: "Scan your first item",
    icon: "🔍",
    category: "scanning",
    tier: "bronze",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    reward: "+10 XP",
    rarity: 100
  },
  {
    id: "death_defier",
    title: "Death Defier",
    description: "Survive 100 scans",
    icon: "💀",
    category: "scanning", 
    tier: "silver",
    progress: 87,
    maxProgress: 100,
    unlocked: false,
    reward: "+50 XP, Survivor Badge",
    rarity: 45
  },
  {
    id: "streak_master",
    title: "Streak Master", 
    description: "Maintain a 30-day scanning streak",
    icon: "🔥",
    category: "streaks",
    tier: "gold",
    progress: 23,
    maxProgress: 30,
    unlocked: false,
    reward: "Streak Master Title, +100 XP",
    rarity: 15
  },
  {
    id: "wilderness_expert",
    title: "Wilderness Expert",
    description: "Identify 50 wilderness dangers",
    icon: "🌲",
    category: "survival",
    tier: "gold",
    progress: 34,
    maxProgress: 50,
    unlocked: false,
    reward: "Expert Badge, Wilderness Title",
    rarity: 25
  },
  {
    id: "social_butterfly",
    title: "Viral Spreader",
    description: "Share 25 death reports",
    icon: "📱",
    category: "social",
    tier: "silver",
    progress: 12,
    maxProgress: 25,
    unlocked: false,
    reward: "Influencer Badge, +25 XP",
    rarity: 60
  },
  {
    id: "deadly_accurate",
    title: "Deadly Accurate",
    description: "Correctly identify 500 dangerous items",
    icon: "🎯",
    category: "expert",
    tier: "platinum",
    progress: 267,
    maxProgress: 500,
    unlocked: false,
    reward: "Expert Analyst Title, +200 XP",
    rarity: 8
  },
  {
    id: "immortal",
    title: "Practically Immortal",
    description: "Complete 365 consecutive scans",
    icon: "👑",
    category: "streaks",
    tier: "legendary",
    progress: 0,
    maxProgress: 365,
    unlocked: false,
    reward: "Immortal Status, Exclusive Badge",
    rarity: 1
  },
  {
    id: "community_legend",
    title: "Community Legend", 
    description: "Help train the AI with 100 corrections",
    icon: "🧠",
    category: "expert",
    tier: "platinum",
    progress: 43,
    maxProgress: 100,
    unlocked: false,
    reward: "AI Trainer Title, +150 XP",
    rarity: 12
  }
];

const tierColors = {
  bronze: "text-orange-600",
  silver: "text-gray-400", 
  gold: "text-yellow-400",
  platinum: "text-purple-400",
  legendary: "text-pink-400"
};

const tierIcons = {
  bronze: Trophy,
  silver: Shield,
  gold: Crown,
  platinum: Star,
  legendary: Zap
};

const categoryEmojis = {
  scanning: "🔍",
  survival: "🏕️", 
  social: "📱",
  streaks: "🔥",
  expert: "🧠"
};

export const EnhancedAchievements = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalXP, setTotalXP] = useState(1247);
  const [unlockedCount, setUnlockedCount] = useState(1);

  useEffect(() => {
    setUnlockedCount(achievements.filter(a => a.unlocked).length);
  }, []);

  const handleClaimReward = (achievement: Achievement) => {
    if (!achievement.unlocked) return;
    
    toast.success(`🏆 ${achievement.title} completed! ${achievement.reward}`);
    
    // Extract XP from reward string and add to total
    const xpMatch = achievement.reward.match(/\+(\d+) XP/);
    if (xpMatch) {
      const xpGained = parseInt(xpMatch[1]);
      setTotalXP(prev => prev + xpGained);
    }
  };

  const filteredAchievements = selectedCategory
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements;

  const categories = Array.from(new Set(achievements.map(a => a.category)));

  const getProgressPercentage = (progress: number, max: number) => {
    return Math.min((progress / max) * 100, 100);
  };

  const getRarityLabel = (rarity: number) => {
    if (rarity <= 5) return { label: "Mythical", color: "text-pink-400" };
    if (rarity <= 15) return { label: "Legendary", color: "text-purple-400" };
    if (rarity <= 30) return { label: "Epic", color: "text-blue-400" };
    if (rarity <= 60) return { label: "Rare", color: "text-green-400" };
    return { label: "Common", color: "text-gray-400" };
  };

  return (
    <Card className="glass-card border-warning/30 hover:shadow-2xl transition-all duration-300">
      <CardTitle className="p-3 flex items-center gap-2 text-warning">
        <Trophy className="w-5 h-5" />
        Achievements
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {unlockedCount}/{achievements.length}
          </Badge>
          <Badge variant="outline" className="text-xs text-primary">
            {totalXP.toLocaleString()} XP
          </Badge>
        </div>
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
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="text-xs"
            >
              {categoryEmojis[category as keyof typeof categoryEmojis]} {category}
            </Button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredAchievements.map((achievement) => {
            const TierIcon = tierIcons[achievement.tier];
            const progressPercentage = getProgressPercentage(achievement.progress, achievement.maxProgress);
            const rarity = getRarityLabel(achievement.rarity);
            const isComplete = achievement.progress >= achievement.maxProgress;
            
            return (
              <div
                key={achievement.id}
                className={`bg-card/30 rounded-lg p-3 border transition-all ${
                  achievement.unlocked 
                    ? 'border-success/50 shadow-lg' 
                    : isComplete
                    ? 'border-warning/50 animate-pulse'
                    : 'border-accent/20'
                } hover:border-primary/30`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="text-2xl">{achievement.icon}</div>
                    {achievement.unlocked ? (
                      <Unlock className="absolute -bottom-1 -right-1 w-3 h-3 text-success" />
                    ) : isComplete ? (
                      <Target className="absolute -bottom-1 -right-1 w-3 h-3 text-warning animate-pulse" />
                    ) : (
                      <Lock className="absolute -bottom-1 -right-1 w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${tierColors[achievement.tier]}`}
                        >
                          <TierIcon className="w-2 h-2 mr-1" />
                          {achievement.tier}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${rarity.color}`}
                        >
                          {rarity.label}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-1" />
                    </div>
                    
                    {/* Reward & Action */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-success">
                        🎁 {achievement.reward}
                      </div>
                      {achievement.unlocked && (
                        <Button
                          size="sm"
                          onClick={() => handleClaimReward(achievement)}
                          className="text-xs gradient-bg hover:scale-105 transition-transform"
                        >
                          Claimed ✅
                        </Button>
                      )}
                      {isComplete && !achievement.unlocked && (
                        <Button
                          size="sm"
                          onClick={() => handleClaimReward(achievement)}
                          className="text-xs bg-warning text-warning-foreground hover:scale-105 transition-transform animate-pulse"
                        >
                          Claim Reward!
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* XP Progress */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-primary">Survival XP</span>
            <span className="text-lg font-bold gradient-text">{totalXP.toLocaleString()}</span>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Complete achievements to earn XP and unlock exclusive rewards!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};