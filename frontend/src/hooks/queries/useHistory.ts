import { useQuery } from "@tanstack/react-query";
import { getHistoryRequest } from "../../services/resume.service";

export function useHistory() {
  return useQuery({ queryKey: ["history"], queryFn: getHistoryRequest });
}
