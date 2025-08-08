import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Twitter, Share2, Camera, Video, Zap, Music } from "lucide-react";
import { toast } from "sonner";

const SOCIAL_TEMPLATES = [
  {
    platform: "TikTok",
    icon: <Music className="w-5 h-5" />,
    template: "Just discovered my toothbrush could kill me in 47 ways 💀 #BeatDeath #DeathScanner #FYP",
    hashtags: "#BeatDeath #DeathScanner #FYP #Viral #Science",
    color: "bg-pink-500"
  },
  {
    platform: "Instagram",
    icon: <Instagram className="w-5 h-5" />,
    template: "Scanning random items to see how they could kill me 💀 BeatDeath is wild! Story template below ⬇️",
    hashtags: "#BeatDeath #DeathScanner #ViralApp #Science #Dangerous #Death",
    color: "bg-purple-500"
  },
  {
    platform: "Twitter/X",
    icon: <Twitter className="w-5 h-5" />,
    template: "This app just told me my coffee mug has a death rating of 4/5 ☠️ What's the deadliest thing in your house?",
    hashtags: "#BeatDeath #DeathScanner #Viral #Science",
    color: "bg-black"
  }
];

const VIRAL_FEATURES = [
  {
    title: "Death Score Battles",
    description: "Challenge friends to beat your death scores",
    icon: <Zap className="w-5 h-5" />,
    action: "Start Battle"
  },
  {
    title: "Story Templates",
    description: "Ready-made Instagram story templates",
    icon: <Camera className="w-5 h-5" />,
    action: "Get Templates"
  },
  {
    title: "TikTok Trends",
    description: "Join trending death scanner challenges",
    icon: <Video className="w-5 h-5" />,
    action: "View Trends"
  }
];

export const SocialMediaIntegration = () => {
  const [shareCount, setShareCount] = useState(0);

  const handleSocialShare = (platform: string, template: string, hashtags: string) => {
    const shareText = `${template}\n\n${hashtags}\n\nDownload: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: `BeatDeath - ${platform}`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success(`${platform} post copied! 📱`, {
        description: "Paste it to go viral!"
      });
    }
    
    setShareCount(prev => prev + 1);
  };

  const handleViralFeature = (feature: string) => {
    toast.info(`${feature} coming soon! 🚀`, {
      description: "Follow us for updates when this goes live!"
    });
  };

  return (
    <Card className="glass-card border-accent/30 accent-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Share2 className="w-6 h-6" />
          Go Viral Tools
          <Badge className="bg-accent/20 text-accent border-accent/30">NEW</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Social Platform Templates */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Social Media Templates</h3>
          {SOCIAL_TEMPLATES.map((social, index) => (
            <div key={index} className="p-3 rounded-lg bg-card/30 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded ${social.color} text-white`}>
                  {social.icon}
                </div>
                <span className="font-medium text-foreground">{social.platform}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{social.template}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialShare(social.platform, social.template, social.hashtags)}
              >
                Copy {social.platform} Post
              </Button>
            </div>
          ))}
        </div>

        {/* Viral Features */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground">Viral Features</h3>
          {VIRAL_FEATURES.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="text-accent">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.description}</div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViralFeature(feature.title)}
              >
                {feature.action}
              </Button>
            </div>
          ))}
        </div>

        {/* Share Stats */}
        <div className="text-center p-3 rounded-lg bg-success/10 border border-success/30">
          <div className="text-lg font-bold text-success">{shareCount}</div>
          <div className="text-xs text-muted-foreground">shares this session</div>
        </div>
      </CardContent>
    </Card>
  );
};