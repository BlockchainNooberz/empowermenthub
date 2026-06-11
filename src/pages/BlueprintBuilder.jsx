import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Loader2, FileText, ChevronDown, ChevronUp, 
  Download, RefreshCw, Lightbulb, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

const DOCUMENT_TYPES = [
  { id: "business_structure", label: "Business Structure", icon: "🏛️", desc: "LLC, S-Corp, C-Corp, Sole Prop — with pros/cons and recommended path" },
  { id: "business_plan", label: "Business Plan", icon: "📋", desc: "Executive summary, market analysis, competitive landscape, go-to-market" },
  { id: "financials", label: "Financial Projections", icon: "📊", desc: "Startup costs, 3-year revenue forecast, break-even analysis, cash flow" },
  { id: "operating_costs", label: "Operating Costs & Needs", icon: "⚙️", desc: "Monthly overhead, staffing, equipment, software, facilities" },
  { id: "inventory", label: "Inventory & Supply Chain", icon: "📦", desc: "Inventory needs, supplier sourcing, reorder points, cost of goods" },
  { id: "branding", label: "Branding Blueprint", icon: "🎨", desc: "Brand identity, voice, positioning, naming, visual direction" },
  { id: "revenue", label: "Revenue Model", icon: "💰", desc: "Pricing strategy, revenue streams, upsells, customer LTV" },
  { id: "taxation", label: "Tax Strategy", icon: "🧾", desc: "Business tax obligations, deductions, quarterly estimates, IRS forms" },
  { id: "legal", label: "Legal Checklist", icon: "⚖️", desc: "Licenses, permits, contracts, IP protection, compliance requirements" },
  { id: "operations_manual", label: "Operations Manual", icon: "📖", desc: "SOPs, team roles, onboarding, daily workflows, quality standards" },
];

const EXAMPLE_PROMPTS = [
  "A mobile dog grooming van business in Texas. I want to serve residential neighborhoods and eventually hire 2 groomers.",
  "A women-owned catering company in Chicago specializing in corporate lunch events and wedding receptions.",
  "An online store selling handmade candles and home fragrance products, starting from my home in Georgia.",
  "A veteran-owned HVAC repair and installation business serving rural communities in Tennessee.",
  "A tutoring and test prep center for high school students in suburban New Jersey, with both in-person and online options.",
];

export default function BlueprintBuilder() {
  const [prompt, setPrompt] = useState("");
  const [selectedDocs, setSelectedDocs] = useState(DOCUMENT_TYPES.map(d => d.id));
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentlyGenerating, setCurrentlyGenerating] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleDoc = (id) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleExpanded = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const generateBlueprint = async () => {
    if (!prompt.trim() || selectedDocs.length === 0) return;
    setLoading(true);
    setResults({});
    setGenerated(false);
    setExpanded({});
    setProgress(0);

    const docsToGenerate = DOCUMENT_TYPES.filter(d => selectedDocs.includes(d.id));

    for (let i = 0; i < docsToGenerate.length; i++) {
      const doc = docsToGenerate[i];
      setCurrentlyGenerating(doc.id);
      setProgress(Math.round(((i) / docsToGenerate.length) * 100));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert business consultant and advisor helping an American entrepreneur build a complete business blueprint.

Business Description: "${prompt}"

Generate a comprehensive and practical "${doc.label}" document for this specific business.

${doc.id === "business_structure" ? `Cover: recommended entity type (LLC, S-Corp, C-Corp, Sole Proprietorship), reasons why, pros/cons table, formation steps, costs, and ongoing compliance requirements for their state.` : ""}
${doc.id === "business_plan" ? `Cover: executive summary, problem/solution, target market, competitive analysis, unique value proposition, marketing strategy, sales channels, key milestones.` : ""}
${doc.id === "financials" ? `Cover: startup cost breakdown (itemized), 3-year revenue projections (Year 1/2/3 with realistic assumptions), monthly cash flow for Year 1, break-even analysis, funding needs.` : ""}
${doc.id === "operating_costs" ? `Cover: monthly fixed costs, variable costs, staffing costs (roles, hours, wages), technology/software needs, facilities/equipment, total monthly burn rate.` : ""}
${doc.id === "inventory" ? `Cover: product/materials list, estimated quantities, supplier sourcing strategy, lead times, reorder points, cost of goods sold (COGS) calculation, storage needs.` : ""}
${doc.id === "branding" ? `Cover: brand name suggestions (3-5 options with rationale), tagline ideas, brand voice/tone, target audience personas, logo/visual direction notes, social media presence plan.` : ""}
${doc.id === "revenue" ? `Cover: pricing strategy, primary revenue streams, secondary/upsell opportunities, pricing tiers, customer lifetime value estimate, revenue per customer, growth levers.` : ""}
${doc.id === "taxation" ? `Cover: applicable federal/state taxes, quarterly estimated tax schedule, top deductible business expenses, recommended accounting method, IRS forms needed, tax-advantaged strategies.` : ""}
${doc.id === "legal" ? `Cover: required federal/state/local licenses and permits, zoning considerations, insurance types needed, contracts required (customer, vendor, employee), IP protection, ADA/compliance notes.` : ""}
${doc.id === "operations_manual" ? `Cover: daily/weekly/monthly operating procedures, key roles and responsibilities, customer service standards, quality control process, vendor management, employee onboarding checklist, emergency protocols.` : ""}

Format with clear headings (##), bullet points, and tables where helpful. Be specific and actionable — not generic. Tailor everything to this exact business.`,
      });

      setResults(prev => ({ ...prev, [doc.id]: result }));
      setExpanded(prev => ({ ...prev, [doc.id]: i === 0 }));
    }

    setProgress(100);
    setCurrentlyGenerating(null);
    setLoading(false);
    setGenerated(true);
  };

  const downloadAll = () => {
    const docsInOrder = DOCUMENT_TYPES.filter(d => results[d.id]);
    let content = `# Business Blueprint\n\nBusiness: ${prompt}\n\nGenerated by EmpowerHub Blueprint Builder\n\n---\n\n`;
    docsInOrder.forEach(doc => {
      content += `# ${doc.icon} ${doc.label}\n\n${results[doc.id]}\n\n---\n\n`;
    });
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-blueprint.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = Object.keys(results).length;
  const totalSelected = selectedDocs.length;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-accent">AI-Powered</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Business Blueprint Builder</h1>
        <p className="text-muted-foreground max-w-2xl">
          Describe your business in plain English. We'll generate every foundational document you need — from legal structure to tax strategy to operating manual — tailored specifically to your idea.
        </p>
      </div>

      {/* Input Section */}
      {!generated && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Prompt */}
          <div className="bg-card border border-border rounded-xl p-6">
            <label className="block text-sm font-semibold mb-2">Describe your business idea</label>
            <Textarea
              placeholder="e.g. A mobile dog grooming van business in Texas. I want to serve residential neighborhoods and eventually hire 2 groomers."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="min-h-[100px] text-sm resize-none"
            />
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> Try one of these:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(ex)}
                    className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {ex.slice(0, 55)}…
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Document Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold">Select documents to generate</label>
              <div className="flex gap-2">
                <button onClick={() => setSelectedDocs(DOCUMENT_TYPES.map(d => d.id))} className="text-xs text-primary hover:underline">Select all</button>
                <span className="text-muted-foreground text-xs">·</span>
                <button onClick={() => setSelectedDocs([])} className="text-xs text-primary hover:underline">Clear</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOCUMENT_TYPES.map(doc => {
                const isSelected = selectedDocs.includes(doc.id);
                return (
                  <button
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? "border-primary/40 bg-primary/5 text-foreground" 
                        : "border-border bg-background text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    <span className="text-lg leading-none mt-0.5">{doc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{doc.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{doc.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={generateBlueprint}
            disabled={!prompt.trim() || selectedDocs.length === 0 || loading}
            size="lg"
            className="w-full text-base font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Blueprint ({selectedDocs.length} documents)
          </Button>
        </motion.div>
      )}

      {/* Generation Progress */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Generating your blueprint...</span>
              <span className="text-sm text-muted-foreground">{completedCount} / {totalSelected}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DOCUMENT_TYPES.filter(d => selectedDocs.includes(d.id)).map(doc => {
                const isDone = !!results[doc.id];
                const isCurrent = currentlyGenerating === doc.id;
                return (
                  <div key={doc.id} className={`text-center py-2 px-1 rounded-lg text-xs transition-all ${
                    isDone ? "bg-green-50 text-green-700 border border-green-200" :
                    isCurrent ? "bg-primary/10 text-primary border border-primary/30 animate-pulse" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    <div className="text-base mb-1">{doc.icon}</div>
                    <div className="leading-tight font-medium">{doc.label}</div>
                    {isDone && <CheckCircle2 className="w-3 h-3 mx-auto mt-1 text-green-600" />}
                    {isCurrent && <Loader2 className="w-3 h-3 mx-auto mt-1 animate-spin" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Show results as they come in */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-3">
              {DOCUMENT_TYPES.filter(d => results[d.id]).map(doc => (
                <ResultCard key={doc.id} doc={doc} content={results[doc.id]} expanded={expanded[doc.id]} onToggle={() => toggleExpanded(doc.id)} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Final Results */}
      {generated && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-foreground">{completedCount} documents generated</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadAll}>
                <Download className="w-4 h-4 mr-2" />Download All
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setGenerated(false); setResults({}); setExpanded({}); }}>
                <RefreshCw className="w-4 h-4 mr-2" />Start Over
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {DOCUMENT_TYPES.filter(d => results[d.id]).map(doc => (
              <ResultCard key={doc.id} doc={doc} content={results[doc.id]} expanded={expanded[doc.id]} onToggle={() => toggleExpanded(doc.id)} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ResultCard({ doc, content, expanded, onToggle }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{doc.icon}</span>
          <div>
            <span className="font-semibold text-foreground">{doc.label}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{doc.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Badge className="bg-green-100 text-green-700 text-xs">Ready</Badge>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-border pt-4">
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(content);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <FileText className="w-3 h-3" /> Copy text
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-foreground
                prose-headings:font-heading prose-headings:text-foreground
                prose-h2:text-base prose-h2:font-bold prose-h2:mt-5 prose-h2:mb-2
                prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-1
                prose-p:text-sm prose-p:leading-relaxed prose-p:text-muted-foreground
                prose-li:text-sm prose-li:text-muted-foreground
                prose-strong:text-foreground
                prose-table:text-sm prose-th:text-foreground prose-th:font-semibold prose-th:bg-muted/50 prose-th:p-2
                prose-td:p-2 prose-td:border prose-td:border-border
              ">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}