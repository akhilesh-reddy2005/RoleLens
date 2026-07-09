import { useQuery } from "@tanstack/react-query";
import { getAnalysisDetailRequest } from "../../services/resume.service";

export function useAnalysisDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => getAnalysisDetailRequest(id!),
    enabled: !!id,
  });
}
