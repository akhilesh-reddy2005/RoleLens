import { AnalysisDetail, AnalysisResult } from "../types";

export function normalizeAnalysisDetail(detail: AnalysisDetail): AnalysisResult {
  return {
    analysisId: detail.id,
    resumeScore: detail.resume_score,
    atsScore: detail.ats_score,
    recommendedRoles: (detail.recommended_roles ?? []).map((r) => ({
      role: r.role,
      match: r.match_percentage,
      confidence: r.confidence as AnalysisResult["recommendedRoles"][number]["confidence"],
      reason: r.reason,
    })),
    skills: { current: detail.current_skills ?? [], missing: detail.missing_skills ?? [] },
    strengths: detail.strengths ?? [],
    weaknesses: detail.weaknesses ?? [],
    careerRoadmap: detail.career_roadmap ?? [],
  };
}
