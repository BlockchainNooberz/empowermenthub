import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, DollarSign, Star, ExternalLink, Phone, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

const LENDERS = [
  { name: "Accion Opportunity Fund", type: "CDFI", states: "Nationwide", minLoan: 5000, maxLoan: 250000, focus: ["Minority-Owned", "Women-Owned", "Startups"], rating: 4.8, description: "Mission-driven CDFI offering affordable small business loans to underserved entrepreneurs.", url: "https://www.accionopportunityfund.org", phone: "1-800-606-2811" },
  { name: "Kiva U.S.", type: "Microlender", states: "Nationwide", minLoan: 1000, maxLoan: 15000, focus: ["Micro-Business", "Startups", "Underserved"], rating: 4.7, description: "0% interest crowdfunded microloans for small businesses that can't access traditional credit.", url: "https://www.kiva.org/borrow", phone: "N/A (online)" },
  { name: "CDC Small Business Finance", type: "SBA 504 Lender", states: "CA, AZ, NV, OR", minLoan: 125000, maxLoan: 20000000, focus: ["Real Estate", "Equipment", "Manufacturing"], rating: 4.6, description: "One of the nation's top SBA 504 lenders for commercial real estate and heavy equipment purchases.", url: "https://cdcloans.com", phone: "1-619-291-3594" },
  { name: "LiftFund", type: "CDFI Microlender", states: "TX, AL, AR, FL, GA, KY, LA, MO, NM, OK, SC, TN", minLoan: 500, maxLoan: 1000000, focus: ["Latino-Owned", "Women-Owned", "Rural"], rating: 4.5, description: "Serving entrepreneurs in underserved communities across the South and Southwest.", url: "https://www.liftfund.com", phone: "1-888-215-2373" },
  { name: "Opportunity Finance Network", type: "CDFI Network", states: "Nationwide", minLoan: 10000, maxLoan: 5000000, focus: ["Low-Income Communities", "Minority-Owned", "Housing"], rating: 4.9, description: "National network of CDFIs delivering responsible, affordable lending to low-income communities.", url: "https://ofn.org", phone: "1-215-923-4754" },
  { name: "SBA Microloan Program (via intermediaries)", type: "SBA Program", states: "Nationwide", minLoan: 500, maxLoan: 50000, focus: ["Startups", "Nonprofits", "Women", "Veterans"], rating: 4.7, description: "SBA-backed microloans delivered through local nonprofit intermediary lenders with training support.", url: "https://www.sba.gov/funding-programs/loans/microloans", phone: "1-800-827-5722" },
  { name: "Community Reinvestment Fund (CRF)", type: "CDFI", states: "Nationwide", minLoan: 50000, maxLoan: 500000, focus: ["Small Business", "Community Development"], rating: 4.4, description: "Flexible SBA and USDA loan products for small businesses in low-to-moderate income communities.", url: "https://www.crfusa.com", phone: "1-800-475-3050" },
];

const FOCUS_FILTERS = ["All", "Minority-Owned", "Women-Owned", "Veterans", "Startups", "Rural", "Micro-Business"];

export default function LenderMarketplace() {
  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState("All");
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchDesc, setMatchDesc] = useState("");
  const [matchResults, setMatchResults] = useState("");

  const filtered = LENDERS.filter(l => {
    const matchFocus = focus === "All" || l.focus.some(f => f.includes(focus.replace("-Owned", "")));
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase());
    return matchFocus && matchSearch;
  });

  const handleMatch = async () => {
    if (!matchDesc.trim()) return;
    setMatchLoading(true);
    setMatchResults("");
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert lending advisor. A small business owner described their situation: "${matchDesc}"

From this list of lenders and programs, recommend the top 3 best fits with specific reasoning:
${LENDERS.map(l => `- ${l.name} (${l.type}): $${l.minLoan.toLocaleString()}–$${l.maxLoan.toLocaleString()}, Focus: ${l.focus.join(", ")}`).join("\n")}

Also suggest any additional SBA programs or CDFIs not listed that might be a great fit. Be specific about why each is recommended for their situation.`,
    });
    setMatchResults(result);
    setMatchLoading(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeroBanner
        icon="💵"
        eyebrow="Capital Access"
        title="Lender Marketplace"
        subtitle="Vetted CDFIs, SBA lenders, and mission-driven financial institutions ready to fund American small businesses."
        tags={["CDFIs", "SBA Lenders", "Free Matching", "Nationwide"]}
      />

      {/* AI Matcher */}
      <div className="bg-gradient-to-r from-emerald-600/5 to-teal-600/5 border border-emerald-200 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h2 className="font-semibold">Find My Best Lender Match</h2>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Veteran-owned auto repair shop in rural Ohio, need $40K for equipment..."
            value={matchDesc}
            onChange={e => setMatchDesc(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleMatch()}
            className="flex-1"
          />
          <Button onClick={handleMatch} disabled={matchLoading || !matchDesc.trim()} className="bg-emerald-600 hover:bg-emerald-700">
            {matchLoading ? "Matching..." : "Match Me"}
          </Button>
        </div>
        {matchResults && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border">
            <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground">{matchResults}</pre>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search lenders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {FOCUS_FILTERS.map(f => (
          <button key={f} onClick={() => setFocus(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${focus === f ? "bg-emerald-600 text-white border-emerald-600" : "bg-background text-muted-foreground border-border hover:border-emerald-400"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((lender, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground">{lender.name}</h3>
                  <Badge className="bg-primary/10 text-primary text-xs">{lender.type}</Badge>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-muted-foreground">{lender.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lender.states}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${lender.minLoan.toLocaleString()}–${lender.maxLoan.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lender.phone}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{lender.description}</p>
                <div className="flex flex-wrap gap-1">
                  {lender.focus.map(f => (
                    <span key={f} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{f}</span>
                  ))}
                </div>
              </div>
              <a href={lender.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  Apply <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}