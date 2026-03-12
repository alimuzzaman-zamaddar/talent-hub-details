"use client";

import { AuthUserSVG } from "@/Components/Svg/SvgContainer";
import { useLogin } from "@/Hooks/api/auth_api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

type LoginFormData = {
  email: string;
  password: string;
  keepLogin: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginUser, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      keepLogin: false,
    },
  });
  const onSubmit = (data: LoginFormData) => {
    loginUser(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response: any) => {
          const token = response?.data?.data?.token;
          const role = response?.data?.data?.role;
          const user = response?.data?.data?.user;

          if (token) {
            // Save token
            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", role);

            router.push("/dashboard");
          }
        },
        onError: (error: any) => {
          console.error("Login failed:", error);
          alert("Invalid email or password");
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 bg-transparent">
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
              <AuthUserSVG />
            </div>
          </div>
        </div>
        {/* Title */}
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Glad to see you again. Log in to your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email address <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Enter your email"
              className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition 
              ${
                errors.email
                  ? "border-red-400 bg-red-50 text-red-600 placeholder:text-red-400"
                  : "border-[#DFE1E7]"
              }`}
              {...register("email", {
                required: "The email address you entered is wrong!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "The email address you entered is wrong!",
                },
              })}
            />

            {errors.email && (
              <p className="mt-2 flex items-center gap-2 text-xs text-red-500">
                ⛔ {errors.email.message}
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
                errors.password
                  ? "border-red-400 bg-red-50"
                  : "border-[#DFE1E7]"
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full text-sm outline-none bg-transparent"
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
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Keep login + forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#DFE1E7] accent-[#17225F] cursor-pointer"
                {...register("keepLogin")}
              />
              Keep me logged in
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-[#17225f] font-medium hover:underline cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={!isValid || isPending}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
              isValid
                ? "bg-[#17225F] text-white hover:opacity-90"
                : "bg-[#DCE0F2] text-white cursor-not-allowed"
            }`}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>

          {/* Bottom link */}
          <p className="text-center text-sm text-gray-500">
            <span>Don't have an account? </span>
            <Link
              href="/auth/register"
              className="font-medium text-[#17225f] cursor-pointer"
            >
              Register
            </Link>
            <span className=""> for free </span>
          </p>
        </form>
      </div>
    </div>
  );
}
