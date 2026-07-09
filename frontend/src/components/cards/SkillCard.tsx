import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  title: string;
  icon: LucideIcon;
  tone: "success" | "warning";
  skills: string[];
  emptyMessage?: string;
}

export function SkillCard({ title, icon: Icon, tone, skills, emptyMessage = "None yet." }: SkillCardProps) {
  return (
    <GlassCard hover={false}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={cn("h-4 w-4", tone === "success" ? "text-success" : "text-warning")} />
        <h3 className="font-semibold text-text-primary">{title}</h3>
      </div>
      {skills.length ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                tone === "success"
                  ? "border-success/25 bg-success/10 text-success"
                  : "border-warning/25 bg-warning/10 text-warning"
              )}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">{emptyMessage}</p>
      )}
    </GlassCard>
  );
}
