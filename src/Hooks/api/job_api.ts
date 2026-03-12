"use client";
import useClientApi from "@/Hooks/useClientApi";

export const useGetPublicJobs = (params: any) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return useClientApi({
    method: "get",
    key: ["public-jobs", params],
    endpoint: "/public/jobs",
    params,
    isPrivate: token ? true : false,
  });
};
