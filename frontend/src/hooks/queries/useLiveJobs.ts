import { useQuery } from "@tanstack/react-query";
import { getLiveJobsRequest } from "../../services/jobs.service";
import { JobFilters } from "../../types";

export function useLiveJobs(filters: JobFilters) {
  return useQuery({
    queryKey: ["jobs", "live", filters],
    queryFn: () => getLiveJobsRequest(filters),
    placeholderData: (previous) => previous,
  });
}
