import { NormalizedJob } from "../../../types";
import { JobProvider, guessExperienceLevel } from "./types";
import { parseSalaryText } from "../../../utils/salaryParser";

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
}

export const remotiveProvider: JobProvider = {
  name: "remotive",
  isEnabled() {
    return true;
  },
  async fetchJobs(): Promise<NormalizedJob[]> {
    const res = await fetch("https://remotive.com/api/remote-jobs?limit=100");
    if (!res.ok) {
      throw new Error(`Remotive API responded with ${res.status}`);
    }
    const data = (await res.json()) as RemotiveResponse;

    return data.jobs.map((job): NormalizedJob => {
      const salary = parseSalaryText(job.salary);
      const plainDescription = job.description.replace(/<[^>]+>/g, " ").slice(0, 4000);
      return {
        source: "remotive",
        externalId: String(job.id),
        title: job.title,
        companyName: job.company_name,
        companyLogo: job.company_logo ?? null,
        location: job.candidate_required_location || null,
        remoteType: "Remote",
        employmentType: job.job_type || null,
        experienceLevel: guessExperienceLevel(`${job.title} ${plainDescription}`),
        salaryMin: salary.min,
        salaryMax: salary.max,
        salaryCurrency: salary.currency,
        description: plainDescription,
        applyUrl: job.url,
        postedAt: job.publication_date || null,
      };
    });
  },
};
