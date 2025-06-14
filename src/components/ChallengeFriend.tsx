
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export const ChallengeFriend = () => {
  // simple challenge link generator
  const shareChallenge = () => {
    const challengeMsg = "Try to beat my BeatDeath score! 👉 " + window.location.href;
    if (navigator.share) {
      navigator.share({ title: "BeatDeath Challenge", text: challengeMsg, url: window.location.href });
    } else {
      navigator.clipboard.writeText(challengeMsg);
      alert("Challenge link copied! Paste it to a friend.");
    }
  };

  return (
    <Button onClick={shareChallenge} variant="outline" className="w-full flex items-center gap-2 border-purple-500 mt-2">
      <Zap className="w-4 h-4" />
      Challenge a Friend
    </Button>
  );
};
