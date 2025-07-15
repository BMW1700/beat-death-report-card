
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const LiveEventsPage = () => (
  <div className="min-h-screen pt-16 gradient-secondary-bg">
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-bold font-playfair gradient-text text-center mb-12">
          Live Events & IRL Activations
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="glass-card border-primary/20 p-6">
            <CardTitle className="text-2xl text-primary mb-4 flex items-center gap-2">
              🌍 Global BeatDeath Day
            </CardTitle>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">Annual worldwide celebration of morbid curiosity and safety education</p>
              <ul className="space-y-2 text-card-foreground">
                <li>• Special event challenges & limited-time scenarios</li>
                <li>• Community leaderboards & prizes</li>
                <li>• Educational partnerships with safety organizations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-accent/20 p-6">
            <CardTitle className="text-2xl text-accent mb-4 flex items-center gap-2">
              🏆 Scan-Off Tournaments
            </CardTitle>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">Competitive death analysis tournaments in major cities</p>
              <ul className="space-y-2 text-card-foreground">
                <li>• In-person pop-up experiences</li>
                <li>• Speed scanning competitions</li>
                <li>• Meet other BeatDeath enthusiasts</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-success/20 p-6">
            <CardTitle className="text-2xl text-success mb-4 flex items-center gap-2">
              🤝 Charity Partnerships
            </CardTitle>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">Making safety education fun and accessible</p>
              <ul className="space-y-2 text-card-foreground">
                <li>• School safety programs</li>
                <li>• Poison control awareness</li>
                <li>• First aid training gamification</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-warning/20 p-6">
            <CardTitle className="text-2xl text-warning mb-4 flex items-center gap-2">
              ⌚ Wearable Integration
            </CardTitle>
            <CardContent className="p-0">
              <p className="text-muted-foreground mb-4">BeatDeath on your wrist and beyond</p>
              <ul className="space-y-2 text-card-foreground">
                <li>• Smart watch apps</li>
                <li>• Fitness tracker integration</li>
                <li>• Real-time risk monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);
export default LiveEventsPage;
