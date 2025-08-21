import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  AlertTriangle, 
  Zap, 
  Droplets, 
  Thermometer, 
  Bug,
  Skull,
  Shield,
  Heart,
  Wifi
} from "lucide-react";

const SURVIVAL_DATA = {
  toxins: [
    {
      name: "Household Bleach",
      category: "Chemical",
      risk: "High",
      symptoms: "Respiratory distress, skin burns, eye damage",
      firstAid: "Flush with water, fresh air, don't induce vomiting",
      timeToEffect: "Immediate",
      antidote: "None - supportive care only"
    },
    {
      name: "Wild Mushrooms",
      category: "Biological", 
      risk: "Extreme",
      symptoms: "Nausea, liver failure, hallucinations",
      firstAid: "Induce vomiting if conscious, seek immediate medical help",
      timeToEffect: "30 min - 12 hours",
      antidote: "Varies by species"
    },
    {
      name: "Carbon Monoxide",
      category: "Gas",
      risk: "Lethal",
      symptoms: "Headache, dizziness, unconsciousness",
      firstAid: "Move to fresh air immediately, CPR if needed",
      timeToEffect: "Minutes",
      antidote: "Oxygen therapy"
    }
  ],
  environmental: [
    {
      threat: "Hypothermia",
      conditions: "Cold exposure, wet clothing",
      prevention: "Layer clothing, stay dry, maintain caloric intake",
      signs: "Shivering, confusion, slurred speech",
      treatment: "Gradual rewarming, dry clothing, warm beverages"
    },
    {
      threat: "Heat Stroke",
      conditions: "High temperature, dehydration, exertion",
      prevention: "Stay hydrated, seek shade, light clothing",
      signs: "High body temp, altered mental state, no sweating",
      treatment: "Cool immediately, wet clothing, seek medical help"
    },
    {
      threat: "Altitude Sickness",
      conditions: "Rapid elevation gain above 8000ft",
      prevention: "Gradual ascent, hydration, acclimatization",
      signs: "Headache, nausea, fatigue, confusion",
      treatment: "Descend immediately, oxygen if available"
    }
  ],
  wildlife: [
    {
      animal: "Venomous Snakes",
      identification: "Triangular head, heat pits, vertical pupils",
      avoidance: "Watch where you step, use flashlight at night",
      biteResponse: "Stay calm, remove jewelry, immobilize limb, seek antivenom"
    },
    {
      animal: "Black Widow Spider",
      identification: "Shiny black with red hourglass marking",
      avoidance: "Check clothing, shoes, dark spaces",
      biteResponse: "Clean wound, ice pack, seek medical attention"
    },
    {
      animal: "Aggressive Wildlife",
      identification: "Rabid behavior, unusual aggression",
      avoidance: "Make noise, travel in groups, secure food",
      encounter: "Back away slowly, make yourself large, don't run"
    }
  ]
};

export const FieldManual = () => {
  const [isOffline] = useState(!navigator.onLine);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'extreme': case 'lethal': return 'destructive';
      case 'high': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-accent">
          <BookOpen className="w-5 h-5" />
          Survival Field Manual
          <div className="flex items-center gap-2 ml-auto">
            {isOffline ? (
              <Badge variant="outline" className="bg-success/20 border-success text-success">
                <Shield className="w-3 h-3 mr-1" />
                OFFLINE
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-primary/20 border-primary text-primary">
                <Wifi className="w-3 h-3 mr-1" />
                SYNCED
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="toxins" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="toxins" className="text-xs">
              <Skull className="w-3 h-3 mr-1" />
              Toxins
            </TabsTrigger>
            <TabsTrigger value="environmental" className="text-xs">
              <Thermometer className="w-3 h-3 mr-1" />
              Environment
            </TabsTrigger>
            <TabsTrigger value="wildlife" className="text-xs">
              <Bug className="w-3 h-3 mr-1" />
              Wildlife
            </TabsTrigger>
          </TabsList>

          <TabsContent value="toxins">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {SURVIVAL_DATA.toxins.map((toxin, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-card/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{toxin.name}</h4>
                      <Badge variant="outline" className={`bg-${getRiskColor(toxin.risk)}/20 border-${getRiskColor(toxin.risk)} text-${getRiskColor(toxin.risk)}`}>
                        {toxin.risk}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p><strong>Symptoms:</strong> {toxin.symptoms}</p>
                      <p><strong>First Aid:</strong> {toxin.firstAid}</p>
                      <p><strong>Time to Effect:</strong> {toxin.timeToEffect}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="environmental">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {SURVIVAL_DATA.environmental.map((env, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-card/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <h4 className="font-medium text-foreground">{env.threat}</h4>
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p><strong>Prevention:</strong> {env.prevention}</p>
                      <p><strong>Signs:</strong> {env.signs}</p>
                      <p><strong>Treatment:</strong> {env.treatment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="wildlife">
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {SURVIVAL_DATA.wildlife.map((animal, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-card/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className="w-4 h-4 text-accent" />
                      <h4 className="font-medium text-foreground">{animal.animal}</h4>
                    </div>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <p><strong>ID:</strong> {animal.identification}</p>
                      <p><strong>Avoid:</strong> {animal.avoidance}</p>
                      <p><strong>Response:</strong> {animal.biteResponse || animal.encounter}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-2 rounded bg-warning/10 border border-warning/20">
          <p className="text-xs text-warning flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Field manual for reference only - Always seek professional medical help in emergencies
          </p>
        </div>
      </CardContent>
    </Card>
  );
};