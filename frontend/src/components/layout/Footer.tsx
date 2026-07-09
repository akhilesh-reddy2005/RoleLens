import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-glass-border py-12">
      <div className="container-page flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-text-primary">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            RoleLens
          </div>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            AI-powered resume screening and job role recommendations for engineers who want a
            clear next step.
          </p>
        </div>
        <div className="flex gap-10 text-sm text-text-secondary">
          <div className="flex flex-col gap-2">
            <span className="label-eyebrow">Product</span>
            <a href="#features" className="hover:text-text-primary">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary">How it works</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="label-eyebrow">Company</span>
            <a href="#faq" className="hover:text-text-primary">FAQ</a>
            <a href="#contact" className="hover:text-text-primary">Contact</a>
          </div>
        </div>
      </div>
      <div className="container-page mt-10 border-t border-glass-border pt-6 text-xs text-text-secondary">
        © {new Date().getFullYear()} RoleLens. All rights reserved.
      </div>
    </footer>
  );
}
