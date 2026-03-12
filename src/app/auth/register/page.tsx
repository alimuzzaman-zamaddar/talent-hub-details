"use client";

import { AuthUserSVG } from "@/Components/Svg/SvgContainer";
import { useRegister } from "@/Hooks/api/auth_api";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerUser, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const email = watch("email");
  const password = watch("password");
  const showCheckbox =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password.length >= 6;

  const onSubmit = (data: any) => {
    registerUser({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      role: "user",
      password: data.password,
      password_confirmation: data.confirmPassword,
      term_accept: data.acceptTerms,
      policy_accept: data.acceptTerms,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-transparent">
      <div className="bg-white px-5 pb-2 pt-5 rounded-2xl">
        <div className="w-full max-w-md">
          {/* Icon circle */}
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
                <AuthUserSVG />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
            Create New Account
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* First Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                First Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter your first name"
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.firstName ? "border-red-400" : "border-[#DFE1E7]"
                }`}
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                })}
              />

              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {typeof errors.firstName.message === "string"
                    ? errors.firstName.message
                    : "Invalid input"}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Last Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter your last name"
                className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.lastName ? "border-red-400" : "border-[#DFE1E7]"
                }`}
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                })}
              />

              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {typeof errors.lastName.message === "string"
                    ? errors.lastName.message
                    : "Invalid input"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                placeholder="Enter your email"
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
                  {typeof errors.email.message === "string"
                    ? errors.email.message
                    : "Invalid input"}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Password <span className="text-red-500">*</span>
              </label>

              <div
                className={`mt-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                  errors.password ? "border-red-400" : "border-[#DFE1E7]"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full text-sm outline-none"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {typeof errors.password.message === "string"
                    ? errors.password.message
                    : "Invalid input"}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Confirm Password <span className="text-red-500">*</span>
              </label>

              <div
                className={`mt-2 flex items-center justify-between rounded-xl border px-4 py-3 ${
                  errors.confirmPassword ? "border-red-400" : "border-[#DFE1E7]"
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full text-sm outline-none bg-transparent"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: value =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {typeof errors.confirmPassword.message === "string"
                    ? errors.confirmPassword.message
                    : "Invalid input"}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-[#DFE1E7] accent-[#17225F]"
                  {...register("acceptTerms", {
                    required: "You must accept the Terms & Conditions",
                  })}
                />
                I agree to the
                <a
                  href="https://aeroselect.io/gtc-b2b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#17225F] underline"
                >
                  GTC
                </a>
                <a
                  href="https://aeroselect.io/dataprotection/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#17225F] underline"
                >
                  Privacy Policy
                </a>
                and
                <a
                  href="https://aeroselect.io/gdpa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#17225F] underline"
                >
                  GDPR
                </a>
              </label>

              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-red-500">
                  {typeof errors.acceptTerms.message === "string"
                    ? errors.acceptTerms.message
                    : "Invalid input"}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs leading-relaxed text-gray-400">
              By creating an account you confirm that you have read and agree to
              the Terms and Conditions, the Privacy Policy and the General Data
              Processing Agreement.
            </p>

            {/* Register button */}
            <button
              type="submit"
              disabled={!isValid || isPending}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition cursor-pointer ${
                isValid && !isPending
                  ? "bg-[#17225F] text-white hover:opacity-90 cursor-pointer"
                  : "bg-[#DCE0F2] text-white cursor-not-allowed"
              }`}
            >
              {isPending ? "Creating account..." : "Register"}
            </button>

            {/* Bottom link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <Link
                href="/auth/login"
                className="font-medium text-[#17225f] cursor-pointer ml-1"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
