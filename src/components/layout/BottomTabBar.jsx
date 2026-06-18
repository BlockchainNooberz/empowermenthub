import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Landmark, Sparkles, Bot, BarChart2,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import MoreMenu from "./MoreMenu";

const primaryTabs = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/lending", label: "Capital", icon: Landmark },
  { path: "/blueprint", label: "Blueprint", icon: Sparkles },
  { path: "/advisor", label: "AI Advisor", icon: Bot },
  { path: "/impact", label: "Impact", icon: BarChart2 },
];

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = !primaryTabs.some(t =>
    t.path === "/" ? location.pathname === "/" : location.pathname.startsWith(t.path)
  );

  const handleTabPress = (path) => {
    const isActive = path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);
    if (isActive) {
      // Re-selecting active tab resets stack to root
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {moreOpen && <MoreMenu onClose={() => setMoreOpen(false)} />}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex items-center justify-around select-none"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {primaryTabs.map(({ path, label, icon: Icon }) => {
          const isActive = path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(path);
          return (
            <button
              key={path}
              onClick={() => handleTabPress(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 flex-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex flex-col items-center gap-0.5 py-2 px-3 flex-1 transition-colors",
            isMoreActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>
  );
}