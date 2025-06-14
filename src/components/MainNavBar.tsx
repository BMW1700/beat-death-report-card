
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
    <nav className="w-full flex justify-between items-center bg-slate-900 border-b border-slate-800 px-4 py-2 fixed top-0 left-0 z-20">
      <div className="flex gap-2 w-full justify-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center px-2 py-1 rounded transition-colors ${
              location.pathname === item.path
                ? "bg-purple-800 text-yellow-300"
                : "text-slate-300 hover:text-yellow-400 hover:bg-slate-800"
            }`}
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
