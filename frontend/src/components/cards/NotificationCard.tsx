import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

export function NotificationCard({ icon: Icon, title, description, time, unread }: NotificationCardProps) {
  return (
    <div className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-glass-bg">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-text-primary">{title}</p>
          {unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />}
        </div>
        <p className={cn("mt-0.5 truncate text-xs text-text-secondary")}>{description}</p>
        <p className="mt-1 text-[11px] text-text-secondary/70">{time}</p>
      </div>
    </div>
  );
}
