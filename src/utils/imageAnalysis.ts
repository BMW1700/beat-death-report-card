import { pipeline, env } from '@huggingface/transformers';
import { searchFDADrugs, searchUSDAFood, searchPubChem, speakWarning, lookupProductByBarcode } from './apiServices';

// Configure transformers.js to use browser cache and download models
env.allowLocalModels = false;
env.useBrowserCache = true;

// Initialize multiple AI pipelines for better accuracy
let foodClassifier: any = null;
let generalClassifier: any = null;
let objectClassifier: any = null;
let toxicityClassifier: any = null;

// Define confidence thresholds for better accuracy
const CONFIDENCE_THRESHOLDS = {
  MINIMUM_DETECTION: 15, // Reject anything below this
  LOW_CONFIDENCE: 30,    // Warn user about low confidence
  GOOD_CONFIDENCE: 60,   // Acceptable confidence
  HIGH_CONFIDENCE: 80    // High confidence detection
};

// Food safety database - toxic foods and danger levels
const FOOD_TOXICITY_DB = {
  // Highly toxic foods
  'chocolate': { 
    toxicityLevel: 85, 
    reason: 'Contains theobromine which can be fatal in large amounts', 
    lethalDose: '150-300mg per kg body weight',
    survival: 'IMMEDIATE: Induce vomiting if conscious. Call Poison Control (1-800-222-1222). Drink fluids to dilute. Seek emergency care immediately. DO NOT wait for symptoms.',
    timeToDeath: '2-12 hours depending on amount',
    finalWords: 'Death by chocolate was not supposed to be literal...'
  },
  'mushroom': { 
    toxicityLevel: 95, 
    reason: 'Many wild mushrooms are deadly poisonous', 
    lethalDose: 'Single bite of wrong species',
    survival: 'CRITICAL: Call 911 immediately. Save mushroom sample for identification. Induce vomiting only if instructed by medical professional. Time is life.',
    timeToDeath: '6-16 hours (deceptive symptom-free period)',
    finalWords: 'Fungi were supposed to be fun guys...'
  },
  'cherry': { 
    toxicityLevel: 60, 
    reason: 'Cherry pits contain cyanide', 
    lethalDose: '1-2 crushed pits per kg body weight',
    survival: 'If pits were chewed: Induce vomiting immediately. Call Poison Control. Administer oxygen if available. Seek emergency care for cyanide antidote kit.',
    timeToDeath: '15 minutes to 2 hours',
    finalWords: 'Life was the pits anyway...'
  },
  'apple': { 
    toxicityLevel: 40, 
    reason: 'Apple seeds contain amygdalin (releases cyanide)', 
    lethalDose: '200+ apple seeds',
    survival: 'Only dangerous if seeds are chewed/crushed. If large amount consumed: Induce vomiting, drink milk, call Poison Control. Monitor breathing.',
    timeToDeath: '30 minutes to 3 hours',
    finalWords: 'An apple a day keeps everyone away... permanently'
  },
  'almond': { 
    toxicityLevel: 70, 
    reason: 'Bitter almonds contain high cyanide levels', 
    lethalDose: '50-100 bitter almonds',
    survival: 'IMMEDIATE: Induce vomiting. Call 911. Give oxygen if available. Do NOT drink alcohol. Prepare for cyanide antidote treatment.',
    timeToDeath: '15 minutes to 1 hour',
    finalWords: 'Nuts about dying today...'
  },
  'potato': { 
    toxicityLevel: 55, 
    reason: 'Green potatoes contain solanine', 
    lethalDose: '2-5mg per kg body weight',
    survival: 'Remove green parts before eating. If consumed: Induce vomiting, drink lots of water, seek medical attention for IV fluids and monitoring.',
    timeToDeath: '8-24 hours',
    finalWords: 'This spud\'s for you... literally'
  },
  'tomato': { 
    toxicityLevel: 35, 
    reason: 'Green tomatoes and leaves contain solanine', 
    lethalDose: '400-500mg solanine',
    survival: 'Usually mild. Drink milk or water to dilute. Rest and monitor symptoms. Seek care if severe GI distress develops.',
    timeToDeath: 'Rarely fatal',
    finalWords: 'Say it ain\'t so, mato...'
  },
  'rhubarb': { 
    toxicityLevel: 80, 
    reason: 'Leaves contain oxalic acid', 
    lethalDose: '11 pounds of leaves',
    survival: 'If leaves consumed: Drink calcium-rich liquids (milk). Induce vomiting. Call Poison Control. Monitor for kidney damage.',
    timeToDeath: '6-12 hours',
    finalWords: 'Rhubarb and die...'
  },
  'nutmeg': { 
    toxicityLevel: 75, 
    reason: 'Contains myristicin - hallucinogenic and toxic', 
    lethalDose: '5-10 grams',
    survival: 'Call Poison Control immediately. Do NOT induce vomiting. Keep person calm and hydrated. Monitor for seizures. Seek emergency care.',
    timeToDeath: '3-8 hours',
    finalWords: 'Spice is not always nice...'
  },
  'coffee': { 
    toxicityLevel: 65, 
    reason: 'Caffeine overdose', 
    lethalDose: '10 grams caffeine (150 cups)',
    survival: 'Stop caffeine intake. Drink water to flush system. Seek medical care for heart monitoring. May need activated charcoal or IV fluids.',
    timeToDeath: '6-12 hours',
    finalWords: 'Death before decaf was taken too literally...'
  },
  
  // Common foods with moderate toxicity
  'onion': { 
    toxicityLevel: 30, 
    reason: 'Can cause hemolytic anemia in large amounts', 
    lethalDose: '5g per kg body weight',
    survival: 'Usually not dangerous to humans. If severe symptoms: Seek medical evaluation for blood count monitoring.',
    timeToDeath: 'Days to weeks',
    finalWords: 'This really made me cry...'
  },
  'garlic': { 
    toxicityLevel: 25, 
    reason: 'Can cause gastrointestinal upset in large amounts', 
    lethalDose: '15-30 cloves at once',
    survival: 'Drink milk to neutralize. Rest and stay hydrated. Usually resolves within 24 hours without intervention.',
    timeToDeath: 'Rarely fatal',
    finalWords: 'Guess I\'ll never ward off vampires again...'
  },
  'spinach': { 
    toxicityLevel: 45, 
    reason: 'High oxalate content can cause kidney stones', 
    lethalDose: '11kg in one sitting',
    survival: 'Drink lots of water. Take calcium supplements to bind oxalates. Monitor kidney function. Unlikely to be fatal.',
    timeToDeath: 'Rarely fatal',
    finalWords: 'Popeye lied to me...'
  },
  'tuna': { 
    toxicityLevel: 50, 
    reason: 'Mercury poisoning from overconsumption', 
    lethalDose: '7+ cans daily for weeks',
    survival: 'Stop tuna consumption. Increase water intake. Chelation therapy may be needed. Monitor neurological symptoms.',
    timeToDeath: 'Months to years',
    finalWords: 'Should have stuck to chicken of the sea...'
  },
  'water': { 
    toxicityLevel: 15, 
    reason: 'Water intoxication (hyponatremia)', 
    lethalDose: '6 liters in 3 hours',
    survival: 'STOP drinking water. Seek immediate medical care for IV saline solution. May need hospitalization for electrolyte monitoring.',
    timeToDeath: '2-6 hours',
    finalWords: 'Too much of a good thing...'
  },
  'salt': { 
    toxicityLevel: 90, 
    reason: 'Sodium poisoning', 
    lethalDose: '1 gram per kg body weight',
    survival: 'IMMEDIATELY drink large amounts of water to dilute. Call 911. May need IV fluids and kidney dialysis. Monitor brain swelling.',
    timeToDeath: '1-6 hours',
    finalWords: 'Worth my salt, apparently...'
  },
  'sugar': { 
    toxicityLevel: 35, 
    reason: 'Hyperglycemic shock in massive doses', 
    lethalDose: '13.5 grams per kg body weight',
    survival: 'Seek immediate medical care for blood sugar monitoring. May need insulin therapy and IV fluids. Monitor for diabetic coma.',
    timeToDeath: '6-24 hours',
    finalWords: 'Sugar crash was too literal...'
  },
  'honey': { 
    toxicityLevel: 40, 
    reason: 'Botulism risk, sugar overdose', 
    lethalDose: '40kg honey consumption',
    survival: 'For botulism: Seek immediate emergency care for antitoxin. Support breathing. For sugar overdose: Monitor blood glucose.',
    timeToDeath: '24-72 hours for botulism',
    finalWords: 'Bee-n nice knowing you...'
  },
  'avocado': { 
    toxicityLevel: 20, 
    reason: 'Persin toxicity (mostly for animals)', 
    lethalDose: 'Very high for humans',
    survival: 'Generally safe for humans. If allergic reaction: Antihistamines and epinephrine if severe. Monitor breathing.',
    timeToDeath: 'Rarely fatal to humans',
    finalWords: 'Guac and awe...'
  },
  'banana': { 
    toxicityLevel: 25, 
    reason: 'Potassium overdose', 
    lethalDose: '400+ bananas at once',
    survival: 'Monitor heart rhythm. Seek medical care for EKG monitoring. May need treatments to remove excess potassium from blood.',
    timeToDeath: '2-6 hours',
    finalWords: 'This is bananas...'
  },
  'alcohol': { 
    toxicityLevel: 85, 
    reason: 'Ethanol poisoning and respiratory depression', 
    lethalDose: '5-8 drinks per hour',
    survival: 'CRITICAL: Call 911. Keep person awake and upright. Check breathing constantly. Do NOT induce vomiting. IV fluids and monitoring needed.',
    timeToDeath: '30 minutes to 6 hours',
    finalWords: 'Bottoms up was too literal...'
  },
  'fish': { 
    toxicityLevel: 60, 
    reason: 'Scombrotoxin or ciguatoxin poisoning', 
    lethalDose: '100-200g spoiled fish',
    survival: 'Antihistamines for scombroid. Supportive care for ciguatera. Avoid alcohol and nuts which worsen symptoms.',
    timeToDeath: '6-24 hours',
    finalWords: 'Something fishy about this meal...'
  },
  'shellfish': { 
    toxicityLevel: 75, 
    reason: 'Paralytic shellfish poisoning or vibrio bacteria', 
    lethalDose: '4-5 toxic mussels',
    survival: 'IMMEDIATE: Call 911. Support breathing if paralysis develops. Activated charcoal if recent ingestion. May need ventilator.',
    timeToDeath: '2-12 hours',
    finalWords: 'Clammed up permanently...'
  },
  'beans': { 
    toxicityLevel: 55, 
    reason: 'Phytohemagglutinin in raw kidney beans', 
    lethalDose: '4-5 raw kidney beans',
    survival: 'Induce vomiting immediately. Drink lots of water. Seek medical care for IV fluids and monitoring. Symptoms peak at 3 hours.',
    timeToDeath: '12-24 hours',
    finalWords: 'Spilled the beans on myself...'
  },
  'elderberry': { 
    toxicityLevel: 70, 
    reason: 'Cyanogenic glycosides in bark and seeds', 
    lethalDose: '200-400g uncooked berries',
    survival: 'Call Poison Control. Induce vomiting if conscious. Give oxygen if available. Monitor for cyanide poisoning symptoms.',
    timeToDeath: '30 minutes to 4 hours',
    finalWords: 'Elder and wiser... too late'
  },
  'mint': { 
    toxicityLevel: 30, 
    reason: 'Menthol overdose can cause liver damage', 
    lethalDose: '1000mg menthol',
    survival: 'Stop mint consumption. Monitor liver function. Supportive care for symptoms. Usually resolves without treatment.',
    timeToDeath: 'Days to weeks',
    finalWords: 'Mint to be...'
  },
};

const OBJECT_TOXICITY_DB = {
  // Household items
  'battery': { 
    toxicityLevel: 95, 
    reason: 'Battery acid and heavy metals', 
    lethalDose: 'Single button battery',
    survival: 'CRITICAL: Call 911 immediately. Do NOT induce vomiting. Give water or milk if conscious. X-ray needed to locate battery. Emergency surgery may be required.',
    timeToDeath: '2-6 hours for perforation',
    finalWords: 'Energizer bunny stops here...'
  },
  'bleach': { 
    toxicityLevel: 99, 
    reason: 'Caustic burns and chlorine poisoning', 
    lethalDose: '200-300ml',
    survival: 'NEVER induce vomiting. Rinse mouth with water. Drink milk or water to dilute. Call 911. Protect airway. Do NOT mix with other chemicals.',
    timeToDeath: '30 minutes to 2 hours',
    finalWords: 'Guess I really cleaned up...'
  },
  'detergent': { 
    toxicityLevel: 85, 
    reason: 'Corrosive chemicals', 
    lethalDose: '30-50ml concentrated',
    survival: 'Rinse mouth thoroughly. Do NOT induce vomiting. Drink water or milk. Call Poison Control. Monitor breathing for foam buildup.',
    timeToDeath: '1-4 hours',
    finalWords: 'This really cleaned me out...'
  },
  'medicine': { 
    toxicityLevel: 80, 
    reason: 'Drug overdose', 
    lethalDose: 'Varies by medication',
    survival: 'Identify specific medication. Call Poison Control with pill details. May need activated charcoal or gastric lavage. Monitor vital signs.',
    timeToDeath: '30 minutes to 24 hours',
    finalWords: 'The cure became the curse...'
  },
  'perfume': { 
    toxicityLevel: 70, 
    reason: 'Alcohol poisoning and toxic chemicals', 
    lethalDose: '100-200ml',
    survival: 'Induce vomiting if conscious. Call Poison Control. Monitor for alcohol poisoning symptoms. Support breathing and circulation.',
    timeToDeath: '2-8 hours',
    finalWords: 'Smell ya later...'
  },
  'nail_polish': { 
    toxicityLevel: 75, 
    reason: 'Acetone and toxic solvents', 
    lethalDose: '100ml',
    survival: 'Fresh air immediately. Do NOT induce vomiting. Call Poison Control. Monitor breathing for solvent inhalation effects.',
    timeToDeath: '1-6 hours',
    finalWords: 'Nailed it... to death'
  },
  'paint': { 
    toxicityLevel: 85, 
    reason: 'Heavy metals and volatile organic compounds', 
    lethalDose: '50-100ml',
    survival: 'Move to fresh air. Do NOT induce vomiting. Call Poison Control. May need chelation therapy for heavy metals. Monitor neurological symptoms.',
    timeToDeath: '2-12 hours',
    finalWords: 'This really painted me into a corner...'
  },
  'cleaning_product': { 
    toxicityLevel: 90, 
    reason: 'Various toxic chemicals', 
    lethalDose: '50-200ml',
    survival: 'Identify specific product. Call Poison Control with label. Do NOT induce vomiting. Rinse mouth. Protect airway from chemical burns.',
    timeToDeath: '30 minutes to 6 hours',
    finalWords: 'Should have stuck to soap and water...'
  },
  'insecticide': { 
    toxicityLevel: 95, 
    reason: 'Neurotoxins', 
    lethalDose: '10-50ml',
    survival: 'IMMEDIATE: Remove contaminated clothing. Call 911. Atropine may be antidote. Support breathing. Monitor for seizures.',
    timeToDeath: '15 minutes to 2 hours',
    finalWords: 'Bug spray got the wrong bug...'
  },
  'rat_poison': { 
    toxicityLevel: 99, 
    reason: 'Anticoagulants or neurotoxins', 
    lethalDose: '5-20g',
    survival: 'CRITICAL: Call 911 immediately. Identify poison type. Vitamin K may be antidote for anticoagulants. Monitor for bleeding or seizures.',
    timeToDeath: '2-24 hours',
    finalWords: 'Rats... this backfired'
  },
  'cigarette': { 
    toxicityLevel: 90, 
    reason: 'Nicotine poisoning', 
    lethalDose: '1-2 cigarettes if eaten',
    survival: 'IMMEDIATE: Induce vomiting if conscious. Call Poison Control. Activated charcoal may help. Monitor heart rate and breathing.',
    timeToDeath: '15 minutes to 4 hours',
    finalWords: 'Smoking kills... literally'
  },
  'lighter_fluid': { 
    toxicityLevel: 95, 
    reason: 'Hydrocarbon poisoning', 
    lethalDose: '10-15ml',
    survival: 'NEVER induce vomiting (aspiration risk). Call 911. Fresh air. Support breathing. May cause chemical pneumonia.',
    timeToDeath: '30 minutes to 6 hours',
    finalWords: 'Lit myself up wrong...'
  },
  'toilet_bowl_cleaner': { 
    toxicityLevel: 92, 
    reason: 'Hydrochloric acid burns', 
    lethalDose: '30-50ml',
    survival: 'Do NOT induce vomiting. Rinse mouth with water. Drink milk or water. Call 911. Monitor for airway swelling.',
    timeToDeath: '30 minutes to 3 hours',
    finalWords: 'Bowl movement gone wrong...'
  },
  'mothballs': { 
    toxicityLevel: 88, 
    reason: 'Naphthalene or paradichlorobenzene toxicity', 
    lethalDose: '1-2 mothballs',
    survival: 'Call Poison Control immediately. Induce vomiting if conscious. Monitor for seizures and liver damage. Fresh air essential.',
    timeToDeath: '2-8 hours',
    finalWords: 'Moth-eaten from the inside...'
  },
  'antifreeze': { 
    toxicityLevel: 97, 
    reason: 'Ethylene glycol poisoning', 
    lethalDose: '100ml',
    survival: 'CRITICAL: Call 911. Ethanol or fomepizole antidote needed ASAP. Support breathing. May need kidney dialysis.',
    timeToDeath: '30 minutes to 12 hours',
    finalWords: 'Anti-freeze became anti-life...'
  },
  'superglue': { 
    toxicityLevel: 65, 
    reason: 'Cyanoacrylate adhesive obstruction', 
    lethalDose: '50ml',
    survival: 'Do NOT induce vomiting. Rinse mouth with warm water. Call Poison Control. May need endoscopy to remove hardened glue.',
    timeToDeath: '2-6 hours from obstruction',
    finalWords: 'Stuck in a permanent situation...'
  },
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
    console.log('Initializing enhanced multi-model AI analysis...');
    
    // Initialize multiple models for ensemble prediction
    const models = [
      { 
        name: 'ViT-Base', 
        model: 'Xenova/vit-base-patch16-224',
        classifier: 'generalClassifier' 
      },
      { 
        name: 'Food-Specific', 
        model: 'Xenova/mobilenet_v2_1.0_224',
        classifier: 'foodClassifier' 
      },
      { 
        name: 'Object-Specific', 
        model: 'Xenova/vit-base-patch16-224-in21k',
        classifier: 'objectClassifier' 
      }
    ];

    let successCount = 0;
    
    // Try WebGPU first for all models
    for (const modelConfig of models) {
      try {
        const classifier = await pipeline(
          'image-classification',
          modelConfig.model,
          { device: 'webgpu' }
        );
        
        if (modelConfig.classifier === 'generalClassifier') generalClassifier = classifier;
        else if (modelConfig.classifier === 'foodClassifier') foodClassifier = classifier;
        else if (modelConfig.classifier === 'objectClassifier') objectClassifier = classifier;
        
        console.log(`✅ ${modelConfig.name} loaded on WebGPU`);
        successCount++;
      } catch (error) {
        console.log(`⚠️ ${modelConfig.name} failed on WebGPU, trying CPU...`);
        
        try {
          const classifier = await pipeline(
            'image-classification',
            modelConfig.model
          );
          
          if (modelConfig.classifier === 'generalClassifier') generalClassifier = classifier;
          else if (modelConfig.classifier === 'foodClassifier') foodClassifier = classifier;
          else if (modelConfig.classifier === 'objectClassifier') objectClassifier = classifier;
          
          console.log(`✅ ${modelConfig.name} loaded on CPU`);
          successCount++;
        } catch (cpuError) {
          console.log(`❌ ${modelConfig.name} failed to load`);
        }
      }
    }
    
    // Ensure at least one model loaded
    if (successCount === 0) {
      try {
        // Emergency fallback to most reliable model
        generalClassifier = await pipeline(
          'image-classification',
          'Xenova/mobilenet_v2_1.0_224'
        );
        console.log('🆘 Emergency MobileNet fallback successful');
        successCount = 1;
      } catch (error) {
        console.error('💀 All AI models failed to load:', error);
        return false;
      }
    }
    
    console.log(`🚀 Enhanced AI initialized with ${successCount}/3 models`);
    return true;
  } catch (error) {
    console.error('Failed to initialize enhanced AI:', error);
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
    needsTraining?: boolean;
    allClassificationResults?: any[];
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
    
    // Use ensemble prediction with multiple models for better accuracy
    const allResults: any[] = [];
    
    // Get predictions from all available models
    if (generalClassifier) {
      try {
        const generalResults = await generalClassifier(imageUrl);
        const resultsArray = Array.isArray(generalResults) ? generalResults : [generalResults];
        allResults.push(...resultsArray.map((r: any) => ({ 
          label: r.label, 
          score: r.score || r.confidence, 
          source: 'general', 
          weight: 1.0 
        })));
      } catch (error) {
        console.warn('General classifier failed:', error);
      }
    }
    
    if (foodClassifier) {
      try {
        const foodResults = await foodClassifier(imageUrl);
        const resultsArray = Array.isArray(foodResults) ? foodResults : [foodResults];
        allResults.push(...resultsArray.map((r: any) => ({ 
          label: r.label, 
          score: r.score || r.confidence, 
          source: 'food', 
          weight: 1.2 
        }))); // Higher weight for food-specific
      } catch (error) {
        console.warn('Food classifier failed:', error);
      }
    }
    
    if (objectClassifier) {
      try {
        const objectResults = await objectClassifier(imageUrl);
        const resultsArray = Array.isArray(objectResults) ? objectResults : [objectResults];
        allResults.push(...resultsArray.map((r: any) => ({ 
          label: r.label, 
          score: r.score || r.confidence, 
          source: 'object', 
          weight: 1.1 
        })));
      } catch (error) {
        console.warn('Object classifier failed:', error);
      }
    }
    
    // Combine and weight results from multiple models with enhanced logic
    const combinedResults = combineEnsembleResults(allResults);
    const classificationResults = combinedResults.length > 0 ? combinedResults : allResults;
    
    console.log('Raw AI results from all models:', allResults);
    console.log('Combined/ensemble results:', combinedResults);
    console.log('Final classification results:', classificationResults);
    
    // Filter out very low confidence results and log remaining
    const filteredResults = classificationResults.filter(result => {
      const confidence = result.confidence || Math.round(result.score * 100);
      console.log(`Filtering result: ${result.label} - confidence: ${confidence}%, threshold: ${CONFIDENCE_THRESHOLDS.MINIMUM_DETECTION}%`);
      return confidence >= CONFIDENCE_THRESHOLDS.MINIMUM_DETECTION;
    });
    
    // Log confidence levels for debugging
    filteredResults.forEach(result => {
      const confidence = result.confidence || Math.round(result.score * 100);
      console.log(`Detected: ${result.label} (${confidence}% confidence, sources: ${result.sources?.join(', ') || 'unknown'})`);
    });
    
    if (filteredResults.length === 0) {
      console.warn('All AI detections below minimum confidence threshold, using fallback');
      return analyzeImageManually(imageFile);
    }
    
    // Check community database first for user-contributed training data
    const communityMatch = await checkCommunityDatabase(imageFile, filteredResults);
    
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
            usdaInfo: usdaData[0] || null,
            survival: data.survival,
            timeToDeath: data.timeToDeath,
            finalWords: data.finalWords,
            source: 'database',
            allowCorrection: confidence < 0.85 // Allow correction if not very confident
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
            chemicalInfo: pubchemData,
            survival: data.survival,
            timeToDeath: data.timeToDeath,
            finalWords: data.finalWords,
            source: 'database',
            allowCorrection: confidence < 0.85 // Allow correction if not very confident
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
          fdaInfo: fdaData[0] || null,
          allowCorrection: confidence < 0.8 // Allow correction for pill misidentifications
        });
        maxRisk = Math.max(maxRisk, 75);
      }
    }
    
// If no toxic items found, add the most confident classifications as unknown
    if (detectedItems.length === 0) {
      const topResult = classificationResults[0];
      const confidence = topResult.score;
      
      // Check if this is truly unknown (low confidence) and needs community training
      const needsTraining = confidence < 0.6 || topResult.label.toLowerCase().includes('unknown') || 
                           topResult.label.toLowerCase().includes('other') ||
                           !topResult.label || topResult.label.length < 3;
      
      // Determine if user can correct this (low confidence or potential misidentification)
      const allowCorrection = confidence < 0.75 || needsTraining;
      
      detectedItems.push({
        label: topResult.label || 'Unknown Item',
        confidence: confidence,
        toxicityLevel: needsTraining ? 5 : 10, // Very low for unknown items
        reason: inferHazardMechanism(topResult.label || ''),
        lethalDose: 'Exposure-dependent; see mechanism',
        category: 'unknown' as const,
        needsTraining: needsTraining,
        allowCorrection: allowCorrection,
        allClassificationResults: classificationResults.slice(0, 5) // Include top 5 for training reference
      });
      maxRisk = needsTraining ? 5 : 10;
    }

    // Speak warning for high-risk items
    if (maxRisk >= 80) {
      speakWarning(`DANGER! High risk item detected. Do not consume or touch.`, true);
    } else if (maxRisk >= 60) {
      speakWarning(`Warning: Potentially dangerous item detected. Exercise caution.`);
    }
    
// Generate recommendations with enhanced survival focus
    const recommendations = generateSurvivalRecommendations(maxRisk, detectedItems);
    
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

// Ensemble method to combine results from multiple AI models
const combineEnsembleResults = (allResults: any[]): any[] => {
  const labelGroups: { [key: string]: any[] } = {};
  
  // Group results by similar labels with better food categorization
  allResults.forEach(result => {
    let normalizedLabel = result.label.toLowerCase().replace(/[^a-z]/g, '');
    
    // Better food categorization - map common food variations to base labels
    const foodMappings = {
      'peanutbutter': 'peanut',
      'peanutbutterjar': 'peanut', 
      'nutbutter': 'peanut',
      'jar': normalizedLabel.includes('peanut') ? 'peanut' : normalizedLabel,
      'container': normalizedLabel.includes('food') ? 'food' : normalizedLabel,
      'bottle': result.source === 'food' ? 'food' : normalizedLabel
    };
    
    normalizedLabel = foodMappings[normalizedLabel] || normalizedLabel;
    
    if (!labelGroups[normalizedLabel]) {
      labelGroups[normalizedLabel] = [];
    }
    labelGroups[normalizedLabel].push(result);
  });
  
  // Combine and weight scores for each label group
  const combinedResults = Object.entries(labelGroups).map(([normalizedLabel, results]) => {
    const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
    const weightedScore = results.reduce((sum, r) => sum + (r.score * r.weight), 0) / totalWeight;
    const bestResult = results.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return {
      label: bestResult.label,
      score: Math.min(0.99, weightedScore * 1.1), // Boost ensemble confidence
      modelCount: results.length,
      sources: results.map(r => r.source),
      confidence: Math.round(weightedScore * 100) // Convert to percentage like other confidence values
    };
  });
  
  // Sort by weighted score and return top results
  return combinedResults
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Return top 10 ensemble results
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
  
  const recommendations = generateSurvivalRecommendations(maxRisk, detectedItems);
  
  return {
    detectedItems: detectedItems.sort((a, b) => b.toxicityLevel - a.toxicityLevel),
    overallRisk: maxRisk,
    recommendations
  };
};

// Enhanced survival recommendations generator
const generateSurvivalRecommendations = (riskLevel: number, items: any[]): string[] => {
  const recommendations: string[] = [];
  
  if (riskLevel >= 90) {
    recommendations.push("🚨 IMMEDIATE ACTION: Call 911 NOW - Do not delay");
    recommendations.push("☠️ CRITICAL: Do not touch, taste, or inhale this item");
    recommendations.push("🏥 Emergency Room: Go immediately, even without symptoms");
    recommendations.push("📞 Poison Control: 1-800-222-1222 (have item info ready)");
    recommendations.push("⏰ TIME CRITICAL: Minutes count for survival");
  } else if (riskLevel >= 70) {
    recommendations.push("⚠️ HIGH ALERT: Prepare for emergency action");
    recommendations.push("🛡️ Protection: Use gloves/mask if contact needed");
    recommendations.push("📱 Speed Dial: Program Poison Control (1-800-222-1222)");
    recommendations.push("🏥 Medical Plan: Know route to nearest emergency room");
    recommendations.push("👥 Inform Others: Tell household members about danger");
  } else if (riskLevel >= 50) {
    recommendations.push("⚡ CAUTION: Monitor symptoms closely");
    recommendations.push("🧼 Decontamination: Wash thoroughly after any contact");
    recommendations.push("📋 Documentation: Keep item label/info accessible");
    recommendations.push("🩺 Medical Awareness: Inform doctor if symptoms develop");
    recommendations.push("👶 Child Safety: Keep away from children and pets");
  } else if (riskLevel >= 30) {
    recommendations.push("📋 STANDARD PRECAUTIONS: Follow safety guidelines");
    recommendations.push("🧽 Quick Cleanup: Address spills/contact immediately");
    recommendations.push("🔒 Secure Storage: Lock away from vulnerable individuals");
    recommendations.push("📖 Learn Symptoms: Know what to watch for");
  } else {
    recommendations.push("✅ GENERAL SAFETY: Use common sense precautions");
    recommendations.push("🏠 Household Rules: Follow normal safety practices");
    recommendations.push("📚 Stay Informed: Read all product labels and warnings");
    recommendations.push("🧠 Know Resources: Familiarize with poison control");
  }
  
  // Add specific survival guidance based on item category
  items.forEach(item => {
    if (item.survival) {
      recommendations.push(`🆘 ${item.label}: ${item.survival.split('.')[0]}.`);
    }
    
    if (item.category === 'food' && item.toxicityLevel > 50) {
      recommendations.push("🍎 Food Safety: Never consume if uncertain about safety");
    } else if (item.category === 'medicine' && item.toxicityLevel > 60) {
      recommendations.push("💊 Medication Alert: Verify dosage with healthcare provider");
    } else if (item.category === 'object' && item.toxicityLevel > 60) {
      recommendations.push("🏠 Home Safety: Relocate to secure storage immediately");
    }
  });
  
  // Always include emergency contacts
  recommendations.push("📞 Emergency Contacts: 911, Poison Control (1-800-222-1222)");
  
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