import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, Users, Factory } from "lucide-react";
import SupplyChainTimeline from "./SupplyChainTimeline";

export default function ProductDetailModal({ product, open, onClose }) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{product.product_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Factory className="w-4 h-4" /> {product.manufacturer}
            <span className="mx-1">•</span>
            <MapPin className="w-4 h-4" /> {product.origin_city}, {product.origin_state}
          </div>

          <p className="text-sm text-foreground leading-relaxed">{product.description}</p>

          {/* Domestic Content */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">Domestic Content</span>
              <span className="text-2xl font-heading font-bold text-emerald-700">{product.domestic_content_pct}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-2.5">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${product.domestic_content_pct}%` }} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-card border rounded-lg flex items-center gap-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Jobs Supported</p>
                <p className="text-sm font-semibold">{product.jobs_supported || "N/A"}</p>
              </div>
            </div>
            <div className="p-3 bg-card border rounded-lg flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Materials</p>
                <p className="text-sm font-semibold">{product.materials_source || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {product.certifications?.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map(cert => (
                  <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Supply Chain Timeline */}
          {product.supply_chain_steps?.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Supply Chain Journey</h4>
              <SupplyChainTimeline steps={product.supply_chain_steps} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}