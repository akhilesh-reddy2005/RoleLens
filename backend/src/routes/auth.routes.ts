import { Router } from "express";
import { getProfile, login, register, googleAuth } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/google", authRateLimiter, googleAuth);
router.get("/profile", requireAuth, getProfile);

export default router;
