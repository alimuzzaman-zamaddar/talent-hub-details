"use client";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { ImSpinner2 } from "react-icons/im";
import { FaAngleDown } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { useRef, useState, useEffect } from "react";
import useLocalStorage from "@/Hooks/useLocalStorage";
import { useGetPublicJobs } from "@/Hooks/api/job_api";
import { BookSvg } from "@/Components/Svg/SvgContainer";
import bgImg from "../../../Assets/Hero section (2).png";
import { useRouter, usePathname } from "next/navigation";
import { JobCardSkeleton } from "@/Components/Common/Loader";
import { useToggleBookmark } from "@/Hooks/api/dashboard_api";

function useOutsideClick(ref: any, callback: any) {
  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}

function Dropdown({ label, value, items, onChange }: any) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<any>(null);

  useOutsideClick(boxRef, () => setOpen(false));

  const selectedLabel =
    items.find((item: any) => item.value === value)?.label || label;

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex min-w-35 items-center justify-between gap-2 rounded-lg border border-[#DFE1E7] bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50"
      >
        <span>{selectedLabel}</span>
        <FaAngleDown className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 overflow-hidden rounded-xl border border-[#DFE1E7] bg-white shadow-lg">
          {items.map((item: any) => (
            <button
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-sm text-gray-800 transition hover:bg-gray-100 ${
                value === item.value ? "bg-gray-100" : ""
              }`}
            >
              <span className="text-nowrap w-full">{item.label}</span>
              {value === item.value && (
                <span className="font-bold text-[#0E2B8B]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("desc");
  const [page, setPage] = useState(1);
  const [localJobs, setLocalJobs] = useState<any[]>([]);
  const [id, setId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [token] = useLocalStorage("token", null);
  const { user } = useAuth();

  const isDashboard = pathname === "/dashboard/find-jobs";

  const handleClick = (e: React.MouseEvent, jobId: number) => {
    if (!token) {
      e.preventDefault();
      localStorage.setItem(
        "redirectAfterLogin",
        `/dashboard/find-jobs/${jobId}`,
      );
      router.push("/auth/login");
    }
  };

  const queryParams = {
    page,
    search: search || undefined,
    tenant_id: company || undefined,
    country: location || undefined,
    category: category || undefined,
    ...(sortBy === "sug" ? { sug: 1 } : { sort_order: sortBy || undefined }),
  };

  const { mutate: toggleBookmark, isPending } = useToggleBookmark();
  const { data, isLoading } = useGetPublicJobs(queryParams);

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
  const filters = data?.data?.filters_data;

  const companyItems = [
    { label: "Company Name", value: "" },
    ...(filters?.companies?.map((c: any) => ({ label: c.name, value: c.id })) ||
      []),
  ];

  const categoryItems = [
    { label: "Functions Name", value: "" },
    ...(filters?.job_functions?.map((c: any) => ({
      label: c.name,
      value: c.id,
    })) || []),
  ];

  const locationItems = [
    { label: "Country", value: "" },
    ...(filters?.locations?.map((l: any) => ({
      label: l.country,
      value: l.country,
    })) || []),
  ];

  const sortItems = [
    { label: "Descending", value: "desc" },
    { label: "Ascending", value: "asc" },
    { label: "Suggested", value: "sug" },
  ];

  const totalPages = pagination?.last_page || 1;
  const resetPage = () => setPage(1);

  useEffect(() => {
    if (data?.data?.jobs?.data) {
      const featured = data.data.jobs.data.filter(
        (j: any) => j.is_featured === true,
      );
      const rest = data.data.jobs.data.filter((j: any) => !j.is_featured);
      setLocalJobs([...featured, ...rest]);
    }
  }, [data]);

  return (
    <div className="pb-12 px-4 sm:px-6 py-6">
      {/* HERO — hidden on /dashboard/find-jobs */}
      <div className="w-full ">
        {/* <h2 className="text-xl font-semibold text-[#0E2B8B] capitalize">
          Find Jobs
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Keep track of jobs you've saved for later.
        </p> */}
      </div>
      {/* {!isDashboard && ( */}
      <section className="px-4 xl:px-0 mt-6">
        <div
          className="relative min-h-55 overflow-hidden rounded-2xl p-8 text-white bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${bgImg.src}')` }}
        >
          <div className="absolute inset-0 bg-[#0E2B8B]/10"></div>

          <div className="relative z-10">
            <h1 className="text-2xl font-semibold">
              Access 10.000+ of aviation jobs worldwide
            </h1>
            <p className="mt-2 text-sm text-white/80">
              Create your free account and let AeroAI match you with roles that
              fits your skills, experience and ambitions
            </p>

            <div className="mt-6 flex flex-col gap-3 rounded-xl bg-white p-3 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                placeholder="Search your job title or keyword..."
                className="w-full flex-1 rounded-lg border border-[#DFE1E7] px-4 py-3 text-sm text-gray-700 outline-none"
              />
              <button className="rounded-lg bg-[#0E2B8B] px-6 py-3 text-sm font-medium text-white hover:opacity-90 cursor-pointer">
                Find Job
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* )} */}

      {/* FILTERS — hidden on /dashboard/find-jobs */}
      {/* {!isDashboard && ( */}
      <section className="mt-8">
        <div className="flex flex-wrap justify-end gap-3">
          <Dropdown
            label="Company"
            value={company}
            items={companyItems}
            onChange={(v: any) => {
              setCompany(v);
              resetPage();
            }}
          />
          <Dropdown
            label="Functions"
            value={category}
            items={categoryItems}
            onChange={(v: any) => {
              setCategory(v);
              resetPage();
            }}
          />
          <Dropdown
            label="Location"
            value={location}
            items={locationItems}
            onChange={(v: any) => {
              setLocation(v);
              resetPage();
            }}
          />
          <Dropdown
            label="Sort by"
            value={sortBy}
            items={sortItems}
            onChange={(v: any) => {
              setSortBy(v);
              resetPage();
            }}
          />
        </div>
      </section>
      {/* )} */}

      {/* JOBS GRID */}
      <section className="mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <JobCardSkeleton key={i} />
              ))
            : localJobs.map((job: any) => {
                const isSaved = job.is_bookmarked;

                return (
                  <div
                    key={job.id}
                    className="rounded-[12px] border border-[#DFE1E7] bg-white p-5 shadow-sm flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 overflow-hidden shrink-0">
                          {job.logo ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BASE_URL}${job.logo}`}
                              alt={job.company_name || "Company logo"}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <span className="text-sm font-bold text-gray-800">
                              {job.company_name?.charAt(0)}
                            </span>
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

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          {job.job_type}
                        </span>
                        {job.is_featured && (
                          <span className="rounded-full bg-[#0E2B8B] px-3 py-1 text-xs font-semibold text-white">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                      {job.description_preview}
                    </p>

                    <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <CiLocationOn /> {job.location}
                    </p>

                    <div className="mt-auto pt-5 flex items-center gap-3">
                      <Link
                        onClick={e => handleClick(e, job.id)}
                        href={`/dashboard/find-jobs/${job.id}`}
                        className="flex-1 rounded-lg bg-[#0E2B8B] py-2.5 text-sm font-semibold text-white text-center hover:opacity-90"
                      >
                        Details
                      </Link>

                      <button
                        disabled={isPending}
                        onClick={() => {
                          if (!user) {
                            return router.push("/auth/login");
                          }

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
                  page === n ? "bg-[#0E2B8B] text-white" : "bg-white text-black"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p: any) => Math.min(p + 1, totalPages))}
              className="rounded-lg border border-[#DFE1E7] bg-white px-3 py-1 text-black disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
