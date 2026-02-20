import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Search, Check, X, Dumbbell, Apple, Cigarette, Shield, Brain, Grid3X3 } from "lucide-react";
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

const CATEGORY_LABELS: Record<string, string> = {
  exercise: "Exercise",
  diet: "Diet",
  substances: "Substances",
  preparedness: "Prep",
  behavior: "Wellness",
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
  const [browseCategory, setBrowseCategory] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  useEffect(() => {
    if (selected || browseCategory) return;
    setMatches(fuzzyMatchActions(query, state.actionMappings));
  }, [query, state.actionMappings, selected, browseCategory]);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      setQuery(event.results[0][0].transcript);
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

  const handleSelect = (action: ActionMapping) => setSelected(action);

  const handleConfirm = () => {
    if (!selected) return;
    logAction(selected.action_id);
    setSelected(null);
    setQuery("");
    setMatches([]);
    setBrowseCategory(null);
  };

  const handleCancel = () => setSelected(null);

  const categoryActions = browseCategory
    ? state.actionMappings.filter(a => a.category === browseCategory)
    : [];

  const renderActionRow = (action: ActionMapping) => {
    const capped = !canPerformAction(action.action_id);
    return (
      <button
        key={action.action_id}
        onClick={() => !capped && handleSelect(action)}
        disabled={capped}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm transition-colors ${
          capped ? "opacity-40 cursor-not-allowed" : "hover:bg-accent/50 cursor-pointer"
        }`}
      >
        <span className="text-muted-foreground">{CATEGORY_ICONS[action.category]}</span>
        <span className="flex-1 truncate">{action.description}</span>
        <span className={`text-xs font-medium whitespace-nowrap ${action.playful_default_minutes >= 0 ? "text-green-400" : "text-red-400"}`}>
          {formatMinutes(action.playful_default_minutes)}
        </span>
      </button>
    );
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
                  onChange={(e) => { setQuery(e.target.value); setBrowseCategory(null); }}
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

            {/* Browse by category tabs */}
            <div className="flex gap-1 flex-wrap">
              {Object.keys(CATEGORY_ICONS).map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={browseCategory === cat ? "default" : "outline"}
                  className="text-xs gap-1 h-7 px-2"
                  onClick={() => {
                    setBrowseCategory(browseCategory === cat ? null : cat);
                    setQuery("");
                  }}
                >
                  {CATEGORY_ICONS[cat]}
                  {CATEGORY_LABELS[cat]}
                </Button>
              ))}
            </div>

            {/* Category browse results */}
            {browseCategory && (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {categoryActions.map(renderActionRow)}
              </div>
            )}

            {/* Search results */}
            {!browseCategory && matches.length > 0 && (
              <div className="space-y-1">
                {matches.map((m) => renderActionRow(m.action))}
              </div>
            )}

            {!browseCategory && query.trim() && matches.length === 0 && (
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
