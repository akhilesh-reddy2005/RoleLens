import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="container-page flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Layers className="h-3.5 w-3.5" />
            </span>
            RoleLens
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted">
            AI-powered resume screening and job role recommendations for engineers who want a
            clear next step.
          </p>
        </div>
        <div className="flex gap-10 text-sm text-muted">
          <div className="flex flex-col gap-2">
            <span className="label-eyebrow text-muted/70">Product</span>
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="label-eyebrow text-muted/70">Company</span>
            <a href="#faq" className="hover:text-ink">FAQ</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </div>
        </div>
      </div>
      <div className="container-page mt-10 border-t border-border/60 pt-6 text-xs text-muted">
        © {new Date().getFullYear()} RoleLens. All rights reserved.
      </div>
    </footer>
  );
}
