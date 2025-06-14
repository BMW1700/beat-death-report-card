
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
export const WhatIfSimulator = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-orange-400">
      <Settings2 className="w-5 h-5" />
      "What If?" Scenario Simulator <span className="text-xs text-gray-300">COMING SOON</span>
    </CardTitle>
    <CardContent>
      <div className="text-sm text-gray-200">Play with dose, item, weight, and see kill ratings change in real-time. Try crazy death combos—coming soon!</div>
    </CardContent>
  </Card>
);
