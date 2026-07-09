import { api } from "./api";
import { AnalysisDetail, AnalysisHistoryItem, AnalysisResult, DashboardSummary, ResumePreview } from "../types";

export async function uploadResumeRequest(file: File) {
  const formData = new FormData();
  formData.append("resume", file);

  const { data } = await api.post<{
    success: boolean;
    data: { resumeId: string; preview: ResumePreview };
  }>("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}

export async function analyzeResumeRequest(resumeId: string, resumeText: string) {
  const { data } = await api.post<{ success: boolean; data: AnalysisResult }>("/resume/analyze", {
    resumeId,
    resumeText,
  });
  return data.data;
}

export async function getDashboardRequest() {
  const { data } = await api.get<{ success: boolean; data: DashboardSummary }>("/dashboard");
  return data.data;
}

export async function getHistoryRequest() {
  const { data } = await api.get<{ success: boolean; data: AnalysisHistoryItem[] }>(
    "/analysis/history"
  );
  return data.data;
}

export async function getAnalysisDetailRequest(id: string) {
  const { data } = await api.get<{ success: boolean; data: AnalysisDetail }>(`/analysis/${id}`);
  return data.data;
}

export async function deleteAnalysisRequest(id: string) {
  await api.delete(`/analysis/${id}`);
}
