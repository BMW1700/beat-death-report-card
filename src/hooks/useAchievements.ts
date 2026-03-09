import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AchievementDef {
  type: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  xpReward: number;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    type: "first_action",
    name: "First Steps",
    description: "Log your very first life action",
    icon: "🌱",
    rarity: "common",
    xpReward: 10
  },
  {
    type: "streak_3",
    name: "Getting Consistent",
    description: "Maintain a 3-day logging streak",
    icon: "🔥",
    rarity: "common",
    xpReward: 25
  },
  {
    type: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day logging streak",
    icon: "⭐",
    rarity: "rare",
    xpReward: 75
  },
  {
    type: "streak_30",
    name: "Legendary Survivor",
    description: "Maintain a 30-day logging streak",
    icon: "🏆",
    rarity: "legendary",
    xpReward: 500
  },
  {
    type: "xp_100",
    name: "Century Club",
    description: "Earn 100 total XP",
    icon: "💯",
    rarity: "common",
    xpReward: 20
  },
  {
    type: "xp_500",
    name: "XP Veteran",
    description: "Earn 500 total XP",
    icon: "💎",
    rarity: "rare",
    xpReward: 50
  },
  {
    type: "xp_1000",
    name: "XP Legend",
    description: "Earn 1,000 total XP",
    icon: "👑",
    rarity: "legendary",
    xpReward: 200
  },
  {
    type: "actions_10",
    name: "Habit Builder",
    description: "Log 10 total life actions",
    icon: "📋",
    rarity: "common",
    xpReward: 30
  },
  {
    type: "actions_50",
    name: "Dedicated Survivor",
    description: "Log 50 total life actions",
    icon: "🎯",
    rarity: "rare",
    xpReward: 100
  },
  {
    type: "actions_100",
    name: "Centurion",
    description: "Log 100 total life actions",
    icon: "⚔️",
    rarity: "epic",
    xpReward: 250
  }
];

export function useAchievements() {
  const checkedRef = useRef<Set<string>>(new Set());

  const tryUnlock = useCallback(async (userId: string, achievementType: string) => {
    // Prevent duplicate calls for same type in same session
    if (checkedRef.current.has(achievementType)) return;
    checkedRef.current.add(achievementType);

    const def = ACHIEVEMENT_DEFS.find(d => d.type === achievementType);
    if (!def) return;

    try {
      const { data, error } = await (supabase.rpc as any)('unlock_achievement', {
        p_user_id: userId,
        p_achievement_type: def.type,
        p_achievement_name: def.name,
        p_description: def.description,
        p_icon: def.icon,
        p_rarity: def.rarity,
        p_xp_reward: def.xpReward
      });

      if (error) {
        console.error('[Achievements] unlock error:', error);
        checkedRef.current.delete(achievementType); // allow retry
        return;
      }

      if (data === true) {
        // Newly unlocked!
        toast({
          title: `🏆 Achievement Unlocked!`,
          description: `${def.icon} ${def.name} — ${def.description} (+${def.xpReward} XP)`,
          duration: 5000
        });
      }
    } catch (err) {
      console.error('[Achievements] unexpected error:', err);
      checkedRef.current.delete(achievementType);
    }
  }, []);

  /**
   * Check achievements after logging an action.
   * Pass current stats so we can evaluate thresholds.
   */
  const checkAfterAction = useCallback(async (
    userId: string,
    totalActions: number,
    currentStreak: number,
    totalXp: number
  ) => {
    const promises: Promise<void>[] = [];

    // First action
    if (totalActions >= 1) promises.push(tryUnlock(userId, "first_action"));

    // Action milestones
    if (totalActions >= 10) promises.push(tryUnlock(userId, "actions_10"));
    if (totalActions >= 50) promises.push(tryUnlock(userId, "actions_50"));
    if (totalActions >= 100) promises.push(tryUnlock(userId, "actions_100"));

    // Streak milestones
    if (currentStreak >= 3) promises.push(tryUnlock(userId, "streak_3"));
    if (currentStreak >= 7) promises.push(tryUnlock(userId, "streak_7"));
    if (currentStreak >= 30) promises.push(tryUnlock(userId, "streak_30"));

    // XP milestones
    if (totalXp >= 100) promises.push(tryUnlock(userId, "xp_100"));
    if (totalXp >= 500) promises.push(tryUnlock(userId, "xp_500"));
    if (totalXp >= 1000) promises.push(tryUnlock(userId, "xp_1000"));

    await Promise.all(promises);
  }, [tryUnlock]);

  return { checkAfterAction, tryUnlock };
}
