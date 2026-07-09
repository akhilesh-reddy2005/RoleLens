import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MailCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/shared/FloatingInput";
import { AuthLayout } from "@/layouts/AuthLayout";
import { scaleIn } from "@/lib/animations";

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
    <AuthLayout>
      {sent ? (
        <motion.div initial="hidden" animate="visible" variants={scaleIn} className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <MailCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold text-text-primary">Check your inbox</h1>
          <p className="mt-2 text-sm text-text-secondary">
            If an account exists for that email, a reset link is on its way.
          </p>
          <Link to="/login" className="mt-6 inline-block text-sm text-brand-primary hover:underline">
            Back to log in
          </Link>
        </motion.div>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-text-primary">Reset your password</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Enter the email on your account and we will send a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <FloatingInput
              id="email"
              type="email"
              label="Email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Button type="submit" disabled={isSubmitting} className="h-11 w-full bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Send reset link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Remembered it?{" "}
            <Link to="/login" className="text-brand-primary hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
