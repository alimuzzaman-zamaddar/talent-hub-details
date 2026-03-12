import axios from "axios";
import { getItem, removeItem } from "@/lib/localStorage";

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_SITE_URL,
});

axiosSecure.interceptors.request.use(
  config => {
    const token = getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axiosSecure.interceptors.response.use(
  response => response,
  async error => {
    const status = error.response?.status;


    if (status === 401) {
      removeItem("token");
      window.location.href = "/auth/login"; 
    }

    return Promise.reject(error);
  },
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
