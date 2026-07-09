import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layers, MailCheck } from "lucide-react";
import { Button } from "../components/ui/Button";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    // Wire this up to Supabase Auth's resetPasswordForEmail on the client,
    // or a dedicated backend endpoint if you prefer server-issued reset links.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid-glow px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Layers className="h-4 w-4" />
          </span>
          RoleLens
        </Link>

        <div className="card-surface p-8">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <MailCheck className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-xl font-semibold">Check your inbox</h1>
              <p className="mt-2 text-sm text-muted">
                If an account exists for that email, a reset link is on its way.
              </p>
              <Link to="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
                Back to log in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold">Reset your password</h1>
              <p className="mt-1 text-sm text-muted">
                Enter the email on your account and we will send a reset link.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm text-muted" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="you@company.com"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
                </div>

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Send reset link
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                Remembered it?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
