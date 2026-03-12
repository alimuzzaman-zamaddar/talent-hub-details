"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getGeneral, useGeneralPost } from "@/Hooks/api/dashboard_api";

export default function ContactTab() {
  const { data } = getGeneral();
  const profile = data?.data?.candidate?.profile?.user;
  const { mutate: saveContact, isPending } = useGeneralPost();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: any) => {
    saveContact(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10"
    >
      <div>
        <h3 className="text-lg font-semibold text-[#0E2B8B]">
          Contact Setting
        </h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          View and update your account details, <br />
          profile, and more.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
              errors.email ? "border-red-400" : "border-[#DFE1E7]"
            } focus:border-[#0E2B8B]`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message as any}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Phone Number{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
              errors.phone ? "border-red-400" : "border-[#DFE1E7]"
            } focus:border-[#0E2B8B]`}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">
              {errors.phone.message as any}
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
