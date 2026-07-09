export type ConfidenceLevel = "High" | "Medium" | "Low" | string;

export const CONFIDENCE_TONE: Record<string, "success" | "warning" | "accent"> = {
  High: "success",
  Medium: "warning",
  Low: "accent",
};

export function confidenceTone(confidence: ConfidenceLevel): "success" | "warning" | "accent" {
  return CONFIDENCE_TONE[confidence] ?? "accent";
}
