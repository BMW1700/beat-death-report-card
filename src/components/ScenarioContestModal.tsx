
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

type Submission = {
  id: number;
  scenario: string;
  votes: number;
};

export function ScenarioContestModal({ open, onClose }) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: 1, scenario: "Choking on 43 gummy bears at once", votes: 7 },
    { id: 2, scenario: "Falling into a vat of nacho cheese", votes: 11 },
    { id: 3, scenario: "Attacked by killer flamingos", votes: 3 },
  ]);

  const [voted, setVoted] = useState<{[id:number]:boolean}>({});

  const handleSubmit = () => {
    if (input.trim() && input.length > 7) {
      setSubmissions([
        ...submissions,
        { id: Date.now(), scenario: input.trim(), votes: 0 }
      ]);
      setInput("");
      setSubmitted(true);
    }
  };

  const handleVote = (id: number) => {
    if (!voted[id]) {
      setSubmissions(submissions.map(s => s.id === id ? { ...s, votes: s.votes + 1 } : s));
      setVoted({ ...voted, [id]: true });
    }
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
        <h2 className="text-xl font-bold flex items-center gap-2 text-warning mb-4">
          <Award className="w-5 h-5" /> Scenario Contest
        </h2>
        <div className="mb-4">
          <input
            className="w-full p-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground mb-3 focus:ring-2 focus:ring-primary"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your wildest death scenario"
          />
          <Button className="w-full gradient-bg hover:scale-105 transition-transform" disabled={!input || input.length < 8} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        {submitted && <div className="text-success mb-3 p-2 bg-success/20 rounded-lg border border-success/30">Your scenario was submitted!</div>}
        <div className="text-foreground font-semibold mb-3">Vote on scenarios:</div>
        <div className="max-h-52 overflow-y-auto space-y-3">
          {submissions
            .sort((a, b) => b.votes - a.votes)
            .map(sub => (
              <div key={sub.id} className="bg-card/30 rounded-lg flex items-center px-3 py-3 border border-border">
                <span className="flex-1 text-foreground">{sub.scenario}</span>
                <span className="mx-3 text-warning font-bold">{sub.votes} votes</span>
                <Button
                  size="sm"
                  variant={voted[sub.id] ? "outline" : "secondary"}
                  onClick={() => handleVote(sub.id)}
                  disabled={voted[sub.id]}
                >
                  {voted[sub.id] ? "Voted" : "Vote"}
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
