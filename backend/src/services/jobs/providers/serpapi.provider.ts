import { env } from "../../../config/env";
import { NormalizedJob } from "../../../types";
import { guessExperienceLevel, guessRemoteType } from "./types";
import { parseSalaryText } from "../../../utils/salaryParser";

interface SerpApiJob {
  job_id: string;
  title: string;
  company_name: string;
  location?: string;
  via?: string;
  description: string;
  thumbnail?: string;
  detected_extensions?: {
    posted_at?: string;
    schedule_type?: string;
    salary?: string;
  };
  apply_options?: { title: string; link: string }[];
}

interface SerpApiResponse {
  jobs_results?: SerpApiJob[];
  error?: string;
}

/**
 * SerpApi's Google Jobs engine is query-based and metered (paid beyond a
 * free trial), so unlike the always-on providers this is called on-demand
 * for one search string at a time, not on a shared background schedule.
 */
export async function fetchSerpApiJobs(query: string): Promise<NormalizedJob[]> {
  if (!env.serpApiKey) return [];

  const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&hl=en&gl=in&api_key=${env.serpApiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`SerpApi responded with ${res.status}`);
  }
  const data = (await res.json()) as SerpApiResponse;
  if (data.error) {
    throw new Error(`SerpApi error: ${data.error}`);
  }

  return (data.jobs_results ?? []).map((job): NormalizedJob => {
    const plainDescription = (job.description ?? "").slice(0, 4000);
    const salary = parseSalaryText(job.detected_extensions?.salary ?? "");
    const applyUrl =
      job.apply_options?.[0]?.link ??
      `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company_name}`)}`;

    return {
      source: "serpapi",
      externalId: job.job_id,
      title: job.title,
      companyName: job.company_name,
      companyLogo: job.thumbnail ?? null,
      location: job.location ?? null,
      remoteType: guessRemoteType(`${job.title} ${plainDescription} ${job.location ?? ""}`),
      employmentType: job.detected_extensions?.schedule_type ?? null,
      experienceLevel: guessExperienceLevel(`${job.title} ${plainDescription}`),
      salaryMin: salary.min,
      salaryMax: salary.max,
      salaryCurrency: salary.currency,
      description: plainDescription,
      applyUrl,
      // detected_extensions.posted_at is relative text ("3 days ago"), not a
      // real timestamp — left null rather than fabricating an absolute date.
      postedAt: null,
    };
  });
}
