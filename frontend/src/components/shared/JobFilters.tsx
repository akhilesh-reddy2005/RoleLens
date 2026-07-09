import { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobFilters as JobFiltersType, RemoteType } from "@/types";
import { cn } from "@/lib/utils";

interface JobFiltersProps {
  value: JobFiltersType;
  onChange: (next: JobFiltersType) => void;
}

const REMOTE_OPTIONS: RemoteType[] = ["Remote", "Hybrid", "Onsite"];
const QUICK_LOCATIONS = ["India", "Remote worldwide"];

export function JobFilters({ value, onChange }: JobFiltersProps) {
  const [draft, setDraft] = useState<JobFiltersType>(value);

  // Keep the draft in sync if filters are cleared/changed from outside (e.g. quick chip).
  useEffect(() => {
    setDraft(value);
  }, [value]);

  function setDraftField<K extends keyof JobFiltersType>(key: K, val: JobFiltersType[K]) {
    setDraft((d) => ({ ...d, [key]: val }));
  }

  function apply(overrides?: Partial<JobFiltersType>) {
    onChange({ ...draft, ...overrides, page: 1 });
  }

  const hasFilters = Object.entries(value).some(([k, v]) => k !== "page" && v);
  const isDirty = JSON.stringify({ ...draft, page: undefined }) !== JSON.stringify({ ...value, page: undefined });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-secondary">Quick filters:</span>
        {QUICK_LOCATIONS.map((loc) => (
          <button
            key={loc}
            onClick={() => apply({ location: loc })}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              value.location === loc
                ? "border-brand-primary bg-brand-primary/15 text-brand-primary"
                : "border-glass-border bg-glass-bg text-text-secondary hover:border-white/[0.14] hover:text-text-primary"
            )}
          >
            {loc === "India" ? "🇮🇳 India" : loc}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <Input
          value={draft.location ?? ""}
          onChange={(e) => setDraftField("location", e.target.value || undefined)}
          placeholder="Location"
          className="h-10 w-40 border-glass-border bg-glass-bg text-text-primary placeholder:text-text-secondary/70"
        />
        <Input
          value={draft.company ?? ""}
          onChange={(e) => setDraftField("company", e.target.value || undefined)}
          placeholder="Company"
          className="h-10 w-40 border-glass-border bg-glass-bg text-text-primary placeholder:text-text-secondary/70"
        />
        <Input
          type="number"
          value={draft.minSalary ?? ""}
          onChange={(e) => setDraftField("minSalary", e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Min salary (INR)"
          className="h-10 w-36 border-glass-border bg-glass-bg text-text-primary placeholder:text-text-secondary/70"
        />
        <Input
          value={draft.experience ?? ""}
          onChange={(e) => setDraftField("experience", e.target.value || undefined)}
          placeholder="Experience (e.g. Senior)"
          className="h-10 w-44 border-glass-border bg-glass-bg text-text-primary placeholder:text-text-secondary/70"
        />
        <Input
          value={draft.jobType ?? ""}
          onChange={(e) => setDraftField("jobType", e.target.value || undefined)}
          placeholder="Job type (e.g. Full-time)"
          className="h-10 w-48 border-glass-border bg-glass-bg text-text-primary placeholder:text-text-secondary/70"
        />
        <Select
          value={draft.remote ?? "any"}
          onValueChange={(v) => {
            const remote = v === "any" ? undefined : (v as RemoteType);
            setDraftField("remote", remote);
            apply({ remote });
          }}
        >
          <SelectTrigger className="h-10 w-32 border-glass-border bg-glass-bg text-text-primary">
            <SelectValue placeholder="Remote" />
          </SelectTrigger>
          <SelectContent className="border-glass-border bg-surface-card text-text-primary">
            <SelectItem value="any">Any</SelectItem>
            {REMOTE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => apply()}
          disabled={!isDirty}
          className="h-10 bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90 disabled:opacity-40"
        >
          <Filter className="h-3.5 w-3.5" /> Apply filters
        </Button>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft({ page: 1 });
              onChange({ page: 1 });
            }}
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}
