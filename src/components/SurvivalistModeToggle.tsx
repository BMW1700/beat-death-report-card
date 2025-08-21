import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Compass, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SurvivalistModeToggle = () => {
  const [survivalistMode, setSurvivalistMode] = useState(() => {
    return localStorage.getItem('survivalist-mode') === 'true';
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('survivalist-mode', survivalistMode.toString());
    
    if (survivalistMode) {
      document.documentElement.setAttribute('data-survivalist-mode', 'true');
      toast({
        title: "🎯 Survivalist Mode Activated",
        description: "Enhanced threat detection and field-ready features enabled!",
      });
    } else {
      document.documentElement.removeAttribute('data-survivalist-mode');
    }
  }, [survivalistMode, toast]);

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-card/50 border border-primary/20">
      <Compass className="w-5 h-5 text-primary" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">Survivalist Mode</span>
          {survivalistMode && (
            <Badge variant="outline" className="bg-success/20 border-success text-success">
              <Shield className="w-3 h-3 mr-1" />
              ACTIVE
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Enhanced threat detection, field manual access & tactical UI
        </p>
      </div>
      <Switch
        checked={survivalistMode}
        onCheckedChange={setSurvivalistMode}
        className="data-[state=checked]:bg-success"
      />
    </div>
  );
};