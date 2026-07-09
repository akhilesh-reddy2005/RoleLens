import { NormalizedJob } from "../../../types";

export interface JobProvider {
  name: string;
  isEnabled(): boolean;
  fetchJobs(): Promise<NormalizedJob[]>;
}

const EXPERIENCE_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\b(intern|internship)\b/i, label: "Internship" },
  { pattern: /\b(entry[- ]level|junior|jr\.?)\b/i, label: "Entry level" },
  { pattern: /\b(senior|sr\.?|lead|staff|principal)\b/i, label: "Senior" },
  { pattern: /\b(\d+)\+?\s*(?:to\s*\d+\s*)?years?\b/i, label: "" },
  { pattern: /\bmid[- ]level\b/i, label: "Mid level" },
];

/** Best-effort experience level guess from title/description text — not a structured field from any source API. */
export function guessExperienceLevel(text: string): string | null {
  for (const { pattern, label } of EXPERIENCE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return label || `${match[1]}+ years`;
    }
  }
  return null;
}

export function guessRemoteType(text: string, explicitRemote?: boolean): "Remote" | "Hybrid" | "Onsite" {
  const lower = text.toLowerCase();
  if (explicitRemote === true) return "Remote";
  if (/\bhybrid\b/.test(lower)) return "Hybrid";
  if (/\bremote\b/.test(lower)) return "Remote";
  return "Onsite";
}
