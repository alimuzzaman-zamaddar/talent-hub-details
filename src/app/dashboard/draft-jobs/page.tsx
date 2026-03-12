"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";
import { useGetDraftApplications } from "@/Hooks/api/dashboard_api";

interface Application {
  id: number;
  code: string | null;
  job_title: string;
  company: string;
  date_applied: string;
  status: string;
  last_update: string;
  last_stage: number;
}

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-600",
  "Pre-Screening": "bg-blue-50 text-blue-700",
  Shortlisted: "bg-purple-50 text-purple-700",
  "In Review": "bg-yellow-50 text-yellow-700",
  Appointed: "bg-indigo-50 text-indigo-700",
  Hired: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t border-[#DFE1E7]">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-6 py-5">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-16 text-center">
        <p className="text-sm text-gray-400">No draft applications found.</p>
      </td>
    </tr>
  );
}

const PAGE_SIZE = 10;

export default function DraftApplications() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetDraftApplications();
  const applications: Application[] = data?.data?.applications?.data ?? [];

  const totalResults = applications.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const showingFrom = totalResults === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, totalResults);
  const paginatedItems = applications.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleContinue = (row: Application) => {
    sessionStorage.setItem("applyJobId", String(row.id));

    sessionStorage.setItem("draftApplicationId", String(row.id));
    sessionStorage.setItem("draftLastStage", String(row.last_stage));

    router.push("/application");
  };

  const handleDelete = (id: number) => {
    console.log("Delete application:", id);
  };

  return (
    <section className="w-full px-4 sm:px-6 py-6">
      <h2 className="text-xl font-sans font-semibold text-[#17225f]">
        Draft Applications
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Track and manage all your draft job applications.
      </p>

      <section className="mt-4 w-full font-sans">
        <div className="rounded-2xl border border-[#DFE1E7] bg-white shadow-sm">
          <div className="w-full overflow-x-auto xl:overflow-x-visible">
            <div className="min-w-[1020px]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#] text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">Application ID</th>
                    <th className="px-6 py-4 font-medium">Job Title</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Date Applied</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Last Update</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  ) : isError ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-16 text-center text-sm text-red-500"
                      >
                        Failed to load applications. Please try again.
                      </td>
                    </tr>
                  ) : paginatedItems.length === 0 ? (
                    <EmptyState />
                  ) : (
                    paginatedItems.map(row => (
                      <tr
                        key={row.id}
                        className="border-t border-[#DFE1E7] text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-5 text-gray-400">
                          {row.code ?? "—"}
                        </td>
                        <td className="px-6 py-5 font-medium text-gray-900">
                          {row.job_title}
                        </td>
                        <td className="px-6 py-5">{row.company}</td>
                        <td className="px-6 py-5">{row.date_applied}</td>
                        <td className="px-6 py-5">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-6 py-5">{row.last_update}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleContinue(row)}
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#0E2B8B] bg-white px-3 py-1.5 text-xs font-medium text-[#0E2B8B] transition-colors hover:bg-[#0E2B8B] hover:text-white"
                            >
                              Continue
                              <FiArrowRight className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-red-200 bg-white p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:border-red-300"
                              title="Delete application"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#DFE1E7] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              {totalResults === 0
                ? "No results"
                : `Showing ${showingFrom} to ${showingTo} of ${totalResults} results`}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#DFE1E7] bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiChevronLeft />
              </button>
              <span className="text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#DFE1E7] bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
