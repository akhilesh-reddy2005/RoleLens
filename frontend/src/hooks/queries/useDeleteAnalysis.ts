import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnalysisRequest } from "../../services/resume.service";
import { AnalysisHistoryItem } from "../../types";

export function useDeleteAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAnalysisRequest(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["history"] });
      const previous = queryClient.getQueryData<AnalysisHistoryItem[]>(["history"]);
      queryClient.setQueryData<AnalysisHistoryItem[]>(["history"], (old) =>
        old?.filter((item) => item.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(["history"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
