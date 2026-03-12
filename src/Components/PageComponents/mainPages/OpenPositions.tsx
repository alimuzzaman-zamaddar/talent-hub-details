"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { useRouter } from "next/navigation";

type Job = {
  id: number;
  title: string;
  location: string;
  job_type: string;
  contract_type: string;
  category: string;
};

type Filters = {
  locations: { id: number; label: string }[];
  job_functions: { id: number; name: string }[];
};

type DropdownItem = {
  label: string;
  value: string;
};

function useOutsideClick(ref: any, callback: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}

function Dropdown({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: DropdownItem[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(boxRef, () => setOpen(false));

  return (
    <div ref={boxRef} className="relative w-full sm:w-auto">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full sm:min-w-35 items-center justify-between gap-2 rounded-lg border border-[#DFE1E7] bg-white px-4 py-2  font-medium text-gray-800 shadow-sm hover:bg-gray-50"
      >
        <span className="truncate">{value ? value : label}</span>
        <span className="text-gray-500">
          <FaAngleDown />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-full sm:w-56 overflow-hidden rounded-xl border border-[#DFE1E7] bg-white shadow-lg">
          {items.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-3  text-gray-800 transition hover:bg-gray-100 ${
                value === item.value ? "bg-gray-100" : ""
              }`}
            >
              <span className="truncate">{item.label}</span>
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

export default function OpenPositions({
  jobs,
  filters,
}: {
  jobs: Job[];
  filters: Filters;
}) {
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const departmentItems = useMemo(() => {
    return [
      { label: "All", value: "" },
      ...(filters?.job_functions?.map((f) => ({
        label: f.name,
        value: f.name,
      })) || []),
    ];
  }, [filters]);

  const locationItems = useMemo(() => {
    return [
      { label: "All", value: "" },
      ...(filters?.locations?.map((l) => ({
        label: l.label,
        value: l.label,
      })) || []),
    ];
  }, [filters]);

  const sortItems: DropdownItem[] = [
    { label: "Default", value: "" },
    { label: "A → Z", value: "az" },
    { label: "Z → A", value: "za" },
  ];

  const filteredJobs = useMemo(() => {
    let result = [...(jobs || [])];

    if (departmentFilter)
      result = result.filter((j) => j.category === departmentFilter);

    if (locationFilter)
      result = result.filter((j) => j.location.includes(locationFilter));

    if (sortBy === "az")
      result.sort((a, b) => a.title.localeCompare(b.title));

    if (sortBy === "za")
      result.sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [jobs, departmentFilter, locationFilter, sortBy]);

  const router = useRouter();

  return (
    <section className="mx-auto mt-10 max-w-272.75 px-4 xl:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold text-black">
          Open Positions
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:w-auto">
          <Dropdown
            label="Functions"
            value={departmentFilter}
            items={departmentItems}
            onChange={setDepartmentFilter}
          />

          <Dropdown
            label="Location"
            value={locationFilter}
            items={locationItems}
            onChange={setLocationFilter}
          />

          <Dropdown
            label="Sort by"
            value={sortBy}
            items={sortItems}
            onChange={setSortBy}
          />
        </div>
      </div>

      {/* Jobs list */}
      <div className="mt-6 space-y-6">
        {filteredJobs.map((job) => (
          console.log(job,"job data"),
          <div
            key={job.id}
            className="rounded-xl border border-[#DFE1E7] bg-white p-5"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-400 text-white font-bold">
                  {job.title.charAt(0)}
                </div>

                <h3 className="text-base font-semibold text-gray-900">
                  {job.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {job.contract_type}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {job.job_type}
                </span>
              </div>
            </div>

            {/* Info row */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8 text-gray-500">
              <div className="flex items-center gap-2 ">
                <CiLocationOn />
                {job.category}
              </div>

              <div className="flex items-center gap-2 ">
                <CiLocationOn />
                {job.location}
              </div>
            </div>

            {/* Details button */}
            <button
              onClick={() => router.push(`/${job.id}`)}
              className="mt-4 w-full rounded-lg bg-[#17225f] py-3  font-medium text-white hover:opacity-90"
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}