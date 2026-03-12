"use client";

import Link from "next/link";
import {
  CheckSvg,
  File2Svg,
  FileSvg,
  MessageSvg,
} from "@/Components/Svg/SvgContainer";
import { IoMdArrowForward } from "react-icons/io";

export default function StatsCardsSection({ statistics }: any) {
  const iconMap = {
    file: <FileSvg />,
    chat: <MessageSvg />,
    bookmark: <File2Svg />,
    check: <CheckSvg />,
  };

  const statsData = [
    {
      id: 1,
      title: "Applications Submitted",
      value: statistics?.total_applications || 0,
      icon: "file",
      link: "/dashboard/applications",
    },
    {
      id: 2,
      title: "Appointments Scheduled",
      value: statistics?.interview || 0,
      icon: "chat",
      link: "/dashboard/appointments",
    },
    {
      id: 3,
      title: "Saved Jobs",
      value: statistics?.saved_jobs || 0,
      icon: "bookmark",
      link: "/dashboard/saved-jobs",
    },
    {
      id: 4,
      title: "Offers Received",
      value: statistics?.offered_received || 0,
      icon: "check",
      link: "/offers",
    },
  ];

  return (
    <section className="w-full">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 my-5">
        {statsData.map((item, index) => (
          <Link key={item.id} href={item.link}>
            <div className="rounded-2xl border border-[#DFE1E7] bg-white p-5 shadow-sm cursor-pointer hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#DFE1E7] text-[#0E2B8B]">
                  {iconMap[item.icon as keyof typeof iconMap]}
                </div>

                {index !== statsData.length - 1 && (
                  <button className="text-gray-400 hover:text-gray-600">
                    <IoMdArrowForward size={18} className="cursor-pointer" />
                  </button>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {item.value}
                </h3>

                <p className="mt-1 text-base font-sans text-gray-500">
                  {item.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
