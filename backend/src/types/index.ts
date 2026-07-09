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
