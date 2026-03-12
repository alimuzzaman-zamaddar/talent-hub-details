"use client";

import { TiStarOutline } from "react-icons/ti";
import { getApplicationPreview } from "@/Hooks/api/dashboard_api";

export default function StepReview({ appId }: { appId: number | null }) {
  const { data, isLoading } = getApplicationPreview(appId as number);
  const d = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
        {[1, 2, 3].map(i => (
          <div key={i} className="border-t border-gray-300 pt-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const user = d?.candidate_profile?.user;
  const personalInfo = d?.candidate_profile?.personal_info;
  const education = d?.education ?? [];
  const employment = d?.employment ?? [];
  const skills = d?.skills ?? [];
  const languages = d?.languages ?? [];
  const questionnaire = d?.questionnaire_data ?? [];
  const cv = d?.cv;

  return (
    <div className="space-y-12 text-sm">
      <h2 className="text-xl font-semibold text-center">
        Review your application
      </h2>

      <section className="border-t border-gray-300 pt-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-10">
          <p className="text-xl font-medium text-gray-900">
            Profile Information
          </p>

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-xs text-gray-500 mb-1">First name</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Last name</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.last_name || "—"}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="text-xs text-gray-500 mb-1">Preferred email</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Preferred phone number
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.phone || "—"}
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="">
                  <p className="text-xs text-gray-500 mb-1">
                    Country or region
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {personalInfo?.country || "—"}
                  </p>
                </div>
                <div className="">
                  <p className="text-xs text-gray-500 mb-1">Street address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {personalInfo?.state}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <p className="text-xs text-gray-500 mb-1">City</p>
                  <p className="text-sm font-medium text-gray-900">
                    {personalInfo?.city || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Postal code</p>
                  <p className="text-sm font-medium text-gray-900">
                    {personalInfo?.postal_code || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {cv && (
        <section className="border-t border-gray-300 pt-8">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <p className="text-xl font-medium text-gray-900">CV</p>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {cv.file_name}
              </p>
              <p className="text-xs text-gray-500">Uploaded {cv.created_at}</p>
            </div>
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="border-t border-gray-300 pt-8">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <p className="text-xl font-medium text-gray-900">Education</p>
            <div className="space-y-10">
              {education.map((edu: any, i: number) => (
                <div key={i} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">School</p>
                      <p className="text-sm font-medium text-gray-900">
                        {edu.institution || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Field of study
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {edu.field_of_study || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Degree</p>
                      <p className="text-sm font-medium text-gray-900">
                        {edu.degree || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Completed</p>
                      <p className="text-sm font-medium text-gray-900">
                        {edu.is_completed === "1" ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  {i < education.length - 1 && (
                    <div className="h-px w-full bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {employment.length > 0 && (
        <section className="border-t border-gray-300 pt-8">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <p className="text-xl font-medium text-gray-900">
              Employment history
            </p>
            <div className="space-y-10">
              {employment.map((job: any, i: number) => (
                <div key={i} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Employer</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job.employer || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Job title</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job.job_title || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Start date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job.start_month && job.start_year
                          ? `${job.start_month}/${job.start_year}`
                          : "—"}
                      </p>
                    </div>
                    {job.is_current !== "1" && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">End date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {job.end_month && job.end_year
                            ? `${job.end_month}/${job.end_year}`
                            : "—"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Current employer
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {job.is_current === "1" ? "Yes" : "No"}
                    </p>
                  </div>

                  {job.description && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Job description
                      </p>
                      <p className="text-sm font-medium text-gray-900 whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>
                  )}

                  {i < employment.length - 1 && (
                    <div className="h-px w-full bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="border-t border-gray-300 pt-8">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <p className="text-xl font-medium text-gray-900">Skills</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-6">
              {skills.map((skill: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-900"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0E2B8B] text-[#0E2B8B] text-base">
                    <TiStarOutline />
                  </span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="border-t border-gray-300 pt-8">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <p className="text-xl font-medium text-gray-900">Languages</p>
            <div className="space-y-6">
              {languages.map((lang: any, i: number) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-10 border-b border-gray-300 pb-6 last:border-0"
                >
                  <div>
                    <p className="text-xs text-gray-500">Language</p>
                    <p className="text-sm text-gray-900">
                      {lang.language || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Proficiency</p>
                    <p className="text-sm text-gray-900 capitalize">
                      {lang.proficiency || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {questionnaire.length > 0 && (
        <section className="border-t border-gray-300 pt-8">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10">
            <p className="text-xl font-medium text-gray-900">Questionnaire</p>
            <div className="space-y-8">
              {questionnaire.map((q: any, i: number) => (
                <div
                  key={q.id}
                  className={`space-y-2 ${i < questionnaire.length - 1 ? "border-b border-gray-300 pb-6" : ""}`}
                >
                  <p className="text-sm font-medium text-gray-900">
                    {q.question}
                  </p>

                  {q.question_type === "checkbox" && q.answer?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {q.answer.map((ans: string) => (
                        <span
                          key={ans}
                          className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-[#0E2B8B]"
                        >
                          {ans}
                        </span>
                      ))}
                    </div>
                  )}

                  {q.question_type === "text" && (
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {q.answer || "—"}
                    </p>
                  )}

                  {q.question_type === "radio" && (
                    <p className="text-sm text-gray-600">{q.answer || "—"}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
