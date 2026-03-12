"use client";
import { useGetUserData } from "@/Hooks/api/auth_api";
import useLocalStorage from "@/Hooks/useLocalStorage";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextValue {
  loading: boolean;
  user: any;
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  setStartDate: any;
  setEndDate: any;
  setJobId: any;
  setLocationId: any;
  setStatus: any;
  setCountry: any;
  status: any;
  setPage: any;
  page: any;
  country: any;
  startDate: any;
  endDate: any;
  locationId: any;
  jobId: any;
}

export const AuthContextProvider = createContext<AuthContextValue | any>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ Start as true so PrivateLayout always shows spinner on first render
  // prevents flash of user=null before React Query fetches the user
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [token, setToken, clearToken] = useLocalStorage("token", null);
  const { data: userData, isLoading: loadingUserData } = useGetUserData(token);

  const [country, setCountry] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [jobId, setJobId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    // ✅ No token: immediately stop loading, clear user
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // ✅ Token exists but query hasn't resolved yet: keep loading
    if (loadingUserData) {
      setLoading(true);
      return;
    }

    // ✅ Token exists and query is done: set user from response
    setLoading(false);

    if (userData?.data) {
      setUser(userData.data);
    } else {
      setUser(null);
    }
  }, [token, userData, loadingUserData]);

  const contextValue: AuthContextValue = {
    loading,
    user,
    token,
    setToken,
    clearToken,
    setCountry,
    setStartDate,
    setEndDate,
    setJobId,
    setLocationId,
    setStatus,
    setPage,
    status,
    page,
    country,
    startDate,
    endDate,
    jobId,
    locationId,
  };

  return (
    <AuthContextProvider.Provider value={contextValue}>
      {children}
    </AuthContextProvider.Provider>
  );
}
