import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, EyeOff, Skull, Heart, TrendingUp, Info } from 'lucide-react';
import { useLifeClock } from '@/contexts/LifeClockContext';
import { AnimatedGrimReaper } from '@/components/AnimatedGrimReaper';
import { cn } from '@/lib/utils';

export const LifeClock = () => {
  const { state, toggleScientificMode, getTimeRemaining } = useLifeClock();
  const [showExplanation, setShowExplanation] = useState(false);

  // Get fresh time data on each render - context updates every second
  const timeRemaining = getTimeRemaining();

  // Get recent contribution for today
  const todayContribution = state.recentActions
    .filter(action => {
      const today = new Date().toDateString();
      return action.timestamp.toDateString() === today;
    })
    .reduce((sum, action) => sum + (state.scientificMode ? action.scientific_minutes : action.playful_minutes), 0);

  // Get total contribution from all actions
  const totalContribution = state.recentActions
    .reduce((sum, action) => sum + (state.scientificMode ? action.scientific_minutes : action.playful_minutes), 0);

  const isPositiveContribution = todayContribution > 0;
  const isTotalPositive = totalContribution > 0;
  
  // Format contribution appropriately for both today and total
  const formatContribution = (minutes: number) => {
    const totalMinutes = Math.abs(minutes);
    if (totalMinutes < 60) {
      return `${totalMinutes.toFixed(0)} minutes`;
    } else if (totalMinutes < 1440) { // Less than 24 hours
      return `${(totalMinutes / 60).toFixed(1)} hours`;
    } else {
      return `${(totalMinutes / 1440).toFixed(1)} days`;
    }
  };

  // Format time display
  const formatTime = () => {
    if (state.scientificMode) {
      return {
        primary: `${timeRemaining.years}y ${timeRemaining.months}m ${timeRemaining.days}d`,
        secondary: `${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`,
        mode: "Scientific Mode"
      };
    } else {
      return {
        primary: `${timeRemaining.years}y ${timeRemaining.months}m ${timeRemaining.days}d`,
        secondary: `${timeRemaining.hours}h ${timeRemaining.minutes}m ${timeRemaining.seconds}s`,
        mode: "Playful Mode"
      };
    }
  };

  const timeDisplay = formatTime();

  return (
    <Card className={cn(
      "glass-card transition-all duration-500",
      isPositiveContribution ? "success-glow" : "danger-glow"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-playfair">
            <Clock className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '8s' }} />
            Life Clock
            <Badge variant={state.scientificMode ? "secondary" : "default"} className="ml-2">
              {timeDisplay.mode}
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
              className="h-8 w-8 p-0"
            >
              <Info className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleScientificMode}
              className="h-8 w-8 p-0"
            >
              {state.scientificMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm border border-primary/20">
            <div className="space-y-2">
              <div className="font-semibold text-primary">How the Life Clock Works:</div>
              <div>
                <strong>Scientific Mode:</strong> Shows real-time countdown based on evidence-based life expectancy research.
                Each action's impact is calculated from scientific studies (HYG = Habit Years Gained).
              </div>
              <div>
                <strong>Playful Mode:</strong> Scaled for instant gratification and viral sharing.
                Same scientific foundation, but amplified for immediate feedback.
              </div>
              <div className="text-warning text-xs mt-2">
                ⚠️ For entertainment only - not medical advice
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Professional Animated Grim Reaper */}
        <div className="flex justify-center mb-6">
          <AnimatedGrimReaper 
            timeRemaining={timeRemaining}
            todayContribution={todayContribution}
          />
        </div>

        {/* Main Time Display */}
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold font-mono gradient-text animate-glow">
            {timeDisplay.primary}
          </div>
          <div className="text-2xl font-mono text-muted-foreground">
            {timeDisplay.secondary}
          </div>
          <div className="text-sm text-muted-foreground">
            Time remaining based on current lifestyle
          </div>
        </div>

        {/* Today's Contribution */}
        <div className="flex items-center justify-center gap-4 p-4 bg-card/50 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2">
            {isPositiveContribution ? (
              <Heart className="w-5 h-5 text-success" />
            ) : (
              <Skull className="w-5 h-5 text-destructive" />
            )}
            <span className="font-semibold">Today's Impact:</span>
          </div>
          <div className={cn(
            "text-lg font-bold",
            isPositiveContribution ? "text-success" : "text-destructive"
          )}>
            {isPositiveContribution ? '+' : ''}{formatContribution(todayContribution)}
          </div>
        </div>

        {/* Total Lifetime Impact */}
        <div className="flex items-center justify-center gap-4 p-4 bg-card/30 rounded-lg border border-primary/5">
          <div className="flex items-center gap-2">
            {isTotalPositive ? (
              <Heart className="w-5 h-5 text-success" />
            ) : (
              <Skull className="w-5 h-5 text-destructive" />
            )}
            <span className="font-semibold">Total Impact:</span>
          </div>
          <div className={cn(
            "text-lg font-bold",
            isTotalPositive ? "text-success" : "text-destructive"
          )}>
            {isTotalPositive ? '+' : ''}{formatContribution(totalContribution)}
          </div>
        </div>

        {/* Mode-specific explanations */}
        <div className="space-y-3 text-sm">
          {state.scientificMode ? (
            <div className="flex items-start gap-2 p-3 bg-secondary/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-secondary mt-0.5" />
              <div>
                <div className="font-semibold text-secondary">Scientific Calculation</div>
                <div className="text-muted-foreground">
                  Based on peer-reviewed studies. Each action shows its real long-term impact 
                  if sustained daily, divided by 365 days for today's contribution.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-accent/20 rounded-lg">
              <Skull className="w-4 h-4 text-accent mt-0.5" />
              <div>
                <div className="font-semibold text-accent">Instant Gratification</div>
                <div className="text-muted-foreground">
                  Scaled for viral sharing and immediate feedback. Scientifically grounded 
                  but amplified for addictive gamification.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Baseline Info */}
        <div className="text-center text-xs text-muted-foreground border-t border-primary/10 pt-4">
          Started at {state.userData.baselineYears} years baseline • 
          Actions logged: {state.recentActions.length} • 
          Mode: {state.scientificMode ? 'Scientific' : 'Playful'}
        </div>
      </CardContent>
    </Card>
  );
};