
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
    <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 border border-yellow-500 rounded-2xl p-6 max-w-md w-full relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-300 mb-3">
          <Award className="w-5 h-5" /> Scenario Contest
        </h2>
        <div>
          <input
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your wildest death scenario"
          />
          <Button className="w-full mb-4" disabled={!input || input.length < 8} onClick={handleSubmit}>
            Submit
          </Button>
        </div>
        {submitted && <div className="text-green-300 mb-2">Your scenario was submitted!</div>}
        <div className="text-white/80 font-semibold mb-2">Vote on scenarios:</div>
        <div className="max-h-52 overflow-y-auto space-y-2">
          {submissions
            .sort((a, b) => b.votes - a.votes)
            .map(sub => (
              <div key={sub.id} className="bg-slate-800 rounded-lg flex items-center px-3 py-2">
                <span className="flex-1">{sub.scenario}</span>
                <span className="mx-2 text-yellow-400">{sub.votes} votes</span>
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
