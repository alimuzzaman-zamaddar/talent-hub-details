"use client";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { useRouter } from "next/navigation";
import useClientApi from "@/Hooks/useClientApi";

// Get User Data
export const useGetUserData = (token: any) => {
  return useClientApi({
    method: "get",
    key: ["user", token],
    enabled: !!token,
    endpoint: "/profile",
    isPrivate: true,
    queryOptions: {
      refetchInterval: 1000 * 60 * 60,
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useClientApi({
    method: "post",
    key: ["register"],
    endpoint: "/register",

    onSuccess: (response: any, variables: any) => {
      if (response?.success) {
        toast.success(response.message || "Registration successful");
        router.replace(`/auth/otp?email=${variables.email}`);
      } else {
        toast.error(response?.message || "Registration failed");
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong during registration",
      );
    },
  });
};
// Verify OTP
export const useVerifyOtp = () => {
  const router = useRouter();

  return useClientApi({
    method: "post",
    key: ["verify-otp"],
    endpoint: "/verify-otp",

    onSuccess: (response: any) => {
      if (response?.success) {
        toast.success(response?.message || "OTP verified successfully");
        router.replace("/auth/login");
      } else {
        toast.error(response?.message || "Invalid OTP");
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "OTP verification failed";

      toast.error(message);
    },
  });
};
// Verify OTP
export const useVerifyOtpReset = () => {
  const router = useRouter();

  return useClientApi({
    method: "post",
    key: ["verify-reset-otp"],
    endpoint: "/verify-reset-otp",

    onSuccess: (response: any, variables: any) => {
      if (response?.success) {
        toast.success(response?.message || "OTP verified successfully");

        // ✅ Pass email + otp to reset page
        router.replace(
          `/auth/reset-password?email=${variables.email}&otp=${variables.otp}`,
        );
      } else {
        toast.error(response?.message || "Invalid OTP");
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "OTP verification failed";

      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const { setToken } = useAuth();

  return useClientApi({
    method: "post",
    key: ["login"],
    endpoint: "/login",
    onSuccess: (response: any) => {
      if (response?.success) {
        const token = response?.data?.token;
        const role = response?.data?.role;
        if (!token) {
          toast.error("Token missing from response");
          return;
        }
        if (role !== "user") {
          toast.error(
            "The email address you entered is not linked to any account. Register here.",
          );
          return;
        }
        setToken(token);
        toast.success(response.message || "Login successful");
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          setTimeout(() => router.push(redirectPath), 100);
        } else {
          setTimeout(() => router.push("/dashboard"), 100);
        }
      } else {
        toast.error(response?.message || "Login failed");
      }
    },
  });
};

// Resend OTP
export const useResendOtp = () => {
  return useClientApi({
    method: "post",
    key: ["resend-otp"],
    endpoint: "/resend-otp",

    onSuccess: (response: any) => {
      if (response?.success) {
        toast.success(response?.message || "OTP resent successfully");
      } else {
        toast.error(response?.message || "Failed to resend OTP");
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP";

      toast.error(message);
    },
  });
};
// Resend OTP
export const useResendOtpReset = () => {
  return useClientApi({
    method: "post",
    key: ["reset-resend-otp"],
    endpoint: "/reset-resend-otp",

    onSuccess: (response: any) => {
      if (response?.success) {
        toast.success(response?.message || "OTP resent successfully");
      } else {
        toast.error(response?.message || "Failed to resend OTP");
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resend OTP";

      toast.error(message);
    },
  });
};

// Forgot Password
export const useForgotPassword = () => {
  const router = useRouter();

  return useClientApi({
    method: "post",
    key: ["forgot-password"],
    endpoint: "/forgot-password",

    onSuccess: (response: any, variables: any) => {
      if (response?.success) {
        toast.success(response?.message || "Password reset instructions sent");

        // Redirect to reset page (optionally pass email)
        router.push(`/auth/reset-otp?email=${variables.email}`);
      } else {
        toast.error(response?.message || "Failed to send reset email");
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    },
  });
};

// Reset Password
export const useResetPassword = () => {
  const router = useRouter();

  return useClientApi({
    method: "post",
    key: ["reset-password"],
    endpoint: "/reset-password",

    onSuccess: (response: any) => {
      if (response?.success) {
        toast.success(response?.message || "Password reset successful");

        router.replace("/auth/login");
      } else {
        toast.error(response?.message || "Failed to reset password");
      }
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Reset password failed";

      toast.error(message);
    },
  });
};
