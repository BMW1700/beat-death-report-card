import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Brain,
  Users
} from "lucide-react";

interface ConfidenceDisplayProps {
  confidence: number;
  source?: string;
  isFromCommunity?: boolean;
  userCount?: number;
  category?: string;
}

export const EnhancedConfidenceDisplay = ({ 
  confidence, 
  source = "AI", 
  isFromCommunity = false,
  userCount = 0,
  category
}: ConfidenceDisplayProps) => {
  
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 85) return { level: 'Excellent', color: 'success', icon: CheckCircle };
    if (confidence >= 70) return { level: 'High', color: 'primary', icon: TrendingUp };
    if (confidence >= 50) return { level: 'Moderate', color: 'warning', icon: Target };
    return { level: 'Low', color: 'destructive', icon: XCircle };
  };

  const { level, color, icon: Icon } = getConfidenceLevel(confidence);

  const getProgressColor = () => {
    if (confidence >= 85) return 'bg-success';
    if (confidence >= 70) return 'bg-primary';
    if (confidence >= 50) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="space-y-3 p-4 rounded-lg bg-card/50 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Detection Confidence</span>
          {isFromCommunity && (
            <Badge variant="outline" className="bg-accent/20 border-accent text-accent">
              <Users className="w-3 h-3 mr-1" />
              Community
            </Badge>
          )}
        </div>
        <Badge 
          variant="outline" 
          className={`bg-${color}/20 border-${color} text-${color}`}
        >
          <Icon className="w-3 h-3 mr-1" />
          {level}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Accuracy Score</span>
          <span className="font-mono font-medium text-foreground">{confidence.toFixed(1)}%</span>
        </div>
        
        <Progress 
          value={confidence} 
          className="h-2"
          style={{
            background: `hsl(var(--muted))`,
          }}
        />
        
        <div className={`h-2 rounded-full ${getProgressColor()} transition-all duration-500`} 
             style={{ width: `${confidence}%` }} />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Brain className="w-3 h-3" />
          <span>Source: {isFromCommunity ? 'Community' : 'AI Model'}</span>
        </div>
        
        {isFromCommunity && userCount > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{userCount} user{userCount !== 1 ? 's' : ''} confirmed</span>
          </div>
        )}
        
        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
      </div>

      {confidence < 70 && (
        <div className="flex items-center gap-1 p-2 rounded bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-3 h-3 text-warning flex-shrink-0" />
          <span className="text-xs text-warning">
            Lower confidence - Consider manual verification or community training
          </span>
        </div>
      )}
    </div>
  );
};