import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import {
  FileText, ExternalLink, ChevronDown, ChevronUp, Sparkles,
  Loader2, AlertTriangle, ShieldCheck, Calculator, Globe, Info
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const IRS_RULES = [
  {
    pub: "IRS Notice 2014-21",
    title: "Virtual Currency is Property",
    desc: "The IRS treats all cryptocurrency as property — not currency. Every taxable event (sale, trade, payment) triggers capital gains or losses.",
    color: "text-blue-300", bg: "bg-blue-400/10",
  },
  {
    pub: "IRS Rev. Rul. 2019-24",
    title: "Hard Forks & Airdrops",
    desc: "Tokens received from hard forks or airdrops are taxable as ordinary income at fair market value on the date received.",
    color: "text-amber-300", bg: "bg-amber-400/10",
  },
  {
    pub: "Form 1040 — Schedule D",
    title: "Capital Gains Reporting",
    desc: "Short-term gains (held <1 year) taxed as ordinary income. Long-term gains (held >1 year) qualify for 0%, 15%, or 20% preferential rates.",
    color: "text-emerald-300", bg: "bg-emerald-400/10",
  },
  {
    pub: "Form 8949",
    title: "Crypto Transaction Detail",
    desc: "Each crypto sale, swap, or trade must be reported on Form 8949 with date acquired, date sold, proceeds, and cost basis.",
    color: "text-violet-300", bg: "bg-violet-400/10",
  },
  {
    pub: "IRS Form 1099-DA (2025+)",
    title: "Broker Reporting Mandate",
    desc: "Starting 2025, crypto brokers and exchanges must issue Form 1099-DA to the IRS and taxpayers — similar to stock brokers reporting 1099-B.",
    color: "text-red-300", bg: "bg-red-400/10",
  },
  {
    pub: "Staking & DeFi Income",
    title: "Ordinary Income Events",
    desc: "Staking rewards, yield farming income, liquidity pool fees, and DeFi interest are taxable as ordinary income when received.",
    color: "text-cyan-300", bg: "bg-cyan-400/10",
  },
  {
    pub: "Business Crypto Payments",
    title: "W-2 & 1099 Obligations",
    desc: "Paying employees in crypto triggers W-2 withholding requirements. Contractor payments over $600 in crypto require a 1099-NEC.",
    color: "text-orange-300", bg: "bg-orange-400/10",
  },
  {
    pub: "FBAR / FinCEN 114",
    title: "Foreign Exchange Reporting",
    desc: "If you hold crypto on a foreign exchange with aggregate value over $10,000 at any point in the year, FBAR filing may be required.",
    color: "text-pink-300", bg: "bg-pink-400/10",
  },
];

const TAX_SERVICES = [
  {
    name: "Koinly",
    badge: "Most Popular",
    badgeColor: "bg-emerald-400/20 text-emerald-300",
    desc: "Supports 700+ exchanges and wallets. Generates IRS Form 8949, Schedule D, and TurboTax-compatible files. Excellent Solana & DeFi support.",
    features: ["IRS Form 8949 & Schedule D", "DeFi & staking tracking", "Solana / NFT support", "TurboTax / H&R Block export"],
    url: "https://koinly.io",
    pricing: "Free up to 25 txns · $49–$179/yr",
    color: "border-emerald-400/30",
  },
  {
    name: "CoinTracker",
    badge: "TurboTax Partner",
    badgeColor: "bg-blue-400/20 text-blue-300",
    desc: "Official TurboTax partner. Real-time portfolio tracking plus automated tax reports. Best for users already on TurboTax.",
    features: ["TurboTax direct integration", "Real-time portfolio sync", "Automatic gain/loss calc", "500+ exchange support"],
    url: "https://www.cointracker.io",
    pricing: "Free · $59–$199/yr",
    color: "border-blue-400/30",
  },
  {
    name: "TaxBit",
    badge: "Enterprise Ready",
    badgeColor: "bg-violet-400/20 text-violet-300",
    desc: "Used by major exchanges (Coinbase, FTX) and enterprise clients. IRS-compliant reports with SOC 2 audited infrastructure.",
    features: ["SOC 2 Type II certified", "Exchange API integrations", "1099-DA readiness", "Enterprise & CPA tools"],
    url: "https://taxbit.com",
    pricing: "Free basic · Business plans",
    color: "border-violet-400/30",
  },
  {
    name: "TokenTax",
    badge: "CPA-Grade",
    badgeColor: "bg-amber-400/20 text-amber-300",
    desc: "Full-service crypto tax filing. Offers CPA-assisted returns for complex DeFi, NFT, and DAO situations. Handles international cases.",
    features: ["CPA-assisted filing option", "DeFi & NFT expertise", "DAO tax guidance", "IRS audit support"],
    url: "https://tokentax.co",
    pricing: "$65–$2,500+ (full-service available)",
    color: "border-amber-400/30",
  },
  {
    name: "ZenLedger",
    badge: "CPA Network",
    badgeColor: "bg-cyan-400/20 text-cyan-300",
    desc: "Connects with a network of crypto-specialized CPAs. Supports 400+ exchanges, DeFi protocols, and NFT platforms.",
    features: ["Built-in CPA marketplace", "Tax-loss harvesting tool", "400+ exchanges", "IRS audit trail"],
    url: "https://zenledger.io",
    pricing: "$49–$999/yr",
    color: "border-cyan-400/30",
  },
  {
    name: "H&R Block Crypto",
    badge: "Mainstream",
    badgeColor: "bg-red-400/20 text-red-300",
    desc: "H&R Block now supports crypto reporting natively. Good for users who want in-person CPA assistance plus crypto-aware filing.",
    features: ["In-person CPA option", "Coinbase / exchange import", "Simple reporting UI", "Familiar brand trust"],
    url: "https://www.hrblock.com/tax-center/filing/assets/cryptocurrency-taxes/",
    pricing: "Bundled with tax filing plans",
    color: "border-red-400/30",
  },
];

const SCENARIOS = [
  "I sold Bitcoin for a profit — how do I report this?",
  "I earn staking rewards on Solana — is that taxable income?",
  "My business pays contractors in USDC — what forms do I need?",
  "I received an airdrop — do I owe taxes immediately?",
  "I swapped ETH for USDC — is that a taxable event?",
  "What records do I need to keep for crypto transactions?",
];

export default function CryptoTax() {
  const [expanded, setExpanded] = useState({});
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const askAI = async (q) => {
    const question = q || query;
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a US crypto tax expert with deep knowledge of IRS guidance, Form 8949, Schedule D, 1099-DA, and crypto tax laws. Answer the following question with accurate, practical, IRS-compliant advice. Cite specific IRS forms, publications, or rulings where relevant. Be clear about what is a taxable event vs. non-taxable. Mention relevant crypto tax software if helpful.

IMPORTANT: Always recommend consulting a CPA or tax professional for individual situations.

Question: ${question}`,
      add_context_from_internet: true,
    });
    setAnswer(result);
    setLoading(false);
    setQuery(question);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeroBanner
        icon="🧾"
        eyebrow="IRS Compliance & Crypto Tax"
        title="Crypto Tax Center"
        subtitle="IRS rules, reporting requirements, and the best crypto tax software — all in one place for small businesses, DeFi participants, and individual filers."
        tags={["IRS Compliant", "Form 8949", "1099-DA", "DeFi", "Staking", "Business Payroll"]}
      />

      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-3 bg-amber-400/10 border border-amber-400/30 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/60">
          <span className="font-semibold text-amber-300">Not tax advice.</span> This page provides educational information only. Always consult a qualified CPA or enrolled agent for your specific situation. Tax laws change frequently — verify with IRS.gov.
        </p>
      </div>

      {/* IRS Rules Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" /> IRS Crypto Tax Rules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {IRS_RULES.map((rule) => (
            <div key={rule.pub} className={`bg-white/5 border border-white/10 rounded-xl p-4`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${rule.bg} ${rule.color}`}>
                  {rule.pub.split(" ").slice(0, 2).join(" ")}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${rule.color} mb-1`}>{rule.title}</p>
                  <p className="text-xs text-white/55 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <a
          href="https://www.irs.gov/businesses/small-businesses-self-employed/virtual-currencies"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-xs text-accent hover:text-accent/80 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View full IRS Virtual Currency guidance on IRS.gov
        </a>
      </div>

      {/* Tax Services */}
      <div className="mb-8">
        <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-accent" /> Crypto Tax Software
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TAX_SERVICES.map((svc) => (
            <div key={svc.name} className={`bg-white/5 border ${svc.color} rounded-xl p-5`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading font-bold text-white">{svc.name}</h3>
                    <Badge className={`text-[10px] ${svc.badgeColor} border-0`}>{svc.badge}</Badge>
                  </div>
                  <p className="text-xs text-white/40">{svc.pricing}</p>
                </div>
                <a href={svc.url} target="_blank" rel="noopener noreferrer"
                  className="text-white/30 hover:text-accent transition-colors flex-shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-white/60 mb-3 leading-relaxed">{svc.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {svc.features.map(f => (
                  <span key={f} className="text-[10px] bg-white/8 border border-white/10 text-white/55 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Tax Q&A */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-400/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white">Ask the Crypto Tax Advisor</h3>
            <p className="text-xs text-white/45">IRS-informed answers on crypto reporting, DeFi taxes, and business compliance</p>
          </div>
        </div>

        {/* Quick scenario buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SCENARIOS.map(s => (
            <button key={s} onClick={() => askAI(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-white/60 hover:bg-white/15 hover:text-white transition-colors text-left">
              {s}
            </button>
          ))}
        </div>

        <Textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. How do I report Solana staking rewards? What's the tax treatment of DeFi liquidity pool rewards?"
          className="min-h-[80px] resize-none mb-3 bg-white/5 border-white/15 text-white placeholder:text-white/30"
        />
        <Button onClick={() => askAI()} disabled={!query.trim() || loading} className="w-full sm:w-auto">
          {loading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
            : <><Sparkles className="w-4 h-4 mr-2" />Get Tax Guidance</>}
        </Button>

        {answer && (
          <div className="mt-5 p-4 rounded-xl bg-black/20 border border-white/10">
            <ReactMarkdown className="prose prose-sm max-w-none prose-invert prose-headings:text-white prose-p:text-white/75 prose-li:text-white/70 prose-strong:text-white [&>*:first-child]:mt-0">
              {answer}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}