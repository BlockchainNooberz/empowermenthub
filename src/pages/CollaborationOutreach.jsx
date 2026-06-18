import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Copy, CheckCircle2, Loader2, RefreshCw, Search, Building2, Globe, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";

const COLLABORATORS = [
  // Federal Agencies
  { name: "Small Business Administration (SBA)", category: "Federal Agency", email: "answerdesk@sba.gov", contact: "Office of Strategic Alliances", website: "sba.gov", pitch: "API integration, data sharing, and official SBA partnership designation" },
  { name: "Economic Development Administration (EDA)", category: "Federal Agency", email: "eda@eda.gov", contact: "Partnership Programs Office", website: "eda.gov", pitch: "EDA Build to Scale partnership and regional innovation ecosystem alignment" },
  { name: "Minority Business Development Agency (MBDA)", category: "Federal Agency", email: "info@mbda.gov", contact: "National Director's Office", website: "mbda.gov", pitch: "Technology platform partnership to extend MBDA reach to minority entrepreneurs" },
  { name: "USDA Rural Development", category: "Federal Agency", email: "rd.webmaster@usda.gov", contact: "Business Programs Division", website: "rd.usda.gov", pitch: "Rural entrepreneur platform access and USDA loan integration" },

  // SBDC / SCORE
  { name: "America's SBDC (National Association)", category: "SBDC Network", email: "info@asbdc-us.org", contact: "Executive Director", website: "americassbdc.org", pitch: "White-label platform access for SBDC advisors and client tracking integration" },
  { name: "SCORE Association (National HQ)", category: "Mentor Network", email: "info@score.org", contact: "CEO & Partnership Team", website: "score.org", pitch: "Mentor matching integration and co-branded entrepreneur resources" },
  { name: "Women's Business Enterprise National Council", category: "Certification Body", email: "info@wbenc.org", contact: "Partnerships & Innovation", website: "wbenc.org", pitch: "WBENC certification verification integration on the Skills Marketplace" },
  { name: "National Minority Supplier Development Council", category: "Certification Body", email: "info@nmsdc.org", contact: "Technology Partnerships", website: "nmsdc.org", pitch: "Minority supplier certification verification and supply chain integration" },

  // Universities & HBCUs
  { name: "Howard University (HBCU)", category: "HBCU Partner", email: "partnerships@howard.edu", contact: "Office of Innovation & Entrepreneurship", website: "howard.edu", pitch: "Workforce pipeline, curriculum collaboration, and student credential verification" },
  { name: "Spelman College", category: "HBCU Partner", email: "entrepreneurship@spelman.edu", contact: "Center for Entrepreneurship", website: "spelman.edu", pitch: "Women & HBCU entrepreneur platform integration and co-branded programs" },
  { name: "Community College Growth Engine Fund", category: "Education Partner", email: "info@collegegrowth.org", contact: "Executive Director", website: "collegegrowth.org", pitch: "Community college skills credentialing pipeline and workforce alignment" },
  { name: "MIT Deshpande Center", category: "Innovation Hub", email: "deshpande@mit.edu", contact: "Program Director", website: "deshpande.mit.edu", pitch: "Technology innovation pipeline and startup credentialing" },

  // CDFIs & Financial Institutions
  { name: "Opportunity Finance Network (OFN)", category: "CDFI Network", email: "info@ofn.org", contact: "VP of Partnerships", website: "ofn.org", pitch: "Lender marketplace integration and CDFI data API partnership" },
  { name: "Community Development Financial Institutions Fund (US Treasury)", category: "Federal Agency", email: "cdfihelp@cdfi.treas.gov", contact: "Director of Programs", website: "cdfifund.gov", pitch: "CDFI certification data integration and capital deployment tracking" },
  { name: "Accion Opportunity Fund", category: "CDFI", email: "info@accionopportunityfund.org", contact: "Chief Lending Officer", website: "accionopportunityfund.org", pitch: "Direct lender marketplace listing and API loan application routing" },

  // Business Associations
  { name: "U.S. Chamber of Commerce Foundation", category: "Business Association", email: "chamberinfo@uschamber.com", contact: "Small Business Programs", website: "uschamberfoundation.org", pitch: "Co-branded entrepreneurship resources and national distribution network" },
  { name: "National Federation of Independent Business (NFIB)", category: "Business Association", email: "media@nfib.com", contact: "VP of Communications", website: "nfib.com", pitch: "Member platform access and advocacy alignment for Main Street businesses" },
  { name: "National Urban League", category: "Community Organization", email: "info@nul.org", contact: "Entrepreneurship Division", website: "nul.org", pitch: "Urban entrepreneur outreach partnership and platform co-distribution" },
  { name: "U.S. Hispanic Chamber of Commerce", category: "Business Association", email: "ushcc@ushcc.com", contact: "VP of Partnerships", website: "ushcc.com", pitch: "Latino entrepreneur platform expansion and Spanish-language integration" },

  // State Economic Development
  { name: "Council of Development Finance Agencies (CDFA)", category: "State Partner", email: "info@cdfa.net", contact: "Program Director", website: "cdfa.net", pitch: "State-level economic development API and capital deployment tracking" },
  { name: "International Economic Development Council (IEDC)", category: "State Partner", email: "mail@iedconline.org", contact: "CEO", website: "iedconline.org", pitch: "National economic development network integration and data sharing MOU" },
];

const CATEGORIES = ["All", "Federal Agency", "SBDC Network", "Mentor Network", "HBCU Partner", "CDFI Network", "CDFI", "Business Association", "Certification Body", "Education Partner", "Innovation Hub", "Community Organization", "State Partner"];

export default function CollaborationOutreach() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [generatedEmails, setGeneratedEmails] = useState({});
  const [loadingFor, setLoadingFor] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState({});
  const [customContext, setCustomContext] = useState("EmpowerHub is a free national platform for American small business owners providing AI-powered business blueprints, SBA resource access, workforce credentialing, capital access, and supply chain transparency.");

  const filtered = COLLABORATORS.filter(org => {
    const matchCat = category === "All" || org.category === category;
    const matchSearch = !search || org.name.toLowerCase().includes(search.toLowerCase()) || org.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleSelect = (name) => {
    setSelectedOrgs(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const generateEmail = async (org) => {
    setLoadingFor(org.name);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a professional, compelling collaboration outreach email to ${org.name} (${org.category}).

Platform context: ${customContext}

Specific collaboration angle for this organization: ${org.pitch}

Contact: ${org.contact}
Email: ${org.email}

The email should:
- Be from EmpowerHub's founding team
- Open with a specific, relevant hook about their mission
- Clearly explain what EmpowerHub does in 2-3 sentences
- Propose 1–2 SPECIFIC collaboration ideas tailored to this organization
- Reference their specific programs or initiatives where relevant
- Be concise (under 250 words), professional, and persuasive
- End with a clear call to action (15-minute call)
- Include subject line at the top formatted as: Subject: [subject here]

Format: Subject line first, then the email body. No placeholders — write it ready to send.`,
    });
    setGeneratedEmails(prev => ({ ...prev, [org.name]: result }));
    setExpanded(prev => ({ ...prev, [org.name]: true }));
    setLoadingFor(null);
  };

  const generateAllSelected = async () => {
    const orgsToGenerate = COLLABORATORS.filter(o => selectedOrgs.includes(o.name) && !generatedEmails[o.name]);
    for (const org of orgsToGenerate) {
      await generateEmail(org);
    }
  };

  const copyEmail = (name, text) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [name]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [name]: false })), 2000);
  };

  const downloadAll = () => {
    const generated = Object.entries(generatedEmails);
    if (!generated.length) return;
    const content = generated.map(([name, email]) => {
      const org = COLLABORATORS.find(o => o.name === name);
      return `TO: ${org?.email}\nCONTACT: ${org?.contact}\n\n${email}\n\n${"=".repeat(60)}\n\n`;
    }).join("");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "empowerhub-outreach-emails.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader title="Collaboration Outreach" subtitle="Generate personalized outreach emails to federal agencies, CDFIs, universities, and partner organizations for national adoption." />

      {/* Context */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <label className="text-sm font-semibold mb-2 block">Platform description (customize your pitch)</label>
        <Textarea value={customContext} onChange={e => setCustomContext(e.target.value)} className="text-sm min-h-[70px] resize-none" />
      </div>

      {/* Bulk Actions */}
      {selectedOrgs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm font-medium">{selectedOrgs.length} organization{selectedOrgs.length > 1 ? "s" : ""} selected</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={generateAllSelected} disabled={loadingFor !== null}>
              {loadingFor ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Mail className="w-3 h-3 mr-1" />}
              Generate All Emails
            </Button>
            {Object.keys(generatedEmails).length > 0 && (
              <Button size="sm" variant="outline" onClick={downloadAll}>
                Download All
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setSelectedOrgs([])}>Clear</Button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((org, i) => {
          const isSelected = selectedOrgs.includes(org.name);
          const hasEmail = !!generatedEmails[org.name];
          const isLoading = loadingFor === org.name;
          const isExpanded = expanded[org.name];

          return (
            <motion.div key={org.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-card border rounded-xl overflow-hidden transition-all ${isSelected ? "border-primary/40 shadow-sm" : "border-border"}`}>
              <div className="p-4 flex items-start gap-3">
                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(org.name)}
                  className="mt-1 w-4 h-4 accent-primary cursor-pointer flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground text-sm">{org.name}</h3>
                        <Badge variant="outline" className="text-xs">{org.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{org.email}</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{org.contact}</span>
                        <a href={`https://${org.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                          <Globe className="w-3 h-3" />{org.website}
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 italic">Pitch angle: {org.pitch}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {hasEmail && (
                        <button onClick={() => setExpanded(prev => ({ ...prev, [org.name]: !isExpanded }))} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {isExpanded ? "Hide" : "Show"} email
                        </button>
                      )}
                      <Button size="sm" variant={hasEmail ? "outline" : "default"} onClick={() => generateEmail(org)} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : hasEmail ? <RefreshCw className="w-3 h-3" /> : <Mail className="w-3 h-3 mr-1" />}
                        {isLoading ? "Generating..." : hasEmail ? "Regenerate" : "Write Email"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && hasEmail && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4 border-t border-border pt-3">
                      <div className="flex justify-end mb-2">
                        <button onClick={() => copyEmail(org.name, generatedEmails[org.name])}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                          {copied[org.name] ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          {copied[org.name] ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground bg-muted/40 rounded-lg p-4 leading-relaxed">{generatedEmails[org.name]}</pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}