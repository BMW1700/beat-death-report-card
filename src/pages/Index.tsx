import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Skull, Calculator, AlertTriangle } from "lucide-react";
import { DeathAnalyzer } from "@/components/DeathAnalyzer";
import { analyzeImageForToxicity, generateDeathAnalysisReport, inferHazardMechanism } from "@/utils/imageAnalysis";
import { toast } from "sonner";
import { UserProfile } from "@/components/UserProfile";
import { DeathReport } from "@/components/DeathReport";
import { ShareDeathReport } from "@/components/ShareDeathReport";
import { ChallengeFriend } from "@/components/ChallengeFriend";
import { TrendingDeaths } from "@/components/TrendingDeaths";
import { DeathScore } from "@/components/DeathScore";
import { Achievements } from "@/components/Achievements";
import { Leaderboard } from "@/components/Leaderboard";
import { ItemHistory } from "@/components/ItemHistory";
import { DailyDeathFact } from "@/components/DailyDeathFact";
import { UserStories } from "@/components/UserStories";

import { GlobalDeathMap } from "@/components/GlobalDeathMap";
import { DeathTrendsDashboard } from "@/components/DeathTrendsDashboard";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { RiskProfile } from "@/components/RiskProfile";
import { DeathDuel } from "@/components/DeathDuel";
import { ScenarioContest } from "@/components/ScenarioContest";
import { ExpertQA } from "@/components/ExpertQA";
import { CommunityLeaderboard } from "@/components/CommunityLeaderboard";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { InAppPurchases } from "@/components/InAppPurchases";
import { AffiliateOffers } from "@/components/AffiliateOffers";
import { ScanHistoryAnalytics } from "@/components/ScanHistoryAnalytics";
import { LocalizedFacts } from "@/components/LocalizedFacts";
import { RegionalTrending } from "@/components/RegionalTrending";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GlobalMarketingBanner } from "@/components/GlobalMarketingBanner";
import { DeathSpinWheel } from "@/components/DeathSpinWheel";
import { ImmortalModeCopilot } from "@/components/ImmortalModeCopilot";

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
  killRating?: number;
  killRatingText?: string;
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

  // Death analysis database for different scenarios
  const getAnalysisForScenario = (item: string, userData: UserData): DeathAnalysis => {
    const weight = parseFloat(userData.weight);
    const isKg = userData.weightUnit === "kg";
    const weightInKg = isKg ? weight : weight * 0.453592;
    
    // Convert common scenarios to lowercase for matching
    const lowerItem = item.toLowerCase();
    
    if (lowerItem.includes("tylenol") || lowerItem.includes("acetaminophen")) {
      const pillCount = parseInt(item.match(/\d+/)?.[0] || "1");
      const totalMg = pillCount * 500; // Assuming 500mg pills
      const mgPerKg = totalMg / weightInKg;
      
      return {
        item: `${pillCount} Tylenol pills (${totalMg}mg total)`,
        allergyRisk: userData.allergies.toLowerCase().includes("acetaminophen") ? "Yes - acetaminophen allergy detected" : "No known acetaminophen allergies",
        killRating: mgPerKg > 150 ? 5 : mgPerKg > 100 ? 4 : mgPerKg > 75 ? 3 : 2,
        killRatingText: mgPerKg > 150 ? "Horrible MF, you're already dead" : mgPerKg > 100 ? "Big yikes, could get ugly" : mgPerKg > 75 ? "Uh oh, not great" : "Meh, low-key risky",
        lethalDose: `~150mg/kg (${Math.round(150 * weightInKg)}mg for your weight)`,
        timeToDeath: mgPerKg > 150 ? "12-24 hours" : "24-72 hours if untreated",
        mechanism: "Acute liver failure leading to hepatic encephalopathy and multi-organ failure",
        survival: "Immediately call poison control and get to ER - N-acetylcysteine can save you if given within 8 hours",
        finalWords: pillCount > 15 ? "Your liver just filed for unemployment 💀" : "Paracetamol? More like para-see-ya-later 💊"
      };
    }
    
    if (lowerItem.includes("energy drink")) {
      const drinkCount = parseInt(item.match(/\d+/)?.[0] || "1");
      const totalCaffeine = drinkCount * 150; // Assuming 150mg per drink
      const caffeinePerKg = totalCaffeine / weightInKg;
      
      return {
        item: `${drinkCount} energy drinks (~${totalCaffeine}mg caffeine)`,
        allergyRisk: "No - unless you're allergic to having a pulse",
        killRating: caffeinePerKg > 150 ? 5 : caffeinePerKg > 100 ? 4 : caffeinePerKg > 50 ? 3 : 1,
        killRatingText: caffeinePerKg > 150 ? "Horrible MF, you're already dead" : caffeinePerKg > 100 ? "Big yikes, could get ugly" : caffeinePerKg > 50 ? "Uh oh, not great" : "No Problemo",
        lethalDose: `~150-200mg/kg (${Math.round(150 * weightInKg)}mg for your weight)`,
        timeToDeath: caffeinePerKg > 150 ? "30 minutes to 2 hours" : "2-6 hours",
        mechanism: "Cardiac arrhythmia, seizures, and cardiovascular collapse",
        survival: "Stop drinking them and call 911 if you feel chest pain or irregular heartbeat",
        finalWords: drinkCount > 10 ? "Your heart is about to break up with you ⚡" : "Redbull gives you wings... to heaven 👼"
      };
    }
    
    if (lowerItem.includes("quarter") && (lowerItem.includes("swallow") || lowerItem.includes("ate"))) {
      const quarterCount = parseInt(item.match(/\d+/)?.[0] || "1");
      
      return {
        item: `${quarterCount} swallowed quarters`,
        allergyRisk: "No - unless you're allergic to poor financial decisions",
        killRating: quarterCount > 5 ? 4 : quarterCount > 2 ? 3 : 2,
        killRatingText: quarterCount > 5 ? "Big yikes, could get ugly" : quarterCount > 2 ? "Uh oh, not great" : "Meh, low-key risky",
        lethalDose: "Multiple coins causing complete bowel obstruction",
        timeToDeath: "Days to weeks if untreated",
        mechanism: "Intestinal obstruction leading to perforation, sepsis, and death",
        survival: "Get to the ER immediately for X-rays and possible emergency surgery",
        finalWords: quarterCount > 3 ? "Making change has never been this expensive 💰" : "That's not how you invest in quarters 🪙"
      };
    }
    
    if (lowerItem.includes("freezer") || lowerItem.includes("locked") || lowerItem.includes("cold")) {
      return {
        item: "Locked in a walk-in freezer",
        allergyRisk: "No - but your body is about to be allergic to functioning",
        killRating: 5,
        killRatingText: "Horrible MF, you're already dead",
        lethalDose: "Core body temperature below 90°F (32°C)",
        timeToDeath: "30 minutes to 3 hours depending on clothing",
        mechanism: "Severe hypothermia causing cardiac arrhythmia and respiratory failure",
        survival: "Bang on the door, stay moving, conserve body heat, and pray someone finds you",
        finalWords: "Chilling out has never been this literal ❄️"
      };
    }
    
    // Default analysis for unknown items
    return {
      item: item,
      allergyRisk: userData.allergies && userData.allergies.toLowerCase() !== "none" ? "Possible - check your known allergies" : "Unknown - depends on the substance",
      killRating: 3,
      killRatingText: "Uh oh, not great",
      lethalDose: "Variable based on substance and exposure method",
      timeToDeath: "Highly variable - could be minutes to days",
      mechanism: "Multiple potential pathways depending on the substance",
      survival: "Avoid direct contact and seek immediate medical attention if symptoms occur",
      finalWords: "Death finds a way, but so does Google... maybe try that first? 🤔"
    };
  };

  const handleAnalyze = async (imageFile?: File) => {
    if (!scenario.trim() && !imageFile) {
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      let itemToAnalyze = scenario;
      
      if (imageFile) {
        // Use AI image analysis for real toxicity detection
        toast.info("🧠 AI analyzing image for death potential...", {
          description: "Using advanced AI to detect toxic substances"
        });
        
        const aiAnalysis = await analyzeImageForToxicity(imageFile);
        const weightVal = parseFloat(userData.weight);
        const weightInKg = isNaN(weightVal)
          ? 70 // default if user didn't provide weight
          : (userData.weightUnit === "kg" ? weightVal : weightVal * 0.453592);
        
        const reportData = generateDeathAnalysisReport(aiAnalysis, weightInKg, scenario);
        
        // Convert AI analysis to our format
        const mockAnalysis: DeathAnalysis = {
          item: `AI Detected: ${aiAnalysis.detectedItems[0]?.label || 'Unknown Object'}`,
          allergyRisk: userData.allergies ? "Check detected substances against your known allergies" : "No allergies specified",
          killRating: Math.min(5, Math.ceil(reportData.deathScore / 20)),
          killRatingText: reportData.deathScore >= 90 ? "Horrible MF, you're already dead" :
                         reportData.deathScore >= 70 ? "Big yikes, could get ugly" :
                         reportData.deathScore >= 50 ? "Uh oh, not great" :
                         reportData.deathScore >= 30 ? "Meh, low-key risky" : "No Problemo",
          lethalDose: aiAnalysis.detectedItems[0]?.lethalDose || "Variable based on substance",
          timeToDeath: reportData.timeToImpact,
          mechanism: (() => { const r = aiAnalysis.detectedItems[0]?.reason || ""; return (!r || r.toLowerCase().includes("unknown")) ? inferHazardMechanism(aiAnalysis.detectedItems[0]?.label || scenario || "item") : r; })(),
          survival: reportData.survivalTips.join(". "),
          finalWords: reportData.finalWords
        };
        
        setAnalysis(mockAnalysis);
        
        toast.success("🎯 AI analysis complete!", {
          description: `Detected: ${aiAnalysis.detectedItems[0]?.label} - Death Score: ${reportData.deathScore}%`
        });
        
      } else {
        // Fallback to scenario-based analysis
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockAnalysis = getAnalysisForScenario(itemToAnalyze, userData);
        setAnalysis(mockAnalysis);
        
        toast.success("Death analysis complete! 💀");
      }
      
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Analysis failed", {
        description: "Please try again or use text description instead"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-secondary-bg pt-16 transition-colors duration-300">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-destructive drop-shadow-lg animate-death-pulse" />
            <h1 className="text-7xl font-bold font-playfair tracking-tight gradient-text drop-shadow-lg">
              BeatDeath
            </h1>
            <Skull className="w-12 h-12 text-destructive drop-shadow-lg animate-death-pulse" />
          </div>
          <p className="text-2xl font-playfair text-muted-foreground max-w-2xl mx-auto text-balance">
            Your darkly funny, science-informed AI death scanner that reveals how common items and scenarios can kill you. 
            Based on YOUR unique biology.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">For Entertainment Only - Not Medical Advice</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - User Profile & Input */}
          <div className="space-y-6 animate-slide-in-right">
            {/* PHASE 3: PERSONALIZATION */}
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathSpinWheel />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DailyDeathFact />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <UserProfile userData={userData} setUserData={setUserData} />
            </div>
            <div className="glass-card success-glow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathAnalyzer 
                scenario={scenario} 
                setScenario={setScenario} 
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                canAnalyze={!!userData.weight}
              />
            </div>
            {/* PHASE 2: PROGRESSION */}
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathScore />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <Achievements />
            </div>
            <div className="glass-card danger-glow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <ChallengeFriend />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <GlobalDeathMap />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <WhatIfSimulator />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <RiskProfile />
            </div>
          </div>

          {/* Center Column - Death Report, Trending, Share */}
          <div className="space-y-6 animate-fade-in delay-150">
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <TrendingDeaths />
            </div>
            <div className="glass-card shadow-2xl border-primary/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <DeathReport analysis={analysis} userData={userData} isAnalyzing={isAnalyzing} />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <ShareDeathReport deathReport={analysis ? `${analysis.item || ""} -- Kill Rating: ${analysis.killRating || ""}/5. "${analysis.killRatingText || ""}"` : undefined}/>
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <ItemHistory />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathTrendsDashboard />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <ScanHistoryAnalytics />
            </div>
            <div className="glass-card border-accent/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <PremiumUpsell />
            </div>
          </div>

          {/* Right Column - Leaderboard, User Stories, Community */}
          <div className="space-y-6 animate-slide-in-right delay-300">
            <div className="glass-card shadow-2xl border-success/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <ImmortalModeCopilot />
            </div>
            <div className="glass-card shadow-xl border-warning/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <Leaderboard />
            </div>
            <div className="glass-card shadow-lg border-accent/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <UserStories />
            </div>
            <div className="glass-card p-4 border-primary/30 transition-all duration-300 hover:shadow-lg">
              <div className="text-sm text-card-foreground">Refer a friend with your invite code: <code className="bg-primary/20 px-2 py-1 rounded text-primary font-mono">BD-{Math.floor(Math.random()*9999)}</code></div>
              <div className="text-sm text-muted-foreground mt-2">Stay tuned for Scan-off Battles and Creator Mode!</div>
            </div>
            {/* Enhanced Community Features */}
            <div className="glass-card danger-glow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathDuel />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <ScenarioContest />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <ExpertQA />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <CommunityLeaderboard />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <LocalizedFacts />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <RegionalTrending />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <LanguageSwitcher />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <GlobalMarketingBanner />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <AffiliateOffers />
            </div>
            <div className="glass-card border-success/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <InAppPurchases />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground font-playfair animate-fade-in">
          <p className="text-sm">
            Stay smart. Stay weird. Be BeatDeath. 💀
          </p>
          <p className="text-xs mt-2 opacity-75">
            Version 2.0 • Powered by AI • Built for the curious and morbid
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
