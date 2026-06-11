import { MapPin, Users, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProgressBar from "@/components/shared/ProgressBar";
import { cn } from "@/lib/utils";

const creditColors = {
  excellent: "bg-emerald-100 text-emerald-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-amber-100 text-amber-700",
  building: "bg-orange-100 text-orange-700",
};

const statusLabels = {
  seeking_funding: "Seeking Funding",
  partially_funded: "Partially Funded",
  fully_funded: "Fully Funded",
  repaying: "Repaying",
  completed: "Completed",
};

export default function LoanCard({ loan, onClick }) {
  const fundedPct = loan.amount_requested > 0
    ? Math.round((loan.amount_funded || 0) / loan.amount_requested * 100)
    : 0;

  return (
    <div 
      onClick={() => onClick?.(loan)}
      className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {loan.business_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{loan.location}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-heading font-bold text-foreground">
            ${loan.amount_requested?.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">requested</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{loan.description}</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-foreground">{fundedPct}% funded</span>
          <span className="text-muted-foreground">${(loan.amount_funded || 0).toLocaleString()}</span>
        </div>
        <ProgressBar 
          value={loan.amount_funded || 0} 
          max={loan.amount_requested} 
          barClass={fundedPct >= 100 ? "bg-emerald-500" : "bg-blue-600"} 
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className={cn("text-[10px] uppercase tracking-wider", creditColors[loan.credit_score])}>
            {loan.credit_score} credit
          </Badge>
          {loan.underserved_area && (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700">
              Underserved Area
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {loan.lender_count || 0}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {loan.interest_rate}%
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {loan.term_months}mo
          </span>
        </div>
      </div>
    </div>
  );
}