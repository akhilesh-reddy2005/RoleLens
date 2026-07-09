export function buildJobMatchPrompt(params: {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
}): string {
  const { jobTitle, companyName, jobDescription, matchedSkills, missingSkills, matchPercentage } = params;

  return `You are an expert technical recruiter explaining why a candidate is or isn't a good fit for a specific job posting.

Job title: ${jobTitle}
Company: ${companyName}
Computed match score: ${matchPercentage}%
Skills the candidate already has that this job wants: ${matchedSkills.join(", ") || "none identified"}
Skills this job wants that the candidate does not have evidenced on their resume: ${missingSkills.join(", ") || "none identified"}

Job description (may be truncated):
"""
${jobDescription.slice(0, 2500)}
"""

Return your analysis as a SINGLE valid JSON object and nothing else. Do not include markdown fences, commentary, or any text outside the JSON object. Follow this exact schema:
{
  "explanation": string (2-4 sentences, written directly to the candidate, citing the specific matched/missing skills above and whether the match score is worth pursuing)
}`;
}
