import { useNavigate } from "react-router-dom";
import { LogOut, Settings as SettingsIcon, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

function initials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-glass-border bg-glass-bg p-1 pr-2.5 transition-colors hover:border-white/[0.14]">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-xs font-semibold text-white">
              {initials(user?.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[9rem] truncate text-sm text-text-primary sm:inline">
            {user?.fullName ?? "Account"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-glass-border bg-surface-card text-text-primary">
        <DropdownMenuLabel>
          <div className="truncate text-sm font-medium">{user?.fullName}</div>
          <div className="truncate text-xs font-normal text-text-secondary">{user?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-glass-border" />
        <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer focus:bg-glass-bg">
          <User className="h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="cursor-pointer focus:bg-glass-bg">
          <SettingsIcon className="h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-glass-border" />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-danger focus:bg-danger/10 focus:text-danger">
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
