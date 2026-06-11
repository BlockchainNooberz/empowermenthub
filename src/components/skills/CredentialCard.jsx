import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, AlertCircle, MapPin, ThumbsUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusConfig = {
  verified: { icon: ShieldCheck, label: "Verified", className: "bg-emerald-100 text-emerald-700" },
  pending: { icon: Clock, label: "Pending", className: "bg-amber-100 text-amber-700" },
  expired: { icon: AlertCircle, label: "Expired", className: "bg-red-100 text-red-700" },
};

const levelColors = {
  beginner: "bg-slate-100 text-slate-600",
  intermediate: "bg-blue-100 text-blue-600",
  advanced: "bg-violet-100 text-violet-600",
  expert: "bg-amber-100 text-amber-700",
};

const categoryLabels = {
  technology: "Technology", healthcare: "Healthcare", manufacturing: "Manufacturing",
  trades: "Trades", finance: "Finance", education: "Education",
  engineering: "Engineering", creative: "Creative", other: "Other"
};

export default function CredentialCard({ credential }) {
  const status = statusConfig[credential.verification_status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
            {credential.skill_name}
          </h3>
          <p className="text-sm text-muted-foreground">{credential.holder_name}</p>
        </div>
        <Badge className={cn("text-[10px] uppercase tracking-wider flex items-center gap-1", status.className)}>
          <StatusIcon className="w-3 h-3" /> {status.label}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{credential.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant="secondary" className={cn("text-[10px] uppercase tracking-wider", levelColors[credential.level])}>
          {credential.level}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {categoryLabels[credential.category] || credential.category}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {credential.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {credential.location}
            </span>
          )}
          {credential.issue_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {format(new Date(credential.issue_date), "MMM yyyy")}
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <ThumbsUp className="w-3.5 h-3.5" /> {credential.endorsement_count || 0}
        </span>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2">
        Issued by {credential.issuing_organization}
      </p>
    </div>
  );
}