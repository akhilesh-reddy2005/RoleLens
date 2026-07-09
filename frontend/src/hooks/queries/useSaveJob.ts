import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveJobRequest, unsaveJobRequest } from "../../services/jobs.service";

export function useSaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => saveJobRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
    },
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unsaveJobRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "saved"] });
    },
  });
}
