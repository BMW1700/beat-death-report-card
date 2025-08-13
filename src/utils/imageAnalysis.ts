import { pipeline, env } from '@huggingface/transformers';
import { searchFDADrugs, searchUSDAFood, searchPubChem, speakWarning, lookupProductByBarcode } from './apiServices';

// Configure transformers.js to use browser cache and download models
env.allowLocalModels = false;
env.useBrowserCache = true;

// Initialize pipelines
let foodClassifier: any = null;
let generalClassifier: any = null;

// Food safety database - toxic foods and danger levels
const FOOD_TOXICITY_DB = {
  // Highly toxic foods
  'chocolate': { toxicityLevel: 85, reason: 'Contains theobromine which can be fatal in large amounts', lethalDose: '150-300mg per kg body weight' },
  'mushroom': { toxicityLevel: 95, reason: 'Many wild mushrooms are deadly poisonous', lethalDose: 'Single bite of wrong species' },
  'cherry': { toxicityLevel: 60, reason: 'Cherry pits contain cyanide', lethalDose: '1-2 crushed pits per kg body weight' },
  'apple': { toxicityLevel: 40, reason: 'Apple seeds contain amygdalin (releases cyanide)', lethalDose: '200+ apple seeds' },
  'almond': { toxicityLevel: 70, reason: 'Bitter almonds contain high cyanide levels', lethalDose: '50-100 bitter almonds' },
  'potato': { toxicityLevel: 55, reason: 'Green potatoes contain solanine', lethalDose: '2-5mg per kg body weight' },
  'tomato': { toxicityLevel: 35, reason: 'Green tomatoes and leaves contain solanine', lethalDose: '400-500mg solanine' },
  'rhubarb': { toxicityLevel: 80, reason: 'Leaves contain oxalic acid', lethalDose: '11 pounds of leaves' },
  'nutmeg': { toxicityLevel: 75, reason: 'Contains myristicin - hallucinogenic and toxic', lethalDose: '5-10 grams' },
  'coffee': { toxicityLevel: 65, reason: 'Caffeine overdose', lethalDose: '10 grams caffeine (150 cups)' },
  
  // Common foods with moderate toxicity
  'onion': { toxicityLevel: 30, reason: 'Can cause hemolytic anemia in large amounts', lethalDose: '5g per kg body weight' },
  'garlic': { toxicityLevel: 25, reason: 'Can cause gastrointestinal upset in large amounts', lethalDose: '15-30 cloves at once' },
  'spinach': { toxicityLevel: 45, reason: 'High oxalate content can cause kidney stones', lethalDose: '11kg in one sitting' },
  'tuna': { toxicityLevel: 50, reason: 'Mercury poisoning from overconsumption', lethalDose: '7+ cans daily for weeks' },
  'water': { toxicityLevel: 15, reason: 'Water intoxication (hyponatremia)', lethalDose: '6 liters in 3 hours' },
  'salt': { toxicityLevel: 90, reason: 'Sodium poisoning', lethalDose: '1 gram per kg body weight' },
  'sugar': { toxicityLevel: 35, reason: 'Hyperglycemic shock in massive doses', lethalDose: '13.5 grams per kg body weight' },
  'honey': { toxicityLevel: 40, reason: 'Botulism risk, sugar overdose', lethalDose: '40kg honey consumption' },
  'avocado': { toxicityLevel: 20, reason: 'Persin toxicity (mostly for animals)', lethalDose: 'Very high for humans' },
  'banana': { toxicityLevel: 25, reason: 'Potassium overdose', lethalDose: '400+ bananas at once' },
};

const OBJECT_TOXICITY_DB = {
  // Household items
  'battery': { toxicityLevel: 95, reason: 'Battery acid and heavy metals', lethalDose: 'Single button battery' },
  'bleach': { toxicityLevel: 99, reason: 'Caustic burns and chlorine poisoning', lethalDose: '200-300ml' },
  'detergent': { toxicityLevel: 85, reason: 'Corrosive chemicals', lethalDose: '30-50ml concentrated' },
  'medicine': { toxicityLevel: 80, reason: 'Drug overdose', lethalDose: 'Varies by medication' },
  'perfume': { toxicityLevel: 70, reason: 'Alcohol poisoning and toxic chemicals', lethalDose: '100-200ml' },
  'nail_polish': { toxicityLevel: 75, reason: 'Acetone and toxic solvents', lethalDose: '100ml' },
  'paint': { toxicityLevel: 85, reason: 'Heavy metals and volatile organic compounds', lethalDose: '50-100ml' },
  'cleaning_product': { toxicityLevel: 90, reason: 'Various toxic chemicals', lethalDose: '50-200ml' },
  'insecticide': { toxicityLevel: 95, reason: 'Neurotoxins', lethalDose: '10-50ml' },
  'rat_poison': { toxicityLevel: 99, reason: 'Anticoagulants or neurotoxins', lethalDose: '5-20g' },
};

// Heuristic hazard inference for any detected label
export const inferHazardMechanism = (rawLabel: string): string => {
  const label = (rawLabel || '').toLowerCase();
  const rules: Array<[RegExp, string]> = [
    [/phone|cell(ular)?|smartphone/, 'Primary risks are lithium‑ion battery burns or explosion, chemical injury if the battery leaks, electrical shock from damaged chargers, and distraction-related accidents.'],
    [/battery|button\s*battery|lithium/, 'If swallowed, causes rapid tissue necrosis and perforation; leaking contents cause severe chemical burns and heavy‑metal poisoning.'],
    [/charger|power\s*cord|cable|wire/, 'Risk of electrocution from damaged insulation and strangulation/asphyxiation from cords.'],
    [/plastic\s*bag/, 'Asphyxiation/suffocation by blocking airflow over mouth and nose.'],
    [/coin|marble|bead|lego|small\s*object/, 'Airway obstruction (choking), or bowel obstruction if swallowed.'],
    [/magnet/, 'Multiple magnets can clamp intestinal walls together after ingestion, leading to perforation, sepsis, and death.'],
    [/detergent|pod|bleach|cleaner|ammonia/, 'Caustic burns to mouth, esophagus, and stomach; inhalation can cause airway injury. Mixing bleach with ammonia releases chlorine gas.'],
    [/alcohol|ethanol|hand\s*sanitizer|methanol|isopropyl/, 'Central nervous system depression leading to respiratory failure; methanol can cause blindness and metabolic acidosis.'],
    [/caffeine|coffee|energy\s*drink|pre\s*workout|tea/, 'Caffeine toxicity triggers dangerous cardiac arrhythmias, seizures, and cardiovascular collapse.'],
    [/mushroom|toadstool/, 'Certain species contain amatoxins that cause fulminant hepatic failure after a deceptive symptom‑free period.'],
    [/plant|leaf|berry|seed|pit|stone\s*fruit|cherry|apple\s*seed/, 'Some plants/pits contain cyanogenic glycosides or alkaloids causing cardiac or neurologic collapse.'],
    [/knife|blade|scissor|razor|glass|shard/, 'Traumatic laceration and hemorrhage leading to shock.'],
    [/water/, 'Drowning or water intoxication (hyponatremia) if consumed in extreme volumes.'],
    [/spray|insecticide|pesticide|rat\s*poison|rodenticide/, 'Neurotoxic or anticoagulant effects leading to seizures or fatal bleeding.'],
  ];
  for (const [pattern, text] of rules) {
    if (pattern.test(label)) return text;
  }
  return 'Unlikely inherently toxic; primary dangers are choking/asphyxiation, blunt trauma, burns, electrical shock, or chemical exposure depending on use.';
};

export const initializeImageAnalysis = async () => {
  try {
    console.log('Initializing AI image analysis...');
    
    // Use reliable, lightweight models that definitely exist
    try {
      // Try WebGPU first
      generalClassifier = await pipeline(
        'image-classification',
        'Xenova/vit-base-patch16-224',
        { device: 'webgpu' }
      );
      
      console.log('AI image analysis initialized successfully with WebGPU!');
      return true;
    } catch (webgpuError) {
      console.log('WebGPU not available, falling back to CPU...');
      
      try {
        // Fallback to CPU with a reliable model
        generalClassifier = await pipeline(
          'image-classification',
          'Xenova/vit-base-patch16-224'
        );
        
        console.log('AI image analysis initialized on CPU!');
        return true;
      } catch (cpuError) {
        console.log('Lightweight model fallback...');
        
        try {
          // Final fallback to mobilenet
          generalClassifier = await pipeline(
            'image-classification',
            'Xenova/mobilenet_v2_1.0_224'
          );
          
          console.log('AI image analysis initialized with MobileNet!');
          return true;
        } catch (finalError) {
          console.error('All AI models failed to load:', finalError);
          return false;
        }
      }
    }
  } catch (error) {
    console.error('Failed to initialize image analysis:', error);
    return false;
  }
};

// Community database for user-contributed training data
let communityDatabase: Array<{
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  category: 'food' | 'object' | 'tool' | 'plant' | 'other';
  deathAnalysis?: {
    killRating: number;
    lethalDose: string;
    timeToDeath: string;
    mechanism: string;
    survival: string;
    finalWords: string;
    allergyRisk: string;
  };
}> = [];

// Function to add community item for training
export const addCommunityTrainingData = (item: any) => {
  communityDatabase.push(item);
  console.log('Added community training data:', item.name);
};

// Function to check community database first
const checkCommunityDatabase = async (imageFile: File, classificationResults: any[]) => {
  // Simple image similarity check based on classification results
  for (const communityItem of communityDatabase) {
    for (const result of classificationResults) {
      const itemName = result.label.toLowerCase();
      const communityName = communityItem.name.toLowerCase();
      
      // Check for matches (including partial matches and variations)
      if (itemName.includes(communityName) || 
          communityName.includes(itemName) ||
          itemName.replace(/[^a-z]/g, '').includes(communityName.replace(/[^a-z]/g, '')) ||
          communityName.replace(/[^a-z]/g, '').includes(itemName.replace(/[^a-z]/g, ''))) {
        
        if (communityItem.deathAnalysis) {
          return {
            label: communityItem.name,
            confidence: result.score * 0.9, // Slightly lower confidence for community data
            toxicityLevel: communityItem.deathAnalysis.killRating,
            reason: communityItem.deathAnalysis.mechanism,
            lethalDose: communityItem.deathAnalysis.lethalDose,
            category: communityItem.category as 'food' | 'object' | 'unknown' | 'medication',
            timeToDeath: communityItem.deathAnalysis.timeToDeath,
            survival: communityItem.deathAnalysis.survival,
            finalWords: communityItem.deathAnalysis.finalWords,
            allergyRisk: communityItem.deathAnalysis.allergyRisk,
            source: 'community'
          };
        }
      }
    }
  }
  return null;
};

export const analyzeImageForToxicity = async (imageFile: File): Promise<{
  detectedItems: Array<{
    label: string;
    confidence: number;
    toxicityLevel: number;
    reason: string;
    lethalDose: string;
    category: 'food' | 'object' | 'unknown' | 'medication';
    usdaInfo?: any;
    chemicalInfo?: any;
    fdaInfo?: any;
    timeToDeath?: string;
    survival?: string;
    finalWords?: string;
    allergyRisk?: string;
    source?: string;
  }>;
  overallRisk: number;
  recommendations: string[];
}> => {
  try {
    console.log('Analyzing image for toxicity...');
    
    // Initialize AI if not ready
    if (!generalClassifier) {
      const initialized = await initializeImageAnalysis();
      if (!initialized) {
        console.warn('AI not available, using manual analysis...');
        return analyzeImageManually(imageFile);
      }
    }
    
    // Convert file to image URL for analysis
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Use the general classifier for all objects
    const classificationResults = await generalClassifier(imageUrl);
    
    console.log('AI Classification results:', classificationResults);
    
    // Check community database first for user-contributed training data
    const communityMatch = await checkCommunityDatabase(imageFile, classificationResults);
    
    const detectedItems: any[] = [];
    let maxRisk = 0;
    
    // If we found a community match, prioritize it
    if (communityMatch) {
      detectedItems.push(communityMatch);
      maxRisk = Math.max(maxRisk, communityMatch.toxicityLevel);
      console.log('Found community match:', communityMatch.label);
    }
    
    // Process AI classification results
    for (const result of classificationResults.slice(0, 5)) {
      const itemName = result.label.toLowerCase();
      const confidence = result.score;
      
      // Check foods first
      for (const [food, data] of Object.entries(FOOD_TOXICITY_DB)) {
        if (itemName.includes(food) || food.includes(itemName) ||
            itemName.includes(food.replace('_', ' ')) || 
            food.replace('_', ' ').includes(itemName)) {
          const adjustedToxicity = data.toxicityLevel * confidence;
          
          // Enhance with USDA data
          const usdaData = await searchUSDAFood(result.label);
          
          detectedItems.push({
            label: result.label,
            confidence: confidence,
            toxicityLevel: adjustedToxicity,
            reason: data.reason,
            lethalDose: data.lethalDose,
            category: 'food' as const,
            usdaInfo: usdaData[0] || null
          });
          maxRisk = Math.max(maxRisk, adjustedToxicity);
          break;
        }
      }
      
      // Check objects/chemicals
      for (const [object, data] of Object.entries(OBJECT_TOXICITY_DB)) {
        if (itemName.includes(object) || object.includes(itemName) || 
            itemName.includes(object.replace('_', ' ')) || 
            object.replace('_', ' ').includes(itemName)) {
          const adjustedToxicity = data.toxicityLevel * confidence;
          
          // Enhance with PubChem data for chemicals
          const pubchemData = await searchPubChem(result.label);
          
          detectedItems.push({
            label: result.label,
            confidence: confidence,
            toxicityLevel: adjustedToxicity,
            reason: data.reason,
            lethalDose: data.lethalDose,
            category: 'object' as const,
            chemicalInfo: pubchemData
          });
          maxRisk = Math.max(maxRisk, adjustedToxicity);
          break;
        }
      }

      // Check if it might be a medication
      if (itemName.includes('pill') || itemName.includes('tablet') || 
          itemName.includes('capsule') || itemName.includes('medicine') ||
          itemName.includes('drug') || itemName.includes('pharmaceutical')) {
        const fdaData = await searchFDADrugs(result.label);
        
        detectedItems.push({
          label: result.label,
          confidence: confidence,
          toxicityLevel: 75, // High risk for unidentified pills
          reason: 'Unidentified medication - potential overdose or interaction risk',
          lethalDose: 'Varies by medication - consult medical professional',
          category: 'medication' as const,
          fdaInfo: fdaData[0] || null
        });
        maxRisk = Math.max(maxRisk, 75);
      }
    }
    
    // If no toxic items found, add the most confident classifications as unknown
    if (detectedItems.length === 0) {
      const topResult = classificationResults[0];
      detectedItems.push({
        label: topResult.label,
        confidence: topResult.score,
        toxicityLevel: 10, // Low default toxicity
        reason: inferHazardMechanism(topResult.label),
        lethalDose: 'Exposure-dependent; see mechanism',
        category: 'unknown' as const
      });
      maxRisk = 10;
    }

    // Speak warning for high-risk items
    if (maxRisk >= 80) {
      speakWarning(`DANGER! High risk item detected. Do not consume or touch.`, true);
    } else if (maxRisk >= 60) {
      speakWarning(`Warning: Potentially dangerous item detected. Exercise caution.`);
    }
    
    // Generate recommendations
    const recommendations = generateRecommendations(maxRisk, detectedItems);
    
    // Clean up the blob URL
    URL.revokeObjectURL(imageUrl);
    
    return {
      detectedItems: detectedItems.sort((a, b) => b.toxicityLevel - a.toxicityLevel),
      overallRisk: maxRisk,
      recommendations
    };
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    // Fallback to manual analysis if AI fails
    return analyzeImageManually(imageFile);
  }
};

// Manual analysis fallback when AI is not available
const analyzeImageManually = async (imageFile: File) => {
  console.log('Using manual analysis fallback...');
  
  // Analyze filename for clues
  const filename = imageFile.name.toLowerCase();
  const detectedItems: any[] = [];
  let maxRisk = 0;
  
  // Check filename against our databases
  for (const [food, data] of Object.entries(FOOD_TOXICITY_DB)) {
    if (filename.includes(food)) {
      detectedItems.push({
        label: `Possibly ${food}`,
        confidence: 0.7,
        toxicityLevel: data.toxicityLevel * 0.7,
        reason: data.reason,
        lethalDose: data.lethalDose,
        category: 'food' as const
      });
      maxRisk = Math.max(maxRisk, data.toxicityLevel * 0.7);
    }
  }
  
  for (const [object, data] of Object.entries(OBJECT_TOXICITY_DB)) {
    if (filename.includes(object.replace('_', ' ')) || filename.includes(object)) {
      detectedItems.push({
        label: `Possibly ${object.replace('_', ' ')}`,
        confidence: 0.7,
        toxicityLevel: data.toxicityLevel * 0.7,
        reason: data.reason,
        lethalDose: data.lethalDose,
        category: 'object' as const
      });
      maxRisk = Math.max(maxRisk, data.toxicityLevel * 0.7);
    }
  }
  
  // If nothing detected, provide generic warning
  if (detectedItems.length === 0) {
    detectedItems.push({
      label: 'Unknown Item',
      confidence: 0.5,
      toxicityLevel: 50,
      reason: inferHazardMechanism(filename),
      lethalDose: 'Exposure-dependent; see mechanism',
      category: 'unknown' as const
    });
    maxRisk = 50;
  }
  
  const recommendations = generateRecommendations(maxRisk, detectedItems);
  
  return {
    detectedItems: detectedItems.sort((a, b) => b.toxicityLevel - a.toxicityLevel),
    overallRisk: maxRisk,
    recommendations
  };
};

const generateRecommendations = (riskLevel: number, items: any[]): string[] => {
  const recommendations: string[] = [];
  
  if (riskLevel >= 90) {
    recommendations.push('🚨 EXTREME DANGER - DO NOT CONSUME OR HANDLE');
    recommendations.push('☎️ Contact Poison Control immediately: 1-800-222-1222');
    recommendations.push('🏥 Seek emergency medical attention if exposure occurred');
  } else if (riskLevel >= 70) {
    recommendations.push('⚠️ HIGH TOXICITY - Avoid consumption');
    recommendations.push('🩺 Consult healthcare provider if consumed');
    recommendations.push('📱 Keep Poison Control number handy: 1-800-222-1222');
  } else if (riskLevel >= 50) {
    recommendations.push('⚡ MODERATE RISK - Use extreme caution');
    recommendations.push('📏 Pay attention to dosage and frequency');
    recommendations.push('👨‍⚕️ Consult doctor about safe consumption limits');
  } else if (riskLevel >= 30) {
    recommendations.push('🔸 LOW-MODERATE RISK - Generally safe in normal amounts');
    recommendations.push('⚖️ Monitor portion sizes and frequency');
  } else {
    recommendations.push('✅ RELATIVELY SAFE - Low toxicity risk');
    recommendations.push('😊 Enjoy in moderation as part of balanced lifestyle');
  }
  
  // Add specific recommendations based on detected items
  const hasFood = items.some(item => item.category === 'food');
  const hasObject = items.some(item => item.category === 'object');
  
  if (hasFood) {
    recommendations.push('🍎 Food Safety: Check for spoilage and proper preparation');
  }
  
  if (hasObject) {
    recommendations.push('🏠 Household Safety: Keep away from children and pets');
    recommendations.push('🧤 Use protective equipment when handling');
  }
  
  return recommendations;
};

export const generateDeathAnalysisReport = (
  analysisData: any,
  userWeight: number,
  scenario?: string
): {
  deathScore: number;
  timeToImpact: string;
  symptoms: string[];
  survivalTips: string[];
  finalWords: string;
} => {
  const { detectedItems, overallRisk } = analysisData;
  
  // Calculate death score based on toxicity and user weight
  let baseDeathScore = overallRisk;
  
  // Adjust for user weight (lower weight = higher risk)
  const weightFactor = userWeight < 70 ? 1.3 : userWeight > 100 ? 0.8 : 1.0;
  baseDeathScore *= weightFactor;
  
  // Cap at 100
  const deathScore = Math.min(100, Math.round(baseDeathScore));
  
  // Generate time to impact based on toxicity level
  let timeToImpact = '';
  if (deathScore >= 90) {
    timeToImpact = '⚡ Minutes to hours';
  } else if (deathScore >= 70) {
    timeToImpact = '🕐 Hours to days';
  } else if (deathScore >= 50) {
    timeToImpact = '📅 Days to weeks';
  } else if (deathScore >= 30) {
    timeToImpact = '📆 Weeks to months';
  } else {
    timeToImpact = '🌟 Unlikely in normal lifetime';
  }
  
  // Generate symptoms based on detected items
  const symptoms: string[] = [];
  const mostToxic = detectedItems[0];
  
  if (mostToxic) {
    if (mostToxic.category === 'food') {
      symptoms.push('🤢 Nausea and vomiting');
      symptoms.push('🤲 Abdominal pain');
      symptoms.push('😵 Dizziness and confusion');
      if (deathScore >= 70) {
        symptoms.push('💓 Irregular heartbeat');
        symptoms.push('🫁 Difficulty breathing');
      }
    } else if (mostToxic.category === 'object') {
      symptoms.push('🔥 Burning sensation');
      symptoms.push('🤮 Severe nausea');
      symptoms.push('😵‍💫 Neurological symptoms');
      if (deathScore >= 80) {
        symptoms.push('💔 Organ failure');
        symptoms.push('🧠 Altered consciousness');
      }
    }
  }
  
  // Add common high-toxicity symptoms
  if (deathScore >= 60) {
    symptoms.push('🌡️ Fever or hypothermia');
    symptoms.push('💤 Extreme fatigue');
  }
  
  // Generate survival tips
  const survivalTips: string[] = [];
  
  if (deathScore >= 80) {
    survivalTips.push('🚨 Call 911 immediately');
    survivalTips.push('🤮 Do NOT induce vomiting unless instructed');
    survivalTips.push('💧 Rinse mouth with water if safe to do so');
  } else if (deathScore >= 50) {
    survivalTips.push('☎️ Contact Poison Control: 1-800-222-1222');
    survivalTips.push('💊 Follow medical professional guidance');
    survivalTips.push('👀 Monitor symptoms closely');
  } else {
    survivalTips.push('🏥 Seek medical advice if symptoms appear');
    survivalTips.push('📝 Document what was consumed and when');
    survivalTips.push('💧 Stay hydrated');
  }
  
  survivalTips.push('📱 Save this report for medical professionals');
  
  // Generate dramatic final words based on death score
  let finalWords = '';
  if (deathScore >= 95) {
    finalWords = '💀 "Tell my family I love them... and that I should have read the warning labels."';
  } else if (deathScore >= 80) {
    finalWords = '😵 "I can see the light... it\'s probably just the hospital fluorescents."';
  } else if (deathScore >= 60) {
    finalWords = '🤒 "I\'m not feeling so good... maybe I should call in sick tomorrow."';
  } else if (deathScore >= 30) {
    finalWords = '😐 "Well, that was mildly concerning. Time for some antacids."';
  } else {
    finalWords = '😊 "False alarm! Looks like I\'ll live to make more questionable life choices."';
  }
  
  return {
    deathScore,
    timeToImpact,
    symptoms,
    survivalTips,
    finalWords
  };
};