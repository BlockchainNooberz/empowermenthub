import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Landmark, Search, Filter, DollarSign, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import LoanCard from "@/components/lending/LoanCard";
import LoanDetailModal from "@/components/lending/LoanDetailModal";

export default function Lending() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [creditFilter, setCreditFilter] = useState("all");
  const [selectedLoan, setSelectedLoan] = useState(null);

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ["loans"],
    queryFn: () => base44.entities.LoanRequest.list(),
  });

  const filtered = loans.filter(l => {
    const matchesSearch = !search || 
      l.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const matchesCredit = creditFilter === "all" || l.credit_score === creditFilter;
    return matchesSearch && matchesStatus && matchesCredit;
  });

  const totalFunded = loans.reduce((s, l) => s + (l.amount_funded || 0), 0);
  const totalLenders = loans.reduce((s, l) => s + (l.lender_count || 0), 0);
  const avgRate = loans.length > 0 
    ? (loans.reduce((s, l) => s + (l.interest_rate || 0), 0) / loans.length).toFixed(1) 
    : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        title="Capital Access"
        subtitle="Community-powered lending connecting local investors with small businesses in underserved areas."
      >
        <Button className="bg-primary hover:bg-primary/90">
          <Landmark className="w-4 h-4 mr-2" /> Request a Loan
        </Button>
      </PageHeader>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Funded" value={`$${(totalFunded / 1000).toFixed(0)}K`} icon={DollarSign} accentClass="bg-blue-600/10 text-blue-600" />
        <StatCard title="Community Lenders" value={totalLenders} icon={Users} accentClass="bg-emerald-600/10 text-emerald-600" />
        <StatCard title="Avg Interest Rate" value={`${avgRate}%`} icon={TrendingUp} accentClass="bg-amber-600/10 text-amber-600" />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search businesses or locations..." 
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="seeking_funding">Seeking Funding</SelectItem>
            <SelectItem value="partially_funded">Partially Funded</SelectItem>
            <SelectItem value="fully_funded">Fully Funded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={creditFilter} onValueChange={setCreditFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Credit Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Credit</SelectItem>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="building">Building</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loan Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-card border rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-muted rounded w-2/3 mb-3" />
              <div className="h-4 bg-muted rounded w-1/3 mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-4/5 mb-4" />
              <div className="h-2.5 bg-muted rounded-full w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-heading font-bold text-foreground">No loan requests found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((loan, i) => (
            <motion.div 
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <LoanCard loan={loan} onClick={setSelectedLoan} />
            </motion.div>
          ))}
        </div>
      )}

      <LoanDetailModal 
        loan={selectedLoan} 
        open={!!selectedLoan} 
        onClose={() => setSelectedLoan(null)} 
      />
    </div>
  );
}