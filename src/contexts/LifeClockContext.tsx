import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

// Types from master prompt
export interface UserData {
  age: number;
  sex: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  baselineYears: number; // starts at 80
}

export interface ActionMapping {
  action_id: string;
  category: 'exercise' | 'diet' | 'substances' | 'preparedness' | 'behavior';
  description: string;
  HYG: number; // Habit Years Gained (if sustained daily)
  scientific_formula: string;
  playful_default_minutes: number;
  verification_bonus_pct: number;
  max_per_day: number;
}

export interface ActionLog {
  id: string;
  action_id: string;
  timestamp: Date;
  method: 'self' | 'verified' | 'wearable';
  scientific_minutes: number;
  playful_minutes: number;
  was_verified: boolean;
}

export interface LifeClockState {
  // Core Clock Values
  totalLifeMinutes: number; // Real-time countdown
  scientificMode: boolean; // Toggle between Scientific/Playful display
  
  // User Data
  userData: UserData;
  
  // Action System
  actionMappings: ActionMapping[];
  recentActions: ActionLog[];
  
  // Daily Caps & Streaks
  dailyCaps: Record<string, number>;
  currentStreaks: Record<string, number>;
  
  // Analytics Buffer (local-only)
  analyticsBuffer: any[];
}

// New time-based action mappings (BASE UNIT: 20 push-ups = 8 hours = 0.333 days)
const DEFAULT_ACTION_MAPPINGS: ActionMapping[] = [
  // EXERCISE (All positive - increases life!)
  {
    action_id: 'pushups_20',
    category: 'exercise',
    description: '20 push-ups (one set)',
    HYG: 1.0, // 1 unit = 8 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 480, // 8 hours = 480 minutes
    verification_bonus_pct: 50,
    max_per_day: 3
  },
  {
    action_id: 'pushups_50',
    category: 'exercise',
    description: '50 push-ups (advanced set)',
    HYG: 2.5, // 2.5 units = 20 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 1200, // 20 hours = 1200 minutes
    verification_bonus_pct: 50,
    max_per_day: 2
  },
  {
    action_id: 'workout_30min_moderate',
    category: 'exercise',
    description: '30min moderate workout',
    HYG: 3.0, // 3 units = 24 hours (1 day)
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 1440, // 24 hours = 1440 minutes
    verification_bonus_pct: 50,
    max_per_day: 2
  },
  {
    action_id: 'run_1_mile',
    category: 'exercise',
    description: 'Run 1 mile',
    HYG: 2.5, // 2.5 units = 20 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 1200, // 20 hours = 1200 minutes
    verification_bonus_pct: 50,
    max_per_day: 2
  },
  {
    action_id: 'yoga_30min',
    category: 'exercise',
    description: '30min yoga session',
    HYG: 1.0, // 1 unit = 8 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 480, // 8 hours = 480 minutes
    verification_bonus_pct: 50,
    max_per_day: 3
  },

  // DIET & NUTRITION
  {
    action_id: 'healthy_meal',
    category: 'diet',
    description: 'Healthy meal (salad, fruit, whole-food)',
    HYG: 0.5, // 0.5 units = 4 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 240, // 4 hours = 240 minutes
    verification_bonus_pct: 50,
    max_per_day: 6
  },
  {
    action_id: 'processed_fast_food_meal',
    category: 'diet',
    description: 'Processed fast food meal',
    HYG: -0.5, // -0.5 units = -4 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: -240, // -4 hours = -240 minutes
    verification_bonus_pct: 0,
    max_per_day: 10
  },
  {
    action_id: 'sugary_drink',
    category: 'diet',
    description: 'Sugary drink',
    HYG: -0.25, // -0.25 units = -2 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: -120, // -2 hours = -120 minutes
    verification_bonus_pct: 0,
    max_per_day: 10
  },

  // SUBSTANCES (All negative)
  {
    action_id: 'smoke_cigarette',
    category: 'substances',
    description: 'Smoke cigarette',
    HYG: -2.0, // -2 units = -16 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: -960, // -16 hours = -960 minutes
    verification_bonus_pct: 0,
    max_per_day: 20
  },
  {
    action_id: 'alcohol_single_drink',
    category: 'substances',
    description: 'Single alcoholic drink',
    HYG: -0.25, // -0.25 units = -2 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: -120, // -2 hours = -120 minutes
    verification_bonus_pct: 0,
    max_per_day: 5
  },
  {
    action_id: 'binge_drinking_event',
    category: 'substances',
    description: 'Binge drinking event',
    HYG: -4.0, // -4 units = -32 hours
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: -1920, // -32 hours = -1920 minutes
    verification_bonus_pct: 0,
    max_per_day: 2
  },

  // PREPAREDNESS / SURVIVALIST (All positive)
  {
    action_id: 'buy_survival_kit_tier1',
    category: 'preparedness',
    description: 'Buy survival kit (Tier 1)',
    HYG: 4.0, // 4 units = 32 hours (~1.33 days)
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 1920, // 32 hours = 1920 minutes
    verification_bonus_pct: 50,
    max_per_day: 1
  },
  {
    action_id: 'buy_survival_kit_tier2',
    category: 'preparedness',
    description: 'Buy survival kit (Tier 2 Premium)',
    HYG: 10.0, // 10 units = 80 hours (~3.33 days)
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 4800, // 80 hours = 4800 minutes
    verification_bonus_pct: 50,
    max_per_day: 1
  },
  {
    action_id: 'complete_first_aid_course_verified',
    category: 'preparedness',
    description: 'Complete first aid course (verified)',
    HYG: 6.0, // 6 units = 48 hours (2 days)
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 2880, // 48 hours = 2880 minutes
    verification_bonus_pct: 50,
    max_per_day: 1
  },
  {
    action_id: 'attend_survival_training_verified',
    category: 'preparedness',
    description: 'Attend survival training (verified)',
    HYG: 12.0, // 12 units = 96 hours (4 days)
    scientific_formula: 'Units * 8 hours (Base: 20 pushups = 8h)',
    playful_default_minutes: 5760, // 96 hours = 5760 minutes
    verification_bonus_pct: 50,
    max_per_day: 1
  }
];

// Calculate scientific minutes from HYG
function calculateScientificMinutes(HYG: number): number {
  const scientificInstantYears = HYG / 365;
  return scientificInstantYears * 525600; // minutes per year
}

// Calculate baseline life expectancy at 80 years in minutes
function calculateBaselineMinutes(userData: UserData): number {
  return userData.baselineYears * 365 * 24 * 60; // 80 years in minutes
}

interface LifeClockContextType {
  state: LifeClockState;
  logAction: (actionId: string, method?: 'self' | 'verified' | 'wearable') => boolean;
  updateUserData: (data: Partial<UserData>) => void;
  toggleScientificMode: () => void;
  getTimeRemaining: () => {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  getScientificContribution: (actionId: string) => number;
  getPlayfulMinutes: (actionId: string, isVerified?: boolean) => number;
  canPerformAction: (actionId: string) => boolean;
}

const LifeClockContext = createContext<LifeClockContextType | undefined>(undefined);

export function LifeClockProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LifeClockState>(() => {
    // Initialize from localStorage or defaults
    const stored = localStorage.getItem('beatdeath_lifeclock');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          recentActions: parsed.recentActions.map((action: any) => ({
            ...action,
            timestamp: new Date(action.timestamp)
          }))
        };
      } catch (e) {
        console.warn('Failed to parse stored life clock data');
      }
    }
    
    return {
      totalLifeMinutes: calculateBaselineMinutes({ 
        age: 25, 
        sex: 'other', 
        height: 170, 
        weight: 70, 
        baselineYears: 80 
      }),
      scientificMode: false,
      userData: {
        age: 25,
        sex: 'other',
        height: 170,
        weight: 70,
        baselineYears: 80
      },
      actionMappings: DEFAULT_ACTION_MAPPINGS,
      recentActions: [],
      dailyCaps: {},
      currentStreaks: {},
      analyticsBuffer: []
    };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('beatdeath_lifeclock', JSON.stringify(state));
  }, [state]);

  // Real-time countdown (every second) - FIXED TO ACTUALLY COUNT DOWN
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const oneSecondInMinutes = 1/60; // exactly 1 second = 1/60 minutes
        const newTotal = Math.max(0, prev.totalLifeMinutes - oneSecondInMinutes);
        return {
          ...prev,
          totalLifeMinutes: newTotal
        };
      });
    }, 1000); // exactly every 1000ms = 1 second

    return () => clearInterval(interval);
  }, []);

  const logAction = (actionId: string, method: 'self' | 'verified' | 'wearable' = 'self'): boolean => {
    const mapping = state.actionMappings.find(m => m.action_id === actionId);
    if (!mapping) return false;

    // Check daily caps
    const today = new Date().toDateString();
    const dailyKey = `${actionId}_${today}`;
    const currentCount = state.dailyCaps[dailyKey] || 0;
    
    if (currentCount >= mapping.max_per_day) {
      toast({
        title: "Daily Limit Reached",
        description: `You've reached the daily limit for ${mapping.description}`,
        variant: "destructive"
      });
      return false;
    }

    // Calculate minutes
    const scientificMinutes = calculateScientificMinutes(mapping.HYG);
    const isVerified = method === 'verified';
    const playfulMinutes = mapping.playful_default_minutes * (isVerified ? (1 + mapping.verification_bonus_pct / 100) : 1);

    // Create action log
    const actionLog: ActionLog = {
      id: `${Date.now()}_${Math.random()}`,
      action_id: actionId,
      timestamp: new Date(),
      method,
      scientific_minutes: scientificMinutes,
      playful_minutes: playfulMinutes,
      was_verified: isVerified
    };

    setState(prev => {
      const newTotalMinutes = prev.totalLifeMinutes + playfulMinutes;
      
      // Add to analytics buffer
      const analyticsEvent = {
        event: 'action_logged',
        action_id: actionId,
        method,
        scientific_minutes: scientificMinutes,
        playful_minutes: playfulMinutes,
        new_total: newTotalMinutes,
        timestamp: new Date().toISOString()
      };

      return {
        ...prev,
        totalLifeMinutes: Math.max(0, newTotalMinutes), // Prevent negative time
        recentActions: [actionLog, ...prev.recentActions.slice(0, 49)], // Keep last 50
        dailyCaps: {
          ...prev.dailyCaps,
          [dailyKey]: currentCount + 1
        },
        analyticsBuffer: [analyticsEvent, ...prev.analyticsBuffer.slice(0, 999)] // Keep last 1000
      };
    });

    // Show feedback
    const isPositive = playfulMinutes > 0;
    toast({
      title: isPositive ? "Life Extended!" : "Life Shortened",
      description: `${isPositive ? '+' : ''}${Math.round(playfulMinutes)} minutes ${isVerified ? '(Verified!)' : ''}`,
      variant: isPositive ? "default" : "destructive"
    });

    return true;
  };

  const updateUserData = (data: Partial<UserData>) => {
    setState(prev => ({
      ...prev,
      userData: { ...prev.userData, ...data }
    }));
  };

  const toggleScientificMode = () => {
    setState(prev => ({
      ...prev,
      scientificMode: !prev.scientificMode
    }));
  };

  const getTimeRemaining = () => {
    const totalSeconds = state.totalLifeMinutes * 60;
    const years = Math.floor(totalSeconds / (365 * 24 * 3600));
    const months = Math.floor((totalSeconds % (365 * 24 * 3600)) / (30 * 24 * 3600));
    const days = Math.floor((totalSeconds % (30 * 24 * 3600)) / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return { years, months, days, hours, minutes, seconds };
  };

  const getScientificContribution = (actionId: string): number => {
    const mapping = state.actionMappings.find(m => m.action_id === actionId);
    return mapping ? calculateScientificMinutes(mapping.HYG) : 0;
  };

  const getPlayfulMinutes = (actionId: string, isVerified = false): number => {
    const mapping = state.actionMappings.find(m => m.action_id === actionId);
    if (!mapping) return 0;
    return mapping.playful_default_minutes * (isVerified ? (1 + mapping.verification_bonus_pct / 100) : 1);
  };

  const canPerformAction = (actionId: string): boolean => {
    const mapping = state.actionMappings.find(m => m.action_id === actionId);
    if (!mapping) return false;

    const today = new Date().toDateString();
    const dailyKey = `${actionId}_${today}`;
    const currentCount = state.dailyCaps[dailyKey] || 0;
    
    return currentCount < mapping.max_per_day;
  };

  const contextValue: LifeClockContextType = {
    state,
    logAction,
    updateUserData,
    toggleScientificMode,
    getTimeRemaining,
    getScientificContribution,
    getPlayfulMinutes,
    canPerformAction
  };

  return (
    <LifeClockContext.Provider value={contextValue}>
      {children}
    </LifeClockContext.Provider>
  );
}

export function useLifeClock() {
  const context = useContext(LifeClockContext);
  if (context === undefined) {
    throw new Error('useLifeClock must be used within a LifeClockProvider');
  }
  return context;
}