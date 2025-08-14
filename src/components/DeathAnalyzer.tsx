
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Calculator, Loader2, Camera, X, Image, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useState, useRef } from "react";
import { CameraScanner } from "./CameraScanner";
import { CommunityTrainingModal } from "./CommunityTrainingModal";
import { useToast } from "@/hooks/use-toast";

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
  const [imageQuality, setImageQuality] = useState<'excellent' | 'good' | 'poor' | null>(null);
  const [imageAnalytics, setImageAnalytics] = useState<{size: string, format: string} | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const exampleScenarios = [
    "9 Tylenol pills",
    "Swallowed 3 quarters", 
    "Locked in a walk-in freezer",
    "Eating 20 apples",
    "Drinking 5 energy drinks",
    "Spider bite on my arm",
    "Household bleach spill",
    "Raw chicken left out overnight",
    "Mushrooms from my backyard",
    "Energy drink + alcohol mix"
  ];

  // Image quality validation
  const validateImageQuality = (file: File): Promise<'excellent' | 'good' | 'poor'> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const quality = img.width >= 800 && img.height >= 600 ? 'excellent' : 
                       img.width >= 400 && img.height >= 300 ? 'good' : 'poor';
        resolve(quality);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Image format and size analytics
  const getImageAnalytics = (file: File) => {
    const size = (file.size / 1024 / 1024).toFixed(1) + ' MB';
    const format = file.type.split('/')[1].toUpperCase();
    return { size, format };
  };

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, WEBP, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Analyze image quality and get analytics
    const quality = await validateImageQuality(file);
    const analytics = getImageAnalytics(file);
    setImageQuality(quality);
    setImageAnalytics(analytics);
    
    // Show quality feedback
    if (quality === 'poor') {
      toast({
        title: "Low Image Quality Detected",
        description: "Try a higher resolution image for better analysis accuracy",
        variant: "destructive"
      });
    } else if (quality === 'excellent') {
      toast({
        title: "Excellent Image Quality",
        description: "Perfect for detailed death analysis!",
      });
    }

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
    setImageQuality(null);
    setImageAnalytics(null);
    setShowCamera(false);
  };

  // Enhanced drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
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
            <div className="relative space-y-2">
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
              
              {/* Image quality indicator and analytics */}
              {imageQuality && imageAnalytics && (
                <div className="flex items-center justify-between text-xs bg-card/50 rounded p-2 border border-border">
                  <div className="flex items-center gap-2">
                    {imageQuality === 'excellent' && <CheckCircle className="w-3 h-3 text-green-500" />}
                    {imageQuality === 'good' && <Info className="w-3 h-3 text-blue-500" />}
                    {imageQuality === 'poor' && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                    <span className="text-muted-foreground">
                      Quality: <span className="text-card-foreground capitalize">{imageQuality}</span>
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {imageAnalytics.format} • {imageAnalytics.size}
                  </div>
                </div>
              )}
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

              {/* Enhanced drag and drop area */}
              <div
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                  isDragActive 
                    ? 'border-primary bg-primary/10 scale-105' 
                    : 'border-border bg-card/30 hover:bg-card/50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => uploadInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <Upload className={`w-6 h-6 mb-1 transition-colors ${
                    isDragActive ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`text-xs transition-colors ${
                    isDragActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    {isDragActive ? 'Drop image here!' : 'Or drag and drop here'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP up to 10MB
                  </p>
                </div>
              </div>
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

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Quick examples:</div>
          <div className="grid grid-cols-2 gap-2">
            {exampleScenarios.map((example, index) => (
              <button
                key={index}
                onClick={() => setScenario(example)}
                disabled={!!uploadedImage}
                className="text-xs bg-card/50 hover:bg-primary/20 border border-border rounded px-2 py-1 text-card-foreground hover:text-primary transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyzeWithInput || isAnalyzing}
            className="w-full gradient-bg text-primary-foreground font-medium hover:scale-105 transition-all duration-200 purple-glow relative overflow-hidden"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scanning for Death...
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse" />
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                {uploadedImage ? 
                  `Scan Image ${imageQuality ? `(${imageQuality} quality)` : ''}` : 
                  "Analyze Scenario"
                }
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
