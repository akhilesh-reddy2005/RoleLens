import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Download, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/cards/GlassCard";
import { AtsCard } from "@/components/cards/AtsCard";
import { AiCard } from "@/components/cards/AiCard";
import { RoleCard } from "@/components/cards/RoleCard";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";
import { RoleMatchBarChart } from "@/components/charts/RoleMatchBarChart";
import { useLatestOrParamAnalysis } from "@/hooks/queries/useLatestOrParamAnalysis";
import { AnalysisResult as AnalysisResultType } from "@/types";

export default function AnalysisResultPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const analysisId = params.get("id");
  const stateResult = (location.state as { result?: AnalysisResultType } | null)?.result;

  const { data: result, isLoading } = useLatestOrParamAnalysis(analysisId, stateResult);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-text-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
        <p className="text-sm">Loading your analysis</p>
      </div>
    );
  }

  if (!result) {
    return (
      <GlassCard hover={false} className="text-center">
        <p className="text-sm text-text-secondary">
          No analysis selected yet.{" "}
          <Link to="/dashboard/upload" className="text-brand-primary hover:underline">
            Upload a resume
          </Link>{" "}
          to get started.
        </p>
      </GlassCard>
    );
  }

  const roleChartData = result.recommendedRoles.map((r) => ({ role: r.role, match: r.match }));

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Resume analysis</h1>
          <p className="mt-1 text-sm text-text-secondary">AI-generated scoring and role recommendations.</p>
        </div>
        <Link to={`/dashboard/report?id=${result.analysisId}`}>
          <Button variant="secondary" className="bg-glass-bg text-text-primary hover:bg-glass-border">
            <Download className="h-4 w-4" /> View report
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <AtsCard label="Resume score" value={result.resumeScore} tone="primary" description="Overall strength of your resume content." />
        <AtsCard label="ATS score" value={result.atsScore} tone="success" description="How well applicant tracking systems parse it." />
      </div>

      {roleChartData.length > 0 && (
        <AnalyticsCard title="Role match breakdown" description="How closely your resume aligns with each recommended role" className="mt-6">
          <RoleMatchBarChart data={roleChartData} />
        </AnalyticsCard>
      )}

      <GlassCard hover={false} className="mt-6">
        <h2 className="mb-5 font-semibold text-text-primary">Recommended roles</h2>
        <div className="space-y-3">
          {result.recommendedRoles.map((role) => (
            <RoleCard key={role.role} role={role.role} match={role.match} confidence={role.confidence} reason={role.reason} />
          ))}
        </div>
      </GlassCard>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <AiCard title="Strengths" icon={TrendingUp} tone="success" items={result.strengths} />
        <AiCard title="Weaknesses" icon={TrendingDown} tone="warning" items={result.weaknesses} />
      </div>
    </div>
  );
}
