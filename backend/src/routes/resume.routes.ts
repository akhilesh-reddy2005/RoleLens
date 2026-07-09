import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadResume } from "../middleware/upload.middleware";
import { analysisRateLimiter } from "../middleware/rateLimit.middleware";
import { analyzeResumeHandler, uploadResumeHandler } from "../controllers/resume.controller";

const router = Router();

router.post("/upload", requireAuth, uploadResume, uploadResumeHandler);
router.post("/analyze", requireAuth, analysisRateLimiter, analyzeResumeHandler);

export default router;
