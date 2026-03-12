"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import StepReview from "./conponents/StepReview";
import StepProfile from "./conponents/StepProfile";
import StepAttachCV from "./conponents/StepAttachCV";
import { useForm, FormProvider } from "react-hook-form";
import StepQuestionnaire from "./conponents/StepQuestionnaire";
import {
  useSubmitApplication,
  useSaveDraft,
  getApplication,
} from "@/Hooks/api/dashboard_api";
import { Congrats } from "@/Components/Svg/SvgContainer";

const basUrl = process.env.NEXT_PUBLIC_BASE_URL;

const steps = [
  { id: 1, label: "Attach CV" },
  { id: 2, label: "Profile information" },
  { id: 3, label: "Questionnaire" },
  { id: 4, label: "Application Details" },
];

// Clamp last_stage to a valid step (1–4). The API returns the stage where
// the user left off, so we resume from that step directly.
const resolveInitialStep = (lastStage: number | null): number => {
  if (!lastStage) return 1;
  if (lastStage < 1) return 1;
  if (lastStage > 4) return 4;
  return lastStage;
};

export default function ApplicationPage() {
  const rawJobId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("applyJobId")
      : null;

  // ── Draft resume: read stage + applicationId saved by DraftApplications ──
  const rawDraftStage =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("draftLastStage")
      : null;
  const rawDraftAppId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("draftApplicationId")
      : null;

  const jobId = rawJobId ? Number(rawJobId) : null;
  const initialStep = resolveInitialStep(
    rawDraftStage ? Number(rawDraftStage) : null,
  );
  const initialAppId = rawDraftAppId ? Number(rawDraftAppId) : null;

  const [step, setStep] = useState(initialStep);
  const [applicationId, setApplicationId] = useState<number | null>(
    initialAppId,
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAppCode, setSubmittedAppCode] = useState<string>("");

  const triggerSource = useRef<"continue" | "draft" | null>(null);

  const { data } = getApplication(jobId!);
  const { mutate: submitApplication, isPending: isSubmitting } =
    useSubmitApplication();
  const { mutate: saveDraftApi, isPending: isSavingDraft } = useSaveDraft({
    onSuccess: (response: any) => {
      if (response.success) {
        if (response.data?.id) {
          setApplicationId(response.data.id);
          // Keep draftApplicationId in sync so page refreshes still work
          sessionStorage.setItem(
            "draftApplicationId",
            String(response.data.id),
          );
        }
        if (triggerSource.current === "continue" && step === 3) {
          setStep(4);
        }
        triggerSource.current = null;
      }
    },
  });

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      selectedCvId: null,
      uploadedCv: null,
      profile: {},
      questionnaire: {},
    },
  });

  const { handleSubmit, getValues } = methods;

  // ── Company / job info ───────────────────────────────────────────────────
  const companyInfo = data?.data?.company_info;
  const companyName = companyInfo?.name ?? "";
  const companyLogo = companyInfo?.logo ? `${basUrl}${companyInfo.logo}` : null;
  const companyBanner = companyInfo?.banner
    ? `${basUrl}${companyInfo.banner}`
    : null;
  const generatedShortName = companyName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const jobTitle = data?.data?.job?.title ?? "";

  // ── Payload builder ──────────────────────────────────────────────────────
  const buildPayload = (data: any, currentStep: number, appId: any) => {
    const payload = new FormData();

    if (appId) payload.append("application_id", String(appId));
    if (data.selectedCvId) payload.append("cv_id", String(data.selectedCvId));

    if (data.profile) {
      const p = data.profile;
      payload.append("profile_data[phone]", p.phone ?? "");
      payload.append("profile_data[country]", p.country ?? "");
      payload.append("profile_data[city]", p.city ?? "");
      payload.append("profile_data[postal_code]", p.postalCode ?? "");
      payload.append("profile_data[state]", p.state ?? "");
    }

    (data.education ?? []).forEach((edu: any, i: number) => {
      const isCompleted = edu.completed === "true" || edu.completed === true;
      payload.append(`education[${i}][institution]`, edu.school ?? "");
      payload.append(`education[${i}][field_of_study]`, edu.fieldOfStudy ?? "");
      payload.append(`education[${i}][degree]`, edu.degree ?? "");
      payload.append(`education[${i}][is_completed]`, isCompleted ? "1" : "0");
      if (edu.startMonth)
        payload.append(
          `education[${i}][start_month]`,
          String(parseInt(edu.startMonth)),
        );
      if (edu.startYear)
        payload.append(
          `education[${i}][start_year]`,
          String(parseInt(edu.startYear)),
        );
      if (!isCompleted) {
        if (edu.endMonth)
          payload.append(
            `education[${i}][end_month]`,
            String(parseInt(edu.endMonth)),
          );
        if (edu.endYear)
          payload.append(
            `education[${i}][end_year]`,
            String(parseInt(edu.endYear)),
          );
      }
    });

    (data.employmentHistory ?? []).forEach((job: any, i: number) => {
      const isCurrent =
        job.currentEmployer === "true" || job.currentEmployer === true;
      payload.append(`employment[${i}][employer]`, job.employer ?? "");
      payload.append(`employment[${i}][job_title]`, job.jobTitle ?? "");
      payload.append(`employment[${i}][description]`, job.description ?? "");
      payload.append(`employment[${i}][is_current]`, isCurrent ? "1" : "0");
      if (job.startMonth)
        payload.append(
          `employment[${i}][start_month]`,
          String(parseInt(job.startMonth)),
        );
      if (job.startYear)
        payload.append(
          `employment[${i}][start_year]`,
          String(parseInt(job.startYear)),
        );
      if (!isCurrent) {
        if (job.endMonth)
          payload.append(
            `employment[${i}][end_month]`,
            String(parseInt(job.endMonth)),
          );
        if (job.endYear)
          payload.append(
            `employment[${i}][end_year]`,
            String(parseInt(job.endYear)),
          );
      }
    });

    (data.skills ?? []).forEach((skill: string) =>
      payload.append("skills[]", skill),
    );

    (data.languages ?? []).forEach((lang: any, i: number) => {
      payload.append(`languages[${i}][language]`, lang.language ?? "");
      payload.append(
        `languages[${i}][proficiency]`,
        (lang.proficiency ?? "").toLowerCase().trim(),
      );
    });

    Object.entries(data.questionnaire ?? {}).forEach(
      ([questionId, answer], i) => {
        payload.append(`questionnaire_data[${i}][id]`, questionId);
        if (Array.isArray(answer)) {
          if (answer.length > 0) {
            answer.forEach((val: string) =>
              payload.append(`questionnaire_data[${i}][answer][]`, val),
            );
          } else {
            payload.append(`questionnaire_data[${i}][answer][]`, "");
          }
        } else {
          payload.append(
            `questionnaire_data[${i}][answer]`,
            (answer as string) ?? "",
          );
        }
      },
    );

    (data.additionalFiles ?? []).forEach((file: any) => {
      if (file instanceof File) payload.append("media[]", file);
    });

    payload.append("last_stage", String(currentStep));
    return payload;
  };

  // ── Step actions ─────────────────────────────────────────────────────────
  const handleContinue = () => {
    if (step === 3) {
      if (!jobId) return;
      triggerSource.current = "continue";
      const payload = buildPayload(getValues(), step, applicationId);
      saveDraftApi({
        endpoint: `/candidate/applications/${jobId}`,
        data: payload,
      } as any);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleSaveDraft = () => {
    if (!jobId) return;
    triggerSource.current = "draft";
    const payload = buildPayload(getValues(), step, applicationId);
    saveDraftApi({
      endpoint: `/candidate/applications/${jobId}`,
      data: payload,
    } as any);
  };

  const onSubmit = (data: any) => {
    if (!jobId) return;
    const payload = buildPayload(data, 4, applicationId);
    submitApplication(
      {
        endpoint: `/candidate/application/submit/${applicationId}`,
        data: payload,
      } as any,
      {
        onSuccess: (response: any) => {
          if (response.success) {
            // Clear draft session keys on successful submit
            sessionStorage.removeItem("draftApplicationId");
            sessionStorage.removeItem("draftLastStage");

            const appCode =
              response.data?.application_code ??
              response.data?.code ??
              generateAppCode(applicationId);
            setSubmittedAppCode(appCode);
            setIsSubmitted(true);
          }
        },
      },
    );
  };

  const generateAppCode = (id: number | null) => {
    if (!id) return "XXXXXXXX";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    let seed = id;
    for (let i = 0; i < 8; i++) {
      code += chars[seed % chars.length];
      seed = Math.floor(seed / chars.length) + 7;
    }
    return code;
  };

  // ── Shared banner + logo markup ──────────────────────────────────────────
  const BannerSection = () => (
    <section className="mx-auto mt-6 max-w-275 px-4 xl:px-0">
      <div className="relative h-48 sm:h-64 lg:h-70 w-full overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-100">
        {companyBanner ? (
          <Image
            src={companyBanner}
            alt={companyName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#0E2B8B] to-[#162C74]" />
        )}
      </div>
      <div className="relative px-4 sm:px-6 pb-16">
        <div className="absolute -top-16 sm:-top-20 left-4 sm:left-12 h-28 w-28 sm:h-36 sm:w-36 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={companyName}
              fill
              className="object-contain p-2"
            />
          ) : (
            <span className="text-lg sm:text-xl font-bold text-white bg-orange-400 w-full h-full flex items-center justify-center">
              {generatedShortName}
            </span>
          )}
        </div>
      </div>
    </section>
  );

  // ── Confirmation page ────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <>
        <BannerSection />
        <div className="mx-auto max-w-225 px-4 sm:px-6 py-16">
          {jobTitle && (
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-8">
              {jobTitle}
            </h2>
          )}
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="mb-6 flex items-center justify-center">
              <Congrats />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Congratulations!
            </h3>
            <p className="text-lg font-semibold text-gray-800 mb-3">
              Your application is submitted!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Application ID:{" "}
              <span className="font-medium text-gray-700">
                {submittedAppCode}
              </span>
            </p>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              You can track every update anytime in My Applications.
              <br />
              The Employer will review your profile and keep you informed about
              the next steps.
            </p>
            <div className="mt-10 flex justify-between w-full">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="rounded-lg bg-[#0E2B8B] px-20 py-2.5 text-sm font-medium text-white hover:opacity-90 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard/applications";
                }}
                className="rounded-lg bg-[#0E2B8B] px-20 py-2.5 text-sm font-medium text-white hover:opacity-90 transition cursor-pointer"
              >
                My Applications
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <>
      <BannerSection />

      <div className="mx-auto max-w-225 px-4 sm:px-6 py-16">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEPPER */}
            <div className="mb-10 overflow-x-auto">
              <div className="flex xl:min-w-150 items-center justify-between">
                {steps.map((item, index) => {
                  const isActive = step === item.id;
                  const isCompleted = step > item.id;
                  return (
                    <div key={item.id} className="flex w-full items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            isActive || isCompleted
                              ? "bg-[#0E2B8B] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {item.id}
                        </div>
                        <span
                          className={`text-sm whitespace-nowrap ${
                            isActive
                              ? "text-[#0E2B8B] font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {index !== steps.length - 1 && (
                        <div className="mx-4 flex-1 h-px bg-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 h-px w-full bg-gray-200" />
            </div>

            {step === 1 && <StepAttachCV />}
            {step === 2 && <StepProfile />}
            {step === 3 && <StepQuestionnaire />}
            {step === 4 && <StepReview appId={applicationId} />}

            {/* ACTION BUTTONS */}
            <div className="mt-12 flex flex-col gap-4 border-t border-gray-300 pt-6 sm:flex-row sm:gap-6">
              <button
                type="button"
                onClick={() => step > 1 && setStep(step - 1)}
                className="w-full rounded-lg bg-[#0E2B8B] px-6 py-2 text-white disabled:opacity-50 cursor-pointer"
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSavingDraft && triggerSource.current === "draft"}
                className="w-full rounded-lg bg-[#0E2B8B] px-6 py-2 text-white disabled:opacity-50 cursor-pointer"
              >
                {isSavingDraft && triggerSource.current === "draft"
                  ? "Saving..."
                  : "Save as draft"}
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={
                    (step === 1 && !methods.watch("selectedCvId")) ||
                    (isSavingDraft && triggerSource.current === "continue")
                  }
                  className={`w-full rounded-lg px-6 py-2 text-white transition ${
                    (step === 1 && !methods.watch("selectedCvId")) ||
                    (isSavingDraft && triggerSource.current === "continue")
                      ? "bg-[#DCE0F2] cursor-not-allowed"
                      : "bg-[#0E2B8B] hover:opacity-90 cursor-pointer"
                  }`}
                >
                  {isSavingDraft && triggerSource.current === "continue"
                    ? "Saving..."
                    : "Continue"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-lg px-6 py-2 text-white transition ${
                    isSubmitting
                      ? "bg-[#DCE0F2] cursor-not-allowed"
                      : "bg-[#0E2B8B] hover:opacity-90 cursor-pointer"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
