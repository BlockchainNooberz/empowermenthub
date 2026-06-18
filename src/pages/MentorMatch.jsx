import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, Award, MessageSquare, Loader2, Users } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";

const MENTORS = [
  { name: "SCORE Mentors", org: "SCORE National Network", type: "SCORE", expertise: ["Business Planning", "Finance", "Marketing", "Operations"], locations: "500+ chapters nationwide", free: true, description: "Experienced volunteers (retired & active executives) offering free, confidential business mentoring.", url: "https://www.score.org/find-mentor", availability: "In-person & virtual" },
  { name: "SBDC Business Advisors", org: "America's SBDC", type: "SBDC", expertise: ["SBA Loans", "Business Plans", "Market Research", "Export"], locations: "1,000+ centers nationwide", free: true, description: "Professional advisors at Small Business Development Centers offering no-cost consulting to entrepreneurs.", url: "https://www.americassbdc.org/find-your-sbdc/", availability: "In-person & virtual" },
  { name: "Women's Business Centers", org: "SBA WBC Program", type: "WBC", expertise: ["Women-Owned Business", "Funding", "Networking", "Leadership"], locations: "100+ centers", free: true, description: "SBA-funded centers providing training, counseling, and mentorship specifically for women entrepreneurs.", url: "https://www.sba.gov/local-assistance/resource-partners/womens-business-centers", availability: "In-person & virtual" },
  { name: "Veteran Business Outreach", org: "SBA VBOC Program", type: "VBOC", expertise: ["Veteran Entrepreneurship", "SBA Loans", "Transition", "Federal Contracting"], locations: "22 centers nationwide", free: true, description: "Entrepreneurship support for military veterans, service members, and their dependents.", url: "https://www.sba.gov/local-assistance/resource-partners/veteran-business-outreach-centers-vboc", availability: "In-person & virtual" },
  { name: "MBDA Business Centers", org: "Minority Business Dev. Agency", type: "MBDA", expertise: ["Minority-Owned", "Capital Access", "Federal Contracts", "International Trade"], locations: "40+ centers", free: true, description: "Federal program supporting growth of minority-owned firms through access to capital, contracts, and markets.", url: "https://www.mbda.gov/businesscenters", availability: "In-person & virtual" },
  { name: "SBA Learning Center", org: "Small Business Administration", type: "Online", expertise: ["Online Training", "Self-Paced", "Business Basics", "Federal Contracting"], locations: "100% Online", free: true, description: "Self-paced online courses covering every aspect of starting and growing a small business.", url: "https://www.sba.gov/events/find/?type=SBA%20Learning%20Center%20Online%20Course", availability: "24/7 Online" },
];

const TYPES = ["All", "SCORE", "SBDC", "WBC", "VBOC", "MBDA", "Online"];

export default function MentorMatch() {
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = MENTORS.filter(m => {
    const matchType = type === "All" || m.type === type;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const handleAiMatch = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResult("");
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a business advisor matchmaker. An entrepreneur described their situation: "${aiQuery}"

Recommend the best mentorship and advisory resources for them from:
${MENTORS.map(m => `- ${m.name} (${m.type}): ${m.expertise.join(", ")}`).join("\n")}

Also mention any specialized industry associations, accelerators, or incubators that may be relevant. Explain specifically WHY each recommendation fits their needs. Format with clear headings.`,
    });
    setAiResult(result);
    setAiLoading(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader title="Mentor & Advisor Network" subtitle="Connect with SCORE mentors, SBDC advisors, and specialized support organizations — all free to access." />

      {/* AI Matcher */}
      <div className="bg-gradient-to-r from-violet-600/5 to-purple-600/5 border border-violet-200 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-violet-600" />
          <h2 className="font-semibold">Find My Advisor Match</h2>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. I'm a first-generation immigrant starting a food truck in Miami..."
            value={aiQuery}
            onChange={e => setAiQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAiMatch()}
            className="flex-1"
          />
          <Button onClick={handleAiMatch} disabled={aiLoading || !aiQuery.trim()} className="bg-violet-600 hover:bg-violet-700">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Match Me"}
          </Button>
        </div>
        {aiResult && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border">
            <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground">{aiResult}</pre>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or expertise..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPES.map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${type === t ? "bg-violet-600 text-white border-violet-600" : "bg-background text-muted-foreground border-border hover:border-violet-400"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((mentor, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                  <Badge className="bg-violet-100 text-violet-700 text-xs">{mentor.type}</Badge>
                  {mentor.free && <Badge className="bg-green-100 text-green-700 text-xs">Free</Badge>}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2 flex-wrap">
                  <span>{mentor.org}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{mentor.locations}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{mentor.availability}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{mentor.description}</p>
                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.map(e => (
                    <span key={e} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{e}</span>
                  ))}
                </div>
              </div>
              <a href={mentor.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="flex-shrink-0 bg-violet-600 hover:bg-violet-700">Connect</Button>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}