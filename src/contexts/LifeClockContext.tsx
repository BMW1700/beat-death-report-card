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

// Comprehensive time-based action mappings (BASE UNIT: 20 push-ups = 8 hours = 0.333 days)
const DEFAULT_ACTION_MAPPINGS: ActionMapping[] = [
  // EXERCISE
  { action_id: 'pushups_20', category: 'exercise', description: '20 push-ups (one set)', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'pushups_50', category: 'exercise', description: '50 push-ups (one session)', HYG: 2.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1200, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'workout_30min_moderate', category: 'exercise', description: '30-min moderate workout', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'run_1_mile', category: 'exercise', description: 'Run 1 mile', HYG: 2.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1200, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'yoga_30min', category: 'exercise', description: '30-min yoga/mobility', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'hiit_20min', category: 'exercise', description: '20-min HIIT session', HYG: 3.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1680, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'plank_2min', category: 'exercise', description: '2-minute plank hold', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'squats_50', category: 'exercise', description: '50 bodyweight squats', HYG: 1.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 720, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'burpees_20', category: 'exercise', description: '20 burpees', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'pullups_10', category: 'exercise', description: '10 pull-ups', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'walk_30min', category: 'exercise', description: '30-minute brisk walk', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'swim_30min', category: 'exercise', description: '30-minute swim', HYG: 4.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1920, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'cycle_30min', category: 'exercise', description: '30-minute cycling', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'stretch_10min', category: 'exercise', description: '10-minute stretching', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'bike_commute_weekday', category: 'exercise', description: 'Commute by bike 1 day', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'stairs_instead_elevator', category: 'exercise', description: 'Take stairs instead of elevator', HYG: 0.1, scientific_formula: 'Units * 8 hours', playful_default_minutes: 48, verification_bonus_pct: 50, max_per_day: 20 },
  { action_id: 'garden_activity_30min', category: 'exercise', description: '30-min gardening activity', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 3 },
  
  // DIET & NUTRITION
  { action_id: 'healthy_meal', category: 'diet', description: 'Healthy whole-food meal (salad/veg)', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'fruit_serving', category: 'diet', description: 'One serving of fruit', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'vegetable_serving', category: 'diet', description: 'One serving of vegetables', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'drink_water_instead_soda', category: 'diet', description: 'Choose water instead of soda', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'water_intake_goal_habit', category: 'diet', description: 'Meet daily water intake goal', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'fruit_veg_daily_goal', category: 'diet', description: 'Meet daily fruit/veg target', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 6 },
  { action_id: 'plant_based_meal_switch', category: 'diet', description: 'Replace meal with plant-based option', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'processed_fast_food', category: 'diet', description: 'Processed fast-food meal (negative)', HYG: -0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -240, verification_bonus_pct: 0, max_per_day: 3 },
  { action_id: 'sugary_drink', category: 'diet', description: 'Sugary drink (soda/energy drink)', HYG: -0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: -120, verification_bonus_pct: 0, max_per_day: 6 },
  { action_id: 'skip_breakfast_behavior', category: 'diet', description: 'Skip balanced breakfast (negative)', HYG: -0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: -120, verification_bonus_pct: 0, max_per_day: 3 },
  
  // SUBSTANCES (All negative)
  { action_id: 'smoke_1_cigarette', category: 'substances', description: 'Smoke 1 cigarette (negative)', HYG: -2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: -960, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'alcohol_single_drink', category: 'substances', description: 'Single alcoholic drink (negative)', HYG: -0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: -120, verification_bonus_pct: 0, max_per_day: 6 },
  { action_id: 'binge_drinking_event', category: 'substances', description: 'Binge drinking episode (negative)', HYG: -4.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: -1920, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'vape_use_single', category: 'substances', description: 'Single vape nicotine use (negative)', HYG: -1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: -480, verification_bonus_pct: 0, max_per_day: 999 },
  
  // WELLNESS
  { action_id: 'sleep_7_9hrs', category: 'behavior', description: 'Good sleep night (7-9 hrs)', HYG: 1.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 720, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'nap_20min', category: 'behavior', description: '20-minute restorative nap', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'meditation_10min', category: 'behavior', description: '10-minute meditation/relaxation', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'cold_exposure_3min', category: 'behavior', description: 'Cold exposure (brief) session', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'breathwork_10min', category: 'behavior', description: '10-minute breathwork session', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'mental_health_checkin', category: 'behavior', description: 'Weekly mental health check-in', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'therapy_session', category: 'behavior', description: 'Attend therapy session (verified)', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'limit_screen_time_evening', category: 'behavior', description: 'Limit screens before bed', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'standing_breaks_at_work', category: 'behavior', description: 'Take hourly standing/movement breaks', HYG: 0.1, scientific_formula: 'Units * 8 hours', playful_default_minutes: 48, verification_bonus_pct: 50, max_per_day: 10 },
  
  // PREPAREDNESS
  { action_id: 'buy_survival_kit_tier1', category: 'preparedness', description: 'Buy basic survival kit', HYG: 4.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1920, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'buy_survival_kit_tier2', category: 'preparedness', description: 'Buy premium survival kit', HYG: 10.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 4800, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'water_filter_purchase', category: 'preparedness', description: 'Buy certified water filter', HYG: 5.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 2400, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'solar_charger_purchase', category: 'preparedness', description: 'Buy small solar charger', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'emergency_food_cache', category: 'preparedness', description: 'Buy 72-hr emergency food kit', HYG: 6.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 2880, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'first_aid_kit_buy', category: 'preparedness', description: 'Purchase basic first-aid kit', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'complete_first_aid_course', category: 'preparedness', description: 'Complete first-aid course (verified)', HYG: 6.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 2880, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'attend_survival_training', category: 'preparedness', description: 'Attend survival training (verified)', HYG: 12.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 5760, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'smoke_alarm_test', category: 'preparedness', description: 'Test home smoke alarm (safety)', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'fire_extinguisher_check', category: 'preparedness', description: 'Inspect home fire extinguisher', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'cpr_certified', category: 'preparedness', description: 'Obtain CPR certification (verified)', HYG: 8.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 3840, verification_bonus_pct: 50, max_per_day: 1 },
  
  // SAFETY & MEDICAL
  { action_id: 'helmet_use_bike', category: 'behavior', description: 'Wear helmet while biking', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 10 },
  { action_id: 'seatbelt_consistent_use', category: 'behavior', description: 'Consistent seatbelt use habit', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 10 },
  { action_id: 'vaccination_up_to_date', category: 'behavior', description: 'Update recommended vaccines (verified)', HYG: 8.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 3840, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'annual_physical', category: 'behavior', description: 'Annual physical exam (verified)', HYG: 4.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1920, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'flu_vaccine', category: 'behavior', description: 'Annual flu vaccine (verified)', HYG: 1.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 720, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'dentist_checkup', category: 'behavior', description: 'Annual dental checkup', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'handwashing_habit', category: 'behavior', description: 'Proper handwashing after public contact', HYG: 0.1, scientific_formula: 'Units * 8 hours', playful_default_minutes: 48, verification_bonus_pct: 50, max_per_day: 20 }
];

// Calculate time-based minutes directly from playful_default_minutes
function calculateScientificMinutes(mapping: ActionMapping): number {
  // For scientific mode, show the time contribution in minutes
  return mapping.playful_default_minutes;
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
    // Force clear localStorage and use new mappings
    localStorage.removeItem('beatdeath_lifeclock');
    
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
    const scientificMinutes = calculateScientificMinutes(mapping);
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
    return mapping ? calculateScientificMinutes(mapping) : 0;
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