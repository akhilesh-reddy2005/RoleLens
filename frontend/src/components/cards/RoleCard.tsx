import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { confidenceTone } from "@/utils/confidence";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: string;
  match: number;
  confidence: string;
  reason?: string;
}

export function RoleCard({ role, match, confidence, reason }: RoleCardProps) {
  const tone = confidenceTone(confidence);
  return (
    <div className="rounded-xl border border-glass-border bg-glass-bg p-4 transition-colors hover:border-white/[0.14]">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <span className="font-medium text-text-primary">{role}</span>
        <StatusBadge label={`${confidence} confidence`} tone={tone} />
      </div>
      <div className="flex items-center gap-3">
        <Progress
          value={match}
          className={cn(
            "h-1.5 flex-1 bg-glass-border",
            tone === "success" && "[&>div]:bg-success",
            tone === "warning" && "[&>div]:bg-warning",
            tone === "accent" && "[&>div]:bg-brand-accent"
          )}
        />
        <span className="font-mono text-xs text-text-secondary">{match}%</span>
      </div>
      {reason && <p className="mt-2.5 text-sm text-text-secondary">{reason}</p>}
    </div>
  );
}
