import { cn } from "@/lib/utils";

export default function StatCard({ title, value, subtitle, icon: Icon, accentClass }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6 hover:shadow-lg hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-white/55 font-medium">{title}</p>
          <p className="text-3xl font-heading font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-white/45 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          accentClass || "bg-primary/30 text-blue-300"
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}