import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Types from master prompt
export interface UserData {
  age: number;
  sex: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  baselineYears: number; // personalized from onboarding, fallback 80
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
  { action_id: 'handwashing_habit', category: 'behavior', description: 'Proper handwashing after public contact', HYG: 0.1, scientific_formula: 'Units * 8 hours', playful_default_minutes: 48, verification_bonus_pct: 50, max_per_day: 20 },

  // ── EXERCISE (18 new) ──
  { action_id: 'jump_rope_10', category: 'exercise', description: 'Jump rope 10 min', HYG: 1.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 720, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'dance_workout_30', category: 'exercise', description: 'Dance workout 30 min', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'rock_climbing_1hr', category: 'exercise', description: 'Rock climbing session 1 hr', HYG: 4.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1920, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'rowing_20min', category: 'exercise', description: 'Rowing machine 20 min', HYG: 2.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1200, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'martial_arts_1hr', category: 'exercise', description: 'Martial arts class 1 hr', HYG: 4.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1920, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'play_sport_30min', category: 'exercise', description: 'Play a sport (basketball, soccer, etc.) 30 min', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'hiking_1hr', category: 'exercise', description: 'Hiking 1 hour', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'heavy_weightlifting_45', category: 'exercise', description: 'Heavy weightlifting session 45 min', HYG: 3.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1680, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'pilates_30min', category: 'exercise', description: 'Pilates 30 min', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'jumping_jacks_100', category: 'exercise', description: 'Jumping jacks 100 reps', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'dead_hang_1min', category: 'exercise', description: 'Dead hang 1 min', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'foam_rolling_10min', category: 'exercise', description: 'Foam rolling / self-massage 10 min', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'standing_desk_1hr', category: 'exercise', description: 'Standing desk use (1 hour)', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'walk_10k_steps', category: 'exercise', description: 'Walk 10,000 steps in a day', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'tai_chi_20min', category: 'exercise', description: 'Tai chi 20 min', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'tennis_30min', category: 'exercise', description: 'Tennis / racquet sport 30 min', HYG: 3.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1680, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'sprint_intervals_10', category: 'exercise', description: 'Sprint intervals 10 min', HYG: 2.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1200, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'ski_snowboard_1hr', category: 'exercise', description: 'Ski / snowboard 1 hour', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 2 },

  // ── DIET & NUTRITION (20 new) ──
  { action_id: 'eat_fatty_fish', category: 'diet', description: 'Eat fatty fish (salmon, sardines)', HYG: 0.75, scientific_formula: 'Units * 8 hours', playful_default_minutes: 360, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'handful_nuts', category: 'diet', description: 'Handful of nuts (almonds, walnuts)', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'fermented_food', category: 'diet', description: 'Eat fermented food (yogurt, kimchi)', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'green_tea', category: 'diet', description: 'Drink green tea', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'whole_grains', category: 'diet', description: 'Eat whole grains (oats, brown rice)', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'beans_legumes', category: 'diet', description: 'Eat beans/legumes serving', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'eat_berries', category: 'diet', description: 'Eat berries (blueberries, strawberries)', HYG: 0.375, scientific_formula: 'Units * 8 hours', playful_default_minutes: 180, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'olive_oil_meal', category: 'diet', description: 'Extra virgin olive oil with meal', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'dark_chocolate', category: 'diet', description: 'Dark chocolate (small portion)', HYG: 0.125, scientific_formula: 'Units * 8 hours', playful_default_minutes: 60, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'processed_red_meat', category: 'diet', description: 'Eat processed red meat (hot dog, bacon)', HYG: -0.75, scientific_formula: 'Units * 8 hours', playful_default_minutes: -360, verification_bonus_pct: 0, max_per_day: 3 },
  { action_id: 'red_meat', category: 'diet', description: 'Eat red meat (steak, burger patty)', HYG: -0.375, scientific_formula: 'Units * 8 hours', playful_default_minutes: -180, verification_bonus_pct: 0, max_per_day: 3 },
  { action_id: 'deep_fried_food', category: 'diet', description: 'Eat deep-fried food', HYG: -0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -240, verification_bonus_pct: 0, max_per_day: 3 },
  { action_id: 'excess_sugar', category: 'diet', description: 'Excess added sugar (candy, pastry)', HYG: -0.375, scientific_formula: 'Units * 8 hours', playful_default_minutes: -180, verification_bonus_pct: 0, max_per_day: 3 },
  { action_id: 'ultra_processed_snack', category: 'diet', description: 'Ultra-processed snack (chips, packaged cookies)', HYG: -0.375, scientific_formula: 'Units * 8 hours', playful_default_minutes: -180, verification_bonus_pct: 0, max_per_day: 3 },
  { action_id: 'skip_meal', category: 'diet', description: 'Skip a meal entirely', HYG: -0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: -120, verification_bonus_pct: 0, max_per_day: 3 },
  { action_id: 'water_8_glasses', category: 'diet', description: 'Drink 8 glasses of water today', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'home_cooked_meal', category: 'diet', description: 'Eat a home-cooked meal', HYG: 0.375, scientific_formula: 'Units * 8 hours', playful_default_minutes: 180, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'intermittent_fasting', category: 'diet', description: 'Intermittent fasting day (16:8)', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'excess_caffeine', category: 'diet', description: 'Excess caffeine (5+ cups coffee)', HYG: -0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: -120, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'probiotic_supplement', category: 'diet', description: 'Probiotic supplement taken', HYG: 0.125, scientific_formula: 'Units * 8 hours', playful_default_minutes: 60, verification_bonus_pct: 50, max_per_day: 1 },

  // ── SUBSTANCES (10 new — all negative) ──
  { action_id: 'smoke_cigar', category: 'substances', description: 'Smoke a cigar', HYG: -2.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -1200, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'chewing_tobacco', category: 'substances', description: 'Use chewing tobacco', HYG: -1.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -720, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'recreational_drug', category: 'substances', description: 'Recreational drug use (single instance)', HYG: -3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: -1440, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'secondhand_smoke_1hr', category: 'substances', description: 'Secondhand smoke exposure (1 hour)', HYG: -0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -240, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'energy_drink', category: 'substances', description: 'Energy drink consumption', HYG: -0.375, scientific_formula: 'Units * 8 hours', playful_default_minutes: -180, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'painkiller_misuse', category: 'substances', description: 'Prescription painkiller misuse', HYG: -4.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: -1920, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'cannabis_smoke', category: 'substances', description: 'Cannabis smoking (1 session)', HYG: -0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -240, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'caffeine_pill_excess', category: 'substances', description: 'Excessive caffeine pill use', HYG: -0.75, scientific_formula: 'Units * 8 hours', playful_default_minutes: -360, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'hookah_1hr', category: 'substances', description: 'Hookah session (1 hour)', HYG: -2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: -960, verification_bonus_pct: 0, max_per_day: 999 },
  { action_id: 'alcohol_late_night', category: 'substances', description: 'Alcohol past midnight (late-night drinking)', HYG: -0.75, scientific_formula: 'Units * 8 hours', playful_default_minutes: -360, verification_bonus_pct: 0, max_per_day: 999 },

  // ── BEHAVIOR & WELLNESS (20 new) ──
  { action_id: 'read_30min', category: 'behavior', description: 'Read for 30 min', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'socialize_1hr', category: 'behavior', description: 'Socialize with friends (1 hour)', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'call_loved_one', category: 'behavior', description: 'Call / video chat a loved one', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'journal_10min', category: 'behavior', description: 'Journal / gratitude writing 10 min', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'nature_30min', category: 'behavior', description: 'Spend 30 min in nature', HYG: 0.75, scientific_formula: 'Units * 8 hours', playful_default_minutes: 360, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'learn_something_new', category: 'behavior', description: 'Learn something new (skill, language)', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 2 },
  { action_id: 'volunteer', category: 'behavior', description: 'Volunteer / help someone', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'laugh_heartily', category: 'behavior', description: 'Laugh heartily (comedy, jokes)', HYG: 0.125, scientific_formula: 'Units * 8 hours', playful_default_minutes: 60, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'deep_breathing_5min', category: 'behavior', description: 'Practice deep breathing 5 min', HYG: 0.125, scientific_formula: 'Units * 8 hours', playful_default_minutes: 60, verification_bonus_pct: 50, max_per_day: 3 },
  { action_id: 'floss_teeth', category: 'behavior', description: 'Floss teeth', HYG: 0.125, scientific_formula: 'Units * 8 hours', playful_default_minutes: 60, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'apply_sunscreen', category: 'behavior', description: 'Apply sunscreen before going out', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'morning_sunlight_15min', category: 'behavior', description: 'Get 15 min of morning sunlight', HYG: 0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: 120, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'sleep_under_5hrs', category: 'behavior', description: 'Sleep less than 5 hours (negative)', HYG: -1.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -720, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'stayed_up_past_2am', category: 'behavior', description: 'Stayed up past 2 AM (negative)', HYG: -0.75, scientific_formula: 'Units * 8 hours', playful_default_minutes: -360, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'sedentary_8hrs', category: 'behavior', description: 'Sedentary for 8+ hours straight (negative)', HYG: -1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: -480, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'phone_scrolling_2hrs', category: 'behavior', description: 'Mindless phone scrolling 2+ hours (negative)', HYG: -0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: -240, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'skip_sunscreen', category: 'behavior', description: 'Skip sunscreen on sunny day (negative)', HYG: -0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: -120, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'road_rage', category: 'behavior', description: 'Road rage / aggressive driving (negative)', HYG: -0.75, scientific_formula: 'Units * 8 hours', playful_default_minutes: -360, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'loud_noise_exposure', category: 'behavior', description: 'Unprotected hearing exposure (loud concert)', HYG: -0.25, scientific_formula: 'Units * 8 hours', playful_default_minutes: -120, verification_bonus_pct: 0, max_per_day: 1 },
  { action_id: 'brush_teeth_twice', category: 'behavior', description: 'Brush teeth twice today', HYG: 0.125, scientific_formula: 'Units * 8 hours', playful_default_minutes: 60, verification_bonus_pct: 50, max_per_day: 1 },

  // ── PREPAREDNESS (8 new) ──
  { action_id: 'emergency_evac_plan', category: 'preparedness', description: 'Create emergency evacuation plan', HYG: 3.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 1440, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'learn_to_swim', category: 'preparedness', description: 'Learn to swim (if non-swimmer)', HYG: 6.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 2880, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'co_detector_install', category: 'preparedness', description: 'Install carbon monoxide detector', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'disaster_drill', category: 'preparedness', description: 'Earthquake / disaster drill practice', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'store_water_supply', category: 'preparedness', description: 'Store 3-day clean water supply', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'learn_self_defense', category: 'preparedness', description: 'Learn basic self-defense', HYG: 2.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 960, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'car_maintenance_check', category: 'preparedness', description: 'Check tire pressure / car maintenance', HYG: 0.5, scientific_formula: 'Units * 8 hours', playful_default_minutes: 240, verification_bonus_pct: 50, max_per_day: 1 },
  { action_id: 'secure_furniture', category: 'preparedness', description: 'Secure heavy furniture to walls', HYG: 1.0, scientific_formula: 'Units * 8 hours', playful_default_minutes: 480, verification_bonus_pct: 50, max_per_day: 1 }
];

// Calculate time-based minutes directly from playful_default_minutes
function calculateScientificMinutes(mapping: ActionMapping): number {
  // For scientific mode, show the time contribution in minutes
  return mapping.playful_default_minutes;
}

// Calculate remaining life in minutes: (baselineYears - currentAge) * minutes_per_year
function calculateRemainingMinutes(baselineYears: number, currentAge: number): number {
  const yearsRemaining = Math.max(0, baselineYears - currentAge);
  return yearsRemaining * 365 * 24 * 60;
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
  const { user, profile } = useAuth();
  const hydratedRef = useRef(false);
  
  // Initialize state - try to load from localStorage first for persistence
  const [state, setState] = useState<LifeClockState>(() => {
    const saved = localStorage.getItem('beatdeath_lifeclock');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore recentActions with proper Date objects
        if (parsed.recentActions) {
          parsed.recentActions = parsed.recentActions.map((a: any) => ({
            ...a,
            timestamp: new Date(a.timestamp)
          }));
        }
        return parsed;
      } catch {
        // Fall through to default
      }
    }
    
    // Default state (will be updated when profile loads)
    return {
      totalLifeMinutes: calculateRemainingMinutes(80, 25),
      scientificMode: false,
      userData: {
        age: 25,
        sex: 'other' as const,
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

  // Sync state with profile data when profile loads or changes
  useEffect(() => {
    if (!profile) return;
    
    const profileBaseline = profile.calculated_baseline_years ?? 80;
    const profileAge = profile.age ?? 25;
    const profileGender = (profile.gender as 'male' | 'female' | 'other') ?? 'other';
    const profileWeight = profile.weight ?? 70;
    
    // Only update if profile data differs from current state
    setState(prev => {
      const baselineChanged = prev.userData.baselineYears !== profileBaseline;
      const ageChanged = prev.userData.age !== profileAge;
      
      if (!baselineChanged && !ageChanged) {
        return prev; // No changes needed
      }
      
      // Recalculate total life minutes based on profile data
      const newRemainingMinutes = calculateRemainingMinutes(profileBaseline, profileAge);
      
      // Preserve any time gained/lost from actions
      const originalBaseline = calculateRemainingMinutes(prev.userData.baselineYears, prev.userData.age);
      const actionAdjustment = prev.totalLifeMinutes - originalBaseline;
      
      console.log(`[LifeClock] Syncing with profile: baseline=${profileBaseline}, age=${profileAge}, remaining=${newRemainingMinutes / (365 * 24 * 60)} years`);
      
      return {
        ...prev,
        totalLifeMinutes: newRemainingMinutes + actionAdjustment,
        userData: {
          ...prev.userData,
          age: profileAge,
          sex: profileGender,
          weight: profileWeight,
          baselineYears: profileBaseline
        }
      };
    });
  }, [profile?.calculated_baseline_years, profile?.age, profile?.gender, profile?.weight]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('beatdeath_lifeclock', JSON.stringify(state));
  }, [state]);

  // Hydrate from Supabase on mount (once, when user is authenticated)
  useEffect(() => {
    if (!user || hydratedRef.current) return;
    hydratedRef.current = true;

    const hydrate = async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('life_actions')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', thirtyDaysAgo.toISOString())
        .order('logged_at', { ascending: false });

      if (error || !data || data.length === 0) return;

      // Rebuild recentActions and recalculate time delta from DB
      const dbActions: ActionLog[] = data.map((row: any) => ({
        id: row.id,
        action_id: row.action_id,
        timestamp: new Date(row.logged_at),
        method: row.method || 'self',
        scientific_minutes: 0,
        playful_minutes: row.minutes_impact,
        was_verified: row.method === 'verified'
      }));

      const totalDbMinutes = data.reduce((sum: number, row: any) => sum + row.minutes_impact, 0);

      setState(prev => {
        // Calculate what local actions contributed
        const localMinutes = prev.recentActions.reduce((sum, a) => sum + a.playful_minutes, 0);
        // Replace local actions with DB actions, adjust total
        const baselineMinutes = prev.totalLifeMinutes - localMinutes;
        return {
          ...prev,
          recentActions: dbActions.slice(0, 50),
          totalLifeMinutes: Math.max(0, baselineMinutes + totalDbMinutes)
        };
      });

      console.log(`[LifeClock] Hydrated ${data.length} actions from Supabase`);
    };

    hydrate();
  }, [user]);

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

    // Fire-and-forget Supabase sync
    if (user) {
      supabase.from('life_actions').insert({
        user_id: user.id,
        action_id: actionId,
        category: mapping.category,
        description: mapping.description,
        minutes_impact: Math.round(playfulMinutes),
        method,
        logged_at: new Date().toISOString()
      } as any).then(({ error }) => {
        if (error) console.error('[LifeClock] Supabase sync error:', error);
      });
    }

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