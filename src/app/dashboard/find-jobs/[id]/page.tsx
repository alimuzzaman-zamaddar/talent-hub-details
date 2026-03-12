"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useGetJobPublicDetails } from "@/Hooks/api/homepage_api";
import { BookSvg } from "@/Components/Svg/SvgContainer";
import { useState, useEffect } from "react";

const basUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.id as string;
  const router = useRouter();

  const { data, isLoading } = useGetJobPublicDetails(jobId);

  const job = data?.data;
  const company = job?.company;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ESC key close support
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!job) return <div className="p-10">Job not found</div>;

  const handleApplyNow = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("applyJobId", String(jobId));
      router.push("/application");
    }
  };
  function renderContent(content: any) {
    if (!content || content === "<p></p>") return null;

    return (
      <div
        className="text-gray-600 break-words whitespace-normal 
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mt-2 
          [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mt-2 
          [&>p]:mb-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="bg-[#F7F9FC] py-10">
      <div className="px-6">
        {/* ================= HEADER ================= */}
        <div className="bg-[#162C74] text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center flex-col md:flex-row gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
              {company?.logo && (
                <Image
                  src={`${basUrl}${company.logo}`}
                  alt={company?.name}
                  width={70}
                  height={70}
                  className="object-contain"
                />
              )}
            </div>

            <div>
              <h1 className="text-2xl font-semibold">{job.title}</h1>
              <p className="text-white/80 mt-1">{company?.name}</p>
              <p className="text-white/80">{company?.address}</p>
              <p className="text-white/60 text-sm mt-2">
                Posted {job.created_at}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="bg-white text-[#162C74] cursor-pointer flex justify-center items-center px-6 py-2 rounded-lg font-medium hover:opacity-90">
              <BookSvg />
            </button>

            <button
              onClick={handleApplyNow}
              className="bg-white cursor-pointer text-black px-6 py-2 rounded-lg font-medium hover:opacity-90"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10 min-w-0">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8 min-w-0 overflow-hidden">
            <section>
              <h2 className="text-lg font-semibold mb-3">About the Company</h2>
              <div className="break-words whitespace-normal">
                {renderContent(company?.about)}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Job Description</h2>
              <div className="break-words whitespace-normal">
                {renderContent(job.description)}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Qualifications</h2>
              <div className="break-words whitespace-normal">
                {renderContent(job.requirements)}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Benefits</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 break-words">
                {company?.benefits?.map((benefit: any) => (
                  <li key={benefit.id}>{benefit.title}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6 w-full">
            <SidebarCard title="Function / Department" value={job.function} />

            <div className="grid grid-cols-2 gap-6">
              <SidebarCard title="Level" value={job.experienceLevel} />
              <SidebarCard title="Work Type" value={job.work_model} />
              <SidebarCard title="Job Type" value={job.job_type} />
              <SidebarCard title="Contract Type" value={job.contract} />
            </div>

            <SidebarCard title="Job ID" value={job.code} />
          </div>
        </div>

        {/* ================= GALLERY ================= */}
        <section className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {company?.media?.map((media: any) => (
              <div key={media.id} className="rounded-xl overflow-hidden">
                {media.file_type === "image" ? (
                  <img
                    src={`${basUrl}${media.file_path}`}
                    alt="media"
                    onClick={() =>
                      setSelectedImage(`${basUrl}${media.file_path}`)
                    }
                    className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition duration-300"
                  />
                ) : (
                  <video
                    controls
                    src={`${basUrl}${media.file_path}`}
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= FULLSCREEN MODAL ================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl font-bold"
            >
              ×
            </button>

            <img
              src={selectedImage}
              alt="Full View"
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarCard({ title, value }: any) {
  return (
    <div className="border border-gray-300 rounded-2xl py-8 px-6 text-center bg-white">
      <p className="text-gray-500 text-sm mb-2">{title}</p>
      <p className="text-lg font-semibold text-gray-900 capitalize">{value}</p>
    </div>
  );
}
