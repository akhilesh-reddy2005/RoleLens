import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { getHistoryRequest, getAnalysisDetailRequest } from "../services/resume.service";
import { AnalysisResult } from "../types";

export default function SkillGap() {
  const location = useLocation();
  const stateResult = (location.state as { result?: AnalysisResult } | null)?.result;
  const [current, setCurrent] = useState<string[]>(stateResult?.skills.current ?? []);
  const [missing, setMissing] = useState<string[]>(stateResult?.skills.missing ?? []);
  const [isLoading, setIsLoading] = useState(!stateResult);

  useEffect(() => {
    if (stateResult) return;
    setIsLoading(true);
    getHistoryRequest()
      .then(async (history) => {
        const latest = history?.[0];
        if (latest) {
          try {
            const data = await getAnalysisDetailRequest(latest.id);
            setCurrent(data.current_skills ?? []);
            setMissing(data.missing_skills ?? []);
          } catch (err) {
            console.error("Failed to load latest analysis details:", err);
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [stateResult]);

  if (isLoading) return <Loader label="Loading skill gap" />;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Skill gap analysis</h1>
      <p className="mt-1 text-sm text-muted">
        What you already bring, and what would strengthen your candidacy for the recommended roles.
      </p>

      {!current.length && !missing.length ? (
        <Card className="mt-6 text-center text-sm text-muted">
          Run a resume analysis to see your skill gap breakdown here.
        </Card>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <h2 className="font-semibold">Current skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.map((skill) => (
                <span key={skill} className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <CircleDashed className="h-4 w-4 text-warning" />
              <h2 className="font-semibold">Recommended to learn</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {missing.map((skill) => (
                <span key={skill} className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs text-warning">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
