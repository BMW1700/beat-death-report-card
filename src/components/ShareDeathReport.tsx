
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share } from "lucide-react";

interface ShareDeathReportProps {
  deathReport: string | undefined; // formatted summary of the analysis
}

export const ShareDeathReport = ({ deathReport }: ShareDeathReportProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My BeatDeath Report",
        text: deathReport || "Check out how I survived (or didn't) on BeatDeath!",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(deathReport || "Check out BeatDeath!");
      alert("Report copied! Paste it to share.");
    }
  };
  return (
    <Card className="glass-card">
      <CardContent className="p-4 flex flex-col items-center">
        <Button onClick={handleShare} className="bg-gradient-to-r from-red-500 to-purple-600 text-white flex items-center">
          <Share className="w-4 h-4 mr-2" />
          Share Your Death Report
        </Button>
        <span className="text-xs text-gray-300 mt-2">Go viral! Share your results and tag #BeatDeath</span>
      </CardContent>
    </Card>
  );
};
