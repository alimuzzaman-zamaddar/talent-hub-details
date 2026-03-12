// All Dashboard API
import toast from "react-hot-toast";
import useClientApi from "../useClientApi";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// dashboard data
export const useGetDashboardStates = () => {
  return useClientApi({
    method: "get",
    key: ["candidate-dashboard"],
    endpoint: "/candidate/dashboard",
    isPrivate: true,
  });
};

export const useGetAllApplications = () => {
  return useClientApi({
    method: "get",
    key: ["candidate-applications"],
    endpoint: "/candidate/applications",
    isPrivate: true,
  });
};

export const useGetDraftApplications = () => {
  return useClientApi({
    method: "get",
    key: ["candidate-applications", "draft"],
    endpoint: "/candidate/applications?status=draft",
    isPrivate: true,
  });
};

export const useGetAllSavedJobs = (params?: any) => {
  return useClientApi({
    method: "get",
    key: ["candidate-bookmarks", params],
    endpoint: "/candidate/bookmarks",
    isPrivate: true,
    params,
  });
};

// Saved Jobs
export const getSavedJobs = (page: number) => {
  return useClientApi({
    method: "get",
    key: ["saved-jobs", page],
    endpoint: "/candidate/bookmarks",
    params: { page },
    isPrivate: true,
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "put",
    key: ["toggle-bookmark"],
    isPrivate: true,
    onSuccess: (res: any) => {
      if (res?.success) {
        toast.success(res.message || "Updated successfully");
        queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      } else {
        toast.error("Something went wrong");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// General Post Api Hooks
export const useGeneralPost = () => {
  return useClientApi({
    method: "post",
    key: ["general-post"],
    endpoint: "/update-profile",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};
// Cv Post Api Hooks
export const useCvPost = () => {
  return useClientApi({
    method: "post",
    key: ["cv-post"],
    endpoint: "/candidate/settings",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// Delete Cv Post Api Hooks
export const useDeleteCvPost = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "delete",
    key: ["delete-cv"],
    endpoint: "/candidate/cv",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["get-cv"] });
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// Social Link Post Api Hooks
export const usesociallinklPost = () => {
  return useClientApi({
    method: "post",
    key: ["link-post"],
    endpoint: "/candidate/link-account",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// Change Password Api Hooks
export const useChangePassword = () => {
  return useClientApi({
    method: "post",
    key: ["change-password"],
    endpoint: "/change-password",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// Notification Api Hooks
export const useNotification = () => {
  return useClientApi({
    method: "put",
    key: ["notification"],
    endpoint: "/candidate/notifications-settings",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// Logout Api Hooks
export const useLogout = () => {
  return useClientApi({
    method: "post",
    key: ["logout"],
    endpoint: "/logout",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// General Get Api Hooks
export const getGeneral = () => {
  return useClientApi({
    method: "get",
    key: ["get-genenral"],
    endpoint: "/candidate/settings",
    isPrivate: true,
  });
};

// Cv Get Api Hooks
export const getCv = () => {
  return useClientApi({
    method: "get",
    key: ["get-cv"],
    endpoint: "/candidate/cv",
    isPrivate: true,
  });
};

// Get Application Api Hooks
export const getApplication = (Job_id: number) => {
  return useClientApi({
    method: "get",
    key: ["get-cv", Job_id],
    endpoint: `/candidate/applications/create/${Job_id}`,
    isPrivate: true,
  });
};

export const getApplicationPreview = (Application_id: number) => {
  return useClientApi({
    method: "get",
    key: ["get-preview", Application_id],
    endpoint: `/candidate/applications/${Application_id}`,
    isPrivate: true,
  });
};

// save Draft Api Hooks
export const useSaveDraft = (options?: {
  onSuccess?: (response: any) => void;
}) => {
  return useClientApi({
    method: "post",
    key: ["draft"],
    endpoint: "/candidate/applications/1",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        // toast.success(response.message);
        options?.onSuccess?.(response);
      } else {
        toast.error(
          response?.data || response?.message || "Something went wrong",
        );
      }
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.data || // ← "You have already applied..."
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(msg);
    },
  });
};

// submit Application  Api Hooks
export const useSubmitApplication = () => {
  return useClientApi({
    method: "post",
    key: ["submit-application"],
    endpoint: "/candidate/application/submit",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};

// Cancel Application  Api Hooks
export const useSubmitCancel = () => {
  return useClientApi({
    method: "post",
    key: ["Cancel-application"],
    endpoint: "/candidate/application/cencel",
    isPrivate: true,
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
};
