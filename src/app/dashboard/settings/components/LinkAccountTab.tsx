"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaLinkedin } from "react-icons/fa";
import { getGeneral, usesociallinklPost } from "@/Hooks/api/dashboard_api";

export default function LinkAccountTab() {
  const { data } = getGeneral();
  const { mutate: saveLink, isPending } = usesociallinklPost();

  const socialLinks = data?.data?.candidate?.profile?.social_links;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }, // ✅ added isValid
  } = useForm({
    mode: "onChange",
    defaultValues: {
      linkedin: "",
    },
  });

  useEffect(() => {
    if (socialLinks) {
      reset({
        linkedin:
          socialLinks.find((l: any) => l.platform?.toLowerCase() === "linkedin")
            ?.url || "",
      });
    }
  }, [socialLinks, reset]);

  const validateLinkedIn = (value: any) => {
    const url = (value || "").trim();
    if (!url) return "LinkedIn profile link is required";
    if (!url.startsWith("https://"))
      return "LinkedIn link must start with https://";
    if (!url.includes("linkedin.com")) return "Enter a valid LinkedIn link";
    try {
      new URL(url);
      return true;
    } catch {
      return "Enter a valid LinkedIn URL";
    }
  };

  const onSubmit = (data: any) => {
    saveLink({
      social_links: [
        {
          platform: "LinkedIn",
          url: data.linkedin,
        },
      ],
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10"
    >
      {/* Left Info */}
      <div>
        <h3 className="text-lg font-semibold text-[#0E2B8B]">Link Account</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Your linked social media profile will be <br />
          shared with employers for application <br />
          review.
        </p>
      </div>

      {/* Right Form */}
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-600">
            LinkedIn <span className="text-red-500">*</span>
          </label>

          {/* Icon Input Container */}
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="https://www.linkedin.com/in/"
              className={`w-full rounded-xl border py-3 pl-4 pr-12 text-sm outline-none transition ${
                errors.linkedin ? "border-red-400" : "border-[#DFE1E7]"
              } focus:border-[#0E2B8B]`}
              {...register("linkedin", {
                validate: validateLinkedIn,
              })}
            />
            {/* LinkedIn Icon */}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <FaLinkedin className="text-xl text-[#0A66C2]" />
            </div>
          </div>

          {errors.linkedin && (
            <p className="mt-1 text-xs text-red-500">
              {errors.linkedin.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || isPending}
            className="px-6 py-2.5 rounded-xl bg-[#0E2B8B] text-white text-sm font-medium
                       hover:bg-[#0a2070] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
