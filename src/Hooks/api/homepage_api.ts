import useClientApi from "../useClientApi";

// Aero AI Recommended Jobs
export const useGetAeroAIJobs = (params: any) => {
  return useClientApi({
    method: "get",
    isPrivate: true,
    key: ["aero-ai-jobs", params],
    endpoint: "/candidate/aero-ai/jobs",
    params,
  });
};

// Public Job Details
export const useGetJobDetails = (jobId: number | string | null) => {
  return useClientApi({
    method: "get",
    key: ["job-details", jobId],
    endpoint: jobId ? `/public/jobs/${jobId}` : "",
    enabled: !!jobId,
  });
};
export const useGetJobPublicDetails = (jobId: number | string | null) => {
  return useClientApi({
    method: "get",
    key: ["job-details", jobId],
    endpoint: jobId ? `/public/jobs/${jobId}` : "",
    enabled: !!jobId,
  });
};

export const useCareerPage = (
  tenantDomain?: string | null,
  category?: string,
  location?: string,
  sort_order?: string
) => {
  const domain = tenantDomain ?? "rahat-4.christophlombar.thewarriors.team";

  return useClientApi({
    method: "get",
    key: ["career-page", domain, category, location, sort_order],
    endpoint: "/career-page",
    params: {
      ...(category && { category }),
      ...(location && { location }),
      ...(sort_order && { sort_order }),
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(domain && { "X-Tenant-Domain": domain }),
    },
    queryOptions: {
      refetchOnWindowFocus: false,
    },
  });
};

export const useCareerJobDetails = (
  jobId?: number | string,
  tenantDomain?: string | null
) => {
  const domain =
    tenantDomain ?? "rahat-4.christophlombar.thewarriors.team";

  return useClientApi({
    method: "get",
    key: ["career-job-details", jobId],
    endpoint: `/career-page/${jobId}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(domain && { "X-Tenant-Domain": domain }),
    },
    queryOptions: {
      enabled: !!jobId,
      refetchOnWindowFocus: false,
    },
  });
};