import { ApiError } from "../../utils/apiError";
import { fetchSerpApiJobs } from "./providers/serpapi.provider";
import { upsertNormalizedJobs } from "./jobAggregator.service";
import { notifyMatchingUsers } from "./jobRefresh.job";
import { getLatestUserRoles, getLatestUserSkills } from "./jobMatch.service";
import { env } from "../../config/env";

function buildQuery(roles: string[], skills: string[]): string {
  const role = roles[0] ?? "Software Developer";
  const topSkills = skills.slice(0, 2).join(" ");
  return `${role} ${topSkills} jobs in India`.replace(/\s+/g, " ").trim();
}

export async function searchSerpApiJobsForUser(userId: string): Promise<{
  fetched: number;
  inserted: number;
  query: string;
}> {
  if (!env.serpApiKey) {
    throw ApiError.badRequest("SerpApi is not configured. Add SERPAPI_KEY to the backend .env file.");
  }

  const [roles, skills] = await Promise.all([getLatestUserRoles(userId), getLatestUserSkills(userId)]);

  if (!roles.length && !skills.length) {
    throw ApiError.badRequest("Analyze a resume first so search terms can be built from your role and skills.");
  }

  const query = buildQuery(roles, skills);

  let jobs;
  try {
    jobs = await fetchSerpApiJobs(query);
  } catch (error: any) {
    console.error("SerpApi search failed:", error?.message ?? error);
    throw ApiError.internal("SerpApi search failed. Check that your API key and quota are valid.");
  }

  const { insertedIds, error } = await upsertNormalizedJobs("serpapi", jobs);
  if (error) {
    throw ApiError.internal("Found jobs but failed to save them.");
  }

  await notifyMatchingUsers(insertedIds);

  return { fetched: jobs.length, inserted: insertedIds.length, query };
}
