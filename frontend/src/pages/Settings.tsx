import { useState, useEffect } from "react";
import { Loader2, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/cards/GlassCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FloatingInput } from "@/components/shared/FloatingInput";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
      localStorage.setItem("rolelens_theme", "light");
      toast.success("Switched to Light theme");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("rolelens_theme", "dark");
      toast.success("Switched to Dark theme");
    }
  };

  async function handleSave() {
    setIsSaving(true);
    // Wire this to PATCH /profile once that endpoint is added on the backend.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success("Profile updated");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Settings</h1>
      <p className="mt-1 text-sm text-text-secondary">Manage your profile and preferences.</p>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="bg-glass-bg">
          <TabsTrigger value="profile" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-5">
          <GlassCard hover={false}>
            <h2 className="font-semibold text-text-primary">Profile</h2>
            <div className="mt-4 space-y-4">
              <FloatingInput id="fullName" label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <FloatingInput id="email" label="Email" value={user?.email ?? ""} disabled />
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </GlassCard>
        </TabsContent>

        <TabsContent value="preferences" className="mt-5">
          <GlassCard hover={false}>
            <h2 className="font-semibold text-text-primary mb-1">Preferences</h2>
            <p className="text-xs text-text-secondary mb-6">Customize your display and application appearance.</p>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-text-primary">Theme Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => toggleTheme("dark")}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                      theme === "dark"
                        ? "border-brand-primary bg-brand-primary/10 shadow-glow-primary text-white"
                        : "border-glass-border bg-glass-bg text-text-secondary hover:bg-glass-border/20 hover:text-text-primary"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#030712] border border-glass-border">
                      <Moon className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">Dark Mode</div>
                      <div className="text-[10px] opacity-70 mt-0.5">Easy on the eyes in low light</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleTheme("light")}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                      theme === "light"
                        ? "border-brand-primary bg-brand-primary/10 shadow-glow-primary text-brand-primary"
                        : "border-glass-border bg-glass-bg text-text-secondary hover:bg-glass-border/20 hover:text-text-primary"
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-gray-200">
                      <Sun className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">Light Mode</div>
                      <div className="text-[10px] opacity-70 mt-0.5">Clean, bright workspace look</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
