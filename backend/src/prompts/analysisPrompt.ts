export function buildAnalysisPrompt(resumeText: string): string {
  return `You are an expert technical recruiter and career coach with 15 years of experience screening resumes for top technology companies.

Analyze the resume text below and return your analysis as a SINGLE valid JSON object and nothing else. Do not include markdown fences, commentary, or any text outside the JSON object.

Follow this exact schema:
{
  "resumeScore": number (0-100, overall resume quality),
  "atsScore": number (0-100, applicant tracking system compatibility),
  "recommendedRoles": [
    {
      "role": string,
      "match": number (0-100),
      "confidence": "High" | "Medium" | "Low",
      "reason": string (one or two sentences citing specific resume evidence)
    }
  ] (exactly 5 roles, ordered by match descending),
  "skills": {
    "current": string[] (skills clearly evidenced in the resume),
    "missing": string[] (skills that would meaningfully strengthen candidacy for the recommended roles)
  },
  "strengths": string[] (3-5 concise items),
  "weaknesses": string[] (3-5 concise items),
  "careerRoadmap": string[] (4-6 sequential, actionable steps)
}

Scoring guidance:
- resumeScore reflects clarity, structure, quantified impact, and relevance.
- atsScore reflects keyword coverage, formatting simplicity, and section completeness.
- Be specific and evidence-based in "reason" fields; avoid generic statements.

Resume text:
"""
${resumeText}
"""`;
}
