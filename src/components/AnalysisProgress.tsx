import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Database, FileSearch, Zap, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface AnalysisStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  duration: number;
  completed: boolean;
}

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  onComplete?: () => void;
}

export const AnalysisProgress = ({ isAnalyzing, onComplete }: AnalysisProgressProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const steps: AnalysisStep[] = [
    {
      id: 'preprocessing',
      label: 'Preprocessing Image',
      icon: <FileSearch className="w-4 h-4" />,
      duration: 800,
      completed: false
    },
    {
      id: 'ai-analysis',
      label: 'AI Recognition Engine',
      icon: <Brain className="w-4 h-4" />,
      duration: 2000,
      completed: false
    },
    {
      id: 'database-lookup',
      label: 'Toxicity Database Lookup',
      icon: <Database className="w-4 h-4" />,
      duration: 600,
      completed: false
    },
    {
      id: 'risk-calculation',
      label: 'Risk Assessment',
      icon: <Zap className="w-4 h-4" />,
      duration: 400,
      completed: false
    }
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let totalDuration = 0;
    const intervals: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      const stepStart = totalDuration;
      totalDuration += step.duration;

      const interval = setTimeout(() => {
        setCurrentStep(index + 1);
        
        // Animate progress within step
        const stepInterval = setInterval(() => {
          setProgress(prev => {
            const stepProgress = ((Date.now() - Date.now()) % step.duration) / step.duration;
            const baseProgress = (stepStart / totalDuration) * 100;
            const currentStepProgress = (step.duration / totalDuration) * 100 * stepProgress;
            return Math.min(100, baseProgress + currentStepProgress);
          });
        }, 50);

        intervals.push(stepInterval);

        // Complete step
        setTimeout(() => {
          clearInterval(stepInterval);
          setProgress(((stepStart + step.duration) / totalDuration) * 100);
        }, step.duration);
      }, stepStart);

      intervals.push(interval);
    });

    // Completion
    const completionTimeout = setTimeout(() => {
      setProgress(100);
      onComplete?.();
    }, totalDuration);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(completionTimeout);
    };
  }, [isAnalyzing, onComplete]);

  if (!isAnalyzing) return null;

  return (
    <Card className="glass-card">
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-card-foreground font-medium">Analyzing for Death Potential</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                index < currentStep
                  ? 'bg-primary/10 text-primary'
                  : index === currentStep
                  ? 'bg-accent/20 text-accent scale-105'
                  : 'text-muted-foreground'
              }`}
            >
              <div className={`transition-colors duration-300 ${
                index < currentStep ? 'text-primary' : 
                index === currentStep ? 'text-accent' : 'text-muted-foreground'
              }`}>
                {index < currentStep ? <CheckCircle className="w-4 h-4" /> : step.icon}
              </div>
              <span className="text-sm font-medium">{step.label}</span>
              {index === currentStep && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};