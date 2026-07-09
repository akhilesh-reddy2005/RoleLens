import { Bell, Briefcase, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationCard } from "@/components/cards/NotificationCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useHistory } from "@/hooks/queries/useHistory";
import { useJobNotifications, useMarkJobNotificationRead } from "@/hooks/queries/useJobNotifications";
import { formatDate } from "@/utils/format";

export function NotificationCenter() {
  const { data: history } = useHistory();
  const { data: jobNotifications } = useJobNotifications();
  const markRead = useMarkJobNotificationRead();

  const recentAnalyses = history?.slice(0, 3) ?? [];
  const unreadJobNotifications = (jobNotifications ?? []).filter((n) => !n.is_read);
  const hasAny = jobNotifications?.length || recentAnalyses.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-glass-border bg-glass-bg text-text-secondary transition-colors hover:border-white/[0.14] hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadJobNotifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5 rounded-full bg-brand-accent ring-2 ring-bg" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 border-glass-border bg-surface-card p-2 text-text-primary">
        <div className="px-2 py-1.5 text-sm font-semibold">Notifications</div>
        {hasAny ? (
          <div className="max-h-96 overflow-auto">
            {(jobNotifications ?? []).slice(0, 6).map((n) => (
              <button key={n.id} className="block w-full text-left" onClick={() => !n.is_read && markRead.mutate(n.id)}>
                <NotificationCard
                  icon={Briefcase}
                  title={`${n.match_percentage}% match: ${n.live_jobs?.title ?? "New job"}`}
                  description={n.live_jobs?.company_name ?? ""}
                  time={formatDate(n.created_at)}
                  unread={!n.is_read}
                />
              </button>
            ))}
            {recentAnalyses.map((item) => (
              <NotificationCard
                key={item.id}
                icon={Sparkles}
                title="Analysis complete"
                description={item.resumes?.file_name ?? "Resume"}
                time={formatDate(item.created_at)}
              />
            ))}
          </div>
        ) : (
          <EmptyState icon={Bell} title="No notifications yet" description="Analyze a resume to see updates here." />
        )}
      </PopoverContent>
    </Popover>
  );
}
