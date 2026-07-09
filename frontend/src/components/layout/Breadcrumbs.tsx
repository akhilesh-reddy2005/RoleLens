import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  dashboard: "Overview",
  upload: "Upload resume",
  analysis: "Resume analysis",
  "skill-gap": "Skill gap",
  roadmap: "Career roadmap",
  history: "History",
  report: "Report",
  jobs: "Live jobs",
  insights: "Job insights",
  settings: "Settings",
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm text-text-secondary">
      {segments.map((segment, idx) => {
        const path = "/" + segments.slice(0, idx + 1).join("/");
        const isLast = idx === segments.length - 1;
        const label = LABELS[segment] ?? segment;
        return (
          <span key={path} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-secondary/50" />}
            {isLast ? (
              <span className="font-medium text-text-primary">{label}</span>
            ) : (
              <Link to={path} className="hover:text-text-primary">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
