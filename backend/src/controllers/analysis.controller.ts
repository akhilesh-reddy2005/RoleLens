import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  deleteAnalysis,
  getAnalysisById,
  listAnalysisHistory,
} from "../services/analysis.service";

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const data = await listAnalysisHistory(req.user!.id);
  res.json({ success: true, data });
});

export const getAnalysisDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await getAnalysisById(req.user!.id, req.params.id);
  res.json({ success: true, data });
});

export const removeAnalysis = asyncHandler(async (req: Request, res: Response) => {
  await deleteAnalysis(req.user!.id, req.params.id);
  res.json({ success: true, message: "Analysis deleted" });
});
