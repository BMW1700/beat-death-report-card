import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Star, Brain, Users, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { addCommunityTrainingData } from "@/utils/imageAnalysis";

interface CommunityTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  aiDetectedLabels: string[];
  onTrainingComplete: (data: any) => void;
}

export const CommunityTrainingModal = ({
  isOpen,
  onClose,
  imageFile,
  aiDetectedLabels,
  onTrainingComplete
}: CommunityTrainingModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "" as "food" | "object" | "tool" | "plant" | "chemical" | "medicine" | "other",
    killRating: [3],
    lethalDose: "",
    timeToDeath: "",
    mechanism: "",
    survival: "",
    finalWords: "",
    allergyRisk: ""
  });

  const killRatingTexts = {
    1: "No Problemo",
    2: "Meh, low-key risky", 
    3: "Uh oh, not great",
    4: "Big yikes, could get ugly",
    5: "Horrible MF, you're already dead"
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Please fill in the item name and category");
      return;
    }

    const trainingData = {
      id: `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : "",
      imageData: imageFile ? await fileToBase64(imageFile) : "",
      name: formData.name,
      description: formData.description,
      category: formData.category,
      aiLabels: aiDetectedLabels,
      deathAnalysis: {
        killRating: formData.killRating[0],
        killRatingText: killRatingTexts[formData.killRating[0] as keyof typeof killRatingTexts],
        lethalDose: formData.lethalDose,
        timeToDeath: formData.timeToDeath,
        mechanism: formData.mechanism,
        survival: formData.survival,
        finalWords: formData.finalWords,
        allergyRisk: formData.allergyRisk
      },
      contributor: "anonymous", // Could be enhanced with user auth
      createdAt: new Date().toISOString(),
      votes: 0
    };

    // Add to community database
    addCommunityTrainingData(trainingData);
    
    // Call the completion handler
    onTrainingComplete(trainingData);
    
    toast.success("🎯 Training data added!", {
      description: "Thanks for helping train the AI! Your contribution will help other users."
    });
    
    // Reset form and close
    setFormData({
      name: "",
      description: "",
      category: "" as any,
      killRating: [3],
      lethalDose: "",
      timeToDeath: "",
      mechanism: "",
      survival: "",
      finalWords: "",
      allergyRisk: ""
    });
    setStep(1);
    onClose();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if (step === 1) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass-card border-primary/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Brain className="w-5 h-5" />
              Help Train the AI
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-6">
              <Users className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Needs Your Help!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                The AI couldn't confidently identify this item. Your expertise can help train it for future users!
              </p>
              
              {imageFile && (
                <div className="mb-4">
                  <img 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Item to analyze" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto border border-border"
                  />
                </div>
              )}
              
              {aiDetectedLabels.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">AI detected these possibilities:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {aiDetectedLabels.slice(0, 3).map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setStep(2)} 
                className="w-full gradient-bg hover:scale-105 transition-all duration-200"
              >
                <Star className="w-4 h-4 mr-2" />
                Yes, I'll Help Train the AI
              </Button>
              
              <Button 
                onClick={onClose} 
                variant="outline" 
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-primary/30 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Brain className="w-5 h-5" />
            Train AI: Death Analysis Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Item Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">Item Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Tylenol, Bleach, Apple..."
                  className="bg-input border-border"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as any }))}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="chemical">Chemical</SelectItem>
                    <SelectItem value="plant">Plant</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="object">Household Object</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the item..."
                className="bg-input border-border"
              />
            </div>
          </div>

          {/* Death Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Death Analysis</h3>
            
            <div>
              <Label>Kill Rating: {formData.killRating[0]}/5</Label>
              <div className="mt-2">
                <Slider
                  value={formData.killRating}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, killRating: value }))}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {killRatingTexts[formData.killRating[0] as keyof typeof killRatingTexts]}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lethalDose">Lethal Dose</Label>
                <Input
                  id="lethalDose"
                  value={formData.lethalDose}
                  onChange={(e) => setFormData(prev => ({ ...prev, lethalDose: e.target.value }))}
                  placeholder="e.g., 10mg/kg, 1 cup, single pill..."
                  className="bg-input border-border"
                />
              </div>
              
              <div>
                <Label htmlFor="timeToDeath">Time to Death</Label>
                <Input
                  id="timeToDeath"
                  value={formData.timeToDeath}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeToDeath: e.target.value }))}
                  placeholder="e.g., 30 minutes, 2-4 hours..."
                  className="bg-input border-border"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="mechanism">Death Mechanism</Label>
              <Textarea
                id="mechanism"
                value={formData.mechanism}
                onChange={(e) => setFormData(prev => ({ ...prev, mechanism: e.target.value }))}
                placeholder="How does this item cause death? (e.g., liver failure, cardiac arrest...)"
                className="bg-input border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="survival">Survival Tips</Label>
              <Textarea
                id="survival"
                value={formData.survival}
                onChange={(e) => setFormData(prev => ({ ...prev, survival: e.target.value }))}
                placeholder="What to do if exposed? (e.g., call poison control, induce vomiting...)"
                className="bg-input border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="allergyRisk">Allergy Risk</Label>
              <Input
                id="allergyRisk"
                value={formData.allergyRisk}
                onChange={(e) => setFormData(prev => ({ ...prev, allergyRisk: e.target.value }))}
                placeholder="Common allergic reactions or 'None known'"
                className="bg-input border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="finalWords">Final Words (Optional)</Label>
              <Input
                id="finalWords"
                value={formData.finalWords}
                onChange={(e) => setFormData(prev => ({ ...prev, finalWords: e.target.value }))}
                placeholder="Dramatic death quote or dark humor..."
                className="bg-input border-border"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1 gradient-bg">
              <Upload className="w-4 h-4 mr-2" />
              Submit Training Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};