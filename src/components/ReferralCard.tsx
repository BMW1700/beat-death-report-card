import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Copy, Share2, Check, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const ReferralCard = () => {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralCode = profile?.referral_code || "--------";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({ title: "Copied!", description: "Referral code copied to clipboard 💀" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const shareText = `💀 I'm tracking how everything kills me on BeatDeath! Use my code ${referralCode} to get 5 FREE death scans. Join the madness: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join BeatDeath 💀",
          text: shareText,
          url: window.location.origin,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: "Share text copied!", description: "Paste it anywhere to invite friends" });
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-destructive/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Invite Friends
          <Badge variant="secondary" className="text-[10px] ml-auto">
            <Users className="w-3 h-3 mr-1" />
            5 free scans each
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-background/80 border border-border rounded-md px-3 py-2 text-center font-mono text-lg tracking-widest text-foreground">
            {referralCode}
          </code>
          <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <Button onClick={handleShare} className="w-full bg-gradient-to-r from-primary to-destructive text-primary-foreground" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share & Earn Free Scans
        </Button>
        <p className="text-[10px] text-muted-foreground text-center">
          Both you and your friend get 5 free death scans!
        </p>
      </CardContent>
    </Card>
  );
};
