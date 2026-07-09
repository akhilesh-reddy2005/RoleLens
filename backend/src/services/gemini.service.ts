import { geminiModel } from "../config/gemini";
import { buildAnalysisPrompt } from "../prompts/analysisPrompt";
import { ApiError } from "../utils/apiError";
import { GeminiAnalysisResult } from "../types";

function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");
}

function validateShape(data: unknown): data is GeminiAnalysisResult {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.resumeScore === "number" &&
    typeof d.atsScore === "number" &&
    Array.isArray(d.recommendedRoles) &&
    typeof d.skills === "object" &&
    Array.isArray(d.strengths) &&
    Array.isArray(d.weaknesses) &&
    Array.isArray(d.careerRoadmap)
  );
}

export async function analyzeResumeWithGemini(resumeText: string): Promise<GeminiAnalysisResult> {
  const prompt = buildAnalysisPrompt(resumeText);

  let rawResponseText: string;
  try {
    const result = await geminiModel.generateContent(prompt);
    rawResponseText = result.response.text();
  } catch (error) {
    console.error("Gemini API request failed:", error);
    throw ApiError.internal("The AI analysis service is temporarily unavailable");
  }

  const cleaned = stripCodeFences(rawResponseText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", cleaned);
    throw ApiError.internal("The AI returned an unexpected response. Please try again.");
  }

  if (!validateShape(parsed)) {
    console.error("Gemini response failed schema validation:", parsed);
    throw ApiError.internal("The AI response was incomplete. Please try again.");
  }

  return parsed;
}
