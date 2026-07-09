import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { getLiveJobById, listLiveJobs } from "../services/jobs/jobs.service";
import { explainJobMatch } from "../services/jobs/jobMatch.service";
import { convertRangeToInr } from "../services/jobs/currencyConversion.service";
import { saveJob, unsaveJob, listSavedJobs } from "../services/jobs/savedJobs.service";
import { listJobNotifications, markNotificationRead } from "../services/jobs/notifications.service";
import { getJobDashboard } from "../services/jobs/jobDashboard.service";
import { searchSerpApiJobsForUser } from "../services/jobs/serpApiSearch.service";
import { RemoteType } from "../types";

const REMOTE_VALUES: RemoteType[] = ["Remote", "Hybrid", "Onsite"];

export const getLiveJobs = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { location, minSalary, company, remote, experience, jobType, page } = req.query;

  const remoteFilter =
    typeof remote === "string" && REMOTE_VALUES.includes(remote as RemoteType)
      ? (remote as RemoteType)
      : undefined;

  const data = await listLiveJobs(userId, {
    location: typeof location === "string" ? location : undefined,
    company: typeof company === "string" ? company : undefined,
    remote: remoteFilter,
    experience: typeof experience === "string" ? experience : undefined,
    jobType: typeof jobType === "string" ? jobType : undefined,
    minSalary: minSalary ? Number(minSalary) : undefined,
    page: page ? Number(page) : undefined,
  });

  res.json({ success: true, data });
});

export const getJobDetail = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const job = await getLiveJobById(req.params.id);
  const match = await explainJobMatch(userId, job);
  const salaryInr = await convertRangeToInr(job.salary_min, job.salary_max, job.salary_currency);

  res.json({
    success: true,
    data: { ...job, salary_min_inr: salaryInr.min, salary_max_inr: salaryInr.max, ...match },
  });
});

export const saveJobHandler = asyncHandler(async (req: Request, res: Response) => {
  await saveJob(req.user!.id, req.params.id);
  res.json({ success: true, message: "Job saved" });
});

export const unsaveJobHandler = asyncHandler(async (req: Request, res: Response) => {
  await unsaveJob(req.user!.id, req.params.id);
  res.json({ success: true, message: "Job removed from saved" });
});

export const getSavedJobs = asyncHandler(async (req: Request, res: Response) => {
  const data = await listSavedJobs(req.user!.id);
  res.json({ success: true, data });
});

export const getJobNotifications = asyncHandler(async (req: Request, res: Response) => {
  const data = await listJobNotifications(req.user!.id);
  res.json({ success: true, data });
});

export const readJobNotification = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw ApiError.badRequest("Notification id is required");
  }
  await markNotificationRead(req.user!.id, req.params.id);
  res.json({ success: true, message: "Notification marked as read" });
});

export const getJobsDashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await getJobDashboard(req.user!.id);
  res.json({ success: true, data });
});

export const searchSerpApiJobs = asyncHandler(async (req: Request, res: Response) => {
  const data = await searchSerpApiJobsForUser(req.user!.id);
  res.json({ success: true, data });
});
