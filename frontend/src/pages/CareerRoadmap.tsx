import { useLocation } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { AnalysisResult } from "../types";

export default function CareerRoadmap() {
  const location = useLocation();
  const stateResult = (location.state as { result?: AnalysisResult } | null)?.result;
  const steps = stateResult?.careerRoadmap ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Career roadmap</h1>
      <p className="mt-1 text-sm text-muted">A sequenced path from where you are to your target role.</p>

      {!steps.length ? (
        <Card className="mt-6 text-center text-sm text-muted">
          Run a resume analysis to generate a personalized roadmap.
        </Card>
      ) : (
        <Card className="mt-6">
          <ol className="relative space-y-8 border-l border-border pl-8">
            {steps.map((step, idx) => (
              <li key={step} className="relative">
                <span className="absolute -left-[calc(2rem+1px)] flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-background text-xs font-mono text-primary">
                  {idx + 1}
                </span>
                <p className="text-sm text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
