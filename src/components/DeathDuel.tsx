
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Sword } from "lucide-react";
export const DeathDuel = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-red-400">
      <Sword className="w-5 h-5" />
      Death Duel <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">Battle friends by scanning the same item—who gets the higher kill rating? Challenge mode coming soon!</span>
    </CardContent>
  </Card>
);
