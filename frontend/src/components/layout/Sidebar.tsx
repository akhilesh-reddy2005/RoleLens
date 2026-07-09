import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Sparkles,
  Target,
  Map,
  History,
  Settings as SettingsIcon,
  LogOut,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/upload", label: "Upload resume", icon: Upload },
  { to: "/dashboard/analysis", label: "Resume analysis", icon: Sparkles },
  { to: "/dashboard/skill-gap", label: "Skill gap", icon: Target },
  { to: "/dashboard/roadmap", label: "Career roadmap", icon: Map },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/jobs", label: "Live jobs", icon: Briefcase, end: true },
  { to: "/dashboard/jobs/insights", label: "Job insights", icon: TrendingUp },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <SidebarPrimitive collapsible="icon" className="border-glass-border">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2 px-1 font-display text-base font-bold text-text-primary">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-glow-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="group-data-[collapsible=icon]:hidden">RoleLens</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {LINKS.map(({ to, label, icon: Icon, end }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild tooltip={label}>
                    <NavLink
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "text-text-secondary hover:bg-glass-bg hover:text-text-primary"
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <div className="mb-2 truncate px-1 text-xs text-text-secondary group-data-[collapsible=icon]:hidden">
          {user?.email}
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Log out" className="text-text-secondary hover:bg-glass-bg hover:text-danger">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
