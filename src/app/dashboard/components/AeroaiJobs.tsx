"use client";

import { CiLocationOn } from "react-icons/ci";
import { useToggleBookmark } from "@/Hooks/api/dashboard_api";
import toast from "react-hot-toast";
import { BookSvg } from "@/Components/Svg/SvgContainer";
import bgImg from "../../../Assets/Hero section (2).png";
import { useState, useEffect } from "react";
import { useGetAeroAIJobs } from "@/Hooks/api/homepage_api";
import Link from "next/link";
import { JobCardSkeleton } from "@/Components/Common/Loader";
import { ImSpinner2 } from "react-icons/im";

export default function AeroaiJobs() {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const [page, setPage] = useState(1);
  const [localJobs, setLocalJobs] = useState<any[]>([]);
  const [id, setId] = useState<number | null>(null);

  const queryParams = {
    page,
    search: search || undefined,
    tenant_id: company || undefined,
    location: location || undefined,
    category: category || undefined,
    sort_order: sortBy || undefined,
  };

  const { mutate: toggleBookmark, isPending } = useToggleBookmark();
  const { data, isLoading } = useGetAeroAIJobs(queryParams);

  const handleToggleBookmark = (jobId: number) => {
    setLocalJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, is_bookmarked: !job.is_bookmarked } : job,
      ),
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
          } else {
            toast.error("Something went wrong");
          }
        },
        onError: () => {
          toast.error("Failed to update bookmark");
          setLocalJobs(prev =>
            prev.map(job =>
              job.id === jobId
                ? { ...job, is_bookmarked: !job.is_bookmarked }
                : job,
            ),
          );
        },
      },
    );
  };

  const pagination = data?.data?.jobs;
  const totalPages = pagination?.last_page || 1;

  useEffect(() => {
    if (data?.data?.jobs?.data) {
      setLocalJobs(data.data.jobs.data);
    }
  }, [data]);

  return (
    <div className="pb-12">
      {/* HERO */}
      <section className="px-4 xl:px-0">
        <div
          className="relative overflow-hidden rounded-2xl p-8 text-white bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgImg.src}')` }}
        >
          <div className="absolute inset-0 bg-[#0E2B8B]/10"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-semibold">
              Discover jobs tailored to you with AeroAI
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Smart recommendations based on your skills. Upload your CV in your
              profile settings & start exploring AeroAI.
            </p>
          </div>
        </div>
      </section>

      {/* JOBS GRID */}
      <section className="mt-8">
        {/* ✅ Centered full-page loader */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#0E2B8B] border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm font-medium text-gray-500 animate-pulse">
                Loading jobs…
              </p>
            </div>
          </div>
        ) : localJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
            <h2 className="text-xl font-semibold text-gray-800">
              It looks like your profile does not have a CV yet.
            </h2>
            <p className="mt-3 text-sm text-gray-500 max-w-md">
              Upload your CV in User Settings so AeroAI can recommend jobs that
              match your experience.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {localJobs.map((job: any) => {
                const isSaved = job.is_bookmarked;

                return (
                  <div
                    key={job.id}
                    className="rounded-xl border border-[#DFE1E7] bg-white p-5 shadow-sm flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-gray-800 bg-gray-100">
                          {job.company_name?.charAt(0)}
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
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 shrink-0">
                        {job.job_type}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                      {job.description_preview}
                    </p>

                    <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <CiLocationOn /> {job.location}
                    </p>

                    <div className="mt-auto pt-5 flex items-center gap-3">
                      <Link
                        href={`/dashboard/aeroai-jobs/${job.id}`}
                        className="flex-1 rounded-lg bg-[#0E2B8B] py-2.5 text-sm font-semibold text-white text-center hover:opacity-90"
                      >
                        Details
                      </Link>

                      <button
                        disabled={isPending}
                        onClick={() => {
                          setId(job.id);
                          handleToggleBookmark(job.id);
                        }}
                        className={`flex justify-center items-center h-10 w-10 rounded-lg border border-[#DFE1E7] text-lg transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
                          isSaved
                            ? "bg-[#0E2B8B] text-white"
                            : "bg-white text-[#0E2B8B]"
                        }`}
                      >
                        {isPending && job.id === id ? (
                          <ImSpinner2 className="text-lg animate-spin" />
                        ) : (
                          <BookSvg />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="mt-10 flex flex-col items-start justify-between gap-4 text-sm text-gray-600 sm:flex-row sm:items-center">
              <p>
                Showing {pagination?.from || 0} to {pagination?.to || 0} of{" "}
                {pagination?.total || 0} results
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p: any) => Math.max(p - 1, 1))}
                  className="rounded-lg border border-[#DFE1E7] bg-white px-3 py-1 text-black disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`h-8 w-8 rounded-lg border border-[#DFE1E7] text-sm ${
                      page === n
                        ? "bg-[#0E2B8B] text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((p: any) => Math.min(p + 1, totalPages))
                  }
                  className="rounded-lg border border-[#DFE1E7] bg-white px-3 py-1 text-black disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
