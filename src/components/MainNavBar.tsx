import { Link, useLocation } from "react-router-dom";
import { Home, Skull, Share, Star, Bell, Settings, User, LogOut, Trophy, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useScanCredits } from "@/hooks/useScanCredits";
import { ScanCreditsBadge } from "@/components/ScanCreditsBadge";
import { ScanPaywall } from "@/components/ScanPaywall";

const navItems = [
  {
    path: "/",
    icon: <Home className="w-6 h-6" />,
    label: "Dashboard",
  },
  {
    path: "/death-scanner",
    icon: <Skull className="w-6 h-6" />,
    label: "Death Scanner",
  },
  {
    path: "/api-platform",
    icon: <Share className="w-6 h-6" />,
    label: "API Platform",
  },
  {
    path: "/survival-map",
    icon: <Star className="w-6 h-6" />,
    label: "Survival Map",
  },
  {
    path: "/wellness",
    icon: <Bell className="w-6 h-6" />,
    label: "Wellness",
  },
  {
    path: "/science",
    icon: <Settings className="w-6 h-6" />,
    label: "Science",
  },
];

export function MainNavBar() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const scanCredits = useScanCredits();

  // Don't show navbar on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <nav className="w-full flex justify-between items-center gradient-bg backdrop-blur-xl border-b border-primary/30 px-4 py-2 fixed top-0 left-0 z-50 transition-all duration-300 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Skull className="w-6 h-6 text-destructive animate-death-pulse" />
          <span className="font-bold text-primary-foreground font-playfair hidden sm:block">
            BeatDeath
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              location.pathname === item.path
                ? "bg-card/30 text-primary-foreground shadow-xl border border-primary/30 purple-glow"
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-card/20 hover:shadow-lg"
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 bg-card/20 px-3 py-1 rounded-lg border border-primary/20">
              <User className="w-4 h-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary-foreground">
                  {profile?.display_name || profile?.username || 'User'}
                </span>
                {profile?.total_xp !== undefined && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-warning" />
                    <span className="text-xs text-warning font-mono">
                      {profile.total_xp} XP
                    </span>
                  </div>
                )}
                <ScanCreditsBadge
                  freeScansLeft={scanCredits.freeScansLeft}
                  creditsRemaining={scanCredits.creditsRemaining}
                  isSubscriber={scanCredits.isSubscriber}
                  onClick={() => setShowPaywall(true)}
                />
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:block">Sign Out</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              variant="outline"
              size="sm"
              className="md:hidden border-primary/50 text-primary-foreground"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button className="gradient-bg text-primary-foreground">
              Sign In
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && user && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-primary/30 p-4 space-y-3">
          {/* User Info Mobile */}
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <User className="w-8 h-8 text-primary" />
            <div className="flex-1">
              <div className="font-medium text-card-foreground">
                {profile?.display_name || profile?.username || 'User'}
              </div>
              {profile?.total_xp !== undefined && (
                <div className="flex items-center gap-1 mt-1">
                  <Trophy className="w-4 h-4 text-warning" />
                  <span className="text-sm text-warning font-mono">
                    {profile.total_xp} XP
                  </span>
                  {profile.survival_streak > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {profile.survival_streak} day streak
                    </Badge>
                  )}
                </div>
              )}
              <div className="mt-2">
                <ScanCreditsBadge
                  freeScansLeft={scanCredits.freeScansLeft}
                  creditsRemaining={scanCredits.creditsRemaining}
                  isSubscriber={scanCredits.isSubscriber}
                  onClick={() => { setShowPaywall(true); setShowMobileMenu(false); }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-card-foreground hover:bg-card/50"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Sign Out */}
          <Button
            onClick={() => {
              signOut();
              setShowMobileMenu(false);
            }}
            variant="outline"
            className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )}
      {/* Scan Paywall Modal */}
      <ScanPaywall
        open={showPaywall}
        onOpenChange={setShowPaywall}
        onPurchasePack={scanCredits.purchaseScanPack}
        onPurchaseSubscription={scanCredits.purchaseSubscription}
        freeScansLeft={scanCredits.freeScansLeft}
        creditsRemaining={scanCredits.creditsRemaining}
      />
    </nav>
  );
}