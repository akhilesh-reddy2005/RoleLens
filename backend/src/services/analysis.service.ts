import { supabaseAdmin } from "../config/supabase";
import { ApiError } from "../utils/apiError";
import { analyzeResumeWithGemini } from "./gemini.service";
import { GeminiAnalysisResult } from "../types";

export async function runAndSaveAnalysis(
  userId: string,
  resumeId: string,
  resumeText: string
): Promise<{ id: string; result: GeminiAnalysisResult }> {
  const result = await analyzeResumeWithGemini(resumeText);

  const { data, error } = await supabaseAdmin
    .from("resume_analysis")
    .insert({
      user_id: userId,
      resume_id: resumeId,
      resume_score: result.resumeScore,
      ats_score: result.atsScore,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      career_roadmap: result.careerRoadmap,
      current_skills: result.skills.current,
      missing_skills: result.skills.missing,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to save analysis:", error);
    throw ApiError.internal("Failed to save the analysis result");
  }

  const analysisId = data.id as string;

  const rolesPayload = result.recommendedRoles.map((role) => ({
    analysis_id: analysisId,
    role: role.role,
    match_percentage: role.match,
    confidence: role.confidence,
    reason: role.reason,
  }));

  const { error: rolesError } = await supabaseAdmin.from("recommended_roles").insert(rolesPayload);
  if (rolesError) {
    console.error("Failed to save recommended roles:", rolesError);
  }

  await supabaseAdmin.from("activity_logs").insert({
    user_id: userId,
    action: "resume_analyzed",
    metadata: { resumeId, analysisId },
  });

  return { id: analysisId, result };
}

export async function listAnalysisHistory(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("resume_analysis")
    .select(
      "id, resume_id, resume_score, ats_score, created_at, resumes(file_name), recommended_roles(role, match_percentage, confidence)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch analysis history:", error);
    throw ApiError.internal("Failed to load analysis history");
  }
  return data;
}

export async function getAnalysisById(userId: string, analysisId: string) {
  const { data, error } = await supabaseAdmin
    .from("resume_analysis")
    .select(
      "*, resumes(file_name, file_path), recommended_roles(role, match_percentage, confidence, reason)"
    )
    .eq("user_id", userId)
    .eq("id", analysisId)
    .single();

  if (error || !data) {
    throw ApiError.notFound("Analysis not found");
  }
  return data;
}

export async function deleteAnalysis(userId: string, analysisId: string) {
  const { error } = await supabaseAdmin
    .from("resume_analysis")
    .delete()
    .eq("user_id", userId)
    .eq("id", analysisId);

  if (error) {
    throw ApiError.internal("Failed to delete analysis");
  }
}
