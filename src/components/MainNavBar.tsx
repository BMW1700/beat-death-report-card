
import { Link, useLocation } from "react-router-dom";
import { Home, Share, Star, Bell, Settings } from "lucide-react";

const navItems = [
  {
    path: "/",
    icon: <Home className="w-6 h-6" />,
    label: "Dashboard",
  },
  {
    path: "/api-platform",
    icon: <Share className="w-6 h-6" />,
    label: "API Platform",
  },
  {
    path: "/live-events",
    icon: <Star className="w-6 h-6" />,
    label: "Live Events",
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
  return (
    <nav className="w-full flex justify-between items-center bg-card/80 backdrop-blur-xl border-b border-border px-4 py-2 fixed top-0 left-0 z-50 transition-all duration-300">
      <div className="flex gap-2 w-full justify-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              location.pathname === item.path
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
