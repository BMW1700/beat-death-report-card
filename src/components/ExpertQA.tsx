
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Contact2 } from "lucide-react";
export const ExpertQA = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-pink-400">
      <Contact2 className="w-5 h-5" />
      Death Expert Q&A <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">Ask real doctors and toxicology experts your burning death questions. Open to all soon!</span>
    </CardContent>
  </Card>
);
