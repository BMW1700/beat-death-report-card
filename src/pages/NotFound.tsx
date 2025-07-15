import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Skull, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("404 page loaded for path:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-secondary-bg pt-16">
      <div className="text-center glass-card p-12 max-w-md w-full purple-glow">
        <div className="flex justify-center mb-6">
          <Skull className="w-24 h-24 text-destructive animate-death-pulse" />
        </div>
        <h1 className="text-6xl font-bold font-playfair gradient-text mb-4">404</h1>
        <p className="text-xl text-card-foreground mb-6">
          This page has been <span className="text-destructive font-bold">eliminated</span>
        </p>
        <p className="text-muted-foreground mb-8">
          The death scanner couldn't find this page. It might have died from natural causes.
        </p>
        <Button asChild className="gradient-bg text-primary-foreground hover:scale-105 transition-all duration-200 purple-glow">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Return to Death Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;