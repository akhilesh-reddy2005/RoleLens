import { supabaseAdmin } from "../../config/supabase";
import { ApiError } from "../../utils/apiError";

export async function listJobNotifications(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("job_notifications")
    .select("id, match_percentage, is_read, created_at, live_jobs(id, title, company_name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw ApiError.internal("Failed to load notifications");
  }
  return data ?? [];
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const { error } = await supabaseAdmin
    .from("job_notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("id", notificationId);

  if (error) {
    throw ApiError.internal("Failed to update notification");
  }
}
