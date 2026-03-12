"use client";

import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { FiSearch, FiBell, FiSettings } from "react-icons/fi";

const notificationData = {
  title: "Notifications",
  items: [
    {
      id: 1,
      title: "Application Submitted",
      message:
        "Your application for Frontend Developer at TechHire Inc. has been successfully submitted. Good luck!",
      time: "1h ago",
      unread: true,
    },
    {
      id: 2,
      title: "Interview Scheduled",
      message:
        "You have an upcoming interview with CreativeFlow Studio on Nov 7, 2025 at 10:00 AM (GMT+7). Don't forget to prepare!",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      title: "Job Added to Favorites",
      message:
        "The job UI/UX Designer at NovaTech has been added to your saved list. You can view it anytime from your Saved Jobs page.",
      time: "1h ago",
      unread: false,
    },
    {
      id: 4,
      title: "Job Offer Received",
      message:
        "Congratulations! You've received a job offer from CloudCore Labs for the position Data Analyst. Review and respond as soon as possible.",
      time: "1h ago",
      unread: false,
    },
  ],
};

export default function DashboardHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notificationData.items);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setItems(prev => prev.map(x => ({ ...x, unread: false })));
  };

  return (
    <header className="w-full border-b border-[#DFE1E7] bg-white py-5 px-2 xl:px-6">
      <div className="flex items-center justify-end gap-4">
        {/* Search */}
        {/* <div className="relative w-full max-w-70">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-xl border border-[#DFE1E7] bg-white py-3 pl-11 pr-20 text-sm text-gray-700 outline-none focus:border-[#0E2B8B]"
          />

   
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md border border-[#DFE1E7] bg-gray-50 px-2 py-1 text-xs text-gray-500">
            <span className="text-xs">⌘</span>
            <span className="text-xs">K</span>
          </div>
        </div> */}

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notification + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {/* <button
              onClick={() => setOpen(!open)}
              className="relative flex h-6 w-6 xl:h-10 xl:w-10 items-center justify-center rounded-full border border-[#DFE1E7] bg-white text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              <FiBell className="text-base sm:text-lg md:text-xl lg:text-2xl" />

              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button> */}

            {/* ✅ Dropdown Modal */}
            {open && (
              <div className="absolute right-0 mt-3 w-70 xl:w-90 overflow-hidden rounded-2xl border border-[#DFE1E7] bg-white shadow-xl z-9999">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#DFE1E7] px-5 py-4">
                  <h3 className="text-sm xl:text-base font-semibold text-gray-900">
                    {/* {notificationData.title} */}
                  </h3>

                  <button className="cursor-pointer text-gray-400 hover:text-gray-600">
                    <FiSettings size={18} />
                  </button>
                </div>

                {/* List */}
                <div className="max-h-107.5 overflow-y-auto">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex gap-4 px-5 py-4 hover:bg-gray-50 transition"
                    >
                      {/* Icon */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#0E2B8B]">
                        <FiBell size={18} />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xs xl:text-sm font-semibold text-gray-900">
                            {item.title}
                          </h4>

                          {item.unread && (
                            <span className="mt-1 h-2 w-2 rounded-full bg-red-500"></span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] xl:text-xs leading-relaxed text-gray-500">
                          {item.message}
                        </p>

                        <p className="mt-2 text-[10px] xl:text-xs text-gray-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[#DFE1E7] px-5 py-4">
                  <button
                    onClick={markAllRead}
                    className="text-xs xl:text-sm font-medium text-[#0E2B8B] hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>

                  <button className="rounded-xl bg-[#0E2B8B] px-5 py-2 text-xs xl:text-sm xl:font-medium text-white hover:opacity-90 cursor-pointer">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-[#DFE1E7] flex items-center justify-center bg-gray-100">
              {user?.avatar_path ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.avatar_path}`}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-700 uppercase">
                  {`${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`}
                </span>
              )}
            </div>

            <p className="text-xs xl:text-sm xl:font-medium text-gray-900 hidden sm:block capitalize">
              {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
