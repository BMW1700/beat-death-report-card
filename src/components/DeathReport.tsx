
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
  Target
} from "lucide-react";
import { DeathAnalysis, UserData } from "@/pages/Index";

interface DeathReportProps {
  analysis: DeathAnalysis | null;
  userData: UserData;
  isAnalyzing: boolean;
}

export const DeathReport = ({ analysis, userData, isAnalyzing }: DeathReportProps) => {
  if (isAnalyzing) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-400" />
            Death Scanner Report
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-gray-300 text-center">
            Consulting the Grim Reaper's database...
            <br />
            <span className="text-sm text-gray-400">Analyzing death potential</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-400" />
            Death Scanner Report
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Skull className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-center">
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
      case 1: return "text-green-400";
      case 2: return "text-yellow-400";
      case 3: return "text-orange-400";
      case 4: return "text-red-400";
      case 5: return "text-red-600";
      default: return "text-gray-400";
    }
  };

  const getKillRatingBg = (rating: number) => {
    switch (rating) {
      case 1: return "bg-green-900/30 border-green-600/30";
      case 2: return "bg-yellow-900/30 border-yellow-600/30";
      case 3: return "bg-orange-900/30 border-orange-600/30";
      case 4: return "bg-red-900/30 border-red-600/30";
      case 5: return "bg-red-900/50 border-red-500/50";
      default: return "bg-gray-900/30 border-gray-600/30";
    }
  };

  const reportItems = [
    {
      icon: Target,
      label: "Item/Scenario",
      value: analysis.item,
      color: "text-blue-400"
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
      label: "Survival Tip",
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
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-400" />
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
                  <span className="text-white font-medium">Kill Rating:</span>
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

        {reportItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="font-medium text-gray-300">{item.label}:</span>
            </div>
            <p className={`pl-6 ${item.color} text-sm leading-relaxed`}>
              {item.value}
            </p>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-sm">Disclaimer</span>
          </div>
          <p className="text-yellow-300 text-xs">
            ⚠️ Not medical advice. For entertainment only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
