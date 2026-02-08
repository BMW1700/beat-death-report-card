import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SciencePage = () => (
  <div className="min-h-screen pt-16 gradient-secondary-bg">
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-bold font-playfair gradient-text text-center mb-12">
          Science, Education & Research
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-10">
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
                <p className="text-lg text-muted-foreground mb-6">Join our growing research community</p>
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
              <div className="flex items-center gap-3 mb-6">
                <CardTitle className="text-3xl text-primary flex items-center gap-3">
                  📊 Open Dataset
                </CardTitle>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs">Coming Soon</Badge>
              </div>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6">
                  We're building a publicly available dataset of crowd-sourced death scenario research. 
                  Contribute scans, validate community submissions, and help advance safety science.
                </p>
                <div className="glass-card p-5 border-primary/10 text-center">
                  <p className="text-muted-foreground text-sm">
                    The open dataset will launch once we reach critical mass of community-validated scenarios. 
                    Every scan you do helps us get there.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-accent/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CardTitle className="text-3xl text-accent flex items-center gap-3">
                  🌐 Research Collaborations
                </CardTitle>
                <Badge variant="outline" className="border-accent/40 text-accent text-xs">Coming Soon</Badge>
              </div>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6">
                  We're exploring partnerships with universities and research institutions to bring real 
                  toxicology and safety science to the platform.
                </p>
                <div className="glass-card p-5 border-accent/10 text-center">
                  <p className="text-muted-foreground text-sm">
                    Interested in collaborating? We're looking for researchers in toxicology, 
                    pharmacology, and public health. Reach out via the API Platform page.
                  </p>
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
