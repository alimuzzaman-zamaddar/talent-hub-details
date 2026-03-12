"use client";
import Image from "next/image";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { CiLocationOn } from "react-icons/ci";
import { BookSvg } from "@/Components/Svg/SvgContainer";
import { JobCardSkeleton } from "@/Components/Common/Loader";
import { getSavedJobs, useToggleBookmark } from "@/Hooks/api/dashboard_api";

export default function SavedJobsPage() {
  const [page, setPage] = useState(1);
  const { data: savedJobs, isLoading } = getSavedJobs(page);
  const { mutate: toggleBookmark, isPending } = useToggleBookmark();
  const meta = savedJobs?.meta;
  const [activeJobId, setActiveJobId] = useState<number | null>(null);

  const handleToggleBookmark = (jobId: number) => {
    setActiveJobId(jobId);
    toggleBookmark({
      endpoint: `/candidate/bookmarks/${jobId}`,
      data: { job_id: jobId },
    });
  };

  return (
    <section className="pb-12 px-4 sm:px-6 py-6">
      <div className="w-full ">
        <h2 className="text-xl font-sans font-semibold text-[#17225f]">
          Saved Jobs
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Keep track of jobs you’ve saved for later.
        </p>
      </div>

      <div className="mt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
          ) : savedJobs?.data?.length > 0 ? (
            savedJobs?.data?.map((job: any) => {
              const isSaved = job?.is_bookmarked;
              return (
                <div
                  key={job?.id}
                  className="group relative rounded-2xl border border-[#EDF0F7] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                  <button
                    disabled={isPending}
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleBookmark(job?.id);
                    }}
                    className="absolute top-6 right-6 z-20 transition-transform active:scale-90 disabled:opacity-50 cursor-pointer"
                  >
                    {isPending && job?.id === activeJobId ? (
                      <ImSpinner2 className="animate-spin text-[#0E2B8B] text-xl" />
                    ) : (
                      <div
                        className={`transition-colors duration-200 cursor-pointer ${
                          isSaved
                            ? "text-[#0E2B8B] fill-[#0E2B8B]"
                            : "text-gray-300 fill-none hover:text-gray-400"
                        }`}
                      >
                        <BookSvg />
                      </div>
                    )}
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                      {job.logo ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${job.logo}`}
                          alt={job.company_name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <span className="text-sm font-bold text-gray-800">
                          {job.company_name?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="pr-8">
                      <h3 className="text-lg font-bold text-[#1A1C21] leading-snug">
                        {job?.title}
                      </h3>
                      <p className="text-[15px] font-medium text-gray-400">
                        {job?.company_name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#F3F4F6] px-4 py-1 text-xs font-semibold text-gray-500">
                      {job?.job_type || "Full-time"}
                    </span>
                  </div>

                  <p className="mt-5 text-[14px] leading-relaxed text-gray-500 line-clamp-2">
                    {job?.description_preview ||
                      "No description available for this position."}
                  </p>

                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <CiLocationOn className="text-lg" />
                      <span className="text-sm font-medium">
                        {job?.location}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 flex justify-center items-center">
              <p className="text-gray-400 text-lg">No saved jobs found.</p>
            </div>
          )}
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              disabled={!meta.prev_page_url}
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-gray-600">
              {meta.current_page} <span className="text-gray-300 mx-1">/</span>
              {meta.last_page}
            </span>

            <button
              disabled={!meta.next_page_url}
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
