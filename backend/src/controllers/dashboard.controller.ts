import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { supabaseAdmin } from "../config/supabase";

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const { data: analyses, error } = await supabaseAdmin
    .from("resume_analysis")
    .select("id, resume_score, ats_score, created_at, recommended_roles(role, match_percentage, confidence)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return res.status(500).json({ success: false, message: "Failed to load dashboard data" });
  }

  const latest = analyses?.[0];
  const topRole = latest?.recommended_roles?.[0];

  res.json({
    success: true,
    data: {
      resumeScore: latest?.resume_score ?? null,
      atsScore: latest?.ats_score ?? null,
      topRole: topRole?.role ?? null,
      skillMatch: topRole?.match_percentage ?? null,
      recentAnalyses: analyses ?? [],
    },
  });
});
