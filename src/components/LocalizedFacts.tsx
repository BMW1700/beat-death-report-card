
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Globe2 } from "lucide-react";
export const LocalizedFacts = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-green-400">
      <Globe2 className="w-5 h-5" />
      Localized Death Facts <span className="text-xs text-gray-300">COMING SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">See local stats and top threats based on your country or city.</span>
    </CardContent>
  </Card>
);
