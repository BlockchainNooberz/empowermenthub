import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Trophy, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MILESTONE_PHASES = [
  {
    phase: "Foundation",
    color: "blue",
    milestones: [
      { id: "business_name", label: "Choose a business name", desc: "Research availability and reserve your name" },
      { id: "legal_structure", label: "Select legal structure", desc: "LLC, S-Corp, C-Corp, or Sole Proprietorship" },
      { id: "ein", label: "Obtain EIN from IRS", desc: "Free at IRS.gov — required for banking & taxes" },
      { id: "state_registration", label: "Register with your state", desc: "File Articles of Organization or Incorporation" },
    ]
  },
  {
    phase: "Compliance",
    color: "amber",
    milestones: [
      { id: "business_license", label: "Get business license & permits", desc: "City, county, and industry-specific permits" },
      { id: "bank_account", label: "Open a business bank account", desc: "Separate personal & business finances" },
      { id: "insurance", label: "Obtain business insurance", desc: "General liability, professional, workers comp" },
      { id: "accounting", label: "Set up accounting system", desc: "QuickBooks, Wave, or similar software" },
    ]
  },
  {
    phase: "Branding",
    color: "violet",
    milestones: [
      { id: "logo_brand", label: "Create logo & brand identity", desc: "Colors, fonts, and visual style guide" },
      { id: "domain", label: "Secure domain & website", desc: "Purchase domain and set up business website" },
      { id: "social_media", label: "Set up social media profiles", desc: "Claim handles on relevant platforms" },
      { id: "email", label: "Create professional email", desc: "yourname@yourbusiness.com via Google Workspace" },
    ]
  },
  {
    phase: "Operations",
    color: "emerald",
    milestones: [
      { id: "sops", label: "Write Standard Operating Procedures", desc: "Document your core processes step-by-step" },
      { id: "vendor_contracts", label: "Sign vendor & supplier contracts", desc: "Lock in pricing and delivery terms" },
      { id: "hire_first", label: "Hire first employee or contractor", desc: "Job posting, interview, onboarding checklist" },
      { id: "pos_system", label: "Set up POS or payment system", desc: "Square, Stripe, or industry-specific tools" },
    ]
  },
  {
    phase: "Revenue",
    color: "rose",
    milestones: [
      { id: "pricing", label: "Finalize pricing strategy", desc: "Cost-plus, value-based, or competitive pricing" },
      { id: "revenue_projections", label: "Complete revenue projections", desc: "Month-by-month forecast for Year 1 & Year 2" },
      { id: "first_customer", label: "Land first paying customer", desc: "Your proof of concept moment" },
      { id: "break_even", label: "Reach break-even point", desc: "Monthly revenue covers all monthly costs" },
    ]
  },
];

const colorMap = {
  blue:   { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700",   check: "text-blue-600",   dot: "bg-blue-500",   progress: "bg-blue-500"   },
  amber:  { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-700",  check: "text-amber-600",  dot: "bg-amber-500",  progress: "bg-amber-500"  },
  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", check: "text-violet-600", dot: "bg-violet-500", progress: "bg-violet-500" },
  emerald:{ bg: "bg-emerald-50",border: "border-emerald-200",text: "text-emerald-700",check: "text-emerald-600",dot: "bg-emerald-500",progress: "bg-emerald-500"},
  rose:   { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-700",   check: "text-rose-600",   dot: "bg-rose-500",   progress: "bg-rose-500"   },
};

const STORAGE_KEY = "blueprint_milestones";

export default function MilestoneTracker() {
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });
  const [openPhases, setOpenPhases] = useState({ Foundation: true });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const toggle = (id) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePhase = (phase) => {
    setOpenPhases(prev => ({ ...prev, [phase]: !prev[phase] }));
  };

  const totalMilestones = MILESTONE_PHASES.flatMap(p => p.milestones).length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const overallPct = Math.round((completedCount / totalMilestones) * 100);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-foreground">Business Launch Milestones</h3>
          </div>
          <div className="flex items-center gap-2">
            {overallPct === 100 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                <Trophy className="w-3 h-3" /> Complete!
              </span>
            )}
            <span className="text-sm font-semibold text-muted-foreground">{completedCount}/{totalMilestones}</span>
          </div>
        </div>
        {/* Overall progress bar */}
        <div className="w-full bg-muted rounded-full h-2.5">
          <motion.div
            className="bg-primary h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{overallPct}% of your business launch complete</p>
      </div>

      {/* Phases */}
      <div className="divide-y divide-border">
        {MILESTONE_PHASES.map((phase) => {
          const c = colorMap[phase.color];
          const phaseCompleted = phase.milestones.filter(m => completed[m.id]).length;
          const phasePct = Math.round((phaseCompleted / phase.milestones.length) * 100);
          const isOpen = openPhases[phase.phase];

          return (
            <div key={phase.phase}>
              <button
                onClick={() => togglePhase(phase.phase)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
              >
                {/* Phase dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${phasePct === 100 ? "bg-green-500" : c.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{phase.phase}</span>
                    <span className={`text-xs font-medium ${c.text}`}>{phaseCompleted}/{phase.milestones.length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${phasePct === 100 ? "bg-green-500" : c.progress}`} style={{ width: `${phasePct}%` }} />
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-5 pb-4 space-y-2 ${c.bg}`}>
                      {phase.milestones.map((milestone) => {
                        const done = !!completed[milestone.id];
                        return (
                          <button
                            key={milestone.id}
                            onClick={() => toggle(milestone.id)}
                            className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                              done
                                ? `${c.border} bg-white/80 opacity-80`
                                : "border-transparent bg-white/50 hover:bg-white/80"
                            }`}
                          >
                            {done
                              ? <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.check}`} />
                              : <Circle className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
                            }
                            <div>
                              <span className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {milestone.label}
                              </span>
                              <p className="text-xs text-muted-foreground mt-0.5">{milestone.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}