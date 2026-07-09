import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analyzeResumeRequest } from "../../services/resume.service";

export function useAnalyzeResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resumeId, resumeText }: { resumeId: string; resumeText: string }) =>
      analyzeResumeRequest(resumeId, resumeText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
