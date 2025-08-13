import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Target, CheckCircle, AlertTriangle } from "lucide-react";

interface AIInsightsProps {
  confidence: number;
  analysisMethod?: string;
  itemName: string;
}

export const AIInsights = ({ confidence, analysisMethod = "AI Vision", itemName }: AIInsightsProps) => {
  const getConfidenceLevel = (conf: number) => {
    if (conf >= 0.9) return { level: "Expert", color: "text-success", icon: CheckCircle };
    if (conf >= 0.75) return { level: "High", color: "text-primary", icon: Target };
    if (conf >= 0.6) return { level: "Moderate", color: "text-warning", icon: Brain };
    return { level: "Low", color: "text-destructive", icon: AlertTriangle };
  };

  const confidenceData = getConfidenceLevel(confidence);
  const ConfidenceIcon = confidenceData.icon;

  return (
    <Card className="glass-card border-primary/30">
      <CardTitle className="p-3 flex items-center gap-2 text-primary">
        <Brain className="w-5 h-5" />
        AI Analysis Insights
        <Badge variant="outline" className="ml-auto">
          <Zap className="w-3 h-3 mr-1" />
          {analysisMethod}
        </Badge>
      </CardTitle>
      
      <CardContent className="space-y-4">
        {/* Confidence Meter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">AI Confidence</span>
            <div className={`flex items-center gap-1 ${confidenceData.color}`}>
              <ConfidenceIcon className="w-4 h-4" />
              <span className="font-bold">{(confidence * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="w-full bg-card/30 rounded-full h-3 border border-accent/20">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                confidence >= 0.9 ? 'bg-success' :
                confidence >= 0.75 ? 'bg-primary' :
                confidence >= 0.6 ? 'bg-warning' : 'bg-destructive'
              }`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          
          <div className={`text-xs font-medium ${confidenceData.color}`}>
            {confidenceData.level} Confidence Level
          </div>
        </div>

        {/* Analysis Quality Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card/30 rounded-lg p-3 text-center border border-accent/20">
            <div className="text-lg font-bold text-primary">GPT-4.1</div>
            <div className="text-xs text-muted-foreground">Vision Model</div>
          </div>
          <div className="bg-card/30 rounded-lg p-3 text-center border border-accent/20">
            <div className="text-lg font-bold text-success">HD</div>
            <div className="text-xs text-muted-foreground">Image Quality</div>
          </div>
        </div>

        {/* Real-time Processing Info */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Neural Analysis</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>✅ Object recognition: {itemName}</div>
            <div>✅ Risk assessment: Complete</div>
            <div>✅ Safety analysis: Verified</div>
            <div>✅ Survival tips: Generated</div>
          </div>
        </div>

        {/* AI Accuracy Notice */}
        {confidence < 0.8 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm font-semibold text-warning">Low Confidence Alert</span>
            </div>
            <p className="text-xs text-muted-foreground">
              The AI is less certain about this identification. Consider providing corrections to improve accuracy.
            </p>
          </div>
        )}

        {/* Powered by Notice */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            🧠 Powered by advanced AI vision technology
          </div>
        </div>
      </CardContent>
    </Card>
  );
};