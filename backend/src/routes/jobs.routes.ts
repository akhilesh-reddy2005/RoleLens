import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { jobsRateLimiter, serpApiSearchRateLimiter } from "../middleware/rateLimit.middleware";
import {
  getJobDetail,
  getJobNotifications,
  getJobsDashboard,
  getLiveJobs,
  getSavedJobs,
  readJobNotification,
  saveJobHandler,
  searchSerpApiJobs,
  unsaveJobHandler,
} from "../controllers/jobs.controller";

const router = Router();

router.get("/live", requireAuth, getLiveJobs);
router.get("/dashboard", requireAuth, getJobsDashboard);
router.get("/saved", requireAuth, getSavedJobs);
router.get("/notifications", requireAuth, getJobNotifications);
router.patch("/notifications/:id/read", requireAuth, readJobNotification);
router.post("/serpapi/search", requireAuth, serpApiSearchRateLimiter, searchSerpApiJobs);
router.get("/:id", requireAuth, jobsRateLimiter, getJobDetail);
router.post("/:id/save", requireAuth, saveJobHandler);
router.delete("/:id/save", requireAuth, unsaveJobHandler);

export default router;
