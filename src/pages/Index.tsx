
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Skull, Calculator, AlertTriangle } from "lucide-react";
import { DeathAnalyzer } from "@/components/DeathAnalyzer";
import { UserProfile } from "@/components/UserProfile";
import { DeathReport } from "@/components/DeathReport";

export interface UserData {
  weight: string;
  weightUnit: "lbs" | "kg";
  allergies: string;
  age: string;
  gender: string;
}

export interface DeathAnalysis {
  item: string;
  allergyRisk: string;
  lethalDose: string;
  timeToDeath: string;
  mechanism: string;
  survival: string;
  finalWords: string;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData>({
    weight: "",
    weightUnit: "lbs",
    allergies: "",
    age: "",
    gender: "",
  });
  
  const [scenario, setScenario] = useState("");
  const [analysis, setAnalysis] = useState<DeathAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!scenario.trim() || !userData.weight) {
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay for dramatic effect
    setTimeout(() => {
      const mockAnalysis: DeathAnalysis = {
        item: scenario,
        allergyRisk: userData.allergies.toLowerCase() !== "none" && userData.allergies ? "Yes - potential anaphylactic shock risk" : "No known allergies detected",
        lethalDose: "Analysis based on scenario complexity",
        timeToDeath: "Variable based on exposure",
        mechanism: "Multiple potential pathways",
        survival: "Avoid direct contact and seek immediate medical attention",
        finalWords: "Death finds a way, but so does intelligence."
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-red-500" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 to-purple-400 bg-clip-text text-transparent">
              BeatDeath
            </h1>
            <Skull className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your darkly funny, science-informed AI agent that reveals how common items and scenarios can kill you. 
            Based on YOUR unique biology.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">For Entertainment Only - Not Medical Advice</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - User Profile & Input */}
          <div className="space-y-6">
            <UserProfile userData={userData} setUserData={setUserData} />
            <DeathAnalyzer 
              scenario={scenario} 
              setScenario={setScenario} 
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              canAnalyze={!!scenario.trim() && !!userData.weight}
            />
          </div>

          {/* Right Column - Death Report */}
          <div className="space-y-6">
            <DeathReport analysis={analysis} userData={userData} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p className="text-sm">
            Stay smart. Stay weird. Be BeatDeath. 💀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
