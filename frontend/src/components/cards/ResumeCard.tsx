import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { formatDate, scoreTone } from "@/utils/format";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface ResumeCardProps {
  id: string;
  fileName: string;
  score: number;
  date: string;
}

export function ResumeCard({ id, fileName, score, date }: ResumeCardProps) {
  return (
    <Link
      to={`/dashboard/analysis?id=${id}`}
      className="flex items-center justify-between gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-glass-bg"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-text-primary">{fileName}</div>
          <div className="text-xs text-text-secondary">{formatDate(date)}</div>
        </div>
      </div>
      <StatusBadge label={`Score ${score}`} tone={scoreTone(score)} />
    </Link>
  );
}
