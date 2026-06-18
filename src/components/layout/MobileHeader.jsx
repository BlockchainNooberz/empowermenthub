import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const rootPaths = ["/", "/lending", "/blueprint", "/advisor", "/impact",
  "/supply-chain", "/skills", "/education", "/resources", "/grants",
  "/grant-assistant", "/lenders", "/mentors", "/national", "/outreach"];

const pageTitles = {
  "/": "EmpowerHub",
  "/lending": "Capital Access",
  "/blueprint": "Blueprint Builder",
  "/advisor": "AI Business Advisor",
  "/impact": "Impact Report",
  "/supply-chain": "Supply Chain",
  "/skills": "Skills Marketplace",
  "/education": "Education Hub",
  "/resources": "SBA Resources",
  "/grants": "Grants Finder",
  "/grant-assistant": "Grant Writer",
  "/lenders": "Lender Marketplace",
  "/mentors": "Mentor Network",
  "/national": "National Dashboard",
  "/outreach": "Collaboration Outreach",
};

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const isRoot = rootPaths.includes(location.pathname);
  const title = pageTitles[location.pathname] || "EmpowerHub";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border flex items-center h-14 select-none"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div className="flex items-center w-full px-4 gap-3 h-14">
        {isRoot ? (
          <div className="flex items-center gap-2">
            <span className="text-xl">🇺🇸</span>
            <span className="font-heading font-bold text-foreground text-base">{title}</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-primary font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>
            <span className="font-heading font-semibold text-foreground text-base flex-1 text-center pr-14 truncate">
              {title}
            </span>
          </>
        )}
      </div>
    </header>
  );
}