import { TooltipProps } from "recharts";

export const CHART_RAMP = ["#6366F1", "#0891B2", "#D97706", "#059669", "#DC2626", "#7C3AED"];

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-strong rounded-xl px-3.5 py-2.5 text-xs shadow-card">
      {label && <div className="mb-1.5 font-medium text-text-primary">{label}</div>}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary">{entry.name}</span>
            <span className="ml-auto font-mono font-medium text-text-primary">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
