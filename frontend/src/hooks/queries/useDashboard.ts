import { useQuery } from "@tanstack/react-query";
import { getDashboardRequest } from "../../services/resume.service";

export function useDashboard() {
  return useQuery({ queryKey: ["dashboard"], queryFn: getDashboardRequest });
}
