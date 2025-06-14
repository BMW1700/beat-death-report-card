
import { Star, Skull } from "lucide-react";

export const Achievements = () => {
  // Fake static achievements for the demo
  const badges = [
    { icon: <Star className="w-4 h-4 text-yellow-400" />, label: "First Scan" },
    { icon: <Skull className="w-4 h-4 text-red-500" />, label: "Near Death Experience" },
    { icon: <Star className="w-4 h-4 text-purple-400" />, label: "10 Scans" }
  ];
  return (
    <div className="mt-2 flex items-center gap-3 flex-wrap">
      {badges.map((b, i) => (
        <span key={i} className="flex items-center bg-gray-700/70 rounded px-3 py-1 gap-1 text-xs text-gray-100">
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  );
};
