import { Card, CardContent, CardTitle } from "@/components/ui/card";

const WellnessPage = () => (
  <div className="min-h-screen pt-16 gradient-secondary-bg">
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h1 className="text-5xl font-bold font-playfair gradient-text text-center mb-12">
          Health & Wellness Integrations
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card border-success/20 p-8">
              <CardTitle className="text-3xl text-success mb-6 flex items-center gap-3">
                🍎 Health App Integration
              </CardTitle>
              <CardContent className="p-0 space-y-4">
                <p className="text-lg text-muted-foreground">Connect your health data for personalized death risk analysis</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="glass-card p-4 border-success/10">
                    <h4 className="font-semibold text-success mb-2">Apple Health</h4>
                    <p className="text-sm text-muted-foreground">Heart rate, steps, sleep patterns</p>
                  </div>
                  <div className="glass-card p-4 border-success/10">
                    <h4 className="font-semibold text-success mb-2">Google Fit</h4>
                    <p className="text-sm text-muted-foreground">Activity levels, weight tracking</p>
                  </div>
                  <div className="glass-card p-4 border-success/10">
                    <h4 className="font-semibold text-success mb-2">Fitbit</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive wellness data</p>
                  </div>
                  <div className="glass-card p-4 border-success/10">
                    <h4 className="font-semibold text-success mb-2">MyFitnessPal</h4>
                    <p className="text-sm text-muted-foreground">Nutrition and dietary tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-primary/20 p-8">
              <CardTitle className="text-3xl text-primary mb-6 flex items-center gap-3">
                🛡️ Wellness Mode
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground mb-6">Proactive risk reduction and safety recommendations</p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">Smart Risk Alerts</h4>
                      <p className="text-muted-foreground">Get notified about potential risks based on your location and activities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">Personalized Safety Tips</h4>
                      <p className="text-muted-foreground">Custom recommendations based on your health profile and habits</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">Emergency Contacts</h4>
                      <p className="text-muted-foreground">Quick access to emergency services and your emergency contacts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="glass-card border-accent/20 p-6">
              <CardTitle className="text-2xl text-accent mb-4 flex items-center gap-2">
                💼 Insurance Partners
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">Get better rates with safety-conscious behavior</p>
                <ul className="space-y-2 text-card-foreground">
                  <li>• Life insurance discounts</li>
                  <li>• Health insurance benefits</li>
                  <li>• Auto insurance savings</li>
                  <li>• Travel insurance integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-warning/20 p-6">
              <CardTitle className="text-2xl text-warning mb-4 flex items-center gap-2">
                🏥 Medical Integration
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">Connect with your healthcare providers</p>
                <ul className="space-y-2 text-card-foreground">
                  <li>• Electronic health records</li>
                  <li>• Medication tracking</li>
                  <li>• Allergy management</li>
                  <li>• Doctor consultations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-destructive/20 p-6">
              <CardTitle className="text-2xl text-destructive mb-4 flex items-center gap-2">
                🚨 Emergency Features
              </CardTitle>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">Safety features when you need them most</p>
                <ul className="space-y-2 text-card-foreground">
                  <li>• One-tap emergency calling</li>
                  <li>• Medical ID integration</li>
                  <li>• Location sharing</li>
                  <li>• Emergency scenarios</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default WellnessPage;