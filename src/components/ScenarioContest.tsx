
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { useState } from "react";
import { ScenarioContestModal } from "./ScenarioContestModal";

export const ScenarioContest = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="bg-slate-800 border-slate-700 hover:shadow-xl transition duration-200">
        <button
          onClick={() => setOpen(true)}
          className="w-full text-left focus:outline-none"
        >
          <CardTitle className="p-3 flex items-center gap-2 text-yellow-300">
            <Award className="w-5 h-5" />
            Scenario Contest <span className="text-xs text-gray-300">Vote &amp; Submit!</span>
          </CardTitle>
          <CardContent>
            <span className="text-gray-200 text-sm">
              Submit your wildest death scenario, vote on submissions, and win! Community voting is live.
            </span>
          </CardContent>
        </button>
      </Card>
      <ScenarioContestModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
