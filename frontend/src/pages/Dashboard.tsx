import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Gauge, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCard } from "@/components/cards/KpiCard";
import { GlassCard } from "@/components/cards/GlassCard";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";
import { ResumeCard } from "@/components/cards/ResumeCard";
import { RoleCard } from "@/components/cards/RoleCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ScoreTrendChart } from "@/components/charts/ScoreTrendChart";
import { useDashboard } from "@/hooks/queries/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { firstName } from "@/utils/format";
import { Inbox } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: summary, isLoading, isError } = useDashboard();

  const trend = (summary?.recentAnalyses ?? [])
    .slice()
    .reverse()
    .map((a) => ({ date: a.created_at, resumeScore: a.resume_score, atsScore: a.ats_score }));

  const topAnalysis = summary?.recentAnalyses?.[0];
  const topRole = topAnalysis?.recommended_roles?.[0];

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Welcome back{user?.fullName ? `, ${firstName(user.fullName)}` : ""}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Here is where your resume stands today.</p>
        </div>
        <Link to="/dashboard/upload">
          <Button className="bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
            Analyze a new resume
          </Button>
        </Link>
      </div>

      {isError && <p className="mb-6 text-sm text-danger">Could not load your dashboard right now.</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Resume score" value={summary?.resumeScore} icon={FileText} tone="primary" isLoading={isLoading} />
        <KpiCard label="ATS score" value={summary?.atsScore} icon={Gauge} tone="success" isLoading={isLoading} />
        <KpiCard label="Skill match" value={summary?.skillMatch} suffix="%" icon={Target} tone="accent" isLoading={isLoading} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <AnalyticsCard title="Score trend" description="Resume and ATS score across your recent analyses" className="lg:col-span-2">
          {isLoading ? (
            <Skeleton className="h-[240px] w-full bg-glass-bg" />
          ) : trend.length > 1 ? (
            <ScoreTrendChart data={trend} />
          ) : (
            <EmptyState icon={TrendingUp} title="Not enough data yet" description="Analyze a few resumes to see your trend." />
          )}
        </AnalyticsCard>

        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-primary" />
            <h2 className="font-semibold text-text-primary">Top recommended role</h2>
          </div>
          {isLoading ? (
            <Skeleton className="h-24 w-full bg-glass-bg" />
          ) : topRole ? (
            <RoleCard role={topRole.role} match={topRole.match_percentage} confidence={topRole.confidence} />
          ) : summary?.topRole ? (
            <div className="text-lg font-semibold text-text-primary">{summary.topRole}</div>
          ) : (
            <p className="text-sm text-text-secondary">Upload a resume to see your top-matched role.</p>
          )}
          {(topRole || summary?.topRole) && (
            <Link to="/dashboard/analysis" className="mt-4 inline-block text-sm text-brand-primary hover:underline">
              View analysis
            </Link>
          )}
        </GlassCard>
      </div>

      <GlassCard hover={false} className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Recent analyses</h2>
          <Link to="/dashboard/history" className="flex items-center gap-1 text-sm text-brand-primary hover:underline">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-12 w-full bg-glass-bg" />
            <Skeleton className="h-12 w-full bg-glass-bg" />
            <Skeleton className="h-12 w-full bg-glass-bg" />
          </div>
        ) : summary?.recentAnalyses?.length ? (
          <div className="divide-y divide-glass-border">
            {summary.recentAnalyses.map((a) => (
              <ResumeCard
                key={a.id}
                id={a.id}
                fileName={a.resumes?.file_name ?? "Resume"}
                score={a.resume_score}
                date={a.created_at}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No analyses yet"
            description="Upload your first resume to get an AI-scored breakdown."
            action={
              <Link to="/dashboard/upload">
                <Button className="bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">Upload resume</Button>
              </Link>
            }
          />
        )}
      </GlassCard>
    </div>
  );
}
