

# Platform Review and Nutrition/Calorie Tracking Feature

## Honest Design Review

### What Looks Good
- The **purple gradient dark theme** is cohesive and distinctive -- it gives BeatDeath a strong visual identity
- The **Death Scanner Report** layout (right panel) is clean with clear sections, color-coded kill ratings, and well-organized data
- The **glass-card** design system with glows (purple, danger, success) is consistent across pages
- The **navigation bar** is functional with clear icons and labels
- Auth page is clean and simple

### What Needs Improvement for "Professional" Polish

1. **Dashboard is overloaded** -- The Index page has 20+ components crammed into a 3-column grid. It feels like every feature was dumped onto one page with no visual hierarchy. A professional app would have a cleaner dashboard with progressive disclosure (show key metrics, let users drill in).

2. **Placeholder/static pages** -- The Wellness, Science, and API Platform pages are essentially static mockups with fake data ("2.3M+ scenarios", "MIT Safety Lab", "Johns Hopkins Medicine"). These claim partnerships that don't exist, which hurts credibility.

3. **Inconsistent spacing and card nesting** -- Some components wrap in `glass-card` at the page level AND inside themselves, creating double borders. The hover scale effects (`hover:scale-[1.01]`) on every single card feels jittery rather than polished.

4. **No calorie/nutrition data in scan results** -- Despite the memory saying "doubles as a nutrition tracker," the AI prompt and the DeathReport component have **zero nutrition fields**. When you scan food (like the Tic Tac in the screenshot), you get death risk info but NO calories, macros, or nutrition data.

5. **Double `pt-16`** -- App.tsx wraps all routes in `<div className="pt-16">`, AND most pages also have `pt-16` on their root div, causing double top padding (128px total).

## Implementation Plan: Add Nutrition/Calorie Tracking to Scanner

This plan focuses on the **calorie/nutrition tracking** feature since it was specifically requested. The design improvements noted above can be tackled separately.

### Step 1: Update the AI Edge Function Prompt

**File: `supabase/functions/analyze-death-risk/index.ts`**

Add a `nutritionInfo` section to the JSON response format in the system prompt so the AI returns calorie and macro data for food items:

```text
Add to the response format:
"nutritionInfo": {
  "isFood": true/false,
  "calories": number (per serving),
  "servingSize": "description",
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "fiber": number (grams),
  "sugar": number (grams),
  "sodium": number (mg),
  "healthRating": "healthy|moderate|unhealthy",
  "warnings": ["high sugar", "processed", etc.]
}
```

Also update the transform at the bottom of the function to pass `nutritionInfo` through to the response.

### Step 2: Update TypeScript Types

**File: `src/types/index.ts`**

Add a `NutritionInfo` interface and add an optional `nutritionInfo` field to `DeathAnalysis`:

```text
interface NutritionInfo {
  isFood: boolean;
  calories: number;
  servingSize: string;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  healthRating: string;
  warnings: string[];
}
```

### Step 3: Update the Death Report to Display Nutrition Data

**File: `src/components/DeathReport.tsx`**

Add a **"Nutrition Facts" section** that only shows when `analysis.nutritionInfo?.isFood` is true. This will display:

- Calorie count (large, prominent)
- Macro breakdown (protein, carbs, fat) with a simple bar chart or badges
- Serving size
- Health rating badge (color-coded: green for healthy, yellow for moderate, red for unhealthy)
- Dietary warnings (high sugar, processed, etc.)

This section will appear between the Kill Rating and the Item/Scenario sections, visually distinct with a green-tinted card (health/nutrition color).

### Step 4: Update the useDeathAnalysis Hook

**File: `src/hooks/useDeathAnalysis.tsx`**

Pass the `nutritionInfo` from the AI response through to the `DeathAnalysis` object so it reaches the DeathReport component.

### Step 5: Add "Log to Daily Tracker" Button

**File: `src/components/DeathReport.tsx`**

When nutrition data is present, add a "Log to Health Tracker" button that saves the food item, calories, and macros to localStorage-based daily log (no new database table needed initially). This provides the "health tracking" angle.

### Step 6: Fix Double Padding Bug

**File: `src/App.tsx`**

Remove the `pt-16` from the wrapper `<div>` in App.tsx since each page already handles its own top padding. This fixes the double top padding issue.

---

### Summary of Files to Change

| File | Change |
|------|--------|
| `supabase/functions/analyze-death-risk/index.ts` | Add nutritionInfo to AI prompt and response transform |
| `src/types/index.ts` | Add NutritionInfo interface |
| `src/components/DeathReport.tsx` | Add Nutrition Facts card and Log button |
| `src/hooks/useDeathAnalysis.tsx` | Pass nutritionInfo through from AI response |
| `src/App.tsx` | Remove duplicate `pt-16` padding |

