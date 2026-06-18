import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Download, Users, Star, Plus } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/shared/StatCard";
import PageHeroBanner from "@/components/shared/PageHeroBanner";
import ResourceCard from "@/components/education/ResourceCard";

export default function Education() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: () => base44.entities.EducationResource.list(),
  });

  const filtered = resources.filter(r => {
    const matchesSearch = !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.institution?.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === "all" || r.subject_area === subjectFilter;
    const matchesType = typeFilter === "all" || r.resource_type === typeFilter;
    return matchesSearch && matchesSubject && matchesType;
  });

  const totalDownloads = resources.reduce((s, r) => s + (r.downloads || 0), 0);
  const totalCollaborators = resources.reduce((s, r) => s + (r.collaborators_count || 0), 0);
  const avgRating = resources.length > 0
    ? (resources.reduce((s, r) => s + (r.rating || 0), 0) / resources.length).toFixed(1) : 0;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeroBanner
        icon="📚"
        eyebrow="Innovation Education"
        title="Education Hub"
        subtitle="Collaborative platform where institutions share resources and develop cutting-edge curriculum for emerging technologies."
        tags={["HBCU Partners", "AI & Robotics", "Open Access"]}
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Downloads" value={totalDownloads.toLocaleString()} icon={Download} accentClass="bg-blue-600/10 text-blue-600" />
        <StatCard title="Collaborators" value={totalCollaborators} icon={Users} accentClass="bg-violet-600/10 text-violet-600" />
        <StatCard title="Avg Rating" value={avgRating} icon={Star} accentClass="bg-amber-600/10 text-amber-600" />
      </motion.div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search resources or institutions..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Subject Area" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="artificial_intelligence">AI</SelectItem>
            <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
            <SelectItem value="data_science">Data Science</SelectItem>
            <SelectItem value="cloud_computing">Cloud Computing</SelectItem>
            <SelectItem value="robotics">Robotics</SelectItem>
            <SelectItem value="renewable_energy">Renewable Energy</SelectItem>
            <SelectItem value="biotech">Biotech</SelectItem>
            <SelectItem value="advanced_manufacturing">Manufacturing</SelectItem>
            <SelectItem value="quantum_computing">Quantum Computing</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="curriculum">Curriculum</SelectItem>
            <SelectItem value="course_module">Course Module</SelectItem>
            <SelectItem value="lab_guide">Lab Guide</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="certification_prep">Cert Prep</SelectItem>
            <SelectItem value="research_paper">Research Paper</SelectItem>
            <SelectItem value="mentorship_program">Mentorship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-card border rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-3" />
              <div className="h-5 bg-muted rounded w-2/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-heading font-bold">No resources found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((resource, i) => (
            <motion.div key={resource.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ResourceCard resource={resource} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}