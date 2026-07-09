import { Briefcase, Building2, MapPin, TrendingUp, Wallet } from "lucide-react";
import { KpiCard } from "@/components/cards/KpiCard";
import { AnalyticsCard } from "@/components/cards/AnalyticsCard";
import { GlassCard } from "@/components/cards/GlassCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingBarChart } from "@/components/charts/TrendingBarChart";
import { ScoreDonutChart } from "@/components/charts/ScoreDonutChart";
import { useJobDashboard } from "@/hooks/queries/useJobDashboard";

export default function JobInsights() {
  const { data, isLoading } = useJobDashboard();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Job market insights</h1>
      <p className="mt-1 text-sm text-text-secondary">Aggregated from the live postings cache, refreshed automatically.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Live job count" value={data?.liveJobCount} icon={Briefcase} tone="primary" isLoading={isLoading} />
        <KpiCard
          label="Average salary"
          value={data?.salaryInsights?.average}
          prefix="₹"
          icon={Wallet}
          tone="success"
          isLoading={isLoading}
          showProgress={false}
        />
        <KpiCard
          label="Hiring companies tracked"
          value={data?.hiringCompanies.length}
          icon={Building2}
          tone="accent"
          isLoading={isLoading}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <AnalyticsCard title="Trending skills" description="Most requested skills across live postings">
          {isLoading ? (
            <Skeleton className="h-56 w-full bg-glass-bg" />
          ) : data?.trendingSkills.length ? (
            <TrendingBarChart data={data.trendingSkills} />
          ) : (
            <EmptyState icon={TrendingUp} title="No data yet" description="Check back once the live feed has refreshed." />
          )}
        </AnalyticsCard>

        <AnalyticsCard title="Hiring companies" description="Companies with the most open postings right now">
          {isLoading ? (
            <Skeleton className="h-56 w-full bg-glass-bg" />
          ) : data?.hiringCompanies.length ? (
            <TrendingBarChart data={data.hiringCompanies} />
          ) : (
            <EmptyState icon={Building2} title="No data yet" />
          )}
        </AnalyticsCard>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <GlassCard hover={false}>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-primary" />
            <h3 className="font-semibold text-text-primary">Hiring locations</h3>
          </div>
          {isLoading ? (
            <Skeleton className="h-40 w-full bg-glass-bg" />
          ) : data?.hiringLocations.length ? (
            <div className="space-y-2.5">
              {data.hiringLocations.map((loc) => (
                <div key={loc.name} className="flex items-center justify-between text-sm">
                  <span className="text-text-primary">{loc.name}</span>
                  <span className="font-mono text-xs text-text-secondary">{loc.count} postings</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">No location data yet.</p>
          )}
        </GlassCard>

        <AnalyticsCard title="Your match distribution" description="How your resume's skills line up against current live postings">
          {isLoading ? (
            <Skeleton className="h-56 w-full bg-glass-bg" />
          ) : data?.matchAnalytics ? (
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ScoreDonutChart
                resumeScore={data.matchAnalytics.find((b) => b.label === "80-100%")?.count ?? 0}
                atsScore={data.matchAnalytics.find((b) => b.label === "60-79%")?.count ?? 0}
                size={160}
              />
              <div className="space-y-2 text-sm">
                {data.matchAnalytics.map((bucket) => (
                  <div key={bucket.label} className="flex items-center justify-between gap-6">
                    <span className="text-text-secondary">{bucket.label} match</span>
                    <span className="font-mono text-text-primary">{bucket.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="Upload a resume first"
              description="Match distribution is computed against your most recent resume analysis."
            />
          )}
        </AnalyticsCard>
      </div>

      {data?.salaryInsights && (
        <GlassCard hover={false} className="mt-6">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-success" />
            <h3 className="font-semibold text-text-primary">Salary insights</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="label-eyebrow">Min</div>
              <div className="mt-1 font-display text-xl font-bold text-text-primary">
                ₹{data.salaryInsights.min.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="label-eyebrow">Average</div>
              <div className="mt-1 font-display text-xl font-bold text-text-primary">
                ₹{data.salaryInsights.average.toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <div className="label-eyebrow">Max</div>
              <div className="mt-1 font-display text-xl font-bold text-text-primary">
                ₹{data.salaryInsights.max.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-text-secondary">Based on {data.salaryInsights.sampleSize} disclosed data points.</p>
        </GlassCard>
      )}
    </div>
  );
}
