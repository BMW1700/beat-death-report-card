import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ShareDeathReportProps {
  deathReport: string | undefined;
}

export const ShareDeathReport = ({ deathReport }: ShareDeathReportProps) => {
  const { profile } = useAuth();
  
  const handleShare = async () => {
    const referralCode = profile?.referral_code;
    const baseText = deathReport || "Check out how I survived (or didn't) on BeatDeath!";
    const shareText = `💀 ${baseText}\n\n🔥 Scan YOUR world for death risks → ${window.location.origin}${referralCode ? `\n🎁 Use code ${referralCode} for 5 FREE scans!` : ""}\n#BeatDeath`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My BeatDeath Report 💀",
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({ title: "Copied! 💀", description: "Death report copied — paste it anywhere to share!" });
      } catch {
        toast({ title: "Couldn't copy", variant: "destructive" });
      }
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-4 flex flex-col items-center">
        <Button onClick={handleShare} className="gradient-bg hover:scale-105 transition-transform flex items-center">
          <Share className="w-4 h-4 mr-2" />
          Share Your Death Report
        </Button>
        <span className="text-xs text-muted-foreground mt-2">Go viral! Share your results and tag #BeatDeath</span>
      </CardContent>
    </Card>
  );
};
