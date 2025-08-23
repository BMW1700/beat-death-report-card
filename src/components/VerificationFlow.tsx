import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Video, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useLifeClock } from '@/contexts/LifeClockContext';
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";

interface VerificationFlowProps {
  actionId: string;
  onComplete: () => void;
  onCancel: () => void;
}

type VerificationState = 'setup' | 'recording' | 'processing' | 'result';

export const VerificationFlow = ({ actionId, onComplete, onCancel }: VerificationFlowProps) => {
  const { state, logAction, getPlayfulMinutes } = useLifeClock();
  const [verificationState, setVerificationState] = useState<VerificationState>('setup');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [verificationResult, setVerificationResult] = useState<'verified' | 'unverified' | 'uncertain' | null>(null);
  const [confidence, setConfidence] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const action = state.actionMappings.find(a => a.action_id === actionId);
  if (!action) return null;

  const regularMinutes = getPlayfulMinutes(actionId, false);
  const verifiedMinutes = getPlayfulMinutes(actionId, true);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Using self-report mode.",
        variant: "destructive"
      });
      setVerificationState('result');
      setVerificationResult('unverified');
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await startCamera();
    }

    // Countdown
    setVerificationState('recording');
    let count = 3;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        setIsRecording(true);
        
        // Simulate recording for 10 seconds
        setTimeout(() => {
          setIsRecording(false);
          processVerification();
        }, 10000);
      }
    }, 1000);
  };

  const processVerification = () => {
    setVerificationState('processing');
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock verification result (70% chance of verification for demo)
      const rand = Math.random();
      let result: 'verified' | 'unverified' | 'uncertain';
      let conf: number;
      
      if (rand > 0.7) {
        result = 'verified';
        conf = 75 + Math.random() * 20;
      } else if (rand > 0.3) {
        result = 'uncertain';
        conf = 40 + Math.random() * 30;
      } else {
        result = 'unverified';
        conf = 10 + Math.random() * 30;
      }
      
      setVerificationResult(result);
      setConfidence(Math.round(conf));
      setVerificationState('result');
    }, 2000);
  };

  const handleComplete = () => {
    // Log the action with verification status
    const method = verificationResult === 'verified' ? 'verified' : 'self';
    logAction(actionId, method);
    
    // Clean up camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    onComplete();
  };

  const handleRetry = () => {
    setVerificationState('setup');
    setVerificationResult(null);
    setConfidence(0);
  };

  return (
    <Card className="glass-card w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Video className="w-5 h-5 text-primary" />
          Verify Action
          <Badge variant="outline" className="ml-2">
            MVP
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action Info */}
        <div className="p-3 bg-muted/20 rounded-lg">
          <div className="font-medium text-sm">{action.description}</div>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>Regular: +{regularMinutes}m</span>
            <span className="text-success">Verified: +{verifiedMinutes}m</span>
          </div>
        </div>

        {/* Setup State */}
        {verificationState === 'setup' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Camera className="w-12 h-12 text-primary mx-auto" />
              <div className="font-medium">Ready to Verify?</div>
              <div className="text-sm text-muted-foreground">
                We'll record a 10-second clip to verify your action. 
                Position yourself so the action is clearly visible.
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={startRecording} className="flex-1">
                <Video className="w-4 h-4 mr-2" />
                Start Verification
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
            
            <div className="p-2 bg-warning/20 rounded text-xs text-center text-warning">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Video processed locally - not stored on servers
            </div>
          </div>
        )}

        {/* Recording State */}
        {verificationState === 'recording' && (
          <div className="space-y-4">
            <video 
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-48 bg-black rounded-lg"
            />
            
            {!isRecording ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{countdown}</div>
                <div className="text-sm text-muted-foreground">Get ready...</div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="text-lg font-medium text-destructive">Recording...</div>
                <div className="text-sm text-muted-foreground">Perform your action now!</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span className="text-xs">10 seconds</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing State */}
        {verificationState === 'processing' && (
          <div className="space-y-4 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto animate-pulse" />
            <div>
              <div className="font-medium">Processing...</div>
              <div className="text-sm text-muted-foreground">AI is analyzing your action</div>
            </div>
            <Progress value={75} className="w-full" />
          </div>
        )}

        {/* Result State */}
        {verificationState === 'result' && verificationResult && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              {verificationResult === 'verified' ? (
                <CheckCircle className="w-12 h-12 text-success mx-auto" />
              ) : verificationResult === 'uncertain' ? (
                <Clock className="w-12 h-12 text-warning mx-auto" />
              ) : (
                <XCircle className="w-12 h-12 text-destructive mx-auto" />
              )}
              
              <div className="font-medium text-lg">
                {verificationResult === 'verified' && 'Verified!'}
                {verificationResult === 'uncertain' && 'Uncertain'}
                {verificationResult === 'unverified' && 'Not Verified'}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Confidence: {confidence}%
              </div>
            </div>

            {/* Results */}
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">Your reward:</span>
                <span className={cn(
                  "font-bold",
                  verificationResult === 'verified' ? "text-success" : "text-muted-foreground"
                )}>
                  +{verificationResult === 'verified' ? verifiedMinutes : regularMinutes} minutes
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {verificationResult === 'uncertain' && (
                <Button variant="outline" onClick={handleRetry} className="flex-1">
                  Try Again
                </Button>
              )}
              <Button onClick={handleComplete} className="flex-1">
                {verificationResult === 'verified' ? 'Claim Reward' : 'Continue'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};