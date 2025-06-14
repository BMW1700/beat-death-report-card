
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";
export const AffiliateOffers = () => (
  <Card className="bg-slate-800 border-slate-700">
    <CardTitle className="p-3 flex items-center gap-2 text-blue-400">
      <Link2 className="w-5 h-5" />
      Affiliate Offers <span className="text-xs text-gray-300">SOON</span>
    </CardTitle>
    <CardContent>
      <span className="text-gray-200 text-sm">Sponsored wellness, safety, and health deals coming soon!</span>
    </CardContent>
  </Card>
);
