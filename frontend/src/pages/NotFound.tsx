import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-mesh-bg" />
      <span className="relative font-mono text-sm text-text-secondary">404</span>
      <h1 className="relative mt-3 font-display text-3xl font-bold tracking-tight text-text-primary">
        This page does not exist
      </h1>
      <p className="relative mt-2 max-w-sm text-sm text-text-secondary">
        The page you are looking for was moved, renamed, or never existed.
      </p>
      <Link to="/" className="relative mt-6">
        <Button className="bg-brand-primary text-white shadow-glow-primary hover:bg-brand-primary/90">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
