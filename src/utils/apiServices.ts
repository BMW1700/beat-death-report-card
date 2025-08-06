// Free Government APIs with no rate limits
export interface FDADrugInfo {
  brand_name?: string[];
  generic_name?: string[];
  warnings?: string[];
  adverse_reactions?: string[];
  overdosage?: string[];
  route?: string[];
}

export interface USDAFoodInfo {
  description: string;
  nutrients?: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  ingredients?: string;
}

export interface PubChemInfo {
  molecular_formula?: string;
  molecular_weight?: number;
  hazards?: string[];
  safety_summary?: string[];
  toxicity?: string[];
}

// OpenFDA API - Completely free, no limits
export async function searchFDADrugs(query: string): Promise<FDADrugInfo[]> {
  try {
    const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=5`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.results?.map((drug: any) => ({
      brand_name: drug.openfda?.brand_name,
      generic_name: drug.openfda?.generic_name,
      warnings: drug.warnings,
      adverse_reactions: drug.adverse_reactions,
      overdosage: drug.overdosage,
      route: drug.openfda?.route
    })) || [];
  } catch (error) {
    console.error('FDA API error:', error);
    return [];
  }
}

// USDA FoodData Central - Completely free, no limits
export async function searchUSDAFood(query: string): Promise<USDAFoodInfo[]> {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=DEMO_KEY`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.foods?.map((food: any) => ({
      description: food.description,
      nutrients: food.foodNutrients?.slice(0, 10).map((n: any) => ({
        name: n.nutrientName,
        amount: n.value,
        unit: n.unitName
      })),
      ingredients: food.ingredients
    })) || [];
  } catch (error) {
    console.error('USDA API error:', error);
    return [];
  }
}

// PubChem API - Completely free, no limits
export async function searchPubChem(compound: string): Promise<PubChemInfo | null> {
  try {
    // First get compound ID
    const searchResponse = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(compound)}/cids/JSON`
    );
    
    if (!searchResponse.ok) return null;
    
    const searchData = await searchResponse.json();
    const cid = searchData.IdentifierList?.CID?.[0];
    
    if (!cid) return null;
    
    // Get compound details
    const detailsResponse = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight/JSON`
    );
    
    if (!detailsResponse.ok) return null;
    
    const detailsData = await detailsResponse.json();
    const properties = detailsData.PropertyTable?.Properties?.[0];
    
    return {
      molecular_formula: properties?.MolecularFormula,
      molecular_weight: properties?.MolecularWeight,
      hazards: [], // PubChem doesn't provide this directly
      safety_summary: [],
      toxicity: []
    };
  } catch (error) {
    console.error('PubChem API error:', error);
    return null;
  }
}

// Voice API - Free, built into browsers
export function speakWarning(text: string, isUrgent: boolean = false): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = isUrgent ? 1.2 : 1.0;
    utterance.pitch = isUrgent ? 1.2 : 1.0;
    utterance.volume = isUrgent ? 1.0 : 0.8;
    speechSynthesis.speak(utterance);
  }
}

// Enhanced barcode scanning with product lookup
export async function lookupProductByBarcode(barcode: string): Promise<any> {
  try {
    // Using Open Food Facts - completely free
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.status !== 1) return null;
    
    return {
      name: data.product.product_name,
      ingredients: data.product.ingredients_text,
      allergens: data.product.allergens,
      additives: data.product.additives_tags,
      nutrition_grade: data.product.nutrition_grades,
      image_url: data.product.image_url
    };
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return null;
  }
}