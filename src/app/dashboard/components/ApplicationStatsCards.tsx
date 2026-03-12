"use client";

import {
  FiFileText,
  FiClock,
  FiMessageCircle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function ApplicationStatsCards({ summary }: any) {
  const iconMap = {
    total: <FiFileText size={18} color="[#1A47D5]" />,
    review: <FiClock size={18} color="[#1A47D5]"/>,
    appointments: <FiMessageCircle size={18} color="[#1A47D5]"/>,
    hired: <FiCheckCircle size={18} color="[#1A47D5]"/>,
    rejected: <FiXCircle size={18} color="[#1A47D5]"/>,
  };

  const statsData = [
    {
      id: 1,
      label: "Total Applications",
      value: summary?.total || 0,
      icon: "total",
    },
    {
      id: 2,
      label: "In Review",
      value: summary?.in_review || 0,
      icon: "review",
    },
    {
      id: 3,
      label: "Appointments Scheduled",
      value: summary?.appointed || 0,
      icon: "appointments",
    },
    { id: 4, label: "Hired", value: summary?.hired || 0, icon: "hired" },
    {
      id: 5,
      label: "Rejected",
      value: summary?.rejected || 0,
      icon: "rejected",
    },
  ];

  return (
    <section className="w-full my-6 pr-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsData.map(item => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#DFE1E7] bg-white p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#DFE1E7] text-[#0E2B8B]">
              {iconMap[item.icon as keyof typeof iconMap]}
            </div>

            <h3 className="mt-4 text-2xl font-semibold text-gray-900">
              {item.value}
            </h3>

            <p className="mt-1 text-base font-sans  text-[#666D80]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
