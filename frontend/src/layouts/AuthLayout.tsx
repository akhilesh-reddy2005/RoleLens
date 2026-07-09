import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-mesh-bg" />
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 animate-float-slow rounded-full bg-brand-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 animate-float rounded-full bg-brand-accent/20 blur-[100px]" />

      <motion.div initial="hidden" animate="visible" variants={fadeInUp} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-bold text-text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-glow-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          RoleLens
        </Link>

        <div className="glass-strong rounded-3xl p-8 shadow-card">{children}</div>
      </motion.div>
    </div>
  );
}
