
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Calculator, Loader2, Camera, X, Image } from "lucide-react";
import { useState, useRef } from "react";

interface DeathAnalyzerProps {
  scenario: string;
  setScenario: (scenario: string) => void;
  onAnalyze: (imageFile?: File) => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export const DeathAnalyzer = ({ 
  scenario, 
  setScenario, 
  onAnalyze, 
  isAnalyzing, 
  canAnalyze 
}: DeathAnalyzerProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
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

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
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

  const canAnalyzeWithInput = (canAnalyze && scenario.trim()) || uploadedImage;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-5 h-5 text-red-400" />
          Death Scanner & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image/Camera Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Camera className="w-4 h-4" />
            <span>Scan Image for Death Potential</span>
          </div>
          
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Death analysis target" 
                className="w-full max-h-48 object-cover rounded-lg border border-slate-600"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Camera and Upload Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600/50 hover:text-white h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-xs">Take Photo</span>
                </Button>
                
                <Button
                  onClick={() => uploadInputRef.current?.click()}
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-600/50 hover:text-white h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Image className="w-6 h-6" />
                  <span className="text-xs">Upload Image</span>
                </Button>
              </div>

              {/* Alternative drag and drop area */}
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-600/30 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-400">
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

          {/* Hidden camera input for mobile */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCameraCapture}
          />

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
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>OR describe your deadly scenario:</span>
          </div>
          <Textarea
            placeholder="Describe your deadly scenario... (e.g., '9 Tylenol pills', 'locked in a walk-in freezer', 'spider bite')"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 min-h-[100px]"
            disabled={!!uploadedImage}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {exampleScenarios.map((example, index) => (
            <button
              key={index}
              onClick={() => setScenario(example)}
              disabled={!!uploadedImage}
              className="text-xs bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 rounded px-2 py-1 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyzeWithInput || isAnalyzing}
            className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-medium"
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
        </div>

        {!canAnalyzeWithInput && (
          <p className="text-sm text-yellow-400 text-center">
            Please enter your weight and upload an image or enter a scenario to analyze
          </p>
        )}
      </CardContent>
    </Card>
  );
};
