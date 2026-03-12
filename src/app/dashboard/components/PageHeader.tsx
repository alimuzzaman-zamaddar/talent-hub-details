"use client";
import { useRouter } from "next/navigation";
import { FiUser, FiSearch } from "react-icons/fi";

export default function PageHeader({ user }: any) {
  const router = useRouter();
  return (
    <section className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#17225f] capitalize">
          Welcome back, {user || "User"}!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Track your job search activities and stay updated on new
          opportunities.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard/settings")}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#DFE1E7] bg-white px-5 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
        >
          <FiUser />
          Edit Profile
        </button>

        <button
          onClick={() => router.push("/dashboard/find-jobs")}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#0E2B8B] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <FiSearch />
          Find Jobs
        </button>
      </div>
    </section>
  );
}
