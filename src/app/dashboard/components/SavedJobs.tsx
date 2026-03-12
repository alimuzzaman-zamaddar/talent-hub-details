"use client";

import { SavedSvg } from "@/Components/Svg/SvgContainer";
import {
  useGetAllSavedJobs,
  useToggleBookmark,
} from "@/Hooks/api/dashboard_api";
import { useEffect, useMemo, useState } from "react";
import {FiMapPin } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function SavedJobs() {
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetAllSavedJobs({ page });
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();

  const apiJobs = data?.data || [];
  const meta = data?.meta;

  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    setJobs(apiJobs);
  }, [data]);

  const totalPages = meta?.last_page || 1;
  const totalResults = meta?.total || jobs.length || 0;

  const showingFrom =
    totalResults === 0 ? 0 : (meta?.per_page ? (page - 1) * meta.per_page + 1 : 1);

  const showingTo = meta?.per_page
    ? Math.min(page * meta.per_page, totalResults)
    : totalResults;

  const pagesToShow = useMemo(() => {
    const pages: any[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);

    if (totalPages <= 5) return pages;
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page, "...", totalPages];
  }, [page, totalPages]);

  // ✅ REAL toggle with API
  const handleToggleBookmark = (jobId: number) => {
    // Optimistic UI update
    setJobs((prev) =>
      prev.filter((job) => job.id !== jobId),
    );

    toggleBookmark(
      {
        endpoint: `/candidate/bookmarks/${jobId}`,
        data: { job_id: jobId },
      },
      {
        onSuccess: (res: any) => {
          if (res?.success) {
            toast.success(res.message || "Updated successfully");
            refetch(); // sync with backend
          } else {
            toast.error("Something went wrong");
          }
        },
        onError: () => {
          toast.error("Failed to update bookmark");
          refetch(); // rollback
        },
      },
    );
  };

  return (
    <section className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Saved Jobs</h2>
        
      </div>

      {isLoading && <div className="text-sm text-gray-500">Loading...</div>}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job: any) => (
          <div
            key={job.id}
            className="rounded-2xl border border-[#DFE1E7] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: "#EEF2FF" }}
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg overflow-hidden"
                >
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt={job.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{job.company_name?.charAt(0) || "J"}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {job.company_name}
                  </p>
                </div>
              </div>

              <button
                disabled={isPending}
                onClick={() => handleToggleBookmark(job.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer transition"
              >
                <span className="text-[#0E2B8B]">
                  <SavedSvg />
                </span>
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[job.job_type, job.work_model]
                .filter(Boolean)
                .map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
            </div>

            <p className="mt-4 text-sm text-gray-500 line-clamp-2">
              {job.description_preview}
            </p>

            <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <FiMapPin className="text-gray-400" />
              {job.location}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex flex-col items-start justify-between gap-4 text-sm text-gray-600 sm:flex-row sm:items-center">
        <p>
          Showing {showingFrom} to {showingTo} of {totalResults} results
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DFE1E7] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>

          {pagesToShow.map((p: any) =>
            p === "..." ? (
              <span
                key={`${p}-${Math.random()}`}
                className="flex h-9 w-9 items-center justify-center text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium ${
                  page === p
                    ? "border-[#0E2B8B] bg-[#0E2B8B] text-white"
                    : "border-[#DFE1E7] bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages))
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DFE1E7] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}