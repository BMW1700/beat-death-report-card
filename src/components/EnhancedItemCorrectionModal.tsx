import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { AlertCircle, Brain, Users, Lightbulb } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface EnhancedItemCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiDetection: {
    label: string;
    confidence: number;
    source?: string;
    allClassificationResults?: any[];
  };
  imageFile: File;
  onCorrection: (originalDetection: string, correctedItem: string, category: string) => void;
  communityStats?: {
    totalCorrections: number;
    totalUserContributions: number;
    recentCorrections: any[];
  };
}

export const EnhancedItemCorrectionModal: React.FC<EnhancedItemCorrectionModalProps> = ({
  isOpen,
  onClose,
  aiDetection,
  imageFile,
  onCorrection,
  communityStats
}) => {
  const [actualItem, setActualItem] = useState('');
  const [category, setCategory] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!actualItem.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please provide both the actual item name and category.",
        variant: "destructive"
      });
      return;
    }

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Help Train the Community AI
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Community Impact Section */}
          {communityStats && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-semibold">Community Impact</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Corrections</div>
                  <div className="font-bold text-lg">{communityStats.totalCorrections}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">User Contributions</div>
                  <div className="font-bold text-lg">{communityStats.totalUserContributions}</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Detection Details */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="font-semibold">AI Detection Results</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Primary Detection:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {getSourceIcon(aiDetection.source || 'general')} {aiDetection.source || 'general'}
                  </Badge>
                  <span className="font-mono">{aiDetection.label}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getConfidenceColor(aiDetection.confidence)}`} />
                  <span className="text-sm font-mono">
                    {Math.round(aiDetection.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Alternative Detections */}
            {aiDetection.allClassificationResults && aiDetection.allClassificationResults.length > 1 && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-sm text-muted-foreground mb-2">Other AI Guesses:</div>
                <div className="flex flex-wrap gap-1">
                  {aiDetection.allClassificationResults.slice(1, 4).map((result, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {result.label} ({Math.round(result.score * 100)}%)
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Preview */}
          <div className="flex justify-center">
            <div className="w-32 h-32 border rounded-lg overflow-hidden bg-muted">
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Scanned item" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Correction Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">What is this actually?</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actualItem">Actual Item Name</Label>
              <Input
                id="actualItem"
                value={actualItem}
                onChange={(e) => setActualItem(e.target.value)}
                placeholder="e.g., peanut butter jar, aspirin bottle, kitchen knife..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the item category" />
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

          {/* Learning Benefits */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>🚀 Your correction helps:</strong>
              <ul className="mt-1 space-y-1 text-xs list-disc list-inside">
                <li>Make the scanner smarter for everyone</li>
                <li>Improve detection accuracy over time</li>
                <li>Build a community-driven safety database</li>
                <li>Reduce false positives and unknown items</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }} 
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={!actualItem.trim() || !category}>
              <Brain className="h-4 w-4 mr-2" />
              Teach the AI
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};