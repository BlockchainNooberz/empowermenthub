import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Landmark, Package, Award, BookOpen, TrendingUp, Users, 
  DollarSign, ShieldCheck, ArrowRight, MapPin, Sparkles, Bot, BarChart2
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/shared/StatCard";
import ProgressBar from "@/components/shared/ProgressBar";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  const { data: loans = [] } = useQuery({
    queryKey: ["loans"],
    queryFn: () => base44.entities.LoanRequest.list(),
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.SupplyChainProduct.list(),
  });
  const { data: credentials = [] } = useQuery({
    queryKey: ["credentials"],
    queryFn: () => base44.entities.SkillCredential.list(),
  });
  const { data: resources = [] } = useQuery({
    queryKey: ["resources"],
    queryFn: () => base44.entities.EducationResource.list(),
  });

  const totalFunding = loans.reduce((sum, l) => sum + (l.amount_funded || 0), 0);
  const totalRequested = loans.reduce((sum, l) => sum + (l.amount_requested || 0), 0);
  const verifiedProducts = products.filter(p => p.verification_status === "verified").length;
  const verifiedCreds = credentials.filter(c => c.verification_status === "verified").length;
  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

  const modules = [
    {
      title: "Capital Access",
      desc: "Community lending for small businesses in underserved areas",
      icon: Landmark,
      path: "/lending",
      stat: `$${(totalFunding / 1000).toFixed(0)}K funded`,
      gradient: "from-blue-600/10 to-indigo-600/10",
      iconBg: "bg-blue-600/10 text-blue-600"
    },
    {
      title: "Supply Chain",
      desc: "Track American-made products from source to consumer",
      icon: Package,
      path: "/supply-chain",
      stat: `${verifiedProducts} verified products`,
      gradient: "from-emerald-600/10 to-teal-600/10",
      iconBg: "bg-emerald-600/10 text-emerald-600"
    },
    {
      title: "Skills Marketplace",
      desc: "Verify skills and credentials across industries",
      icon: Award,
      path: "/skills",
      stat: `${verifiedCreds} verified credentials`,
      gradient: "from-amber-600/10 to-orange-600/10",
      iconBg: "bg-amber-600/10 text-amber-600"
    },
    {
      title: "Education Hub",
      desc: "Collaborate on curriculum for emerging technologies",
      icon: BookOpen,
      path: "/education",
      stat: `${totalDownloads.toLocaleString()} downloads`,
      gradient: "from-violet-600/10 to-purple-600/10",
      iconBg: "bg-violet-600/10 text-violet-600"
    },
    {
      title: "AI Business Advisor",
      desc: "Agentic AI guidance for SBA loans, business plans & workforce strategy",
      icon: Bot,
      path: "/advisor",
      stat: "Powered by AI",
      gradient: "from-red-600/10 to-rose-600/10",
      iconBg: "bg-red-600/10 text-red-600"
    },
    {
      title: "Impact Report",
      desc: "Metrics, charts & stakeholder alignment for SBA, SBDC, SCORE & White House",
      icon: BarChart2,
      path: "/impact",
      stat: "SBA + SCORE + SBDC aligned",
      gradient: "from-primary/10 to-blue-800/10",
      iconBg: "bg-primary/10 text-primary"
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <motion.div {...fadeIn} className="mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-[#0a2565] p-8 shadow-xl">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-red-500 to-red-700 rounded-l-2xl" />
        <div className="absolute right-6 top-3 text-white/5 text-8xl select-none pointer-events-none leading-snug">
          ★ ★ ★<br/>★ ★ ★<br/>★ ★ ★
        </div>
        <div className="pl-3 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-widest">🇺🇸 EmpowerHub</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight leading-tight mb-3">
            Building America's<br />Economic Future
          </h1>
          <p className="text-white/70 text-base max-w-2xl mb-4">
          Capital access, supply chain transparency, workforce credentialing, and technology education — unified for American economic growth.
          </p>
          <div className="flex flex-wrap gap-2">
            {["SBA Aligned", "SBDC Ready", "SCORE Network", "Made in America"].map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/20">{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard 
          title="Total Funded" 
          value={`$${(totalFunding / 1000).toFixed(0)}K`} 
          subtitle={`of $${(totalRequested / 1000).toFixed(0)}K requested`}
          icon={DollarSign} 
          accentClass="bg-blue-600/10 text-blue-600" 
        />
        <StatCard 
          title="Verified Products" 
          value={verifiedProducts} 
          subtitle="American-made tracked"
          icon={ShieldCheck} 
          accentClass="bg-emerald-600/10 text-emerald-600" 
        />
        <StatCard 
          title="Skilled Workers" 
          value={verifiedCreds} 
          subtitle="credentials verified"
          icon={Users} 
          accentClass="bg-amber-600/10 text-amber-600" 
        />
        <StatCard 
          title="Resources Shared" 
          value={resources.length} 
          subtitle={`${totalDownloads.toLocaleString()} total downloads`}
          icon={TrendingUp} 
          accentClass="bg-violet-600/10 text-violet-600" 
        />
      </motion.div>

      {/* Module Cards */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-heading font-bold mb-5">Platform Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((mod, i) => (
            <Link
              key={mod.path}
              to={mod.path}
              className={`group relative bg-gradient-to-br ${mod.gradient} border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mod.iconBg}`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-1">{mod.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{mod.desc}</p>
              <span className="text-xs font-semibold text-foreground/70 bg-background/60 px-3 py-1 rounded-full">
                {mod.stat}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Active Loans Preview */}
      {loans.filter(l => l.status === "seeking_funding" || l.status === "partially_funded").length > 0 && (
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-heading font-bold">Active Funding Requests</h2>
            <Link to="/lending" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {loans
              .filter(l => l.status === "seeking_funding" || l.status === "partially_funded")
              .slice(0, 3)
              .map(loan => (
                <div key={loan.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{loan.business_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{loan.location}</span>
                        {loan.underserved_area && (
                          <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            Underserved Area
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-heading font-bold text-foreground">
                      ${loan.amount_requested?.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar value={loan.amount_funded || 0} max={loan.amount_requested} barClass="bg-blue-600" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>${(loan.amount_funded || 0).toLocaleString()} funded</span>
                    <span>{loan.lender_count || 0} lenders</span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}