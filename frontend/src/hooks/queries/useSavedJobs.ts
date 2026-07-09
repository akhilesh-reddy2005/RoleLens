import { useQuery } from "@tanstack/react-query";
import { getSavedJobsRequest } from "../../services/jobs.service";

export function useSavedJobs() {
  return useQuery({ queryKey: ["jobs", "saved"], queryFn: getSavedJobsRequest });
}
