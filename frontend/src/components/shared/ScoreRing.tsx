import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./AnimatedCounter";

interface ScoreRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: "primary" | "success" | "accent" | "warning" | "danger";
  className?: string;
}

const TONE_STROKE: Record<string, string> = {
  primary: "stroke-brand-primary",
  success: "stroke-success",
  accent: "stroke-brand-accent",
  warning: "stroke-warning",
  danger: "stroke-danger",
};

export function ScoreRing({ value, size = 96, strokeWidth = 8, tone = "primary", className }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-glass-border"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("fill-none", TONE_STROKE[tone])}
          style={{ strokeDasharray: circumference }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-text-primary">
        <AnimatedCounter value={clamped} />
      </div>
    </div>
  );
}
