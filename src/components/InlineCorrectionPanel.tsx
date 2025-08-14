import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Brain, Users, Lightbulb, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useCommunityLearning } from '@/hooks/useCommunityLearning';

interface InlineCorrectionPanelProps {
  aiDetection: {
    label: string;
    confidence: number;
    source?: string;
    allClassificationResults?: any[];
  };
  imageFile: File;
  onCorrection: (originalDetection: string, correctedItem: string, category: string) => void;
  onClose: () => void;
  communityStats?: {
    totalCorrections: number;
    totalUserContributions: number;
    recentCorrections: any[];
  };
}

export const InlineCorrectionPanel: React.FC<InlineCorrectionPanelProps> = ({
  aiDetection,
  imageFile,
  onCorrection,
  onClose,
  communityStats
}) => {
  const [actualItem, setActualItem] = useState('');
  const [category, setCategory] = useState('');
  const { toast } = useToast();
  const { addCommunityCorrection } = useCommunityLearning();

  const handleSubmit = async () => {
    if (!actualItem.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please provide both the actual item name and category.",
        variant: "destructive"
      });
      return;
    }

    // Add to community database
    await addCommunityCorrection(
      imageFile,
      aiDetection.label,
      actualItem.trim(),
      category
    );

    onCorrection(aiDetection.label, actualItem.trim(), category);
    
    toast({
      title: "🎯 Correction Submitted!",
      description: `Thanks for teaching the AI that "${aiDetection.label}" is actually "${actualItem}". This helps everyone!`,
      duration: 4000,
    });

    // Reset form
    setActualItem('');
    setCategory('');
    onClose();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 0.3) return "bg-red-500";
    if (confidence < 0.6) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'food': return '🍎';
      case 'object': return '🔧';
      case 'general': return '🤖';
      case 'community': return '👥';
      default: return '🔍';
    }
  };

  return (
    <div className="border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-4 space-y-4 animate-slide-in-down">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-orange-600" />
          <span className="font-semibold text-orange-800 dark:text-orange-200">Help Train the AI</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-6 w-6 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Community Stats */}
      {communityStats && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded border">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-3 w-3 text-primary" />
            <span className="text-sm font-semibold">Community Impact</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground">Total Corrections</div>
              <div className="font-bold">{communityStats.totalCorrections}</div>
            </div>
            <div>
              <div className="text-muted-foreground">User Contributions</div>
              <div className="font-bold">{communityStats.totalUserContributions}</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Detection */}
      <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/20 rounded border">
        <div className="w-16 h-16 border rounded overflow-hidden bg-muted flex-shrink-0">
          <img 
            src={URL.createObjectURL(imageFile)} 
            alt="Scanned item" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getSourceIcon(aiDetection.source || 'general')} {aiDetection.source || 'general'}
            </Badge>
            <span className="text-sm font-mono">{aiDetection.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getConfidenceColor(aiDetection.confidence)}`} />
            <span className="text-xs text-muted-foreground">
              {Math.round(aiDetection.confidence * 100)}% confidence
            </span>
          </div>
        </div>
      </div>

      {/* Correction Form */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-3 w-3 text-yellow-500" />
          <span className="text-sm font-semibold">What is this actually?</span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="actualItem" className="text-xs">Actual Item Name</Label>
          <Input
            id="actualItem"
            value={actualItem}
            onChange={(e) => setActualItem(e.target.value)}
            placeholder="e.g., peanut butter jar, aspirin bottle..."
            className="text-sm h-8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">🍎 Food & Beverages</SelectItem>
              <SelectItem value="object">🔧 Household Objects</SelectItem>
              <SelectItem value="medication">💊 Medications & Drugs</SelectItem>
              <SelectItem value="tool">🛠️ Tools & Equipment</SelectItem>
              <SelectItem value="plant">🌱 Plants & Natural Items</SelectItem>
              <SelectItem value="other">📦 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded border border-blue-200 dark:border-blue-800">
        <div className="text-xs text-blue-800 dark:text-blue-200">
          <strong>🚀 Your correction helps make the scanner smarter for everyone!</strong>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="flex-1 h-8 text-xs"
        >
          Maybe Later
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="flex-1 h-8 text-xs" 
          disabled={!actualItem.trim() || !category}
        >
          <Brain className="h-3 w-3 mr-1" />
          Teach the AI
        </Button>
      </div>
    </div>
  );
};