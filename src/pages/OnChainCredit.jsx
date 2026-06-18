import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import {
  ShieldCheck, Loader2, TrendingUp, AlertTriangle, CheckCircle2,
  ExternalLink, Info, Sparkles, Building2, Globe, RefreshCw
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Simulated on-chain credit profiles for the demo
const DEMO_WALLETS = {
  "5xG7...mFz2": {
    entity: "Sunrise Bakery LLC",
    wallet: "5xG7kP9nQr3mFz2",
    chain: "Solana",
    moodys: { score: 72, grade: "Baa2", outlook: "Stable", lastUpdated: "2026-06-10" },
    dnb: { duns: "12-345-6789", paydexScore: 80, riskScore: "Low", creditLimit: "$85,000" },
    onChainMetrics: {
      walletAge: "18 months",
      totalTxVolume: "$412,000",
      avgMonthlyVolume: "$22,800",
      nftHoldings: 2,
      defiInteractions: 14,
      stablecoinBalance: "$8,200 USDC",
      defaultHistory: "None",
    },
    summary: "Solid payment history with consistent on-chain stablecoin activity. Qualifies for SMB lending tiers.",
    flags: [],
  },
  "9aP1...kWx8": {
    entity: "IronForge Metalworks Inc.",
    wallet: "9aP1cV4dYe6kWx8",
    chain: "Solana",
    moodys: { score: 58, grade: "Ba3", outlook: "Negative Watch", lastUpdated: "2026-05-28" },
    dnb: { duns: "98-765-4321", paydexScore: 62, riskScore: "Moderate", creditLimit: "$35,000" },
    onChainMetrics: {
      walletAge: "9 months",
      totalTxVolume: "$187,000",
      avgMonthlyVolume: "$20,700",
      nftHoldings: 0,
      defiInteractions: 3,
      stablecoinBalance: "$1,100 USDC",
      defaultHistory: "1 missed payment (Q1 2026)",
    },
    summary: "Moderate risk profile. One historical delinquency flagged. Recommend short-term credit limits pending review.",
    flags: ["Missed payment flagged Q1 2026", "Low stablecoin reserve ratio"],
  },
  "3mR5...bNq0": {
    entity: "BlueSky TechVentures",
    wallet: "3mR5hJ2wCd1bNq0",
    chain: "Solana",
    moodys: { score: 88, grade: "Aa3", outlook: "Positive", lastUpdated: "2026-06-15" },
    dnb: { duns: "55-212-8876", paydexScore: 95, riskScore: "Very Low", creditLimit: "$500,000" },
    onChainMetrics: {
      walletAge: "36 months",
      totalTxVolume: "$3,200,000",
      avgMonthlyVolume: "$88,888",
      nftHoldings: 12,
      defiInteractions: 89,
      stablecoinBalance: "$142,000 USDC",
      defaultHistory: "None",
    },
    summary: "Premium credit profile. High-volume on-chain activity with zero defaults. Qualifies for institutional DeFi lending pools.",
    flags: [],
  },
};

const GRADE_COLORS = {
  "Aaa": "text-emerald-300", "Aa3": "text-emerald-300", "Aa2": "text-emerald-300",
  "A1": "text-green-300", "A2": "text-green-300", "A3": "text-green-300",
  "Baa1": "text-blue-300", "Baa2": "text-blue-300", "Baa3": "text-blue-300",
  "Ba1": "text-amber-300", "Ba2": "text-amber-300", "Ba3": "text-amber-300",
  "B1": "text-orange-300", "B2": "text-orange-300",
  "Caa": "text-red-400",
};

const OUTLOOK_COLORS = {
  "Stable": "bg-blue-400/20 text-blue-300",
  "Positive": "bg-emerald-400/20 text-emerald-300",
  "Negative Watch": "bg-red-400/20 text-red-300",
};

const SCORE_BG = (score) => {
  if (score >= 80) return "from-emerald-500 to-teal-500";
  if (score >= 65) return "from-blue-500 to-indigo-500";
  if (score >= 50) return "from-amber-500 to-orange-500";
  return "from-red-500 to-rose-600";
};

export default function OnChainCredit() {
  const [walletInput, setWalletInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const lookupWallet = () => {
    setLoading(true);
    setProfile(null);
    setAiAnalysis("");
    setNotFound(false);
    // Simulate API latency
    setTimeout(() => {
      const key = Object.keys(DEMO_WALLETS).find(k =>
        walletInput.trim().toLowerCase().includes(k.split("...")[0].toLowerCase()) ||
        walletInput.trim() === k
      );
      if (key) {
        setProfile(DEMO_WALLETS[key]);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 1200);
  };

  const loadDemo = (key) => {
    setWalletInput(key);
    setProfile(DEMO_WALLETS[key]);
    setAiAnalysis("");
    setNotFound(false);
  };

  const getAIAnalysis = async () => {
    if (!profile) return;
    setAiLoading(true);
    setAiAnalysis("");
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a blockchain credit analyst specializing in on-chain credit scoring for small businesses. Analyze the following credit profile and provide:
1. A brief risk assessment (2-3 sentences)
2. Specific lending recommendations (what loan amounts, terms, or DeFi protocols this entity might qualify for)
3. Steps to improve their on-chain credit score
4. Whether this entity would likely qualify for SBA-backed lending

Entity: ${profile.entity}
Moody's On-Chain Score: ${profile.moodys.score}/100, Grade: ${profile.moodys.grade}, Outlook: ${profile.moodys.outlook}
D&B Paydex: ${profile.dnb.paydexScore}, Risk: ${profile.dnb.riskScore}, Credit Limit: ${profile.dnb.creditLimit}
Wallet Age: ${profile.onChainMetrics.walletAge}
Total TX Volume: ${profile.onChainMetrics.totalTxVolume}
Default History: ${profile.onChainMetrics.defaultHistory}
Flags: ${profile.flags.length > 0 ? profile.flags.join(", ") : "None"}
Summary: ${profile.summary}

Be concise and actionable. Format with markdown headers.`,
    });
    setAiAnalysis(result);
    setAiLoading(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeroBanner
        icon="📊"
        eyebrow="On-Chain Credit Intelligence"
        title="Moody's × D&B On-Chain Credit Scores"
        subtitle="Hypothetical demo: How Moody's blockchain credit ratings on Solana and Dun & Bradstreet on-chain scores could transform small business lending. Moody's initiated on-chain scoring on Solana in 2026 — D&B integration is projected."
        tags={["Moody's On-Chain", "D&B Projected", "Solana Network", "DeFi Lending", "Hypothetical Demo"]}
      />

      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-3 bg-amber-400/10 border border-amber-400/30 rounded-xl p-4">
        <Info className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-300 mb-0.5">Hypothetical Scenario Demo</p>
          <p className="text-xs text-white/60">
            Moody's launched on-chain credit scoring infrastructure on Solana in 2026. D&B integration shown here is a projected future state. All wallet data, scores, and profiles are simulated for demonstration purposes only.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Globe, title: "Moody's On Solana", desc: "Moody's indexes on-chain wallet activity, payment history, and DeFi behavior to generate a 0–100 credit score and traditional letter grade (Aaa–C).", color: "text-blue-300", bg: "bg-blue-400/10" },
          { icon: Building2, title: "D&B DUNS + Paydex", desc: "Projected: D&B links DUNS numbers to Solana wallet addresses, combining traditional trade payment history with on-chain transaction data.", color: "text-amber-300", bg: "bg-amber-400/10" },
          { icon: TrendingUp, title: "Unified Lending Signal", desc: "Lenders, CDFIs, and DeFi protocols consume both scores via API to make instant, verifiable credit decisions — no paperwork required.", color: "text-emerald-300", bg: "bg-emerald-400/10" },
        ].map((item) => (
          <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <h3 className={`font-heading font-bold text-sm mb-1.5 ${item.color}`}>{item.title}</h3>
            <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Wallet Lookup */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-heading font-bold text-white mb-1">Look Up On-Chain Credit Profile</h2>
        <p className="text-sm text-white/50 mb-4">Enter a Solana wallet address or try one of the demo profiles below</p>

        <div className="flex gap-3 mb-4">
          <Input
            value={walletInput}
            onChange={e => setWalletInput(e.target.value)}
            placeholder="Solana wallet address (e.g. 5xG7...mFz2)"
            className="bg-white/5 border-white/15 text-white placeholder:text-white/30"
            onKeyDown={e => e.key === "Enter" && lookupWallet()}
          />
          <Button onClick={lookupWallet} disabled={!walletInput.trim() || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span className="hidden sm:inline ml-1">Lookup</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-white/40 self-center mr-1">Demo profiles:</span>
          {Object.keys(DEMO_WALLETS).map(key => (
            <button
              key={key}
              onClick={() => loadDemo(key)}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/8 border border-white/15 text-white/70 hover:bg-white/15 hover:text-white transition-colors"
            >
              {DEMO_WALLETS[key].entity.split(" ")[0]} — {key}
            </button>
          ))}
        </div>

        {notFound && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-300 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            No on-chain credit profile found for this wallet. Try one of the demo profiles above.
          </div>
        )}
      </div>

      {/* Credit Profile Result */}
      {profile && (
        <div className="space-y-5 mb-8">
          {/* Header */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">On-Chain Entity</p>
                <h2 className="text-2xl font-heading font-bold text-white">{profile.entity}</h2>
                <p className="text-xs font-mono text-white/40 mt-1">{profile.wallet} · {profile.chain}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {profile.flags.length === 0
                  ? <Badge className="bg-emerald-400/20 text-emerald-300 border-emerald-400/30"><CheckCircle2 className="w-3 h-3 mr-1" />No Flags</Badge>
                  : <Badge className="bg-red-400/20 text-red-300 border-red-400/30"><AlertTriangle className="w-3 h-3 mr-1" />{profile.flags.length} Flag(s)</Badge>
                }
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Moody's Score */}
              <div className="bg-black/20 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-400/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Moody's On-Chain</span>
                </div>
                <div className={`text-5xl font-heading font-black bg-gradient-to-r ${SCORE_BG(profile.moodys.score)} bg-clip-text text-transparent mb-1`}>
                  {profile.moodys.score}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-2xl font-heading font-bold ${GRADE_COLORS[profile.moodys.grade] || "text-white"}`}>{profile.moodys.grade}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${OUTLOOK_COLORS[profile.moodys.outlook] || "bg-white/10 text-white/60"}`}>{profile.moodys.outlook}</span>
                </div>
                <p className="text-xs text-white/40 mt-2">Last updated {profile.moodys.lastUpdated}</p>
              </div>

              {/* D&B Score */}
              <div className="bg-black/20 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">D&B (Projected)</span>
                  <span className="text-[9px] bg-amber-400/10 text-amber-400/70 border border-amber-400/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Hypothetical</span>
                </div>
                <div className={`text-5xl font-heading font-black bg-gradient-to-r ${SCORE_BG(profile.dnb.paydexScore)} bg-clip-text text-transparent mb-1`}>
                  {profile.dnb.paydexScore}
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">DUNS</span>
                    <span className="text-white font-mono text-xs">{profile.dnb.duns}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Risk Rating</span>
                    <span className="text-white">{profile.dnb.riskScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Credit Limit</span>
                    <span className="text-white font-semibold">{profile.dnb.creditLimit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* On-Chain Metrics */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-heading font-bold text-white mb-4">On-Chain Activity Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(profile.onChainMetrics).map(([key, val]) => (
                <div key={key} className="bg-black/20 rounded-xl p-3 border border-white/8">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-sm font-semibold text-white">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flags */}
          {profile.flags.length > 0 && (
            <div className="bg-red-400/5 border border-red-400/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-300 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Risk Flags</p>
              {profile.flags.map((flag, i) => (
                <p key={i} className="text-sm text-red-300/80">• {flag}</p>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Credit Summary</p>
            <p className="text-sm text-white/80">{profile.summary}</p>
          </div>

          {/* AI Analysis */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-400/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <p className="text-sm font-heading font-bold text-white">AI Credit Analysis</p>
                  <p className="text-xs text-white/40">Lending recommendations & improvement steps</p>
                </div>
              </div>
              <Button size="sm" onClick={getAIAnalysis} disabled={aiLoading} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                {aiLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />Analyzing...</> : <><Sparkles className="w-3.5 h-3.5 mr-1" />Analyze</>}
              </Button>
            </div>
            {aiAnalysis && (
              <div className="bg-black/20 rounded-xl p-4 border border-white/8">
                <ReactMarkdown className="prose prose-sm max-w-none prose-invert prose-headings:text-white prose-p:text-white/75 prose-li:text-white/70 prose-strong:text-white [&>*:first-child]:mt-0">
                  {aiAnalysis}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resources */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-heading font-bold text-white mb-4">Further Reading</h3>
        <div className="space-y-2">
          {[
            { label: "Moody's Blockchain Credit Rating Announcement (2026)", url: "https://www.moodys.com" },
            { label: "Solana Foundation — Institutional Adoption", url: "https://solana.org" },
            { label: "D&B Business Credit Overview", url: "https://www.dnb.com/products/small-business/business-credit.html" },
            { label: "DeFi Lending Protocols — Maple Finance, Goldfinch", url: "https://mapledirect.com" },
          ].map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group">
              <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-accent flex-shrink-0" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}