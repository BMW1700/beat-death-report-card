import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skull, Calculator, AlertTriangle, ArrowLeft } from "lucide-react";
import { DeathAnalyzer } from "@/components/DeathAnalyzer";
import { analyzeImageForToxicity, generateDeathAnalysisReport, inferHazardMechanism } from "@/utils/imageAnalysis";
import { toast } from "sonner";
import { UserProfile } from "@/components/UserProfile";
import { DeathReport } from "@/components/DeathReport";
import { useDeathAnalysis } from "@/hooks/useDeathAnalysis";
import { ShareDeathReport } from "@/components/ShareDeathReport";
import { SurvivalistModeToggle } from "@/components/SurvivalistModeToggle";
import { FieldManual } from "@/components/FieldManual";
import { TacticalScanner } from "@/components/TacticalScanner";
import { StreamingAnalysisProgress } from "@/components/StreamingAnalysisProgress";
import { Link } from "react-router-dom";
import { UserData, DeathAnalysis } from "@/types";
import { useScanCredits } from "@/hooks/useScanCredits";
import { ScanCreditsBadge } from "@/components/ScanCreditsBadge";
import { ScanPaywall } from "@/components/ScanPaywall";

const DeathScannerPage = () => {
  console.log("DeathScannerPage component is rendering");
  
  const [userData, setUserData] = useState<UserData>({
    weight: "",
    weightUnit: "lbs",
    allergies: "",
    age: "",
    gender: "",
  });
  
  const [scenario, setScenario] = useState("");
  const [analysis, setAnalysis] = useState<DeathAnalysis | null>(null);
  const { isAnalyzing, performAnalysis } = useDeathAnalysis();
  const [needsCommunityTraining, setNeedsCommunityTraining] = useState(false);
  const [currentAiLabels, setCurrentAiLabels] = useState<string[]>([]);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [lastDetection, setLastDetection] = useState<{
    label: string;
    confidence: number;
    source?: string;
    allClassificationResults?: any[];
    isFromCommunity?: boolean;
  } | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState({ stage: '', progress: 0 });
  const [showProgress, setShowProgress] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const scanCredits = useScanCredits();

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

  const handleCommunityTraining = (imageFile: File, aiLabels: string[]) => {
    setCurrentAiLabels(aiLabels);
  };

  const handleCorrection = (originalDetection: string, correctedItem: string, category: string) => {
    console.log('Item correction received:', { originalDetection, correctedItem, category });
    setShowCorrectionModal(false);
    
    toast.success("🎯 Community Learning Updated!", {
      description: `The scanner now knows "${originalDetection}" is actually "${correctedItem}". Next time anyone scans this, it will be detected correctly!`,
      duration: 5000
    });
    
    // Optionally trigger re-analysis with the corrected item
    if (currentImageFile) {
      setTimeout(() => {
        toast.info("🔄 Re-analyzing with correction...", {
          description: "Testing the improved detection"
        });
        handleAnalyze(currentImageFile);
      }, 2000);
    }
  };

  const handleAnalyze = async (imageFile?: File, communityData?: any) => {
    if (!scenario.trim() && !imageFile) {
      return;
    }
    
    setShowProgress(true);
    
    try {
      const result = await performAnalysis(scenario, imageFile, (stage, progress) => {
        console.log(`Analysis progress: ${stage} - ${progress}%`);
        setAnalysisProgress({ stage, progress });
      });
      if (result) {
        setAnalysis(result);
        setCurrentImageFile(imageFile || null);
        // Deduct scan credit after successful analysis
        await scanCredits.deductScan();
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setTimeout(() => setShowProgress(false), 1000);
    }
  };

  return (
    <div className="min-h-screen gradient-secondary-bg pt-16 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-destructive drop-shadow-lg animate-death-pulse" />
            <h1 className="text-6xl font-bold font-playfair tracking-tight gradient-text drop-shadow-lg">
              Death Scanner
            </h1>
            <Calculator className="w-12 h-12 text-primary drop-shadow-lg" />
          </div>
          <div className="flex justify-center mt-3">
            <ScanCreditsBadge
              freeScansLeft={scanCredits.freeScansLeft}
              creditsRemaining={scanCredits.creditsRemaining}
              isSubscriber={scanCredits.isSubscriber}
              onClick={() => setShowPaywall(true)}
            />
          </div>
          <p className="text-xl font-playfair text-muted-foreground max-w-2xl mx-auto text-balance">
            Scan any item or scenario to discover its death potential. AI-powered analysis reveals how common objects could kill you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">For Entertainment Only - Not Medical Advice</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* User Profile */}
        <div className="mb-6">
          <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <UserProfile userData={userData} setUserData={setUserData} />
          </div>
        </div>

        {/* Death Scanner and Report - Top Priority Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Death Scanner */}
          <div className="space-y-4">
            {showProgress && isAnalyzing && (
              <StreamingAnalysisProgress 
                currentStage={analysisProgress.stage}
                progress={analysisProgress.progress}
                isComplete={analysisProgress.progress >= 100}
              />
            )}
            
            <div className="glass-card success-glow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathAnalyzer
                scenario={scenario} 
                setScenario={setScenario} 
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                canAnalyze={true}
                needsCommunityTraining={needsCommunityTraining}
                onCommunityTraining={handleCommunityTraining}
                onCorrection={handleCorrection}
                showCorrectionModal={showCorrectionModal}
                lastDetection={lastDetection}
                canScan={scanCredits.canScan}
                onPaywallOpen={() => setShowPaywall(true)}
              />
            </div>
            <TacticalScanner 
              isScanning={isAnalyzing}
              detectionResults={analysis?.detectedItems?.map(item => ({
                item: item.label,
                confidence: item.confidence,
                threatLevel: item.confidence > 80 ? 'high' : 
                           item.confidence > 60 ? 'moderate' : 
                           item.confidence > 40 ? 'low' : 'low',
                category: item.category || 'Detection',
                sources: [item.source || 'AI']
              })) || []}
              onQuickScan={() => {
                if (currentImageFile) {
                  handleAnalyze(currentImageFile);
                } else {
                  toast.info("Upload an image first to use quick scan");
                }
              }}
            />
          </div>

          {/* Death Report */}
          <div className="space-y-4">
            <div className="glass-card shadow-2xl border-primary/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <DeathReport 
                analysis={analysis} 
                userData={userData} 
                isAnalyzing={isAnalyzing}
                imageFile={currentImageFile}
              />
            </div>
            {analysis && (
              <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                <ShareDeathReport deathReport={`${analysis.item || ""} -- Kill Rating: ${analysis.killRating || ""}/5. "${analysis.killRatingText || ""}"`} />
              </div>
            )}
          </div>
        </div>

        {/* Secondary Content */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Left Column - Mode Toggle */}
          <div className="space-y-4">
            <SurvivalistModeToggle />
          </div>

          {/* Right Column - Field Manual */}
          <div className="space-y-4">
            <FieldManual />
          </div>
        </div>
      </div>

      {/* Scan Paywall Modal */}
      <ScanPaywall
        open={showPaywall}
        onOpenChange={setShowPaywall}
        onPurchasePack={scanCredits.purchaseScanPack}
        onPurchaseSubscription={scanCredits.purchaseSubscription}
        freeScansLeft={scanCredits.freeScansLeft}
        creditsRemaining={scanCredits.creditsRemaining}
      />
    </div>
  );
};

export default DeathScannerPage;