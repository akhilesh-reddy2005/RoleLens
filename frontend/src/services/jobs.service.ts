import { api } from "./api";
import {
  JobDetail,
  JobFilters,
  JobNotification,
  JobDashboardSummary,
  LiveJobsResponse,
  SavedJob,
} from "../types";

export async function getLiveJobsRequest(filters: JobFilters) {
  const { data } = await api.get<{ success: boolean; data: LiveJobsResponse }>("/jobs/live", {
    params: filters,
  });
  return data.data;
}

export async function getJobDetailRequest(id: string) {
  const { data } = await api.get<{ success: boolean; data: JobDetail }>(`/jobs/${id}`);
  return data.data;
}

export async function saveJobRequest(id: string) {
  await api.post(`/jobs/${id}/save`);
}

export async function unsaveJobRequest(id: string) {
  await api.delete(`/jobs/${id}/save`);
}

export async function getSavedJobsRequest() {
  const { data } = await api.get<{ success: boolean; data: SavedJob[] }>("/jobs/saved");
  return data.data;
}

export async function getJobNotificationsRequest() {
  const { data } = await api.get<{ success: boolean; data: JobNotification[] }>("/jobs/notifications");
  return data.data;
}

export async function markJobNotificationReadRequest(id: string) {
  await api.patch(`/jobs/notifications/${id}/read`);
}

export async function getJobDashboardRequest() {
  const { data } = await api.get<{ success: boolean; data: JobDashboardSummary }>("/jobs/dashboard");
  return data.data;
}

export interface SerpApiSearchResult {
  fetched: number;
  inserted: number;
  query: string;
}

export async function searchSerpApiJobsRequest() {
  const { data } = await api.post<{ success: boolean; data: SerpApiSearchResult }>("/jobs/serpapi/search");
  return data.data;
}
