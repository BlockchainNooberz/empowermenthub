import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, BookOpen, ExternalLink, Loader2, Building2, Ruler, Users, HandHeart } from "lucide-react";
import PageHeroBanner from "@/components/shared/PageHeroBanner";

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

const SUPPORT_TYPE_COLORS = {
  sbdc: "bg-blue-100 text-blue-700",
  score: "bg-indigo-100 text-indigo-700",
  angel: "bg-amber-100 text-amber-700",
  chamber: "bg-green-100 text-green-700",
  cdc: "bg-teal-100 text-teal-700",
  accelerator: "bg-violet-100 text-violet-700",
  cdfi: "bg-orange-100 text-orange-700",
  federal: "bg-red-100 text-red-700",
  nonprofit: "bg-pink-100 text-pink-700",
};

const LOCAL_SUPPORT_PROGRAMS = [
  // SBDC
  { name: "Small Business Development Centers (SBDC)", type: "sbdc", desc: "Free one-on-one consulting, market research, business plan development, and loan packaging from America's SBDC network of 1,000+ centers.", audience: ["all"], url: "https://americassbdc.org/", finder: "https://americassbdc.org/find-your-sbdc/" },
  { name: "SBDC Technology Commercialization", type: "sbdc", desc: "Specialized SBDC advisors help tech startups with IP strategy, SBIR applications, and commercialization planning.", audience: ["startup","tech"], url: "https://americassbdc.org/", finder: null },
  { name: "SBDC Export Assistance", type: "sbdc", desc: "International trade specialists help small businesses expand into new markets, handle export compliance, and access trade financing.", audience: ["all"], url: "https://americassbdc.org/", finder: null },

  // SCORE
  { name: "SCORE Mentoring", type: "score", desc: "Free confidential business mentoring from 10,000+ volunteer mentors — retired executives and active business owners — nationwide.", audience: ["all"], url: "https://www.score.org/", finder: "https://www.score.org/find-mentor" },
  { name: "SCORE Workshops & Webinars", type: "score", desc: "Low-cost and free workshops on starting a business, marketing, finance, and scaling — available online and in-person.", audience: ["all"], url: "https://www.score.org/", finder: "https://www.score.org/find-workshop-event" },
  { name: "SCORE Business Plan Templates", type: "score", desc: "Free templates, guides, and financial projections tools provided by SCORE mentors to help entrepreneurs launch faster.", audience: ["startup"], url: "https://www.score.org/resource/business-plan-template-startup-businesses", finder: null },

  // Angel Investors
  { name: "Angel Capital Association (ACA)", type: "angel", desc: "The largest professional association of angel investors in North America. Find investor groups and learn how to pitch effectively.", audience: ["startup"], url: "https://www.angelcapitalassociation.org/", finder: "https://www.angelcapitalassociation.org/find-an-angel-group/" },
  { name: "Gust Angel Network", type: "angel", desc: "Online platform connecting startups with accredited angel investors. Submit your pitch to thousands of investors.", audience: ["startup"], url: "https://gust.com/", finder: null },
  { name: "AngelList", type: "angel", desc: "Platform for startups to raise capital from angels and syndicates. Also features a job board for startup hiring.", audience: ["startup"], url: "https://angel.co/", finder: null },
  { name: "MicroVentures", type: "angel", desc: "Equity crowdfunding platform connecting startups with angel investors via Regulation CF and Regulation D offerings.", audience: ["startup"], url: "https://microventures.com/", finder: null },

  // Chamber of Commerce
  { name: "U.S. Chamber of Commerce", type: "chamber", desc: "National advocacy and resources for businesses of all sizes, including policy updates, networking, and access to capital programs.", audience: ["all"], url: "https://www.uschamber.com/", finder: null },
  { name: "Local Chamber of Commerce Finder", type: "chamber", desc: "Find your local Chamber of Commerce for networking events, business directories, advocacy, and community connections.", audience: ["all"], url: "https://www.uschamber.com/co/chambers", finder: "https://www.uschamber.com/co/chambers" },
  { name: "Chamber Small Business Center", type: "chamber", desc: "Many chambers offer co-working space, lending circles, buy local campaigns, and dedicated small business advisors.", audience: ["all"], url: "https://www.uschamber.com/", finder: null },

  // CDFIs
  { name: "Community Development Financial Institutions (CDFIs)", type: "cdfi", desc: "Mission-driven lenders providing affordable capital to underserved communities, including microloans, small business loans, and financial coaching.", audience: ["minority","women","startup"], url: "https://www.cdfifund.gov/", finder: "https://www.cdfifund.gov/programs-training/certification/cdfi/Pages/default.aspx" },
  { name: "Opportunity Finance Network (OFN)", type: "cdfi", desc: "National network of CDFIs with a lender locator to find mission-driven financing in your area.", audience: ["minority","women"], url: "https://ofn.org/", finder: "https://ofn.org/cdfi-locator" },
  { name: "Community Advantage Loan Program", type: "cdfi", desc: "SBA-backed program through CDFIs targeting underserved markets with loans up to $350,000 and technical assistance.", audience: ["minority","women","veteran"], url: "https://www.sba.gov/", finder: null },

  // Accelerators & Incubators
  { name: "SBA Growth Accelerators", type: "accelerator", desc: "SBA-funded accelerators across the country providing mentorship, networking, and access to capital for high-growth startups.", audience: ["startup"], url: "https://www.sba.gov/local-assistance/resource-partners/small-business-development-centers", finder: null },
  { name: "Y Combinator", type: "accelerator", desc: "World's leading startup accelerator providing seed funding, expert mentorship, and connections to top investors. Twice-yearly cohorts.", audience: ["startup"], url: "https://www.ycombinator.com/", finder: null },
  { name: "Techstars", type: "accelerator", desc: "Global accelerator with programs across the US offering mentorship-driven investment and network access for high-potential startups.", audience: ["startup"], url: "https://www.techstars.com/", finder: "https://www.techstars.com/accelerators" },
  { name: "1 Million Cups", type: "accelerator", desc: "Free weekly community event by Kauffman Foundation connecting entrepreneurs with mentors, resources, and feedback.", audience: ["startup","all"], url: "https://www.1millioncups.com/", finder: "https://www.1millioncups.com/communities" },
  { name: "Local University Incubators", type: "accelerator", desc: "Most universities and community colleges offer free or low-cost incubator programs, workspace, and mentoring for entrepreneurs.", audience: ["startup"], url: "https://inbia.org/", finder: "https://inbia.org/about/member-directory/" },

  // Federal / CDC
  { name: "Economic Development Administration (EDA)", type: "federal", desc: "Federal grants for economic development projects, infrastructure, planning, and workforce programs in distressed communities.", audience: ["all"], url: "https://www.eda.gov/", finder: "https://www.eda.gov/contact/field-offices" },
  { name: "USDA Rural Development", type: "federal", desc: "Loans, grants, and technical assistance for businesses in rural America — including rural energy, broadband, and business programs.", audience: ["all"], url: "https://www.rd.usda.gov/", finder: "https://www.rd.usda.gov/contact-us/state-offices" },
  { name: "Minority Business Development Agency (MBDA)", type: "federal", desc: "Federal agency dedicated to helping minority-owned businesses grow and compete, with centers in major cities.", audience: ["minority"], url: "https://www.mbda.gov/", finder: "https://www.mbda.gov/businesscenters" },
  { name: "Manufacturing Extension Partnership (MEP)", type: "federal", desc: "Nationwide network helping small manufacturers compete, innovate, and grow through technical consulting and workforce development.", audience: ["all"], url: "https://www.nist.gov/mep", finder: "https://www.nist.gov/mep/mep-national-network/mep-centers" },

  // Nonprofits
  { name: "Accion Opportunity Fund", type: "nonprofit", desc: "Nonprofit lender offering microloans, small business loans, and free coaching for entrepreneurs who lack access to traditional credit.", audience: ["minority","women","startup"], url: "https://aofund.org/", finder: null },
  { name: "Kiva U.S.", type: "nonprofit", desc: "Zero-interest crowdfunded microloans up to $15,000 for small business owners who can't access traditional financing.", audience: ["minority","women","startup"], url: "https://www.kiva.org/borrow", finder: null },
  { name: "National Urban League", type: "nonprofit", desc: "Provides entrepreneurship training, mentoring, and access to capital for Black-owned businesses through affiliate centers nationwide.", audience: ["minority"], url: "https://nul.org/", finder: "https://nul.org/affiliates" },
  { name: "CAMEO (CA Association for Micro Enterprise Opportunity)", type: "nonprofit", desc: "Network of microenterprise development organizations providing training, lending, and technical assistance to low-income entrepreneurs.", audience: ["minority","women"], url: "https://www.microbiz.org/", finder: null },
  { name: "National Women's Business Council (NWBC)", type: "nonprofit", desc: "Federal advisory council providing research and policy recommendations to support women entrepreneurs and business owners.", audience: ["women"], url: "https://www.nwbc.gov/", finder: null },
  { name: "VetBiz / Bunker Labs", type: "nonprofit", desc: "Nonprofit supporting veteran entrepreneurs with community, programming, accelerators, and access to markets.", audience: ["veteran"], url: "https://bunkerlabs.org/", finder: null },
];

export default function Resources() {
  const [selectedState, setSelectedState] = useState("");
  const [officeType, setOfficeType] = useState("all");
  const [offices, setOffices] = useState([]);
  const [officesLoading, setOfficesLoading] = useState(false);
  const [officesSearched, setOfficesSearched] = useState(false);

  const [programKeyword, setProgramKeyword] = useState("");
  const [programType, setProgramType] = useState("all");
  const [programAudience, setProgramAudience] = useState("all");

  const [supportKeyword, setSupportKeyword] = useState("");
  const [supportType, setSupportType] = useState("all");
  const [supportAudience, setSupportAudience] = useState("all");

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

  const filteredSupport = LOCAL_SUPPORT_PROGRAMS.filter(p => {
    const keyMatch = !supportKeyword || p.name.toLowerCase().includes(supportKeyword.toLowerCase()) || p.desc.toLowerCase().includes(supportKeyword.toLowerCase());
    const typeMatch = supportType === 'all' || p.type === supportType;
    const audMatch = supportAudience === 'all' || p.audience.includes(supportAudience) || p.audience.includes('all');
    return keyMatch && typeMatch && audMatch;
  });

  const filteredPrograms = SBA_PROGRAMS.filter(p => {
    const keyMatch = !programKeyword || p.name.toLowerCase().includes(programKeyword.toLowerCase()) || p.desc.toLowerCase().includes(programKeyword.toLowerCase());
    const typeMatch = programType === 'all' || p.type === programType;
    const audMatch = programAudience === 'all' || p.audience.includes(programAudience);
    return keyMatch && typeMatch && audMatch;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <PageHeroBanner
        icon="🏛️"
        eyebrow="Federal Resources"
        title="SBA Resource Center"
        subtitle="Find local assistance, browse SBA programs, and look up size standards."
        tags={["SBA Programs", "SBDC Offices", "SCORE Network", "Size Standards"]}
      />

      <Tabs defaultValue="programs" className="mt-6">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="programs">
            <BookOpen className="w-4 h-4 mr-2" />SBA Programs
          </TabsTrigger>
          <TabsTrigger value="support">
            <Users className="w-4 h-4 mr-2" />Local Support
          </TabsTrigger>
          <TabsTrigger value="offices">
            <MapPin className="w-4 h-4 mr-2" />Find Offices
          </TabsTrigger>
          <TabsTrigger value="size">
            <Ruler className="w-4 h-4 mr-2" />Size Standards
          </TabsTrigger>
        </TabsList>

        {/* Local Support Tab */}
        <TabsContent value="support">
          <div className="flex flex-wrap gap-3 mb-6">
            <Input
              placeholder="Search programs & organizations..."
              value={supportKeyword}
              onChange={e => setSupportKeyword(e.target.value)}
              className="w-64"
            />
            <Select value={supportType} onValueChange={setSupportType}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Organization type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sbdc">SBDC</SelectItem>
                <SelectItem value="score">SCORE</SelectItem>
                <SelectItem value="angel">Angel Investors</SelectItem>
                <SelectItem value="chamber">Chamber of Commerce</SelectItem>
                <SelectItem value="cdfi">CDFIs / Community Lenders</SelectItem>
                <SelectItem value="accelerator">Accelerators & Incubators</SelectItem>
                <SelectItem value="federal">Federal Programs</SelectItem>
                <SelectItem value="nonprofit">Nonprofits</SelectItem>
              </SelectContent>
            </Select>
            <Select value={supportAudience} onValueChange={setSupportAudience}>
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

          <p className="text-xs text-muted-foreground mb-4">{filteredSupport.length} programs found</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSupport.map((p, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground leading-snug">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="ml-3 text-primary hover:opacity-70 flex-shrink-0 mt-0.5">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 items-center">
                  <Badge className={SUPPORT_TYPE_COLORS[p.type] || "bg-gray-100 text-gray-700"}>{p.type.toUpperCase()}</Badge>
                  {p.audience.filter(a => a !== 'all').map(a => (
                    <Badge key={a} className={AUD_COLORS[a] || "bg-gray-100 text-gray-700"}>{a}</Badge>
                  ))}
                  {p.finder && (
                    <a href={p.finder} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-primary font-medium hover:underline flex items-center gap-1">
                      <MapPin className="w-3 h-3" />Find near me
                    </a>
                  )}
                </div>
              </div>
            ))}
            {filteredSupport.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <HandHeart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No programs match your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>

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