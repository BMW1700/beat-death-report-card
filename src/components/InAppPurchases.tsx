
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
export const InAppPurchases = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-green-400">
      <ShoppingCart className="w-5 h-5" />
      In-App Stuff <span className="text-xs text-gray-300">COMING SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">Avatar flair, scan skips, and more! Merch shop opens soon.</span>
    </CardContent>
  </Card>
);
