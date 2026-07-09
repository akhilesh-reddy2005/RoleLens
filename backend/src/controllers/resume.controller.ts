import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { storeAndParseResume } from "../services/resume.service";
import { runAndSaveAnalysis } from "../services/analysis.service";

export const uploadResumeHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("No resume file was uploaded");
  }

  const userId = req.user!.id;
  const { id, parsed } = await storeAndParseResume(userId, req.file);

  res.status(201).json({
    success: true,
    data: {
      resumeId: id,
      preview: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        skills: parsed.skills,
        education: parsed.education,
        experience: parsed.experience,
        projects: parsed.projects,
        certifications: parsed.certifications,
        languages: parsed.languages,
      },
    },
  });
});

export const analyzeResumeHandler = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { resumeId, resumeText } = req.body as { resumeId?: string; resumeText?: string };

  if (!resumeId || !resumeText) {
    throw ApiError.badRequest("resumeId and resumeText are required");
  }

  const { id, result } = await runAndSaveAnalysis(userId, resumeId, resumeText);

  res.status(201).json({ success: true, data: { analysisId: id, ...result } });
});
