import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Apple, Flame, Beef, Wheat, Droplets, Plus, AlertTriangle } from "lucide-react";
import { NutritionInfo } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface NutritionFactsProps {
  nutritionInfo: NutritionInfo;
  itemName: string;
}

const HEALTH_RATING_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  healthy: { bg: "bg-success/20 border-success/30", text: "text-success", label: "Healthy" },
  moderate: { bg: "bg-warning/20 border-warning/30", text: "text-warning", label: "Moderate" },
  unhealthy: { bg: "bg-destructive/20 border-destructive/30", text: "text-destructive", label: "Unhealthy" },
};

export const NutritionFacts = ({ nutritionInfo, itemName }: NutritionFactsProps) => {
  const { toast } = useToast();

  const ratingStyle = HEALTH_RATING_STYLES[nutritionInfo.healthRating] || HEALTH_RATING_STYLES.moderate;

  const totalMacroGrams = nutritionInfo.protein + nutritionInfo.carbs + nutritionInfo.fat;

  const macroPercent = (grams: number) =>
    totalMacroGrams > 0 ? Math.round((grams / totalMacroGrams) * 100) : 0;

  const handleLogFood = () => {
    const today = new Date().toISOString().split("T")[0];
    const storageKey = `beatdeath_food_log_${today}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

    existing.push({
      item: itemName,
      calories: nutritionInfo.calories,
      protein: nutritionInfo.protein,
      carbs: nutritionInfo.carbs,
      fat: nutritionInfo.fat,
      fiber: nutritionInfo.fiber,
      sugar: nutritionInfo.sugar,
      sodium: nutritionInfo.sodium,
      servingSize: nutritionInfo.servingSize,
      loggedAt: new Date().toISOString(),
    });

    localStorage.setItem(storageKey, JSON.stringify(existing));

    const totalCalories = existing.reduce((sum: number, entry: any) => sum + (entry.calories || 0), 0);

    toast({
      title: "🍎 Logged to Health Tracker!",
      description: `${nutritionInfo.calories} cal added. Today's total: ${totalCalories} cal`,
    });
  };

  return (
    <div className={`p-4 rounded-lg border ${ratingStyle.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Apple className={`w-5 h-5 ${ratingStyle.text}`} />
          <span className="text-card-foreground font-medium">Nutrition Facts</span>
        </div>
        <Badge variant="outline" className={`${ratingStyle.text} border-current text-xs`}>
          {ratingStyle.label}
        </Badge>
      </div>

      {/* Calories - large prominent display */}
      <div className="flex items-baseline gap-2 mb-3">
        <Flame className="w-4 h-4 text-accent" />
        <span className="text-3xl font-bold text-card-foreground">{nutritionInfo.calories}</span>
        <span className="text-sm text-muted-foreground">cal / {nutritionInfo.servingSize}</span>
      </div>

      {/* Macro bar */}
      <div className="h-3 rounded-full overflow-hidden flex mb-2">
        <div
          className="bg-blue-500 transition-all"
          style={{ width: `${macroPercent(nutritionInfo.protein)}%` }}
        />
        <div
          className="bg-amber-500 transition-all"
          style={{ width: `${macroPercent(nutritionInfo.carbs)}%` }}
        />
        <div
          className="bg-rose-500 transition-all"
          style={{ width: `${macroPercent(nutritionInfo.fat)}%` }}
        />
      </div>

      {/* Macro badges */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs">
          <Beef className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-card-foreground">
            <strong>{nutritionInfo.protein}g</strong> protein
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Wheat className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-card-foreground">
            <strong>{nutritionInfo.carbs}g</strong> carbs
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Droplets className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-card-foreground">
            <strong>{nutritionInfo.fat}g</strong> fat
          </span>
        </div>
      </div>

      {/* Additional info */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs text-muted-foreground">
        <span>Fiber: {nutritionInfo.fiber}g</span>
        <span>•</span>
        <span>Sugar: {nutritionInfo.sugar}g</span>
        <span>•</span>
        <span>Sodium: {nutritionInfo.sodium}mg</span>
      </div>

      {/* Warnings */}
      {nutritionInfo.warnings?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {nutritionInfo.warnings.map((warning, i) => (
            <Badge key={i} variant="outline" className="text-xs text-warning border-warning/40">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {warning}
            </Badge>
          ))}
        </div>
      )}

      {/* Log button */}
      <Button
        onClick={handleLogFood}
        size="sm"
        className="w-full bg-success/20 hover:bg-success/30 text-success border border-success/30"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-1" />
        Log to Daily Health Tracker
      </Button>
    </div>
  );
};
