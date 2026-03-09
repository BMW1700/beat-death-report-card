import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skull, Calculator, AlertTriangle, ArrowLeft } from "lucide-react";
import { DeathAnalyzer } from "@/components/DeathAnalyzer";
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
  const [userData, setUserData] = useState<UserData>({
    weight: "",
    weightUnit: "lbs",
    allergies: "",
    age: "",
    gender: ""
  });
  const [scenario, setScenario] = useState("");
  const [analysis, setAnalysis] = useState<DeathAnalysis | null>(null);
  const { isAnalyzing, performAnalysis } = useDeathAnalysis();
  const [needsCommunityTraining] = useState(false);
  const [showCorrectionModal] = useState(false);
  const [lastDetection] = useState<{
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

  // Edge function is the primary analysis path — no hardcoded scenarios
  const handleAnalyze = async () => {
    if (!scenario.trim()) {
      toast.info("Enter a scenario to analyze");
      return;
    }
    setShowProgress(true);
    try {
      // Deduct scan BEFORE analysis to prevent free-scan exploits
      const deducted = await scanCredits.deductScan();
      if (!deducted) {
        toast.error("No scans remaining");
        setShowProgress(false);
        return;
      }
      const result = await performAnalysis(scenario, undefined, (stage, progress) => {
        setAnalysisProgress({ stage, progress });
      });
      if (result) {
        setAnalysis(result);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setTimeout(() => setShowProgress(false), 1000);
    }
  };
  return <div className="min-h-screen gradient-secondary-bg pt-16 transition-colors duration-300">
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
          <div className="flex flex-col items-center mt-4 gap-1">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Scans Remaining</span>
            <ScanCreditsBadge freeScansLeft={scanCredits.freeScansLeft} creditsRemaining={scanCredits.creditsRemaining} isSubscriber={scanCredits.isSubscriber} onClick={() => setShowPaywall(true)} size="lg" />
          </div>
          <p className="text-xl font-playfair text-muted-foreground max-w-2xl mx-auto text-balance">Scan any item or scenario to discover its death potential. Our AI-powered analysis reveals how common objects could kill you and how to survive them.</p>
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
            {showProgress && isAnalyzing && <StreamingAnalysisProgress currentStage={analysisProgress.stage} progress={analysisProgress.progress} isComplete={analysisProgress.progress >= 100} />}
            
            <div className="glass-card success-glow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathAnalyzer
                scenario={scenario}
                setScenario={setScenario}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                canAnalyze={true}
                needsCommunityTraining={needsCommunityTraining}
                onCommunityTraining={() => {}}
                onCorrection={() => {}}
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
                threatLevel: item.confidence > 80 ? 'high' : item.confidence > 60 ? 'moderate' : 'low',
                category: item.category || 'Detection',
                sources: [item.source || 'AI']
              })) || []}
              onQuickScan={handleAnalyze}
            />
          </div>

          {/* Death Report */}
          <div className="space-y-4">
            <div className="glass-card shadow-2xl border-primary/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <DeathReport analysis={analysis} userData={userData} isAnalyzing={isAnalyzing} imageFile={null} />
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
      <ScanPaywall open={showPaywall} onOpenChange={setShowPaywall} onPurchasePack={scanCredits.purchaseScanPack} onPurchaseSubscription={scanCredits.purchaseSubscription} freeScansLeft={scanCredits.freeScansLeft} creditsRemaining={scanCredits.creditsRemaining} />
    </div>;
};
export default DeathScannerPage;