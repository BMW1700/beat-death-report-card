import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull, ArrowRight, LogIn, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Core components
import { LifeClock } from "@/components/LifeClock";
import { LifeTracker } from "@/components/LifeTracker";
import { TodaySummary } from "@/components/TodaySummary";
import { TrendingDeaths } from "@/components/TrendingDeaths";
import { DeathScore } from "@/components/DeathScore";
import { DailyDeathFact } from "@/components/DailyDeathFact";
import { DeathSpinWheel } from "@/components/DeathSpinWheel";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

// Community & extras (collapsible)
import { EnhancedAchievements } from "@/components/EnhancedAchievements";

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
import { ImmortalModeCopilot } from "@/components/ImmortalModeCopilot";
import { SurvivalistModeToggle } from "@/components/SurvivalistModeToggle";
import { FieldManual } from "@/components/FieldManual";
import { ViralChallengeHub } from "@/components/viral/ViralChallengeHub";
import { CollaborativeDeathMap } from "@/components/viral/CollaborativeDeathMap";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading, profile } = useAuth();
  const [showCommunity, setShowCommunity] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/auth');
      return;
    }

    const hasLocalOnboarded = localStorage.getItem('beatdeath_onboarded') === 'true';
    const hasProfileOnboarded = Boolean(profile?.onboarding_completed_at);

    if (!hasLocalOnboarded && !hasProfileOnboarded) {
      navigate('/onboarding');
    }
  }, [navigate, user, loading, profile?.onboarding_completed_at]);

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
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* ── Section A: Hero + Quick Actions ── */}
        <section className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Skull className="w-10 h-10 text-destructive drop-shadow-lg animate-death-pulse" />
            <h1 className="text-5xl font-bold font-playfair tracking-tight gradient-text drop-shadow-lg">
              BeatDeath
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Scan anything. See how it kills you. Based on <span className="text-primary font-semibold">your</span> biology.
          </p>

          <Link to="/death-scanner">
            <Button className="bg-gradient-to-r from-primary to-destructive text-primary-foreground px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-xl purple-glow hover:brightness-110">
              <Skull className="w-5 h-5 mr-2" />
              Scan for Death Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground mt-4">
            For Entertainment Only — Not Medical Advice
          </p>
        </section>

        {/* ── Section B: Life Clock + Tracker + Daily Stats ── */}
        <section className="mb-8">
          <LifeClock />
        </section>

        <section className="mb-8">
          <TodaySummary />
        </section>

        <section className="mb-8">
          <LifeTracker />
        </section>

        <section className="mb-8">
          <div className="glass-card">
            <DailyDeathFact />
          </div>
        </section>

        {/* ── Section C: Featured Content (4 cards max) ── */}
        <section className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="glass-card border border-border hover:border-primary/40 transition-colors duration-200">
            <TrendingDeaths />
          </div>
          <div className="glass-card border border-border hover:border-primary/40 transition-colors duration-200">
            <DeathSpinWheel />
          </div>
          <div className="glass-card border border-border hover:border-primary/40 transition-colors duration-200">
            <DeathScore />
          </div>
          <div className="glass-card border border-border hover:border-primary/40 transition-colors duration-200">
            <SurvivalStreakTracker />
          </div>
        </section>

        {/* ── Section D: Community & More (collapsible) ── */}
        <section className="mb-12">
          <Button
            variant="outline"
            onClick={() => setShowCommunity(!showCommunity)}
            className="w-full border-primary/30 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors duration-200 mb-4"
          >
            {showCommunity ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Hide Community & More
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                View Community & More
              </>
            )}
          </Button>

          {showCommunity && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              <SurvivalistModeToggle />
              <FieldManual />
              <ViralChallengeHub />
              <ViralSharingHub />
              <WildernessScanner />
              <LiveGlobalFeed />
              <CollaborativeDeathMap />
              <ImmortalModeCopilot />
              <CommunityLeaderboard />
              <UserStories />
              <DeathDuel />
              <DeathTrendsDashboard />
              <EnhancedAchievements />
              <PremiumUpsell />
              <InAppPurchases />
              <SurvivalGearMarketplace />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-muted-foreground font-playfair pb-8">
          <p className="text-sm">Stay smart. Stay weird. Be BeatDeath. 💀</p>
          <p className="text-xs mt-1 opacity-60">Version 2.0 • Powered by AI</p>
        </footer>

        <PWAInstallPrompt />
      </div>
    </div>
  );
};

export default Index;
