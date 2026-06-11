import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Award, Search, ShieldCheck, ThumbsUp, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import CredentialCard from "@/components/skills/CredentialCard";

export default function Skills() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ["credentials"],
    queryFn: () => base44.entities.SkillCredential.list(),
  });

  const filtered = credentials.filter(c => {
    const matchesSearch = !search ||
      c.holder_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.skill_name?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || c.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || c.level === levelFilter;
    return matchesSearch && matchesCat && matchesLevel;
  });

  const verified = credentials.filter(c => c.verification_status === "verified").length;
  const totalEndorsements = credentials.reduce((s, c) => s + (c.endorsement_count || 0), 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        title="Skills Marketplace"
        subtitle="Decentralized credentialing system that helps workers verify skills and employers discover verified talent across industries."
      >
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Credential
        </Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Verified Credentials" value={verified} icon={ShieldCheck} accentClass="bg-emerald-600/10 text-emerald-600" />
        <StatCard title="Total Workers" value={credentials.length} icon={Users} accentClass="bg-blue-600/10 text-blue-600" />
        <StatCard title="Endorsements" value={totalEndorsements} icon={ThumbsUp} accentClass="bg-amber-600/10 text-amber-600" />
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search skills or people..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="trades">Trades</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card border rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-muted rounded w-2/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/3 mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-heading font-bold">No credentials found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cred, i) => (
            <motion.div key={cred.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <CredentialCard credential={cred} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}