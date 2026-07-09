import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  History,
  LayoutDashboard,
  Map,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";

const PAGES = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/upload", label: "Upload resume", icon: Upload },
  { to: "/dashboard/analysis", label: "Resume analysis", icon: Sparkles },
  { to: "/dashboard/skill-gap", label: "Skill gap", icon: Target },
  { to: "/dashboard/roadmap", label: "Career roadmap", icon: Map },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function go(to: string) {
    setOpen(false);
    navigate(to);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-lg border border-glass-border bg-glass-bg px-3 text-sm text-text-secondary transition-colors hover:border-white/[0.14] hover:text-text-primary"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-glass-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-secondary sm:flex">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to a page..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {PAGES.map((page) => (
              <CommandItem key={page.to} onSelect={() => go(page.to)}>
                <page.icon className="h-4 w-4" />
                <span>{page.label}</span>
                <CommandShortcut>↵</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
