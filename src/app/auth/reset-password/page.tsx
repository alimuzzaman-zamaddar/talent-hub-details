"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useResetPassword } from "@/Hooks/api/auth_api";
import { AuthLockSVG } from "@/Components/Svg/SvgContainer";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const { mutate: resetPassword, isPending } = useResetPassword();

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    mode: "onChange",
  });

  const newPasswordValue = watch("newPassword");

  // Redirect if missing required params
  useEffect(() => {
    if (!email || !otp) {
      router.replace("/auth/forgot-password");
    }
  }, [email, otp, router]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email || !otp) return;

    resetPassword({
      email,
      otp,
      new_password: data.newPassword,
      new_password_confirmation: data.confirmPassword,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white px-5 pb-6 pt-6 rounded-2xl w-full max-w-md">
        <div className="flex justify-center">
          <div
            className="
      flex p-4 items-start gap-4 rounded-[96px]
      border border-transparent
      bg-[linear-gradient(180deg,rgba(23,34,95,0.48)_0%,rgba(23,34,95,0.23)_52.08%,rgba(23,34,95,0.00)_100%,#FFF_100%)]
      bg-origin-border
      bg-clip-padding
    "
            style={{
              backgroundImage: `
        linear-gradient(180deg, rgba(23,34,95,0.48) 0%, rgba(23,34,95,0.23) 52.08%, rgba(23,34,95,0.00) 100%, #FFF 100%),
        linear-gradient(180deg, rgba(23,34,95,0.48) 0%, rgba(23,34,95,0.23) 52.08%, rgba(23,34,95,0.00) 100%, #FFF 100%)
      `,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <div className="flex p-[14px] justify-center items-center gap-[14px] rounded-[96px] border border-[#C9D6F7]/97 bg-white shadow-[0_2px_4px_0_rgba(179,212,253,0.04)]">
              <AuthLockSVG />
            </div>
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
          Create New Password
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Please enter a new password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              New Password
            </label>

            <div
              className={`mt-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                errors.newPassword ? "border-red-400" : "border-[#DFE1E7]"
              }`}
            >
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full text-sm outline-none"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="text-gray-400"
              >
                {showNewPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Confirm New Password
            </label>

            <div
              className={`mt-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                errors.confirmPassword ? "border-red-400" : "border-[#DFE1E7]"
              }`}
            >
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full text-sm outline-none"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === newPasswordValue || "Passwords do not match",
                })}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="text-gray-400"
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isPending}
            className={`mt-3 w-full rounded-xl py-3 text-sm font-semibold transition ${
              isValid && !isPending
                ? "bg-[#17225F] text-white hover:opacity-90"
                : "bg-[#DCE0F2] text-white cursor-not-allowed"
            }`}
          >
            {isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
