import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PullToRefresh from "@/components/layout/PullToRefresh";
import { Link } from "react-router-dom";
import {
  Landmark, Package, Award, BookOpen, TrendingUp, Users,
  DollarSign, ShieldCheck, ArrowRight, MapPin, Sparkles, Bot, BarChart2, LibraryBig,
  Globe, Banknote, FileSearch, PenLine, Mail, Coins, ExternalLink } from
"lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/shared/StatCard";
import ProgressBar from "@/components/shared/ProgressBar";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const handleRefresh = async () => {await queryClient.invalidateQueries();};

  const { data: loans = [] } = useQuery({
    queryKey: ["loans"],
    queryFn: () => base44.entities.LoanRequest.list()
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.SupplyChainProduct.list()
  });
  const { data: credentials = [] } = useQuery({
    queryKey: ["credentials"],
    queryFn: () => base44.entities.SkillCredential.list()
  });
  const { data: resources = [] } = useQuery({
    queryKey: ["resources"],
    queryFn: () => base44.entities.EducationResource.list()
  });

  const totalFunding = loans.reduce((sum, l) => sum + (l.amount_funded || 0), 0);
  const totalRequested = loans.reduce((sum, l) => sum + (l.amount_requested || 0), 0);
  const verifiedProducts = products.filter((p) => p.verification_status === "verified").length;
  const verifiedCreds = credentials.filter((c) => c.verification_status === "verified").length;
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
  },
  {
    title: "SBA Resource Center",
    desc: "Browse programs, find local SBDC/SCORE offices, and look up size standards",
    icon: LibraryBig,
    path: "/resources",
    stat: "Live SBA API data",
    gradient: "from-teal-600/10 to-cyan-600/10",
    iconBg: "bg-teal-600/10 text-teal-600"
  },
  {
    title: "Blueprint Builder",
    desc: "Describe your business in plain English — get a full business plan, legal structure, financials, branding & more",
    icon: Sparkles,
    path: "/blueprint",
    stat: "AI-generated documents",
    gradient: "from-accent/10 to-yellow-500/10",
    iconBg: "bg-accent/20 text-amber-600"
  },
  {
    title: "Federal Grants Finder",
    desc: "Discover SBIR, EDA, USDA, and SBA grants tailored to your business with AI matching",
    icon: FileSearch,
    path: "/grants",
    stat: "Live federal programs",
    gradient: "from-sky-600/10 to-blue-500/10",
    iconBg: "bg-sky-600/10 text-sky-600"
  },
  {
    title: "Grant Application Writer",
    desc: "AI writes your full SBIR, EDA, SBA 8(a), and USDA grant application narratives",
    icon: PenLine,
    path: "/grant-assistant",
    stat: "Premium AI model",
    gradient: "from-indigo-600/10 to-violet-500/10",
    iconBg: "bg-indigo-600/10 text-indigo-600"
  },
  {
    title: "Lender Marketplace",
    desc: "Vetted CDFIs, SBA lenders, and mission-driven institutions ready to fund your business",
    icon: Banknote,
    path: "/lenders",
    stat: "Free matching",
    gradient: "from-emerald-600/10 to-green-500/10",
    iconBg: "bg-emerald-600/10 text-emerald-600"
  },
  {
    title: "Mentor & Advisor Network",
    desc: "Connect with SCORE mentors, SBDC advisors, and specialized support organizations",
    icon: Users,
    path: "/mentors",
    stat: "All free to access",
    gradient: "from-violet-600/10 to-purple-500/10",
    iconBg: "bg-violet-600/10 text-violet-600"
  },
  {
    title: "National Impact Dashboard",
    desc: "Real-time economic data across all 50 states for congressional and SBA reporting",
    icon: Globe,
    path: "/national",
    stat: "Congressional-ready",
    gradient: "from-primary/10 to-slate-600/10",
    iconBg: "bg-primary/10 text-primary"
  },
  {
    title: "Collaboration Outreach",
    desc: "AI-generated emails to 20+ federal agencies, CDFIs, HBCUs, and partner organizations",
    icon: Mail,
    path: "/outreach",
    stat: "20+ partner organizations",
    gradient: "from-rose-600/10 to-pink-500/10",
    iconBg: "bg-rose-600/10 text-rose-600"
  },
  {
    title: "Crypto, Web3 & Blockchain",
    desc: "Tokenize real-world assets, pay employees with stablecoins, access Web3 grants & navigate US crypto regulations",
    icon: Coins,
    path: "/crypto-web3",
    stat: "RWA • Stablecoin Payroll • DeFi Grants",
    gradient: "from-violet-600/10 to-indigo-500/10",
    iconBg: "bg-violet-600/10 text-violet-600"
  }];


  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <motion.div {...fadeIn} className="mb-10 relative overflow-hidden rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, #0A3161 0%, #0d3d7a 50%, #0A3161 100%)' }}>
        {/* Red stripe accent left */}
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-l-2xl" />
        {/* White stripe accent */}
        <div className="absolute left-3 top-0 bottom-0 w-1 bg-white/20" />
        {/* Stars field */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center gap-3 opacity-20">
            {[0, 1, 2, 3, 4].map((row) =>
              <div key={row} className="flex gap-4">
                {[0, 1, 2, 3, 4, 5].map((col) =>
                <span key={col} className="text-white text-xl leading-none">★</span>
                )}
              </div>
              )}
          </div>
        </div>
        <div className="pl-7 pr-6 py-8 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            
            
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight leading-tight mb-3">
            Building America's<br />Economic Future
          </h1>
          <p className="text-white/75 text-base max-w-2xl mb-4">
            Capital access, supply chain transparency, workforce credentialing, and technology education — unified for American economic growth.
          </p>
          <div className="flex flex-wrap gap-2">
            {["SBA Aligned", "SBDC Ready", "SCORE Network", "Made in America"].map((tag) =>
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 text-white border border-white/30">{tag}</span>
              )}
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
            accentClass="bg-blue-600/10 text-blue-600" />
          
        <StatCard
            title="Verified Products"
            value={verifiedProducts}
            subtitle="American-made tracked"
            icon={ShieldCheck}
            accentClass="bg-emerald-600/10 text-emerald-600" />
          
        <StatCard
            title="Skilled Workers"
            value={verifiedCreds}
            subtitle="credentials verified"
            icon={Users}
            accentClass="bg-amber-600/10 text-amber-600" />
          
        <StatCard
            title="Resources Shared"
            value={resources.length}
            subtitle={`${totalDownloads.toLocaleString()} total downloads`}
            icon={TrendingUp}
            accentClass="bg-violet-600/10 text-violet-600" />
          
      </motion.div>

      {/* Module Cards */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-heading font-bold mb-5">Platform Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((mod, i) =>
            <Link
              key={mod.path}
              to={mod.path}
              className={`group relative bg-gradient-to-br ${mod.gradient} border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
              
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
            )}
        </div>
      </motion.div>

      {/* Collaborations */}
      <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="mt-10">
        <h2 className="text-xl font-heading font-bold mb-2">Collaborations</h2>
        <p className="text-sm text-muted-foreground mb-5">Affiliated projects in the ecosystem</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: "Nexum Institutional Finance",
              url: "https://nexum-finance-core.base44.app",
              desc: "Institutional banking platform integrating traditional assets & tokenized securities",
              logo: "https://media.base44.com/images/public/6a2a1786a1ed8b9b66d62137/nexum-logo.png",
              fallbackBg: "bg-gradient-to-br from-slate-800 to-slate-900",
              fallbackText: "NI",
              fallbackColor: "text-amber-400"
            },
            {
              name: "LegacyVault",
              url: "https://secure-heir-vault.base44.app",
              desc: "Exclusive high-security private concierge & digital asset management platform",
              logo: null,
              fallbackBg: "bg-gradient-to-br from-amber-700 to-yellow-800",
              fallbackText: "🔒",
              fallbackColor: "text-white"
            },
            {
              name: "Wealth Nexus",
              url: "https://wealth-nexus-beta.base44.app",
              desc: "Intuitive platform to manage, track, and visualize your financial growth & investments",
              logo: null,
              fallbackBg: "bg-gradient-to-br from-teal-600 to-emerald-700",
              fallbackText: "WN",
              fallbackColor: "text-white"
            },
            {
              name: "Global Equity Nexus",
              url: "https://world-equity-link.base44.app",
              desc: "Centralized diplomatic & data intelligence platform connecting governments & institutions",
              logo: null,
              fallbackBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
              fallbackText: "🌐",
              fallbackColor: "text-white"
            },
            {
              name: "CivicRise",
              url: "https://civic-rise-path.base44.app",
              desc: "Comprehensive platform designed to facilitate civic engagement & community empowerment",
              logo: null,
              fallbackBg: "bg-gradient-to-br from-orange-500 to-yellow-500",
              fallbackText: "CR",
              fallbackColor: "text-white"
            }].
            map((project) =>
            <a
              key={project.url}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3">
              
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${project.fallbackBg}`}>
                  {project.logo ?
                  <img src={project.logo} alt={project.name} className="w-full h-full object-cover" onError={(e) => {e.target.style.display = 'none';e.target.nextSibling.style.display = 'flex';}} /> :
                  null}
                  <span className={`text-lg font-bold ${project.fallbackColor} ${project.logo ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>{project.fallbackText}</span>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground">{project.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{project.desc}</p>
              </div>
              <span className="text-xs font-medium text-muted-foreground/60 truncate">{project.url.replace("https://", "")}</span>
            </a>
            )}
        </div>
      </motion.div>

      {/* Active Loans Preview */}
      {loans.filter((l) => l.status === "seeking_funding" || l.status === "partially_funded").length > 0 &&
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-heading font-bold">Active Funding Requests</h2>
            <Link to="/lending" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {loans.
            filter((l) => l.status === "seeking_funding" || l.status === "partially_funded").
            slice(0, 3).
            map((loan) =>
            <div key={loan.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{loan.business_name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{loan.location}</span>
                        {loan.underserved_area &&
                    <span className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            Underserved Area
                          </span>
                    }
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
            )}
          </div>
        </motion.div>
        }
    </div>
    </PullToRefresh>);

}