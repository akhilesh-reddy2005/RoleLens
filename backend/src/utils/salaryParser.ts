/**
 * Parses a free-text salary string (e.g. "$60,000 - $75,000", "70k-90k",
 * "₹5,00,000 - ₹8,00,000 a year") into a min/max/currency triple. Only
 * accepts numeric tokens that resolve to a plausible salary magnitude
 * (>=1000 after applying a "k" suffix) to avoid misreading stray small
 * numbers (e.g. years of experience) as salary figures.
 */
export function parseSalaryText(raw: string): { min: number | null; max: number | null; currency: string | null } {
  if (!raw) return { min: null, max: null, currency: null };
  const cleaned = raw.replace(/,/g, "");
  const currency = cleaned.includes("₹")
    ? "INR"
    : cleaned.includes("€")
      ? "EUR"
      : cleaned.includes("£")
        ? "GBP"
        : "USD";

  const values: number[] = [];
  const tokenPattern = /(\d+(?:\.\d+)?)\s*(k|K)?/g;
  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(cleaned))) {
    let value = Number(match[1]);
    if (match[2]) value *= 1000;
    if (value >= 1000 && value <= 100_000_000) {
      values.push(value);
    }
  }

  if (!values.length) return { min: null, max: null, currency: null };
  return {
    min: Math.min(...values),
    max: values.length > 1 ? Math.max(...values) : null,
    currency,
  };
}
