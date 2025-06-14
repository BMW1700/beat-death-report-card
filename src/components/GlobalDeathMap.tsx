
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
export const GlobalDeathMap = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-green-400">
      <Map className="w-5 h-5" />
      Global Death Map <span className="text-xs text-gray-300">COMING SOON</span>
    </CardTitle>
    <CardContent>
      <div className="text-gray-300 text-sm">See which deadly items are trending worldwide and where people are most at risk. Interactive map experience coming soon!</div>
    </CardContent>
  </Card>
);
