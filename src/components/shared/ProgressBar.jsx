import { cn } from "@/lib/utils";

export default function ProgressBar({ value, max, className, barClass }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={cn("w-full bg-muted rounded-full h-2.5 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", barClass || "bg-primary")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}