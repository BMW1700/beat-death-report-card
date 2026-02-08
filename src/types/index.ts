export interface UserData {
  weight: string;
  weightUnit: "lbs" | "kg";
  allergies: string;
  age: string;
  gender: string;
}

export interface DetectedItem {
  label: string;
  confidence: number;
  toxicityLevel: number;
  reason: string;
  lethalDose: string;
  category: string;
  allowCorrection?: boolean;
  needsTraining?: boolean;
  source?: string;
  survival?: string;
  timeToDeath?: string;
  finalWords?: string;
  usdaInfo?: any;
  chemicalInfo?: any;
  fdaInfo?: any;
}

export interface NutritionInfo {
  isFood: boolean;
  calories: number;
  servingSize: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  healthRating: "healthy" | "moderate" | "unhealthy";
  warnings: string[];
}

export interface DeathAnalysis {
  item: string;
  allergyRisk: string;
  killRating?: number;
  killRatingText?: string;
  lethalDose: string;
  timeToDeath: string;
  mechanism: string;
  survival: string;
  finalWords: string;
  detectedItems?: DetectedItem[];
  nutritionInfo?: NutritionInfo | null;
}
