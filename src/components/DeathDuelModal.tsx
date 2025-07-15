
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sword } from "lucide-react";

export function DeathDuelModal({ open, onClose }) {
  const [item, setItem] = useState("");
  const [user1Weight, setUser1Weight] = useState("");
  const [user2Weight, setUser2Weight] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDuel = () => {
    // Simple mock logic: generate "kill rating" for both users
    const parseWeight = (w: string) => {
      const num = parseFloat(w);
      return isNaN(num) ? 70 : num;
    };
    const weight1 = parseWeight(user1Weight);
    const weight2 = parseWeight(user2Weight);

    // For demo, just use random kill ratings with a bias based on item string length
    const baseScore = Math.abs(item.length % 5) + 2;
    const kill1 = Math.max(1, Math.min(5, baseScore + (weight1 % 4) - 1));
    const kill2 = Math.max(1, Math.min(5, baseScore + (weight2 % 4) - 1));

    setResult({
      user1: kill1,
      user2: kill2,
    });
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass-card purple-glow p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2 text-destructive mb-4">
          <Sword className="w-5 h-5" /> Death Duel
        </h2>
        {!submitted ? (
          <>
            <input
              className="w-full p-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground mb-3 focus:ring-2 focus:ring-primary"
              value={item}
              onChange={e => setItem(e.target.value)}
              placeholder="Item or scenario (e.g., 10 Tylenol pills)"
            />
            <div className="flex gap-3 mb-4">
              <input
                className="flex-1 p-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                value={user1Weight}
                onChange={e => setUser1Weight(e.target.value)}
                placeholder="Your weight (kg)"
                type="number"
                min="1"
              />
              <input
                className="flex-1 p-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                value={user2Weight}
                onChange={e => setUser2Weight(e.target.value)}
                placeholder="Friend's weight (kg)"
                type="number"
                min="1"
              />
            </div>
            <Button className="w-full gradient-bg hover:scale-105 transition-transform" onClick={handleDuel}>
              Duel!
            </Button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-3 rounded-lg bg-card/30">
              <span className="font-bold text-success">You: </span>
              <span className="text-lg text-foreground">{result.user1} / 5 kill rating</span>
            </div>
            <div className="p-3 rounded-lg bg-card/30">
              <span className="font-bold text-accent">Friend: </span>
              <span className="text-lg text-foreground">{result.user2} / 5 kill rating</span>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-card/50">
              {result.user1 > result.user2
                ? <span className="text-success font-bold">Congrats, you survived longer! 🏆</span>
                : result.user2 > result.user1
                ? <span className="text-accent font-bold">Your friend wins—tough luck! 😵</span>
                : <span className="text-warning font-bold">It's a tie. Both of you... questionable.</span>
              }
            </div>
            <Button variant="outline" className="w-full" onClick={() => { setSubmitted(false); setResult(null); }}>
              Duel Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
