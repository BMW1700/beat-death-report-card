
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Languages } from "lucide-react";
export const LanguageSwitcher = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-blue-400">
      <Languages className="w-5 h-5" />
      Language Switcher <span className="text-xs text-gray-300">MULTILINGUAL SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">Switch between languages (coming soon!)</span>
    </CardContent>
  </Card>
);
