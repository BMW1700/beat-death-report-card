import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Search, Check, X, Dumbbell, Apple, Cigarette, Shield, Brain } from "lucide-react";
import { useLifeClock } from "@/contexts/LifeClockContext";
import { fuzzyMatchActions, FuzzyMatch } from "@/utils/fuzzyActionMatcher";
import type { ActionMapping } from "@/contexts/LifeClockContext";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  exercise: <Dumbbell className="w-4 h-4" />,
  diet: <Apple className="w-4 h-4" />,
  substances: <Cigarette className="w-4 h-4" />,
  preparedness: <Shield className="w-4 h-4" />,
  behavior: <Brain className="w-4 h-4" />,
};

function formatMinutes(mins: number): string {
  const abs = Math.abs(mins);
  if (abs >= 1440) return `${mins > 0 ? "+" : "-"}${Math.round(abs / 1440)} day${Math.round(abs / 1440) !== 1 ? "s" : ""}`;
  if (abs >= 60) return `${mins > 0 ? "+" : "-"}${Math.round(abs / 60)} hr${Math.round(abs / 60) !== 1 ? "s" : ""}`;
  return `${mins > 0 ? "+" : "-"}${abs} min`;
}

export function LifeTracker() {
  const { state, logAction, canPerformAction } = useLifeClock();
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<FuzzyMatch[]>([]);
  const [selected, setSelected] = useState<ActionMapping | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check speech support on mount
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // Live fuzzy search
  useEffect(() => {
    if (selected) return; // Don't search while confirming
    setMatches(fuzzyMatchActions(query, state.actionMappings));
  }, [query, state.actionMappings, selected]);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleSelect = (action: ActionMapping) => {
    setSelected(action);
  };

  const handleConfirm = () => {
    if (!selected) return;
    logAction(selected.action_id);
    setSelected(null);
    setQuery("");
    setMatches([]);
  };

  const handleCancel = () => {
    setSelected(null);
  };

  return (
    <Card className="glass-card border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Track Your Life
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Confirmation view */}
        {selected ? (
          <div className="space-y-3 animate-fade-in">
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground mb-1">Log this action?</p>
              <p className="font-semibold text-lg">{selected.description}</p>
              <p className={`text-sm font-medium mt-1 ${selected.playful_default_minutes >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatMinutes(selected.playful_default_minutes)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-1" /> Yes, log it
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Search + mic input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What did you just do? (e.g. 10 pushups)"
                  className="pl-9"
                />
              </div>
              {speechSupported && (
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={isListening ? stopListening : startListening}
                  className={isListening ? "animate-pulse" : ""}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
            </div>

            {/* Results */}
            {matches.length > 0 && (
              <div className="space-y-1">
                {matches.map((m) => {
                  const capped = !canPerformAction(m.action.action_id);
                  return (
                    <button
                      key={m.action.action_id}
                      onClick={() => !capped && handleSelect(m.action)}
                      disabled={capped}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                        capped
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-accent/50 cursor-pointer"
                      }`}
                    >
                      <span className="text-muted-foreground">{CATEGORY_ICONS[m.action.category]}</span>
                      <span className="flex-1 truncate">{m.action.description}</span>
                      <span className={`text-xs font-medium whitespace-nowrap ${m.action.playful_default_minutes >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {formatMinutes(m.action.playful_default_minutes)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {query.trim() && matches.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                No matching actions found. Try different words.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
