import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface ItemCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiDetection?: {
    label: string;
    confidence: number;
  };
  imageFile?: File | null;
  onCorrection?: (correction: {
    actualItem: string;
    category: string;
    confidence: number;
  }) => void;
  // New props for enhanced system
  detectedItem?: any;
  onSubmit?: (correctionData: any) => void;
}

export const ItemCorrectionModal = ({
  isOpen,
  onClose,
  aiDetection,
  imageFile,
  onCorrection,
  detectedItem,
  onSubmit
}: ItemCorrectionModalProps) => {
  const [actualItem, setActualItem] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = () => {
    if (!actualItem.trim() || !category) {
      toast.error("Please specify what the item actually is and select a category");
      return;
    }

    const correctionData = {
      actualItem: actualItem.trim(),
      category,
      confidence: aiDetection?.confidence || detectedItem?.confidence || 0.5
    };

    // Call both handlers for backward compatibility
    onCorrection?.(correctionData);
    onSubmit?.(correctionData);

    toast.success("✅ Correction submitted!", {
      description: "Thanks for helping improve AI accuracy!"
    });

    // Reset and close
    setActualItem("");
    setCategory("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <AlertTriangle className="w-5 h-5" />
            Correct AI Detection
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current AI Detection */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <X className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-muted-foreground">AI thinks this is:</span>
            </div>
            <p className="font-semibold text-foreground">
              {(aiDetection?.label) || (detectedItem?.itemName) || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              Confidence: {Math.round(((aiDetection?.confidence) || (detectedItem?.confidence) || 0.5) * 100)}%
            </p>
          </div>

          {/* Image Display */}
          {imageFile && (
            <div className="flex justify-center">
              <img 
                src={URL.createObjectURL(imageFile)} 
                alt="Item to correct" 
                className="w-32 h-32 object-cover rounded-lg border border-border"
              />
            </div>
          )}

          {/* Correction Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="actualItem">What is this actually? *</Label>
              <Input
                id="actualItem"
                value={actualItem}
                onChange={(e) => setActualItem(e.target.value)}
                placeholder="e.g., AirPods, iPhone, water bottle..."
                className="bg-input border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="plant">Plant</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="household">Household Object</SelectItem>
                  <SelectItem value="cosmetic">Cosmetic/Beauty</SelectItem>
                  <SelectItem value="toy">Toy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 gradient-bg">
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Correction
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};