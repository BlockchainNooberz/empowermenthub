import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Landmark, Package, Award, BookOpen, 
  ChevronLeft, ChevronRight, LogOut, Bot, BarChart2, LibraryBig, Sparkles,
  Globe, Banknote, Users, Mail, FileSearch, PenLine
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/lending", label: "Capital Access", icon: Landmark },
  { path: "/supply-chain", label: "Supply Chain", icon: Package },
  { path: "/skills", label: "Skills Marketplace", icon: Award },
  { path: "/education", label: "Education Hub", icon: BookOpen },
  { path: "/advisor", label: "AI Advisor", icon: Bot },
  { path: "/impact", label: "Impact Report", icon: BarChart2 },
  { path: "/resources", label: "SBA Resources", icon: LibraryBig },
  { path: "/blueprint", label: "Blueprint Builder", icon: Sparkles },
  { path: "/grants", label: "Grants Finder", icon: FileSearch },
  { path: "/grant-assistant", label: "Grant Writer", icon: PenLine },
  { path: "/lenders", label: "Lender Marketplace", icon: Banknote },
  { path: "/mentors", label: "Mentor Network", icon: Users },
  { path: "/national", label: "National Dashboard", icon: Globe },
  { path: "/outreach", label: "Collaboration Outreach", icon: Mail },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground z-40 flex flex-col transition-all duration-300 border-r border-sidebar-border",
      collapsed ? "w-[72px]" : "w-[260px]"
    )}>
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0 font-heading font-bold text-white text-base">
          🇺🇸
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-heading text-lg font-bold text-sidebar-foreground leading-tight">EmpowerHub</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/50">Economic Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path || 
            (path !== "/" && location.pathname.startsWith(path));
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => base44.auth.logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all w-full"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}