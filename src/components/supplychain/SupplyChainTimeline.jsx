import { CheckCircle2, Circle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupplyChainTimeline({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2",
              step.domestic 
                ? "bg-emerald-100 border-emerald-500 text-emerald-600" 
                : "bg-amber-100 border-amber-500 text-amber-600"
            )}>
              {step.domestic ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </div>
            {i < steps.length - 1 && (
              <div className="w-0.5 h-8 bg-border" />
            )}
          </div>
          {/* Content */}
          <div className="pb-4">
            <p className="text-sm font-medium text-foreground">{step.step}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3" /> {step.location}
              <span className={cn(
                "ml-2 text-[10px] uppercase tracking-wider font-semibold",
                step.domestic ? "text-emerald-600" : "text-amber-600"
              )}>
                {step.domestic ? "Domestic" : "Imported"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}