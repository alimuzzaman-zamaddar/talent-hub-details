"use client";

import { useForm } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";
import AeroAITab from "./components/AeroAITab";
import ContactTab from "./components/ContactTab";
import { useSearchParams } from "next/navigation";
import PasswordTab from "./components/PasswordTab";
import { useEffect, useRef, useState } from "react";
import LinkAccountTab from "./components/LinkAccountTab";
import TimeLanguageTab from "./components/TimeLanguageTab";
import NotificationsTab from "./components/NotificationsTab";
import { getGeneral, useGeneralPost } from "@/Hooks/api/dashboard_api";

const settingsTabsData = {
  title: "Settings",
  subtitle: "Manage your account preferences, privacy, and notifications.",
  buttonText: "Save Change",
  tabs: [
    { id: "general", label: "General" },
    { id: "contact", label: "Contact" },
    { id: "aeroai", label: "AeroAI" },
    { id: "link", label: "Link Account" },
    { id: "password", label: "Password" },
    { id: "notifications", label: "Notifications" },
  ],
};

export default function page() {
  const { data } = getGeneral();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "general",
  );

  const { mutate: saveProfile, isPending } = useGeneralPost();

  // ✅ Ref to trigger submit from outside the form
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const userProfile = data?.data?.candidate?.profile?.user;
  const employment = data?.data?.candidate?.profile?.profile?.employment || [];
  const jobFunctions = data?.data?.job_functions;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      current_job_title: "",
      department: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      const currentEmployment = employment?.find(
        (e: any) => e.is_current === "1",
      );

      reset({
        first_name: userProfile.first_name || "",
        last_name: userProfile.last_name || "",
        current_job_title: currentEmployment?.job_title || "",
        department: userProfile.department || "",
      });
    }
  }, [userProfile, employment, reset]);

  const onSubmit = (formData: any) => {
    saveProfile(formData);
  };

  // ✅ Tabs that have their own internal save button
  const tabsWithOwnSaveButton = [
    "contact",
    "password",
    "link",
    "notifications",
    "aeroai",
    "time",
  ];
  const showHeaderSaveButton = !tabsWithOwnSaveButton.includes(activeTab);

  return (
    <section className="w-full pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#0E2B8B]">
            {settingsTabsData.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {settingsTabsData.subtitle}
          </p>
        </div>

        {/* ✅ Save button — only shown for General tab (others have their own) */}
        {showHeaderSaveButton && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => submitBtnRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-[#0E2B8B] text-white text-sm font-medium 
                       hover:bg-[#0a2070] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Saving..." : settingsTabsData.buttonText}
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-[#DFE1E7] bg-white overflow-hidden flex flex-col lg:flex-row min-h-[520px]">
        {/* Sidebar */}
        <aside className="w-full lg:w-[260px] border-b lg:border-b-0 lg:border-r border-[#DFE1E7] p-4">
          <div className="space-y-2">
            {settingsTabsData.tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-start rounded-xl px-4 py-3 text-sm font-medium transition cursor-pointer
                ${
                  isActive
                    ? "bg-[#F8FAFC] text-gray-900 border border-[#DFE1E7]"
                    : "text-gray-500 hover:bg-[#F8FAFC]"
                }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === "general" && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#0E2B8B]">
                  Account Details
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  Your users will use this information to <br />
                  contact you.
                </p>
              </div>

              <div className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      errors.first_name ? "border-red-400" : "border-[#DFE1E7]"
                    } focus:border-[#0E2B8B]`}
                    {...register("first_name")}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      errors.last_name ? "border-red-400" : "border-[#DFE1E7]"
                    } focus:border-[#0E2B8B]`}
                    {...register("last_name")}
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Current Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                      errors.current_job_title
                        ? "border-red-400"
                        : "border-[#DFE1E7]"
                    } focus:border-[#0E2B8B]`}
                    {...register("current_job_title")}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Function / Department
                  </label>
                  <div className="mt-2 relative">
                    <select
                      className="w-full appearance-none rounded-xl border border-[#DFE1E7] px-4 py-3 text-sm outline-none focus:border-[#0E2B8B]"
                      {...register("department")}
                    >
                      <option value="">Select department</option>
                      {jobFunctions?.map((fn: { id: number; name: string }) => (
                        <option key={fn.id} value={fn.name}>
                          {fn.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <button ref={submitBtnRef} type="submit" className="hidden" />
              </div>
            </form>
          )}

          {activeTab === "contact" && <ContactTab />}
          {activeTab === "link" && <LinkAccountTab />}
          {activeTab === "time" && <TimeLanguageTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "password" && <PasswordTab />}
          {activeTab === "aeroai" && <AeroAITab />}
        </div>
      </div>
    </section>
  );
}
