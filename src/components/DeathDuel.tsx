
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Sword } from "lucide-react";
import { useState } from "react";
import { DeathDuelModal } from "./DeathDuelModal";

export const DeathDuel = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="bg-slate-800 border-slate-700 hover:shadow-xl transition duration-200">
        <button
          onClick={() => setOpen(true)}
          className="w-full text-left focus:outline-none"
        >
          <CardTitle className="p-3 flex items-center gap-2 text-destructive">
            <Sword className="w-5 h-5" />
            Death Duel <span className="text-xs text-muted-foreground ml-1">Demo Mode</span>
          </CardTitle>
          <CardContent>
            <span className="text-gray-200 text-sm">
              Battle friends by scanning the same item—who gets the higher kill rating? Challenge mode live!
            </span>
          </CardContent>
        </button>
      </Card>
      <DeathDuelModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
