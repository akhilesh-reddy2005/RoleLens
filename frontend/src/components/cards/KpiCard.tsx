import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: number | null | undefined;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  tone?: "primary" | "success" | "accent" | "warning";
  isLoading?: boolean;
  showProgress?: boolean;
}

const TONE_ICON: Record<string, string> = {
  primary: "bg-brand-primary/10 text-brand-primary",
  success: "bg-success/10 text-success",
  accent: "bg-brand-accent/10 text-brand-accent",
  warning: "bg-warning/10 text-warning",
};

const TONE_PROGRESS: Record<string, string> = {
  primary: "[&>div]:bg-brand-primary",
  success: "[&>div]:bg-success",
  accent: "[&>div]:bg-brand-accent",
  warning: "[&>div]:bg-warning",
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  prefix = "",
  suffix = "",
  tone = "primary",
  isLoading,
  showProgress = true,
}: KpiCardProps) {
  return (
    <GlassCard glow={tone === "warning" ? "none" : tone}>
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">{label}</span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", TONE_ICON[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-4 h-9 w-20 bg-glass-bg" />
      ) : (
        <div className="mt-3 font-display text-4xl font-bold text-text-primary">
          {value != null ? (
            <>
              {prefix}
              <AnimatedCounter value={value} suffix={suffix} />
            </>
          ) : (
            "—"
          )}
        </div>
      )}
      {value != null && showProgress && (
        <div className="mt-4">
          <Progress value={value} className={cn("h-1.5 bg-glass-border", TONE_PROGRESS[tone])} />
        </div>
      )}
    </GlassCard>
  );
}
