import { useQuery } from "@tanstack/react-query";
import { getJobDetailRequest } from "../../services/jobs.service";

export function useJobDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["jobs", "detail", id],
    queryFn: () => getJobDetailRequest(id!),
    enabled: !!id,
  });
}
