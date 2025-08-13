
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User, 
  AlertTriangle, 
  Skull, 
  Clock, 
  Brain, 
  Shield, 
  MessageSquare,
  Loader2,
  Flame,
  Target,
  Edit3,
  CheckCircle
} from "lucide-react";
import { DeathAnalysis, UserData } from "@/types";
import { ItemCorrectionModal } from "@/components/ItemCorrectionModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DeathReportProps {
  analysis: DeathAnalysis | null;
  userData: UserData;
  isAnalyzing: boolean;
  imageFile?: File | null;
  onCorrectionSubmitted?: (correction: any) => void;
}

export const DeathReport = ({ analysis, userData, isAnalyzing, imageFile, onCorrectionSubmitted }: DeathReportProps) => {
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleCorrection = (item: any) => {
    setSelectedItem(item);
    setCorrectionModalOpen(true);
  };

  const handleCorrectionSubmit = (correction: any) => {
    console.log('Correction submitted:', correction);
    onCorrectionSubmitted?.(correction);
    setCorrectionModalOpen(false);
    setSelectedItem(null);
  };
  if (isAnalyzing) {
    return (
      <Card className="glass-card purple-glow">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-success" />
            Death Scanner Report
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-card-foreground text-center">
            Consulting the Grim Reaper's database...
            <br />
            <span className="text-sm text-muted-foreground">Analyzing death potential</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-success" />
            Death Scanner Report
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Skull className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No death analysis yet.
            <br />
            <span className="text-sm">Upload an image or enter a scenario to scan for death potential.</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  const getKillRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return "text-success";
      case 2: return "text-warning";
      case 3: return "text-accent";
      case 4: return "text-destructive";
      case 5: return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getKillRatingBg = (rating: number) => {
    switch (rating) {
      case 1: return "bg-success/20 border-success/30";
      case 2: return "bg-warning/20 border-warning/30";
      case 3: return "bg-accent/20 border-accent/30";
      case 4: return "bg-destructive/20 border-destructive/30";
      case 5: return "bg-destructive/30 border-destructive/50";
      default: return "bg-muted/20 border-muted/30";
    }
  };

  // Check if the first detected item allows correction
  const detectedItem = analysis.detectedItems?.[0];
  const canCorrect = detectedItem?.allowCorrection && imageFile;

  const reportItems = [
    {
      icon: Target,
      label: "Item/Scenario",
      value: analysis.item,
      color: "text-blue-400",
      canCorrect: canCorrect,
      detectedItem: detectedItem
    },
    {
      icon: User,
      label: "Your Profile",
      value: `Weight ${userData.weight} ${userData.weightUnit}${userData.age ? `, Age ${userData.age}` : ''}${userData.gender ? `, Gender ${userData.gender}` : ''}`,
      color: "text-green-400"
    },
    {
      icon: AlertTriangle,
      label: "Allergy Risk",
      value: analysis.allergyRisk,
      color: analysis.allergyRisk.startsWith("Yes") ? "text-red-400" : "text-green-400"
    },
    {
      icon: Skull,
      label: "How It Kills You",
      value: analysis.mechanism,
      color: "text-red-400"
    },
    {
      icon: Brain,
      label: "Lethal Dose/Exposure",
      value: analysis.lethalDose,
      color: "text-purple-400"
    },
    {
      icon: Clock,
      label: "Estimated Time to Death",
      value: analysis.timeToDeath,
      color: "text-orange-400"
    },
    {
      icon: Shield,
      label: "🆘 Survival Guide",
      value: analysis.survival,
      color: "text-green-400"
    },
    {
      icon: MessageSquare,
      label: "Final Words",
      value: analysis.finalWords,
      color: "text-purple-300"
    }
  ];

  return (
    <Card className="glass-card danger-glow">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-success" />
          Death Scanner Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Kill Rating Badge */}
        {analysis.killRating && (
          <div className={`p-4 rounded-lg border ${getKillRatingBg(analysis.killRating)}`}>
            <div className="flex items-center gap-3">
              <Flame className={`w-6 h-6 ${getKillRatingColor(analysis.killRating)}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-card-foreground font-medium">Kill Rating:</span>
                  <Badge variant="outline" className={`${getKillRatingColor(analysis.killRating)} border-current`}>
                    {analysis.killRating}/5
                  </Badge>
                </div>
                <p className={`text-sm ${getKillRatingColor(analysis.killRating)} mt-1`}>
                  {analysis.killRatingText}
                </p>
              </div>
            </div>
          </div>
        )}

        {reportItems.map((item, index) => {
          // Special styling for survival guide
          const isSurvival = item.label.includes("Survival Guide");
          const isItemScenario = item.label.includes("Item/Scenario");
          
          return (
            <div key={index} className={`space-y-2 ${isSurvival ? 'p-4 bg-success/10 border border-success/30 rounded-lg' : ''}`}>
              <div className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color} ${isSurvival ? 'animate-pulse' : ''}`} />
                <span className={`font-medium text-card-foreground ${isSurvival ? 'text-success' : ''}`}>
                  {item.label}:
                </span>
                {/* Show correction button for item detection */}
                {isItemScenario && item.canCorrect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCorrection(item.detectedItem)}
                    className="ml-auto text-xs h-6 px-2 hover:bg-warning/20 border-warning/30"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    AI Wrong?
                  </Button>
                )}
              </div>
              <p className={`pl-6 ${item.color} text-sm leading-relaxed ${isSurvival ? 'font-medium whitespace-pre-line' : ''}`}>
                {item.value}
              </p>
              {/* Show confidence info for correctable items */}
              {isItemScenario && item.detectedItem && (
                <div className="pl-6">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      item.detectedItem.confidence > 0.8 ? 'text-success border-success/50' : 
                      item.detectedItem.confidence > 0.6 ? 'text-warning border-warning/50' : 
                      'text-destructive border-destructive/50'
                    }`}
                  >
                    {item.canCorrect ? '⚠️ ' : '✓ '}AI Confidence: {Math.round(item.detectedItem.confidence * 100)}%
                  </Badge>
                </div>
              )}
              {isSurvival && (
                <div className="pl-6 mt-2">
                  <Badge variant="outline" className="text-xs text-success border-success/50">
                    Emergency: Call 911 or Poison Control (1-800-222-1222)
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-warning/20 border border-warning/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-warning font-medium text-sm">Disclaimer</span>
          </div>
          <p className="text-warning-foreground text-xs">
            ⚠️ Not medical advice. For entertainment only.
          </p>
        </div>
      </CardContent>

      {/* Correction Modal */}
      {selectedItem && (
        <ItemCorrectionModal
          isOpen={correctionModalOpen}
          onClose={() => setCorrectionModalOpen(false)}
          aiDetection={{
            label: selectedItem.label,
            confidence: selectedItem.confidence
          }}
          imageFile={imageFile || null}
          onCorrection={handleCorrectionSubmit}
        />
      )}
    </Card>
  );
};
