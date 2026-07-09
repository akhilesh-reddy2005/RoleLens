import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: "primary" | "secondary" | "accent" | "success" | "none";
}

const GLOW_CLASS: Record<string, string> = {
  primary: "hover:shadow-glow-primary",
  secondary: "hover:shadow-glow-secondary",
  accent: "hover:shadow-glow-accent",
  success: "hover:shadow-glow-success",
  none: "",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, glow = "none", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -3 } : undefined}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "glass rounded-2xl p-6 shadow-card transition-shadow duration-300",
          hover && "hover:border-white/[0.14]",
          GLOW_CLASS[glow],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
