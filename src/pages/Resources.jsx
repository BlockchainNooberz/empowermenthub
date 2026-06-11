import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, BookOpen, ExternalLink, Loader2, Building2, Ruler } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

const STATES = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",
  CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",
  IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
  ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",
  MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",
  NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",
  TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",
  WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"
};

const SBA_PROGRAMS = [
  { name: "7(a) Loan Program", type: "loans", audience: [], desc: "SBA's primary lending program for working capital, equipment, and real estate.", max: "$5 million", url: "https://www.sba.gov/funding-programs/loans/7a-loans" },
  { name: "504 Loan Program", type: "loans", audience: [], desc: "Long-term fixed-asset financing for equipment and commercial real estate.", max: "$5.5 million", url: "https://www.sba.gov/funding-programs/loans/504-loans" },
  { name: "Microloan Program", type: "loans", audience: ["startup","women","minority"], desc: "Small loans for startups and small businesses needing modest capital.", max: "$50,000", url: "https://www.sba.gov/funding-programs/loans/microloans" },
  { name: "Economic Injury Disaster Loan (EIDL)", type: "loans", audience: [], desc: "Low-interest disaster recovery loans for affected businesses.", max: "$2 million", url: "https://www.sba.gov/funding-programs/loans/covid-19-relief-options/eidl" },
  { name: "SBIR Grant", type: "grants", audience: ["startup"], desc: "Small Business Innovation Research grants for R&D with commercialization potential.", max: "$2 million", url: "https://www.sbir.gov/" },
  { name: "STTR Grant", type: "grants", audience: ["startup"], desc: "Technology transfer grants requiring university/research institution partnerships.", max: "$2 million", url: "https://www.sbir.gov/sttr" },
  { name: "8(a) Business Development", type: "certifications", audience: ["minority"], desc: "9-year program for socially/economically disadvantaged businesses with federal contracting set-asides.", max: "N/A", url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program" },
  { name: "HUBZone Certification", type: "certifications", audience: [], desc: "Certification for businesses in historically underutilized business zones for federal contracting.", max: "N/A", url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/hubzone-program" },
  { name: "WOSB Certification", type: "certifications", audience: ["women"], desc: "Women-Owned Small Business federal contracting program certification.", max: "N/A", url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/women-owned-small-business-federal-contracting-program" },
  { name: "SDVOSB Certification", type: "certifications", audience: ["veteran"], desc: "Service-Disabled Veteran-Owned Small Business federal contracting certification.", max: "N/A", url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/veteran-contracting-assistance-programs" },
  { name: "SCORE Mentoring", type: "counseling", audience: [], desc: "Free one-on-one mentoring from retired and active business professionals.", max: "Free", url: "https://www.score.org/" },
  { name: "SBDC Counseling", type: "counseling", audience: [], desc: "Free consulting and low-cost training at Small Business Development Centers.", max: "Free", url: "https://americassbdc.org/" },
  { name: "Women's Business Centers (WBC)", type: "counseling", audience: ["women"], desc: "Training, counseling, and access to capital for women entrepreneurs.", max: "Free", url: "https://www.sba.gov/local-assistance/resource-partners/womens-business-centers" },
  { name: "Veterans Business Outreach (VBOC)", type: "counseling", audience: ["veteran"], desc: "Business development training for veterans, transitioning service members, and military spouses.", max: "Free", url: "https://www.sba.gov/local-assistance/resource-partners/veterans-business-outreach-centers-vboc" },
  { name: "Minority Business Development Agency (MBDA)", type: "counseling", audience: ["minority"], desc: "Federal agency supporting minority-owned businesses with capital, markets, and contracts.", max: "Free", url: "https://www.mbda.gov/" },
];

const TYPE_COLORS = { loans: "bg-blue-100 text-blue-700", grants: "bg-green-100 text-green-700", certifications: "bg-amber-100 text-amber-700", counseling: "bg-violet-100 text-violet-700" };
const AUD_COLORS = { women: "bg-pink-100 text-pink-700", veteran: "bg-red-100 text-red-700", minority: "bg-orange-100 text-orange-700", startup: "bg-cyan-100 text-cyan-700" };

export default function Resources() {
  const [selectedState, setSelectedState] = useState("");
  const [officeType, setOfficeType] = useState("all");
  const [offices, setOffices] = useState([]);
  const [officesLoading, setOfficesLoading] = useState(false);
  const [officesSearched, setOfficesSearched] = useState(false);

  const [programKeyword, setProgramKeyword] = useState("");
  const [programType, setProgramType] = useState("all");
  const [programAudience, setProgramAudience] = useState("all");

  const [naicsQuery, setNaicsQuery] = useState("");
  const [sizeResults, setSizeResults] = useState([]);
  const [sizeLoading, setSizeLoading] = useState(false);
  const [sizeSearched, setSizeSearched] = useState(false);

  const findOffices = async () => {
    setOfficesLoading(true);
    setOfficesSearched(true);
    const res = await base44.functions.invoke('sbaResources', {
      action: 'find_offices',
      state: selectedState,
      office_type: officeType
    });
    setOffices(res.data?.data || []);
    setOfficesLoading(false);
  };

  const lookupSizeStandard = async () => {
    if (!naicsQuery) return;
    setSizeLoading(true);
    setSizeSearched(true);
    const res = await base44.functions.invoke('sbaResources', {
      action: 'size_standards',
      query: naicsQuery
    });
    setSizeResults(res.data?.data || []);
    setSizeLoading(false);
  };

  const filteredPrograms = SBA_PROGRAMS.filter(p => {
    const keyMatch = !programKeyword || p.name.toLowerCase().includes(programKeyword.toLowerCase()) || p.desc.toLowerCase().includes(programKeyword.toLowerCase());
    const typeMatch = programType === 'all' || p.type === programType;
    const audMatch = programAudience === 'all' || p.audience.includes(programAudience);
    return keyMatch && typeMatch && audMatch;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <PageHeader
        title="SBA Resource Center"
        subtitle="Find local assistance, browse SBA programs, and look up size standards"
      />

      <Tabs defaultValue="programs" className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="programs">
            <BookOpen className="w-4 h-4 mr-2" />Browse Programs
          </TabsTrigger>
          <TabsTrigger value="offices">
            <MapPin className="w-4 h-4 mr-2" />Find Local Help
          </TabsTrigger>
          <TabsTrigger value="size">
            <Ruler className="w-4 h-4 mr-2" />Size Standards
          </TabsTrigger>
        </TabsList>

        {/* Programs Tab */}
        <TabsContent value="programs">
          <div className="flex flex-wrap gap-3 mb-6">
            <Input
              placeholder="Search programs..."
              value={programKeyword}
              onChange={e => setProgramKeyword(e.target.value)}
              className="w-56"
            />
            <Select value={programType} onValueChange={setProgramType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="loans">Loans</SelectItem>
                <SelectItem value="grants">Grants</SelectItem>
                <SelectItem value="certifications">Certifications</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programAudience} onValueChange={setProgramAudience}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Audience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audiences</SelectItem>
                <SelectItem value="women">Women-Owned</SelectItem>
                <SelectItem value="veteran">Veteran-Owned</SelectItem>
                <SelectItem value="minority">Minority-Owned</SelectItem>
                <SelectItem value="startup">Startups</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map(p => (
              <div key={p.name} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="ml-3 text-primary hover:opacity-70 flex-shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={TYPE_COLORS[p.type]}>{p.type}</Badge>
                  {p.audience.map(a => <Badge key={a} className={AUD_COLORS[a]}>{a}</Badge>)}
                  {p.max !== "N/A" && <Badge variant="outline">{p.max}</Badge>}
                </div>
              </div>
            ))}
            {filteredPrograms.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">No programs match your filters.</div>
            )}
          </div>
        </TabsContent>

        {/* Offices Tab */}
        <TabsContent value="offices">
          <div className="flex flex-wrap gap-3 mb-6">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-52"><SelectValue placeholder="Select state..." /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATES).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={officeType} onValueChange={setOfficeType}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Office type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="SBDC">SBDC</SelectItem>
                <SelectItem value="SCORE">SCORE</SelectItem>
                <SelectItem value="WBC">Women's Business Center</SelectItem>
                <SelectItem value="VBOC">Veterans Business Outreach</SelectItem>
                <SelectItem value="MBDA">MBDA</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={findOffices} disabled={officesLoading}>
              {officesLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Find Offices
            </Button>
          </div>

          {officesLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 opacity-40" />
              <p>Searching SBA offices...</p>
            </div>
          )}

          {!officesLoading && officesSearched && offices.length === 0 && (
            <p className="text-muted-foreground text-sm py-6">No offices found for that selection. Try different filters or a different state.</p>
          )}

          {offices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offices.map((office, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{office.title || office.name || "Office"}</h3>
                      {(office.field_address || office.address) && (
                        <p className="text-sm text-muted-foreground mt-1">{office.field_address || office.address}</p>
                      )}
                      {(office.field_phone || office.phone) && (
                        <p className="text-sm text-muted-foreground">{office.field_phone || office.phone}</p>
                      )}
                      {(office.field_office_type || office.type) && (
                        <Badge className="mt-2 bg-primary/10 text-primary">{office.field_office_type || office.type}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!officesSearched && (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Select a state and click Find Offices to locate SBA resource partners near you</p>
            </div>
          )}
        </TabsContent>

        {/* Size Standards Tab */}
        <TabsContent value="size">
          <p className="text-sm text-muted-foreground mb-4">
            Look up SBA size standards by NAICS code or industry keyword (e.g., "541512" or "software development")
          </p>
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="NAICS code or industry keyword..."
              value={naicsQuery}
              onChange={e => setNaicsQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && lookupSizeStandard()}
              className="max-w-md"
            />
            <Button onClick={lookupSizeStandard} disabled={!naicsQuery || sizeLoading}>
              {sizeLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              Look Up
            </Button>
          </div>

          {sizeLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 opacity-40" />
              <p>Querying SBA size standards...</p>
            </div>
          )}

          {!sizeLoading && sizeSearched && sizeResults.length === 0 && (
            <p className="text-muted-foreground text-sm py-6">No size standards found. Try a different NAICS code or keyword.</p>
          )}

          {sizeResults.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">NAICS Code</th>
                    <th className="text-left py-3 px-4 font-semibold">Industry</th>
                    <th className="text-left py-3 px-4 font-semibold">Size Standard</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeResults.map((r, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-primary font-medium">{r.naics_code || r.code || "—"}</td>
                      <td className="py-3 px-4">{r.industry_title || r.title || r.description || "—"}</td>
                      <td className="py-3 px-4"><Badge variant="outline">{r.size_standard || r.sizeStandard || "—"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!sizeSearched && (
            <div className="text-center py-12 text-muted-foreground">
              <Ruler className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Enter a NAICS code or industry keyword to find the SBA size standard</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}