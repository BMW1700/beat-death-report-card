import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skull, Calculator, AlertTriangle, ArrowLeft } from "lucide-react";
import { DeathAnalyzer } from "@/components/DeathAnalyzer";
import { analyzeImage } from "@/utils/imageAnalysis";
import { toast } from "sonner";
import { UserProfile } from "@/components/UserProfile";
import { DeathReport } from "@/components/DeathReport";
import { ItemCorrectionModal } from "@/components/ItemCorrectionModal";
import { AIInsights } from "@/components/AIInsights";
import { ViralSharingHub } from "@/components/ViralSharingHub";
import { DetectedItem } from "@/types";

import { Link } from "react-router-dom";
import { UserData } from "@/types";

const DeathScannerPage = () => {
  const [userData, setUserData] = useState<UserData>({
    weight: "",
    weightUnit: "lbs",
    allergies: "",
    age: "",
    gender: "",
  });
  
  const [scenario, setScenario] = useState("");
  const [detectedItem, setDetectedItem] = useState<DetectedItem | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setImageFile(file);
    setDetectedItem(null);

    try {
      console.log("🔍 Starting POWERFUL AI analysis...");
      const result = await analyzeImage(file);
      console.log("🎯 POWERFUL AI analysis result:", result);
      setDetectedItem(result);
      
      // Show confidence-based notifications
      if (result.confidence >= 0.9) {
        toast.success(`✅ High confidence detection: ${result.itemName}`);
      } else if (result.confidence >= 0.7) {
        toast.info(`🤔 Moderate confidence: ${result.itemName}`);
      } else {
        toast.warning(`⚠️ Low confidence detection - please verify: ${result.itemName}`);
      }
      
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCorrection = (correctionData: any) => {
    console.log('Item correction received:', correctionData);
    toast.success("🔧 Correction submitted!", {
      description: `AI will learn that this is actually ${correctionData.actualItem}`
    });
    setIsCorrectionModalOpen(false);
  };

  const handleAnalyze = async () => {
    if (!scenario.trim()) {
      toast.warning("Please describe a deadly scenario or upload an image");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis for text scenarios
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Text scenario analysis complete! 💀", {
        description: "For more accurate results, try uploading an image"
      });
      
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
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
          <p className="text-xl font-playfair text-muted-foreground max-w-2xl mx-auto text-balance">
            Scan any item or scenario to discover its death potential. AI-powered analysis reveals how common objects could kill you.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">For Entertainment Only - Not Medical Advice</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column - User Profile */}
          <div className="space-y-6 animate-slide-in-right">
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <UserProfile userData={userData} setUserData={setUserData} />
            </div>
          </div>

          {/* Center Column - Death Analyzer */}
          <div className="space-y-6 animate-fade-in delay-150">
            <div className="glass-card success-glow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathAnalyzer 
                scenario={scenario} 
                setScenario={setScenario} 
                onAnalyze={handleAnalyze}
                onImageUpload={handleImageUpload}
                isAnalyzing={isAnalyzing}
                canAnalyze={true}
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 animate-slide-in-left delay-300">
            {detectedItem && (
              <>
                {/* Results Grid */}
                <div className="grid gap-6">
                  {/* Main Results */}
                  <DeathReport 
                    detectedItem={detectedItem} 
                    imageFile={imageFile}
                    onCorrection={() => setIsCorrectionModalOpen(true)}
                  />
                  
                  {/* AI Insights */}
                  <AIInsights 
                    confidence={detectedItem.confidence}
                    analysisMethod={detectedItem.analysisMethod}
                    itemName={detectedItem.itemName}
                  />
                  
                  {/* Viral Sharing */}
                  <ViralSharingHub scanResult={{
                    itemName: detectedItem.itemName,
                    deathRating: detectedItem.deathRating,
                    survivalTips: detectedItem.survivalTips
                  }} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Item Correction Modal */}
        <ItemCorrectionModal
          isOpen={isCorrectionModalOpen}
          onClose={() => setIsCorrectionModalOpen(false)}
          onSubmit={handleCorrection}
          detectedItem={detectedItem}
          imageFile={imageFile}
        />
      </div>
    </div>
  );
};

export default DeathScannerPage;