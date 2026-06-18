import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import { Link } from "react-router-dom";
import {
  Coins, Globe, Building2, Users, ShieldCheck, Zap, ExternalLink,
  ChevronDown, ChevronUp, Sparkles, Loader2, TrendingUp
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const SECTIONS = [
  {
    id: "rwa",
    icon: Building2,
    color: "from-amber-600/10 to-yellow-500/10",
    iconBg: "bg-amber-600/10 text-amber-600",
    title: "Real World Asset (RWA) Tokenization",
    summary: "Convert physical and financial assets — real estate, equipment, invoices, inventory — into blockchain tokens for fractional ownership, faster settlement, and access to global liquidity pools.",
    points: [
      "Tokenize commercial real estate, machinery, or IP for fractional investor access",
      "Convert accounts receivable and invoices into tradeable on-chain assets",
      "Access decentralized liquidity without traditional bank intermediaries",
      "Automate ownership transfers and royalties via smart contracts",
      "Platforms: Centrifuge, Maple Finance, Goldfinch, Ondo Finance",
    ],
    links: [
      { label: "Centrifuge — Invoice & Asset Tokenization", url: "https://centrifuge.io" },
      { label: "Maple Finance — On-chain Business Lending", url: "https://mapledirect.com" },
      { label: "Ondo Finance — Tokenized Treasuries", url: "https://ondo.finance" },
    ]
  },
  {
    id: "stablecoins",
    icon: Coins,
    color: "from-emerald-600/10 to-teal-500/10",
    iconBg: "bg-emerald-600/10 text-emerald-600",
    title: "Pay Employees & Vendors with Stablecoins",
    summary: "Use USD-pegged stablecoins (USDC, USDT, PYUSD) to pay domestic and international workers instantly, reduce wire fees, and improve cash flow management — all compliant with US labor law.",
    points: [
      "USDC & USDT payroll via Bitwage, Request Finance, or Deel Crypto",
      "Instant cross-border payments with near-zero fees vs wire transfers",
      "Workers receive stablecoins directly to self-custody wallets or exchanges",
      "Automate recurring payroll with on-chain smart contracts",
      "PayPal USD (PYUSD) now supported on Venmo for business payments",
      "IRS treats crypto payroll as W-2 wages — withholding still required",
    ],
    links: [
      { label: "Bitwage — Crypto Payroll Platform", url: "https://www.bitwage.com" },
      { label: "Request Finance — B2B Crypto Invoicing", url: "https://request.finance" },
      { label: "Deel — Global Crypto Payroll", url: "https://www.letsdeel.com" },
    ]
  },
  {
    id: "banking",
    icon: Building2,
    color: "from-blue-600/10 to-indigo-500/10",
    iconBg: "bg-blue-600/10 text-blue-600",
    title: "Crypto-Friendly Business Banking",
    summary: "New-generation banks and neobanks support crypto on-ramps, stablecoin accounts, and blockchain-native treasury management alongside traditional FDIC-insured accounts.",
    points: [
      "Mercury, Relay, and Brex support crypto-adjacent business banking",
      "Silvergate (legacy) → Now: Customers Bank & Cross River Bank for crypto businesses",
      "Circle's USDC Business Accounts for stablecoin treasury management",
      "On-chain multi-sig treasury tools: Gnosis Safe, Coinbase Prime",
      "Bridge.xyz for stablecoin-to-USD instant conversion API",
      "Ensure AML/KYC compliance with FinCEN Money Services Business registration",
    ],
    links: [
      { label: "Circle Business Account (USDC)", url: "https://www.circle.com/business" },
      { label: "Bridge.xyz — Stablecoin Infrastructure", url: "https://www.bridge.xyz" },
      { label: "Gnosis Safe — Multi-sig Treasury", url: "https://safe.global" },
    ]
  },
  {
    id: "grants",
    icon: Zap,
    color: "from-violet-600/10 to-purple-500/10",
    iconBg: "bg-violet-600/10 text-violet-600",
    title: "Web3 & Blockchain Grants",
    summary: "Dozens of blockchain foundations, DAOs, and federal programs fund Web3 innovation, DeFi infrastructure, and blockchain-for-good initiatives. Many offer non-dilutive capital.",
    points: [
      "Ethereum Foundation — developer grants for open-source blockchain tools",
      "Solana Foundation Grants — $1M+ available for ecosystem projects",
      "Polkadot Treasury — on-chain governance grants for parachain builders",
      "NSF Small Business Innovation Research (SBIR) accepts blockchain/DeFi proposals",
      "EDA Build to Scale — includes digital asset and fintech startups",
      "USDC Grants via Circle Impact for financial inclusion projects",
      "Coinbase Ventures & a16z Crypto for equity + grant hybrids",
    ],
    links: [
      { label: "Ethereum Foundation Grants", url: "https://ethereum.foundation/grants" },
      { label: "Solana Foundation Grants", url: "https://solana.org/grants" },
      { label: "NSF SBIR — Blockchain/Fintech", url: "https://seedfund.nsf.gov" },
    ]
  },
  {
    id: "onchain_credit",
    icon: TrendingUp,
    color: "from-blue-500/20 to-indigo-500/20",
    iconBg: "bg-blue-400/20 text-blue-300",
    title: "On-Chain Credit Scores — Moody's & D&B (New 2026)",
    summary: "Moody's has initiated blockchain-native credit scoring on Solana. Dun & Bradstreet integration is projected to follow — transforming how small businesses access capital using their on-chain history.",
    points: [
      "Moody's launched on-chain credit scoring infrastructure on Solana in 2026",
      "Scores combine wallet age, transaction volume, DeFi interactions, and payment history",
      "Traditional letter grades (Aaa–C) now assigned to Solana wallet addresses",
      "D&B projected to link DUNS numbers to on-chain identities (hypothetical)",
      "DeFi lending protocols (Maple, Goldfinch) consume scores for instant credit decisions",
      "Small businesses can build credit history purely through on-chain activity",
      "SBA and CDFI lenders exploring API integration for underserved borrowers",
    ],
    links: [
      { label: "Try the On-Chain Credit Demo →", url: "/crypto-web3/credit" },
      { label: "Moody's Analytics", url: "https://www.moodys.com" },
      { label: "Solana Foundation", url: "https://solana.org" },
    ]
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    color: "from-red-600/10 to-rose-500/10",
    iconBg: "bg-red-600/10 text-red-600",
    title: "Compliance, Legal & US Regulations",
    summary: "Navigate the evolving US regulatory landscape for crypto businesses — from SEC/CFTC jurisdiction to state money transmitter licenses and the new FIT21 framework.",
    points: [
      "FIT21 Act (2024) — establishes CFTC vs SEC jurisdiction over digital assets",
      "FinCEN MSB registration required if transmitting crypto for others",
      "State-by-state Money Transmitter License (MTL) required in most states",
      "Wyoming DAO LLC & DUNA structure for legally recognized DAOs",
      "IRS Form 1099-DA (2025) — brokers must report digital asset transactions",
      "SAFTs and token warrants as compliant fundraising structures",
      "OFAC sanctions screening required for all international crypto transfers",
    ],
    links: [
      { label: "FinCEN Crypto Guidance", url: "https://www.fincen.gov/resources/statutes-and-regulations/guidance/application-fincens-regulations-persons-administering" },
      { label: "FIT21 Summary — Congressional Research", url: "https://crsreports.congress.gov" },
      { label: "Wyoming DAO LLC Structure", url: "https://sos.wyo.gov/Forms/WyoBiz/DAO/DAOInformation.aspx" },
    ]
  },
];

export default function CryptoWeb3() {
  const [expanded, setExpanded] = useState({});
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const askAI = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert in Web3, blockchain, DeFi, RWA tokenization, stablecoin payroll, and crypto regulations for US small businesses and startups. Answer the following question with practical, actionable advice. Include specific platforms, protocols, grant programs, or legal frameworks where relevant.\n\nQuestion: ${aiQuery}`,
      add_context_from_internet: true,
    });
    setAiResponse(result);
    setAiLoading(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeroBanner
        icon="🔗"
        eyebrow="Web3 Business Integration"
        title="Crypto, Web3 & Blockchain"
        subtitle="Tokenize real-world assets, pay staff with stablecoins, access Web3 grants, and navigate US crypto regulations — all in one place."
        tags={["RWA Tokenization", "Stablecoin Payroll", "DeFi Lending", "Web3 Grants", "FIT21 Compliant"]}
      />

      {/* Sections */}
      <div className="space-y-4 mb-10">
        {SECTIONS.map(section => (
          <div key={section.id} className={`rounded-xl border border-white/10 bg-gradient-to-br ${section.color} overflow-hidden`}>
            <button
              className="w-full flex items-center gap-4 p-5 text-left"
              onClick={() => toggle(section.id)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${section.iconBg}`}>
                <section.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold text-white">{section.title}</h3>
                <p className="text-sm text-white/55 mt-0.5 line-clamp-2">{section.summary}</p>
              </div>
              {expanded[section.id]
                ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
            </button>

            {expanded[section.id] && (
            <div className="px-5 pb-5 space-y-4 border-t border-white/10">
              <ul className="space-y-2 mt-4">
                {section.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/75">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                {section.links.map((link, i) => (
                  link.url.startsWith("/") ? (
                    <Link
                      key={i}
                      to={link.url}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/30 bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/60 border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )
                ))}
              </div>
            </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Q&A */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-400/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white">Ask the Web3 Advisor</h3>
            <p className="text-xs text-white/45">Get AI-powered answers on tokenization, stablecoin payroll, grants & compliance</p>
          </div>
        </div>
        <Textarea
          value={aiQuery}
          onChange={e => setAiQuery(e.target.value)}
          placeholder="e.g. How do I tokenize my commercial property as an RWA? What stablecoin is best for payroll? Which blockchain grants apply to my fintech startup?"
          className="min-h-[80px] resize-none mb-3"
        />
        <Button onClick={askAI} disabled={!aiQuery.trim() || aiLoading} className="w-full sm:w-auto">
          {aiLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" /> Get Web3 Guidance</>}
        </Button>
        {aiResponse && (
          <div className="mt-5 p-4 rounded-xl bg-black/20 border border-white/10">
            <ReactMarkdown className="prose prose-sm max-w-none prose-invert prose-p:text-white/75 prose-li:text-white/70 prose-strong:text-white [&>*:first-child]:mt-0">
              {aiResponse}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}