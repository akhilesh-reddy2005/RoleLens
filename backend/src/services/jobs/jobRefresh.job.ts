import cron from "node-cron";
import { supabaseAdmin } from "../../config/supabase";
import { env } from "../../config/env";
import { refreshLiveJobs } from "./jobAggregator.service";
import { scoreJobForSkills } from "./jobMatch.service";

async function latestSkillsByUser(): Promise<Map<string, string[]>> {
  const { data, error } = await supabaseAdmin
    .from("resume_analysis")
    .select("user_id, current_skills, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return new Map();

  const byUser = new Map<string, string[]>();
  for (const row of data) {
    if (!byUser.has(row.user_id)) {
      byUser.set(row.user_id, row.current_skills ?? []);
    }
  }
  return byUser;
}

export async function notifyMatchingUsers(insertedIds: string[]) {
  if (!insertedIds.length) return;

  const { data: newJobs } = await supabaseAdmin
    .from("live_jobs")
    .select("id, skills_extracted")
    .in("id", insertedIds);

  if (!newJobs?.length) return;

  const userSkills = await latestSkillsByUser();
  if (!userSkills.size) return;

  const notifications: { user_id: string; job_id: string; match_percentage: number }[] = [];

  for (const job of newJobs) {
    for (const [userId, skills] of userSkills) {
      const score = scoreJobForSkills(job.skills_extracted ?? [], skills);
      if (score.matchPercentage >= env.jobMatchNotifyThreshold) {
        notifications.push({ user_id: userId, job_id: job.id, match_percentage: score.matchPercentage });
      }
    }
  }

  if (!notifications.length) return;

  const { error } = await supabaseAdmin
    .from("job_notifications")
    .upsert(notifications, { onConflict: "user_id,job_id", ignoreDuplicates: true });

  if (error) {
    console.error("Failed to insert job notifications:", error);
  }
}

async function runRefreshCycle() {
  try {
    const { totalFetched, insertedIds, providerErrors } = await refreshLiveJobs();
    console.log(
      `[jobs] refresh cycle: fetched ${totalFetched}, inserted ${insertedIds.length}` +
        (providerErrors.length ? `, provider errors: ${providerErrors.join(", ")}` : "")
    );
    await notifyMatchingUsers(insertedIds);
  } catch (error) {
    console.error("[jobs] refresh cycle failed:", error);
  }
}

export function startJobRefreshCron() {
  cron.schedule(env.jobRefreshCron, runRefreshCycle);
  console.log(`[jobs] refresh cron scheduled: ${env.jobRefreshCron}`);
  // Run once on boot so the live_jobs cache isn't empty until the first interval elapses.
  void runRefreshCycle();
}
