
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
export const GlobalMarketingBanner = () => (
  <Card className="bg-yellow-900 border border-yellow-700 shadow-lg">
    <CardTitle className="p-3 flex items-center gap-2 text-yellow-400">
      <Megaphone className="w-5 h-5" />
      GLOBAL EXPANSION <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-700 text-sm">Stay tuned for global campaigns and regional contests! 🌍🚀</span>
    </CardContent>
  </Card>
);
