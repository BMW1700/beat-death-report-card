import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Skull,
  Heart,
  ArrowRight,
  ArrowLeft,
  Mail,
  DollarSign,
  Activity,
  Apple,
  Moon,
  Smile,
  Cigarette,
  Pill,
  TrendingUp,
  Star,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { calculateLifeExpectancy, getDataMonetizationValue } from '@/utils/lifeExpectancyCalculator';

const ONBOARDING_STEPS = [
  'welcome',
  'consent',
  'demographics',
  'physical',
  'exercise',
  'diet',
  'sleep',
  'mental',
  'lifestyle',
  'health',
  'products',
  'results'
] as const;

type OnboardingStep = typeof ONBOARDING_STEPS[number];

interface OnboardingData {
  email: string;
  consentLevel: string;
  age: string;
  sex: string;
  height: string;
  weight: string;
  exerciseFrequency: string;
  exerciseIntensity: string;
  exerciseYears: string;
  dietQuality: number;
  dietRestrictions: string;
  sleepHours: number;
  sleepQuality: number;
  stressLevel: number;
  happinessScore: number;
  socialScore: number;
  lifeSatisfaction: number;
  smokingStatus: string;
  alcoholFrequency: string;
  chronicConditions: string[];
  medications: string;
  desiredProducts: string[];
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, loading, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({
    email: '',
    consentLevel: 'none',
    age: '',
    sex: '',
    height: '',
    weight: '',
    exerciseFrequency: '',
    exerciseIntensity: '',
    exerciseYears: '0',
    dietQuality: 5,
    dietRestrictions: '',
    sleepHours: 7,
    sleepQuality: 5,
    stressLevel: 5,
    happinessScore: 7,
    socialScore: 5,
    lifeSatisfaction: 7,
    smokingStatus: '',
    alcoholFrequency: '',
    chronicConditions: [],
    medications: '0',
    desiredProducts: [],
  });
  const [calculatedResults, setCalculatedResults] = useState<any>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  // If the user already completed onboarding, never show this flow again.
  useEffect(() => {
    const hasLocalOnboarded = localStorage.getItem('beatdeath_onboarded') === 'true';
    const hasProfileOnboarded = Boolean(profile?.onboarding_completed_at);

    if (hasLocalOnboarded || hasProfileOnboarded) {
      navigate('/', { replace: true });
    }
  }, [navigate, profile?.onboarding_completed_at]);

  const currentStepIndex = ONBOARDING_STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = async () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    
    if (currentIndex === ONBOARDING_STEPS.length - 2) {
      // Calculate results before showing them
      await calculateAndShowResults();
    }
    
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex - 1]);
    }
  };

  const calculateAndShowResults = async () => {
    const healthData = {
      age: parseInt(data.age),
      sex: data.sex as 'male' | 'female' | 'other',
      weight: parseFloat(data.weight),
      height: parseFloat(data.height),
      exerciseFrequency: data.exerciseFrequency as any,
      exerciseIntensity: data.exerciseIntensity as any,
      exerciseHistoryYears: parseInt(data.exerciseYears),
      dietQualityScore: data.dietQuality,
      sleepHoursAvg: data.sleepHours,
      sleepQualityScore: data.sleepQuality,
      stressLevel: data.stressLevel,
      happinessScore: data.happinessScore,
      socialConnectionsScore: data.socialScore,
      lifeSatisfactionScore: data.lifeSatisfaction,
      smokingStatus: data.smokingStatus as any,
      alcoholFrequency: data.alcoholFrequency as any,
      chronicConditionsCount: data.chronicConditions.length,
      medicationCount: parseInt(data.medications)
    };

    const results = calculateLifeExpectancy(healthData);
    const dataValue = getDataMonetizationValue(data.consentLevel, results.healthScore);
    
    setCalculatedResults({ ...results, dataValue });
  };

  const handleComplete = async () => {
    if (loading) {
      toast({ title: "Loading your session…", description: "Try again in a second." });
      return;
    }

    if (!user) {
      toast({ title: "Please log in first", variant: "destructive" });
      navigate('/auth', { replace: true });
      return;
    }

    try {
      // Save all data to Supabase profiles
      const { error } = await supabase
        .from('profiles')
        .update({
          email: data.email,
          data_consent_level: data.consentLevel,
          age: parseInt(data.age),
          gender: data.sex,
          weight: parseFloat(data.weight),
          weight_unit: 'kg',
          exercise_frequency: data.exerciseFrequency,
          exercise_intensity: data.exerciseIntensity,
          exercise_history_years: parseInt(data.exerciseYears),
          diet_quality_score: data.dietQuality,
          diet_restrictions: data.dietRestrictions,
          sleep_hours_avg: data.sleepHours,
          sleep_quality_score: data.sleepQuality,
          stress_level: data.stressLevel,
          happiness_score: data.happinessScore,
          social_connections_score: data.socialScore,
          life_satisfaction_score: data.lifeSatisfaction,
          smoking_status: data.smokingStatus,
          alcohol_frequency: data.alcoholFrequency,
          chronic_conditions: data.chronicConditions,
          medication_count: parseInt(data.medications),
          desired_products: data.desiredProducts,
          calculated_baseline_years: calculatedResults?.baselineYears ?? null,
          health_score: calculatedResults?.healthScore ?? null,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      localStorage.setItem('beatdeath_onboarded', 'true');

      toast({
        title: "🎉 Profile Complete!",
        description: calculatedResults
          ? `Your personalized life expectancy: ${calculatedResults.baselineYears} years. Health score: ${calculatedResults.healthScore}/100`
          : "Onboarding completed successfully.",
      });

      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: "Error saving profile", variant: "destructive" });
    }
  };

  const canContinue = () => {
    switch (currentStep) {
      case 'welcome': return hasAcceptedTerms && data.email.includes('@');
      case 'consent': return data.consentLevel !== 'none';
      case 'demographics': return data.age && data.sex;
      case 'physical': return data.height && data.weight;
      case 'exercise': return data.exerciseFrequency && data.exerciseIntensity;
      case 'lifestyle': return data.smokingStatus && data.alcoholFrequency;
      default: return true;
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-secondary-bg flex items-center justify-center p-4">
        <div className="text-center">
          <Skull className="w-12 h-12 text-destructive animate-death-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your deadly profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-secondary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        <Card className="glass-card">
          <CardContent className="p-8">
            
            {/* Welcome + Email (combined) */}
            {currentStep === 'welcome' && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <Skull className="w-16 h-16 text-destructive animate-death-pulse" />
                  <h1 className="text-5xl font-bold font-playfair gradient-text">BeatDeath</h1>
                  <Heart className="w-16 h-16 text-success animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold">Discover Your True Life Expectancy</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Complete our comprehensive health assessment to get a personalized life expectancy calculation based on your unique lifestyle and health factors.
                </p>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">We'll calculate your PERSONALIZED baseline</p>
                  <p className="text-xs text-muted-foreground mt-1">No more generic 80 years - get YOUR number!</p>
                </div>
                
                {/* Email field integrated into welcome */}
                <div className="space-y-2 text-left max-w-md mx-auto">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Your Email *
                  </Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={(e) => updateData('email', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Required to save your results</p>
                </div>
                
                <div className="flex items-start space-x-2 text-sm">
                  <Checkbox 
                    id="terms" 
                    checked={hasAcceptedTerms}
                    onCheckedChange={(checked) => setHasAcceptedTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-muted-foreground text-left">
                    I understand this is for entertainment and educational purposes only. This is not medical advice.
                  </Label>
                </div>
              </div>
            )}


            {/* Data Consent Tiers */}
            {currentStep === 'consent' && (
              <div className="space-y-6">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Data Sharing Benefits</h2>
                  <p className="text-muted-foreground">Choose how you want to participate (optional)</p>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${data.consentLevel === 'none' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => updateData('consentLevel', 'none')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">Private Mode</h3>
                      <Badge variant="outline">Free</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Your data stays with you. No sharing, no compensation.</p>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${data.consentLevel === 'bronze' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => updateData('consentLevel', 'bronze')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">Bronze Tier</h3>
                      <Badge>$1-5/month value</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Share anonymized basic health metrics with research partners.</p>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${data.consentLevel === 'silver' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => updateData('consentLevel', 'silver')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">Silver Tier</h3>
                      <Badge>$5-25/month value</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Include detailed lifestyle data for health product companies.</p>
                  </div>

                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${data.consentLevel === 'gold' ? 'border-primary bg-primary/5' : 'border-border'}`}
                    onClick={() => updateData('consentLevel', 'gold')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Gold Tier
                      </h3>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">$25-100+/month value</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Premium data package with ongoing health tracking insights. Maximum value.</p>
                  </div>
                </div>

                <div className="bg-success/10 p-3 rounded text-xs text-center">
                  💰 You can change this anytime. Higher tiers unlock premium features + compensation!
                </div>
              </div>
            )}

            {/* Demographics */}
            {currentStep === 'demographics' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Basic Information</h2>
                  <p className="text-muted-foreground">Help us calculate your baseline</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input 
                      id="age"
                      type="number"
                      placeholder="25"
                      value={data.age}
                      onChange={(e) => updateData('age', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sex">Biological Sex *</Label>
                    <Select value={data.sex} onValueChange={(v) => updateData('sex', v)}>
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
                </div>
              </div>
            )}

            {/* Physical Measurements */}
            {currentStep === 'physical' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Physical Measurements</h2>
                  <p className="text-muted-foreground">BMI is a key longevity factor</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input 
                      id="height"
                      type="number"
                      placeholder="170"
                      value={data.height}
                      onChange={(e) => updateData('height', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input 
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={data.weight}
                      onChange={(e) => updateData('weight', e.target.value)}
                    />
                  </div>
                </div>
                {data.height && data.weight && (
                  <div className="bg-primary/10 p-3 rounded text-center">
                    <p className="text-sm font-medium">
                      Your BMI: {(parseFloat(data.weight) / Math.pow(parseFloat(data.height) / 100, 2)).toFixed(1)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Exercise */}
            {currentStep === 'exercise' && (
              <div className="space-y-6">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Exercise Habits</h2>
                  <p className="text-muted-foreground">One of the biggest longevity factors!</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>How often do you exercise? *</Label>
                    <Select value={data.exerciseFrequency} onValueChange={(v) => updateData('exerciseFrequency', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily (+5 years)</SelectItem>
                        <SelectItem value="3-5x_week">3-5x per week (+4 years)</SelectItem>
                        <SelectItem value="1-2x_week">1-2x per week (+2 years)</SelectItem>
                        <SelectItem value="rarely">Rarely (-1 year)</SelectItem>
                        <SelectItem value="never">Never (-3 years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Exercise intensity? *</Label>
                    <Select value={data.exerciseIntensity} onValueChange={(v) => updateData('exerciseIntensity', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select intensity..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High (running, sports)</SelectItem>
                        <SelectItem value="moderate">Moderate (brisk walking, cycling)</SelectItem>
                        <SelectItem value="light">Light (casual walking)</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Years of consistent exercise</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={data.exerciseYears}
                      onChange={(e) => updateData('exerciseYears', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Diet */}
            {currentStep === 'diet' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Apple className="w-12 h-12 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Diet & Nutrition</h2>
                  <p className="text-muted-foreground">You are what you eat</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Diet quality: {data.dietQuality}/10</Label>
                    <Slider 
                      value={[data.dietQuality]} 
                      onValueChange={(v) => updateData('dietQuality', v[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {data.dietQuality <= 3 && "Mostly processed/fast food"}
                      {data.dietQuality > 3 && data.dietQuality <= 6 && "Mixed - some healthy, some processed"}
                      {data.dietQuality > 6 && data.dietQuality <= 8 && "Mostly whole foods, balanced"}
                      {data.dietQuality > 8 && "Excellent - whole foods, Mediterranean-style"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Dietary restrictions/preferences (optional)</Label>
                    <Input 
                      placeholder="e.g., vegetarian, keto, gluten-free"
                      value={data.dietRestrictions}
                      onChange={(e) => updateData('dietRestrictions', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sleep */}
            {currentStep === 'sleep' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Moon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Sleep Habits</h2>
                  <p className="text-muted-foreground">Sleep is when your body repairs itself</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Average sleep per night: {data.sleepHours} hours</Label>
                    <Slider 
                      value={[data.sleepHours]} 
                      onValueChange={(v) => updateData('sleepHours', v[0])}
                      min={3}
                      max={12}
                      step={0.5}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {data.sleepHours < 6 && "⚠️ Too little - major health impact"}
                      {data.sleepHours >= 6 && data.sleepHours < 7 && "Below optimal"}
                      {data.sleepHours >= 7 && data.sleepHours <= 8 && "✅ Optimal range!"}
                      {data.sleepHours > 8 && "More than needed"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Sleep quality: {data.sleepQuality}/10</Label>
                    <Slider 
                      value={[data.sleepQuality]} 
                      onValueChange={(v) => updateData('sleepQuality', v[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mental Health */}
            {currentStep === 'mental' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Smile className="w-12 h-12 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Mental Wellness</h2>
                  <p className="text-muted-foreground">Your mind affects your body</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Happiness level: {data.happinessScore}/10</Label>
                    <Slider 
                      value={[data.happinessScore]} 
                      onValueChange={(v) => updateData('happinessScore', v[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stress level: {data.stressLevel}/10</Label>
                    <Slider 
                      value={[data.stressLevel]} 
                      onValueChange={(v) => updateData('stressLevel', v[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground">1 = no stress, 10 = extremely stressed</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Social connections: {data.socialScore}/10</Label>
                    <Slider 
                      value={[data.socialScore]} 
                      onValueChange={(v) => updateData('socialScore', v[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground">Quality relationships and social support</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Life satisfaction: {data.lifeSatisfaction}/10</Label>
                    <Slider 
                      value={[data.lifeSatisfaction]} 
                      onValueChange={(v) => updateData('lifeSatisfaction', v[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {currentStep === 'lifestyle' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Cigarette className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Substance Use</h2>
                  <p className="text-muted-foreground">Major impact on longevity</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Smoking status *</Label>
                    <Select value={data.smokingStatus} onValueChange={(v) => updateData('smokingStatus', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoked (+2 years)</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current_light">Current - light (-5 years)</SelectItem>
                        <SelectItem value="current_heavy">Current - heavy (-10 years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Alcohol consumption *</Label>
                    <Select value={data.alcoholFrequency} onValueChange={(v) => updateData('alcoholFrequency', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="rarely">Rarely (few times/year)</SelectItem>
                        <SelectItem value="moderate">Moderate (1-2 drinks/week)</SelectItem>
                        <SelectItem value="heavy">Heavy (daily or binge)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Health History */}
            {currentStep === 'health' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Pill className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Health History</h2>
                  <p className="text-muted-foreground">Current health status</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chronic conditions (select all that apply)</Label>
                    <div className="space-y-2 mt-2">
                      {['Diabetes', 'Heart Disease', 'High Blood Pressure', 'Asthma', 'Arthritis', 'None'].map(condition => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox 
                            id={condition}
                            checked={data.chronicConditions.includes(condition)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateData('chronicConditions', [...data.chronicConditions, condition]);
                              } else {
                                updateData('chronicConditions', data.chronicConditions.filter(c => c !== condition));
                              }
                            }}
                          />
                          <Label htmlFor={condition} className="font-normal">{condition}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of regular medications</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={data.medications}
                      onChange={(e) => updateData('medications', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Product Interests */}
            {currentStep === 'products' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Health Interests</h2>
                  <p className="text-muted-foreground">What products interest you?</p>
                </div>
                <div className="space-y-2">
                  <Label>Select products you're interested in</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      'Supplements',
                      'Fitness Equipment',
                      'Sleep Trackers',
                      'Meditation Apps',
                      'Meal Planning',
                      'DNA Testing',
                      'Wearable Tech',
                      'Health Insurance'
                    ].map(product => (
                      <div key={product} className="flex items-center space-x-2">
                        <Checkbox 
                          id={product}
                          checked={data.desiredProducts.includes(product)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateData('desiredProducts', [...data.desiredProducts, product]);
                            } else {
                              updateData('desiredProducts', data.desiredProducts.filter(p => p !== product));
                            }
                          }}
                        />
                        <Label htmlFor={product} className="font-normal text-sm">{product}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-primary/10 p-3 rounded text-xs text-center">
                  💡 This helps us show you relevant products and increases your data value!
                </div>
              </div>
            )}

            {/* Results */}
            {currentStep === 'results' && calculatedResults && (
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Heart className="w-12 h-12 text-success animate-pulse" />
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-bold gradient-text">Your Personalized Results!</h2>
                
                <div className="bg-gradient-to-br from-primary/20 to-success/20 p-6 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Your Life Expectancy</p>
                  <div className="text-5xl font-bold gradient-text mb-2">{calculatedResults.baselineYears} Years</div>
                  <p className="text-sm text-muted-foreground">Based on your current lifestyle</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Health Score</p>
                    <div className="text-3xl font-bold">{calculatedResults.healthScore}/100</div>
                  </div>
                  <div className="bg-success/20 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Data Value</p>
                    <div className="text-3xl font-bold">${calculatedResults.dataValue}/mo</div>
                  </div>
                </div>

                <div className="bg-muted/20 p-4 rounded-lg text-left">
                  <p className="font-bold mb-2">Top Impact Factors:</p>
                  <div className="space-y-1 text-sm">
                    {calculatedResults.factors.slice(0, 5).map((factor: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>{factor.category}</span>
                        <span className={factor.impact > 0 ? 'text-success' : 'text-destructive'}>
                          {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(1)} yrs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">🎯 Ready to Beat Death?</p>
                  <p className="text-xs text-muted-foreground">
                    Your clock starts now. Every action you take will update your life expectancy in real-time!
                  </p>
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
                {currentStep === 'results' ? 'Start Beating Death!' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
