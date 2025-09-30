/**
 * Life Expectancy Calculator
 * Calculates personalized baseline life expectancy based on comprehensive health data
 * Uses research-backed multipliers for various health and lifestyle factors
 */

interface HealthData {
  age: number;
  sex: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  
  // Exercise
  exerciseFrequency?: 'daily' | '3-5x_week' | '1-2x_week' | 'rarely' | 'never';
  exerciseIntensity?: 'high' | 'moderate' | 'light' | 'none';
  exerciseHistoryYears?: number;
  
  // Diet & Nutrition
  dietQualityScore?: number; // 1-10
  
  // Sleep
  sleepHoursAvg?: number;
  sleepQualityScore?: number; // 1-10
  
  // Mental Health
  stressLevel?: number; // 1-10 (10 is most stressed)
  happinessScore?: number; // 1-10
  socialConnectionsScore?: number; // 1-10
  lifeSatisfactionScore?: number; // 1-10
  
  // Substance Use
  smokingStatus?: 'never' | 'former' | 'current_light' | 'current_heavy';
  alcoholFrequency?: 'never' | 'rarely' | 'moderate' | 'heavy';
  
  // Medical
  chronicConditionsCount?: number;
  medicationCount?: number;
}

const BASE_LIFE_EXPECTANCY = {
  male: 76,
  female: 81,
  other: 78
};

export function calculateLifeExpectancy(data: HealthData): {
  baselineYears: number;
  healthScore: number;
  factors: Array<{ category: string; impact: number; description: string }>;
} {
  const factors: Array<{ category: string; impact: number; description: string }> = [];
  
  // Start with age-adjusted baseline
  const baseExpectancy = BASE_LIFE_EXPECTANCY[data.sex] || 78;
  const remainingYears = Math.max(0, baseExpectancy - data.age);
  let adjustedYears = remainingYears;
  
  // BMI calculation and impact
  if (data.weight && data.height) {
    const heightM = data.height / 100;
    const bmi = data.weight / (heightM * heightM);
    
    if (bmi < 18.5) {
      adjustedYears -= 2;
      factors.push({ category: 'BMI', impact: -2, description: 'Underweight' });
    } else if (bmi >= 25 && bmi < 30) {
      adjustedYears -= 1;
      factors.push({ category: 'BMI', impact: -1, description: 'Overweight' });
    } else if (bmi >= 30) {
      adjustedYears -= 3;
      factors.push({ category: 'BMI', impact: -3, description: 'Obese' });
    } else {
      adjustedYears += 1;
      factors.push({ category: 'BMI', impact: 1, description: 'Healthy weight' });
    }
  }
  
  // Exercise impact (major factor)
  if (data.exerciseFrequency) {
    const exerciseImpact = {
      'daily': 5,
      '3-5x_week': 4,
      '1-2x_week': 2,
      'rarely': -1,
      'never': -3
    }[data.exerciseFrequency];
    
    adjustedYears += exerciseImpact;
    factors.push({ 
      category: 'Exercise', 
      impact: exerciseImpact, 
      description: `Exercise ${data.exerciseFrequency.replace('_', ' ')}` 
    });
  }
  
  // Exercise intensity bonus
  if (data.exerciseIntensity && data.exerciseFrequency !== 'never') {
    const intensityBonus = {
      'high': 1.5,
      'moderate': 1,
      'light': 0.5,
      'none': 0
    }[data.exerciseIntensity];
    
    adjustedYears += intensityBonus;
    factors.push({ 
      category: 'Exercise Intensity', 
      impact: intensityBonus, 
      description: `${data.exerciseIntensity} intensity` 
    });
  }
  
  // Diet quality impact
  if (data.dietQualityScore) {
    const dietImpact = (data.dietQualityScore - 5) * 0.5; // -2.5 to +2.5 years
    adjustedYears += dietImpact;
    factors.push({ 
      category: 'Diet', 
      impact: dietImpact, 
      description: `Diet quality: ${data.dietQualityScore}/10` 
    });
  }
  
  // Sleep impact (crucial)
  if (data.sleepHoursAvg) {
    let sleepImpact = 0;
    if (data.sleepHoursAvg < 6) {
      sleepImpact = -2;
    } else if (data.sleepHoursAvg < 7) {
      sleepImpact = -1;
    } else if (data.sleepHoursAvg >= 7 && data.sleepHoursAvg <= 8) {
      sleepImpact = 2;
    } else if (data.sleepHoursAvg > 9) {
      sleepImpact = -1;
    }
    
    adjustedYears += sleepImpact;
    factors.push({ 
      category: 'Sleep', 
      impact: sleepImpact, 
      description: `${data.sleepHoursAvg} hours average` 
    });
  }
  
  // Sleep quality
  if (data.sleepQualityScore) {
    const qualityImpact = (data.sleepQualityScore - 5) * 0.3;
    adjustedYears += qualityImpact;
    factors.push({ 
      category: 'Sleep Quality', 
      impact: qualityImpact, 
      description: `Quality: ${data.sleepQualityScore}/10` 
    });
  }
  
  // Mental health (happiness, stress, social connections)
  if (data.happinessScore) {
    const happinessImpact = (data.happinessScore - 5) * 0.4;
    adjustedYears += happinessImpact;
    factors.push({ 
      category: 'Happiness', 
      impact: happinessImpact, 
      description: `Happiness: ${data.happinessScore}/10` 
    });
  }
  
  if (data.stressLevel) {
    const stressImpact = (5 - data.stressLevel) * 0.3; // Lower stress is better
    adjustedYears += stressImpact;
    factors.push({ 
      category: 'Stress', 
      impact: stressImpact, 
      description: `Stress level: ${data.stressLevel}/10` 
    });
  }
  
  if (data.socialConnectionsScore) {
    const socialImpact = (data.socialConnectionsScore - 5) * 0.5;
    adjustedYears += socialImpact;
    factors.push({ 
      category: 'Social', 
      impact: socialImpact, 
      description: `Social connections: ${data.socialConnectionsScore}/10` 
    });
  }
  
  // Smoking (major negative factor)
  if (data.smokingStatus) {
    const smokingImpact = {
      'never': 2,
      'former': 0,
      'current_light': -5,
      'current_heavy': -10
    }[data.smokingStatus];
    
    adjustedYears += smokingImpact;
    factors.push({ 
      category: 'Smoking', 
      impact: smokingImpact, 
      description: `Smoking: ${data.smokingStatus}` 
    });
  }
  
  // Alcohol
  if (data.alcoholFrequency) {
    const alcoholImpact = {
      'never': 1,
      'rarely': 0.5,
      'moderate': -0.5,
      'heavy': -4
    }[data.alcoholFrequency];
    
    adjustedYears += alcoholImpact;
    factors.push({ 
      category: 'Alcohol', 
      impact: alcoholImpact, 
      description: `Alcohol: ${data.alcoholFrequency}` 
    });
  }
  
  // Chronic conditions
  if (data.chronicConditionsCount) {
    const conditionsImpact = -data.chronicConditionsCount * 1.5;
    adjustedYears += conditionsImpact;
    factors.push({ 
      category: 'Health Conditions', 
      impact: conditionsImpact, 
      description: `${data.chronicConditionsCount} chronic condition(s)` 
    });
  }
  
  // Medications (indicator of health issues)
  if (data.medicationCount && data.medicationCount > 0) {
    const medImpact = -Math.min(data.medicationCount * 0.5, 3);
    adjustedYears += medImpact;
    factors.push({ 
      category: 'Medications', 
      impact: medImpact, 
      description: `Taking ${data.medicationCount} medication(s)` 
    });
  }
  
  // Calculate final baseline (minimum 1 year, maximum 100 years from now)
  const finalBaseline = Math.max(data.age + 1, Math.min(data.age + 100, data.age + Math.round(adjustedYears)));
  
  // Calculate health score (0-100)
  const totalImpact = factors.reduce((sum, f) => sum + f.impact, 0);
  const healthScore = Math.max(0, Math.min(100, 50 + totalImpact * 2));
  
  return {
    baselineYears: finalBaseline,
    healthScore: Math.round(healthScore),
    factors
  };
}

export function getDataMonetizationValue(consentLevel: string, healthScore: number): number {
  const baseValues = {
    'none': 0,
    'bronze': 3,
    'silver': 15,
    'gold': 60
  };
  
  const base = baseValues[consentLevel as keyof typeof baseValues] || 0;
  
  // Higher health scores are more valuable (indicates engagement and data quality)
  const qualityMultiplier = 0.5 + (healthScore / 100);
  
  return Math.round(base * qualityMultiplier);
}
