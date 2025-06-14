
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
    <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-purple-600 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2 text-red-400 mb-3">
          <Sword className="w-5 h-5" /> Death Duel
        </h2>
        {!submitted ? (
          <>
            <input
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white mb-2"
              value={item}
              onChange={e => setItem(e.target.value)}
              placeholder="Item or scenario (e.g., 10 Tylenol pills)"
            />
            <div className="flex gap-2">
              <input
                className="flex-1 p-2 rounded bg-slate-800 border border-slate-700 text-white mb-2"
                value={user1Weight}
                onChange={e => setUser1Weight(e.target.value)}
                placeholder="Your weight (kg)"
                type="number"
                min="1"
              />
              <input
                className="flex-1 p-2 rounded bg-slate-800 border border-slate-700 text-white mb-2"
                value={user2Weight}
                onChange={e => setUser2Weight(e.target.value)}
                placeholder="Friend's weight (kg)"
                type="number"
                min="1"
              />
            </div>
            <Button className="w-full mt-2" onClick={handleDuel}>
              Duel!
            </Button>
          </>
        ) : (
          <div className="text-center space-y-3">
            <div>
              <span className="font-bold text-green-400">You: </span>
              <span className="text-lg">{result.user1} / 5 kill rating</span>
            </div>
            <div>
              <span className="font-bold text-blue-400">Friend: </span>
              <span className="text-lg">{result.user2} / 5 kill rating</span>
            </div>
            <div className="mt-2">
              {result.user1 > result.user2
                ? <span className="text-green-400 font-bold">Congrats, you survived longer! 🏆</span>
                : result.user2 > result.user1
                ? <span className="text-blue-400 font-bold">Your friend wins—tough luck! 😵</span>
                : <span className="text-yellow-400 font-bold">It's a tie. Both of you... questionable.</span>
              }
            </div>
            <Button variant="outline" onClick={() => { setSubmitted(false); setResult(null); }}>
              Duel Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
