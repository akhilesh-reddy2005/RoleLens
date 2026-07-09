import { supabaseAdmin } from "../../config/supabase";
import { ApiError } from "../../utils/apiError";
import { getLatestUserSkills, scoreJobForSkills } from "./jobMatch.service";
import { convertRangeToInr } from "./currencyConversion.service";
import { LiveJobRow } from "../../types";

export async function saveJob(userId: string, jobId: string) {
  const { error } = await supabaseAdmin
    .from("saved_jobs")
    .upsert({ user_id: userId, job_id: jobId }, { onConflict: "user_id,job_id" });

  if (error) {
    throw ApiError.internal("Failed to save job");
  }
}

export async function unsaveJob(userId: string, jobId: string) {
  const { error } = await supabaseAdmin
    .from("saved_jobs")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);

  if (error) {
    throw ApiError.internal("Failed to unsave job");
  }
}

export async function listSavedJobs(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("saved_jobs")
    .select("job_id, created_at, live_jobs(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw ApiError.internal("Failed to load saved jobs");
  }

  const userSkills = await getLatestUserSkills(userId);

  return Promise.all(
    (data ?? []).map(async (row) => {
      const job = row.live_jobs as unknown as LiveJobRow;
      const salaryInr = await convertRangeToInr(job?.salary_min ?? null, job?.salary_max ?? null, job?.salary_currency ?? null);
      return {
        ...row,
        live_jobs: {
          ...job,
          salary_min_inr: salaryInr.min,
          salary_max_inr: salaryInr.max,
          match: scoreJobForSkills(job?.skills_extracted ?? [], userSkills),
        },
      };
    })
  );
}
