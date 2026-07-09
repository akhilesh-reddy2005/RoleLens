import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { deleteAnalysisRequest, getHistoryRequest } from "../services/resume.service";
import { AnalysisHistoryItem } from "../types";

const PAGE_SIZE = 8;

export default function History() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getHistoryRequest()
      .then(setItems)
      .catch(() => toast.error("Could not load history"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.resumes?.file_name?.toLowerCase().includes(q) ||
        item.recommended_roles?.some((r) => r.role.toLowerCase().includes(q))
    );
  }, [items, query]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  async function handleDelete(id: string) {
    const previous = items;
    setItems((curr) => curr.filter((i) => i.id !== id));
    try {
      await deleteAnalysisRequest(id);
      toast.success("Analysis deleted");
    } catch {
      setItems(previous);
      toast.error("Failed to delete analysis");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Analysis history</h1>
      <p className="mt-1 text-sm text-muted">Every resume you have analyzed, in one place.</p>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by file name or role"
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <Card className="mt-6 overflow-x-auto p-0">
        {isLoading ? (
          <Loader label="Loading history" />
        ) : paged.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">File</th>
                <th className="px-5 py-3 font-medium">Top role</th>
                <th className="px-5 py-3 font-medium">Resume score</th>
                <th className="px-5 py-3 font-medium">ATS score</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map((item) => (
                <tr key={item.id} className="hover:bg-border/30">
                  <td className="px-5 py-3.5">
                    <Link to={`/dashboard/analysis?id=${item.id}`} className="text-ink hover:text-primary">
                      {item.resumes?.file_name ?? "Resume"}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{item.recommended_roles?.[0]?.role ?? "—"}</td>
                  <td className="px-5 py-3.5 font-mono text-muted">{item.resume_score}</td>
                  <td className="px-5 py-3.5 font-mono text-muted">{item.ats_score}</td>
                  <td className="px-5 py-3.5 text-muted">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-muted hover:text-danger"
                      aria-label="Delete analysis"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-14 text-center text-sm text-muted">No analyses match your search.</div>
        )}
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`h-8 w-8 rounded-md ${
                page === idx + 1 ? "bg-primary text-white" : "text-muted hover:bg-border/40"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
