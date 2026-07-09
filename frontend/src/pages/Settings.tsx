import { useState } from "react";
import { Loader2, Moon } from "lucide-react";
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
            <h2 className="font-semibold text-text-primary">Preferences</h2>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text-primary">Theme mode</div>
                <div className="text-xs text-text-secondary">RoleLens is designed as a dark-first interface.</div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-2.5 py-1 text-xs font-semibold text-brand-primary">
                <Moon className="h-3 w-3" /> Dark mode
              </span>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
