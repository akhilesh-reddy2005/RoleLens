import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobNotificationsRequest, markJobNotificationReadRequest } from "../../services/jobs.service";

export function useJobNotifications() {
  return useQuery({
    queryKey: ["jobs", "notifications"],
    queryFn: getJobNotificationsRequest,
    refetchInterval: 60_000,
  });
}

export function useMarkJobNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markJobNotificationReadRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "notifications"] });
    },
  });
}
