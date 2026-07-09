export interface AuthUser {
  id: string;
  email: string;
}

export interface RecommendedRole {
  role: string;
  match: number;
  confidence: "High" | "Medium" | "Low";
  reason: string;
}

export interface SkillGap {
  current: string[];
  missing: string[];
  recommended: string[];
  priority: "High" | "Medium" | "Low";
}

export interface GeminiAnalysisResult {
  resumeScore: number;
  atsScore: number;
  recommendedRoles: RecommendedRole[];
  skills: {
    current: string[];
    missing: string[];
  };
  strengths: string[];
  weaknesses: string[];
  careerRoadmap: string[];
}

export interface ParsedResume {
  rawText: string;
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

// ============================================================
// Live jobs module
// ============================================================

export type RemoteType = "Remote" | "Hybrid" | "Onsite";

export interface NormalizedJob {
  source: string;
  externalId: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  location: string | null;
  remoteType: RemoteType;
  employmentType: string | null;
  experienceLevel: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  description: string;
  applyUrl: string;
  postedAt: string | null;
}

export interface LiveJobRow {
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
  description: string | null;
  skills_extracted: string[];
  apply_url: string;
  posted_at: string | null;
  fetched_at: string;
}

export interface JobMatchScore {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface JobMatchExplanation {
  explanation: string;
}
