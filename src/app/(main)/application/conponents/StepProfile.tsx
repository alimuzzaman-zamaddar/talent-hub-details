"use client";

import { useEffect } from "react";
import { XSvg } from "@/Components/Svg/SvgContainer";
import { getApplication } from "@/Hooks/api/dashboard_api";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FiPlusCircle, FiMinusCircle, FiChevronDown } from "react-icons/fi";

export default function StepProfile() {
  const { register, control, setValue, watch } = useFormContext();

  const rawJobId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("applyJobId")
      : null;
  
  const jobId = rawJobId ? Number(rawJobId) : null;
  const { data, isLoading } = getApplication(jobId!);

  const candidate = data?.data?.candidate;
  const suggestSkills = data?.data?.suggest_skill ?? [];
  const countries = data?.data?.countries ?? [];
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: "education" });
  const {
    fields: employmentFields,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({ control, name: "employmentHistory" });
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({ control, name: "languages" });
  const { fields: fileFields, append: appendFile } = useFieldArray({
    control,
    name: "additionalFiles",
  });

  useEffect(() => {
    if (!candidate) return;

    const user = candidate.user;
    const personalInfo = candidate.personal_info;
    const profile = candidate.profile;

    // Profile
    setValue("profile.firstName", user.first_name ?? "");
    setValue("profile.lastName", user.last_name ?? "");
    setValue("profile.email", user.email ?? "");
    setValue("profile.phone", user.phone ?? "");
    setValue("profile.country", personalInfo?.country ?? "");
    setValue("profile.city", personalInfo?.city ?? "");
    setValue("profile.postalCode", personalInfo?.postal_code ?? "");
    setValue("profile.state", personalInfo?.state ?? "");

    // Education
    if (profile?.education?.length) {
      setValue(
        "education",
        profile.education.map((edu: any) => ({
          school: edu.institution ?? "",
          fieldOfStudy: edu.field_of_study ?? "",
          degree: edu.degree ?? "",
          completed: edu.is_completed === "1" ? "true" : "false",
          startMonth: "",
          startYear: "",
          endMonth: "",
          endYear: "",
        })),
      );
    }

    // Employment
    if (profile?.employment?.length) {
      setValue(
        "employmentHistory",
        profile.employment.map((job: any) => ({
          employer: job.employer ?? "",
          jobTitle: job.job_title ?? "",
          currentEmployer: job.is_current === "1" ? "true" : "false",
          startMonth: job.start_month ?? "",
          startYear: job.start_year ?? "",
          endMonth: job.end_month ?? "",
          endYear: job.end_year ?? "",
          description: job.description ?? "",
        })),
      );
    }

    // Skills
    if (profile?.skills?.length) {
      setValue("skills", profile.skills);
    }
  }, [candidate, setValue]);

  const skills = watch("skills") || [];
  const additionalFiles = watch("additionalFiles") || [];

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4 border-b border-gray-200 pb-8">
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-14">
      <section className="border-b border-gray-300 pb-10">
        <h2 className="text-xl font-semibold text-center mb-8">
          Profile Information
        </h2>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <p className="text-xl font-medium text-gray-900">
            Profile Information
          </p>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                {...register("profile.firstName")}
                placeholder="First name"
                className="form-input"
              />
              <input
                {...register("profile.lastName")}
                placeholder="Last name"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                {...register("profile.email")}
                readOnly
                placeholder="Preferred email"
                className="form-input-readonly"
              />
              <input
                {...register("profile.phone")}
                placeholder="Preferred phone number"
                className="form-input"
              />
            </div>

            <div className="h-px w-full bg-[#E5E7EB]" />

            <div className="space-y-6">
              <div className="relative">
                <select
                  {...register("profile.country")}
                  className="form-select w-full appearance-none pr-10"
                >
                  <option value="">Country or region</option>
                  {countries.map((c: { id: number; name: string }) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                />
              </div>

              <input
                {...register("profile.street")}
                placeholder="Street address"
                className="form-input"
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <input
                  {...register("profile.city")}
                  placeholder="City"
                  className="form-input"
                />
                <input
                  {...register("profile.postalCode")}
                  placeholder="Postal code"
                  className="form-input"
                />
              </div>

              <input
                {...register("profile.state")}
                placeholder="State / Province"
                className="form-input"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <p className="text-xl font-medium text-gray-900">Education</p>

          <div className="space-y-10">
            {educationFields.map((field, i) => {
              const completed = watch(`education.${i}.completed`);
              const isNotCompleted = completed === "false";

              return (
                <div key={field.id} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <input
                      {...register(`education.${i}.school`)}
                      placeholder="School"
                      className="form-input"
                    />
                    <input
                      {...register(`education.${i}.fieldOfStudy`)}
                      placeholder="Field of study"
                      className="form-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
                    <div className="relative">
                      <select
                        {...register(`education.${i}.degree`)}
                        className="form-select w-full appearance-none pr-10"
                      >
                        <option value="">Degree</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Master">Master</option>
                        <option value="Diploma">Diploma</option>
                      </select>
                      <FiChevronDown
                        size={18}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <span className="font-medium text-gray-700">
                        Completed
                      </span>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="true"
                          {...register(`education.${i}.completed`)}
                        />{" "}
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="false"
                          {...register(`education.${i}.completed`)}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>

                  {isNotCompleted && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {["start", "end"].map(period => (
                        <div key={period} className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 capitalize">
                            {period} date
                          </p>
                          <div className="flex gap-4">
                            {["Month", "Year"].map(unit => (
                              <div key={unit} className="relative w-full">
                                <select
                                  {...register(
                                    `education.${i}.${period}${unit}`,
                                  )}
                                  className="form-select w-full appearance-none pr-10"
                                >
                                  <option value="">{unit}</option>
                                  {unit === "Month"
                                    ? [
                                        "01",
                                        "02",
                                        "03",
                                        "04",
                                        "05",
                                        "06",
                                        "07",
                                        "08",
                                        "09",
                                        "10",
                                        "11",
                                        "12",
                                      ].map(m => (
                                        <option key={m} value={m}>
                                          {m}
                                        </option>
                                      ))
                                    : Array.from({ length: 40 }, (_, idx) => {
                                        const year =
                                          new Date().getFullYear() - idx;
                                        return (
                                          <option key={year} value={year}>
                                            {year}
                                          </option>
                                        );
                                      })}
                                </select>
                                <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {educationFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(i)}
                      className="flex items-center gap-2 text-sm text-[#0E2B8B]"
                    >
                      <FiMinusCircle /> Remove
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() =>
                appendEducation({
                  school: "",
                  fieldOfStudy: "",
                  degree: "",
                  completed: "true",
                  startMonth: "",
                  startYear: "",
                  endMonth: "",
                  endYear: "",
                })
              }
              className="flex items-center gap-2 text-sm font-medium text-[#0E2B8B]"
            >
              <FiPlusCircle size={18} /> Add education
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-300 pt-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <p className="text-xl font-medium text-gray-900">
            Employment history
          </p>

          <div className="space-y-12">
            {employmentFields.map((field, i) => {
              const isCurrentEmployer =
                watch(`employmentHistory.${i}.currentEmployer`) === "true";

              return (
                <div key={field.id} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <input
                      {...register(`employmentHistory.${i}.employer`)}
                      placeholder="Employer"
                      className="form-input"
                    />
                    <input
                      {...register(`employmentHistory.${i}.jobTitle`)}
                      placeholder="Job title"
                      className="form-input"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <span className="font-medium text-gray-700">
                      Current employer
                    </span>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="true"
                        {...register(`employmentHistory.${i}.currentEmployer`)}
                      />{" "}
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="false"
                        {...register(`employmentHistory.${i}.currentEmployer`)}
                      />{" "}
                      No
                    </label>
                  </div>

                  <textarea
                    {...register(`employmentHistory.${i}.description`)}
                    placeholder="Job description"
                    className="form-textarea form-input h-32"
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Start date — always visible */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Start date
                      </p>
                      <div className="flex gap-4">
                        {["Month", "Year"].map(unit => (
                          <div key={unit} className="relative w-full">
                            <select
                              {...register(
                                `employmentHistory.${i}.start${unit}`,
                              )}
                              className="form-select w-full appearance-none pr-10"
                            >
                              <option value="">{unit}</option>
                              {unit === "Month"
                                ? [
                                    "01",
                                    "02",
                                    "03",
                                    "04",
                                    "05",
                                    "06",
                                    "07",
                                    "08",
                                    "09",
                                    "10",
                                    "11",
                                    "12",
                                  ].map(m => (
                                    <option key={m} value={m}>
                                      {m}
                                    </option>
                                  ))
                                : Array.from({ length: 40 }, (_, idx) => {
                                    const year = new Date().getFullYear() - idx;
                                    return (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    );
                                  })}
                            </select>
                            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isCurrentEmployer && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          End date
                        </p>
                        <div className="flex gap-4">
                          {["Month", "Year"].map(unit => (
                            <div key={unit} className="relative w-full">
                              <select
                                {...register(
                                  `employmentHistory.${i}.end${unit}`,
                                )}
                                className="form-select w-full appearance-none pr-10"
                              >
                                <option value="">{unit}</option>
                                {unit === "Month"
                                  ? [
                                      "01",
                                      "02",
                                      "03",
                                      "04",
                                      "05",
                                      "06",
                                      "07",
                                      "08",
                                      "09",
                                      "10",
                                      "11",
                                      "12",
                                    ].map(m => (
                                      <option key={m} value={m}>
                                        {m}
                                      </option>
                                    ))
                                  : Array.from({ length: 40 }, (_, idx) => {
                                      const year =
                                        new Date().getFullYear() - idx;
                                      return (
                                        <option key={year} value={year}>
                                          {year}
                                        </option>
                                      );
                                    })}
                              </select>
                              <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {employmentFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmployment(i)}
                      className="flex items-center gap-2 text-sm text-[#0E2B8B]"
                    >
                      <FiMinusCircle /> Remove
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={() =>
                appendEmployment({
                  employer: "",
                  jobTitle: "",
                  currentEmployer: "true",
                  startMonth: "",
                  startYear: "",
                  endMonth: "",
                  endYear: "",
                  description: "",
                })
              }
              className="flex items-center gap-2 text-sm font-medium text-[#0E2B8B]"
            >
              <FiPlusCircle size={18} /> Add employment
            </button>
          </div>
        </div>
      </section>

      {/* ================= SKILLS ================= */}
      <section className="border-t border-gray-300 pt-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <p className="text-xl font-medium text-gray-900">Skills</p>

          <div className="space-y-6">
            <div className="relative">
              <select
                className="form-select w-full appearance-none pr-10"
                onChange={e => {
                  const value = e.target.value;
                  if (!value || skills.includes(value)) return;
                  setValue("skills", [...skills, value]);
                  e.target.value = "";
                }}
              >
                <option value="">Select a skill</option>
                {suggestSkills.map((s: { id: number; name: string }) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <FiChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {skills.map((skill: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "skills",
                        skills.filter((_: any, idx: number) => idx !== i),
                      )
                    }
                  >
                    <XSvg />
                  </button>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-300 pt-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <p className="text-xl font-medium text-gray-900">Languages</p>

          <div className="space-y-6">
            {languageFields.map((field, i) => (
              <div key={field.id} className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="relative">
                    <select
                      {...register(`languages.${i}.language`)}
                      className="form-select w-full appearance-none pr-10"
                    >
                      <option value="">Language</option>
                      <option value="English">English</option>
                      <option value="German">German</option>
                      <option value="Bangla">Bangla</option>
                    </select>
                    <FiChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                  </div>

                  <div className="relative">
                    <select
                      {...register(`languages.${i}.proficiency`)}
                      className="form-select w-full appearance-none pr-10"
                    >
                      <option value="">Proficiency</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="native">Native</option>
                    </select>
                    <FiChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-[#0E2B8B]">
                  {languageFields.length > 1 && (
                    <button type="button" onClick={() => removeLanguage(i)}>
                      − Remove
                    </button>
                  )}
                  {i === languageFields.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        appendLanguage({ language: "", proficiency: "" })
                      }
                    >
                      ＋ Add language
                    </button>
                  )}
                </div>
              </div>
            ))}

            {languageFields.length === 0 && (
              <button
                type="button"
                onClick={() =>
                  appendLanguage({ language: "", proficiency: "" })
                }
                className="text-sm text-[#0E2B8B]"
              >
                ＋ Add language
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-300 pt-8">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <p className="text-xl font-medium text-gray-900">Additional files</p>

          <div className="space-y-6">
            <label className="inline-flex items-center gap-2 text-sm text-[#0E2B8B] cursor-pointer">
              ＋ Add files
              <input
                type="file"
                hidden
                onChange={e => {
                  if (!e.target.files?.length) return;
                  appendFile({
                    id: crypto.randomUUID(),
                    name: e.target.files[0].name,
                    uploadedAt: new Date().toLocaleDateString(),
                  });
                  e.target.value = "";
                }}
              />
            </label>

            {additionalFiles.map((file: any) => (
              <div key={file.id} className="text-sm">
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-400">
                  Uploaded {file.uploadedAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
