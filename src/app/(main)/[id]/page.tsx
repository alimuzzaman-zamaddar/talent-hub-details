"use client";
import { useParams } from "next/navigation";
import JobDetailsPage from "@/Components/PageComponents/mainPages/JobDetailsPage";
import MediaSection from "@/Components/PageComponents/mainPages/MediaSection";
import { useCareerJobDetails } from "@/Hooks/api/homepage_api";
import Loader from "@/Components/Common/Loader";


export default function Page() {
  const params = useParams();
  const jobId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data, isLoading } = useCareerJobDetails(jobId);

  if (isLoading) return <div><Loader /> </div>;

  const job = data?.data;
  console.log(job,"from job");

  return (
    <div>
      <JobDetailsPage job={job} />
      <MediaSection media={job?.company?.media} />
    </div>
  );
}
