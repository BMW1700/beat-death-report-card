export interface UserData {
  weight: string;
  weightUnit: "lbs" | "kg";
  allergies: string;
  age: string;
  gender: string;
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
}