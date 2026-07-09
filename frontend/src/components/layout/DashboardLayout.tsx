import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { CommandMenu } from "./CommandMenu";
import { NotificationCenter } from "./NotificationCenter";
import { UserMenu } from "./UserMenu";
import { PageTransition } from "@/components/shared/PageTransition";

export function DashboardLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-bg">
        <AppSidebar />
        <SidebarInset className="bg-bg">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-glass-border bg-bg/80 px-4 backdrop-blur-md sm:px-6">
            <SidebarTrigger className="text-text-secondary hover:text-text-primary" />
            <Separator orientation="vertical" className="h-5 bg-glass-border" />
            <Breadcrumbs />
            <div className="ml-auto flex items-center gap-3">
              <CommandMenu />
              <NotificationCenter />
              <UserMenu />
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
              <AnimatePresence mode="wait">
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              </AnimatePresence>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
