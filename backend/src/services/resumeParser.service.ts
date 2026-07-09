import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { ApiError } from "../utils/apiError";
import { ParsedResume } from "../types";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]?\d{3}[\s-]?\d{3,4}/;

const SECTION_HEADERS: Record<keyof Pick<
  ParsedResume,
  "skills" | "education" | "experience" | "projects" | "certifications" | "languages"
>, RegExp> = {
  skills: /^(technical\s+)?skills?\b/i,
  education: /^education\b/i,
  experience: /^(work\s+)?experience\b|^employment\b/i,
  projects: /^projects?\b/i,
  certifications: /^certifications?\b/i,
  languages: /^languages?\b/i,
};

export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === "application/pdf") {
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw ApiError.badRequest("Unsupported file type for parsing");
}

/**
 * Lightweight, dependency-free structural parser used to give the frontend
 * a fast preview before the full Gemini analysis returns. This is best-effort
 * and intentionally forgiving since resume formats vary widely.
 */
export function parseResumeStructure(rawText: string): ParsedResume {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: Record<string, string[]> = {
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
  };

  let currentSection: string | null = null;

  for (const line of lines) {
    const matchedSection = Object.entries(SECTION_HEADERS).find(([, regex]) => regex.test(line));
    if (matchedSection) {
      currentSection = matchedSection[0];
      continue;
    }
    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(line);
    }
  }

  const emailMatch = rawText.match(EMAIL_REGEX);
  const phoneMatch = rawText.match(PHONE_REGEX);
  const name = lines[0]?.length && lines[0].length < 60 ? lines[0] : null;

  const splitToItems = (arr: string[]) =>
    arr
      .flatMap((line) => line.split(/,|•|\u2022/))
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 30);

  return {
    rawText,
    name,
    email: emailMatch?.[0] ?? null,
    phone: phoneMatch?.[0] ?? null,
    skills: splitToItems(sections.skills),
    education: sections.education.slice(0, 10),
    experience: sections.experience.slice(0, 30),
    projects: sections.projects.slice(0, 20),
    certifications: sections.certifications.slice(0, 10),
    languages: splitToItems(sections.languages),
  };
}
