import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [lightMode] = useState(true);

  async function handleSave() {
    setIsSaving(true);
    // Wire this to PATCH /profile once that endpoint is added on the backend.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success("Profile updated");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your profile and preferences.</p>

      <Card className="mt-6">
        <h2 className="font-semibold">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-muted" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              value={user?.email ?? ""}
              disabled
              className="h-11 w-full rounded-lg border border-border bg-border/30 px-3.5 text-sm text-muted outline-none"
            />
          </div>
          <Button onClick={handleSave} isLoading={isSaving}>
            Save changes
          </Button>
        </div>
      </Card>

      <Card className="mt-5">
        <h2 className="font-semibold">Preferences</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-ink">Theme Mode</div>
            <div className="text-xs text-muted">RoleLens is optimized with a professional light color palette.</div>
          </div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Light Mode
          </span>
        </div>
      </Card>
    </div>
  );
}
