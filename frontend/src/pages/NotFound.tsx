import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-grid-glow px-6 text-center">
      <span className="font-mono text-sm text-muted">404</span>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page does not exist</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you are looking for was moved, renamed, or never existed.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
