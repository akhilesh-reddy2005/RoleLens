import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Gauge, Target, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Loader, Skeleton } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import { getDashboardRequest } from "../services/resume.service";
import { DashboardSummary } from "../types";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardRequest()
      .then(setSummary)
      .catch(() => setError("Could not load your dashboard right now."))
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    {
      label: "Resume score",
      value: summary?.resumeScore,
      icon: FileText,
      tone: "primary" as const,
    },
    {
      label: "ATS score",
      value: summary?.atsScore,
      icon: Gauge,
      tone: "success" as const,
    },
    {
      label: "Skill match",
      value: summary?.skillMatch,
      icon: Target,
      tone: "warning" as const,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted">Here is where your resume stands today.</p>
        </div>
        <Link to="/dashboard/upload">
          <Button>Analyze a new resume</Button>
        </Link>
      </div>

      {error && <p className="mb-6 text-sm text-danger">{error}</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <div className="flex items-center justify-between">
              <span className="label-eyebrow">{c.label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-border/40 text-muted">
                <c.icon className="h-4 w-4" />
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="mt-4 h-8 w-16" />
            ) : (
              <div className="mt-3 text-3xl font-semibold">
                {c.value != null ? `${c.value}${c.label === "Skill match" ? "%" : ""}` : "—"}
              </div>
            )}
            {c.value != null && (
              <div className="mt-4">
                <ProgressBar value={c.value} tone={c.tone} />
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent analyses</h2>
            <Link to="/dashboard/history" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <Loader label="Loading recent activity" />
          ) : summary?.recentAnalyses?.length ? (
            <div className="divide-y divide-border">
              {summary.recentAnalyses.map((a) => (
                <Link
                  key={a.id}
                  to={`/dashboard/analysis?id=${a.id}`}
                  className="flex items-center justify-between py-3.5 text-sm hover:text-primary"
                >
                  <div>
                    <div className="font-medium text-ink">{a.resumes?.file_name ?? "Resume"}</div>
                    <div className="text-xs text-muted">
                      {new Date(a.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-muted">Score {a.resume_score}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted">
              No analyses yet.{" "}
              <Link to="/dashboard/upload" className="text-primary hover:underline">
                Upload your first resume
              </Link>
              .
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Top recommended role</h2>
          </div>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : summary?.topRole ? (
            <div>
              <div className="text-lg font-semibold text-ink">{summary.topRole}</div>
              <p className="mt-2 text-sm text-muted">
                Based on your most recent analysis. Open the full report to see the reasoning and
                match breakdown.
              </p>
              <Link to="/dashboard/analysis" className="mt-4 inline-block text-sm text-primary hover:underline">
                View analysis
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted">Upload a resume to see your top-matched role.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
