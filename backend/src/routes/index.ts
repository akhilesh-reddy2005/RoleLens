import { Router } from "express";
import authRoutes from "./auth.routes";
import resumeRoutes from "./resume.routes";
import analysisRoutes from "./analysis.routes";
import dashboardRoutes from "./dashboard.routes";
import jobsRoutes from "./jobs.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);
router.use("/analysis", analysisRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/jobs", jobsRoutes);

export default router;
