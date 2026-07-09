export interface User {
  id: string;
  fullName: string;
  email: string;
}

export interface RecommendedRole {
  role: string;
  match: number;
  confidence: "High" | "Medium" | "Low";
  reason: string;
}

export interface AnalysisResult {
  analysisId: string;
  resumeScore: number;
  atsScore: number;
  recommendedRoles: RecommendedRole[];
  skills: { current: string[]; missing: string[] };
  strengths: string[];
  weaknesses: string[];
  careerRoadmap: string[];
}

export interface ResumePreview {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  education: string[];
  experience: string[];
  projects: string[];
  certifications: string[];
  languages: string[];
}

export interface AnalysisHistoryItem {
  id: string;
  resume_id: string;
  resume_score: number;
  ats_score: number;
  created_at: string;
  resumes: { file_name: string } | null;
  recommended_roles: { role: string; match_percentage: number; confidence: string }[];
}

export interface DashboardSummary {
  resumeScore: number | null;
  atsScore: number | null;
  topRole: string | null;
  skillMatch: number | null;
  recentAnalyses: AnalysisHistoryItem[];
}

export interface AnalysisDetail {
  id: string;
  resume_id: string;
  resume_score: number;
  ats_score: number;
  current_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  career_roadmap: string[];
  created_at: string;
  resumes: { file_name: string; file_path: string } | null;
  recommended_roles: { role: string; match_percentage: number; confidence: string; reason: string }[];
}

// ============================================================
// Live jobs module
// ============================================================

export type RemoteType = "Remote" | "Hybrid" | "Onsite";

export interface JobMatch {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface LiveJob {
  id: string;
  source: string;
  external_id: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  location: string | null;
  remote_type: RemoteType;
  employment_type: string | null;
  experience_level: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_min_inr: number | null;
  salary_max_inr: number | null;
  description: string | null;
  skills_extracted: string[];
  apply_url: string;
  posted_at: string | null;
  fetched_at: string;
  match: JobMatch;
}

export interface JobDetail extends Omit<LiveJob, "match">, JobMatch {
  explanation: string;
}

export interface LiveJobsResponse {
  jobs: LiveJob[];
  total: number;
  page: number;
  pageSize: number;
}

export interface JobFilters {
  location?: string;
  minSalary?: number;
  company?: string;
  remote?: RemoteType;
  experience?: string;
  jobType?: string;
  page?: number;
}

export interface SavedJob {
  job_id: string;
  created_at: string;
  live_jobs: LiveJob;
}

export interface JobNotification {
  id: string;
  match_percentage: number;
  is_read: boolean;
  created_at: string;
  live_jobs: { id: string; title: string; company_name: string } | null;
}

export interface JobDashboardSummary {
  liveJobCount: number;
  trendingSkills: { name: string; count: number }[];
  hiringCompanies: { name: string; count: number }[];
  hiringLocations: { name: string; count: number }[];
  salaryInsights: { min: number; max: number; average: number; currency: string; sampleSize: number } | null;
  matchAnalytics: { label: string; count: number }[] | null;
}
