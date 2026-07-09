import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/shared/FloatingInput";
import { AuthLayout } from "@/layouts/AuthLayout";
import { extractErrorMessage } from "@/services/api";

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number"),
});

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    try {
      await registerUser(values.fullName, values.email, values.password);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  async function handleGoogleSignUp() {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error("Failed to start Google sign-up. Please try again.");
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-text-primary">Create your account</h1>
      <p className="mt-1.5 text-sm text-text-secondary">Start with a free resume analysis.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <FloatingInput id="fullName" label="Full name" error={errors.fullName?.message} {...register("fullName")} />

        <FloatingInput
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <FloatingInput
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          autoComplete="new-password"
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

        <Button type="submit" disabled={isSubmitting} className="h-11 w-full bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
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
        onClick={handleGoogleSignUp}
        className="h-11 w-full border border-glass-border bg-glass-bg text-text-primary hover:bg-glass-border/20 transition-all duration-200"
      >
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        </svg>
        Sign up with Google
      </Button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
