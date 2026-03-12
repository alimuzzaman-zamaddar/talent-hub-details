"use client";

import { AuthLockSVG } from "@/Components/Svg/SvgContainer";
import { useForgotPassword } from "@/Hooks/api/auth_api";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword({
      email: data.email,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-transparent">
      <div className="bg-white px-5 pb-6 pt-6 rounded-2xl w-full max-w-md">
        {/* Icon */}
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
          Forgot Password
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500 leading-relaxed">
          Enter your email address and we’ll send you <br />
          password reset instructions.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>

            <input
              type="text"
              placeholder="johndoe@example.com"
              className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                errors.email ? "border-red-400" : "border-[#DFE1E7]"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isPending}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
              isValid && !isPending
                ? "cursor-pointer bg-[#17225F] text-white hover:opacity-90"
                : "cursor-not-allowed bg-[#DCE0F2] text-white"
            }`}
          >
            {isPending ? "Sending..." : "Forgot Password"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have access anymore?
            <Link
              href="https://aeroselect.io/getintouch/"
              className="ml-1 font-medium text-[#17225f]"
            >
              Contact AeroHire Support Team
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
