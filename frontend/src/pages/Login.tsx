import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingInput } from "@/components/shared/FloatingInput";
import { AuthLayout } from "@/layouts/AuthLayout";
import { extractErrorMessage } from "@/services/api";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error("Failed to start Google sign-in. Please try again.");
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-text-primary">Log in to your account</h1>
      <p className="mt-1.5 text-sm text-text-secondary">Pick up where you left off with your resume analysis.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <FloatingInput
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <FloatingInput
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-text-secondary hover:text-text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            {...register("password")}
          />
          <Link to="/forgot-password" className="mt-2 inline-block text-xs text-brand-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2.5 text-sm text-text-secondary">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Remember me
            </label>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="h-11 w-full bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Log in
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-glass-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0f172a] px-2 text-text-secondary">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGoogleSignIn}
        className="h-11 w-full border border-glass-border bg-glass-bg text-text-primary hover:bg-glass-border/20 transition-all duration-200"
      >
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        </svg>
        Sign in with Google
      </Button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-brand-primary hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
