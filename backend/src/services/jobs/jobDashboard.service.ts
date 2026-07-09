import { supabaseAdmin } from "../../config/supabase";
import { ApiError } from "../../utils/apiError";
import { getLatestUserSkills, scoreJobForSkills } from "./jobMatch.service";
import { convertToInr } from "./currencyConversion.service";

const DASHBOARD_SAMPLE_SIZE = 1000;

function topCounts(values: (string | null)[], limit: number): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getJobDashboard(userId: string) {
  const { data, error, count } = await supabaseAdmin
    .from("live_jobs")
    .select("company_name, location, skills_extracted, salary_min, salary_max, salary_currency", {
      count: "exact",
    })
    .order("posted_at", { ascending: false, nullsFirst: false })
    .limit(DASHBOARD_SAMPLE_SIZE);

  if (error) {
    console.error("Failed to load job dashboard data:", error);
    throw ApiError.internal("Failed to load job market insights");
  }

  const rows = data ?? [];

  const trendingSkills = topCounts(
    rows.flatMap((r) => r.skills_extracted ?? []),
    10
  );
  const hiringCompanies = topCounts(
    rows.map((r) => r.company_name),
    10
  );
  const hiringLocations = topCounts(
    rows.map((r) => r.location),
    10
  );

  const rawSalaries = rows
    .flatMap((r) => [
      { amount: r.salary_min, currency: r.salary_currency },
      { amount: r.salary_max, currency: r.salary_currency },
    ])
    .filter((s): s is { amount: number; currency: string | null } => typeof s.amount === "number" && s.amount > 0);

  const salariesInInr = (
    await Promise.all(rawSalaries.map((s) => convertToInr(s.amount, s.currency)))
  ).filter((v): v is number => v != null);

  const salaryInsights =
    salariesInInr.length > 0
      ? {
          min: Math.min(...salariesInInr),
          max: Math.max(...salariesInInr),
          average: Math.round(salariesInInr.reduce((a, b) => a + b, 0) / salariesInInr.length),
          currency: "INR",
          sampleSize: salariesInInr.length,
        }
      : null;

  const userSkills = await getLatestUserSkills(userId);
  const buckets = [
    { label: "0-19%", min: 0, max: 19, count: 0 },
    { label: "20-39%", min: 20, max: 39, count: 0 },
    { label: "40-59%", min: 40, max: 59, count: 0 },
    { label: "60-79%", min: 60, max: 79, count: 0 },
    { label: "80-100%", min: 80, max: 100, count: 0 },
  ];
  if (userSkills.length) {
    for (const row of rows) {
      const { matchPercentage } = scoreJobForSkills(row.skills_extracted ?? [], userSkills);
      const bucket = buckets.find((b) => matchPercentage >= b.min && matchPercentage <= b.max);
      if (bucket) bucket.count += 1;
    }
  }

  return {
    liveJobCount: count ?? rows.length,
    trendingSkills,
    hiringCompanies,
    hiringLocations,
    salaryInsights,
    matchAnalytics: userSkills.length ? buckets.map(({ label, count: c }) => ({ label, count: c })) : null,
  };
}
