import { useSearchParams } from "react-router-dom";
import { Loader2, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/cards/GlassCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAnalysisDetail } from "@/hooks/queries/useAnalysisDetail";

export default function Report() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const { data, isLoading } = useAnalysisDetail(id ?? undefined);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-text-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
        <p className="text-sm">Preparing your report</p>
      </div>
    );
  }

  if (!data) {
    return (
      <GlassCard hover={false} className="text-center text-sm text-text-secondary">
        Select an analysis from your history to view its report.
      </GlassCard>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center print:hidden">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Resume report</h1>
          <p className="mt-1 text-sm text-text-secondary">{data.resumes?.file_name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleShare} className="bg-glass-bg text-text-primary hover:bg-glass-border">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="secondary" onClick={() => window.print()} className="bg-glass-bg text-text-primary hover:bg-glass-border">
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      <GlassCard hover={false}>
        <div className="grid grid-cols-2 gap-6 border-b border-glass-border pb-6">
          <div>
            <span className="label-eyebrow">Resume score</span>
            <div className="mt-1 font-display text-3xl font-bold text-text-primary">{data.resume_score}</div>
          </div>
          <div>
            <span className="label-eyebrow">ATS score</span>
            <div className="mt-1 font-display text-3xl font-bold text-text-primary">{data.ats_score}</div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h2 className="mb-3 font-semibold text-text-primary">Recommended roles</h2>
            <div className="space-y-2">
              {(data.recommended_roles ?? []).map((r) => (
                <div key={r.role} className="flex items-center justify-between rounded-xl border border-glass-border px-4 py-3 text-sm">
                  <span className="text-text-primary">{r.role}</span>
                  <span className="font-mono text-text-secondary">
                    {r.match_percentage}% &middot; {r.confidence}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-glass-border" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 font-semibold text-text-primary">Strengths</h2>
              <ul className="list-disc space-y-1 pl-4 text-sm text-text-secondary">
                {(data.strengths ?? []).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 font-semibold text-text-primary">Weaknesses</h2>
              <ul className="list-disc space-y-1 pl-4 text-sm text-text-secondary">
                {(data.weaknesses ?? []).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="bg-glass-border" />

          <div>
            <h2 className="mb-3 font-semibold text-text-primary">Career roadmap</h2>
            <ol className="list-decimal space-y-1 pl-4 text-sm text-text-secondary">
              {(data.career_roadmap ?? []).map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
