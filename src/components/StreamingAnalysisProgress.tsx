import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  ScanLine, 
  Database, 
  Activity,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface StreamingAnalysisProgressProps {
  currentStage: string;
  progress: number;
  isComplete: boolean;
}

export const StreamingAnalysisProgress = ({ 
  currentStage, 
  progress, 
  isComplete 
}: StreamingAnalysisProgressProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  const stages = [
    { name: 'Initializing AI Models', icon: Brain, threshold: 0 },
    { name: 'Reading Labels & Text', icon: ScanLine, threshold: 20 },
    { name: 'Detecting Objects', icon: Activity, threshold: 35 },
    { name: 'Identifying Items', icon: Database, threshold: 50 },
    { name: 'Analyzing Danger Level', icon: Activity, threshold: 70 },
    { name: 'Cross-referencing Databases', icon: Database, threshold: 85 },
    { name: 'Generating Death Report', icon: Brain, threshold: 95 },
  ];

  return (
    <Card className="glass-card border-primary/30 shadow-2xl animate-fade-in">
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-card-foreground">
              {currentStage}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(displayProgress)}%
            </span>
          </div>
          <Progress 
            value={displayProgress} 
            className="h-2 bg-secondary"
          />
        </div>

        <div className="space-y-3">
          {stages.map((stage, index) => {
            const isActive = displayProgress >= stage.threshold && displayProgress < (stages[index + 1]?.threshold || 100);
            const isCompleted = displayProgress > (stages[index + 1]?.threshold || 95);
            const Icon = stage.icon;

            return (
              <div 
                key={stage.name}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isActive ? 'text-primary scale-105' : 
                  isCompleted ? 'text-muted-foreground opacity-60' : 
                  'text-muted-foreground opacity-40'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{stage.name}</span>
              </div>
            );
          })}
        </div>

        {isComplete && (
          <div className="flex items-center justify-center gap-2 p-4 bg-green-500/10 rounded-lg border border-green-500/20 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              Analysis Complete!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
