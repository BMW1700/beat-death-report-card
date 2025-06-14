
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
    <div className="flex items-center gap-2 p-2 bg-purple-900/20 rounded">
      <Award className="w-6 h-6 text-purple-400" />
      <span className="text-white font-bold">Death Score:</span>
      <span className="text-lg text-purple-300">{score}</span>
      <span className="text-xs text-gray-400 ml-2">(XP for surviving!)</span>
    </div>
  );
};
