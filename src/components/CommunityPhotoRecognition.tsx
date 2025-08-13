import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  Search,
  ImageIcon,
  Users,
  Database,
  Brain,
  Skull,
  Clock,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { DeathAnalysis } from "@/types";

interface CommunityItem {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
  category: 'food' | 'object' | 'tool' | 'plant' | 'other';
  addedBy: string;
  addedAt: Date;
  votes: number;
  dangerLevel?: 'safe' | 'caution' | 'danger';
  survivalUse?: string;
  // Death analysis training data
  deathAnalysis?: {
    killRating: number;
    lethalDose: string;
    timeToDeath: string;
    mechanism: string;
    survival: string;
    finalWords: string;
    allergyRisk: string;
  };
}

interface CommunityPhotoRecognitionProps {
  onItemAdded?: (item: CommunityItem) => void;
}

export const CommunityPhotoRecognition = ({ onItemAdded }: CommunityPhotoRecognitionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'object' as CommunityItem['category'],
    dangerLevel: 'safe' as CommunityItem['dangerLevel'],
    survivalUse: '',
    // Death analysis fields
    killRating: 0,
    lethalDose: '',
    timeToDeath: '',
    mechanism: '',
    survival: '',
    finalWords: '',
    allergyRisk: 'none'
  });
  const [showDeathAnalysis, setShowDeathAnalysis] = useState(false);
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCamera, setIsCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsCamera(true);
      toast.success("📸 Camera started! Position the object and click capture.");
    } catch (error) {
      toast.error("Unable to access camera");
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
        setShowAddForm(true);
        toast.success("📸 Photo captured! Now add details about this item.");
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setShowAddForm(true);
        toast.success("🖼️ Image uploaded! Add details about this item.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitItem = () => {
    if (!capturedImage || !newItem.name || !newItem.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const item: CommunityItem = {
      id: Date.now().toString(),
      imageUrl: capturedImage,
      name: newItem.name,
      description: newItem.description,
      category: newItem.category,
      dangerLevel: newItem.dangerLevel,
      survivalUse: newItem.survivalUse,
      addedBy: 'Anonymous', // In real app, get from auth
      addedAt: new Date(),
      votes: 1,
      deathAnalysis: showDeathAnalysis ? {
        killRating: newItem.killRating,
        lethalDose: newItem.lethalDose,
        timeToDeath: newItem.timeToDeath,
        mechanism: newItem.mechanism,
        survival: newItem.survival,
        finalWords: newItem.finalWords,
        allergyRisk: newItem.allergyRisk
      } : undefined
    };

    setCommunityItems(prev => [item, ...prev]);
    onItemAdded?.(item);
    
    // Reset form
    setCapturedImage(null);
    setNewItem({
      name: '',
      description: '',
      category: 'object',
      dangerLevel: 'safe',
      survivalUse: '',
      killRating: 0,
      lethalDose: '',
      timeToDeath: '',
      mechanism: '',
      survival: '',
      finalWords: '',
      allergyRisk: 'none'
    });
    setShowAddForm(false);
    setShowDeathAnalysis(false);
    
    toast.success("🎉 Item added to community database!", {
      description: showDeathAnalysis ? "AI training data included!" : "Other survivalists can now benefit from your knowledge!"
    });
  };

  const filteredItems = communityItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDangerColor = (level?: string) => {
    switch (level) {
      case 'danger': return 'hsl(0 84% 60%)';
      case 'caution': return 'hsl(38 92% 50%)';
      default: return 'hsl(142 71% 45%)';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card border-primary/30 primary-glow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Database className="w-5 h-5" />
            Community Recognition Database
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Help build a survival database by photographing and describing objects, food, and tools
          </p>
        </CardHeader>
        <CardContent>
          {!showAddForm ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={startCamera}
                  className="flex-1 gradient-bg"
                  disabled={isCamera}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Take Photo
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {/* Search existing items */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search community database..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {communityItems.length} items in community database
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Add Item Details</h3>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setCapturedImage(null);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {capturedImage && (
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured item" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Input
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                />
                
                <Textarea
                  placeholder="Describe this item and its survival uses..."
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as CommunityItem['category'] }))}
                    className="p-2 text-sm rounded bg-background border border-border"
                  >
                    <option value="food">Food</option>
                    <option value="object">Object</option>
                    <option value="tool">Tool</option>
                    <option value="plant">Plant</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <select
                    value={newItem.dangerLevel}
                    onChange={(e) => setNewItem(prev => ({ ...prev, dangerLevel: e.target.value as CommunityItem['dangerLevel'] }))}
                    className="p-2 text-sm rounded bg-background border border-border"
                  >
                    <option value="safe">Safe</option>
                    <option value="caution">Caution</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
                
                <Input
                  placeholder="Survival use (optional)"
                  value={newItem.survivalUse}
                  onChange={(e) => setNewItem(prev => ({ ...prev, survivalUse: e.target.value }))}
                />
                
                {/* Death Analysis Training Toggle */}
                <div className="flex items-center justify-between p-3 border rounded-lg border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Add Death Analysis for AI Training</span>
                  </div>
                  <Button
                    onClick={() => setShowDeathAnalysis(!showDeathAnalysis)}
                    variant={showDeathAnalysis ? "default" : "outline"}
                    size="sm"
                  >
                    {showDeathAnalysis ? "Hide" : "Show"}
                  </Button>
                </div>
                
                {/* Death Analysis Form */}
                {showDeathAnalysis && (
                  <div className="space-y-3 p-3 border rounded-lg border-destructive/20 bg-destructive/5">
                    <div className="flex items-center gap-2 text-destructive">
                      <Skull className="w-4 h-4" />
                      <span className="text-sm font-semibold">Death Analysis Training Data</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Kill Rating (0-100)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newItem.killRating}
                          onChange={(e) => setNewItem(prev => ({ ...prev, killRating: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Allergy Risk</label>
                        <select
                          value={newItem.allergyRisk}
                          onChange={(e) => setNewItem(prev => ({ ...prev, allergyRisk: e.target.value }))}
                          className="w-full p-2 text-sm rounded bg-background border border-border"
                        >
                          <option value="none">None</option>
                          <option value="low">Low</option>
                          <option value="moderate">Moderate</option>
                          <option value="high">High</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Lethal Dose</label>
                      <Input
                        placeholder="e.g., 50mg per kg body weight"
                        value={newItem.lethalDose}
                        onChange={(e) => setNewItem(prev => ({ ...prev, lethalDose: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Time to Death</label>
                      <Input
                        placeholder="e.g., 2-4 hours"
                        value={newItem.timeToDeath}
                        onChange={(e) => setNewItem(prev => ({ ...prev, timeToDeath: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Death Mechanism</label>
                      <Textarea
                        placeholder="How this item causes death..."
                        value={newItem.mechanism}
                        onChange={(e) => setNewItem(prev => ({ ...prev, mechanism: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Survival Tips</label>
                      <Textarea
                        placeholder="How to survive exposure..."
                        value={newItem.survival}
                        onChange={(e) => setNewItem(prev => ({ ...prev, survival: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground">Final Words</label>
                      <Input
                        placeholder="Dramatic last words..."
                        value={newItem.finalWords}
                        onChange={(e) => setNewItem(prev => ({ ...prev, finalWords: e.target.value }))}
                      />
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={handleSubmitItem}
                  className="w-full gradient-bg"
                  disabled={!newItem.name || !newItem.description}
                >
                  <Check className="w-4 h-4 mr-1" />
                  {showDeathAnalysis ? "Add Training Data" : "Add to Database"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Camera View */}
      {isCamera && (
        <Card className="glass-card border-primary/30">
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-48 object-cover rounded-lg bg-black"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <Button
                  onClick={capturePhoto}
                  size="sm"
                  className="gradient-bg"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Capture
                </Button>
                <Button
                  onClick={stopCamera}
                  size="sm"
                  variant="destructive"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>
      )}

      {/* Community Items List */}
      {filteredItems.length > 0 && (
        <Card className="glass-card border-success/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-success flex items-center gap-2">
              <Database className="w-4 h-4" />
              Community Database ({filteredItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                      <Badge 
                        className="text-xs"
                        style={{ 
                          backgroundColor: getDangerColor(item.dangerLevel),
                          color: 'white'
                        }}
                      >
                        {item.dangerLevel}
                      </Badge>
                      {item.deathAnalysis && (
                        <Badge variant="secondary" className="text-xs">
                          <Brain className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>👍 {item.votes}</span>
                      {item.deathAnalysis && (
                        <>
                          <span>•</span>
                          <span className="text-destructive">💀 {item.deathAnalysis.killRating}/100</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};