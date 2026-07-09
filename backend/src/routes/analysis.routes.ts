import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getAnalysisDetail, getHistory, removeAnalysis } from "../controllers/analysis.controller";

const router = Router();

router.get("/history", requireAuth, getHistory);
router.get("/:id", requireAuth, getAnalysisDetail);
router.delete("/:id", requireAuth, removeAnalysis);

export default router;
