import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, ExternalLink, DollarSign, Calendar, Building2, Filter } from "lucide-react";
import { motion } from "framer-motion";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

const CATEGORIES = ["All", "Small Business", "Women-Owned", "Veteran-Owned", "Minority-Owned", "Rural", "Technology", "Manufacturing", "Agriculture"];

const SAMPLE_GRANTS = [
  { title: "SBA Small Business Innovation Research (SBIR)", agency: "Small Business Administration", amount: "$50K–$2M", deadline: "Rolling", category: "Small Business", description: "Federal R&D funding for small businesses to develop innovative tech solutions with commercialization potential.", url: "https://www.sbir.gov" },
  { title: "USDA Rural Business Development Grant", agency: "Dept. of Agriculture", amount: "Up to $500K", deadline: "Q1 2026", category: "Rural", description: "Supports technical assistance and training programs for small rural businesses with fewer than 50 employees.", url: "https://www.rd.usda.gov" },
  { title: "EDA Build to Scale Program", agency: "Economic Development Admin", amount: "Up to $3M", deadline: "June 2026", category: "Technology", description: "Accelerates regional entrepreneurship ecosystems focused on scalable, innovation-driven businesses.", url: "https://eda.gov" },
  { title: "Women's Business Centers Grant", agency: "Small Business Administration", amount: "$150K–$250K/yr", deadline: "Rolling", category: "Women-Owned", description: "Funds nonprofit orgs providing business training and counseling to women entrepreneurs.", url: "https://www.sba.gov/business-guide/grow-your-business/women-owned-businesses" },
  { title: "Boots to Business Reboot", agency: "SBA / DoD Transition", amount: "Free Program", deadline: "Rolling", category: "Veteran-Owned", description: "Entrepreneurship education and mentorship for veterans and military spouses transitioning to small business ownership.", url: "https://sbavets.force.com/s/" },
  { title: "Manufacturing Extension Partnership (MEP)", agency: "NIST / Dept. of Commerce", amount: "Matching Grants", deadline: "Ongoing", category: "Manufacturing", description: "Technical assistance and innovation funding to help small and mid-sized U.S. manufacturers compete globally.", url: "https://www.nist.gov/mep" },
  { title: "Minority Business Development Agency Grants", agency: "Dept. of Commerce MBDA", amount: "Varies", deadline: "Q2 2026", category: "Minority-Owned", description: "Grants and technical assistance for minority-owned firms seeking capital access and market expansion.", url: "https://www.mbda.gov" },
  { title: "Farm Service Agency Microloans", agency: "Dept. of Agriculture FSA", amount: "Up to $50K", deadline: "Rolling", category: "Agriculture", description: "Low-barrier microloans for new, small, and beginning farmers and ranchers.", url: "https://www.fsa.usda.gov" },
];

export default function GrantsFinder() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [aiSearch, setAiSearch] = useState("");
  const [aiResults, setAiResults] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = SAMPLE_GRANTS.filter(g => {
    const matchCat = category === "All" || g.category === category;
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAiSearch = async () => {
    if (!aiSearch.trim()) return;
    setAiLoading(true);
    setAiResults("");
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a federal grants expert. A small business owner described their business as: "${aiSearch}". 
      
List the top 5–7 most relevant federal grants, SBA programs, and government funding opportunities for this specific business. For each:
- Program name and administering agency
- Funding amount range
- Who qualifies
- Application URL or where to apply
- 1-sentence why it's a great fit for their business

Format as clear markdown with headers per grant. Be specific and actionable.`,
      add_context_from_internet: true,
    });
    setAiResults(result);
    setAiLoading(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeroBanner
        icon="🔎"
        eyebrow="Federal Funding"
        title="Federal Grants Finder"
        subtitle="Discover SAM.gov, USASpending, Grants.gov, and SBA programs tailored to your business."
        tags={["SBIR", "EDA", "USDA", "AI Matched"]}
      />

      {/* AI-Powered Search */}
      <div className="bg-gradient-to-r from-primary/5 to-blue-600/5 border border-primary/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🤖</span>
          <h2 className="font-semibold text-foreground">AI Grant Matcher</h2>
          <Badge className="bg-accent/20 text-amber-700 text-xs">Powered by AI</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Describe your business and we'll find the best-fit federal grants for you.</p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Women-owned bakery in rural Alabama looking for startup capital..."
            value={aiSearch}
            onChange={e => setAiSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAiSearch()}
            className="flex-1"
          />
          <Button onClick={handleAiSearch} disabled={aiLoading || !aiSearch.trim()}>
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        {aiLoading && <p className="text-sm text-muted-foreground mt-3 animate-pulse">Searching federal databases...</p>}
        {aiResults && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-headings:font-semibold prose-p:text-muted-foreground prose-li:text-muted-foreground">
            <ReactMarkdownLite content={aiResults} />
          </div>
        )}
      </div>

      {/* Browse Directory */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search grants..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((grant, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground">{grant.title}</h3>
                  <Badge variant="outline" className="text-xs">{grant.category}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{grant.agency}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{grant.amount}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{grant.deadline}</span>
                </div>
                <p className="text-sm text-muted-foreground">{grant.description}</p>
              </div>
              <a href={grant.url} target="_blank" rel="noopener noreferrer">
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

function ReactMarkdownLite({ content }) {
  return <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground">{content}</pre>;
}