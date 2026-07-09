import { useLocation } from "react-router-dom";
import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/cards/GlassCard";
import { SkillCard } from "@/components/cards/SkillCard";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";
import { SkillRadarChart } from "@/components/charts/SkillRadarChart";
import { useLatestOrParamAnalysis } from "@/hooks/queries/useLatestOrParamAnalysis";
import { AnalysisResult } from "@/types";

export default function SkillGap() {
  const location = useLocation();
  const stateResult = (location.state as { result?: AnalysisResult } | null)?.result;
  const { data: result, isLoading } = useLatestOrParamAnalysis(null, stateResult);

  const current = result?.skills.current ?? [];
  const missing = result?.skills.missing ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-text-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
        <p className="text-sm">Loading skill gap</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Skill gap analysis</h1>
      <p className="mt-1 text-sm text-text-secondary">
        What you already bring, and what would strengthen your candidacy for the recommended roles.
      </p>

      {!current.length && !missing.length ? (
        <GlassCard hover={false} className="mt-6 text-center text-sm text-text-secondary">
          Run a resume analysis to see your skill gap breakdown here.
        </GlassCard>
      ) : (
        <>
          <AnalyticsCard title="Coverage" description="Current skills vs. skills recommended for your top roles" className="mt-6">
            <SkillRadarChart current={current} missing={missing} />
          </AnalyticsCard>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <SkillCard title="Current skills" icon={CheckCircle2} tone="success" skills={current} />
            <SkillCard title="Recommended to learn" icon={CircleDashed} tone="warning" skills={missing} />
          </div>
        </>
      )}
    </div>
  );
}
