import { useMutation, useQueryClient } from "@tanstack/react-query";
import { searchSerpApiJobsRequest } from "../../services/jobs.service";

export function useSerpApiSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: searchSerpApiJobsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "live"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "dashboard"] });
    },
  });
}
