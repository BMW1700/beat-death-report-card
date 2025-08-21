import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Crosshair, 
  Zap, 
  Shield, 
  Target,
  AlertTriangle,
  CheckCircle,
  Radar,
  Activity
} from "lucide-react";
import { EnhancedConfidenceDisplay } from "./EnhancedConfidenceDisplay";

interface TacticalScannerProps {
  isScanning?: boolean;
  detectionResults?: {
    item: string;
    confidence: number;
    threatLevel: 'low' | 'moderate' | 'high' | 'extreme';
    category: string;
    sources?: string[];
  }[];
  onQuickScan?: () => void;
}

export const TacticalScanner = ({ 
  isScanning = false, 
  detectionResults = [],
  onQuickScan 
}: TacticalScannerProps) => {
  const [scanAnimation, setScanAnimation] = useState(false);
  
  useEffect(() => {
    if (isScanning) {
      setScanAnimation(true);
      const timer = setTimeout(() => setScanAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'extreme': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'high': return <Target className="w-4 h-4 text-warning" />;
      case 'moderate': return <Shield className="w-4 h-4 text-primary" />;
      default: return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'extreme': return 'destructive';
      case 'high': return 'warning'; 
      case 'moderate': return 'primary';
      default: return 'success';
    }
  };

  return (
    <Card className="glass-card tactical-overlay">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-success">
          <Crosshair className={`w-5 h-5 ${scanAnimation ? 'animate-spin' : ''}`} />
          Tactical Threat Scanner
          {isScanning && (
            <Badge variant="outline" className="bg-warning/20 border-warning text-warning animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              SCANNING
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scanner Interface */}
        <div className="relative p-4 rounded-lg bg-card/30 border border-success/30">
          <div className="flex items-center justify-center">
            <div className={`relative ${scanAnimation ? 'animate-pulse' : ''}`}>
              <Radar className={`w-12 h-12 text-success ${scanAnimation ? 'animate-spin' : ''}`} />
              {scanAnimation && (
                <div className="absolute inset-0 rounded-full border-2 border-success/50 animate-ping" />
              )}
            </div>
          </div>
          
          {!isScanning && detectionResults.length === 0 && (
            <div className="text-center mt-3">
              <p className="text-sm text-muted-foreground mb-2">Scanner ready for threat assessment</p>
              <Button 
                onClick={onQuickScan}
                size="sm"
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <Zap className="w-3 h-3 mr-1" />
                Quick Scan
              </Button>
            </div>
          )}
        </div>

        {/* Detection Results */}
        {detectionResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-success" />
              <span className="font-medium text-foreground">Threat Assessment</span>
              <Badge variant="outline" className="bg-success/20 border-success text-success">
                {detectionResults.length} Target{detectionResults.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {detectionResults.map((result, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getThreatIcon(result.threatLevel)}
                    <span className="font-medium text-foreground">{result.item}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`bg-${getThreatColor(result.threatLevel)}/20 border-${getThreatColor(result.threatLevel)} text-${getThreatColor(result.threatLevel)}`}
                  >
                    {result.threatLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <EnhancedConfidenceDisplay 
                  confidence={result.confidence}
                  category={result.category}
                  source={result.sources?.[0] || 'AI'}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tactical Info */}
        <div className="p-3 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3 h-3 text-success" />
            <span className="text-xs font-medium text-success">TACTICAL STATUS</span>
          </div>
          <p className="text-xs text-success/80">
            Multi-spectrum threat analysis • Real-time confidence tracking • Field-ready data
          </p>
        </div>
      </CardContent>
    </Card>
  );
};