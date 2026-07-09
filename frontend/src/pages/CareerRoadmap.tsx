import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/cards/GlassCard";
import { useLatestOrParamAnalysis } from "@/hooks/queries/useLatestOrParamAnalysis";
import { AnalysisResult } from "@/types";
import { staggerContainer, fadeInUp } from "@/lib/animations";

export default function CareerRoadmap() {
  const location = useLocation();
  const stateResult = (location.state as { result?: AnalysisResult } | null)?.result;
  const { data: result, isLoading } = useLatestOrParamAnalysis(null, stateResult);
  const steps = result?.careerRoadmap ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-text-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
        <p className="text-sm">Loading career roadmap</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Career roadmap</h1>
      <p className="mt-1 text-sm text-text-secondary">A sequenced path from where you are to your target role.</p>

      {!steps.length ? (
        <GlassCard hover={false} className="mt-6 text-center text-sm text-text-secondary">
          Run a resume analysis to generate a personalized roadmap.
        </GlassCard>
      ) : (
        <GlassCard hover={false} className="mt-6">
          <motion.ol
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
            className="relative space-y-8 border-l border-glass-border pl-8"
          >
            {steps.map((step, idx) => (
              <motion.li key={step} variants={fadeInUp} className="relative">
                <span className="absolute -left-[calc(2rem+1px)] flex h-6 w-6 items-center justify-center rounded-full border border-brand-primary bg-bg font-mono text-xs text-brand-primary">
                  {idx + 1}
                </span>
                <p className="text-sm text-text-primary">{step}</p>
              </motion.li>
            ))}
          </motion.ol>
        </GlassCard>
      )}
    </div>
  );
}
