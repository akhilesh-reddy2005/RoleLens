import { useQuery } from "@tanstack/react-query";
import { getJobDashboardRequest } from "../../services/jobs.service";

export function useJobDashboard() {
  return useQuery({ queryKey: ["jobs", "dashboard"], queryFn: getJobDashboardRequest });
}
