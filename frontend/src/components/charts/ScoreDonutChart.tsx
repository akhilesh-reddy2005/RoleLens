import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface ScoreDonutChartProps {
  resumeScore: number;
  atsScore: number;
  size?: number;
}

export function ScoreDonutChart({ resumeScore, atsScore, size = 200 }: ScoreDonutChartProps) {
  const data = [
    { name: "Resume score", value: resumeScore },
    { name: "ATS score", value: atsScore },
    { name: "Remaining", value: Math.max(0, 200 - resumeScore - atsScore) },
  ];
  const colors = ["#6366F1", "#06B6D4", "rgba(255,255,255,0.06)"];

  return (
    <ResponsiveContainer width="100%" height={size}>
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="90%"
          paddingAngle={2}
          animationDuration={900}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index]} stroke="none" />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
