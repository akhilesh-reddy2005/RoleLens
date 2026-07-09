import { supabaseAdmin } from "../../config/supabase";
import { extractSkillsFromText } from "../../utils/skillTaxonomy";
import { NormalizedJob } from "../../types";
import { JobProvider } from "./providers/types";
import { remotiveProvider } from "./providers/remotive.provider";
import { arbeitnowProvider } from "./providers/arbeitnow.provider";
import { adzunaProvider } from "./providers/adzuna.provider";

const PROVIDERS: JobProvider[] = [remotiveProvider, arbeitnowProvider, adzunaProvider];
const RETENTION_DAYS = 14;

export interface RefreshResult {
  totalFetched: number;
  insertedIds: string[];
  providerErrors: string[];
}

/**
 * Upserts a batch of already-fetched jobs from one source into `live_jobs`
 * (deduped on source+external_id), returning the ids that were newly
 * inserted (vs. updated) so callers can act on genuinely new postings.
 */
export async function upsertNormalizedJobs(
  source: string,
  jobs: NormalizedJob[]
): Promise<{ insertedIds: string[]; error?: string }> {
  if (!jobs.length) return { insertedIds: [] };

  const externalIds = jobs.map((j) => j.externalId);
  const { data: existingRows } = await supabaseAdmin
    .from("live_jobs")
    .select("external_id")
    .eq("source", source)
    .in("external_id", externalIds);

  const existingSet = new Set((existingRows ?? []).map((r) => r.external_id as string));

  const payload = jobs.map((job) => ({
    source: job.source,
    external_id: job.externalId,
    title: job.title,
    company_name: job.companyName,
    company_logo: job.companyLogo,
    location: job.location,
    remote_type: job.remoteType,
    employment_type: job.employmentType,
    experience_level: job.experienceLevel,
    salary_min: job.salaryMin,
    salary_max: job.salaryMax,
    salary_currency: job.salaryCurrency,
    description: job.description,
    skills_extracted: extractSkillsFromText(`${job.title} ${job.description}`),
    apply_url: job.applyUrl,
    posted_at: job.postedAt,
    fetched_at: new Date().toISOString(),
  }));

  const { data: upserted, error } = await supabaseAdmin
    .from("live_jobs")
    .upsert(payload, { onConflict: "source,external_id" })
    .select("id, external_id");

  if (error) {
    console.error(`Failed to upsert jobs from "${source}":`, error);
    return { insertedIds: [], error: source };
  }

  const insertedIds = (upserted ?? [])
    .filter((row) => !existingSet.has(row.external_id as string))
    .map((row) => row.id as string);

  return { insertedIds };
}

/**
 * Fetches from every enabled always-on provider, upserts into `live_jobs`,
 * and returns the ids of rows that were newly inserted this cycle so the
 * notification diff can act on them.
 */
export async function refreshLiveJobs(): Promise<RefreshResult> {
  const providerErrors: string[] = [];
  const insertedIds: string[] = [];
  let totalFetched = 0;

  for (const provider of PROVIDERS) {
    if (!provider.isEnabled()) continue;

    let jobs: NormalizedJob[];
    try {
      jobs = await provider.fetchJobs();
    } catch (error: any) {
      console.error(`Job provider "${provider.name}" failed:`, error?.message ?? error);
      providerErrors.push(provider.name);
      continue;
    }

    totalFetched += jobs.length;
    const { insertedIds: newIds, error } = await upsertNormalizedJobs(provider.name, jobs);
    if (error) providerErrors.push(error);
    insertedIds.push(...newIds);
  }

  await supabaseAdmin
    .from("live_jobs")
    .delete()
    .lt("fetched_at", new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString());

  return { totalFetched, insertedIds, providerErrors };
}
