export default function Stepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {steps.map((label, index) => {
        const step = index + 1;
        const active = step === currentStep;

        return (
          <div
            key={label}
            className="flex items-center gap-3 sm:flex-col sm:gap-2 md:flex-row"
          >
            <div
              className={`
                flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium
                sm:h-8 sm:w-8 sm:text-sm
                ${
                  active
                    ? "bg-[#0E2B8B] text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
            >
              {step}
            </div>

            <span className="text-sm text-gray-700 sm:text-xs md:text-sm">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
