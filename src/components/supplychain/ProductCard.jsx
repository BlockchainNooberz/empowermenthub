import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck, AlertCircle, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  verified: { icon: ShieldCheck, label: "Verified", className: "bg-emerald-100 text-emerald-700" },
  pending: { icon: Clock, label: "Pending", className: "bg-amber-100 text-amber-700" },
  flagged: { icon: AlertCircle, label: "Flagged", className: "bg-red-100 text-red-700" },
};

export default function ProductCard({ product, onClick }) {
  const status = statusConfig[product.verification_status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div 
      onClick={() => onClick?.(product)}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
    >
      {/* Domestic Content Bar */}
      <div className="h-1.5 bg-muted">
        <div 
          className="h-full bg-emerald-500 transition-all duration-700"
          style={{ width: `${product.domestic_content_pct || 0}%` }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
              {product.product_name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
          </div>
          <Badge className={cn("text-[10px] uppercase tracking-wider flex items-center gap-1", status.className)}>
            <StatusIcon className="w-3 h-3" /> {status.label}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{product.origin_city}, {product.origin_state}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-emerald-600">{product.domestic_content_pct}% domestic</span>
            {product.jobs_supported > 0 && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5" /> {product.jobs_supported} jobs
              </span>
            )}
          </div>
        </div>

        {product.certifications?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.certifications.map(cert => (
              <span key={cert} className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                {cert}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}