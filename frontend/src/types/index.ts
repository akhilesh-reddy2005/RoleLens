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
