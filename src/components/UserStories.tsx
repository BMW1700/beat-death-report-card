
import { useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const initialStories = [
  { user: "DeathFan99", story: "Swallowed 4 AA batteries. BeatDeath saved me 💀" },
  { user: "ToxinTester", story: "Ate 17 raw cashews. Would not recommend." }
];

export const UserStories = () => {
  const [stories, setStories] = useState(initialStories);
  const [input, setInput] = useState("");
  const addStory = () => {
    if (!input.trim()) return;
    setStories([{ user: "You", story: input }, ...stories]);
    setInput("");
  };
  return (
    <Card className="glass-card border-accent/20">
      <CardTitle className="flex items-center gap-2 p-3 text-purple-300">
        <MessageSquare className="w-5 h-5" />
        User Death Stories
      </CardTitle>
      <CardContent>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Share your wildest death-defying scenario..."
          className="w-full bg-input border-border text-card-foreground rounded p-2 mb-2"
          rows={2}
        />
        <Button size="sm" onClick={addStory} className="mb-2">Submit</Button>
        <div className="max-h-40 overflow-y-auto">
          {stories.map((s, i) => (
            <div key={i} className="mb-2">
              <span className="font-bold text-pink-400">{s.user}:</span>{" "}
              <span className="text-gray-100">{s.story}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
