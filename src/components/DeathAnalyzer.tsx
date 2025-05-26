
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Calculator, Loader2 } from "lucide-react";

interface DeathAnalyzerProps {
  scenario: string;
  setScenario: (scenario: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const DeathAnalyzer = ({ 
  scenario, 
  setScenario, 
  onAnalyze, 
  isAnalyzing, 
  canAnalyze 
}: DeathAnalyzerProps) => {
  const exampleScenarios = [
    "9 Tylenol pills",
    "Swallowed 3 quarters",
    "Locked in a walk-in freezer",
    "Eating 20 apples",
    "Drinking 5 energy drinks",
    "Spider bite",
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-red-400" />
          Death Scenario Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Describe your deadly scenario... (e.g., '9 Tylenol pills', 'locked in a walk-in freezer', 'spider bite')"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {exampleScenarios.map((example, index) => (
            <button
              key={index}
              onClick={() => setScenario(example)}
              className="text-xs bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded px-2 py-1 text-gray-300 hover:text-white transition-colors"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-medium"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating Death...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Analyze Death Potential
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
            disabled
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image (Coming Soon)
          </Button>
        </div>

        {!canAnalyze && (
          <p className="text-sm text-yellow-400 text-center">
            Please enter your weight and a scenario to analyze
          </p>
        )}
      </CardContent>
    </Card>
  );
};
