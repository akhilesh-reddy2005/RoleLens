import { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface AiCardProps {
  title: string;
  icon: LucideIcon;
  tone: "success" | "warning";
  items: string[];
}

export function AiCard({ title, icon: Icon, tone, items }: AiCardProps) {
  return (
    <GlassCard hover={false}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={cn("h-4 w-4", tone === "success" ? "text-success" : "text-warning")} />
        <h3 className="font-semibold text-text-primary">{title}</h3>
      </div>
      <ul className="space-y-2.5 text-sm text-text-secondary">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                tone === "success" ? "bg-success" : "bg-warning"
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
