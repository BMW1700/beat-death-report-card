export interface UserData {
  weight: string;
  weightUnit: "lbs" | "kg";
  allergies: string;
  age: string;
  gender: string;
}

export interface DetectedItem {
  // Core identification
  itemName: string;           // Main item name (was: label)
  confidence: number;         // AI confidence (0-1)
  
  // Risk assessment
  deathRating: number;        // Death risk 1-10 (was: toxicityLevel/10)
  riskFactors: string[];      // Array of risk factors (was: reason)
  
  // Safety information
  immediateAction: string;    // What to do right now
  survivalTips: string[];     // Array of survival tips (was: survival)
  funFact: string;           // Darkly humorous fact (was: finalWords)
  
  // Classification
  category: string;          // Item category
  analysisMethod?: string;   // How it was analyzed
  
  // Legacy compatibility
  label?: string;            // For backward compatibility
  lethalDose?: string;       // Lethal dose information
  allowCorrection?: boolean; // Whether user can correct
  needsTraining?: boolean;   // Whether AI needs training
  source?: string;           // Data source
  survival?: string;         // Legacy survival info
  timeToDeath?: string;      // Legacy time to death
  finalWords?: string;       // Legacy final words
  usdaInfo?: any;           // USDA data
  chemicalInfo?: any;       // Chemical data
  fdaInfo?: any;            // FDA data
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
}