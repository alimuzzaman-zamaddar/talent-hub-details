"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiFileText,
  FiBookmark,
  FiMessageCircle,
  FiSearch,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { useLogout } from "@/Hooks/api/dashboard_api";
import Logo from "../../../Assets/logo/AeroHire pbA.svg";
import Logo1 from "../../../Assets/logo/image.png";
import Image from "next/image";
const sidebarData = {
  mainMenu: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "My Applications", href: "/dashboard/applications", icon: "file" },
    { label: "Saved Jobs", href: "/dashboard/saved-jobs", icon: "bookmark" },
    { label: "Draft", href: "/dashboard/draft-jobs", icon: "bookmark" },
  ],
  explore: [
    { label: "Find Jobs", href: "/dashboard/find-jobs", icon: "search" },
    { label: "AeroAI Jobs", href: "/dashboard/aeroai-jobs", icon: "building" },
  ],
  settings: [
    { label: "Settings", href: "/dashboard/settings", icon: "settings" },
  ],
  upgradeCard: {
    title: "Want an Upgrade?",
    subtitle: "Aviation ready CV templates that boosts results.",
    buttonText: "Try AeroCV for free",
    buttonHref: "/dashboard/upgrade",
  },
};

function LogoutModal({
  onCancel,
  onConfirm,
  isPending,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-5">
          <FiLogOut size={24} className="text-red-500" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900">Logout</h3>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to Logout to TalentHub?
        </p>

        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 rounded-xl border border-[#DFE1E7] py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-medium text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging out..." : "Yes, Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { mutate: logout, isPending } = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const iconMap: any = {
    home: <FiHome size={18} />,
    file: <FiFileText size={18} />,
    bookmark: <FiBookmark size={18} />,
    chat: <FiMessageCircle size={18} />,
    search: <FiSearch size={18} />,
    building: <HiOutlineBuildingOffice2 size={18} />,
    settings: <FiSettings size={18} />,
  };

  const renderMenu = (items: any) => {
    return items.map((item: any) => {
      const active = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
            active
              ? "bg-[#F3F6FB] text-gray-900"
              : "text-gray-500 hover:bg-[#F3F6FB] hover:text-gray-900"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? item.label : ""}
        >
          <span className={`${active ? "text-[#0E2B8B]" : "text-gray-400"}`}>
            {iconMap[item.icon]}
          </span>
          {!collapsed && <span>{item.label}</span>}
        </Link>
      );
    });
  };

  const handleLogoutConfirm = () => {
    logout(undefined, {
      onSuccess: () => {
        setShowLogoutModal(false);
        router.push("/auth/login");
      },
    });
  };

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
          isPending={isPending}
        />
      )}

      <aside
        className={`transition-all duration-300 ease-in-out flex flex-col justify-between h-screen border-r border-gray-200 overflow-y-auto no-scrollbar ${
          collapsed ? "w-[90px]" : "w-[280px]"
        }`}
      >
        <div>
          {/* Top */}
          <div className="flex items-center justify-between px-4 pt-4.5">
            {!collapsed ? (
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="Arohire Logo"
                  width={500}
                  height={500}
                  priority
                />
              </Link>
            ) : (
              <Link
                href="/"
                className="flex items-center justify-center w-full pr-2"
              >
                <Image
                  src={Logo1}
                  alt="Arohire Logo"
                  width={500}
                  height={500}
                  priority
                />
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#DFE1E7] text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          <div className="my-2 h-px w-full bg-[#DFE1E7]" />

          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            <div>
              {!collapsed && (
                <p className="mb-3 px-2 text-base font-sans text-[#666D80]">
                  Main Menu
                </p>
              )}
              <div className="space-y-1 text-base font-sans text-[#666D80]">
                {renderMenu(sidebarData.mainMenu)}
              </div>
            </div>

            <div>
              {!collapsed && (
                <p className="mb-3 px-2 text-base font-sans text-[#666D80]">
                  Explore
                </p>
              )}
              <div className="space-y-1">{renderMenu(sidebarData.explore)}</div>
            </div>

            <div>
              {!collapsed && (
                <p className="mb-3 px-2 text-base font-sans text-[#666D80]">
                  Settings &amp; Support
                </p>
              )}
              <div className="space-y-1 text-base font-sans text-[#666D80]">
                {renderMenu(sidebarData.settings)}
              </div>
            </div>

            <div>
              {!collapsed && (
                <p className="mb-3 px-2 text-base text-gray-400">Account</p>
              )}
              <button
                onClick={() => setShowLogoutModal(true)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition cursor-pointer ${
                  collapsed ? "justify-center px-0" : ""
                }`}
                title={collapsed ? "Logout" : ""}
              >
                <FiLogOut size={18} className="text-gray-400" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {!collapsed && (
            <div className="mt-6 rounded-2xl bg-[#0E2B8B] p-5 text-white">
              <h3 className="text-lg font-semibold">
                Master your airline assessment.
              </h3>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                Get professional assessment preparation and leadership courses.
                Enter FLYWITHME at checkout to save 20%.
              </p>
              <Link
                href="https://Training.aeroselect.io"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0E2B8B] hover:opacity-90 cursor-pointer"
              >
                EXPLORE COURSES
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
