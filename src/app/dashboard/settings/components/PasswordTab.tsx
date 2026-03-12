"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useChangePassword } from "@/Hooks/api/dashboard_api"; 

const passwordTabData = {
  title: "Password",
  subtitle: "Change or view your password",
};

export default function PasswordTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  const onSubmit = (data: any) => {
    changePassword(
      {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        new_password_confirmation: data.confirmPassword,
      },
      {
        onSuccess: () => {
          reset(); 
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="text-lg font-semibold text-[#0E2B8B]">
            {passwordTabData.title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            {passwordTabData.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div
              className={`mt-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                errors.currentPassword ? "border-red-400" : "border-[#DFE1E7]"
              }`}
            >
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
                className="w-full text-sm outline-none"
                {...register("currentPassword", {
                  required: "Current password is required",
                  minLength: {
                    value: 6,
                    message: "Current password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.currentPassword.message as any}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              New Password <span className="text-red-500">*</span>
            </label>
            <div
              className={`mt-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                errors.newPassword ? "border-red-400" : "border-[#DFE1E7]"
              }`}
            >
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
                className="w-full text-sm outline-none"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                  validate: {
                    hasUpper: (v: string) =>
                      /[A-Z]/.test(v) || "Must contain 1 uppercase letter",
                    hasLower: (v: string) =>
                      /[a-z]/.test(v) || "Must contain 1 lowercase letter",
                    hasNumber: (v: string) =>
                      /[0-9]/.test(v) || "Must contain 1 number",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {!errors.newPassword && (
              <p className="mt-2 text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            )}
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.newPassword.message as any}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div
              className={`mt-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                errors.confirmPassword ? "border-red-400" : "border-[#DFE1E7]"
              }`}
            >
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your new password"
                className="w-full text-sm outline-none"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (v: string) =>
                    v === newPasswordValue || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message as any}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isPending}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
              isValid && !isPending
                ? "bg-[#0E2B8B] text-white hover:opacity-90 cursor-pointer cursor-pointer"
                : "bg-[#DCE0F2] text-white cursor-not-allowed"
            }`}
          >
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </form>
  );
}
