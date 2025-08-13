
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Calculator, Loader2, Camera, X, Image } from "lucide-react";
import { useState, useRef } from "react";
import { CameraScanner } from "./CameraScanner";
import { CommunityTrainingModal } from "./CommunityTrainingModal";

interface DeathAnalyzerProps {
  scenario: string;
  setScenario: (scenario: string) => void;
  onAnalyze: (imageFile?: File, communityData?: any) => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
  needsCommunityTraining?: boolean;
  onCommunityTraining?: (imageFile: File, aiLabels: string[]) => void;
}

export const DeathAnalyzer = ({ 
  scenario, 
  setScenario, 
  onAnalyze, 
  isAnalyzing, 
  canAnalyze,
  needsCommunityTraining = false,
  onCommunityTraining
}: DeathAnalyzerProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [aiDetectedLabels, setAiDetectedLabels] = useState<string[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const exampleScenarios = [
    "9 Tylenol pills",
    "Swallowed 3 quarters",
    "Locked in a walk-in freezer",
    "Eating 20 apples",
    "Drinking 5 energy drinks",
    "Spider bite",
  ];

  const handleFileSelect = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setScenario("");
    setShowCamera(false);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setShowCamera(false);
  };

  const handleAnalyze = () => {
    onAnalyze(uploadedImage || undefined);
  };

  const handleCommunityTraining = () => {
    if (uploadedImage && onCommunityTraining) {
      onCommunityTraining(uploadedImage, aiDetectedLabels);
      setShowTrainingModal(true);
    }
  };

  const handleTrainingComplete = (trainingData: any) => {
    // Use the community training data for analysis
    onAnalyze(uploadedImage || undefined, trainingData);
    setShowTrainingModal(false);
  };

  const handleCameraCapture = (file: File) => {
    handleFileSelect(file);
  };

  const handleCameraScan = (file: File) => {
    handleFileSelect(file);
    // Immediately trigger analysis for scan
    setTimeout(() => onAnalyze(file), 100);
  };

  const canAnalyzeWithInput = (canAnalyze && scenario.trim()) || uploadedImage;

  // Show camera scanner if active
  if (showCamera) {
    return (
      <CameraScanner
        onCapture={handleCameraCapture}
        onScan={handleCameraScan}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <Card className="glass-card success-glow">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 text-destructive" />
          Death Scanner & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image/Camera Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <Camera className="w-4 h-4" />
            <span>Scan Image for Death Potential</span>
          </div>
          
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Death analysis target" 
                className="w-full max-h-48 object-cover rounded-lg border border-border"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full p-1 transition-all duration-200 hover:scale-105"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Camera and Upload Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowCamera(true)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Live Camera</span>
                </Button>
                
                <Button
                  onClick={() => uploadInputRef.current?.click()}
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <Image className="w-6 h-6" />
                  <span className="text-xs">Upload Image</span>
                </Button>
              </div>

              {/* Alternative drag and drop area */}
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Or drag and drop here
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleUpload}
                />
              </label>
            </div>
          )}

          {/* Hidden upload input */}
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {/* Text Scenario Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-card-foreground">
            <span>OR describe your deadly scenario:</span>
          </div>
          <Textarea
            placeholder="Describe your deadly scenario... (e.g., '9 Tylenol pills', 'locked in a walk-in freezer', 'spider bite')"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="bg-input border-border text-card-foreground placeholder:text-muted-foreground min-h-[100px]"
            disabled={!!uploadedImage}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {exampleScenarios.map((example, index) => (
            <button
              key={index}
              onClick={() => setScenario(example)}
              disabled={!!uploadedImage}
              className="text-xs bg-card/50 hover:bg-primary/20 border border-border rounded px-2 py-1 text-card-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyzeWithInput || isAnalyzing}
            className="w-full gradient-bg text-primary-foreground font-medium hover:scale-105 transition-all duration-200 purple-glow"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning for Death...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                {uploadedImage ? "Scan Image" : "Analyze Scenario"}
              </>
            )}
          </Button>
          
          {needsCommunityTraining && uploadedImage && (
            <Button
              onClick={handleCommunityTraining}
              variant="outline"
              className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Upload className="w-4 h-4 mr-2" />
              Help Train AI on This Item
            </Button>
          )}
        </div>

        {!canAnalyzeWithInput && (
          <p className="text-sm text-warning text-center">
            Please enter your weight and upload an image or enter a scenario to analyze
          </p>
        )}
      </CardContent>
      
      <CommunityTrainingModal
        isOpen={showTrainingModal}
        onClose={() => setShowTrainingModal(false)}
        imageFile={uploadedImage}
        aiDetectedLabels={aiDetectedLabels}
        onTrainingComplete={handleTrainingComplete}
      />
    </Card>
  );
};
