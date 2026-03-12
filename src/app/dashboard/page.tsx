"use client";
import PageHeader from "./components/PageHeader";
import ApplicationsChart from "./components/ApplicationsChart";
import StatsCardsSection from "./components/StatsCardsSection";
import { useGetDashboardStates } from "@/Hooks/api/dashboard_api";
import ApplicationStatusBreakdown from "./components/ApplicationStatusBreakdown";

export default function DashboardPage() {
  const { data, isLoading } = useGetDashboardStates();
  console.log(data?.data, "from dashboard");

  const statistics = data?.data?.statistics;
  console.log(statistics, "statictis");
  const monthlyChart = data?.data?.monthly_chart;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-[#0E2B8B] animate-spin" />
      </div>
    );

  return (
    <main className="px-4 sm:px-6 py-6 space-y-6">
      <PageHeader user={statistics?.user} />
      <StatsCardsSection statistics={statistics} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 min-w-0">
          <ApplicationsChart monthlyChart={monthlyChart} />
        </div>

        <div className="w-full lg:w-90">
          <ApplicationStatusBreakdown statistics={statistics} />
        </div>
      </div>
    </main>
  );
}
