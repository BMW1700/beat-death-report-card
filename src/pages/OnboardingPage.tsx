import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Skull, 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  AlertTriangle, 
  Shield,
  Eye,
  Clock,
  Smartphone
} from 'lucide-react';
import { useLifeClock } from '@/contexts/LifeClockContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

const ONBOARDING_STEPS = [
  'welcome',
  'understanding',
  'profile',
  'permissions',
  'ready'
] as const;

type OnboardingStep = typeof ONBOARDING_STEPS[number];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateUserData, state } = useLifeClock();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [profileData, setProfileData] = useState({
    age: '',
    sex: '',
    height: '',
    weight: ''
  });
  const [permissions, setPermissions] = useState({
    healthKit: false,
    notifications: false,
    camera: false
  });
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const currentStepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    // Save profile data
    if (profileData.age && profileData.sex) {
      updateUserData({
        age: parseInt(profileData.age),
        sex: profileData.sex as 'male' | 'female' | 'other',
        height: parseInt(profileData.height) || 170,
        weight: parseInt(profileData.weight) || 70
      });
    }

    // Mark onboarding as complete
    localStorage.setItem('beatdeath_onboarded', 'true');

    toast({
      title: "Welcome to Beat Death!",
      description: "Your life clock is now running. Start taking actions to extend your time!",
      variant: "default"
    });

    navigate('/');
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'welcome':
        return hasAcceptedTerms;
      case 'understanding':
        return true;
      case 'profile':
        return profileData.age && profileData.sex;
      case 'permissions':
        return true;
      case 'ready':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen gradient-secondary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="p-8">
            
            {/* Welcome Step */}
            {currentStep === 'welcome' && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Skull className="w-16 h-16 text-destructive animate-death-pulse" />
                  <h1 className="text-5xl font-bold font-playfair gradient-text">
                    BeatDeath
                  </h1>
                  <Heart className="w-16 h-16 text-success animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Welcome to the Future of Longevity</h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    A scientifically-inspired, gamified platform where your real-world actions 
                    immediately impact your life expectancy countdown.
                  </p>
                </div>

                <div className="bg-card/50 p-4 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-2">You'll Start With:</h3>
                  <div className="text-3xl font-bold gradient-text">80 Years</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Real-time countdown that changes based on your verified actions
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Checkbox 
                    id="terms" 
                    checked={hasAcceptedTerms}
                    onCheckedChange={(checked) => setHasAcceptedTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-muted-foreground">
                    I understand this is for entertainment only and not medical advice
                  </Label>
                </div>

                <div className="flex items-center justify-center gap-2 text-warning text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Always consult healthcare professionals for medical decisions</span>
                </div>
              </div>
            )}

            {/* Understanding Step */}
            {currentStep === 'understanding' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">How Beat Death Works</h2>
                  <p className="text-muted-foreground">
                    Understand the dual display system that makes this app unique
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Scientific Mode */}
                  <div className="p-4 bg-secondary/20 rounded-lg border border-secondary/40">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-5 h-5 text-secondary" />
                      <h3 className="font-semibold">Scientific Mode</h3>
                      <Badge variant="secondary">Credible</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>• Based on peer-reviewed research</p>
                      <p>• Shows real lifetime impact (HYG)</p>
                      <p>• Daily contribution calculations</p>
                      <p>• Conservative, evidence-based</p>
                    </div>
                    <div className="mt-3 p-2 bg-secondary/30 rounded text-xs">
                      Example: "Daily exercise → +3.0 years if sustained. Today: +3 days"
                    </div>
                  </div>

                  {/* Playful Mode */}
                  <div className="p-4 bg-accent/20 rounded-lg border border-accent/40">
                    <div className="flex items-center gap-2 mb-3">
                      <Skull className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold">Playful Mode</h3>
                      <Badge variant="default">Viral</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>• Instant gratification</p>
                      <p>• Scaled for virality</p>
                      <p>• Verification bonuses</p>
                      <p>• Addictive feedback loops</p>
                    </div>
                    <div className="mt-3 p-2 bg-accent/30 rounded text-xs">
                      Example: "Instant gain: +2 minutes (Verified: +3 min)"
                    </div>
                  </div>
                </div>

                <div className="bg-primary/20 p-4 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Both modes shown together</p>
                  <p className="text-sm text-muted-foreground">
                    Scientific credibility + viral engagement = unique experience
                  </p>
                </div>
              </div>
            )}

            {/* Profile Step */}
            {currentStep === 'profile' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                  <p className="text-muted-foreground">
                    Help us personalize your life clock calculations (optional but recommended)
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input 
                      id="age"
                      type="number"
                      placeholder="25"
                      value={profileData.age}
                      onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex *</Label>
                    <Select 
                      value={profileData.sex}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, sex: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other/Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height"
                      type="number"
                      placeholder="170"
                      value={profileData.height}
                      onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={profileData.weight}
                      onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="bg-muted/20 p-4 rounded-lg text-sm text-center">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Your data stays on your device. We don't store personal information on our servers.
                </div>
              </div>
            )}

            {/* Permissions Step */}
            {currentStep === 'permissions' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Optional Integrations</h2>
                  <p className="text-muted-foreground">
                    Enable features for a better experience (all optional)
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border border-primary/20 rounded-lg">
                    <Checkbox 
                      id="healthkit"
                      checked={permissions.healthKit}
                      onCheckedChange={(checked) => 
                        setPermissions(prev => ({ ...prev, healthKit: checked as boolean }))
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="healthkit" className="font-medium">Health Data Sync</Label>
                      <p className="text-sm text-muted-foreground">
                        Connect Apple Health or Google Fit for automatic action logging
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-primary/20 rounded-lg">
                    <Checkbox 
                      id="camera"
                      checked={permissions.camera}
                      onCheckedChange={(checked) => 
                        setPermissions(prev => ({ ...prev, camera: checked as boolean }))
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="camera" className="font-medium">Camera Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Verify actions with video for bonus time rewards
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-primary/20 rounded-lg">
                    <Checkbox 
                      id="notifications"
                      checked={permissions.notifications}
                      onCheckedChange={(checked) => 
                        setPermissions(prev => ({ ...prev, notifications: checked as boolean }))
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="notifications" className="font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders for healthy actions and achievement notifications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ready Step */}
            {currentStep === 'ready' && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Smartphone className="w-12 h-12 text-success" />
                  <Clock className="w-16 h-16 text-primary animate-pulse" />
                  <Skull className="w-12 h-12 text-accent" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">You're Ready!</h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Your life clock is about to start ticking. Every action counts now.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-4">Start at 80 Years</h3>
                  <div className="text-4xl font-bold gradient-text mb-2">
                    {state.userData.baselineYears} Years
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your real-time countdown begins now. Make every moment count!
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  Ready to beat death one action at a time?
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-primary/20">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 'welcome'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!canContinue()}
              >
                {currentStep === 'ready' ? 'Start Beating Death' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}