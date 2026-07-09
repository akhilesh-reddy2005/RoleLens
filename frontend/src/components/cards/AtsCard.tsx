import { GlassCard } from "./GlassCard";
import { ScoreRing } from "@/components/shared/ScoreRing";

interface AtsCardProps {
  label: string;
  value: number;
  description?: string;
  tone?: "primary" | "success" | "accent" | "warning";
}

export function AtsCard({ label, value, description, tone = "accent" }: AtsCardProps) {
  return (
    <GlassCard glow={tone === "warning" ? "none" : tone} className="flex items-center gap-5">
      <ScoreRing value={value} tone={tone} />
      <div>
        <span className="label-eyebrow">{label}</span>
        {description && <p className="mt-1.5 text-sm text-text-secondary">{description}</p>}
      </div>
    </GlassCard>
  );
}
