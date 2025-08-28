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
  category: 'exercise' | 'diet' | 'substances' | 'preparedness' | 'behavior' | 'streaks';
  description: string;
  units: number; // Base units (1 unit = 8 hours)
  hours_per_unit: number; // Always 8 for BASE UNIT
  playful_default_hours: number; // Immediate time impact
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
  hours_applied: number; // New: actual hours applied to life clock
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

// Time-based action mappings (BASE UNIT: 1.0 = 8 hours)
const DEFAULT_ACTION_MAPPINGS: ActionMapping[] = [
  // EXERCISE
  {
    action_id: 'pushups_20',
    category: 'exercise',
    description: '20 push-ups (one set)',
    units: 1.0,
    hours_per_unit: 8,
    playful_default_hours: 8,
    verification_bonus_pct: 50,
    max_per_day: 3
  },
  {
    action_id: 'pushups_50',
    category: 'exercise',
    description: '50 push-ups (advanced set)',
    units: 2.5,
    hours_per_unit: 8,
    playful_default_hours: 20,
    verification_bonus_pct: 50,
    max_per_day: 2
  },
  {
    action_id: 'workout_30min_moderate',
    category: 'exercise',
    description: '30min moderate workout',
    units: 3.0,
    hours_per_unit: 8,
    playful_default_hours: 24,
    verification_bonus_pct: 50,
    max_per_day: 2
  },
  {
    action_id: 'run_1_mile',
    category: 'exercise',
    description: 'Run 1 mile',
    units: 2.5,
    hours_per_unit: 8,
    playful_default_hours: 20,
    verification_bonus_pct: 50,
    max_per_day: 2
  },
  {
    action_id: 'yoga_30min',
    category: 'exercise',
    description: '30min yoga session',
    units: 1.0,
    hours_per_unit: 8,
    playful_default_hours: 8,
    verification_bonus_pct: 50,
    max_per_day: 2
  },
  
  // DIET & NUTRITION
  {
    action_id: 'healthy_meal',
    category: 'diet',
    description: 'Healthy meal (salad/fruit/whole-food)',
    units: 0.5,
    hours_per_unit: 8,
    playful_default_hours: 4,
    verification_bonus_pct: 50,
    max_per_day: 6
  },
  {
    action_id: 'processed_fast_food_meal',
    category: 'diet',
    description: 'Processed fast food meal',
    units: -0.5,
    hours_per_unit: 8,
    playful_default_hours: -4,
    verification_bonus_pct: 0,
    max_per_day: 10
  },
  {
    action_id: 'sugary_drink',
    category: 'diet',
    description: 'Sugary drink (soda/energy drink)',
    units: -0.25,
    hours_per_unit: 8,
    playful_default_hours: -2,
    verification_bonus_pct: 0,
    max_per_day: 10
  },

  // SUBSTANCES
  {
    action_id: 'smoke_1_cigarette',
    category: 'substances',
    description: 'Smoke 1 cigarette',
    units: -2.0,
    hours_per_unit: 8,
    playful_default_hours: -16,
    verification_bonus_pct: 0,
    max_per_day: 20
  },
  {
    action_id: 'alcohol_single_drink',
    category: 'substances',
    description: 'Single alcoholic drink',
    units: -0.25,
    hours_per_unit: 8,
    playful_default_hours: -2,
    verification_bonus_pct: 0,
    max_per_day: 5
  },
  {
    action_id: 'binge_drinking_event',
    category: 'substances',
    description: 'Binge drinking event',
    units: -4.0,
    hours_per_unit: 8,
    playful_default_hours: -32,
    verification_bonus_pct: 0,
    max_per_day: 3
  },

  // PREPAREDNESS / SURVIVALIST
  {
    action_id: 'buy_survival_kit_tier1',
    category: 'preparedness',
    description: 'Buy survival kit (Tier 1)',
    units: 4.0,
    hours_per_unit: 8,
    playful_default_hours: 32,
    verification_bonus_pct: 50,
    max_per_day: 1
  },
  {
    action_id: 'buy_survival_kit_tier2',
    category: 'preparedness',
    description: 'Buy survival kit (Tier 2 Premium)',
    units: 10.0,
    hours_per_unit: 8,
    playful_default_hours: 80,
    verification_bonus_pct: 50,
    max_per_day: 1
  },
  {
    action_id: 'complete_first_aid_course_verified',
    category: 'preparedness',
    description: 'Complete first aid course (verified)',
    units: 6.0,
    hours_per_unit: 8,
    playful_default_hours: 48,
    verification_bonus_pct: 50,
    max_per_day: 1
  },
  {
    action_id: 'attend_survival_training_verified',
    category: 'preparedness',
    description: 'Attend survival training (verified)',
    units: 12.0,
    hours_per_unit: 8,
    playful_default_hours: 96,
    verification_bonus_pct: 50,
    max_per_day: 1
  },

  // BEHAVIOR (INACTION / PENALTIES)
  {
    action_id: 'missed_exercise_day',
    category: 'behavior',
    description: 'Missed exercise day (active streak)',
    units: -1.25,
    hours_per_unit: 8,
    playful_default_hours: -10,
    verification_bonus_pct: 0,
    max_per_day: 1
  },
  {
    action_id: 'sedentary_day',
    category: 'behavior',
    description: 'Sedentary day (no movement logged)',
    units: -0.5,
    hours_per_unit: 8,
    playful_default_hours: -4,
    verification_bonus_pct: 0,
    max_per_day: 1
  },

  // STREAKS & BONUSES
  {
    action_id: '7_day_healthy_streak',
    category: 'streaks',
    description: '7-day healthy streak completed',
    units: 24.0,
    hours_per_unit: 8,
    playful_default_hours: 192,
    verification_bonus_pct: 0,
    max_per_day: 1
  },
  {
    action_id: '30_day_clean_streak',
    category: 'streaks',
    description: '30-day clean streak completed',
    units: 168.0,
    hours_per_unit: 8,
    playful_default_hours: 1344,
    verification_bonus_pct: 0,
    max_per_day: 1
  }
];

// Calculate scientific minutes from units (for long-term display)
function calculateScientificMinutes(units: number): number {
  // Convert units to estimated long-term impact (simplified for display)
  const scientificInstantYears = (units * 8) / (365 * 24); // hours to yearly fraction
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
  getPlayfulHours: (actionId: string, isVerified?: boolean) => number;
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

    // Calculate time impact (NEW TIME-BASED SYSTEM)
    const isVerified = method === 'verified';
    const baseHours = mapping.playful_default_hours;
    const verificationMultiplier = isVerified ? (1 + mapping.verification_bonus_pct / 100) : 1;
    const hoursApplied = baseHours * verificationMultiplier;
    
    // Convert to minutes for internal storage
    const playfulMinutes = hoursApplied * 60;
    const scientificMinutes = calculateScientificMinutes(mapping.units);

    // Create action log
    const actionLog: ActionLog = {
      id: `${Date.now()}_${Math.random()}`,
      action_id: actionId,
      timestamp: new Date(),
      method,
      scientific_minutes: scientificMinutes,
      playful_minutes: playfulMinutes,
      hours_applied: hoursApplied,
      was_verified: isVerified
    };

    setState(prev => {
      const newTotalMinutes = prev.totalLifeMinutes + playfulMinutes;
      
      // Add to analytics buffer
      const analyticsEvent = {
        event: 'action_logged',
        action_id: actionId,
        method,
        units: mapping.units,
        hours_applied: hoursApplied,
        scientific_minutes: scientificMinutes,
        playful_minutes: playfulMinutes,
        new_total: newTotalMinutes,
        timestamp: new Date().toISOString()
      };

      return {
        ...prev,
        totalLifeMinutes: Math.max(0, newTotalMinutes),
        recentActions: [actionLog, ...prev.recentActions.slice(0, 49)], // Keep last 50
        dailyCaps: {
          ...prev.dailyCaps,
          [dailyKey]: currentCount + 1
        },
        analyticsBuffer: [analyticsEvent, ...prev.analyticsBuffer.slice(0, 999)] // Keep last 1000
      };
    });

    // Show feedback with time-based messaging
    const isPositive = hoursApplied > 0;
    const formatHours = (hours: number) => {
      const absHours = Math.abs(hours);
      if (absHours >= 24) {
        const days = Math.round(absHours / 24 * 10) / 10;
        return `${days} day${days !== 1 ? 's' : ''}`;
      }
      return `${Math.round(absHours)} hour${absHours !== 1 ? 's' : ''}`;
    };

    toast({
      title: isPositive ? "Life Extended!" : "Life Shortened",
      description: `${isPositive ? '+' : ''}${formatHours(hoursApplied)} ${isVerified ? '(Verified!)' : ''}`,
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
    
    // Handle NaN or invalid values
    if (!totalSeconds || isNaN(totalSeconds) || totalSeconds < 0) {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
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
    return mapping ? calculateScientificMinutes(mapping.units) : 0;
  };

  const getPlayfulMinutes = (actionId: string, isVerified = false): number => {
    const mapping = state.actionMappings.find(m => m.action_id === actionId);
    if (!mapping) return 0;
    const hours = mapping.playful_default_hours * (isVerified ? (1 + mapping.verification_bonus_pct / 100) : 1);
    return hours * 60; // Convert to minutes for compatibility
  };

  const getPlayfulHours = (actionId: string, isVerified = false): number => {
    const mapping = state.actionMappings.find(m => m.action_id === actionId);
    if (!mapping) return 0;
    return mapping.playful_default_hours * (isVerified ? (1 + mapping.verification_bonus_pct / 100) : 1);
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
    getPlayfulHours,
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