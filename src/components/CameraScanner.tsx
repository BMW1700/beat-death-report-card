
import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, Scan, Zap, Brain, AlertTriangle, SwitchCamera, Maximize, Minimize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { initializeImageAnalysis } from "@/utils/imageAnalysis";
import { barcodeScanner } from '@/utils/barcodeScanner';
import { lookupProductByBarcode } from '@/utils/apiServices';

interface CameraScannerProps {
  onCapture: (imageFile: File) => void;
  onClose: () => void;
  onScan: (imageFile: File) => void;
}

export const CameraScanner = ({ onCapture, onClose, onScan }: CameraScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiReady, setAiReady] = useState(false);
  const [isInitializingAi, setIsInitializingAi] = useState(false);
  const [barcodeMode, setBarcodeMode] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    startCamera('environment');
    initializeAI();
    checkMultipleCameras();
    return () => {
      stopStream();
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const checkMultipleCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === 'videoinput');
      setHasMultipleCameras(cameras.length > 1);
    } catch {
      // ignore
    }
  };
  
  const initializeAI = async () => {
    if (!aiReady && !isInitializingAi) {
      setIsInitializingAi(true);
      try {
        const success = await initializeImageAnalysis();
        setAiReady(success);
      } catch (error) {
        console.error('Failed to initialize AI:', error);
      } finally {
        setIsInitializingAi(false);
      }
    }
  };

  const startCamera = async (facing: 'environment' | 'user') => {
    stopStream();
    
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { exact: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (e) {
          // Autoplay policies may block play
        }
      }
      setIsLoading(false);
      // Re-check cameras after permission granted (device labels become available)
      checkMultipleCameras();
    } catch (err) {
      // If exact constraint fails (e.g., desktop with one camera), fall back to non-exact
      console.warn(`Exact facingMode '${facing}' failed, falling back...`, err);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
      streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          try {
            await videoRef.current.play();
          } catch (e) {
            // Autoplay fallback
          }
        }
        setIsLoading(false);
        // Re-check cameras after permission granted
        checkMultipleCameras();
      } catch (fallbackErr) {
        console.error('Error accessing camera:', fallbackErr);
        setError('Camera access denied. Please allow camera permissions.');
        setIsLoading(false);
      }
    }
  };

  const flipCamera = async () => {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacing);
    await startCamera(newFacing);
  };

  const captureImage = (isScanning = false) => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `death-scan-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        
        if (isScanning) {
          onScan(file);
        } else {
          onCapture(file);
        }
      }
    }, 'image/jpeg', 0.8);
  };

  const handleClose = () => {
    stopStream();
    if (barcodeMode) {
      barcodeScanner.stopScanning();
    }
    onClose();
  };

  const startBarcodeScanning = async () => {
    if (!videoRef.current) return;
    
    setBarcodeMode(true);
    setScannedBarcode(null);
    
    try {
      await barcodeScanner.startScanning(
        videoRef.current,
        async (barcode) => {
          setScannedBarcode(barcode);
          const productInfo = await lookupProductByBarcode(barcode);
          if (productInfo) {
            console.log('Product found:', productInfo);
            // You can handle product info here
          }
        },
        (error) => {
          console.error('Barcode scanning error:', error);
          setError('Failed to scan barcode');
        }
      );
    } catch (err) {
      setError('Failed to start barcode scanning');
    }
  };

  const stopBarcodeScanning = () => {
    barcodeScanner.stopScanning();
    setBarcodeMode(false);
    setScannedBarcode(null);
  };

  if (error) {
    return (
      <Card className="glass-card danger-glow">
        <CardContent className="p-6 text-center">
          <div className="text-destructive mb-4">
            <Camera className="w-12 h-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
          <Button onClick={handleClose} variant="outline" className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-card purple-glow overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''}`}>
      <CardContent className={`p-0 relative ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
        {/* Top controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-card/80 hover:bg-card backdrop-blur-sm text-foreground rounded-full p-2 transition-all duration-200 hover:scale-105 border border-border"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          <button
            onClick={handleClose}
            className="bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full p-2 transition-all duration-200 hover:scale-105"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera feed */}
        <div className={`relative bg-card/50 border border-border overflow-hidden ${isFullscreen ? 'flex-1' : 'aspect-video rounded-lg'}`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center gradient-dark-bg">
              <div className="text-center text-primary-foreground">
                <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse text-primary" />
                <p>Starting camera...</p>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => setIsLoading(false)}
          />

          {/* Scanning overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Scanning frame */}
            <div className="absolute inset-4 border-2 border-primary rounded-lg animate-pulse">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            </div>
            
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border-2 border-accent rounded-full bg-accent/20 animate-death-pulse"></div>
            </div>
            
            {/* AI Status Indicator */}
            <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-2 text-xs">
                {isInitializingAi ? (
                  <>
                    <Brain className="w-3 h-3 animate-pulse text-warning" />
                    <span className="text-warning">Initializing AI...</span>
                  </>
                ) : aiReady ? (
                  <>
                    <Brain className="w-3 h-3 text-success" />
                    <span className="text-success">AI Ready</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-warning" />
                    <span className="text-warning">AI Offline</span>
                  </>
                )}
              </div>
              {barcodeMode && (
                <div className="mt-2 text-xs text-blue-400">
                  Barcode Scanning Active
                  {scannedBarcode && <div className="text-green-400">Found: {scannedBarcode}</div>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="p-4 gradient-dark-bg">
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => captureImage(true)}
              disabled={isLoading}
              className="gradient-bg text-primary-foreground px-6 py-3 rounded-xl hover:scale-105 transition-all duration-200 purple-glow disabled:opacity-50"
            >
              {aiReady ? (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  AI Death Scan
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 mr-2" />
                  Death Scan
                </>
              )}
            </Button>
            
            <Button
              onClick={() => captureImage(false)}
              disabled={isLoading}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-xl transition-all duration-200"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>

            <Button
              onClick={flipCamera}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-4 py-3 rounded-xl transition-all duration-200"
            >
              <SwitchCamera className="w-5 h-5 mr-2" />
              {facingMode === 'environment' ? 'Front' : 'Rear'}
            </Button>

            {!barcodeMode ? (
              <Button 
                onClick={startBarcodeScanning}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-4 py-3 rounded-xl"
              >
                Scan Barcode
              </Button>
            ) : (
              <Button 
                onClick={stopBarcodeScanning}
                variant="outline"
                className="border-warning text-warning hover:bg-warning hover:text-warning-foreground px-4 py-3 rounded-xl"
              >
                Stop Barcode
              </Button>
            )}
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            {aiReady 
              ? "AI-powered analysis: Point camera at food, drink, or object to analyze death potential"
              : "Point camera at food, drink, or object to analyze death potential"
            }
          </p>
          
          {!aiReady && !isInitializingAi && (
            <div className="text-center mt-2">
              <Button
                onClick={initializeAI}
                variant="outline"
                size="sm"
                className="text-xs border-warning text-warning hover:bg-warning hover:text-warning-foreground"
              >
                <Brain className="w-3 h-3 mr-1" />
                Enable AI Analysis
              </Button>
            </div>
          )}
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};
