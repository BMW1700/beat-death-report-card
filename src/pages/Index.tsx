import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull, AlertTriangle, ArrowRight, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Import Life Clock components
import { LifeClock } from "@/components/LifeClock";
import { ActionLogger } from "@/components/ActionLogger";
import { TimeMarketplace } from "@/components/TimeMarketplace";
import { TrendingDeaths } from "@/components/TrendingDeaths";
import { DeathScore } from "@/components/DeathScore";
import { EnhancedAchievements } from "@/components/EnhancedAchievements";
import { Leaderboard } from "@/components/Leaderboard";
import { DailyDeathFact } from "@/components/DailyDeathFact";
import { UserStories } from "@/components/UserStories";
import { DeathTrendsDashboard } from "@/components/DeathTrendsDashboard";
import { DeathDuel } from "@/components/DeathDuel";
import { CommunityLeaderboard } from "@/components/CommunityLeaderboard";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { InAppPurchases } from "@/components/InAppPurchases";
import { ViralSharingHub } from "@/components/ViralSharingHub";
import { WildernessScanner } from "@/components/WildernessScanner";
import { LiveGlobalFeed } from "@/components/LiveGlobalFeed";
import { SurvivalStreakTracker } from "@/components/SurvivalStreakTracker";
import { SurvivalGearMarketplace } from "@/components/SurvivalGearMarketplace";
import { DeathSpinWheel } from "@/components/DeathSpinWheel";
import { ImmortalModeCopilot } from "@/components/ImmortalModeCopilot";
import { SurvivalistModeToggle } from "@/components/SurvivalistModeToggle";
import { FieldManual } from "@/components/FieldManual";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

// Viral Components - Phase 4 Implementation
import { ViralChallengeHub } from "@/components/viral/ViralChallengeHub";
import { SocialMediaIntegration } from "@/components/viral/SocialMediaIntegration";
import { LiveDeathFeed } from "@/components/viral/LiveDeathFeed";
import { CollaborativeDeathMap } from "@/components/viral/CollaborativeDeathMap";


const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Check authentication and onboarding
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }

    const hasOnboarded = localStorage.getItem('beatdeath_onboarded');
    if (!hasOnboarded) {
      navigate('/onboarding');
    }
  }, [navigate, user, loading]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen gradient-secondary-bg flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-12 h-12 text-destructive animate-death-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your deadly profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen gradient-secondary-bg flex items-center justify-center">
        <Card className="glass-card max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="gradient-text">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Please sign in to access BeatDeath</p>
            <Link to="/auth">
              <Button className="gradient-bg">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-secondary-bg pt-16 transition-colors duration-300">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Skull className="w-12 h-12 text-destructive drop-shadow-lg animate-death-pulse" />
            <h1 className="text-7xl font-bold font-playfair tracking-tight gradient-text drop-shadow-lg">
              BeatDeath
            </h1>
            <Skull className="w-12 h-12 text-destructive drop-shadow-lg animate-death-pulse" />
          </div>
          <p className="text-2xl font-playfair text-muted-foreground max-w-2xl mx-auto text-balance">
            Your darkly funny, science-informed platform that reveals how common items and scenarios can kill you. 
            Based on YOUR unique biology. Now with <span className="text-success font-bold">Survivalist Mode</span> for field operations.
          </p>
          
          {/* Quick Death Scanner Access */}
          <div className="mt-8">
            <Link to="/death-scanner">
              <Button className="bg-gradient-to-r from-primary to-destructive text-primary-foreground px-8 py-3 text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-xl">
                <Skull className="w-5 h-5 mr-2" />
                Scan for Death Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-warning">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">For Entertainment Only - Not Medical Advice</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* CORE LIFE CLOCK SECTION - TOP PRIORITY */}
        <div className="mb-8">
          <LifeClock />
        </div>

        {/* ACTION & MARKETPLACE SECTION */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ActionLogger />
          <TimeMarketplace />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Core Engagement */}
          <div className="space-y-6 animate-slide-in-right">
            {/* Survivalist Mode Toggle */}
            <SurvivalistModeToggle />
            
            {/* Field Manual for Quick Reference */}
            <FieldManual />
            
            {/* VIRAL PHASE 4.1: LIVE ENGAGEMENT */}
            <ViralChallengeHub />
            
            {/* VIRAL PHASE 4.2: VIRAL SHARING HUB */}
            <ViralSharingHub />
            
            {/* SURVIVALIST FEATURES */}
            <WildernessScanner />
            
            {/* Core Features - Optimized for Virality */}
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathSpinWheel />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DailyDeathFact />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathScore />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <EnhancedAchievements />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <SurvivalStreakTracker />
            </div>
          </div>

          {/* Center Column - Real-Time Social Feed */}
          <div className="space-y-6 animate-fade-in delay-150">
            {/* VIRAL PHASE 4.3: LIVE GLOBAL FEED */}
            <LiveGlobalFeed />
            
            {/* Analytics & Trending - Optimized for Viral Discovery */}
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <TrendingDeaths />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathTrendsDashboard />
            </div>
            <div className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <PremiumUpsell />
            </div>
          </div>

          {/* Right Column - Global Community & Monetization */}
          <div className="space-y-6 animate-slide-in-right delay-300">
            {/* VIRAL PHASE 4.4: COLLABORATIVE WORLD MAP */}
            <CollaborativeDeathMap />
            
            {/* Core AI & Premium Features */}
            <div className="glass-card shadow-2xl border-success/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <ImmortalModeCopilot />
            </div>
            
            {/* Community & Competition */}
            <div className="glass-card shadow-xl border-warning/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <Leaderboard />
            </div>
            <div className="glass-card shadow-lg border-accent/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <UserStories />
            </div>
            
            {/* Viral Referral System */}
            <div className="glass-card p-4 border-primary/30 transition-all duration-300 hover:shadow-lg danger-glow">
              <div className="text-sm text-card-foreground font-bold">🔥 VIRAL REFERRAL CODE 🔥</div>
              <div className="text-lg font-mono bg-primary/20 px-3 py-2 rounded mt-2 text-primary text-center">BD-{Math.floor(Math.random()*9999)}</div>
              <div className="text-xs text-muted-foreground mt-2 text-center">Share & earn viral badges! 10M users coming!</div>
            </div>
            
            {/* Essential Community Features Only */}
            <div className="glass-card danger-glow transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <DeathDuel />
            </div>
            <div className="glass-card transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <CommunityLeaderboard />
            </div>
            
            {/* Monetization */}
            <div className="glass-card border-success/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <InAppPurchases />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground font-playfair animate-fade-in">
          <p className="text-sm">
            Stay smart. Stay weird. Be BeatDeath. 💀
          </p>
          <p className="text-xs mt-2 opacity-75">
            Version 2.0 • Powered by AI • Built for the curious and morbid • Survivalist Ready 🎯
          </p>
        </div>

        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </div>
  );
};

export default Index;
