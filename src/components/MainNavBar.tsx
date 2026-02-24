import { Link, useLocation } from "react-router-dom";
import { Home, Skull, Map, User, LogOut, Trophy, Menu, X } from "lucide-react";
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
    icon: <Home className="w-5 h-5" />,
    label: "Dashboard",
  },
  {
    path: "/death-scanner",
    icon: <Skull className="w-5 h-5" />,
    label: "Death Scanner",
  },
  {
    path: "/survival-map",
    icon: <Map className="w-5 h-5" />,
    label: "Survival Map",
  },
];

export function MainNavBar() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const scanCredits = useScanCredits();

  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <nav className="w-full flex justify-between items-center gradient-bg backdrop-blur-xl border-b border-primary/30 px-4 py-1.5 fixed top-0 left-0 z-50 transition-all duration-300 shadow-lg">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Skull className="w-5 h-5 text-destructive animate-death-pulse" />
          <span className="font-bold text-primary-foreground font-playfair hidden sm:block text-sm">
            BeatDeath
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center px-2.5 py-1.5 rounded-md transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-card/30 text-primary-foreground border border-primary/30"
                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-card/20"
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Section */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <ScanCreditsBadge
              freeScansLeft={scanCredits.freeScansLeft}
              creditsRemaining={scanCredits.creditsRemaining}
              isSubscriber={scanCredits.isSubscriber}
              onClick={() => setShowPaywall(true)}
              size="md"
            />

            <div className="hidden sm:flex items-center gap-2 bg-card/20 px-2.5 py-1 rounded-md border border-primary/20">
              <User className="w-3.5 h-3.5 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary-foreground leading-tight">
                  {profile?.display_name || profile?.username || 'User'}
                </span>
                {profile?.total_xp !== undefined && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-warning" />
                    <span className="text-[10px] text-warning font-mono">
                      {profile.total_xp} XP
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground h-7 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:block">Sign Out</span>
            </Button>

            <Button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              variant="outline"
              size="sm"
              className="md:hidden border-primary/50 text-primary-foreground h-7"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button className="gradient-bg text-primary-foreground h-8 text-sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && user && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-primary/30 p-4 space-y-3">
          <div className="flex justify-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <ScanCreditsBadge
              freeScansLeft={scanCredits.freeScansLeft}
              creditsRemaining={scanCredits.creditsRemaining}
              isSubscriber={scanCredits.isSubscriber}
              onClick={() => { setShowPaywall(true); setShowMobileMenu(false); }}
              size="lg"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-card/20 rounded-lg border border-primary/10">
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
            </div>
          </div>

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
