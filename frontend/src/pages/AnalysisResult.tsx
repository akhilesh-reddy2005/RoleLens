import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle2, Download, Target, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Loader } from "../components/ui/Loader";
import { Button } from "../components/ui/Button";
import { getAnalysisDetailRequest, getHistoryRequest } from "../services/resume.service";
import { AnalysisResult as AnalysisResultType } from "../types";

const CONFIDENCE_TONE: Record<string, "success" | "warning" | "primary"> = {
  High: "success",
  Medium: "warning",
  Low: "primary",
};

export default function AnalysisResultPage() {
  const location = useLocation();
  const [params] = useSearchParams();
  const analysisId = params.get("id");
  const stateResult = (location.state as { result?: AnalysisResultType } | null)?.result;

  const [result, setResult] = useState<AnalysisResultType | null>(stateResult ?? null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (stateResult) {
      setIsLoading(false);
      return;
    }

    async function loadAnalysis() {
      try {
        let targetId = analysisId;
        if (!targetId) {
          const history = await getHistoryRequest();
          const latest = history?.[0];
          if (latest) {
            targetId = latest.id;
          }
        }

        if (targetId) {
          const data = await getAnalysisDetailRequest(targetId);
          setResult({
            analysisId: data.id,
            resumeScore: data.resume_score,
            atsScore: data.ats_score,
            recommendedRoles: (data.recommended_roles ?? []).map((r: any) => ({
              role: r.role,
              match: r.match_percentage,
              confidence: r.confidence,
              reason: r.reason,
            })),
            skills: { current: data.current_skills ?? [], missing: data.missing_skills ?? [] },
            strengths: data.strengths ?? [],
            weaknesses: data.weaknesses ?? [],
            careerRoadmap: data.career_roadmap ?? [],
          });
        }
      } catch (err) {
        console.error("Failed to load analysis details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalysis();
  }, [analysisId, stateResult]);

  if (isLoading) return <Loader label="Loading your analysis" />;

  if (!result) {
    return (
      <Card className="text-center">
        <p className="text-sm text-muted">
          No analysis selected yet.{" "}
          <Link to="/dashboard/upload" className="text-primary hover:underline">
            Upload a resume
          </Link>{" "}
          to get started.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resume analysis</h1>
          <p className="mt-1 text-sm text-muted">AI-generated scoring and role recommendations.</p>
        </div>
        <Link to={`/dashboard/report?id=${result.analysisId}`}>
          <Button variant="secondary">
            <Download className="h-4 w-4" /> View report
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <span className="label-eyebrow">Resume score</span>
          <div className="mt-2 text-4xl font-semibold">{result.resumeScore}</div>
          <div className="mt-4">
            <ProgressBar value={result.resumeScore} tone="primary" />
          </div>
        </Card>
        <Card>
          <span className="label-eyebrow">ATS score</span>
          <div className="mt-2 text-4xl font-semibold">{result.atsScore}</div>
          <div className="mt-4">
            <ProgressBar value={result.atsScore} tone="success" />
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="mb-5 font-semibold">Recommended roles</h2>
        <div className="space-y-5">
          {result.recommendedRoles.map((role) => (
            <div key={role.role} className="border-b border-border pb-5 last:border-0 last:pb-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-ink">{role.role}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    role.confidence === "High"
                      ? "bg-success/10 text-success"
                      : role.confidence === "Medium"
                      ? "bg-warning/10 text-warning"
                      : "bg-border/60 text-muted"
                  }`}
                >
                  {role.confidence} confidence
                </span>
              </div>
              <ProgressBar value={role.match} label={`${role.match}% match`} tone={CONFIDENCE_TONE[role.confidence]} />
              <p className="mt-2 text-sm text-muted">{role.reason}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <h2 className="font-semibold">Strengths</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted">
            {result.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-warning" />
            <h2 className="font-semibold">Weaknesses</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted">
            {result.weaknesses.map((w) => (
              <li key={w} className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-warning" /> {w}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
