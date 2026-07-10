import { useMemo, useState } from "react";
import { Briefcase, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { JobCard } from "@/components/cards/JobCard";
import { JobFilters } from "@/components/shared/JobFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { useLiveJobs } from "@/hooks/queries/useLiveJobs";
import { useSavedJobs } from "@/hooks/queries/useSavedJobs";
import { useSaveJob, useUnsaveJob } from "@/hooks/queries/useSaveJob";
import { useSerpApiSearch } from "@/hooks/queries/useSerpApiSearch";
import { JobFilters as JobFiltersType, LiveJob } from "@/types";
import { extractErrorMessage } from "@/services/api";

function JobGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-2xl bg-glass-bg" />
      ))}
    </div>
  );
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | 'ellipsis')[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push('ellipsis');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
  }

  return pages;
}

export default function Jobs() {
  const [filters, setFilters] = useState<JobFiltersType>({ location: "India", page: 1 });
  const { data, isLoading } = useLiveJobs(filters);
  const { data: saved } = useSavedJobs();
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();
  const serpApiSearch = useSerpApiSearch();

  const savedIds = useMemo(() => new Set((saved ?? []).map((s) => s.job_id)), [saved]);

  async function handleToggleSave(job: LiveJob) {
    try {
      if (savedIds.has(job.id)) {
        await unsaveMutation.mutateAsync(job.id);
        toast.success("Removed from saved jobs");
      } else {
        await saveMutation.mutateAsync(job.id);
        toast.success("Job saved");
      }
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  async function handleSerpApiSearch() {
    try {
      const result = await serpApiSearch.mutateAsync();
      toast.success(`Found ${result.fetched} postings for "${result.query}" (${result.inserted} new)`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">Live jobs</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Showing India-based postings by default, ranked by how closely they match your resume's skills and
            recommended role. Clear the location filter to see jobs worldwide.
          </p>
        </div>
        <Button
          onClick={handleSerpApiSearch}
          disabled={serpApiSearch.isPending}
          className="shrink-0 bg-brand-accent text-white shadow-glow-accent hover:bg-brand-accent/90"
        >
          {serpApiSearch.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search with Google Jobs
        </Button>
      </div>

      <Tabs defaultValue="live" className="mt-6">
        <TabsList className="bg-glass-bg">
          <TabsTrigger value="live" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            Live jobs
          </TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white">
            Saved ({saved?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-5 space-y-6">
          <JobFilters value={filters} onChange={setFilters} />

          {isLoading ? (
            <JobGridSkeleton />
          ) : data?.jobs.length ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {data.jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    saved={savedIds.has(job.id)}
                    onToggleSave={handleToggleSave}
                    isSaving={saveMutation.isPending || unsaveMutation.isPending}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    {filters.page && filters.page > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setFilters((f) => ({ ...f, page: (filters.page || 1) - 1 }));
                          }}
                        />
                      </PaginationItem>
                    )}

                    {getPageNumbers(filters.page || 1, totalPages).map((p, idx) => (
                      <PaginationItem key={idx}>
                        {p === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={filters.page === p || (!filters.page && p === 1)}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setFilters((f) => ({ ...f, page: p }));
                            }}
                          >
                            {p}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    {filters.page && filters.page < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setFilters((f) => ({ ...f, page: (filters.page || 1) + 1 }));
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No jobs match your filters"
              description="Try clearing a filter or checking back soon — the live feed refreshes automatically."
              action={
                <Button onClick={() => setFilters({ page: 1 })} className="bg-brand-primary text-white">
                  Clear filters
                </Button>
              }
            />
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-5">
          {!saved ? (
            <div className="flex items-center justify-center gap-3 py-14 text-text-secondary">
              <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
              Loading saved jobs
            </div>
          ) : saved.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {saved.map((s) => (
                <JobCard
                  key={s.job_id}
                  job={s.live_jobs}
                  saved
                  onToggleSave={handleToggleSave}
                  isSaving={unsaveMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={Briefcase} title="No saved jobs yet" description="Save a job from the live feed to find it here later." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
