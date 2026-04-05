"use client";

import { useLanguage } from "@/lib/LanguageContext";

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const { t } = useLanguage();
  const steps = [t("step_chooseSpecialty"), t("step_chooseDoctor"), t("step_dateTime")];
  const captions = [t("step_captionSpecialty"), t("step_captionDoctor"), t("step_captionDateTime")];
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="grid grid-cols-3 items-start gap-8 md:gap-10">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={label}
              className="relative flex min-w-0 flex-col items-center text-center"
            >
              {i === 0 ? (
                <div className="absolute right-[calc(50%+1.125rem)] top-4 hidden h-px w-50 bg-gray-400 md:block" />

              ) : null}
              {i < steps.length - 1 ? (
                <div
                  className={`absolute left top-4  h-px w-[calc(100%+13rem)] translate-x-[calc(50%+3rem)] md:block ${
                    isCompleted ? "bg-gray-500" : "bg-gray-400"
                  }`}
                />
              ) : null}

              <div
                className={`relative z-10 flex h-10 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                  isCurrent
                    ? "border-gray-900 bg-gray-900 text-white"
                    : isCompleted
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {isCompleted ? "✓" : stepNum}
              </div>

              <div
                className={`mt-3 text-base font-medium ${isCurrent || isCompleted ? "text-gray-900" : "text-gray-500"}`}
              >
                {label}
              </div>
              <div className="mt-1 text-sm text-gray-400">{captions[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
