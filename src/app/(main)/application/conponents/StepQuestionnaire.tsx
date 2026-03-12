"use client";

import { useFormContext } from "react-hook-form";
import { getApplication } from "@/Hooks/api/dashboard_api";

export default function StepQuestionnaire() {
  const { register } = useFormContext();
  const rawJobId =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("applyJobId")
      : null;
  const jobId = rawJobId ? Number(rawJobId) : null;
  const { data, isLoading } = getApplication(jobId!);
  const questions = data?.data?.job?.metadata ?? [];

  if (isLoading) {
    return (
      <div className="space-y-10">
        <h2 className="text-[30px] font-semibold text-center">Questionnaire</h2>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="space-y-3 animate-pulse border-b border-gray-300 pb-8"
            >
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h2 className="text-[30px] font-semibold text-center border-b border-b-gray-300 w-full pb-5">
        Questionnaire
      </h2>

      {questions.map(
        (
          q: {
            id: number;
            question: string;
            question_type: "checkbox" | "radio" | "text" | "dropdown";
            options?: string[];
          },
          index: number,
        ) => (
          <section
            key={q.id}
            className={`space-y-4 pb-8 ${
              index < questions.length - 1 ? "border-b border-gray-300" : ""
            }`}
          >
            <p className="font-semibold text-lg text-gray-900 capitalize">
              {q.question}
            </p>

            {/* ── Checkbox ── */}
            {q.question_type === "checkbox" && q.options && (
              <div className="space-y-2 text-sm text-gray-700">
                {q.options.map((option: string) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 font-medium text-lg capitalize"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      {...register(`questionnaire.${q.id}`)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {/* ── Radio ── */}
            {q.question_type === "radio" && q.options && (
              <div className="space-y-2 text-sm text-gray-700">
                {q.options.map((option: string) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 text-lg"
                  >
                    <input
                      type="radio"
                      value={option}
                      {...register(`questionnaire.${q.id}`)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {/* ── Dropdown ── */}
            {q.question_type === "dropdown" && q.options && (
              <select
                {...register(`questionnaire.${q.id}`)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0E2B8B] text-sm bg-white"
              >
                <option value="">Select an option</option>
                {q.options.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {/* ── Text ── */}
            {q.question_type === "text" && (
              <textarea
                {...register(`questionnaire.${q.id}`)}
                placeholder="Your answer..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#0E2B8B] text-sm"
              />
            )}
          </section>
        ),
      )}

      {questions.length === 0 && (
        <p className="text-center text-sm text-gray-400">
          No questions available.
        </p>
      )}
    </div>
  );
}
