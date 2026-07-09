import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface SkillRadarChartProps {
  current: string[];
  missing: string[];
}

function buildRadarData(current: string[], missing: string[]) {
  const skills = [...current.slice(0, 5), ...missing.slice(0, 5)];
  return skills.map((skill) => ({
    skill,
    "You have": current.includes(skill) ? 100 : 0,
    Recommended: missing.includes(skill) ? 100 : 0,
  }));
}

export function SkillRadarChart({ current, missing }: SkillRadarChartProps) {
  const data = buildRadarData(current, missing);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11 }} />
        <Tooltip content={<ChartTooltip />} />
        <Radar
          name="You have"
          dataKey="You have"
          stroke="#10B981"
          fill="#10B981"
          fillOpacity={0.25}
          animationDuration={900}
        />
        <Radar
          name="Recommended"
          dataKey="Recommended"
          stroke="#F59E0B"
          fill="#F59E0B"
          fillOpacity={0.2}
          animationDuration={900}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
