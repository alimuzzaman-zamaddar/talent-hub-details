"use client";
import React from 'react'
import { useGetAllApplications } from '@/Hooks/api/dashboard_api'
import MyApplicationsHeader from "../components/MyApplicationsHeader"
import ApplicationStatsCards from "../components/ApplicationStatsCards"
import ApplicationsTableSection from "../components/ApplicationsTableSection"

const page = () => {
  const { data, isLoading } = useGetAllApplications();

  const summary = data?.data?.summary;
  const applications = data?.data?.applications?.data || [];

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-[#0E2B8B] animate-spin" />
      </div>
    );
  return (
    <div className='px-4 sm:px-6 py-6'>
      <MyApplicationsHeader />
      <ApplicationStatsCards summary={summary} />
      <ApplicationsTableSection applications={applications} />
    </div>
  )
}

export default page