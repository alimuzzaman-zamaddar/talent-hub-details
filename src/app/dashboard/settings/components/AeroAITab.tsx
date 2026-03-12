"use client";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiUploadCloud, FiX } from "react-icons/fi";
import {
  getGeneral,
  useCvPost,
  useDeleteCvPost,
} from "@/Hooks/api/dashboard_api";

const aeroAIData = {
  smartMatching: {
    title: "Smart matching",
    subtitle:
      "Upload your CV to receive smart job recommendations. The more information you provide, the better are the results.",
    inputText: "Drag & Drop your files or",
    browseText: "Browse",
    accept: ".pdf,.doc,.docx",
  },
  skillsBlock: {
    title: "Skills & functions",
    subtitle:
      "Select all skills and departments that reflect your experience or interests. This gives AeroAI a fuller picture of your profile and leads to smarter, more personalised job recommendations.",
  },
};

export default function AeroAITab() {
  const { data } = getGeneral();
  const { mutate: saveAeroAI, isPending } = useCvPost();

  const profile = data?.data?.candidate?.profile;
  const userProfile = profile?.profile;
  const jobFunctions = data?.data?.job_functions;
  const suggestedSkills = data?.data?.suggested_skills;
  const existingCvs = profile?.cvs ?? [];
  const avatarPath = profile?.user?.avatar ?? null;

  const inputRef = useRef<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const { mutate: deleteCv, isPending: isDeleting } = useDeleteCvPost();

  const handleDeleteExistingCv = (cvId: number) => {
    deleteCv({ endpoint: `/candidate/cv/${cvId}` } as any);
  };

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    skills: string;
    functions: string;
    cv: any;
  }>({
    mode: "onChange",
    defaultValues: {
      skills: "",
      functions: "",
      cv: null,
    },
  });

  useEffect(() => {
    if (userProfile) {
      const existingSkills = userProfile.skills ?? [];
      const existingFunctions = userProfile.functions
        ? [userProfile.functions]
        : [];
      setSelectedSkills(existingSkills);
      setSelectedFunctions(existingFunctions);
      reset({
        skills: existingSkills[0] || "",
        functions: existingFunctions[0] || "",
        cv: null,
      });
    }
  }, [userProfile, reset]);

  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    if (selectedSkills.includes(value)) return;
    if (selectedSkills.length >= 20) return;
    const updated = [...selectedSkills, value];
    setSelectedSkills(updated);
    setValue("skills", value, { shouldValidate: true });
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(updated);
    setValue("skills", updated[0] || "", { shouldValidate: true });
  };

  const handleFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    if (selectedFunctions.includes(value)) return;
    if (selectedFunctions.length >= 10) return;
    const updated = [...selectedFunctions, value];
    setSelectedFunctions(updated);
    setValue("functions", value, { shouldValidate: true });
  };

  const handleRemoveFunction = (fn: string) => {
    const updated = selectedFunctions.filter(f => f !== fn);
    setSelectedFunctions(updated);
    setValue("functions", updated[0] || "", { shouldValidate: true });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadedFile(file);
    setValue("cv", file, { shouldValidate: true });
  };

  const handleBrowseClick = () => inputRef.current?.click();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length > 0) handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setValue("cv", null, { shouldValidate: true });
  };

  const onSubmit = () => {
    const payload = new FormData();
    if (uploadedFile) payload.append("cv", uploadedFile);
    selectedSkills.forEach(skill => payload.append("skills[]", skill));
    selectedFunctions.forEach(fn => payload.append("functions[]", fn));
    saveAeroAI(payload as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-10">
        {/* ── Smart Matching ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-[#DFE1E7] pb-10">
          <div>
            <h3 className="text-lg font-semibold text-[#0E2B8B]">
              {aeroAIData.smartMatching.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm leading-relaxed">
              {aeroAIData.smartMatching.subtitle}
            </p>
            {avatarPath && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">Current Avatar</p>
                <img
                  src={avatarPath}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover border border-[#DFE1E7]"
                />
              </div>
            )}
          </div>

          <div>
            {existingCvs.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Previously Uploaded CVs
                </p>
                {existingCvs.map((cv: any, i: number) => (
                  <div
                    key={cv.id ?? i}
                    className="flex items-center justify-between rounded-xl border border-[#DFE1E7] bg-[#F8FAFC] px-4 py-3"
                  >
                    <p className="text-sm text-gray-700 truncate">
                      {cv.name || cv.file_name || `CV ${i + 1}`}
                    </p>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDeleteExistingCv(cv.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFE1E7] text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition cursor-pointer disabled:opacity-50"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="w-full rounded-2xl border border-[#DFE1E7] bg-white px-6 py-10 text-center"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F6FB]">
                  <FiUploadCloud className="text-[#0E2B8B]" size={22} />
                </div>
                <p className="text-sm text-gray-500">
                  {aeroAIData.smartMatching.inputText}{" "}
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="text-[#0E2B8B] font-medium cursor-pointer hover:underline"
                  >
                    {aeroAIData.smartMatching.browseText}
                  </button>
                </p>
                <p className="text-xs text-gray-400">
                  Accepted: {aeroAIData.smartMatching.accept}
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept={aeroAIData.smartMatching.accept}
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
              <input
                type="hidden"
                {...register("cv", {
                  validate: () =>
                    !!uploadedFile || existingCvs.length > 0
                      ? true
                      : "Please upload a CV",
                })}
              />
              {errors.cv && (
                <p className="mt-4 text-xs text-red-500">
                  {errors.cv.message as any}
                </p>
              )}
            </div>

            {uploadedFile && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Uploaded File
                </p>
                <div className="flex items-center justify-between rounded-xl border border-[#DFE1E7] bg-white px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB •{" "}
                      {uploadedFile.type}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DFE1E7] text-gray-500 hover:bg-gray-50 cursor-pointer"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Skills & Functions ── */}
        <div className="grid grid-cols-1 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-[#0E2B8B]">
              {aeroAIData.skillsBlock.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-md">
              {aeroAIData.skillsBlock.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
            {/* Skills */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Skills / Keywords <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 relative">
                <select
                  className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#0E2B8B] ${
                    errors.skills ? "border-red-400" : "border-[#DFE1E7]"
                  }`}
                  onChange={handleSkillChange}
                  value=""
                >
                  <option value="">Choose up to 20 skills / keywords</option>
                  {suggestedSkills?.map((s: { id: number; name: string }) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.skills && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.skills.message as any}
                </p>
              )}
              {selectedSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map(skill => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-[#EEF1FB] px-3 py-1 text-xs font-medium text-[#0E2B8B]"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Functions */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Functions / Departments
              </label>
              <div className="mt-2 relative">
                <select
                  className={`w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none focus:border-[#0E2B8B] ${
                    errors.functions ? "border-red-400" : "border-[#DFE1E7]"
                  }`}
                  onChange={handleFunctionChange}
                  value=""
                >
                  <option value="">
                    Choose up to 10 functions / departments
                  </option>
                  {jobFunctions?.map((fn: { id: number; name: string }) => (
                    <option key={fn.id} value={fn.name}>
                      {fn.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {selectedFunctions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedFunctions.map(fn => (
                    <span
                      key={fn}
                      className="flex items-center gap-1 rounded-full bg-[#EEF1FB] px-3 py-1 text-xs font-medium text-[#0E2B8B]"
                    >
                      {fn}
                      <button
                        type="button"
                        onClick={() => handleRemoveFunction(fn)}
                        className="hover:text-red-500"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#DFE1E7]">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-[#0E2B8B] text-white text-sm font-medium
                       hover:bg-[#0a2070] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
