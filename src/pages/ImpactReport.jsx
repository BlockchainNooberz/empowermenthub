import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, Users, ShieldCheck, Flag, Star, Download, TrendingUp, Package, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import { jsPDF } from "jspdf";

const PARTNERS = [
  {
    abbr: "SBA", name: "U.S. Small Business Administration", bg: "bg-blue-700",
    description: "Platform directly supports SBA mission by expanding capital access, tracking underserved community lending, and streamlining loan application preparation.",
    modules: ["Capital Access", "Impact Metrics", "AI Loan Advisor"]
  },
  {
    abbr: "SBDC", name: "Small Business Development Centers", bg: "bg-emerald-700",
    description: "Complements SBDC advisory services with 24/7 AI guidance, collaborative curriculum sharing, and digital resource delivery at scale.",
    modules: ["AI Business Advisor", "Education Hub", "Skills Marketplace"]
  },
  {
    abbr: "SCORE", name: "SCORE Volunteer Mentors", bg: "bg-amber-600",
    description: "Extends SCORE's mentor network digitally by credentialing expertise, matching mentors to entrepreneurs, and tracking outcomes.",
    modules: ["Skills Marketplace", "AI Advisor", "Credential Verification"]
  },
  {
    abbr: "WH", name: "White House — Made in America", bg: "bg-red-700",
    description: "Directly supports Made in America executive orders with end-to-end supply chain transparency, domestic content tracking, and American jobs data.",
    modules: ["Supply Chain", "Domestic Content Metrics", "Jobs Tracker"]
  }
];

const CHART_COLORS = ["#0a3161", "#b22234", "#f5a623", "#1a6b4a", "#7c3aed", "#0891b2"];

export default function ImpactReport() {
  const { data: loans = [] } = useQuery({ queryKey: ["loans"], queryFn: () => base44.entities.LoanRequest.list() });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => base44.entities.SupplyChainProduct.list() });
  const { data: credentials = [] } = useQuery({ queryKey: ["credentials"], queryFn: () => base44.entities.SkillCredential.list() });
  const { data: resources = [] } = useQuery({ queryKey: ["resources"], queryFn: () => base44.entities.EducationResource.list() });

  const totalFunded = loans.reduce((s, l) => s + (l.amount_funded || 0), 0);
  const totalRequested = loans.reduce((s, l) => s + (l.amount_requested || 0), 0);
  const totalJobs = products.reduce((s, p) => s + (p.jobs_supported || 0), 0);
  const verifiedCreds = credentials.filter(c => c.verification_status === "verified").length;
  const verifiedProducts = products.filter(p => p.verification_status === "verified").length;
  const avgDomestic = products.length > 0
    ? Math.round(products.reduce((s, p) => s + (p.domestic_content_pct || 0), 0) / products.length) : 0;
  const totalDownloads = resources.reduce((s, r) => s + (r.downloads || 0), 0);
  const underservedLoans = loans.filter(l => l.underserved_area).length;

  const bizTypeData = Object.entries(
    loans.reduce((acc, l) => { const k = (l.business_type || "other").replace("_", " "); acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const skillCatData = Object.entries(
    credentials.reduce((acc, c) => { const k = (c.category || "other").replace("_", " "); acc[k] = (acc[k] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const exportPDF = () => {
    const doc = new jsPDF();
    const navyR = 10, navyG = 49, navyB = 97;
    doc.setFillColor(navyR, navyG, navyB);
    doc.rect(0, 0, 210, 45, "F");
    doc.setFillColor(178, 34, 52);
    doc.rect(0, 0, 8, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("American Economic Empowerment Hub", 18, 20);
    doc.setFontSize(11);
    doc.text("Platform Impact Report  |  " + new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), 18, 32);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Key Metrics", 20, 60);
    const metrics = [
      ["Capital Deployed", `$${totalFunded.toLocaleString()}`],
      ["Total Requested", `$${totalRequested.toLocaleString()}`],
      ["American Jobs Supported", totalJobs.toLocaleString()],
      ["Verified Worker Credentials", verifiedCreds.toString()],
      ["Verified American Products", verifiedProducts.toString()],
      ["Avg Domestic Content", `${avgDomestic}%`],
      ["Education Resources Shared", resources.length.toString()],
      ["Total Downloads", totalDownloads.toLocaleString()],
      ["Underserved Community Loans", underservedLoans.toString()],
    ];
    doc.setFontSize(10);
    metrics.forEach(([label, value], i) => {
      doc.setTextColor(100, 100, 100);
      doc.text(label + ":", 25, 72 + i * 9);
      doc.setTextColor(10, 49, 97);
      doc.setFont(undefined, "bold");
      doc.text(value, 110, 72 + i * 9);
      doc.setFont(undefined, "normal");
    });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Stakeholder Alignment", 20, 165);
    doc.setFontSize(9);
    PARTNERS.forEach((org, i) => {
      doc.setFont(undefined, "bold");
      doc.setTextColor(10, 49, 97);
      doc.text(org.name, 25, 175 + i * 18);
      doc.setFont(undefined, "normal");
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(org.description, 165);
      doc.text(lines[0], 25, 181 + i * 18);
    });
    doc.save("empowerhub-impact-report.pdf");
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeroBanner
        icon="🇺🇸"
        eyebrow="National Economic Platform"
        title="Impact Report"
        subtitle="Demonstrating measurable economic value for SBA, SBDC, SCORE, Made in America, and communities nationwide."
        tags={["SBA Aligned", "SBDC Ready", "SCORE Network", "Made in America"]}
      >
        <Button onClick={exportPDF} variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white gap-2">
          <Download className="w-4 h-4" /> Export PDF
        </Button>
      </PageHeroBanner>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Capital Deployed", value: `$${(totalFunded / 1000).toFixed(0)}K`, sub: `of $${(totalRequested/1000).toFixed(0)}K requested`, icon: DollarSign, color: "text-blue-600 bg-blue-600/10" },
          { label: "American Jobs", value: totalJobs.toLocaleString(), sub: "supported by verified products", icon: Users, color: "text-emerald-600 bg-emerald-600/10" },
          { label: "Verified Credentials", value: verifiedCreds, sub: "workers verified", icon: ShieldCheck, color: "text-amber-600 bg-amber-600/10" },
          { label: "Domestic Content", value: `${avgDomestic}%`, sub: "avg across tracked products", icon: Flag, color: "text-red-600 bg-red-600/10" }
        ].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${m.color}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Active Loan Requests", value: loans.length, icon: TrendingUp },
          { label: "Verified Products", value: verifiedProducts, icon: Package },
          { label: "Education Resources", value: resources.length, icon: BookOpen },
          { label: "Underserved Community Loans", value: underservedLoans, icon: Award }
        ].map((m, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <m.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xl font-heading font-bold">{m.value}</p>
              <p className="text-[10px] text-muted-foreground">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold mb-4 text-sm">Loan Requests by Business Type</h3>
          {bizTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bizTypeData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {bizTypeData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground text-center py-16">No loan data yet</p>}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-bold mb-4 text-sm">Workforce Skills by Category</h3>
          {skillCatData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skillCatData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {skillCatData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground text-center py-16">No skills data yet</p>}
        </div>
      </div>

      {/* Partner Alignment */}
      <div>
        <h2 className="text-xl font-heading font-bold mb-5 flex items-center gap-2">
          <Star className="w-5 h-5 text-accent fill-accent" />
          Stakeholder & Partner Alignment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PARTNERS.map((org, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${org.bg} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <span className="text-white font-heading font-bold text-sm">{org.abbr}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-foreground mb-1">{org.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{org.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {org.modules.map(m => (
                      <span key={m} className="text-[10px] uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full text-foreground/70 font-semibold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="mt-10 bg-muted rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">Ready to partner or learn more?</p>
        <p className="font-heading font-bold text-lg text-foreground">EmpowerHub — Building America's Economic Future, Together.</p>
        <Button onClick={exportPDF} className="mt-4 gap-2">
          <Download className="w-4 h-4" /> Download Full Impact Report
        </Button>
      </motion.div>
    </div>
  );
}