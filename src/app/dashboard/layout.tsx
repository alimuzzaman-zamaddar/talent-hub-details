"use client";

import React, { useState } from "react";
import Footer from "@/Shared/Footer";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import { FiMenu, FiX } from "react-icons/fi";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white overflow-y-hidden overflow-x-visible">
      {/* Desktop sidebar */}
      <div className="hidden xl:block shrink-0">
        <Sidebar />
      </div>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
        />
      )}

      {/* Mobile drawer sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen w-70 bg-white transform transition-transform duration-300 xl:hidden
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100"
        >
          <FiX size={22} />
        </button>

        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="shrink-0 flex items-center gap-3">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="m-3 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 xl:hidden"
          >
            <FiMenu size={20} />
          </button>

          <DashboardHeader />
        </div>

        <div className="flex-1 overflow-y-auto px-4 xl:px-6 min-w-0">
          <main className="pt-5">{children}</main>

          {/* <div className="mt-6">
            <Footer />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
