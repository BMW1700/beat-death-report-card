
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const deathOptions = [
  {
    label: "Exploding Soda Freezer",
    description: "A can of soda, forgotten in the freezer, erupts with shrapnel while you open it. Fun odds: 1 in 1,000,000!",
  },
  {
    label: "Selfie-on-Cliff Catastrophe",
    description: "While chasing likes, you step too close... Gravity wins. Always look before you selfie! Odds: 1 in 50,000.",
  },
  {
    label: "DIY Chemistry Fail",
    description: "Mix the wrong cleaners & accidentally generate toxic gas. Don't be a scientist without YouTube, kids!",
  },
  {
    label: "Alien Prank Gone Wrong",
    description: "Invited to Area 51 raid. Turns out they do shoot. (But only Nerf darts... or do they?)",
  },
  {
    label: "Beware the Auto-Reply",
    description: "Annoy your boss with too many out-of-office replies and disappear mysteriously. HR file: 'Unsolved.'",
  },
  {
    label: "Death-By-TikTok-Challenge",
    description: "You attempt a trending dare. It trends for the wrong reason. Darwin Award unlocked.",
  },
  {
    label: "Hamster Ball Escape",
    description: "Enter a giant hamster ball to cross a lake. Ball? Fun. Water? Less so. (Stay on land!)",
  },
  {
    label: "Attack of the Killer Toaster",
    description: "Ignore the burning smell from your kitchen. Now a 'shocking' breakfast. Odds: 1 in 12,500,000.",
  },
  {
    label: "Yoga With Wild Geese",
    description: "Park yoga gone wrong when angry geese mistake you for breadsticks. Fowl outcome!",
  }
];

const getRandomIndex = (exclude: number | null, len: number) => {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * len);
  } while (idx === exclude && len > 1);
  return idx;
};

export const DeathSpinWheel = () => {
  const [spinning, setSpinning] = useState(false);
  const [resultIdx, setResultIdx] = useState<number | null>(null);

  const spin = () => {
    setSpinning(true);
    setTimeout(() => {
      setResultIdx(getRandomIndex(resultIdx, deathOptions.length));
      setSpinning(false);
    }, 1400);
  };

  return (
    <Card className="bg-slate-800/60 border-purple-700 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white font-bold">
          <Zap className="text-yellow-400 w-6 h-6 animate-pulse" />
          Death Predictor Spin Wheel
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <div className="flex flex-col items-center min-h-[80px] w-full py-2">
          {spinning ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <span className="text-sm text-gray-300">Spinning your fate…</span>
            </div>
          ) : resultIdx === null ? (
            <span className="text-gray-300 font-medium">Spin the wheel for a truly *unique* death scenario!</span>
          ) : (
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400 mb-2">{deathOptions[resultIdx].label}</div>
              <div className="text-sm text-gray-200">{deathOptions[resultIdx].description}</div>
            </div>
          )}
        </div>
        <Button
          onClick={spin}
          className="bg-gradient-to-tr from-purple-700 to-red-500 font-bold text-white hover:from-purple-800 hover:to-red-600 shadow-lg"
          disabled={spinning}
        >
          <RefreshCcw className="mr-2" />
          Spin Fate
        </Button>
      </CardContent>
    </Card>
  );
};
