import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Printer, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { getAnalysisDetailRequest } from "../services/resume.service";

export default function Report() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    getAnalysisDetailRequest(id)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied");
  }

  if (isLoading) return <Loader label="Preparing your report" />;

  if (!data) {
    return <Card className="text-center text-sm text-muted">Select an analysis from your history to view its report.</Card>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center print:hidden">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resume report</h1>
          <p className="mt-1 text-sm text-muted">{data.resumes?.file_name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-6 border-b border-border pb-6">
          <div>
            <span className="label-eyebrow">Resume score</span>
            <div className="mt-1 text-3xl font-semibold">{data.resume_score}</div>
          </div>
          <div>
            <span className="label-eyebrow">ATS score</span>
            <div className="mt-1 text-3xl font-semibold">{data.ats_score}</div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h2 className="mb-3 font-semibold">Recommended roles</h2>
            <div className="space-y-2">
              {(data.recommended_roles ?? []).map((r: any) => (
                <div key={r.role} className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm">
                  <span>{r.role}</span>
                  <span className="font-mono text-muted">{r.match_percentage}% &middot; {r.confidence}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 font-semibold">Strengths</h2>
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted">
                {(data.strengths ?? []).map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 font-semibold">Weaknesses</h2>
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted">
                {(data.weaknesses ?? []).map((w: string) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold">Career roadmap</h2>
            <ol className="list-decimal space-y-1 pl-4 text-sm text-muted">
              {(data.career_roadmap ?? []).map((step: string) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </Card>
    </div>
  );
}
