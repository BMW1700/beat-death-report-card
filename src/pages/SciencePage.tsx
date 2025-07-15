
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const SciencePage = () => (
  <div className="min-h-screen pt-16 gradient-secondary-bg">
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-bold font-playfair gradient-text text-center mb-12">
          Science, Education & Research
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="glass-card border-warning/20 p-8">
              <CardTitle className="text-3xl text-warning mb-6 flex items-center gap-3">
                🏫 BeatDeath for Schools
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6">Making safety science education fun and engaging</p>
                <div className="space-y-4">
                  <div className="glass-card p-4 border-warning/10">
                    <h4 className="font-semibold text-warning mb-2">Chemistry Safety</h4>
                    <p className="text-sm text-muted-foreground">Interactive lessons on chemical reactions and lab safety</p>
                  </div>
                  <div className="glass-card p-4 border-warning/10">
                    <h4 className="font-semibold text-warning mb-2">Biology & Anatomy</h4>
                    <p className="text-sm text-muted-foreground">How the human body responds to different threats</p>
                  </div>
                  <div className="glass-card p-4 border-warning/10">
                    <h4 className="font-semibold text-warning mb-2">Physics of Danger</h4>
                    <p className="text-sm text-muted-foreground">Understanding forces, energy, and mechanical hazards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-success/20 p-8">
              <CardTitle className="text-3xl text-success mb-6 flex items-center gap-3">
                🔬 Citizen Science
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6">Join our global research community</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-card-foreground">Contribute to safety research projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-card-foreground">Submit your own death scenarios</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-card-foreground">Validate and peer-review submissions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-card-foreground">Access research dashboard and tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="glass-card border-primary/20 p-8">
              <CardTitle className="text-3xl text-primary mb-6 flex items-center gap-3">
                📊 Open Dataset
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6">Publicly available death scenario research data</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-card-foreground font-medium">Scenarios Analyzed</span>
                    <span className="text-primary font-bold">2.3M+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-card-foreground font-medium">Research Papers</span>
                    <span className="text-primary font-bold">847</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-card-foreground font-medium">Contributing Scientists</span>
                    <span className="text-primary font-bold">12.4K</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-card-foreground font-medium">Universities</span>
                    <span className="text-primary font-bold">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-accent/20 p-8">
              <CardTitle className="text-3xl text-accent mb-6 flex items-center gap-3">
                🌐 Global Collaborations
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6">Partnering with leading institutions worldwide</p>
                <div className="space-y-3">
                  <div className="glass-card p-3 border-accent/10">
                    <h4 className="font-semibold text-accent">MIT Safety Lab</h4>
                    <p className="text-xs text-muted-foreground">AI-powered risk assessment</p>
                  </div>
                  <div className="glass-card p-3 border-accent/10">
                    <h4 className="font-semibold text-accent">Johns Hopkins Medicine</h4>
                    <p className="text-xs text-muted-foreground">Medical toxicology research</p>
                  </div>
                  <div className="glass-card p-3 border-accent/10">
                    <h4 className="font-semibold text-accent">CDC Foundation</h4>
                    <p className="text-xs text-muted-foreground">Public health initiatives</p>
                  </div>
                  <div className="glass-card p-3 border-accent/10">
                    <h4 className="font-semibold text-accent">WHO Research Network</h4>
                    <p className="text-xs text-muted-foreground">Global safety standards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default SciencePage;
