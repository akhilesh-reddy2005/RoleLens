import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Sparkles,
  Target,
  Map,
  History,
  Settings as SettingsIcon,
  Layers,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const LINKS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/upload", label: "Upload resume", icon: Upload },
  { to: "/dashboard/analysis", label: "Resume analysis", icon: Sparkles },
  { to: "/dashboard/skill-gap", label: "Skill gap", icon: Target },
  { to: "/dashboard/roadmap", label: "Career roadmap", icon: Map },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-surface/60 md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Layers className="h-4 w-4" />
          </span>
          RoleLens
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-border/40 hover:text-ink"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border/60 p-4">
          <div className="mb-3 truncate text-xs text-muted">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-border/40 hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
