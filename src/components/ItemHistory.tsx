
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const items = [
  "9 Tylenol pills",
  "Drinking 5 energy drinks",
  "Eating 20 apples"
];

export const ItemHistory = () => (
  <Card className="glass-card">
    <CardTitle className="p-3 flex items-center gap-2 text-blue-400">
      <FileText className="w-5 h-5" />
      My BeatDeath Scans
    </CardTitle>
    <CardContent className="space-y-1">
      {items.map((v, i) => (
        <div key={i} className="text-gray-300">{v}</div>
      ))}
    </CardContent>
  </Card>
);
