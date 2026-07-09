import { NormalizedJob } from "../../../types";
import { JobProvider, guessExperienceLevel, guessRemoteType } from "./types";

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number; // unix seconds
}

interface ArbeitnowResponse {
  data: ArbeitnowJob[];
}

export const arbeitnowProvider: JobProvider = {
  name: "arbeitnow",
  isEnabled() {
    return true;
  },
  async fetchJobs(): Promise<NormalizedJob[]> {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api");
    if (!res.ok) {
      throw new Error(`Arbeitnow API responded with ${res.status}`);
    }
    const data = (await res.json()) as ArbeitnowResponse;

    return data.data.map((job): NormalizedJob => {
      const plainDescription = job.description.replace(/<[^>]+>/g, " ").slice(0, 4000);
      return {
        source: "arbeitnow",
        externalId: job.slug,
        title: job.title,
        companyName: job.company_name,
        companyLogo: null,
        location: job.location || null,
        remoteType: guessRemoteType(`${job.title} ${plainDescription} ${job.location}`, job.remote),
        employmentType: job.job_types?.[0] ?? null,
        experienceLevel: guessExperienceLevel(`${job.title} ${plainDescription}`),
        salaryMin: null,
        salaryMax: null,
        salaryCurrency: null,
        description: plainDescription,
        applyUrl: job.url,
        postedAt: job.created_at ? new Date(job.created_at * 1000).toISOString() : null,
      };
    });
  },
};
