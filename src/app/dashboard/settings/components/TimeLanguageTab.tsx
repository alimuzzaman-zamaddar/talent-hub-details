"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiChevronDown } from "react-icons/fi";
import { getGeneral, useGeneralPost } from "@/Hooks/api/dashboard_api";


const TIMEZONE_MAP: Record<string, string> = {
  UTC: "Greenwich Mean Time (GMT)",
  "America/Los_Angeles": "Pacific Standard Time (PST)",
  "America/New_York": "Eastern Standard Time (EST)",
  "Europe/Berlin": "Central European Time (CET)",
  "Asia/Dhaka": "Bangladesh Standard Time (BST)",
};

const LANGUAGE_MAP: Record<string, string> = {
  en: "English (United States)",
  "en-GB": "English (United Kingdom)",
  de: "Deutsch (German)",
  fr: "Français (French)",
  bn: "বাংলা (Bangla)",
};


const TIMEZONE_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(TIMEZONE_MAP).map(([k, v]) => [v, k]),
);

const LANGUAGE_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(LANGUAGE_MAP).map(([k, v]) => [v, k]),
);

const timeLanguageData = {
  time: {
    title: "Time",
    subtitle:
      "Set your preferred time zone to ensure that\nall activities align with your local time.",
    label: "Time Zone",
    options: Object.values(TIMEZONE_MAP),
  },
  language: {
    title: "Set your language",
    subtitle:
      "Choose the language. All text and\ncommunication will be displayed in the\nlanguage you select.",
    label: "Language",
    options: Object.values(LANGUAGE_MAP),
  },
};

export default function TimeLanguageTab() {
  const { data } = getGeneral();
  const { mutate: saveTimeLanguage, isPending } = useGeneralPost();

  const profile = data?.data?.candidate?.profile?.user;

  const [currentTime, setCurrentTime] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      timeZone: "Greenwich Mean Time (GMT)",
      language: "English (United States)",
    },
  });

  const timeZoneValue = watch("timeZone");

  useEffect(() => {
    if (profile) {
      reset({
        timeZone: TIMEZONE_MAP[profile.timezone] || "Greenwich Mean Time (GMT)",
        language: LANGUAGE_MAP[profile.language] || "English (United States)",
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = (formData: any) => {
    saveTimeLanguage({
      timezone: TIMEZONE_REVERSE[formData.timeZone] || "UTC",
      language: LANGUAGE_REVERSE[formData.language] || "en",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {timeLanguageData.time.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 whitespace-pre-line max-w-sm">
              {timeLanguageData.time.subtitle}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              {timeLanguageData.time.label}{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 relative">
              <select
                className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.timeZone ? "border-red-400" : "border-[#DFE1E7]"
                } focus:border-[#0E2B8B]`}
                {...register("timeZone", { required: "Time zone is required" })}
              >
                {timeLanguageData.time.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {errors.timeZone && (
              <p className="mt-1 text-xs text-red-500">
                {errors.timeZone.message}
              </p>
            )}

            <p className="mt-3 text-sm text-gray-500">
              The current time is{" "}
              <span className="font-medium text-gray-800">{currentTime}</span>.
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-[#DFE1E7]" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {timeLanguageData.language.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 whitespace-pre-line max-w-sm">
              {timeLanguageData.language.subtitle}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              {timeLanguageData.language.label}{" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 relative">
              <select
                className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.language ? "border-red-400" : "border-[#DFE1E7]"
                } focus:border-[#0E2B8B]`}
                {...register("language", { required: "Language is required" })}
              >
                {timeLanguageData.language.options.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {errors.language && (
              <p className="mt-1 text-xs text-red-500">
                {errors.language.message}
              </p>
            )}
          </div>
        </div>

        
      </div>
    </form>
  );
}
