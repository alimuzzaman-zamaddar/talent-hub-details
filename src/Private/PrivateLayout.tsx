"use client";
import useAuth from "@/Hooks/useAuth";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  useEffect(() => {
    if (!loading && !token && !user) {
      router.push("/auth/login");
    }
  }, [loading, token, user, router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-[#0E2B8B] animate-spin" />
      </div>
    );

  if (token || user) {
    return <>{children}</>;
  }

  return null;
};

export default PrivateLayout;
