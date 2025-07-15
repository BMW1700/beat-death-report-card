
import { useState, useEffect } from "react";
import { Award } from "lucide-react";

export const DeathScore = ({ initialScore = 100 }: { initialScore?: number }) => {
  // Progressively increase/decrease "XP"
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    // For fun: "add" death points on every visit
    setScore(score + Math.floor(Math.random() * 5));
  }, []);

  return (
    <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg border border-primary/20 purple-glow">
      <Award className="w-6 h-6 text-primary" />
      <span className="text-foreground font-bold">Death Score:</span>
      <span className="text-lg text-primary gradient-text font-bold">{score}</span>
      <span className="text-xs text-muted-foreground ml-2">(XP for surviving!)</span>
    </div>
  );
};
