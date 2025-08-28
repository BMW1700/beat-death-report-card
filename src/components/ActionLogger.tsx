import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Apple, 
  Cigarette, 
  Shield, 
  Activity,
  Plus,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useLifeClock } from '@/contexts/LifeClockContext';
import { cn } from '@/lib/utils';

const categoryIcons = {
  exercise: Dumbbell,
  diet: Apple,
  substances: Cigarette,
  preparedness: Shield,
  behavior: Activity
};

const categoryColors = {
  exercise: 'text-success',
  diet: 'text-primary',
  substances: 'text-destructive',
  preparedness: 'text-warning',
  behavior: 'text-accent'
};

export const ActionLogger = () => {
  const { 
    state, 
    logAction, 
    getScientificContribution, 
    getPlayfulMinutes, 
    canPerformAction 
  } = useLifeClock();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('exercise');

  // Group actions by category
  const actionsByCategory = state.actionMappings.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, typeof state.actionMappings>);

  const handleActionClick = (actionId: string) => {
    const success = logAction(actionId, 'self');
    if (!success) {
      // Error handling is done in logAction with toast
      return;
    }
  };

  const formatMinutes = (minutes: number): string => {
    if (Math.abs(minutes) < 60) {
      return `${minutes}m`;
    }
    const hours = Math.round(minutes / 60 * 10) / 10;
    return `${hours}h`;
  };

  const categories = Object.keys(actionsByCategory);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-playfair">
          <Plus className="w-6 h-6 text-primary" />
          Quick Actions
          <Badge variant="outline" className="ml-2">
            {state.scientificMode ? 'Scientific' : 'Playful'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-5 w-full mb-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="flex items-center gap-1 text-xs"
                >
                  <Icon className="w-3 h-3" />
                  {category.charAt(0).toUpperCase()}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-3">
              {actionsByCategory[category].map((action) => {
                const canPerform = canPerformAction(action.action_id);
                const scientificMinutes = getScientificContribution(action.action_id);
                const playfulMinutes = getPlayfulMinutes(action.action_id, false);
                const verifiedMinutes = getPlayfulMinutes(action.action_id, true);
                const Icon = categoryIcons[action.category];
                const isNegative = playfulMinutes < 0;

                return (
                  <div 
                    key={action.action_id}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200",
                      canPerform 
                        ? "bg-card/50 border-primary/20 hover:border-primary/40 hover:bg-card/70" 
                        : "bg-muted/30 border-muted opacity-50",
                      isNegative && "border-destructive/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Action Info */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", categoryColors[action.category])} />
                          <span className="font-medium text-sm">{action.description}</span>
                        </div>

                        {/* Impact Display */}
                        <div className="space-y-1">
                          {state.scientificMode ? (
                            <div className="flex items-center gap-2 text-xs">
                              <TrendingUp className="w-3 h-3 text-secondary" />
                              <span className="text-muted-foreground">
                                Scientific: {formatMinutes(scientificMinutes)} daily contribution
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs">
                              <Zap className="w-3 h-3 text-accent" />
                              <span className="text-muted-foreground">
                                Instant: {formatMinutes(playfulMinutes)} 
                                {action.verification_bonus_pct > 0 && (
                                  <span className="text-success ml-1">
                                    (Verified: {formatMinutes(verifiedMinutes)})
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                          
                          {action.max_per_day > 1 && (
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="w-3 h-3 text-warning" />
                              <span className="text-muted-foreground">
                                Max {action.max_per_day}/day
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        size="sm"
                        onClick={() => handleActionClick(action.action_id)}
                        disabled={!canPerform}
                        variant={isNegative ? "destructive" : "default"}
                        className="shrink-0"
                      >
                        {isNegative ? 'Log' : 'Do It'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>

        {/* Mode Toggle Hint */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg text-xs text-center text-muted-foreground">
          Switch modes in the Life Clock to see {state.scientificMode ? 'playful' : 'scientific'} values
        </div>
      </CardContent>
    </Card>
  );
};