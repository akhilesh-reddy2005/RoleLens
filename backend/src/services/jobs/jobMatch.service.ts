import { supabaseAdmin } from "../../config/supabase";
import { geminiModel } from "../../config/gemini";
import { buildJobMatchPrompt } from "../../prompts/jobMatchPrompt";
import { skillsOverlap } from "../../utils/skillTaxonomy";
import { ApiError } from "../../utils/apiError";
import { JobMatchScore, LiveJobRow } from "../../types";

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
}

export async function getLatestUserSkills(userId: string): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("resume_analysis")
    .select("current_skills")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.current_skills ?? [];
}

/**
 * The candidate's most recent AI-recommended role titles (e.g. "Junior
 * Full-stack Developer"), used to nudge job-title-relevant postings above
 * purely skill-overlap-ranked ones. These titles already reflect the
 * resume's education/experience as interpreted by Gemini's analysis.
 */
export async function getLatestUserRoles(userId: string): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from("resume_analysis")
    .select("id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return [];

  const { data: roles } = await supabaseAdmin
    .from("recommended_roles")
    .select("role, match_percentage")
    .eq("analysis_id", data.id)
    .order("match_percentage", { ascending: false })
    .limit(3);

  return (roles ?? []).map((r) => r.role);
}

const STOPWORDS = new Set(["and", "the", "for", "with", "junior", "senior", "of", "in", "a", "an"]);

/** 0-100 heuristic: how many significant words from the user's recommended roles appear in this job title. */
export function roleTitleRelevance(jobTitle: string, roles: string[]): number {
  if (!roles.length) return 0;
  const titleLower = jobTitle.toLowerCase();
  let bestScore = 0;

  for (const role of roles) {
    const words = role
      .toLowerCase()
      .split(/[\s/,-]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    if (!words.length) continue;
    const hits = words.filter((w) => titleLower.includes(w)).length;
    bestScore = Math.max(bestScore, Math.round((hits / words.length) * 100));
  }

  return bestScore;
}

export function scoreJobForSkills(jobSkills: string[], userSkills: string[]): JobMatchScore {
  if (!jobSkills.length) {
    return { matchPercentage: 0, matchedSkills: [], missingSkills: [] };
  }
  const { matched, missing } = skillsOverlap(jobSkills, userSkills);
  const matchPercentage = Math.round((matched.length / jobSkills.length) * 100);
  return { matchPercentage, matchedSkills: matched, missingSkills: missing };
}

export async function explainJobMatch(userId: string, job: LiveJobRow): Promise<{
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}> {
  const { data: cached } = await supabaseAdmin
    .from("job_match_explanations")
    .select("match_percentage, matched_skills, missing_skills, explanation")
    .eq("user_id", userId)
    .eq("job_id", job.id)
    .maybeSingle();

  if (cached) {
    return {
      matchPercentage: cached.match_percentage,
      matchedSkills: cached.matched_skills,
      missingSkills: cached.missing_skills,
      explanation: cached.explanation,
    };
  }

  const userSkills = await getLatestUserSkills(userId);
  const score = scoreJobForSkills(job.skills_extracted, userSkills);

  const prompt = buildJobMatchPrompt({
    jobTitle: job.title,
    companyName: job.company_name,
    jobDescription: job.description ?? "",
    matchedSkills: score.matchedSkills,
    missingSkills: score.missingSkills,
    matchPercentage: score.matchPercentage,
  });

  let explanation: string;
  try {
    const result = await geminiModel.generateContent(prompt);
    const cleaned = stripCodeFences(result.response.text());
    const parsed = JSON.parse(cleaned);
    if (typeof parsed.explanation !== "string") {
      throw new Error("Missing explanation field");
    }
    explanation = parsed.explanation;
  } catch (error: any) {
    console.error("Gemini job-match explanation failed:", error?.message ?? error);
    throw ApiError.internal("The AI explanation service is temporarily unavailable");
  }

  await supabaseAdmin.from("job_match_explanations").insert({
    user_id: userId,
    job_id: job.id,
    match_percentage: score.matchPercentage,
    matched_skills: score.matchedSkills,
    missing_skills: score.missingSkills,
    explanation,
  });

  return { ...score, explanation };
}
