import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/layouts/AuthLayout";

export default function AuthCallback() {
  const { loginWithGoogleToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    let subscriptionRef: { unsubscribe: () => void } | null = null;

    async function handleAuthCallback() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.access_token) {
          if (active) {
            await loginWithGoogleToken(session.access_token);
            toast.success("Successfully logged in!");
            navigate("/dashboard");
          }
        } else {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            subscriptionRef = subscription;
            if (event === "SIGNED_IN" && currentSession?.access_token) {
              if (active) {
                subscription.unsubscribe();
                try {
                  await loginWithGoogleToken(currentSession.access_token);
                  toast.success("Successfully logged in!");
                  navigate("/dashboard");
                } catch (err: any) {
                  console.error("Auth callback verification error:", err);
                  toast.error("Google authentication failed: " + (err.message || "Unknown error"));
                  navigate("/login");
                }
              }
            }
          });

          const timeout = setTimeout(() => {
            if (active) {
              subscription.unsubscribe();
              toast.error("Authentication timed out. Please try again.");
              navigate("/login");
            }
          }, 10000);

          return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        if (active) {
          toast.error("Authentication failed: " + (err.message || "Unknown error"));
          navigate("/login");
        }
      }
    }

    handleAuthCallback();

    return () => {
      active = false;
      if (subscriptionRef) {
        subscriptionRef.unsubscribe();
      }
    };
  }, [loginWithGoogleToken, navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
        <h2 className="mt-6 font-display text-xl font-semibold text-text-primary">Completing Sign-In</h2>
        <p className="mt-2 text-sm text-text-secondary">Please wait while we sync your account...</p>
      </div>
    </AuthLayout>
  );
}
