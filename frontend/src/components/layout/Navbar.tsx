import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-glass-border bg-bg/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-base font-bold tracking-tight text-text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-glow-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          RoleLens
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-text-secondary transition-colors hover:text-text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-text-secondary hover:text-text-primary">
                Dashboard
              </Button>
              <Button variant="secondary" size="sm" onClick={logout} className="bg-glass-bg text-text-primary hover:bg-glass-border">
                <LogOut className="h-4 w-4" /> Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-text-secondary hover:text-text-primary">
                Log in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")} className="bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
                Get started
              </Button>
            </>
          )}
        </div>

        <button className="text-text-primary md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-glass-border md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 pb-6 pt-4">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-text-secondary" onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <>
                    <Button variant="secondary" onClick={() => navigate("/dashboard")} className="bg-glass-bg text-text-primary">
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={logout} className="text-text-secondary">
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => navigate("/login")} className="bg-glass-bg text-text-primary">
                      Log in
                    </Button>
                    <Button onClick={() => navigate("/register")} className="bg-brand-primary text-white">
                      Get started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
