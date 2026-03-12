"use client";

import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function StatusBadge({ status }: any) {
  const styles: any = {
    "Assessment Day": "bg-[#ECFDF5] text-[#047857]",
    "In Review": "bg-[#FFF7ED] text-[#B45309]",
    Interview: "bg-[#ECFDF5] text-[#047857]",
    Hired: "bg-[#D1FAE5] text-[#047857]",
    Rejected: "bg-[#FEE2E2] text-[#DC2626]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function ApplicationsTableSection({ applications }: any) {
  const perPage = 5;
  const totalResults = applications.length;

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalResults / perPage);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return applications.slice(start, start + perPage);
  }, [applications, page]);

  const showingFrom = totalResults === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, totalResults);

  return (
    <section className="w-full font-sans">
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
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {paginatedItems.map((row: any) => (
                  <tr
                    key={row.id}
                    className="border-t border-[#DFE1E7] text-sm text-gray-800"
                  >
                    <td className="px-6 py-5">{row.code}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">
                      {row.job_title}
                    </td>
                    <td className="px-6 py-5">{row.company}</td>
                    <td className="px-6 py-5">{row.date_applied}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-6 py-5">{row.last_update}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#DFE1E7] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Showing {showingFrom} to {showingTo} of {totalResults} results
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg border border-[#DFE1E7] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-lg border border-[#DFE1E7] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
