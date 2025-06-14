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

  const analyzeImageWithAI = async (imageFile: File): Promise<string> => {
    // This would integrate with an AI vision service like OpenAI GPT-4 Vision
    // For now, return a mock description
    return "bottle of household bleach cleaner";
  };

  const handleAnalyze = async (imageFile?: File) => {
    if ((!scenario.trim() && !imageFile) || !userData.weight) {
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      let itemToAnalyze = scenario;
      
      if (imageFile) {
        // Simulate AI image analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        itemToAnalyze = await analyzeImageWithAI(imageFile);
      }
      
      // Simulate analysis delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnalysis = getAnalysisForScenario(itemToAnalyze, userData);
      setAnalysis(mockAnalysis);
      
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#221755] via-[#320D39] to-[#0A0818] text-white pt-16">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-red-500 drop-shadow-[0_0_6px_rgba(220,38,120,.7)]" />
            <h1 className="text-7xl font-bold font-playfair tracking-tight bg-gradient-to-r from-yellow-300 via-purple-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_1px_12px_rgba(80,30,170,0.20)]">
              BeatDeath
            </h1>
            <Skull className="w-12 h-12 text-red-500 drop-shadow-[0_0_6px_rgba(220,38,120,.7)]" />
          </div>
          <p className="text-2xl font-playfair text-purple-100/90 max-w-2xl mx-auto drop-shadow">
            Your darkly funny, science-informed AI death scanner that reveals how common items and scenarios can kill you. 
            Based on YOUR unique biology.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-yellow-300 drop-shadow">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">For Entertainment Only - Not Medical Advice</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - User Profile & Input */}
          <div className="space-y-6">
            {/* PHASE 3: PERSONALIZATION */}
            <div className="backdrop-blur-md bg-slate-800/60 border border-purple-600/70 shadow-2xl rounded-2xl transition-all duration-200">
              <DeathSpinWheel />
            </div>
            <div className="backdrop-blur-md bg-slate-800/60 border border-purple-600/70 shadow-2xl rounded-2xl transition-all duration-200">
              <DailyDeathFact />
            </div>
            <div className="backdrop-blur-lg bg-slate-800/70 border border-purple-800/70 shadow-xl rounded-2xl transition-all duration-200">
              <UserProfile userData={userData} setUserData={setUserData} />
            </div>
            <div className="backdrop-blur-lg bg-slate-800/70 border border-green-700/60 shadow-xl rounded-2xl transition-all duration-200">
              <DeathAnalyzer 
                scenario={scenario} 
                setScenario={setScenario} 
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                canAnalyze={!!userData.weight}
              />
            </div>
            {/* PHASE 2: PROGRESSION */}
            <div className="backdrop-blur-xl bg-slate-800/60 border border-yellow-700/30 shadow-lg rounded-2xl">
              <DeathScore />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-purple-700/20 shadow-lg rounded-2xl">
              <Achievements />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-red-700/30 shadow-lg rounded-2xl">
              <ChallengeFriend />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-blue-900/30 shadow-lg rounded-2xl">
              <GlobalDeathMap />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-cyan-700/30 shadow-lg rounded-2xl">
              <WhatIfSimulator />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-green-700/30 shadow-lg rounded-2xl">
              <RiskProfile />
            </div>
          </div>

          {/* Center Column - Death Report, Trending, Share */}
          <div className="space-y-6">
            <div className="backdrop-blur-2xl bg-slate-800/70 border border-yellow-400/10 shadow-xl rounded-2xl">
              <TrendingDeaths />
            </div>
            <div className="backdrop-blur-lg bg-slate-800/80 border border-purple-900/30 shadow-2xl rounded-2xl">
              <DeathReport analysis={analysis} userData={userData} isAnalyzing={isAnalyzing} />
            </div>
            <div className="backdrop-blur-md bg-slate-800/70 border border-blue-600/15 shadow-md rounded-2xl">
              <ShareDeathReport deathReport={analysis ? `${analysis.item || ""} -- Kill Rating: ${analysis.killRating || ""}/5. "${analysis.killRatingText || ""}"` : undefined}/>
            </div>
            <div className="backdrop-blur-md bg-slate-800/70 border border-gray-800/15 shadow-md rounded-2xl">
              <ItemHistory />
            </div>
            <div className="backdrop-blur-md bg-slate-800/70 border border-purple-700/10 shadow-lg rounded-2xl">
              <DeathTrendsDashboard />
            </div>
            <div className="backdrop-blur-md bg-slate-800/70 border border-green-700/10 shadow-md rounded-2xl">
              <ScanHistoryAnalytics />
            </div>
            <div className="backdrop-blur-md bg-slate-800/70 border border-pink-700/10 shadow-md rounded-2xl">
              <PremiumUpsell />
            </div>
          </div>

          {/* Right Column - Leaderboard, User Stories, Community */}
          <div className="space-y-6">
            <div className="backdrop-blur-2xl bg-slate-800/65 border border-green-900/15 shadow-2xl rounded-2xl">
              <ImmortalModeCopilot />
            </div>
            <div className="backdrop-blur-2xl bg-slate-800/65 border border-yellow-700/20 shadow-xl rounded-2xl">
              <Leaderboard />
            </div>
            <div className="backdrop-blur-2xl bg-slate-800/65 border border-pink-700/15 shadow-lg rounded-2xl">
              <UserStories />
            </div>
            <div className="bg-slate-700/70 p-4 rounded-xl mt-4 shadow border border-purple-700/25">
              <div className="text-xs text-white">Refer a friend with your invite code: <code>BD-{Math.floor(Math.random()*9999)}</code></div>
              <div className="text-xs text-purple-300 mt-1">Stay tuned for Scan-off Battles and Creator Mode!</div>
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-red-700/10 shadow-lg rounded-2xl">
              <DeathDuel />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-indigo-700/15 shadow-lg rounded-2xl">
              <ScenarioContest />
            </div>
            <div className="backdrop-blur-2xl bg-slate-800/65 border border-emerald-700/10 shadow-md rounded-2xl">
              <ExpertQA />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-yellow-700/10 shadow-lg rounded-2xl">
              <CommunityLeaderboard />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-orange-700/10 shadow-lg rounded-2xl">
              <LocalizedFacts />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-cyan-700/10 shadow-lg rounded-2xl">
              <RegionalTrending />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-pink-400/10 shadow-lg rounded-2xl">
              <LanguageSwitcher />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-purple-400/10 shadow-lg rounded-2xl">
              <GlobalMarketingBanner />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-amber-700/10 shadow-lg rounded-2xl">
              <AffiliateOffers />
            </div>
            <div className="backdrop-blur-xl bg-slate-800/60 border border-green-400/10 shadow-lg rounded-2xl">
              <InAppPurchases />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400 font-playfair">
          <p className="text-sm">
            Stay smart. Stay weird. Be BeatDeath. 💀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
