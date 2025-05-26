
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
  Loader2 
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
            Death Report Card
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-gray-300 text-center">
            Consulting the Grim Reaper's database...
            <br />
            <span className="text-sm text-gray-400">This may take a moment</span>
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
            Death Report Card
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Skull className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-center">
            No death analysis yet.
            <br />
            <span className="text-sm">Enter a scenario to see your mortality report.</span>
          </p>
        </CardContent>
      </Card>
    );
  }

  const reportItems = [
    {
      icon: FileText,
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
      icon: Brain,
      label: "Mechanism of Death",
      value: analysis.mechanism,
      color: "text-red-400"
    },
    {
      icon: Shield,
      label: "How to Avoid It",
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
          Death Report Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
