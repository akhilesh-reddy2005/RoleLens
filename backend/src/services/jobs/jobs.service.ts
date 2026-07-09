import { supabaseAdmin } from "../../config/supabase";
import { ApiError } from "../../utils/apiError";
import { getLatestUserRoles, getLatestUserSkills, roleTitleRelevance, scoreJobForSkills } from "./jobMatch.service";
import { convertRangeToInr } from "./currencyConversion.service";
import { LiveJobRow } from "../../types";

export interface JobListFilters {
  location?: string;
  minSalary?: number;
  company?: string;
  remote?: "Remote" | "Hybrid" | "Onsite";
  experience?: string;
  jobType?: string;
  page?: number;
}

const PAGE_SIZE = 20;
// Ranking by match% needs the full filtered set in memory before paginating;
// this caps how many rows we'll ever pull per request, well above the
// current cache size, to bound worst-case load.
const RANKING_FETCH_CAP = 1000;

export async function listLiveJobs(userId: string, filters: JobListFilters) {
  let query = supabaseAdmin.from("live_jobs").select("*", { count: "exact" });

  if (filters.location) query = query.ilike("location", `%${filters.location}%`);
  if (filters.company) query = query.ilike("company_name", `%${filters.company}%`);
  if (filters.remote) query = query.eq("remote_type", filters.remote);
  if (filters.experience) query = query.ilike("experience_level", `%${filters.experience}%`);
  if (filters.jobType) query = query.ilike("employment_type", `%${filters.jobType}%`);
  if (filters.minSalary) query = query.gte("salary_min", filters.minSalary);

  query = query
    .order("posted_at", { ascending: false, nullsFirst: false })
    .range(0, RANKING_FETCH_CAP - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("Failed to list live jobs:", error);
    throw ApiError.internal("Failed to load live jobs");
  }

  const [userSkills, userRoles] = await Promise.all([getLatestUserSkills(userId), getLatestUserRoles(userId)]);

  const scored = (data as LiveJobRow[]).map((job) => {
    const match = scoreJobForSkills(job.skills_extracted ?? [], userSkills);
    const roleRelevance = roleTitleRelevance(job.title, userRoles);
    // Weighted so skill overlap still dominates, but a title matching the
    // candidate's recommended role nudges it above equally-skilled postings.
    const rankScore = match.matchPercentage * 0.8 + roleRelevance * 0.2;
    return { job, match, rankScore };
  });

  scored.sort((a, b) => {
    if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
    return new Date(b.job.posted_at ?? 0).getTime() - new Date(a.job.posted_at ?? 0).getTime();
  });

  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const pageSlice = scored.slice(from, from + PAGE_SIZE);

  const jobs = await Promise.all(
    pageSlice.map(async ({ job, match }) => {
      const salaryInr = await convertRangeToInr(job.salary_min, job.salary_max, job.salary_currency);
      return {
        ...job,
        salary_min_inr: salaryInr.min,
        salary_max_inr: salaryInr.max,
        match,
      };
    })
  );

  return { jobs, total: count ?? scored.length, page, pageSize: PAGE_SIZE };
}

export async function getLiveJobById(jobId: string): Promise<LiveJobRow> {
  const { data, error } = await supabaseAdmin.from("live_jobs").select("*").eq("id", jobId).single();
  if (error || !data) {
    throw ApiError.notFound("Job not found");
  }
  return data as LiveJobRow;
}
