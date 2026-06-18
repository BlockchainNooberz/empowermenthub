import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Download, ChevronDown, ChevronUp, CheckCircle2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";

const GRANT_TYPES = [
  { id: "sbir_phase1", label: "SBIR Phase I", icon: "🔬", agency: "NSF/NIH/DoD/SBA", desc: "R&D innovation grant, up to $275K" },
  { id: "eda_build", label: "EDA Build to Scale", icon: "📈", agency: "Economic Dev. Admin", desc: "Regional innovation ecosystem, up to $3M" },
  { id: "usda_rbdg", label: "USDA Rural Dev. Grant", icon: "🌾", agency: "USDA Rural Development", desc: "Rural business technical assistance" },
  { id: "sba_8a", label: "SBA 8(a) Application", icon: "🏛️", agency: "Small Business Administration", desc: "Socially & economically disadvantaged businesses" },
  { id: "wbc_grant", label: "Women's Business Center", icon: "👩‍💼", agency: "SBA Women's Programs", desc: "Nonprofit WBC funding application" },
  { id: "cdfi_fund", label: "CDFI Fund Application", icon: "💳", agency: "US Treasury CDFI Fund", desc: "CDFI certification and capital grant" },
];

const BUSINESS_FIELDS = [
  { id: "business_name", label: "Business Name", placeholder: "Your business name" },
  { id: "business_type", label: "Business Type / Industry", placeholder: "e.g. Food manufacturing, Tech startup, Healthcare services" },
  { id: "location", label: "Location (City, State)", placeholder: "e.g. Detroit, Michigan" },
  { id: "founding_year", label: "Year Founded (or Planning)", placeholder: "e.g. 2022 or Planning 2026" },
  { id: "employees", label: "Number of Employees", placeholder: "e.g. 5, or solo" },
  { id: "annual_revenue", label: "Annual Revenue", placeholder: "e.g. $120,000 or Pre-revenue" },
  { id: "mission", label: "Business Mission / Problem You Solve", placeholder: "Describe what your business does and why it matters" },
  { id: "innovation", label: "Innovation or Unique Approach", placeholder: "What makes your business different or innovative?" },
  { id: "community_impact", label: "Community / Economic Impact", placeholder: "Jobs created, underserved communities served, etc." },
  { id: "funding_use", label: "How You'll Use the Funding", placeholder: "Equipment, staff, R&D, expansion, working capital..." },
];

export default function GrantAssistant() {
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [fields, setFields] = useState({});
  const [generatedApp, setGeneratedApp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleGenerate = async () => {
    if (!selectedGrant) return;
    setLoading(true);
    setGeneratedApp("");

    const grant = GRANT_TYPES.find(g => g.id === selectedGrant);
    const businessInfo = BUSINESS_FIELDS.map(f => `${f.label}: ${fields[f.id] || "Not provided"}`).join("\n");

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert grant writer helping a small business complete a ${grant.label} application for ${grant.agency}.

Business Information:
${businessInfo}

Generate a complete, compelling grant application narrative for the ${grant.label} (${grant.agency}).

Include all standard sections:
1. Executive Summary / Abstract (150 words)
2. Problem Statement & Need
3. Proposed Solution & Innovation
4. Business / Project Description
5. Target Market & Community Impact
6. Implementation Plan & Timeline
7. Budget Justification & Funding Use
8. Organizational Capacity & Team
9. Sustainability Plan
10. Conclusion & Call to Action

Make it specific to the ${grant.label} requirements. Use the business information provided to write real, tailored content — not generic templates. Write as if ready to submit. Format with clear section headers (##).`,
      model: "claude_sonnet_4_6",
    });

    setGeneratedApp(result);
    setLoading(false);
  };

  const download = () => {
    const grant = GRANT_TYPES.find(g => g.id === selectedGrant);
    const blob = new Blob([`${grant?.label} Application\n\n${generatedApp}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${grant?.id}-application.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <PageHeader title="Grant Application Assistant" subtitle="AI writes your SBIR, EDA, USDA, SBA 8(a), and other federal grant applications — tailored to your business." />

      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Uses premium AI model — higher quality output</span>
      </div>

      {/* Grant Selection */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-4">Select grant type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GRANT_TYPES.map(grant => (
            <button key={grant.id} onClick={() => setSelectedGrant(grant.id)}
              className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${selectedGrant === grant.id ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/20"}`}>
              <span className="text-xl">{grant.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{grant.label}</span>
                  {selectedGrant === grant.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{grant.agency}</p>
                <p className="text-xs text-muted-foreground">{grant.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Business Info Form */}
      {selectedGrant && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 mb-6">
          <button onClick={() => setShowForm(!showForm)} className="w-full flex items-center justify-between">
            <h2 className="font-semibold">Your business information</h2>
            {showForm ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {BUSINESS_FIELDS.map(f => (
                    <div key={f.id} className={f.id === "mission" || f.id === "innovation" || f.id === "community_impact" || f.id === "funding_use" ? "sm:col-span-2" : ""}>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{f.label}</label>
                      {f.id === "mission" || f.id === "innovation" || f.id === "community_impact" || f.id === "funding_use" ? (
                        <Textarea placeholder={f.placeholder} value={fields[f.id] || ""} onChange={e => setFields(p => ({ ...p, [f.id]: e.target.value }))} className="text-sm min-h-[70px] resize-none" />
                      ) : (
                        <Input placeholder={f.placeholder} value={fields[f.id] || ""} onChange={e => setFields(p => ({ ...p, [f.id]: e.target.value }))} className="text-sm" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!showForm && <p className="text-xs text-muted-foreground mt-2">Click to expand and fill in your business details for a more tailored application.</p>}
        </motion.div>
      )}

      {selectedGrant && (
        <Button onClick={handleGenerate} disabled={loading} size="lg" className="w-full mb-6 text-base font-semibold">
          {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Writing your application...</> : <><Sparkles className="w-5 h-5 mr-2" />Generate Grant Application</>}
        </Button>
      )}

      {generatedApp && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Application Draft Ready</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedApp)}>
                <FileText className="w-3 h-3 mr-1" />Copy
              </Button>
              <Button variant="outline" size="sm" onClick={download}>
                <Download className="w-3 h-3 mr-1" />Download
              </Button>
            </div>
          </div>
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-body text-sm text-muted-foreground leading-relaxed">{generatedApp}</pre>
          </div>
        </motion.div>
      )}
    </div>
  );
}