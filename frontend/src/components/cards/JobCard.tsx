import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, Building2, Calendar, ChevronDown, ExternalLink, Loader2, MapPin, Sparkles, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./GlassCard";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useJobDetail } from "@/hooks/queries/useJobDetail";
import { LiveJob } from "@/types";
import { formatDate, scoreTone } from "@/utils/format";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const REMOTE_TONE: Record<string, "success" | "accent" | "neutral"> = {
  Remote: "success",
  Hybrid: "accent",
  Onsite: "neutral",
};

function formatSalary(job: LiveJob) {
  const min = job.salary_min_inr;
  const max = job.salary_max_inr;
  if (!min && !max) return "Not disclosed";
  if (min && max) return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
  return `₹${(min ?? max)!.toLocaleString("en-IN")}+`;
}

interface JobCardProps {
  job: LiveJob;
  saved: boolean;
  onToggleSave: (job: LiveJob) => void;
  isSaving?: boolean;
}

export function JobCard({ job, saved, onToggleSave, isSaving }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const detailQuery = useJobDetail(expanded ? job.id : undefined);

  return (
    <GlassCard hover={false} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-11 w-11 rounded-xl">
            <AvatarImage src={job.company_logo ?? undefined} alt={job.company_name} />
            <AvatarFallback className="rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-sm font-semibold text-white">
              {initials(job.company_name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-text-primary">{job.title}</h3>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{job.company_name}</span>
            </div>
          </div>
        </div>
        <ScoreRing value={job.match.matchPercentage} size={56} strokeWidth={5} tone={scoreTone(job.match.matchPercentage)} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        <StatusBadge label={job.remote_type} tone={REMOTE_TONE[job.remote_type]} />
        {job.employment_type && <StatusBadge label={job.employment_type} tone="neutral" />}
        {job.experience_level && <StatusBadge label={`${job.experience_level} (est.)`} tone="neutral" />}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{job.location ?? "Location not specified"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{formatSalary(job)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{job.posted_at ? formatDate(job.posted_at) : "Recently posted"}</span>
        </div>
      </div>

      {(job.match.matchedSkills.length > 0 || job.match.missingSkills.length > 0) && (
        <div className="space-y-2">
          {job.match.matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.match.matchedSkills.slice(0, 6).map((skill) => (
                <span key={skill} className="rounded-full border border-success/25 bg-success/10 px-2.5 py-0.5 text-xs text-success">
                  {skill}
                </span>
              ))}
            </div>
          )}
          {job.match.missingSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.match.missingSkills.slice(0, 6).map((skill) => (
                <span key={skill} className="rounded-full border border-warning/25 bg-warning/10 px-2.5 py-0.5 text-xs text-warning">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:underline"
      >
        <Sparkles className="h-3.5 w-3.5" />
        AI explanation
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-glass-border bg-glass-bg p-3.5 text-sm text-text-secondary">
              {detailQuery.isLoading && (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating explanation...
                </span>
              )}
              {detailQuery.data?.explanation}
              {detailQuery.isError && "Could not generate an explanation right now."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto flex items-center gap-2 pt-2">
        <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button className="w-full bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
            Apply now <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onToggleSave(job)}
          disabled={isSaving}
          aria-label={saved ? "Unsave job" : "Save job"}
          className="bg-glass-bg text-text-primary hover:bg-glass-border"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-brand-accent" /> : <Bookmark className="h-4 w-4" />}
        </Button>
      </div>
    </GlassCard>
  );
}
