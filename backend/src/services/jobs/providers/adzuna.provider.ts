import { env } from "../../../config/env";
import { NormalizedJob } from "../../../types";
import { JobProvider, guessExperienceLevel, guessRemoteType } from "./types";

interface AdzunaJob {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  contract_time?: string;
  created: string;
  redirect_url: string;
  description: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
}

// Adzuna is per-country. Defaults to India ("in") since that's the primary
// market this app targets; override with ADZUNA_COUNTRY (e.g. "us", "gb").
const COUNTRY_CURRENCY: Record<string, string> = {
  in: "INR",
  us: "USD",
  gb: "GBP",
  ca: "CAD",
  au: "AUD",
  de: "EUR",
  fr: "EUR",
};

export const adzunaProvider: JobProvider = {
  name: "adzuna",
  isEnabled() {
    return Boolean(env.adzunaAppId && env.adzunaAppKey);
  },
  async fetchJobs(): Promise<NormalizedJob[]> {
    const country = env.adzunaCountry;
    const currency = COUNTRY_CURRENCY[country] ?? "USD";
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${env.adzunaAppId}&app_key=${env.adzunaAppKey}&results_per_page=50&content-type=application/json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Adzuna API responded with ${res.status}`);
    }
    const data = (await res.json()) as AdzunaResponse;

    return data.results.map((job): NormalizedJob => {
      const plainDescription = job.description.slice(0, 4000);
      return {
        source: "adzuna",
        externalId: job.id,
        title: job.title,
        companyName: job.company.display_name,
        companyLogo: null,
        location: job.location.display_name || null,
        remoteType: guessRemoteType(`${job.title} ${plainDescription} ${job.location.display_name}`),
        employmentType: job.contract_type ?? job.contract_time ?? null,
        experienceLevel: guessExperienceLevel(`${job.title} ${plainDescription}`),
        salaryMin: job.salary_min ? Math.round(job.salary_min) : null,
        salaryMax: job.salary_max ? Math.round(job.salary_max) : null,
        salaryCurrency: currency,
        description: plainDescription,
        applyUrl: job.redirect_url,
        postedAt: job.created || null,
      };
    });
  },
};
