export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatFileSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function scoreTone(score: number | null | undefined): "success" | "warning" | "danger" {
  if (score == null) return "warning";
  if (score >= 75) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

export function firstName(fullName?: string | null): string {
  return fullName?.split(" ")[0] ?? "";
}
