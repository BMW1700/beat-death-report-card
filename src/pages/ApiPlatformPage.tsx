
import { Card } from "@/components/ui/card";

// Professional API Platform Page, styled after reference image
const ApiPlatformPage = () => (
  <div className="min-h-screen pt-16 gradient-secondary-bg flex items-center justify-center transition-colors duration-300">
    <div className="max-w-4xl w-full px-4 animate-fade-in">
      <div className="glass-card p-10 sm:p-12 shadow-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold font-playfair gradient-text mb-8 tracking-tight text-center">
          API Platform &amp; Developer Tools
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass-card p-6 border-primary/20">
              <h3 className="text-xl font-semibold text-primary mb-3">Public API</h3>
              <p className="text-muted-foreground">Programmatically analyze death scenarios &amp; scans with our REST API</p>
            </div>
            <div className="glass-card p-6 border-success/20">
              <h3 className="text-xl font-semibold text-success mb-3">Developer Portal</h3>
              <p className="text-muted-foreground">Complete docs, API keys, and integration guides</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="glass-card p-6 border-accent/20">
              <h3 className="text-xl font-semibold text-accent mb-3">SDKs & Libraries</h3>
              <p className="text-muted-foreground">Native support for JavaScript, Python, React, and more</p>
            </div>
            <div className="glass-card p-6 border-warning/20">
              <h3 className="text-xl font-semibold text-warning mb-3">Community</h3>
              <p className="text-muted-foreground">Sample BeatDeath bots &amp; community plugins</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="glass-card p-8 border-primary/30">
            <h2 className="text-2xl font-bold text-primary mb-4">Coming Soon</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <ul className="space-y-2 text-card-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Auto-generated API docs (OpenAPI/Swagger)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  Easy developer onboarding
                </li>
              </ul>
              <ul className="space-y-2 text-card-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Sandbox for test scans &amp; scenario queries
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  Marketplace for open-source plugins
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ApiPlatformPage;

