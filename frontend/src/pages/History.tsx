import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/cards/GlassCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useHistory } from "@/hooks/queries/useHistory";
import { useDeleteAnalysis } from "@/hooks/queries/useDeleteAnalysis";
import { AnalysisHistoryItem } from "@/types";
import { formatDate, scoreTone } from "@/utils/format";

export default function History() {
  const { data: items, isLoading } = useHistory();
  const deleteMutation = useDeleteAnalysis();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !items) return items ?? [];
    return items.filter(
      (item) =>
        item.resumes?.file_name?.toLowerCase().includes(q) ||
        item.recommended_roles?.some((r) => r.role.toLowerCase().includes(q))
    );
  }, [items, query]);

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Analysis deleted");
    } catch {
      toast.error("Failed to delete analysis");
    }
  }

  const columns: ColumnDef<AnalysisHistoryItem>[] = [
    {
      accessorKey: "resumes.file_name",
      header: "File",
      cell: ({ row }) => (
        <Link to={`/dashboard/analysis?id=${row.original.id}`} className="font-medium text-text-primary hover:text-brand-primary">
          {row.original.resumes?.file_name ?? "Resume"}
        </Link>
      ),
    },
    {
      id: "topRole",
      header: "Top role",
      cell: ({ row }) => <span className="text-text-secondary">{row.original.recommended_roles?.[0]?.role ?? "—"}</span>,
    },
    {
      accessorKey: "resume_score",
      header: "Resume score",
      cell: ({ row }) => <StatusBadge label={String(row.original.resume_score)} tone={scoreTone(row.original.resume_score)} />,
    },
    {
      accessorKey: "ats_score",
      header: "ATS score",
      cell: ({ row }) => <StatusBadge label={String(row.original.ats_score)} tone={scoreTone(row.original.ats_score)} />,
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => <span className="text-text-secondary">{formatDate(row.original.created_at)}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-text-secondary hover:text-danger" aria-label="Delete analysis">
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-glass-border bg-surface-card text-text-primary">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this analysis?</AlertDialogTitle>
              <AlertDialogDescription className="text-text-secondary">
                This will permanently remove {row.original.resumes?.file_name ?? "this resume"} and its analysis. This
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-glass-bg text-text-primary hover:bg-glass-border">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(row.original.id)}
                className="bg-danger text-white hover:bg-danger/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Analysis history</h1>
      <p className="mt-1 text-sm text-text-secondary">Every resume you have analyzed, in one place.</p>

      <SearchInput value={query} onChange={setQuery} placeholder="Search by file name or role" className="mt-6 max-w-sm" />

      <GlassCard hover={false} className="mt-6 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-14 text-text-secondary">
            <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
            Loading history
          </div>
        ) : (
          <DataTable columns={columns} data={filtered} emptyMessage="No analyses match your search." />
        )}
      </GlassCard>
    </div>
  );
}
