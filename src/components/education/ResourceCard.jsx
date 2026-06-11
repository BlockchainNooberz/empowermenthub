import { Badge } from "@/components/ui/badge";
import { Download, Star, Users, Lock, Globe, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const accessIcons = {
  open: { icon: Globe, label: "Open Access", className: "bg-emerald-100 text-emerald-700" },
  registered: { icon: Lock, label: "Registered", className: "bg-blue-100 text-blue-700" },
  institutional: { icon: Building2, label: "Institutional", className: "bg-violet-100 text-violet-700" },
};

const typeLabels = {
  curriculum: "Curriculum", course_module: "Course Module", lab_guide: "Lab Guide",
  research_paper: "Research Paper", workshop: "Workshop",
  certification_prep: "Cert Prep", mentorship_program: "Mentorship"
};

const subjectLabels = {
  artificial_intelligence: "AI", cybersecurity: "Cybersecurity", data_science: "Data Science",
  cloud_computing: "Cloud", robotics: "Robotics", renewable_energy: "Renewable Energy",
  biotech: "Biotech", advanced_manufacturing: "Manufacturing", blockchain: "Blockchain",
  quantum_computing: "Quantum"
};

export default function ResourceCard({ resource }) {
  const access = accessIcons[resource.access_level] || accessIcons.open;
  const AccessIcon = access.icon;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <Badge className={cn("text-[10px] uppercase tracking-wider flex items-center gap-1", access.className)}>
          <AccessIcon className="w-3 h-3" /> {access.label}
        </Badge>
        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
          {typeLabels[resource.resource_type] || resource.resource_type}
        </Badge>
      </div>

      <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
        {resource.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-1">{resource.institution}</p>
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>

      <Badge variant="secondary" className="text-[10px] mb-4">
        {subjectLabels[resource.subject_area] || resource.subject_area}
      </Badge>

      {resource.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> {(resource.downloads || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {resource.collaborators_count || 0}
          </span>
        </div>
        {resource.rating > 0 && (
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-500" /> {resource.rating}
          </span>
        )}
      </div>
    </div>
  );
}