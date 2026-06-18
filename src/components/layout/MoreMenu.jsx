import { Link, useLocation } from "react-router-dom";
import {
  Package, Award, BookOpen, LibraryBig, FileSearch, PenLine,
  Banknote, Users, Globe, Mail, X, LogOut, Settings, Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { base44 } from "@/api/base44Client";

const moreItems = [
  { path: "/supply-chain", label: "Supply Chain", icon: Package },
  { path: "/skills", label: "Skills Marketplace", icon: Award },
  { path: "/education", label: "Education Hub", icon: BookOpen },
  { path: "/resources", label: "SBA Resources", icon: LibraryBig },
  { path: "/grants", label: "Grants Finder", icon: FileSearch },
  { path: "/grant-assistant", label: "Grant Writer", icon: PenLine },
  { path: "/lenders", label: "Lender Marketplace", icon: Banknote },
  { path: "/mentors", label: "Mentor Network", icon: Users },
  { path: "/national", label: "National Dashboard", icon: Globe },
  { path: "/outreach", label: "Collaboration Outreach", icon: Mail },
  { path: "/crypto-web3", label: "Crypto & Web3", icon: Coins },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function MoreMenu({ onClose }) {
  const location = useLocation();

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative bg-card rounded-t-2xl border-t border-border overflow-y-auto max-h-[75vh]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="font-heading font-bold text-foreground text-lg">All Modules</span>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted select-none">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="p-3 grid grid-cols-2 gap-2">
          {moreItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors select-none",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium leading-tight">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-3">
          <button
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-destructive hover:bg-destructive/10 transition-colors select-none"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}