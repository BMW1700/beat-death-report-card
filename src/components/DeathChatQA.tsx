
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const cannedReplies = [
  "That's a lethal combo—expect to meet the Reaper by brunch.",
  "Honestly, the odds of fatality are low, but you'll wish they were higher.",
  "Mixing those? Not recommended unless you hate your internal organs.",
  "You’ll survive, but your dignity might not.",
  "That’s one way to get your 15 minutes of fame... in the Darwin Awards.",
];

function getRandomReply() {
  return cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
}

export const DeathChatQA = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{q: string; a: string}[]>([]);

  const handleSend = () => {
    if (input.trim().length > 0) {
      setHistory([...history, { q: input.trim(), a: getRandomReply() }]);
      setInput("");
    }
  };

  return (
    <div className="bg-slate-800 border border-pink-500 rounded-2xl p-4 shadow-xl min-h-[180px]">
      <div className="flex items-center gap-2 mb-2 text-pink-300 font-bold text-lg">
        <MessageSquare className="w-5 h-5" />
        Death Chat Q&A
        <span className="text-xs text-gray-300 ml-2">Ask anything</span>
      </div>
      <div className="mb-2 max-h-40 overflow-y-auto">
        {history.length === 0 && <div className="text-gray-400 text-sm mb-2">Ask your morbid, hilarious, or hypothetical death questions!</div>}
        {history.map((h, idx) => (
          <div key={idx} className="mb-3">
            <div className="text-purple-200 font-semibold">Q: {h.q}</div>
            <div className="text-gray-200 pl-4">A: {h.a}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 items-center">
        <input
          className="flex-1 px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. What happens if I eat 30 glowsticks?"
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        <Button size="sm" className="ml-1" onClick={handleSend} disabled={!input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
};
