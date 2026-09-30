import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import { Link } from "react-router-dom";
import {
  Coins, Globe, Building2, Users, ShieldCheck, Zap, ExternalLink,
  ChevronDown, ChevronUp, Sparkles, Loader2, TrendingUp,
  BookOpen, FileCode2, Wallet, Network, Image as ImageIcon, Boxes, PieChart, GraduationCap
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
    id: "fundamentals",
    icon: BookOpen,
    color: "from-sky-600/10 to-cyan-500/10",
    iconBg: "bg-sky-600/10 text-sky-400",
    title: "Blockchain Fundamentals — The New Digital Economy",
    summary: "Understand the core technology behind Web3: distributed ledgers, consensus mechanisms, blocks, nodes, and why blockchain is reshaping finance, supply chains, and ownership.",
    points: [
      "A blockchain is a shared, immutable ledger replicated across a network of computers (nodes)",
      "Blocks are chained via cryptographic hashes — altering one block invalidates every block after it",
      "Consensus mechanisms: Proof of Work (Bitcoin), Proof of Stake (Ethereum, Solana, Cardano)",
      "Public chains (Ethereum, Solana) vs permissioned/consortium chains (Hyperledger, Quorum)",
      "Layer 1 (base chain) vs Layer 2 (rollups like Arbitrum, Optimism, Base) for scaling",
      "Gas fees = transaction costs paid to validators for processing operations on-chain",
      "Block explorers (Etherscan, Solscan) let anyone audit transactions transparently",
    ],
    links: [
      { label: "Ethereum.org — Learn the Basics", url: "https://ethereum.org/learn" },
      { label: "Solana — What is Blockchain?", url: "https://solana.com/learn" },
      { label: "MIT OpenCourseWare — Blockchain & Money", url: "https://ocw.mit.edu/courses/15-s12-blockchain-and-money-fall-2018" },
    ]
  },
  {
    id: "smart_contracts",
    icon: FileCode2,
    color: "from-indigo-600/10 to-blue-500/10",
    iconBg: "bg-indigo-600/10 text-indigo-400",
    title: "Smart Contracts — Programmable Money",
    summary: "Self-executing code on the blockchain that automatically enforces agreements — no lawyers, no escrow agents. Smart contracts power DeFi, tokenization, DAOs, and automated business logic.",
    points: [
      "Code executes automatically when predefined conditions are met — trustless agreements",
      "Solidity (Ethereum), Rust (Solana), Move (Aptos/Sui) are the main smart contract languages",
      "Escrow without middlemen: funds release only when goods/services are confirmed delivered",
      "Automate recurring payments, revenue splits, royalties, and supplier payouts",
      "Immutable once deployed — upgrades require proxy patterns or new contract versions",
      "Auditing is critical: bugs can lock funds permanently (use OpenZeppelin, CertiK)",
      "Business use cases: insurance payouts, supply chain automation, token vesting, escrow",
    ],
    links: [
      { label: "Solidity by Example", url: "https://solidity-by-example.org" },
      { label: "OpenZeppelin Contracts Library", url: "https://openzeppelin.com/contracts" },
      { label: "Solana Smart Contracts (Solana Cookbook)", url: "https://solanacookbook.com" },
    ]
  },
  {
    id: "defi",
    icon: Network,
    color: "from-emerald-600/10 to-green-500/10",
    iconBg: "bg-emerald-600/10 text-emerald-400",
    title: "DeFi — Decentralized Finance",
    summary: "Open financial infrastructure — lending, borrowing, trading, and earning yield — without banks or brokerages. Accessible to anyone with an internet connection, 24/7.",
    points: [
      "Lending & borrowing: Aave, Compound — earn yield on stablecoins or borrow against crypto",
      "Decentralized exchanges (DEXs): Uniswap, Jupiter, Curve — trade without an order book",
      "Liquidity pools: users provide assets and earn trading fees in return",
      "Yield farming & staking: earn rewards for providing capital or validating transactions",
      "Flash loans: borrow millions with no collateral, repaid within a single transaction",
      "Oracles (Chainlink) feed real-world data (prices, rates) into DeFi smart contracts",
      "Risks: smart contract bugs, impermanent loss, depegging events, rug pulls",
    ],
    links: [
      { label: "Aave — Decentralized Lending", url: "https://aave.com" },
      { label: "Uniswap — DEX Protocol", url: "https://uniswap.org" },
      { label: "DeFi Llama — Track TVL Across Chains", url: "https://defillama.com" },
    ]
  },
  {
    id: "wallets",
    icon: Wallet,
    color: "from-amber-600/10 to-orange-500/10",
    iconBg: "bg-amber-600/10 text-amber-400",
    title: "Wallets & Custody — Self-Sovereign Ownership",
    summary: "A crypto wallet is your digital identity and bank account combined. Learn the difference between hot wallets, cold storage, seed phrases, and institutional custody solutions.",
    points: [
      "Self-custody = YOU control your keys ('not your keys, not your coins')",
      "Hot wallets (MetaMask, Phantom): connected to internet — convenient but less secure",
      "Cold wallets / hardware (Ledger, Trezor, GridPlus): offline — highest security for large holdings",
      "Seed phrase (12–24 words) is the master key — store offline, never share, never type online",
      "Multi-sig (Gnosis Safe): requires multiple approvals to move funds — ideal for business treasury",
      "Institutional custody: Coinbase Prime, Fireblocks, BitGo — regulated, insured, API-driven",
      "Wallet security: enable 2FA on exchange accounts, verify addresses, beware phishing",
    ],
    links: [
      { label: "MetaMask — Ethereum Wallet", url: "https://metamask.io" },
      { label: "Ledger — Hardware Wallet", url: "https://www.ledger.com" },
      { label: "Fireblocks — Enterprise Custody", url: "https://www.fireblocks.com" },
    ]
  },
  {
    id: "nfts",
    icon: ImageIcon,
    color: "from-pink-600/10 to-fuchsia-500/10",
    iconBg: "bg-pink-600/10 text-pink-400",
    title: "NFTs & Digital Assets — Beyond JPEGs",
    summary: "Non-fungible tokens prove verifiable ownership of unique digital and physical assets — from real estate titles and event tickets to membership passes and IP licensing.",
    points: [
      "NFTs are unique, indivisible tokens — unlike fungible crypto (each Bitcoin is identical)",
      "Tokenize: event tickets, memberships, music royalties, art, patents, and certificates",
      "Soulbound tokens (SBTs): non-transferable NFTs for credentials, diplomas, and reputation",
      "Royalties: creators earn automatic resale royalties coded into the smart contract",
      "Standards: ERC-721, ERC-1155 (semi-fungible), Solana Metaplex",
      "Marketplaces: OpenSea, Magic Eden, Blur, Rarible",
      "Business use: loyalty programs, supply chain provenance, event ticketing, credentialing",
    ],
    links: [
      { label: "OpenSea — NFT Marketplace", url: "https://opensea.io" },
      { label: "Magic Eden — Multi-chain NFT", url: "https://magiceden.io" },
      { label: "Metaplex — Solana NFT Standard", url: "https://www.metaplex.com" },
    ]
  },
  {
    id: "daos",
    icon: Boxes,
    color: "from-violet-600/10 to-purple-500/10",
    iconBg: "bg-violet-600/10 text-violet-400",
    title: "DAOs — Decentralized Autonomous Organizations",
    summary: "Member-owned communities governed by smart contracts and token voting — no CEO, no board. DAOs manage treasuries, make collective decisions, and coordinate global teams.",
    points: [
      "Members hold governance tokens that grant voting power proportional to holdings",
      "Proposals are submitted on-chain and executed automatically when approved by majority",
      "Wyoming became the first US state to legally recognize DAOs as LLCs (2021)",
      "Treasury management: DAOs often hold millions in stablecoins and governance tokens",
      "Tools: Snapshot (off-chain voting), Tally (on-chain governance), Aragon, DAOstack",
      "Business models: investment DAOs, grant DAOs, collector DAOs, protocol DAOs",
      "Legal wrapper: Wyoming DAO LLC or DUNA (Decentralized Unincorporated Nonprofit Association)",
    ],
    links: [
      { label: "Aragon — Build a DAO", url: "https://aragon.org" },
      { label: "Snapshot — Governance Voting", url: "https://snapshot.org" },
      { label: "DeepDAO — DAO Analytics", url: "https://deepdao.io" },
    ]
  },
  {
    id: "tokenomics",
    icon: PieChart,
    color: "from-teal-600/10 to-cyan-500/10",
    iconBg: "bg-teal-600/10 text-teal-400",
    title: "Tokenomics & Token Types — Designing Digital Assets",
    summary: "Not all tokens are the same. Learn the difference between utility, governance, payment, and security tokens — and how tokenomics (supply, distribution, incentives) drives value.",
    points: [
      "Utility tokens: access a product or service (e.g., ETH pays for Ethereum gas)",
      "Governance tokens: voting rights in a DAO or protocol (UNI, COMP, AAVE)",
      "Security tokens: regulated investment contracts representing equity or debt (Howey Test)",
      "Stablecoins: pegged to fiat — USDC (USD), DAI (crypto-collateralized), USDT",
      "CBDCs: Central Bank Digital Currencies — FedNow, digital dollar exploration",
      "Tokenomics: max supply, circulating supply, inflation rate, vesting schedules, burn mechanisms",
      "SAFTs (Simple Agreement for Future Tokens) — compliant fundraising structure",
    ],
    links: [
      { label: "CoinGecko — Token Data & Market Cap", url: "https://www.coingecko.com" },
      { label: "Token Terminal — On-chain Analytics", url: "https://www.tokenterminal.com" },
      { label: "SEC Howey Test — Investment Contracts", url: "https://www.sec.gov/corpfin/framework-investment-contract-analysis-higgins" },
    ]
  },
  {
    id: "web3_careers",
    icon: GraduationCap,
    color: "from-blue-600/10 to-sky-500/10",
    iconBg: "bg-blue-600/10 text-blue-400",
    title: "Web3 Careers & Skills — Building the Future",
    summary: "The digital economy is creating new jobs that didn't exist a decade ago. Learn the skills, certifications, and learning paths to build a career in blockchain and Web3.",
    points: [
      "Developer roles: Solidity/Rust smart contract engineers, full-stack Web3 developers",
      "Non-technical roles: community management, tokenomics design, governance strategy",
      "In-demand skills: Solidity, Rust, React, IPFS, The Graph, Chainlink integrations",
      "Certifications: CKB (Certified Kubernetes... ) — actually: CEA (Certified Ethereum Associate), ConsenSys Academy",
      "Learn for free: CryptoZombies, Buildspace, thirdweb, LearnWeb3DAO",
      "Hackathons: ETHGlobal, Solana Breakpoint, Solana Hacker Houses — paid bounties",
      "Earn while learning: Gitcoin bounties, Dework, Layer3 quests",
    ],
    links: [
      { label: "CryptoZombies — Learn Solidity", url: "https://cryptozombies.io" },
      { label: "thirdweb — Build Web3 Apps", url: "https://thirdweb.com" },
      { label: "LearnWeb3DAO — Free Tracks", url: "https://learnweb3.io" },
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
        subtitle="Master the new digital economy — from blockchain fundamentals and smart contracts to DeFi, tokenization, DAOs, and crypto careers — alongside practical tools for your business."
        tags={["Blockchain 101", "Smart Contracts", "DeFi", "RWA Tokenization", "Stablecoin Payroll", "DAOs", "Tokenomics", "Web3 Careers", "FIT21 Compliant"]}
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