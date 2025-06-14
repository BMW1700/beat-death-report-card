
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, ShieldCheck, Skull } from "lucide-react";

interface Message {
  from: "user" | "ai";
  text: string;
}

function wittyAIResponse(input: string): string {
  // A fake AI with humor and helpfulness.
  const normalized = input.toLowerCase();
  if (normalized.includes("lava") || normalized.includes("volcano")) {
    return "Unless you’re made of titanium or marshmallow, survival odds: negative. Don’t try the floor-is-lava IRL!";
  }
  if (normalized.includes("bear")) {
    return "Bears: 1, Humans: 0. Unless you brought honey, in which case: Bears: 2, Humans: -1.";
  }
  if (normalized.includes("zombie")) {
    return "Pro tip: Zombies don’t tire. Cardio is your only friend. Move fast, avoid malls.";
  }
  if (normalized.includes("fart")) {
    return "Unless you’re in a submarine, risk is low… but social standing drops dangerously!";
  }
  if (normalized.includes("microwave")) {
    return "Unless you crawled inside and hit start, you’ll only risk your popcorn (possibly your dignity).";
  }
  return (
    [
      "Survivability: Possible! But check your life insurance terms.",
      "Risk factors: Numerous, but with quick thinking and a little luck, you just might make it.",
      "Odds: Who am I, a bookie? Wear a helmet and hope for the best!",
      "You'd be surprised: 93% of all survivors avoided doing exactly that.",
      "Expert verdict: You’re more likely to be embarrassed than deceased.",
      "Classic case—consult your inner raccoon, then proceed with caution."
    ][Math.floor(Math.random() * 6)]
  );
}

export const ImmortalModeCopilot = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([
    {
      from: "ai",
      text: "Immortal Mode online! Ask: Could you survive [any scenario]? Example: 'Could I survive a shark attack in a pool of lemonade?'",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { from: "user", text: input };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { from: "ai", text: wittyAIResponse(input) },
      ]);
      setLoading(false);
    }, 1300);
    setInput("");
  };

  return (
    <Card className="bg-slate-800/60 border-green-600 shadow-md animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-300">
          <ShieldCheck className="w-6 h-6" />
          Immortal Mode Copilot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-3 pr-2">
          {chat.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "ai" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-[75%] ${
                  m.from === "ai"
                    ? "bg-green-900 text-green-100"
                    : "bg-purple-900 text-purple-100"
                } text-sm shadow`}
              >
                {m.from === "ai" ? <Bot className="inline w-4 h-4 mr-1" /> : <Skull className="inline w-4 h-4 mr-1" />}
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-3 py-2 bg-green-900 text-green-100 text-sm shadow">
                <Bot className="inline w-4 h-4 mr-1 animate-pulse" />
                Thinking…
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Could I survive..."
            className="bg-slate-700 border-slate-600 text-white"
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={loading}
          />
          <Button onClick={send} className="bg-green-700 hover:bg-green-800" disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
