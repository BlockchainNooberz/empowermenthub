import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, DollarSign, Building2, TrendingUp } from "lucide-react";
import ProgressBar from "@/components/shared/ProgressBar";

const businessTypeLabels = {
  retail: "Retail", food_service: "Food Service", manufacturing: "Manufacturing",
  technology: "Technology", healthcare: "Healthcare", agriculture: "Agriculture",
  services: "Services", construction: "Construction", other: "Other"
};

export default function LoanDetailModal({ loan, open, onClose }) {
  if (!loan) return null;

  const fundedPct = loan.amount_requested > 0
    ? Math.round((loan.amount_funded || 0) / loan.amount_requested * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">{loan.business_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" /> {loan.location}
            {loan.underserved_area && (
              <Badge className="bg-amber-100 text-amber-700 text-[10px] uppercase tracking-wider ml-2">
                Underserved Area
              </Badge>
            )}
          </div>

          <p className="text-sm text-foreground leading-relaxed">{loan.description}</p>

          {/* Funding Progress */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Funding Progress</p>
                <p className="text-2xl font-heading font-bold">${(loan.amount_funded || 0).toLocaleString()}</p>
              </div>
              <p className="text-sm text-muted-foreground">of ${loan.amount_requested?.toLocaleString()}</p>
            </div>
            <ProgressBar value={loan.amount_funded || 0} max={loan.amount_requested} barClass="bg-blue-600" className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">{fundedPct}% funded by {loan.lender_count || 0} community lenders</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Business Type</p>
                <p className="text-sm font-medium">{businessTypeLabels[loan.business_type] || loan.business_type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Interest Rate</p>
                <p className="text-sm font-medium">{loan.interest_rate}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Term</p>
                <p className="text-sm font-medium">{loan.term_months} months</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Employees</p>
                <p className="text-sm font-medium">{loan.employees || "N/A"}</p>
              </div>
            </div>
          </div>

          {loan.annual_revenue > 0 && (
            <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Annual Revenue</p>
                <p className="text-sm font-medium">${loan.annual_revenue?.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <DollarSign className="w-4 h-4 mr-2" /> Fund This Business
            </Button>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}