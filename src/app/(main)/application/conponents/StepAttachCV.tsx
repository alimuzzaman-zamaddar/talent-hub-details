"use client";

import { FilesSvg } from "@/Components/Svg/SvgContainer";
import { getCv, useDeleteCvPost } from "@/Hooks/api/dashboard_api";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { FiTrash2 } from "react-icons/fi";

export default function StepAttachCV() {
  const { watch, setValue } = useFormContext();
  const selectedCvId = watch("selectedCvId");

  const { data, isLoading } = getCv();
  const { mutate: deleteCv, isPending: isDeleting } = useDeleteCvPost();

  const cvList = data?.data?.cvs ?? [];
  const hasCvs = cvList.length > 0;

  const handleSelect = (cvId: number) => {
    setValue("selectedCvId", cvId);
    setValue("uploadedCv", null);
  };

  const handleDelete = (e: React.MouseEvent, cvId: number) => {
    e.stopPropagation();
    deleteCv({ endpoint: `/candidate/cv/${cvId}` } as any);
    if (selectedCvId === cvId) setValue("selectedCvId", null);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h2 className="text-lg font-semibold text-center">Add CV</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:w-[60%] mx-auto">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="p-4 border border-[#DFE1E7] rounded-2xl animate-pulse space-y-3"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-gray-200" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">Add CV</h2>

      {hasCvs ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full mx-auto">
          {cvList.map(
            (cv: {
              id: number;
              file_name: string;
              file_path: string;
              file_type: string;
              created_at: string;
            }) => {
              const active = selectedCvId === cv.id;
              const uploadedAt = new Date(cv.created_at).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "short", year: "numeric" },
              );

              return (
                <button
                  key={cv.id}
                  type="button"
                  onClick={() => handleSelect(cv.id)}
                  className={`relative p-4 transition cursor-pointer text-center border
                    ${
                      active
                        ? "border-[#0E2B8B] bg-[#EEF2FF] rounded-2xl"
                        : "border-[#DFE1E7] hover:bg-gray-50 rounded-2xl"
                    }`}
                >
                  {/* Delete button */}
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={e => handleDelete(e, cv.id)}
                    className="absolute top-2 cursor-pointer right-2 flex h-7 w-7 items-center justify-center rounded-lg border border-[#DFE1E7] bg-white text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <span className="h-3 w-3 rounded-full border-2 border-gray-300 border-t-red-400 animate-spin" />
                    ) : (
                      <FiTrash2 size={13} />
                    )}
                  </button>

                  <span className="flex justify-center items-center">
                    <FilesSvg className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-[#0E2B8B]" />
                  </span>
                  <p className="font-medium line-clamp-1 mt-2">
                    {cv.file_name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Uploaded {uploadedAt}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {cv.file_type}
                  </p>

                  {active && (
                    <span className="mt-2 inline-block text-xs font-medium text-[#0E2B8B]">
                      Selected ✓
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-30 border-2 border-dashed border-gray-300 rounded-2xl w-full mx-auto">
          <p className="text-gray-500 text-sm">
            Upload a PDF, Microsoft Word, Pages, RTF, or TXT file, or drag it
            here.
          </p>
          <Link
            href="/dashboard/settings?tab=aeroai"
            className="rounded-lg bg-[#0E2B8B] px-6 py-2 text-sm text-white hover:bg-[#0c2478] transition"
          >
            Select File
          </Link>
        </div>
      )}

      <p className="text-xs text-gray-500">
        You cannot continue without selecting or uploading a CV.
      </p>
    </div>
  );
}
